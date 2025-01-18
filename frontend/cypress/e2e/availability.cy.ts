/// <reference types="cypress" />

describe('General', () => {
  it('runs the application', () => {
    cy.visit('http://localhost:5173');
    cy.get('h1').should('exist'); // 👈
  });
});