// frontend/pages/producto/[slug].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Layout from "../../components/Layout";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProductoPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [productos, setProductos] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("slug", slug);

      if (error || !data || data.length === 0) {
        setNotFound(true);
      } else {
        setProductos(data);
      }
    };
    fetchProductos();
  }, [slug]);

  if (notFound) {
    return (
      <Layout>
        <div className="text-center py-20 text-red-400">Producto no encontrado</div>
      </Layout>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20 text-gray-400">Cargando producto...</div>
      </Layout>
    );
  }

  const producto = productos[0];

  return (
    <Layout>
      <div className="bg-[#121212] text-white min-h-screen px-6 py-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-auto rounded-lg shadow"
            />
            {/* Aquí en el futuro podrías insertar vista 360º */}
          </div>

          {/* Detalles del producto */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
            <p className="text-gray-400 mb-4">Género: {producto.genero}</p>
            <p className="text-sm mb-6">Marca: {producto.marca}</p>

            <h2 className="text-xl font-semibold mb-3">Disponible en:</h2>
            <div className="space-y-3">
              {productos.map((tienda) => (
                <div
                  key={tienda.id}
                  className="bg-[#1E1E1E] border border-[#32CD32] p-4 rounded-lg"
                >
                  <p className="font-semibold">{tienda.tienda}</p>
                  <p className="text-[#32CD32] text-lg font-bold">${tienda.precio}</p>
                  <a
                    href={tienda.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 bg-[#32CD32] text-black py-2 px-4 rounded"
                  >
                    Ir a tienda
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
