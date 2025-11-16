import express from "express";
import db from "./db.js";
import { autenticarToken } from './autenticacion.js';
import { WebSocket } from "ws";
import upload from "./upload.js";
var Categorias;
(function (Categorias) {
    Categorias["tecnologia"] = "tecnologia";
    Categorias["ropa"] = "ropa";
    Categorias["hogar"] = "hogar";
    Categorias["supermercados"] = "supermercados";
    Categorias["otros"] = "otros";
})(Categorias || (Categorias = {}));
const router = express.Router();
router.get("/producto", async (req, res) => {
    try {
        let query = "SELECT * FROM productos";
        const params = [];
        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    }
    catch (err) {
        console.error(" Error al obtener productos de la base de datos:", err);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});
const getProductosPorCategoria = async (req, res, categoria) => {
    try {
        const query = "SELECT * FROM productos WHERE categoria = ?";
        const [rows] = await db.query(query, [categoria]);
        res.status(200).json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener productos" });
    }
};
router.get("/productos/tecnologia", (req, res) => getProductosPorCategoria(req, res, Categorias.tecnologia));
router.get("/productos/ropa", (req, res) => getProductosPorCategoria(req, res, Categorias.ropa));
router.get("/productos/hogar", (req, res) => getProductosPorCategoria(req, res, Categorias.hogar));
router.get("/productos/supermercados", (req, res) => getProductosPorCategoria(req, res, Categorias.supermercados));
router.get("/productos/otros", (req, res) => getProductosPorCategoria(req, res, Categorias.otros));
export let wss;
export function setWebSocketServer(wsServer) {
    wss = wsServer;
}
router.get("/producto/:id", async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(rows[0]);
});
router.post("/vendedor", autenticarToken, upload.single("imagen"), async (req, res) => {
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
        const imagen = req.file.path;
        const [result] = await db.query(`INSERT INTO productos (producto, descripcion, precio, stock, categoria, img_url, usuario_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [producto, descripcion, Number(precio), Number(stock), categoria, imagen, usuario_id]);
        const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [result.insertId]);
        if (wss) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ tipo: "ProductoNuevo", data: rows[0] }));
                }
            });
        }
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error("Error al subir el producto:", err);
        res.status(500).json({ error: "Error al guardar producto" });
    }
});
export default router;
//# sourceMappingURL=productos.js.map