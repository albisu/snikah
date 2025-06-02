import { useState } from "react";
import { Search } from "lucide-react";

export default function Comparador() {
  const [zapatillas, setZapatillas] = useState([
    {
      nombre: "Nike Air Max 90",
      imagen: "/zapatillas/nike-air-max.jpg",
      precio: "$69.990",
      tienda: "Nike.cl",
      tallas: "38-45",
      colores: "Blanco, Negro",
      url: "https://www.nike.cl/air-max-90",
    },
    {
      nombre: "Adidas Forum Low",
      imagen: "/zapatillas/adidas-forum.jpg",
      precio: "$54.990",
      tienda: "Falabella",
      tallas: "36-44",
      colores: "Azul, Blanco",
      url: "https://www.falabella.com/forum-low",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Comparador de Zapatillas</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Buscar zapatilla..."
            className="bg-[#1E1E1E] text-white p-2 rounded w-full outline-none"
          />
          <button className="bg-[#32CD32] text-black p-2 rounded">
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zapatillas.map((z, i) => (
            <div
              key={i}
              className="bg-[#1E1E1E] border border-[#32CD32] rounded-lg p-4 shadow-md transition-transform hover:scale-[1.02]"
            >
              <img
                src={z.imagen}
                alt={z.nombre}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{z.nombre}</h2>
              <p className="text-[#32CD32] font-bold">
                {z.precio} <span className="text-sm">({z.tienda})</span>
              </p>
              <p className="text-sm mt-1">Tallas: {z.tallas}</p>
              <p className="text-sm">Colores: {z.colores}</p>
              <a
                href={z.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-center bg-[#32CD32] text-black py-2 px-4 rounded"
              >
                Ir a tienda
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
