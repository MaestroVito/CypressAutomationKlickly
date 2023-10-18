import ProductData from '../test-data/productData';
import Marketplace from '../page-objects/marketplace';
import TestData from '../test-data/testData';
import { performPaginationAssertion } from '../functions/paginationAssertion';
import { throwErrorResponse } from '../functions/paginationAssertion';

describe('Test Case #3: Verify Products after Pagination Scroll', () =>
{
    // Test data
    const productTitle = ProductData.getStarWarsTitle();
    const searchPage1 = Marketplace.searchStarWarsPage1();
    const searchPage2 = Marketplace.searchStarWarsPage2();
    const writeJSON = TestData.writeFixtureTC3();
    const duplicateProducts = [];

    it('should verify products on the first and second page are different', () =>
    {
        // Intercept request for both first and second pages
        cy.intercept('GET', searchPage1).as('firstPageRequest');
        cy.intercept('GET', searchPage2).as('secondPageRequest');

        // Enter homepage
        Marketplace.homepage();

        // Search for 'STAR WARS' product
        Marketplace.searchField().should('be.visible').clear().type(productTitle);

        // Verify search results pop-up
        Marketplace.searchFieldSuggestions().should('be.visible');

        // Verify typed product
        Marketplace.searchField().should('have.value', productTitle);

        // Click on search button
        Marketplace.searchButton().should('be.visible').click();

        // Verify search result
        Marketplace.firstResult().should('contain', productTitle);

        // Wait for the first page request to complete
        cy.wait('@firstPageRequest').then((firstPageInterception) =>
        {
            const firstPageData = firstPageInterception.response.body;

            // Assert that the response body contains promotions
            cy.wrap(firstPageData).should('have.property', 'promotions');
        
            // Scroll down for second page
            Marketplace.lastResult().scrollIntoView();

            // Wait for the second page request to complete
            cy.wait('@secondPageRequest').then((secondPageInterception) =>
            {
                const secondPageData = secondPageInterception.response.body;

                // Create an array and check for duplicates
                performPaginationAssertion(firstPageData, secondPageData, duplicateProducts).then(() =>
                {
                    // Throw error and write the response to a JSON file
                    return throwErrorResponse(duplicateProducts, writeJSON);

                });

            });

        });

    });

});