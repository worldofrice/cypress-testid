describe("eesti.ee testid", () => {
  beforeEach(() => {
    cy.visit("https://eesti.ee");
  });

  it("Avalehe laadimine ja elementide kontroll", () => {
    // Otsinguriba nähtav ja funktsionaalne
    cy.get(".ria-header-search-input").should("be.visible");
    cy.get("#search-input-default").should("be.visible");
    cy.get(".ria-header-search-input").type("test123");
    cy.get("#search-input-default").should("have.value", "test123");
    cy.get(".ria-header-search-input > :nth-child(2)").click();

    // Otsi nupp
    cy.get(":nth-child(1) > .v-header__button").click();
    cy.get(".ria-header-landing-content").should("be.visible");
    cy.get(":nth-child(1) > .v-header__button").click();

    // Menüü nupp
    cy.get(":nth-child(3) > .v-header__button").click();
    cy.get(".ria-sidenav-mobile-header-container").should("be.visible");
    cy.get(".sidenav-menu-close-button > .material-icons-outlined").click();

    // Sisene nupp
    cy.get(":nth-child(2) > .v-header__button").click();
    cy.wait(2000);
    //https://tara.ria.ee/auth/init
    cy.location().should((loc) => {
      expect(loc.host).to.eq("tara.ria.ee");
      expect(loc.pathname).to.contain("/auth/init");
    });
  });

  it("Otsingufunktsionaalsuse testimine", () => {
    // Sisestage otsingusse "Eesti hümn" ja kontrollige tulemusi
    cy.get(".ria-header-search-input").type("Eesti hümn").type("{enter}");
    cy.get(".articles-section__article-title > .p-0").should(
      "contain",
      "Eesti hümn",
    );

    // Veenduge, et tulemused on asjakohased ja viivad õigele sisulehele
    cy.get(":nth-child(1) > .d-flex > div > .false").click();
    cy.location().should((loc) => {
      expect(loc.host).to.eq("www.eesti.ee");
      expect(loc.pathname).to.eq(
        "/eraisik/et/artikkel/eesti-vabariik/eesti-vabariik/eesti-huemn",
      );
    });

    // Testige tühja otsingut ja kontrollige veateadet
    // cy.get(".ria-header-search-input").clear();
    cy.get(".ria-header-search-input").type(" ").type("{enter}");
    cy.get(".no-results-title").should("be.visible");
  });

  it("Teenuste lehele navigeerimine", () => {
    //  Ava "Eraisiku" all "Tervis ja retseptid" kategooria ja kontrolli, kas alateenused kuvatakse
    cy.wait(1500);
    cy.get(":nth-child(3) > .v-header__button").click();
    cy.wait(500);
    cy.get(
      ".sidenav-menuitem-container > :nth-child(4) > :nth-child(1)",
    ).scrollIntoView();
    cy.wait(500);
    cy.get(
      ".sidenav-menuitem-container > :nth-child(4) > :nth-child(1) > .rounded > :nth-child(1) > .sidenav-nav-item > .btn",
    ).click();
    cy.wait(500);
    cy.get(".py-0 > .text-uppercase").should("contain", "Tervis ja retseptid");
    cy.get(":nth-child(3) > :nth-child(1) > .sidenav-nav-item > .btn").should(
      "be.visible",
    );
    cy.get(":nth-child(3) > :nth-child(2) > .sidenav-nav-item > .btn").should(
      "be.visible",
    );

    //  Kontrollige, kas "Retseptid" leht laeb korrektselt
    cy.get(":nth-child(3) > :nth-child(1) > .sidenav-nav-item > .btn").click();
    cy.get(":nth-child(4) > :nth-child(2) > .sidenav-nav-item > .py-2")
      .should("contain", "Retseptid")
      .click();

    cy.wait(2000);

    cy.location().should((loc) => {
      expect(loc.host).to.eq("www.eesti.ee");
      expect(loc.pathname).to.eq(
        "/eraisik/et/artikkel/tervis-ja-tervisekaitse/tervishoid-ja-arstiabi/retseptid",
      );
    });

    // Testige, kas terviseportaali link avaneb korrektselt uues aknas
    cy.get(".article__content > :nth-child(3) > .external")
      .scrollIntoView()
      .should("have.attr", "href", "https://www.terviseportaal.ee/")
      .and("have.attr", "target");

    cy.get(".article__content > :nth-child(3) > .external")
      .invoke("removeAttr", "target")
      .click();

    cy.location("host").should("equal", "www.terviseportaal.ee");
  });

  it("Kontaktinfo lehe kontroll", () => {
    // Navigeerige "Võtke meiega ühendust" lehele
    cy.get(".d-flex > .ria-btn-secondary").click();
    cy.get(
      ":nth-child(3) > .section > .px-2 > :nth-child(4) > lib-stateportal-routing > span > .rout-link > .d-flex > .my-0",
    )
      .scrollIntoView()
      .click();

    // kontrollige, kas kõik olulised väljad on kontaktivormis olemas (nimi, e-post, küsimus)
    cy.get('[controlname="fullName"]').should("be.visible");
    cy.get('[controlname="email"]').should("be.visible");
    cy.get('[fieldtype="textarea"]').scrollIntoView().should("be.visible");

    // Testige kontaktivormi täitmist vale e-posti aadressiga ja kontrollige veateadet
    cy.get('[controlname="email"]').scrollIntoView().type("test");
    cy.get(".invalid-control-scroll-trigger").scrollIntoView().click();
    cy.get(".validation-error").should(
      "contain",
      "Sisestage kehtiv e-posti aadress. Näiteks user@example.com.",
    );
  });
});
