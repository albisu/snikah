def producto_valido(p):
    campos = ["nombre", "precio", "imagen", "link"]
    return all(getattr(p, c, None) for c in campos)
