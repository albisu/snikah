import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ProductoGrid() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    async function fetchProductos() {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al obtener productos:', error)
      } else {
        setProductos(data || [])
      }
    }

    fetchProductos()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {productos.map((producto) => (
        <div key={producto.id} className="border p-2 rounded shadow">
          <img src={producto.imagen} alt={producto.nombre} className="w-full h-40 object-contain mb-2" />
          <p className="text-sm font-medium">{producto.nombre}</p>
          <p className="text-xs text-gray-500">{producto.marca} – {producto.genero}</p>
          <p className="font-semibold">${producto.precio.toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
