import { CreditFrontPage } from './app.po';

describe('credit-front App', () => {
  let page: CreditFrontPage;

  beforeEach(() => {
    page = new CreditFrontPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
