import { prisma } from '../../src/data';

export const createTestStaff = async () => {
  return await prisma.staff.create({
    data: {
      name: 'Test Staff',
      role: 'barber',
      headshot: 'test-headshot.png',
      description: 'A test staff member',
    },
  });
};
