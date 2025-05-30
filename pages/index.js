export default function Home() {
  const exampleProducts = [
    { id: 1, titulo: "Zapatilla Nike Air Max", precio: "$89.990", url: "#" },
    { id: 2, titulo: "Zapatilla Adidas Forum", precio: "$75.990", url: "#" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="mb-6">
        <img src="/logo.png" alt="Logo Snikah" className="h-10" />
      </header>

      <p className="mb-8 text-gray-400">Encuentra los mejores precios en zapatillas urbanas.</p>
      
      <ul className="space-y-6">
        {exampleProducts.map(p => (
          <li key={p.id} className="p-4 rounded-xl bg-[#1E1E1E] hover:bg-[#2c2c2c] transition">
            <a href={p.url} target="_blank" rel="noreferrer">
              <p className="text-lg">{p.titulo}</p>
              <p className="text-lime font-semibold">{p.precio}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
