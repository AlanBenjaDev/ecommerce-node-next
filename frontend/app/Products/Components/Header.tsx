"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 
  useEffect(() => {
const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Buscar:", query);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-4 gap-4 md:gap-0">
     
        <div className="text-2xl font-bold text-orange-600">
          MiEcommerce
        </div>

       
        <form
          onSubmit={handleSearch}
          className="flex w-full md:max-w-md items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="flex grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg flex items-center justify-center transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

    
        <div className="flex space-x-4 text-gray-800 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <a href="/Carrito">Mi Carrito</a>
              <button
                onClick={handleLogout}
                className="text-red-500  hover:text-red-600 font-semibold cursor-pointer"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a href="/Register">Creá tu cuenta</a>
              <a href="/Login">Ingresá</a>
              <a href="#">Mis Compras</a>
            </>
          )}
        </div>
      </div>

     
   <nav className="bg-gray-50 border-t border-gray-200">
  <div className="flex overflow-x-auto max-w-7xl mx-auto px-4 py-2 gap-4">
    {[
      "Categorías",
      "Tecnología",
      "Ropa",
      "Supermercados",
      "Ofertas",
      "Cupones",
      "Vender",
      "Ayuda",
    ].map((cat) => {

      let href = "#";

      switch (cat) {
        case "Tecnología":
          href = "/Categorias/Tecnologia";
          break;
        case "Ropa":
          href = "/Categorias/Ropa";
          break;
        case "Supermercados":
          href = "/Categorias/Supermercados";
          break;
        case "Hogar":
          href = "/Categorias/Hogar";
          break;
        case "Otros":
          href = "/Categorias/Otros";
          break;
        case "Vender":
          href = isLoggedIn ? "/Subir" : "/Login";
          break;
        case "Ayuda":
          href = "/ayuda";
          break;
        default:
          href = "/";
      }

      return (
        <a
          key={cat}
          href={href}
          className="whitespace-nowrap text-gray-700 font-medium hover:text-orange-600 transition-colors"
        >
          {cat}
        </a>
      );
    })}
  </div>
</nav>
    </header>
  );
}