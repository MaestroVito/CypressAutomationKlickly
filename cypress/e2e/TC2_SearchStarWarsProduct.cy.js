import ProductData from '../test-data/productData';
import Marketplace from '../page-objects/marketplace';
import TestData from '../test-data/testData';
import { performSearchAssertions } from '../functions/searchAssertions';
import { throwErrorResponse } from '../functions/searchAssertions';

describe('Test Case #2: Search for STAR WARS Products', () =>
{
    // Test data
    const productTitle = ProductData.getStarWarsTitle();
    const expectedProducts = ProductData.getExpectedProductsList();
    const searchURL = Marketplace.searchStarWarsPage1();
    const writeJSON = TestData.writeFixtureTC2();
    const missingProducts = [];

    it('should find 2 products containing "STAR WARS" in their title', () =>
    {
        // Intercept the GET request to "/search" and handle the response
        cy.intercept('GET', searchURL).as('searchRequest');

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

        // Wait for the search request to complete
        cy.wait('@searchRequest').then((interception) =>
        {
            // Extract the response body
            const responseBody = interception.response.body;

            // Create an array for product availability
            performSearchAssertions(responseBody, expectedProducts, missingProducts).then(() =>
            {
                // Throw error and write the response to a JSON file
                return throwErrorResponse(responseBody, missingProducts, writeJSON);

            });

        });

    });

});