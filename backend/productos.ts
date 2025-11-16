import express, { type Request, type Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "./db.js";
import multer from "multer";
import { autenticarToken } from './autenticacion.js';


import { WebSocketServer, WebSocket } from "ws";
import    { upload }  from "./upload.js";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;  
    }
  }
}

enum Categorias {
  tecnologia = "tecnologia",
  ropa = "ropa",
  hogar = "hogar",
  supermercados = "supermercados",
  otros = "otros"
}


const router = express.Router();

interface Producto extends RowDataPacket {
  id: number;
  producto: string;
  descripcion: string;
  img_url?: string;
  precio: number;
  stock: number;
}
router.get("/producto", async (req: Request, res: Response) => {
  try {
   

    let query = "SELECT * FROM productos";
    const params: any[] = [];

  

    const [rows] = await db.query<Producto[]>(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error(" Error al obtener productos de la base de datos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});


const getProductosPorCategoria = async (req: Request, res: Response, categoria: string) => {
  try {
    const query = "SELECT * FROM productos WHERE categoria = ?";
    const [rows] = await db.query(query, [categoria]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

router.get("/productos/tecnologia", (req, res) => getProductosPorCategoria(req, res, Categorias.tecnologia));
router.get("/productos/ropa", (req, res) => getProductosPorCategoria(req, res, Categorias.ropa));
router.get("/productos/hogar", (req, res) => getProductosPorCategoria(req, res, Categorias.hogar));
router.get("/productos/supermercados", (req, res) => getProductosPorCategoria(req, res, Categorias.supermercados));
router.get("/productos/otros", (req, res) => getProductosPorCategoria(req, res, Categorias.otros));


export let wss: WebSocketServer | undefined;

export function setWebSocketServer(wsServer: WebSocketServer) {
  wss = wsServer;
}



router.get("/producto/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM productos WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(rows[0]); 
});



router.post(
  "/vendedor",
  autenticarToken,
  upload.single("imagen"),
  async (req: Request, res: Response) => {
    try {
      const { producto, descripcion, precio, stock, categoria } = req.body;
      const usuario_id = req.user?.id;

      if (!usuario_id) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (!req.file?.path) {
        return res.status(400).json({ error: "No se recibió imagen" });
      }

      if (!producto || !descripcion || !precio || !stock || !categoria) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }

    const imagen = `uploads/${req.file.filename}`; 


     
      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO productos (producto, descripcion, precio, stock, categoria, img_url, usuario_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [producto, descripcion, Number(precio), Number(stock), categoria, imagen, usuario_id]
      );

      const [rows] = await db.query<Producto[]>(
        "SELECT * FROM productos WHERE id = ?",
        [result.insertId]
      );

      
      if (wss) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ tipo: "ProductoNuevo", data: rows[0] }));
          }
        });
      }

      res.status(201).json(rows[0]);
    } catch (err) {
      console.error("Error al subir el producto:", err);
      res.status(500).json({ error: "Error al guardar producto" });
    }
  }
);
export default router