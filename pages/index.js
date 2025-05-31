export default function Home() {
  const exampleProducts = [
    {
      id: 1,
      titulo: "Zapatilla Nike Shox",
      precio: "$89.990",
      url: "#",
      imagen: "/shox.png"
    },
    {
      id: 2,
      titulo: "Zapatilla Adidas Forum Low",
      precio: "$75.990",
      url: "#",
      imagen: "/forum.png"
    }
];

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="mb-6">
        <img src="/logo.png" alt="Logo Snikah" className="h-10" />
      </header>

      <p className="mb-8 text-gray-400">Encuentra los mejores precios en zapatillas urbanas.</p>
      
     <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exampleProducts.map(p => (
          <li
            key={p.id}
            className="flex flex-col p-4 rounded-xl bg-[#1E1E1E] hover:bg-[#2c2c2c] transition"
          >
            <img
              src={p.imagen}
              alt={p.titulo}
              className="w-full h-48 object-contain mb-4"
            />
            <div className="mt-auto text-center">
              <p className="text-base font-semibold">{p.titulo}</p>
              <p className="text-lime font-semibold">{p.precio}</p>
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-12 text-gray-500 text-sm">
        <p>© 2025 Snikah. Todos los derechos reservados.</p>
        <p>Hecho con ❤️ por tu nombre</p>
      </footer>
    </div>
  );
}
