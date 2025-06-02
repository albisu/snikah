import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchProductos() {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener productos:', error);
      } else {
        setProductos(data);
      }
    }

    fetchProductos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="flex items-center gap-4 mb-6">
        <img src="/logo.png" alt="Logo Snikah" className="h-10" />
      </header>

      <p className="mb-8 text-gray-400">Encuentra los mejores precios en zapatillas urbanas.</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (
          <li
            key={p.id}
            className="flex flex-col p-4 rounded-xl bg-[#1E1E1E] hover:bg-[#2c2c2c] transition"
          >
            <a href={p.link} target="_blank" rel="noopener noreferrer">
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-48 object-contain mb-4 bg-transparent mix-blend-multiply brightness-[1.6] contrast-[1.2] drop-shadow-md"
                style={{ backgroundColor: 'transparent' }}
              />
            </a>
            <div className="mt-auto text-center">
              <p className="text-base font-semibold">{p.nombre}</p>
              <p className="text-lime font-semibold">${p.precio.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
