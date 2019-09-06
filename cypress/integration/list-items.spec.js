describe('List items', () => {
  beforeEach(() => {
    cy.seedAndVisit()
  })

  it('properly displays completed items', () => {
    cy.get('.todo-list li')
      .filter('.completed')
      .should('have.length', 1)
      .and('contain', 'Eggs')
      .find('.toggle')
      .should('be.checked')
  })

  it('Shows remaining todos in the footer', () => {
    // check the todo count to be 3 from the seed
    cy.get('.todo-count').should('contain', '3 todos left')
  })

  it('Removes a todo', () => {
    cy.route({
      url: '/api/todos/1',
      method: 'DELETE',
      status: 200,
      response: {}
    })

    cy.get('.todo-list li')
      .as('list')

    cy.get('@list')
      .first()
      .find('.destroy')
      .invoke('show')
      .click()

    cy.get('@list')
      .should('have.length', 3)
      .and('not.contain', 'Milk')
  })

  it('Marks an incomplete item complete', () => {
    cy.fixture('todos')
      .then(todos => {
        const target = Cypress._.head(todos)
        cy.route(
          'PUT',
          `/api/todos/${target.id}`,
          Cypress._.merge(target, { isComplete: true })
        )
      })

    cy.get('.todo-list li')
      .first()
      .as('first-todo')

    // toggle the first todo and insure that it is checked
    
    cy.get('@first-todo').find('.toggle').click()
    
    // check that it has class "completed"
    cy.get('@first-todo').should('have.class', 'completed')

    // check todo count for 2 todos remaining
    cy.get('.todo-count').should('contain', '2 todos left')
  })
})
