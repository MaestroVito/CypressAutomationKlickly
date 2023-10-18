export function performSearchAssertions(responseBody, expectedProducts, missingProducts)
{
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

    return Promise.all(productCheckPromises);

}

export function throwErrorResponse(responseBody, missingProducts, writeJSON)
{
    // Write JSON response
    return cy.writeFile(writeJSON, responseBody, 'utf8', { flag: 'w+' }).then(() =>

    {
        // Throw error
        if (missingProducts.length > 0)
        {
            const errorMessage = `Product(s) not found: \n ${missingProducts.join(';\n')} \n Created Response Body JSON`;
            throw new Error(errorMessage);
        }

    });

}