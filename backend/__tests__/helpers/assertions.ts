import { Response } from 'supertest';

export const expectValidResponse = (response: Response, expectedStatus: number) => {
  expect(response.status).toBe(expectedStatus);

  if (expectedStatus === 200 || expectedStatus === 201) {
    expect(response.body).not.toBeNull();
    expect(typeof response.body).toBe('object');
  }
};

export const expectErrorResponse = (
  response: Response,
  expectedStatus: number,
  expectedErrorCode: string,
  expectedMessage: string
) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('code', expectedErrorCode);
  expect(response.body).toHaveProperty('message', expectedMessage);
};
