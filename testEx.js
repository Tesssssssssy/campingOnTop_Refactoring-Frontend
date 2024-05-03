const { Builder, By, until } = require("selenium-webdriver");

(async function example() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://www.campingontop.kro.kr/login");

  const input_id = await driver.findElement(By.id("email"));
  input_id.sendKeys("dlaxodn9999@gmail.com"); // input tag에 값 전달

  const input_pw = await driver.findElement(By.id("password"));
  input_pw.sendKeys("qwer1234@");

  const login_btn = await driver.findElement(By.id("loginBtn"));
  login_btn.click();

  try {
    await driver.wait(until.elementLocated(By.id("btn_nickname")), 10000);
    const nicknameElement = await driver.findElement(By.id("btn_nickname"));
    const nickname = await nicknameElement.getText();
    console.log("로그인 성공");
    console.log("닉네임:", nickname);
    console.log("\n");
    console.log("---------------------");

  } catch (error) {
    console.error("로그인 실패:", error);
    await driver.quit();
    return; 
  }

  await driver.get("http://www.campingontop.kro.kr/");
  await driver.wait(until.elementLocated(By.id("main_lists")), 10000);

  const houseCards = await driver.findElements(
    By.css("#main_lists .card_wrap")
  );

  for (const card of houseCards) {
    const name = await card.findElement(By.css(".card-title a")).getText();
    const address = await card.findElement(By.css(".card-subtitle")).getText();
    const likeCnt = await card.findElement(By.css(".card-likeCnt")).getText();
    const price = await card.findElement(By.css(".p_price .price")).getText();

    const imageElements = await card.findElements(By.css(".p_images img"));
    const imageUrls = await Promise.all(
      imageElements.map(async (img) => await img.getAttribute("data-src"))
    );

    console.log("Name:", name);
    console.log("Address:", address);
    console.log("Like Count:", likeCnt);
    console.log("Price:", price);
    console.log("Image URLs:", imageUrls); 
    console.log("---------------------");
  }
})();
