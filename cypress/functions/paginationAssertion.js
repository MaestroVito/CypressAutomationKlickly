export function performPaginationAssertion(firstPageData, secondPageData, duplicateProducts)
{
    // Assert that the response body contains promotions
    cy.wrap(secondPageData).should('have.property', 'promotions');

    // Compare products on the first and second pages
    const firstPageProduct = firstPageData.promotions.map((promotion) => promotion.title);
    const secondPageProduct = secondPageData.promotions.map((promotion) => promotion.title);

    // Create an array and check for duplicates
    const productCheckPromises = firstPageProduct.map((productTitles) =>
    {
        return new Promise((resolve, reject) => {
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

    return Promise.all(productCheckPromises);

}

export function throwErrorResponse(duplicateProducts, writeJSON)
{
    // Write JSON response
    return cy.writeFile(writeJSON, duplicateProducts, 'utf8', { flag: 'w+' }).then(() =>
    {
        // Throw error
        if (duplicateProducts.length > 0)
        {
            const errorMessage = `Duplicate product(s) found on both pages: \n ${duplicateProducts.join(';\n')}`;
            throw new Error(errorMessage);
        }

    });

}