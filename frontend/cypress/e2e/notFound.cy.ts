describe('404 Not Found Page', () => {
    it('Displays the 404 page for non-existent routes', () => {
      cy.visit('/this-page-does-not-exist');
  
      cy.get('[data-cy=not-found-page]').should('be.visible');
  
      cy.get('[data-cy=not-found-heading]')
        .should('contain.text', '404 - Pagina Niet Gevonden');
  
      cy.get('[data-cy=not-found-message]')
        .should('contain.text', 'Sorry, de pagina die je zoekt bestaat niet.');
  
      cy.get('[data-cy=go-home-button]')
        .should('exist')
        .and('have.attr', 'href', '/')
        .and('contain.text', 'Ga terug naar Home');
    });
  });
  