"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
}

export default function ProductList() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/Api/productos/producto`); 
        if (!res.ok) throw new Error("Error al traer productos");
        const data: Product[] = await res.json();
        setProductList(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);



  
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;



  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando productos</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">🛍️ Nuestros Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
     {productList.map((product) => {
  console.log("img_url:", product.img_url); 
  return (
    <Link key={product.id} href={`/Products/${product.id}`}>
      <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col items-center cursor-pointer text-[#1A73E8]">
        <img
          src={`${product.img_url}`}
          alt={product.producto}
          className="w-48 h-48 object-cover rounded-lg mb-4"
        />
        <h2 className="text-sm font-semibold text-gray-800 hover:text-[#1A73E8] transition-all ">{product.producto}</h2>
        <h3 className="text-orange-500 font-extrabold text-3xl mt-2">${product.precio}</h3>
    {product.precio > 15000 && (
  <p className="text-white bg-[#2E7D32] px-2 py-1 rounded-md text-sm mt-2">
    ¡Envío gratis!
  </p>
)}

      </div>
    </Link>
  );
})}
      </div>
    </main>
  );
}