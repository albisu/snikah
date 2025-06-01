const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  const productosTotales = [];
  const productosPorPagina = 18;
  let pagina = 0;

  try {
    await page.goto("https://www.nike.cl/zapatillas", {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    console.log("🚀 Iniciando scraping por páginas...");

    while (true) {
      const from = pagina * productosPorPagina;
      const to = from + productosPorPagina - 1;

      const url = buildApiUrl(from, to);

      console.log(`🔎 Scrapeando productos ${from} - ${to}`);

      const productos = await page.evaluate(async (finalUrl) => {
        const res = await fetch(finalUrl, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        const lista = json?.data?.productSearch?.products ?? [];

        return lista.map(prod => {
          const item = prod.items?.[0];
          const seller = item?.sellers?.[0];
          return {
            nombre: prod.productName,
            precio: seller?.commertialOffer?.Price ?? null,
            imagen: item?.images?.[0]?.imageUrl ?? null,
            link: "https://www.nike.cl/" + prod.linkText + "/p",
          };
        });
      }, url);

      if (productos.length === 0) break;

      productosTotales.push(...productos);
      pagina++;
    }

    console.log(`✅ Total productos capturados: ${productosTotales.length}`);
    fs.writeFileSync("productos_nike.json", JSON.stringify(productosTotales, null, 2));
    console.log("📄 Guardado como productos_nike.json");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await browser.close();
  }
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
      { key: "c", value: "calzado" }
    ],
    operator: "and",
    fuzzy: "0",
    searchState: null,
    facetsBehavior: "Static",
    withFacets: false
  };

  const encodedVars = encodeURIComponent(Buffer.from(JSON.stringify(variables)).toString("base64"));

  return `https://www.nike.cl/_v/segment/graphql/v1?workspace=master&maxAge=short&appsEtag=remove&domain=store&locale=es-CL&__bindingId=b0a52373-16d4-42d3-96e7-49b585167c9d&operationName=productSearchV3&variables=%7B%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22e48b7999b5713c9ed7d378bea1bd1cf64c81080be71d91e0f0b427f41e858451%22%2C%22sender%22%3A%22vtex.store-resources%400.x%22%2C%22provider%22%3A%22vtex.search-graphql%400.x%22%7D%2C%22variables%22%3A%22${encodedVars}%22%7D`;
}
