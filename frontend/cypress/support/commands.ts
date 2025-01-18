// cypress/support/commands.ts

/// <reference types="cypress" />


Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login');
  
    cy.get('[data-cy=email-input]').type(email);
  
    cy.get('[data-cy=password-input]').type(password);
  
    cy.get('[data-cy=submit_login]').click();
  
    cy.url().should('include', '/');
  });
