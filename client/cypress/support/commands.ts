/**
 * Adds custom command "cy.dataTest" to the global "cy" object
 *
 * @example cy.dataTest('greeting')
 */
Cypress.Commands.add("dataTest", value => cy.get(`[data-test='${value}']`))

export {}
