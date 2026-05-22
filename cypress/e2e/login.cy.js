describe('Login flow', () => {
  it('should login successfully and redirect to home', () => {
    const email = Cypress.env('EMAIL') || 'test_user@example.com';
    const password = Cypress.env('PASSWORD') || 'password123';

    cy.visit('/login');

    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Verify redirection to home or presence of authenticated element
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.get('button').contains('Logout').should('be.visible');
  });
});
