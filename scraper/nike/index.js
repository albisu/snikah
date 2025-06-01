const puppeteer = require("puppeteer");
const fs = require("fs");

const GENEROS = [
  { genero: "hombre", url: "https://www.nike.cl/hombre/zapatillas" },
  { genero: "mujer", url: "https://www.nike.cl/mujer/zapatillas" },
  { genero: "niños", url: "https://www.nike.cl/ninos/zapatillas" },
];

const productosPorPagina = 18;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  const productosTotales = [];

  for (const { genero, url } of GENEROS) {
    console.log(`\n🚀 Iniciando scraping para: ${genero.toUpperCase()}`);
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
      let pagina = 0;

      while (true) {
        const from = pagina * productosPorPagina;
        const to = from + productosPorPagina - 1;
        const apiUrl = buildApiUrl(from, to);

        console.log(`🔎 ${genero}: productos ${from} - ${to}`);
        const productos = await page.evaluate(async (finalUrl) => {
          const res = await fetch(finalUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          const json = await res.json();
          const lista = json?.data?.productSearch?.products ?? [];

          return lista.map((prod) => {
            const item = prod.items?.[0];
            const seller = item?.sellers?.[0];
            return {
              nombre: prod.productName,
              precio: seller?.commertialOffer?.Price ?? null,
              imagen: item?.images?.[0]?.imageUrl ?? null,
              link: "https://www.nike.cl/" + prod.linkText + "/p",
            };
          });
        }, apiUrl);

        const filtrados = productos
          .filter((p) => p.precio && p.nombre && p.imagen)
          .map((p) => ({
            ...p,
            genero,
            marca: "Nike",
            tienda: "nike",
          }));

        if (filtrados.length === 0) break;

        productosTotales.push(...filtrados);
        pagina++;
      }
    } catch (err) {
      console.error(`❌ Error en ${genero}:`, err.message);
    }
  }

  console.log(`\n✅ Total productos capturados: ${productosTotales.length}`);
  const path = require("path");
  const outputPath = path.join(__dirname, "productos.json");
  fs.writeFileSync(outputPath, JSON.stringify(productosTotales, null, 2));
  console.log("📄 Guardado como nike/productos.json");

  await browser.close();
})();

function buildApiUrl(from, to) {
  const variables = {
    hideUnavailableItems: false,
    skusFilter: "ALL_AVAILABLE",
    simulationBehavior: "default",
    installationCriteria: "MAX_WITHOUT_INTEREST",
    productOriginVtex: false,
    map: "c,c",
    query: "nike/calzado",
    orderBy: "OrderByReleaseDateDESC",
    from,
    to,
    selectedFacets: [
      { key: "c", value: "nike" },
      { key: "c", value: "calzado" },
    ],
    operator: "and",
    fuzzy: "0",
    searchState: null,
    facetsBehavior: "Static",
    withFacets: false,
  };

  const encodedVars = encodeURIComponent(
    Buffer.from(JSON.stringify(variables)).toString("base64")
  );

  return `https://www.nike.cl/_v/segment/graphql/v1?workspace=master&maxAge=short&appsEtag=remove&domain=store&locale=es-CL&__bindingId=b0a52373-16d4-42d3-96e7-49b585167c9d&operationName=productSearchV3&variables=%7B%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22e48b7999b5713c9ed7d378bea1bd1cf64c81080be71d91e0f0b427f41e858451%22%2C%22sender%22%3A%22vtex.store-resources%400.x%22%2C%22provider%22%3A%22vtex.search-graphql%400.x%22%7D%2C%22variables%22%3A%22${encodedVars}%22%7D`;
}
