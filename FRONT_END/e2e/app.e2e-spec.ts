import { ProjetJXSPage } from './app.po';

describe('projet-jxs App', () => {
  let page: ProjetJXSPage;

  beforeEach(() => {
    page = new ProjetJXSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
