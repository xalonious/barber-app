import { prisma } from '../data';
import ServiceError from '../core/ServiceError';
import { getLogger } from '../core/logging';

export const getAllStaff = async () => {
  try {
    const staff = await prisma.staff.findMany({
      select: {
        staffId: true,
        name: true,
        role: true,
        headshot: true,
        description: true,
      },
    });
    return staff;
  } catch (error) {
    getLogger().error('Error retrieving staff members:', error);
    throw ServiceError.internalServerError('Error retrieving staff members');
  }
};

export const getStaffAvailability = async (staffId: number, date: string, serviceId: number) => {
  const startDate = new Date(date);
  const dayOfWeek = startDate.getDay();

  let openingHour = 9;
  let closingHour = 17;

  if (dayOfWeek === 6) {
    closingHour = 13;
  } else if (dayOfWeek === 0) {
    throw ServiceError.unprocessableEntity('The store is closed on Sundays.');
  }

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);

  const staff = await prisma.staff.findUnique({
    where: { staffId },
  });

  if (!staff) {
    throw ServiceError.notFound(`Staff member with ID ${staffId} not found.`);
  }

  const service = await prisma.service.findUnique({
    where: { serviceId },
  });

  if (!service) {
    throw ServiceError.notFound(`Service with ID ${serviceId} not found.`);
  }

  const { duration } = service;

  const appointments = await prisma.appointment.findMany({
    where: {
      staffId,
      date: { gte: startDate, lt: endDate },
    },
    include: {
      service: { select: { duration: true } },
    },
  });

  const intervals = 15; 
  const availableSlots: string[] = [];

  const timeZone = 'Europe/Brussels';

  let currentTime = new Date(startDate);
  currentTime = new Date(
    new Intl.DateTimeFormat('nl-BE', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
      .formatToParts(currentTime)
      .reduce((date, part) => {
        if (part.type === 'hour') date.setHours(parseInt(part.value));
        if (part.type === 'minute') date.setMinutes(parseInt(part.value));
        if (part.type === 'second') date.setSeconds(parseInt(part.value));
        return date;
      }, currentTime)
  );
  currentTime.setHours(openingHour, 0, 0, 0);

  const closingTime = new Date(startDate);
  closingTime.setHours(closingHour, 0, 0, 0);

  while (currentTime < closingTime) {
    const potentialStart = currentTime.getTime();
    const potentialEnd = potentialStart + duration * 60 * 1000; 

    const isConflict = appointments.some((appointment) => {
      const appointmentStart = new Date(appointment.date).getTime();
      const appointmentEnd = appointmentStart + appointment.service.duration * 60 * 1000;

      return (
        (potentialStart >= appointmentStart && potentialStart < appointmentEnd) || 
        (potentialEnd > appointmentStart && potentialEnd <= appointmentEnd) || 
        (potentialStart <= appointmentStart && potentialEnd >= appointmentEnd)
      );
    });

    if (!isConflict) {
      availableSlots.push(
        new Intl.DateTimeFormat('nl-BE', {
          timeZone: 'Europe/Brussels',
          hour: '2-digit',
          minute: '2-digit',
        }).format(currentTime)
      );
    }

    currentTime = new Date(currentTime.getTime() + intervals * 60 * 1000); 
  }

  return availableSlots;
};
