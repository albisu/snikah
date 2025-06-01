const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 🔐 Credenciales Supabase
const supabaseUrl = 'https://pchxurahbaoeodgctdtn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjaHh1cmFoYmFvZW9kZ2N0ZHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjAyOTYsImV4cCI6MjA2NDI5NjI5Nn0.5WrgitaExCT6fYrezq671BZSfL7D1i9uaG2HO9El8MQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// 📦 Cargar productos
const productosNike = JSON.parse(fs.readFileSync(path.join(__dirname, 'nike', 'productos.json')));
const productosColiseum = JSON.parse(fs.readFileSync(path.join(__dirname, 'coliseum', 'productos.json')));

// 🔧 Limpiar precio
const parsePrecio = (precio) => parseInt(String(precio).replace(/[^0-9]/g, ''), 10);

// 🧩 Unificar y formatear productos
let productos = [
  ...productosNike.map(p => ({ ...p, tienda: 'nike' })),
  ...productosColiseum.map(p => ({ ...p, tienda: 'coliseum' }))
];

productos = productos.map(p => ({
  nombre: p.nombre,
  imagen: p.imagen,
  url: p.link,
  precio: parsePrecio(p.precio),
  genero: p.genero,
  marca: p.marca,
  tienda: p.tienda,
  origen_id: null
}));

// 🧼 Filtrar válidos
const total = productos.length;
const productosValidos = productos.filter(p =>
  p.nombre && p.precio && p.genero && p.marca
);

console.log(`📦 Productos válidos para subir: ${productosValidos.length}`);
console.log(`🗑️ Productos descartados: ${total - productosValidos.length}`);
console.log('🔍 Ejemplo:', productosValidos[0]);

// 🚀 Subida en lotes
(async () => {
  const batchSize = 50;

  for (let i = 0; i < productosValidos.length; i += batchSize) {
    const batch = productosValidos.slice(i, i + batchSize);
    const { data, error } = await supabase.from('productos').insert(batch);

    if (error) {
      console.error(`❌ Error al subir lote ${i}–${i + batch.length - 1}:`, error);
    } else if (data) {
      console.log(`✅ Lote subido correctamente (${data.length} productos)`);
    } else {
      console.log(`⚠️ Lote ${i}–${i + batch.length - 1} enviado, sin respuesta`);
    }
  }
})();
