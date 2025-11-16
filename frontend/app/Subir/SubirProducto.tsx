
"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function FileUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file); 
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-600">
            <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
          </p>
          <p className="text-xs text-gray-400">PNG, JPG o WEBP (máx. 5MB)</p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {preview && (
        <div className="mt-4 w-32 h-32 rounded-xl overflow-hidden shadow-md border border-gray-200">
          <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}