const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Supabase config
const supabaseUrl = "https://pchxurahbaoeodgctdtn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjaHh1cmFoYmFvZW9kZ2N0ZHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjAyOTYsImV4cCI6MjA2NDI5NjI5Nn0.5WrgitaExCT6fYrezq671BZSfL7D1i9uaG2HO9El8MQ";
const supabase = createClient(supabaseUrl, supabaseKey);

// Carpetas a procesar
const carpetas = ["nike", "coliseum"];

(async () => {
  let productosTotales = [];

  for (const carpeta of carpetas) {
    const ruta = path.join(__dirname, carpeta, "productos.json");

    if (!fs.existsSync(ruta)) {
      console.warn(`⚠️ Archivo no encontrado: ${ruta}`);
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(ruta, "utf8"));

      const productos = data.map((p) => {
        const { url, ...rest } = p;

        // Convertir precio si es string con símbolo/puntos
        const precio = typeof p.precio === "string"
          ? parseInt(p.precio.replace(/\$|\./g, ""), 10)
          : p.precio;

        return {
          ...rest,
          link: p.link || url,
          precio,
          tienda: p.tienda || carpeta, // fallback por carpeta si no viene
          marca: p.marca || "Nike",
          genero: p.genero || "sin definir",
        };
      });

      console.log(`✅ ${carpeta}: ${productos.length} productos cargados`);
      productosTotales.push(...productos);
    } catch (err) {
      console.error(`❌ Error al leer ${carpeta}:`, err.message);
    }
  }

  console.log(`\n📦 Total productos a subir: ${productosTotales.length}`);

  let exitosos = 0;
  let fallidos = 0;

  for (let i = 0; i < productosTotales.length; i += 50) {
    const chunk = productosTotales.slice(i, i + 50);

    const { error } = await supabase
      .from("productos")
      .insert(chunk, {
        upsert: false, // cambia a true si quieres evitar duplicados
        // onConflict: ['link'] // si usas upsert, debes tener esta línea y clave única en Supabase
      });

    if (error) {
      console.error(`❌ Error al subir productos ${i}-${i + 49}:`, error.message);
      fallidos += chunk.length;
    } else {
      console.log(`✅ Subidos productos ${i} - ${i + chunk.length - 1}`);
      exitosos += chunk.length;
    }
  }

  console.log(`\n📊 Resultado final:`);
  console.log(`✔️ Éxitos: ${exitosos}`);
  console.log(`❌ Fallidos: ${fallidos}`);
})();
