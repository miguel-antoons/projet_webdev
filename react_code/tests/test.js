const {Builder, By, Key, util, Browser} = require("selenium-webdriver");
require("chromedriver");

async function example() {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://factevis.l2-2.ephec-ti.be");
    await driver.findElement(By.xpath("//a[@href='/projets_factures']"), By.class(active)).click();

}

example();