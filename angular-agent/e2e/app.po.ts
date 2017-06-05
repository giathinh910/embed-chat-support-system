import { browser, by, element } from 'protractor';

export class AgentPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('agent-root h1')).getText();
  }
}
