const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const urls = {
  hombre: "https://coliseumstore.cl/hombre/zapatillas/todo-zapatillas",
  mujer: "https://coliseumstore.cl/mujer/zapatillas/todo-zapatillas"
};

function detectarMarca(nombre) {
  const marcas = ["Fila", "Converse", "Umbro", "Adidas", "Nike", "Puma", "Reebok", "Under Armour"];
  for (let marca of marcas) {
    if (nombre?.toLowerCase().includes(marca.toLowerCase())) {
      return marca;
    }
  }
  return "Desconocida";
}

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  let resultados = [];

  for (const [genero, url] of Object.entries(urls)) {
    console.log(`🔍 Scrapeando productos de: ${genero}`);
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector(".product-item");

    const productos = await page.$$eval(".product-item", items =>
      items.map(item => {
        const nombre = item.querySelector(".product-item-link")?.innerText?.trim();
        const precio = item.querySelector(".price")?.innerText?.trim();
        const imagen = item.querySelector("img")?.src;
        const link = item.querySelector("a")?.href;
        return { nombre, precio, imagen, link };
      })
    );

    console.log(`🧩 Productos encontrados (${genero}): ${productos.length}`);
    resultados.push(...productos.map(p => ({ ...p, genero })));
  }

  await browser.close();

  // Filtrar elementos sin nombre o precio
  const productosFiltrados = resultados.filter(p => p.nombre && p.precio);

  // Detectar marca
  productosFiltrados.forEach(p => {
    p.marca = detectarMarca(p.nombre);
  });

  // Guardar archivo en coliseum/productos.json
  const outputPath = path.join(__dirname, "productos.json");
  fs.writeFileSync(outputPath, JSON.stringify(productosFiltrados, null, 2));
  console.log(`📄 Resultados guardados en: ${outputPath}`);
})();
