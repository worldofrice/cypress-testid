describe('eesti.ee testid', () => {
  beforeEach(() => {
    cy.visit('https://eesti.ee')
  })
  
  context('main page loading and element checks', () => {
    it('search bar visible', () => {
      cy.get('.ria-header-search-input').should('be.visible')
      cy.get('#search-input-default').should('be.visible')
    })
    
    it('search button works', () => {
      cy.get(':nth-child(1) > .v-header__button').click()
      cy.get('.ria-header-landing-content').should('be.visible')
    })
    
    it('auth button works', () => {
      cy.get(':nth-child(2) > .v-header__button').click()
      cy.wait(2000)
      //https://tara.ria.ee/auth/init
      cy.location().should((loc) => {
        expect(loc.host).to.eq('tara.ria.ee')
        expect(loc.pathname).to.contain('/auth/init')
      })
    })
    
    it('menu button works', () => {
      cy.get(':nth-child(3) > .v-header__button').click()
      cy.get('.ria-sidenav-mobile-header-container').should('be.visible')
    })
  })
  
  context('search functionality checks', () => {
    it('search case', () => {
      cy.get('.ria-header-search-input').type('Eesti hümn').type('{enter}')
      cy.get('.articles-section__article-title > .p-0 > .p-0').should('equal', "Eesti hümn")
    })
  })
})