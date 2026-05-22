describe('Login flow', () => {
  it('should login successfully and redirect to home', () => {
    // Mocking API responses for stability in CI
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          token: 'fake_token_abc123',
        },
      },
    }).as('loginRequest');

    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          user: {
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'https://generated-image-url.jpg',
          },
        },
      },
    }).as('profileRequest');

    cy.visit('/login');

    cy.get('input[id="email"]').type('test@example.com');
    cy.get('input[id="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@profileRequest');

    // Verify redirection to home or presence of authenticated element
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.get('button').contains('Logout').should('be.visible');
    cy.contains('Test User').should('be.visible');
  });
});
