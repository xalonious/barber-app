export default {
  cors: {
    origins: ['http://localhost:5173'],
  },
  auth: {
    jwt: {
      audience: 'localhost',
      issuer: 'localhost',
      secret: 'development-secret-key',
    },
    argon: {
      timeCost: 6,
      memoryCost: 131072,
    },
  },
};
