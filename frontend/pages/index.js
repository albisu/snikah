// frontend/pages/index.js

import Head from "next/head";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Snikah — Comparador de Zapatillas</title>
        <meta name="description" content="Encuentra las mejores zapatillas al mejor precio. Rápido. Visual. Gratis." />
      </Head>

      <main className="flex-grow px-6 py-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Encuentra los mejores <br /> precios de sneakers en Chile
        </h2>
        <p className="text-lg text-gray-300 max-w-xl mb-8">
          Compara precios de todas las tiendas chilenas y encuentra tus sneakers favoritos al mejor precio.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/explorar" className="bg-[#32CD32] text-black px-6 py-3 rounded-full text-lg font-semibold inline-flex items-center gap-2 hover:scale-105 transition">
            Explorar Sneakers <ArrowRight size={20} />
          </Link>
          <a href="#features" className="bg-[#1E1E1E] border border-[#333] px-6 py-3 rounded-full text-lg font-semibold hover:border-[#32CD32] transition">
            Saber más
          </a>
        </div>
      </main>

      <section id="features" className="bg-[#1E1E1E] py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Precios en tiempo real</h3>
            <p className="text-sm text-gray-400">Nos conectamos directamente con las tiendas más importantes de Chile.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Interfaz moderna</h3>
            <p className="text-sm text-gray-400">Diseño limpio, rápido y visual para comparar sin complicaciones.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Monetización ética</h3>
            <p className="text-sm text-gray-400">100% gratuito para los usuarios. Ganamos por afiliación y publicidad no invasiva.</p>
          </div>
        </div>
      </section>

      <section id="nosotros" className="py-16 px-6 bg-[#121212]">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">¿Quiénes somos?</h3>
          <p className="text-gray-400 text-sm">
            Snikah es un proyecto joven, independiente y con visión. Nuestra meta es transformar cómo los jóvenes en Chile descubren y eligen zapatillas. Creamos herramientas útiles, visuales y accesibles, sin perder el estilo.
          </p>
        </div>
      </section>
    </Layout>
  );
}
