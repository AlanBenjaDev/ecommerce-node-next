"use client";

import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { calcularTotal, Carrito } from "../Carrito/utils";
import { useEffect } from "react"; 

interface CheckoutProps {
  cart: Carrito[];
}

initMercadoPago(
  process.env.MP_PUBLIC_KEY || "APP_USR-4e856bd1-5954-4f3f-b737-fcbf76828de5",
  { locale: "es-AR" }
);

export default function Checkout() {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [carrito, setCarrito] = useState<Carrito[]>([]);
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


  const [token, setToken] = useState<string | null>(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

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



  const handleCreatePreference = async () => {
    if (carrito.length === 0) return; 
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Compra en miEcommerce",
          unit_price: calcularTotal(carrito),
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Error al crear la preferencia");

      const data = await res.json();
      setPreferenceId(data.preferenceId);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al crear la preferencia de pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-3xl font-bold text-orange-500 mb-6">
      Total a pagar: ${calcularTotal(carrito).toFixed(2)} ARS 
      </p>

      <button
        onClick={handleCreatePreference}
        disabled={carrito.length === 0 || loading}
        className={`bg-orange-500 text-white px-6 py-3 rounded-2xl hover:bg-orange-600 transition ${
          carrito.length === 0 || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Creando preferencia..." : "Pagar con Mercado Pago"}
      </button>

      {preferenceId && (
        <div className="mt-6 w-full max-w-sm">
          <Wallet initialization={{ preferenceId }} />
        </div>
      )}
    </div>
  );
}