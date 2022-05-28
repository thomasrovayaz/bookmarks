import bookmarks from "../fixtures/bookmarks.json"

describe("Bookmarks", () => {
    beforeEach(() => {
        cy.intercept("/api/bookmarks", { fixture: "bookmarks.json" }).as("loadBookmarks")
        cy.visit("/")
        cy.wait("@loadBookmarks")
    })
    it("show the bookmark list", () => {
        bookmarks.forEach(bookmark => {
            const {
                id,
                url,
                title,
                author,
                height,
                width,
                type
            } = bookmark
            cy.dataTest(`bookmark-${id}`).should("have.attr", "href", url)
            cy.dataTest(`bookmark-${id}`).within(() => {
                cy.contains(title)
                cy.contains(author)
                if (type === "video") {
                    cy.contains("00:17:50")
                } else if (type === "photo") {
                    cy.contains(`${width}x${height}`)
                }
            })
        })
    })
    it("add a bookmark to the list", () => {
        const url = "https://www.flickr.com/photos/feuilllu/31899892028/in/photostream/"
        cy.intercept("POST", "/api/bookmarks", {
            statusCode: 200,
            body: {
                id: 3,
                author: "Pierre Metivier",
                createdAt: "2000-01-01T00:00:00.000Z",
                height: 768,
                thumbnail: "https://live.staticflickr.com/1922/31899892028_6f105415d9_q.jpg",
                title: "2018 Visite de Klaxoon",
                type: "photo",
                url,
                width: 1024
            }
        }).as("addBookmark")
        cy.dataTest("bookmark-input").type(url)
        cy.dataTest("bookmark-add-button").click()
        cy.wait("@addBookmark").its("request.body").should("deep.equal", {
            url: url
        })

        cy.dataTest("bookmark-3").should("exist")
    })
    it("not add an existing bookmark to the list", () => {
        const url = "https://vimeo.com/565486457"
        const error = "Le bookmark existe déjà"
        cy.intercept("POST", "/api/bookmarks", {
            statusCode: 400,
            body: error
        }).as("addBookmark")
        cy.dataTest("bookmark-input").type(url)
        cy.dataTest("bookmark-add-button").click()
        cy.dataTest("add-error").contains(error)
    })
    it("remove a bookmark from the list", () => {
        cy.intercept("DELETE", "/api/bookmarks/*", [bookmarks[0]]).as("deleteBookmark")
        cy.dataTest("delete-bookmark-2").click()
        cy.wait("@deleteBookmark")
        cy.dataTest("bookmark-2").should("not.exist")
    })
    it("show error when remove fail", () => {
        const error = "Le bookmark n'existe pas"
        cy.intercept("DELETE", "/api/bookmarks/*", {
            statusCode: 400,
            body: error
        }).as("deleteBookmark")
        cy.dataTest("delete-bookmark-2").click()
        cy.wait("@deleteBookmark")
        cy.dataTest("delete-error").contains(error)
    })
})

export {}
