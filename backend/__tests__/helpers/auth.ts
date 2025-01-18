import { prisma } from '../../src/data';
import { generateJWT } from '../../src/core/jwt';

export const createTestCustomerAndToken = async () => {
  const testCustomer = await prisma.customer.create({
    data: {
      name: 'Test Customer',
      email: `test${Date.now()}@example.com`,
      passwordHash: 'hashedPassword', 
    },
  });

  const token = await generateJWT(testCustomer);
  return { testCustomer, token };
};
