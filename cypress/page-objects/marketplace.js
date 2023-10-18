class Marketplace
{

    homepage()
    {
        cy.visit('https://giftly.klickly-dev.com/marketplace');
    }

    searchStarWarsPage1()
    {
        return 'https://kcp-api.klickly-dev.com/marketplace/search?q=STAR%20WARS&page=1';
    }

    searchStarWarsPage2() {
        return 'https://kcp-api.klickly-dev.com/marketplace/search?q=STAR%20WARS&page=2';
    }

    searchField()
    {
        return cy.get('[class="sc-dxcDKg fjZlts"]');
    }

    searchFieldSuggestions()
    {
        return cy.get('[class="sc-iXzfSG cpVZLN"]');
    }

    searchButton()
    {
        return cy.get('[class="sc-eDPEul dVMMBf"]');
    }

    firstResult()
    {
        return cy.get('[class="ant-col ant-col-xs-12 ant-col-sm-12 ant-col-md-12 ant-col-xl-8 css-15rg2km"]')
            .find('div')
            .first();
    }

    lastResult()
    {
        return cy.get('[class="ant-col ant-col-xs-12 ant-col-sm-12 ant-col-md-12 ant-col-xl-8 css-15rg2km"]')
            .find('div')
            .last();
    }

}

export default new Marketplace();