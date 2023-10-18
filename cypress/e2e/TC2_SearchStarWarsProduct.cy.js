import Marketplace from '../page-objects/marketplace';

describe('Test Case #2: Search for STAR WARS Products', () =>
{
    it('should find 2 products containing "STAR WARS" in their title', () =>
    {
        // Test data
        const productTitle = 'STAR WARS';
        const expectedProducts = ["ROGUE ONE: A STAR WARS STORY [4K UHD]",
            "STAR WARS The Black Series Clone Commander Bly Toy 6-inch Scale The Clone Wars Collectible Action Figure, Kids Ages 4 and Up"];
        const searchURL = 'https://kcp-api.klickly-dev.com/marketplace/search?q=STAR%20WARS&page=1';
        const missingProducts = [];

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

            // Check if the response contains promotions
            cy.wrap(responseBody).should('have.property', 'promotions');

            // Create an array of promises to check each product title
            const productCheckPromises = expectedProducts.map((productTitle) =>
            {
                return new Promise((resolve, reject) =>
                {
                    const titles = responseBody.promotions.map((promotion) => promotion.title);

                    if (!titles.includes(productTitle))
                    {
                        missingProducts.push(productTitle);
                        cy.log(`Product: \n "${productTitle}" \n Not found.`);
                        resolve(false);
                    } else {
                        expect(titles).to.include(productTitle);
                        cy.log(`Product: \n "${productTitle}" \n Is present.`);
                        resolve(true);
                    }

                });

            });

            Promise.all(productCheckPromises).then(() =>
            {
                // Write the response to a JSON file
                cy.writeFile('cypress/fixtures/TC2_SearchStarWarsProduct.json', responseBody, 'utf8', { flag: 'w+' }).then(() =>
                {
                    if (missingProducts.length > 0)
                    {
                        const errorMessage = `Product(s) not found: \n ${missingProducts.join(';\n')} \n Created Response Body JSON`;
                        throw new Error(errorMessage);
                    }

                });

            });

        });

    });

});