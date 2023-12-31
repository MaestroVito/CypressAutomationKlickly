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
        return cy.get('[class="sc-iIUQWv jpNogh"]');
    }

    searchFieldSuggestions()
    {
        return cy.get('[class="sc-kTLmzF cbnHZh"]');
    }

    searchButton()
    {
        return cy.get('[class="ant-btn css-15rg2km ant-btn-primary ant-btn-sm sc-crHmcD eWRUbM sc-jtXEFf gaXnty"]');
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