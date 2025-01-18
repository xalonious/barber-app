/// <reference types="cypress" />

describe('View reviews functionality', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/reviews', { fixture: 'reviews.json' }).as('getReviews');
  
      cy.fixture('users').then((users) => {
        cy.login(users.validUser.email, users.validUser.password);
      });
  
      cy.visit('/');
    });
  
    it('Toont alle bestaande recensies', () => {
      cy.wait('@getReviews');
  
      cy.get('[data-cy=review-list]').should('be.visible');
  
      cy.get('[data-cy=review-item]').should('have.length', 2);
  
      cy.get('[data-cy=review-item]').first().within(() => {
        cy.get('[data-cy=review-customer-name]')
          .should('not.be.empty')
          .and('contain.text', 'John Doe'); 
  
        cy.get('[data-cy=review-rating]')
          .invoke('text')
          .then((text) => {
            cy.log(`Review Rating Text: "${text}"`);
            expect(text.trim()).to.match(/^\d+ Ster(?:ren)?$/);
          });
  
        cy.get('[data-cy=review-comment]').should('not.be.empty');
      });
  
      cy.get('[data-cy=review-item]').eq(1).within(() => {
        cy.get('[data-cy=review-customer-name]')
          .should('contain.text', 'Jane Doe');
  
        cy.get('[data-cy=review-rating]')
          .invoke('text')
          .then((text) => {
            cy.log(`Review Rating Text: "${text}"`);
            expect(text.trim()).to.match(/^\d+ Ster(?:ren)?$/);
          });
  
        cy.get('[data-cy=review-comment]').should('contain.text', 'Geweldige ervaring!');
      });
    });
  });
  