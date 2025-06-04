import requests
import base64
import json
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

API_URL = "https://www.theline.cl/_v/segment/graphql/v1"

QUERY_PARAMS = {
    "workspace": "master",
    "maxAge": "short",
    "appsEtag": "remove",
    "domain": "store",
    "locale": "es-CL",
    "__bindingId": "f1c1af77-3735-49ed-aa1c-c68479ad4d61",
    "operationName": "productSearchV3",
    "extensions": {
        "persistedQuery": {
            "version": 1,
            "sha256Hash": "e48b7999b5713c9ed7d378bea1bd1cf64c81080be71d91e0f0b427f41e858451",
            "sender": "vtex.store-resources@0.x",
            "provider": "vtex.search-graphql@0.x"
        }
    }
}

GENERO_CONFIG = {
    "hombre": {
        "map": "category-1,ft",
        "query": "zapatillas/hombre",
        "selectedFacets": [
            {"key": "category-1", "value": "zapatillas"},
            {"key": "ft", "value": "hombre"}
        ],
        "fullText": "hombre"
    },
    "mujer": {
        "map": "category-1,genero",
        "query": "zapatillas/mujer",
        "selectedFacets": [
            {"key": "category-1", "value": "zapatillas"},
            {"key": "genero", "value": "mujer"}
        ],
        "fullText": "mujer"
    }
}

def generar_variables(config, from_idx, to_idx):
    variables = {
        "hideUnavailableItems": False,
        "skusFilter": "ALL",
        "simulationBehavior": "default",
        "installmentCriteria": "MAX_WITHOUT_INTEREST",
        "productOriginVtex": False,
        "orderBy": "OrderByScoreDESC",
        "operator": "and",
        "fuzzy": "0",
        "searchState": None,
        "facetsBehavior": "Static",
        "categoryTreeBehavior": "default",
        "withFacets": False,
        "advertisementOptions": {
            "showSponsored": True,
            "sponsoredCount": 3,
            "advertisementPlacement": "top_search",
            "repeatSponsoredProducts": True
        },
        "from": from_idx,
        "to": to_idx,
        **config
    }
    json_str = json.dumps(variables)
    return base64.b64encode(json_str.encode("utf-8")).decode("utf-8")

def scrape():
    productos_totales = []
    step = 16

    for genero, config in GENERO_CONFIG.items():
        pagina = 0
        while True:
            from_idx = pagina * step
            to_idx = from_idx + (step - 1)
            variables_encoded = generar_variables(config, from_idx, to_idx)

            query = QUERY_PARAMS.copy()
            query["extensions"] = json.dumps({**QUERY_PARAMS["extensions"], "variables": variables_encoded})
            query["variables"] = "{}"

            print(f"🔎 {genero.upper()} — Página {pagina + 1} (from {from_idx} to {to_idx})")
            res = requests.get(API_URL, headers=HEADERS, params=query)

            if res.status_code != 200:
                print("❌ Error:", res.status_code)
                break

            data = res.json().get("data", {}).get("productSearch", {}).get("products", [])
            if not data:
                print("✅ Fin del catálogo")
                break

            for item in data:
                try:
                    producto = {
                        "nombre": item.get("productName"),
                        "precio": item.get("priceRange", {}).get("sellingPrice", {}).get("lowPrice"),
                        "imagen": item.get("items", [{}])[0].get("images", [{}])[0].get("imageUrl"),
                        "link": f'https://www.theline.cl/{item.get("linkText")}/p',
                        "genero": genero,
                        "marca": item.get("brand"),
                        "tienda": "theline",
                        "afiliado": False,
                        "url_afiliado": None
                    }
                    productos_totales.append(producto)
                except Exception as e:
                    print(f"⚠️ Producto descartado: {e}")

            pagina += 1
            time.sleep(1)

    return productos_totales
