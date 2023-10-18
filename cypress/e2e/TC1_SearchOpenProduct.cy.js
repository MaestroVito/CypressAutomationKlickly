import Marketplace from '../page-objects/marketplace';
import Product from '../page-objects/product';

describe('Test Case #1: Search and Open Product', () =>
{
    it('should search for a product and verify its opening', () =>
    {
        // Test data
        const productTitle = 'Cat 2 test';

        // Split the test data into two parts
        const firstPart = productTitle.substring(0, 20);
        const secondPart = productTitle.substring(20);

        // Enter homepage
        Marketplace.homepage();

        // Search for target product #1 attempt
        Marketplace.searchField().should('be.visible').type(firstPart);

        // Verify search results pop-up
        Marketplace.searchFieldSuggestions().should('be.visible');

        // Search for target product #2 attempt
        if (secondPart) {
            Marketplace.searchField().should('be.visible').type(secondPart);
        }

        // Verify typed text
        Marketplace.searchField().should('have.value', productTitle);

        // Click on search button
        Marketplace.searchButton().should('be.visible').click();

        // Verify search result
        Marketplace.firstResult().should('contain', productTitle);

        // Open first search result
        Marketplace.firstResult().should('be.visible').click();

        // Verify opened result
        Product.title().should('be.visible').should('contain', productTitle);

    });

});