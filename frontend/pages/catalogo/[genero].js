// frontend/pages/catalogo/[genero].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Layout from "../../components/Layout";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CatalogoGenero() {
  const router = useRouter();
  const { genero } = router.query;

  const [productos, setProductos] = useState([]);
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);

  useEffect(() => {
    if (!genero) return;
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .ilike("genero", `%${genero}%`);

      if (!error && data) {
        setProductos(data);
        const marcas = [...new Set(data.map((p) => p.marca))].sort();
        setMarcasDisponibles(marcas);
      }
    };
    fetchData();
  }, [genero]);

  const productosFiltrados = productos.filter((p) => {
    const coincideMarca = marcaFiltro ? p.marca === marcaFiltro : true;
    const coincideBusqueda = busqueda
      ? p.modelo?.includes(busqueda.toLowerCase())
      : true;
    return coincideMarca && coincideBusqueda;
  });

  return (
    <Layout>
      <div className="bg-[#121212] text-white min-h-screen px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 capitalize">Catálogo: {genero}</h1>

        <input
          type="text"
          placeholder="Buscar modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/2 mb-6 p-3 rounded bg-[#1E1E1E] text-white border border-[#32CD32]"
        />

        <div className="flex gap-8">
          {/* Sidebar filtro */}
          <aside className="w-48">
            <h2 className="text-lg font-semibold mb-2">Filtrar por marca</h2>
            <ul className="text-sm space-y-2">
              <li>
                <button
                  onClick={() => setMarcaFiltro("")}
                  className={`hover:text-[#32CD32] ${!marcaFiltro ? "text-[#32CD32] font-bold" : ""}`}
                >
                  Todas las marcas
                </button>
              </li>
              {marcasDisponibles.map((marca) => (
                <li key={marca}>
                  <button
                    onClick={() => setMarcaFiltro(marca)}
                    className={`hover:text-[#32CD32] ${marcaFiltro === marca ? "text-[#32CD32] font-bold" : ""}`}
                  >
                    {marca}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Grid de productos */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
            {productosFiltrados.map((p) => (
              <div
                key={p.id}
                className="bg-[#1E1E1E] border border-[#32CD32] rounded-lg p-4 shadow-md hover:scale-[1.02] transition"
              >
                <img src={p.imagen} alt={p.nombre} className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="text-lg font-semibold mb-2">{p.nombre}</h3>
                <p className="text-[#32CD32] font-bold mb-2">${p.precio}</p>
                {p.slug ? (
                  <a
                    href={`/producto/${p.slug}`}
                    className="block text-center bg-[#32CD32] text-black py-2 rounded hover:scale-105 transition"
                  >
                    Ver producto
                  </a>
                ) : (
                  <div className="text-center text-sm text-gray-400 mt-2">Sin enlace disponible</div>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </Layout>
  );
}
