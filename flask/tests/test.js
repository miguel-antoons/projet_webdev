const {Builder, By, Key, util} = require("selenium-webdriver");
require("chromedriver");

async function example() {
    let driver = await new builder().forBrowser("chrome").build();
    await driver.get("https://factevis.l2-2.ephec-ti.be/");
    await driver.findElement(By.name("q")).sendKeys("Selenium Test", key.RETURN);
}

example();