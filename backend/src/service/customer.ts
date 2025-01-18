import { prisma } from '../data';
import { hashPassword, verifyPassword } from '../core/password';
import { generateJWT } from '../core/jwt';
import ServiceError from '../core/ServiceError';

export const registerCustomer = async (name: string, email: string, password: string): Promise<void> => {
  const existingCustomer = await prisma.customer.findUnique({ where: { email } });

  if (existingCustomer) {
    throw ServiceError.conflict('A customer with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  await prisma.customer.create({
    data: { name, email, passwordHash },
  });
};

export const loginCustomer = async (
  email: string,
  password: string
): Promise<{ token: string; id: number; email: string; name: string }> => {
  const customer = await prisma.customer.findUnique({ where: { email } });

  if (!customer) {
    throw ServiceError.unauthorized('Invalid email or password');
  }

  const isValid = await verifyPassword(password, customer.passwordHash);

  if (!isValid) {
    throw ServiceError.unauthorized('Invalid email or password');
  }

  const token = await generateJWT(customer);

  return {
    token,
    id: customer.customerId,
    email: customer.email,
    name: customer.name, 
  };
};

