const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  try {
    await page.goto("https://www.adidas.cl/zapatillas", {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    console.log("✅ Página cargada. Buscando productos...");

    await page.waitForSelector("[data-auto-id='product-tile']", { timeout: 10000 });

    const productos = await page.$$eval("[data-auto-id='product-tile']", (tiles) =>
      tiles.map((el) => ({
        nombre: el.querySelector("[data-auto-id='product-title']")?.innerText.trim(),
        precio: el.querySelector("[data-auto-id='product-price']")?.innerText.trim(),
      }))
    );

    console.log("🧩 Productos encontrados:", productos.length);
    console.log(productos.slice(0, 5));
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await browser.close();
  }
})();
