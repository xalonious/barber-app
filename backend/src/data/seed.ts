import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { getLogger } from '../core/logging';
import process from 'process';

async function main() {
  await prisma.customer.createMany({
    data: [
      { name: 'John Doe', email: 'johndoe@example.com', passwordHash: '$argon2id$v=19$m=131072,t=6,p=4$mv3KVBEig5BCPLOEBsidcQ$lFx5NOshBvSwui9FiX7mIhXbZOWlOCm9uld6KqkBm4U' },
      { name: 'Jane Doe', email: 'janedoe@example.com', passwordHash: '$argon2id$v=19$m=131072,t=6,p=4$mv3KVBEig5BCPLOEBsidcQ$lFx5NOshBvSwui9FiX7mIhXbZOWlOCm9uld6KqkBm4U' },
    ],
  });

  await prisma.staff.createMany({
    data: [
      {
        name: 'Max van Dijk',
        role: 'Eigenaar en Hoofd Stylist',
        headshot: 'https://randomuser.me/api/portraits/men/12.jpg',
        description:
          'Max is de trotse eigenaar en hoofd stylist van de kapsalon met meer dan 20 jaar ervaring.',
      },
      {
        name: 'Lotte Smit',
        role: 'Senior Kapper',
        headshot: 'https://randomuser.me/api/portraits/women/36.jpg',
        description: 'Lotte is een senior kapper die trendy kapsels creëert en klanten op hun gemak stelt.',
      },
      {
        name: 'Emma Johnson',
        role: 'Barbier',
        headshot: 'https://randomuser.me/api/portraits/women/65.jpg',
        description: 'Emma is een ervaren barber bekend om haar aandacht voor detail en uitstekende service.',
      },
      {
        name: 'Tim de Vries',
        role: 'Junior Stylist',
        headshot: 'https://randomuser.me/api/portraits/men/85.jpg',
        description: 'Tim is een enthousiaste junior stylist die moderne kapsels creëert.',
      },
      {
        name: 'Sophie Jansen',
        role: 'Kleuren Specialist',
        headshot: 'https://randomuser.me/api/portraits/women/22.jpg',
        description: 'Sophie helpt klanten met de perfecte haarkleur en een prachtige afwerking.',
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      { name: 'Knipbeurt', price: 20, duration: 30 },
      { name: 'Baardtrimmen', price: 15, duration: 20 },
      { name: 'Scheren', price: 20, duration: 25 },
      { name: 'Kapsel & Baard Combinatie', price: 35, duration: 50 },
    ],
  });

  await prisma.appointment.createMany({
    data: [
      { customerId: 1, date: new Date('2023-11-17T09:00:00Z'), serviceId: 1, staffId: 1 },
      { customerId: 2, date: new Date('2023-11-18T10:00:00Z'), serviceId: 2, staffId: 2 },
    ],
  });

  await prisma.review.createMany({
    data: [
      { customerId: 1, rating: 5, comment: 'Uitstekende service!' },
      { customerId: 2, rating: 4, comment: 'Geweldige ervaring!' },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    getLogger().error('Error seeding data:', e);
    prisma.$disconnect();
    process.exit(1);
  });
