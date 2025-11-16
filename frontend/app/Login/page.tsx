"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"

type FormData = {
  user: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/Api/Usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
   localStorage.setItem("accessToken", result.accessToken);

        

      
       toast.success("Inicio de sesión exitoso",{
        duration:3000,
        description:"Tu cuenta fue logueada exitosamente."
       })
        router.push("/Products");
      } else {
        toast.error("Error al iniciar sesión",{
          duration:3000,
          description:"Verifica el usuario o la contraseña y vuelve a intentarlo."
        })
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-5 border border-gray-100"
    >
      <h1 className="text-gray-900 font-bold text-4xl text-center mb-2">Inicia sesión</h1>

      <div className="flex flex-col space-y-2">
        <label className="text-lg font-semibold text-gray-800">Usuario</label>
        <input
          type="text"
          {...register("user", { required: "El usuario es obligatorio" })}
          className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Ingresa tu usuario"
        />
        {errors.user && <p className="text-red-500 text-sm">{errors.user.message}</p>}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-lg font-semibold text-gray-800">Contraseña</label>
        <input
          type="password"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
          })}
          className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
        } text-white py-3 rounded-lg transition-all font-semibold text-lg shadow-md hover:shadow-lg`}
      >
        {loading ? "Iniciando sesión..." : "Inicia sesión"}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-2">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-orange-500 hover:underline">Regístrate</a>
      </p>
    </form>
  );
}