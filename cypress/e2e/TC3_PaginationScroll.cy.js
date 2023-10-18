import Marketplace from '../page-objects/marketplace';

describe('Test Case #3: Verify Products after Pagination Scroll', () =>
{
    it('should verify products on the first and second page are different', () =>
    {
        // Test data
        const productTitle = 'STAR WARS';
        const searchURL = 'https://kcp-api.klickly-dev.com/marketplace/search?q=STAR%20WARS&page=';
        const duplicateProducts = [];
        let firstPageData;
        let secondPageData;

        // Intercept request for both first and second pages
        cy.intercept('GET', `${searchURL}1`).as('firstPageRequest');
        cy.intercept('GET', `${searchURL}2`).as('secondPageRequest');

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
            firstPageData = firstPageInterception.response.body;

            // Assert that the response body contains promotions
            cy.wrap(firstPageData).should('have.property', 'promotions');
        
            // Scroll down for second page
            Marketplace.lastResult().scrollIntoView();

            // Wait for the second page request to complete
            cy.wait('@secondPageRequest').then((secondPageInterception) =>
            {
                secondPageData = secondPageInterception.response.body;

                // Assert that the response body contains promotions
                cy.wrap(secondPageData).should('have.property', 'promotions');
            
                // Compare products on the first and second pages
                const firstPageProduct = firstPageData.promotions.map((promotion) => promotion.title);
                const secondPageProduct = secondPageData.promotions.map((promotion) => promotion.title);

                // Create an array of Promises to check for duplicates
                const productCheckPromises = firstPageProduct.map((productTitles) =>
                {
                    return new Promise((resolve, reject) =>
                    {
                        if (secondPageProduct.includes(productTitles))
                        {
                            // Product title found on both pages, collect it
                            duplicateProducts.push(productTitles);
                            cy.log(`Product: \n "${productTitles}" \n Is duplicate.`);
                            resolve(false);
                        } else {
                            expect(secondPageProduct).to.not.include(productTitles);
                            resolve(true);
                        }
                        
                    });

                });

                Promise.all(productCheckPromises).then(() =>
                {
                    // Write the duplicates to a JSON file
                    cy.writeFile('cypress/fixtures/TC3_PaginationScroll.json', `${duplicateProducts.join('\n')}`).then(() =>
                    {
                        // After the iteration, check for duplicate products
                        if (duplicateProducts.length > 0)
                        {
                            const errorMessage = `Duplicate product(s) found on both pages: \n ${duplicateProducts.join(';\n') }`;
                            throw new Error(errorMessage);
                        }

                    });

                });

            });

        });

    });

});