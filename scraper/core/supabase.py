from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def subir_productos(productos):
    if not productos:
        return

    productos_dict = []
    for p in productos:
        if isinstance(p, dict):
            productos_dict.append(p)
        else:
            productos_dict.append(vars(p))  # Producto()

    # Eliminar duplicados por link
    productos_unicos = list({p["link"]: p for p in productos_dict}.values())

    for i in range(0, len(productos_unicos), 100):
        batch = productos_unicos[i:i+100]
        supabase.table("productos").upsert(batch, on_conflict="link").execute()
