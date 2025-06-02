import os
import json
import re
from supabase import create_client, Client

# Configuración
SUPABASE_URL = "https://pchxurahbaoeodgctdtn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjaHh1cmFoYmFvZW9kZ2N0ZHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjAyOTYsImV4cCI6MjA2NDI5NjI5Nn0.5WrgitaExCT6fYrezq671BZSfL7D1i9uaG2HO9El8MQ"

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

def generar_slug(texto):
    texto = texto.lower()
    texto = re.sub(r"[^a-z0-9\s-]", "", texto)
    texto = re.sub(r"\s+", "-", texto)
    return texto.strip("-")

def normalizar_modelo(nombre):
    nombre = nombre.lower()
    nombre = re.sub(r"[^a-z0-9\s]", "", nombre)
    return nombre.strip()

def subir_todos_los_productos():
    total_subidos = 0
    total_actualizados = 0
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
                match = re.search(r"/([a-z0-9-]{6,})", p["url"].lower())
                slug = match.group(1) if match else generar_slug(p["nombre"])

                productos_validos.append({
                    "nombre": p["nombre"],
                    "slug": slug,
                    "link": p["url"],
                    "precio": int(p["precio"]),
                    "imagen": p["imagen"],
                    "marca": p["marca"],
                    "genero": p["genero"],
                    "tienda": tienda,
                    "modelo": normalizar_modelo(p["nombre"])
                })
            else:
                productos_descartados.append(p)

        for producto in productos_validos:
            resp = supabase.table("productos")\
                .upsert(producto, on_conflict=["link"]).execute()

            if resp.data and len(resp.data) == 1:
                if resp.data[0].get("created_at") == resp.data[0].get("updated_at"):
                    total_subidos += 1
                else:
                    total_actualizados += 1

        print(f"✅ Subidos nuevos: {total_subidos}")
        print(f"🆙 Actualizados existentes: {total_actualizados}")
        print(f"🗑️ Descartados: {len(productos_descartados)}")

        total_descartados += len(productos_descartados)

    print("\n📊 Resumen final")
    print(f"✔️ Total nuevos: {total_subidos}")
    print(f"🔄 Total actualizados: {total_actualizados}")
    print(f"❌ Total descartados: {total_descartados}")

if __name__ == "__main__":
    subir_todos_los_productos()
