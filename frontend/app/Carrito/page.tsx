"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Carrito } from "./utils";
import { calcularTotal } from "./utils";
import Link from "next/link";

export default function CarritoList() {
  const [carrito, setCarrito] = useState<Carrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


  useEffect(() => {
    if (typeof window !== "undefined") {
     const storedToken = localStorage.getItem("accessToken");
      setToken(storedToken);
      setIsTokenChecked(true);
    }
  }, []);

  useEffect(() => {
    if (!token) return; 

    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/api/carrito/Ver`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al mostrar el carrito");
        const data: Carrito[] = await res.json();
        setCarrito(data);
      } catch (err: any) {
        setError(err.message || "Error al mostrar el carrito");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  useEffect(() => {
    if (isTokenChecked && !token) {
      toast.error("Debes iniciar sesión para ver el carrito", { duration: 3000 });
    }
  }, [isTokenChecked, token]);


  if (!isTokenChecked || loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando tu carrito...</p>
      </main>
    );
  }

  if (!token) {
    return (
      <p className="text-center mt-10 text-red-500">
        Inicia sesión para ver tu carrito.
      </p>
    );
  }

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  



  return (
    <main className="min-h-screen bg-gray-100 py-8 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Mi carrito</h1>
      <div className="grid grid-cols-1 space-y-2 max-w-4xl mx-auto">
        {carrito.map((cart) => (
          <div
            key={cart.id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col items-center cursor-pointer"
          >
            <img
               src={`${cart.img_url}`}
              alt={cart.producto}
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{cart.producto}</h2>
            <p className="text-orange-500 font-bold text-lg mt-2">${cart.precio} ARS</p>
            <p className="text-gray-600 font-light text-lg mt-2">
              Cantidad: {cart.cantidad}
            </p>
          </div>
        ))}

      
        <div className="bg-white p-6 rounded-2xl shadow-md mt-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total del Carrito</h2>
          <p className="text-3xl font-bold text-orange-500 mb-6">
            ${calcularTotal(carrito).toFixed(2)} ARS
          </p>

         <Link href="/Pago">
          <button className="bg-green-500 hover:bg-green-600 transition-colors text-white px-8 py-3 rounded-lg font-medium">
            Finalizar Compra
          </button>
          </Link>
        </div>
      </div>
    </main>
  );
}