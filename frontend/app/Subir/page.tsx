 
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "./SubirProducto";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

export default function AddProduct() {
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      toast.error("Debe seleccionar una imagen");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

   
    formData.append("producto", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("precio", data.precio);
    formData.append("stock", data.stock);
    formData.append("categoria", data.categoria);
    formData.append("imagen", selectedFile); 

    try {
  const res = await fetch(`${API_URL}/Api/productos/vendedor`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const raw = await res.text();
  console.log("RESPUESTA RAW", raw);

  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    result = null;
  }

  if (res.ok) {
    toast.success("Producto agregado correctamente");
    reset();
    setSelectedFile(null);
  } else {
    toast.error("Error al agregar producto", {
      description: result?.error || raw || "Error desconocido."
    });
  }

} catch (err) {
  console.error("Error en el fetch", err);
 
  };
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-6 border border-gray-100"
    >
      <h1 className="text-center text-gray-800 font-extrabold text-3xl underline">
        ¡Sube tu producto!
      </h1>

      <Label className="text-xl text-gray-700 font-light text-center">
        Nombre del producto
      </Label>
      <input {...register("nombre")} placeholder="Nombre" className="input" />

      <Label className="text-xl text-gray-700 font-light text-center">
        Descripción del producto
      </Label>
      <input {...register("descripcion")} placeholder="Descripción" className="input" />

      <Label className="text-xl text-gray-700 font-light text-center">Valor</Label>
      <input {...register("precio")} type="number" placeholder="Precio" className="input" />

      <Label className="text-xl text-gray-700 font-light text-center">Stock</Label>
      <input {...register("stock")} type="number" placeholder="Stock" className="input" />

      <Label className="text-xl text-gray-700 font-light text-center">Categoría</Label>
      <select {...register("categoria")} className="input">
        <option value="tecnologia">Tecnología</option>
        <option value="ropa">Ropa</option>
        <option value="supermercado">Supermercado</option>
        <option value="otros">Otros</option>
      </select>

      <Label className="text-xl text-gray-700 font-light text-center">Imagen</Label>
      <FileUpload onFileSelect={setSelectedFile} />

      <button
        type="submit"
        className="bg-orange-400 px-4 py-2 font-bold text-white rounded-lg hover:bg-orange-600 cursor-pointer transition duration-300"
      >
        Publicar producto
      </button>
    </form>
  );
  }