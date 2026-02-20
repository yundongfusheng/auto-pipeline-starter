describe('Todos CRUD', () => {
  beforeEach(() => {
    // 清空 localStorage，保证测试隔离
    cy.clearLocalStorage();
    cy.visit('/todos');
  });

  it('新增 todo 后刷新页面仍然存在（localStorage 持久化）', () => {
    cy.get('[data-cy="todo-input"]').type('Buy oat milk');
    cy.get('[data-cy="todo-submit"]').click();

    // 列表中可见
    cy.get('[data-cy="todo-title"]').should('contain', 'Buy oat milk');

    // 刷新后仍然存在
    cy.reload();
    cy.get('[data-cy="todo-title"]').should('contain', 'Buy oat milk');
  });

  it('删除 todo 后列表清空', () => {
    cy.get('[data-cy="todo-input"]').type('Temp task');
    cy.get('[data-cy="todo-submit"]').click();

    cy.get('[data-cy="todo-item"]').should('have.length', 1);

    cy.get('[data-cy="todo-delete"]').first().click();

    cy.get('[data-cy="todo-item"]').should('not.exist');
  });

  it('可连续新增多条 todo', () => {
    const items = ['Task A', 'Task B', 'Task C'];

    items.forEach((label) => {
      cy.get('[data-cy="todo-input"]').clear().type(label);
      cy.get('[data-cy="todo-submit"]').click();
    });

    cy.get('[data-cy="todo-item"]').should('have.length', 3);
  });
});
