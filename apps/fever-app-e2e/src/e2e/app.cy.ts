describe('App tests', () => {
  describe('Desktop view tests', () => {
    beforeEach(() => cy.visit('/'));

    it('Should we visible', () => {
      cy.contains('Fever Pets! Together');
      cy.get('[data-test=pet-list-results]').should('have.length', 1);
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
    });

    it('Dropdown sort by working', () => {
      cy.get('.mb-4 > [color="secondary"] > .bg-blue-500').click();
      cy.get(
        '.ng-untouched > .relative > div > [data-test="dropdown-button"]'
      ).click();
      cy.get('.py-1 > :nth-child(1)').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Anabelle');
      cy.get(
        '.ng-touched > .relative > div > [data-test="dropdown-button"]'
      ).click();
      cy.get('.py-1 > :nth-child(2)').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Cutie');
      cy.get(
        '.ng-touched > .relative > div > [data-test="dropdown-button"]'
      ).click();
      cy.get('.py-1 > :nth-child(3)').click();
      cy.get('[data-test=pet-list-results-name]').first().contains('Jade');
      cy.get(
        '.ng-touched > .relative > div > [data-test="dropdown-button"]'
      ).click();
      cy.get('.py-1 > :nth-child(4)').click();
      cy.get('[data-test=pet-list-results-name]').first().contains('Jade');
      cy.get(
        '.ng-touched > .relative > div > [data-test="dropdown-button"]'
      ).click();
      cy.get('.py-1 > :nth-child(5)').click();
      cy.get('[data-test=pet-list-results-name]').first().contains('Stinky');
      cy.get('.flex-col > [color="danger"] > .bg-blue-500').click();
      cy.get('[data-test=pet-list-results-name]').first().contains('Jade');
    });

    it('Search by name input should work', () => {
      cy.get('.mb-4 > [color="secondary"] > .bg-blue-500').click();
      cy.get('[data-test=pet-list-filters-form]').should('exist');
      cy.get('#searchByName').type('No Pets Found');
      cy.get('[data-test=pet-list-results-not-found]').should('exist');
      cy.get('[data-test=pet-list-results-found]').should('not.exist');
      cy.get('#searchByName').clear();
      cy.get('#searchByName').type('Cutie');
      cy.get('[data-test=pet-list-results-not-found]').should('not.exist');
      cy.get('[data-test=pet-list-results-found]').should('exist');
      cy.get('[data-test=pet-list-results-name]').should('have.length', 1);
      cy.get('.flex-col > [color="secondary"] > .bg-blue-500').click();
      cy.get('[data-test=pet-list-filters-form]').should('not.exist');
      cy.get('.mb-4 > [color="secondary"] > .bg-blue-500').click();
      cy.get('[data-test=pet-list-filters-form]').should('exist');
      cy.get('.flex-col > [color="danger"] > .bg-blue-500').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('.mx-auto > .flex > .hidden').click();
      cy.get('#searchByName').type('Aura');
      cy.get('[data-test=pet-list-results-name]').should('have.length', 1);
      cy.get('.mx-auto > .flex > .hidden').click();
      cy.get('.flex-col > [color="secondary"] > .bg-blue-500').click();
      cy.get('.flex-col > [color="danger"] > .bg-blue-500').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
    });

    it('Pagination should work', () => {
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Jade');
      cy.get(':nth-child(4) > .h-5').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Guru');
      cy.get(':nth-child(4) > .h-5').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Cannabis');
      cy.get(':nth-child(4) > .h-5').click();
      cy.get('[data-test=pet-list-results-not-found]').should('exist');
      cy.get('[data-test=pet-list-results-found]').should('not.exist');
      cy.get(':nth-child(2) > .h-5').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Cannabis');
      cy.get('.rounded-l-md > .h-5').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Jade');
      cy.get('.mb-4 > [color="secondary"] > .bg-blue-500').click();
      cy.get(
        '.ng-untouched > .relative > div > [data-test="dropdown-button"]'
      ).click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('.py-1 > :nth-child(1)').click();
      cy.get('[data-test=pet-list-results-name]').first().contains('Anabelle');
      cy.get(':nth-child(4) > .h-5').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Heffer');
      cy.get(':nth-child(4) > .h-5').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Oscar');
      cy.get(':nth-child(4) > .h-5').click();
      cy.get('[data-test=pet-list-results-not-found]').should('exist');
      cy.get('[data-test=pet-list-results-found]').should('not.exist');
      cy.get('[data-test=paginator-go-first-page-btn]').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('[data-test=pet-list-results-name]').first().contains('Anabelle');
    });

    it('Pet details should be visible', () => {
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      // * Dog healthy
      cy.get(
        ':nth-child(1) > :nth-child(3) > ui-button > .bg-blue-500'
      ).click();
      cy.get('[data-test=pet-details]').should('exist');
      cy.get('[data-test=pet-details-health]').contains('healthy');
      cy.get('[data-test=pet-details-weight]').contains('2741g');
      cy.get('.container > :nth-child(1) > ui-button > .bg-blue-500').click();
      // * Dog Unhealthy
      cy.get(
        ':nth-child(3) > :nth-child(3) > ui-button > .bg-blue-500'
      ).click();
      cy.get('[data-test=pet-details-health]').contains('unhealthy');
      cy.get('[data-test=pet-details-weight]').contains('7509g');
      cy.get('[data-test="pet-details"] > ui-button > .bg-blue-500').click();
      // * Dog Very healthy
      cy.get(
        ':nth-child(5) > :nth-child(3) > ui-button > .bg-blue-500'
      ).click();
      cy.get('[data-test=pet-details-health]').contains('very healthy');
      cy.get('[data-test=pet-details-weight]').contains('1572g');
      cy.get('[data-test="pet-details"] > ui-button > .bg-blue-500').click();
      // * Cat Unhealthy (1 life)
      cy.get(
        ':nth-child(2) > :nth-child(3) > ui-button > .bg-blue-500'
      ).click();
      cy.get('[data-test=pet-details-health]').contains('unhealthy');
      cy.get('[data-test=pet-details-weight]').contains('6712g');
      cy.get('[data-test="pet-details"] > ui-button > .bg-blue-500').click();
      // * Cat Healthy
      cy.get(
        ':nth-child(4) > :nth-child(3) > ui-button > .bg-blue-500'
      ).click();
      cy.get('[data-test=pet-details-health]').contains('healthy');
      cy.get('[data-test=pet-details-weight]').contains('3490g');
      cy.get('[data-test="pet-details"] > ui-button > .bg-blue-500').click();
      // * Cat very Healthy
      cy.get(
        ':nth-child(8) > :nth-child(3) > ui-button > .bg-blue-500'
      ).click();
      cy.get('[data-test=pet-details-health]').contains('very healthy');
      cy.get('[data-test=pet-details-weight]').contains('2696g');
      cy.get('[data-test="pet-details"] > ui-button > .bg-blue-500').click();
    });

    it('Pet details should show not found if URL is wrong', () => {
      cy.visit('/url-not-exists');
      cy.get('[data-test=pet-details-not-found]').should('exist');
      cy.get('ui-button.w-full > .bg-blue-500').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
    });
  });

  describe('Mobile view tests', () => {
    beforeEach(() => {
      cy.viewport(320, 480);
      cy.visit('/');
    });

    it('Should we visible', () => {
      cy.contains('F. Pets!');
      cy.get('[data-test=pet-list-results]').should('have.length', 1);
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
    });

    it('Infinite scroll should work', () => {
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.scrollTo('bottom', { duration: 4000 });
      cy.get('[data-test=pet-list-results-name]').should('have.length', 20);
      cy.scrollTo('bottom', { duration: 4000 });
      cy.get('[data-test=pet-list-results-name]').should('have.length', 30);
    });

    it('Full test should work', () => {
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
      cy.get('.mb-4 > [color="secondary"] > .bg-blue-500').click();
      cy.get(
        '.ng-untouched > .relative > div > [data-test="dropdown-button"]'
      ).click();
      cy.get('.py-1 > :nth-child(1)').click();
      cy.get('.mr-2 > .bg-blue-500').click();
      cy.get('#searchByName').type('Au');
      cy.get('.mr-2 > .bg-blue-500').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 0);
      cy.get('#searchByName').clear();
      cy.get('#searchByName').type('Aura');
      cy.get('.mr-2 > .bg-blue-500').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 1);
      cy.get('#searchByName').clear();
      cy.get('#searchByName').type('Aura');
      cy.get('.mr-2 > .bg-blue-500').click();
      cy.get('.flex-col > [color="secondary"] > .bg-blue-500').click();
      cy.get(':nth-child(3) > ui-button > .bg-blue-500').click();
      cy.get('[data-test="pet-details"] > ui-button > .bg-blue-500').click();
      cy.get('.mb-4 > [color="danger"] > .bg-blue-500').click();
    });

    it('Pet details should show not found if URL is wrong', () => {
      cy.visit('/url-not-exists');
      cy.get('[data-test=pet-details-not-found]').should('exist');
      cy.get('ui-button.w-full > .bg-blue-500').click();
      cy.get('[data-test=pet-list-results-name]').should('have.length', 10);
    });
  });
});
