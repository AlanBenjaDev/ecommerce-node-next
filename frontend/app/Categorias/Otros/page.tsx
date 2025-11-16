"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
  categoria: string;
}

export default function CategoriaPage() {
  const params = useParams();
  const nombreCategoria = params?.nombreCategoria as string;
 const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Product[]>([]);
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!nombreCategoria) return;

    const fetchProductos = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/productos/productos/otros`
        );
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, [nombreCategoria]);



  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando productos</p>
      </main>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 capitalize">
        Categoría: {nombreCategoria}
      </h1>

      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map((p) => (
            <div key={p.id} className="border rounded-lg p-3 shadow-md">
              <img
               src={`${p.img_url}`}
                alt={p.producto}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="font-semibold">{p.producto}</h2>
              <p className="text-gray-700">${p.precio}</p>
              <button
                onClick={() => (window.location.href = `/producto/${p.id}`)}
                className="mt-2 w-full bg-blue-600 text-white rounded-lg py-1 hover:bg-blue-700 transition"
              >
                Ver producto
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}