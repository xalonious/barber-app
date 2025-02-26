import { prisma } from '../data';
import ServiceError from '../core/ServiceError';
import { getLogger } from '../core/logging';

const storeHours = {
  maandag: { opening: 9, closing: 17 }, 
  dinsdag: { opening: 9, closing: 17 }, 
  woensdag: { opening: 9, closing: 17 }, 
  donderdag: { opening: 9, closing: 17 }, 
  vrijdag: { opening: 9, closing: 17 }, 
  zaterdag: { opening: 9, closing: 13 }, 
  zondag: null, 
};

const isStoreOpen = (date: Date): boolean => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour12: false, timeZone: 'Europe/Brussels' };
  const formatter = new Intl.DateTimeFormat('nl-BE', options);
  const day = formatter.formatToParts(date).find((part) => part.type === 'weekday')?.value.toLowerCase() as keyof typeof storeHours;


  if (!day || !storeHours[day]) {
    return false; 
  }

  const hours = storeHours[day];

  const localHour = new Intl.DateTimeFormat('nl-BE', { hour: 'numeric', minute: 'numeric', timeZone: 'Europe/Brussels' })
    .formatToParts(date)
    .reduce((acc, part) => {
      if (part.type === 'hour') acc.hour = parseInt(part.value, 10);
      if (part.type === 'minute') acc.minute = parseInt(part.value, 10);
      return acc;
    }, { hour: 0, minute: 0 });

  const time = localHour.hour + localHour.minute / 60; 

  return time >= hours.opening && time < hours.closing;
};

export const getAppointmentsByCustomerId = async (customerId: number, authenticatedCustomerId: number) => {
  if (customerId !== authenticatedCustomerId) {
    throw ServiceError.forbidden('You do not have permission to view these appointments.');
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: { customerId },
      include: {
        customer: { select: { name: true } },
        staff: { select: { name: true, role: true, headshot: true } },
        service: { select: { name: true } },
      },
    });
    return appointments;
  } catch (error) {
    getLogger().error('Error retrieving appointments:', error);
    throw ServiceError.internalServerError('Error retrieving appointments');
  }
};

export const createAppointment = async (appointmentData: any) => {
  const startTime = new Date(appointmentData.date);

  if (!isStoreOpen(startTime)) {
    throw ServiceError.unprocessableEntity('The store is closed during the selected time.');
  }

  const staff = await prisma.staff.findUnique({
    where: { staffId: appointmentData.staffId },
  });

  if (!staff) {
    throw ServiceError.validationFailed('Staff member does not exist.');
  }

  if (startTime.getMinutes() % 15 !== 0) {
    throw ServiceError.validationFailed('Appointments must be scheduled in 15-minute intervals.');
  }

  const now = new Date();
  if (startTime < now) {
    throw ServiceError.validationFailed('Appointment date cannot be in the past.');
  }

  const service = await prisma.service.findUnique({
    where: { name: appointmentData.service },
  });

  if (!service) {
    throw ServiceError.notFound('Service not found.');
  }

  const endTime = new Date(startTime.getTime() + service.duration * 60 * 1000);
  const conflicts = await prisma.appointment.findFirst({
    where: {
      staffId: appointmentData.staffId,
      OR: [
        { date: { lt: endTime }, AND: { date: { gte: startTime } } },
        { date: { lte: startTime }, AND: { date: { gt: startTime } } },
      ],
    },
  });

  if (conflicts) {
    throw ServiceError.conflict('This staff member is not available during the selected time.');
  }

  const appointment = await prisma.appointment.create({
    data: {
      customer: { connect: { customerId: appointmentData.customerId } },
      staff: { connect: { staffId: appointmentData.staffId } },
      service: { connect: { serviceId: service.serviceId } },
      date: startTime,
    },
    include: {
      service: { select: { name: true } },
    },
  });

  return {
    appointmentId: appointment.appointmentId,
    customerId: appointment.customerId,
    service: appointment.service.name,
    date: appointment.date,
    staffId: appointment.staffId,
  };
};

export const updateAppointmentById = async (
  appointmentId: number,
  updateData: { date?: string | Date; staffId?: number; service?: string; customerId?: number }
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { appointmentId },
    include: { service: true, staff: true },
  });

  if (!appointment) {
    throw ServiceError.notFound(`No appointment found with ID ${appointmentId}`);
  }

  if (appointment.customerId !== updateData.customerId) {
    throw ServiceError.forbidden('You do not have permission to update this appointment.');
  }

  let startTime = appointment.date;

  if (updateData.date) {
    startTime = new Date(updateData.date);

    if (startTime.getMinutes() % 15 !== 0) {
      throw ServiceError.validationFailed('Appointments must be scheduled in 15-minute intervals.');
    }

    if (!isStoreOpen(startTime)) {
      throw ServiceError.unprocessableEntity('The store is closed during the selected time.');
    }
  }

  const service = updateData.service
    ? await prisma.service.findUnique({ where: { name: updateData.service } })
    : appointment.service;

  if (!service) {
    throw ServiceError.notFound('Service not found.');
  }

  const duration = service.duration;
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

  const conflicts = await prisma.appointment.findFirst({
    where: {
      staffId: updateData.staffId || appointment.staffId,
      NOT: { appointmentId },
      OR: [
        { date: { lt: endTime }, AND: { date: { gte: startTime } } },
        { date: { lte: startTime }, AND: { date: { gt: startTime } } },
      ],
    },
  });

  if (conflicts) {
    throw ServiceError.conflict('This staff member is not available during the selected time.');
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { appointmentId },
    data: {
      date: startTime,
      staff: updateData.staffId ? { connect: { staffId: updateData.staffId } } : undefined,
      service: updateData.service ? { connect: { name: updateData.service } } : undefined,
    },
    include: { service: true, staff: true },
  });

  return {
    appointmentId: updatedAppointment.appointmentId,
    customerId: updatedAppointment.customerId,
    service: updatedAppointment.service.name,
    date: updatedAppointment.date,
    staffId: updatedAppointment.staffId,
  };
};

export const deleteAppointmentById = async (appointmentId: number, authenticatedCustomerId: number) => {
  const appointment = await prisma.appointment.findUnique({
    where: { appointmentId },
  });

  if (!appointment) {
    throw ServiceError.notFound(`No appointment found with ID ${appointmentId}`);
  }

  if (appointment.customerId !== authenticatedCustomerId) {
    throw ServiceError.forbidden('You do not have permission to delete this appointment.');
  }

  try {
    return await prisma.appointment.delete({
      where: { appointmentId },
    });
  } catch (error: any) {
    getLogger().error('Error deleting appointment:', error);
    throw ServiceError.internalServerError('Error deleting appointment');
  }
};
