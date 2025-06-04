from tiendas.coliseum.index import scrape as scrape_coliseum
from tiendas.theline.index import scrape as scrape_theline
from core.validator import producto_valido
from core.supabase import subir_productos

TIENDAS = {
    "coliseum": scrape_coliseum,
    "theline": scrape_theline,
}

for nombre, scrape_fn in TIENDAS.items():
    print(f"🔍 Scrapeando {nombre}...")
    try:
        productos = scrape_fn()
        productos_validos = [p for p in productos if producto_valido(p)]
        print(f"✅ {len(productos_validos)} productos válidos")
        subir_productos(productos_validos)  # <- Esto sube los datos reales
    except Exception as e:
        print(f"❌ Error en {nombre}: {e}")
