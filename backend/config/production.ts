export default {
  cors: {
    origins: ['https://hogentwebdevproject.tech'],
  },
  auth: {
    jwt: {
      audience: 'hogentwebdevproject.tech',
      issuer: 'hogentwebdevproject.tech',
      secret: process.env.AUTH_JWT_SECRET, 
    },
    argon: {
      timeCost: 8,
      memoryCost: 262144,
    },
  },
};
