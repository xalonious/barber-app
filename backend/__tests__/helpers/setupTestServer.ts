import createServer from '../../src/createServer';

let appInstance: any;

export const setupTestServer = async () => {
  if (!appInstance) {
    const server = await createServer();
    appInstance = server.getApp();
  }
  return appInstance;
};
