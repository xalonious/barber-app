import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', 
    specPattern: 'cypress/e2e/**/*.{cy.ts,cy.js}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 8000, 
    pageLoadTimeout: 60000,      
    video: false,                
  },
});
