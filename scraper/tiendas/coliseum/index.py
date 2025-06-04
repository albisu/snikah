from playwright.sync_api import sync_playwright
from core.schema import Producto
from typing import List

URLS = {
    "hombre": "https://coliseumstore.cl/hombre/zapatillas/todo-zapatillas",
    "mujer": "https://coliseumstore.cl/mujer/zapatillas/todo-zapatillas"
}

MARCAS = ["Fila", "Converse", "Umbro", "Adidas", "Nike", "Puma", "Reebok", "Under Armour"]

def detectar_marca(nombre: str) -> str:
    for marca in MARCAS:
        if marca.lower() in nombre.lower():
            return marca
    return "Coliseum"

def scrape() -> List[dict]:
    productos = []
    links_vistos = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for genero, base_url in URLS.items():
            print(f"🔎 Coliseum — {genero.upper()}")
            page_num = 1

            while True:
                url = f"{base_url}?p={page_num}"
                try:
                    page.goto(url, timeout=60000)
                    try:
                        page.wait_for_selector(".product-item", timeout=10000)
                    except:
                        print(f"🚫 Fin del catálogo en pág {page_num}")
                        break
                    cards = page.query_selector_all(".product-item")

                    if not cards:
                        print(f"🚫 No hay más productos en pág {page_num}")
                        break

                    nuevos_en_esta_pagina = 0

                    for card in cards:
                        try:
                            nombre_tag = card.query_selector(".product-item-link")
                            precio_tag = card.query_selector(".price")
                            link_tag = card.query_selector("a")
                            img_tag = card.query_selector("img")

                            if not (nombre_tag and precio_tag and link_tag and img_tag):
                                continue

                            nombre = nombre_tag.inner_text().strip()
                            raw_precio = precio_tag.inner_text().replace("$", "").replace(".", "").strip()
                            if "-" in raw_precio:
                                raw_precio = raw_precio.split("-")[0].strip()
                            precio = int(raw_precio)

                            link = link_tag.get_attribute("href")
                            if not link.startswith("http"):
                                link = "https://coliseumstore.cl" + link

                            if link in links_vistos:
                                continue
                            links_vistos.add(link)
                            nuevos_en_esta_pagina += 1

                            imagen = img_tag.get_attribute("src")
                            if imagen.startswith("//"):
                                imagen = "https:" + imagen

                            producto = Producto(
                                tienda="coliseum",
                                nombre=nombre,
                                precio=precio,
                                link=link,
                                imagen=imagen,
                                marca=detectar_marca(nombre),
                                genero=genero
                            )

                            productos.append(producto.dict())

                        except Exception as e:
                            print(f"⚠️ Error con un producto ({genero}, pág {page_num}): {e}")

                    print(f"✅ Página {page_num} — {nuevos_en_esta_pagina} productos nuevos")

                    if nuevos_en_esta_pagina == 0:
                        print("🚫 Se repiten los productos. Fin.")
                        break

                    page_num += 1

                except Exception as e:
                    print(f"❌ Error en {genero}, página {page_num}: {e}")
                    break

        browser.close()
        print(f"🧪 Total productos Coliseum preparados para subida: {len(productos)}")
    return [p.__dict__ for p in productos]