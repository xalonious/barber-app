export default {
    server: {
      port: 9000,
    },
    log: {
      level: 'info', 
      disabled: false,
    },
    cors: {
      maxAge: 3 * 60 * 60, 
    },
    auth: {
      jwt: {
        expirationInterval: '12h', 
      },
      argon: {
        hashLength: 32,
      },
    },
  };
  