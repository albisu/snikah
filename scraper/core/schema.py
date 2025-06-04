from pydantic import BaseModel
from typing import Optional

class Producto(BaseModel):
    tienda: str
    nombre: str
    precio: int
    link: str
    imagen: Optional[str] = None
    marca: Optional[str] = None
    genero: Optional[str] = None
    afiliado: bool = False
    url_afiliado: Optional[str] = None
