/// <reference types="cypress" />

describe('Verify that the delete button is only visible for a users own reviews', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/reviews', { fixture: 'reviews.json' }).as('getReviews');
  
      cy.fixture('users').then((users) => {
        cy.login(users.validUser.email, users.validUser.password);
      });
    });
  
    it('Toont de delete-knop alleen voor eigen recensies', () => {
      cy.wait('@getReviews');
  
      cy.get('[data-cy=review-item]').each(($el) => {
        cy.wrap($el).within(() => {
          cy.get('[data-cy=review-customer-name]').then(($name) => {
            if ($name.text().trim() === 'John Doe') {
              cy.get('button[data-cy^="delete-review-button-"]').should('be.visible');
            } else {
              cy.get('button[data-cy^="delete-review-button-"]').should('not.exist');
            }
          });
        });
      });
    });
  });
  