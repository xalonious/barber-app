export default {
  log: {
    level: 'warn',
    disabled: true,
  },
  cors: {
    origins: ['http://localhost'],
    maxAge: 86400,
  },
  auth: {
    jwt: {
      audience: 'localhost',
      issuer: 'localhost',
      expirationInterval: 3600,
      secret: 'thistestkeyisverylongandidontthinkanyonewilleverguesssitlookatititssooooolong',
    },
    argon: {
      hashLength: 16,
      timeCost: 2, 
      memoryCost: 8192,
    },
  },
};
