"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

interface Product {
  id: number;
  producto: string;
  descripcion: string;
  precio: number;
  img_url: string;
  stock: number;
}

if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
  throw new Error("Falta la clave pública de Mercado Pago en el .env");
}

initMercadoPago(
  process.env.NEXT_PUBLIC_MP_PUBLIC_KEY,
  { locale: "es-AR" }
);

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${API_URL}/Api/productos/producto/${id}`);

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const data = await res.json();
      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

 if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando producto seleccionado</p>
      </main>
    );
  }
  if (!product) return <p>No se encontró el producto.</p>;

  const agregarAlCarrito = async (producto_id: number) => {
    if (!token) {
      toast.error("Debes iniciar sesión para agregar al carrito", { duration: 3000 });
      return;
    }

    console.log("Enviando producto al backend:", {
      producto_id,
      cantidad: 1,
      token: token ? "Existe" : "No Existe",
    });

    const res = await fetch(`${API_URL}/api/carrito/agregar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ producto_id, cantidad: 1 }),
    });

    const texto = await res.text();
    console.log("Respuesta backend:", texto);
    console.log("Código estado:", res.status);

    if (res.ok) {
      toast.success("Producto agregado al carrito", { duration: 3000 });
    } else {
      toast.error("Error al agregar producto", { duration: 3000 });
    }
  };

  const handleCreatePreference = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Compra en miEcommerce",
          unit_price: product.precio,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Error al crear preferencia");

      const data = await res.json();
      setPreferenceId(data.preferenceId);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      <img
         src={`${product.img_url}`}
        alt={product.producto}
        className="w-full md:w-1/2 rounded-lg"
      />
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.producto}</h1>
        <p className="text-gray-600 mb-4">{product.descripcion}</p>
        <p className="text-2xl font-semibold text-orange-600 mb-6">${product.precio}</p>
 
        <div className="flex flex-row md:flex-col gap-4">
          <button
            onClick={handleCreatePreference}
            className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600 text-white"
          >
            {loading ? "Creando preferencia..." : "Pagar con Mercado Pago"}
          </button>

          {preferenceId && (
            <div className="mt-6 w-full max-w-sm">
              <Wallet initialization={{ preferenceId }} />
            </div>
          )}

          <button
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            onClick={() => agregarAlCarrito(product.id)}
          >
            Agregar al carrito
          </button>
                      {product.precio > 15000 && (
  <p className="text-white bg-[#2E7D32] px-2 py-1 rounded-md text-sm mt-2">
    ¡Envío gratis!
  </p>
)}
        </div>
      </div>
    </div>
  );
}
