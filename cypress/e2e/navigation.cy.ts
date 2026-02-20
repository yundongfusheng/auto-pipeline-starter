describe('Navigation', () => {
  it('访问首页并点击按钮跳转到 /todos', () => {
    cy.visit('/');

    // 首页内容可见
    cy.contains('AutoPipeline Starter').should('be.visible');

    // 点击 CTA 按钮跳转
    cy.get('[data-cy="go-to-todos"]').click();

    // 确认 URL 与页面标题
    cy.url().should('include', '/todos');
    cy.contains('h1', 'Todos').should('be.visible');
  });

  it('顶部导航 About 链接可正常跳转，且当前路由高亮', () => {
    cy.visit('/');

    cy.get('nav').contains('About').click();
    cy.url().should('include', '/about');

    // 当前链接含 underline class（NavLink isActive）
    cy.get('nav').contains('About').should('have.class', 'underline');
  });
});
