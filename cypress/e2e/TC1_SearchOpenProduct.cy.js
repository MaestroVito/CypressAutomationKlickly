import ProductData from '../test-data/productData';
import ProductUtils from '../functions/productUtils';
import Marketplace from '../page-objects/marketplace';
import Product from '../page-objects/product';

describe('Test Case #1: Search and Open Product', () =>
{
    // Test data
    const productTitle = ProductData.getBrunswickLizardTitle();
    const { firstPart, secondPart } = ProductUtils.splitProductTitle(productTitle);

    it('should search for a product and verify its opening', () =>
    {
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