import os
import json
from supabase import create_client, Client

# Configuración
SUPABASE_URL = "https://pchxurahbaoeodgctdtn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjaHh1cmFoYmFvZW9kZ2N0ZHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjAyOTYsImV4cCI6MjA2NDI5NjI5Nn0.5WrgitaExCT6fYrezq671BZSfL7D1i9uaG2HO9El8MQ"  # <-- reemplázala

CARPETA_SCRAPER = "scraper"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def es_producto_valido(p):
    return (
        p.get("nombre") and
        p.get("url") and
        p.get("precio") and
        p.get("imagen") and
        p.get("marca") and
        p.get("genero")
    )

def subir_todos_los_productos():
    total_subidos = 0
    total_descartados = 0

    for tienda in os.listdir(CARPETA_SCRAPER):
        carpeta = os.path.join(CARPETA_SCRAPER, tienda)
        archivo = os.path.join(carpeta, "productos.json")

        if not os.path.isfile(archivo):
            continue

        print(f"\n📂 Procesando tienda: {tienda}")
        with open(archivo, "r", encoding="utf-8") as f:
            try:
                productos = json.load(f)
            except Exception as e:
                print(f"❌ Error al leer {archivo}: {e}")
                continue

        productos_validos = []
        productos_descartados = []

        for p in productos:
            if es_producto_valido(p):
                productos_validos.append({
                    "nombre": p["nombre"],
                    "link": p["url"],
                    "precio": int(p["precio"]),
                    "imagen": p["imagen"],
                    "marca": p["marca"],
                    "genero": p["genero"],
                    "tienda": tienda
                })
            else:
                productos_descartados.append(p)

        for i in range(0, len(productos_validos), 500):
            batch = productos_validos[i:i+500]
            supabase.table("productos").insert(batch).execute()

        print(f"✅ Subidos: {len(productos_validos)}")
        print(f"🗑️ Descartados: {len(productos_descartados)}")

        total_subidos += len(productos_validos)
        total_descartados += len(productos_descartados)

    print("\n📊 Resumen final")
    print(f"✔️ Total subidos: {total_subidos}")
    print(f"❌ Total descartados: {total_descartados}")

if __name__ == "__main__":
    subir_todos_los_productos()
