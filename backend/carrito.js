import express from "express";
import db from "./db.js";
import { autenticarToken } from "./autenticacion.js";
const router = express.Router();
import "express";
router.post("/agregar", autenticarToken, async (req, res) => {
    try {
        const { producto_id, cantidad } = req.body;
        const usuario_id = req.user?.id;
        await db.query(`INSERT INTO carrito (usuario_id, producto_id, cantidad)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`, [usuario_id, producto_id, cantidad || 1, cantidad || 1]);
        res.json({ message: "Producto agregado al carrito" });
    }
    catch (err) {
        console.error("error en /Agregar", err);
        res.status(500).json({ error: "Error al agregar al carrito" });
    }
});
router.get("/Ver", autenticarToken, async (req, res) => {
    const usuario_id = req.user?.id;
    const [rows] = await db.query(`
    SELECT c.id, p.producto, p.precio, p.img_url, c.cantidad
    FROM carrito c
    JOIN productos p ON c.producto_id = p.id
    WHERE c.usuario_id = ?`, [usuario_id]);
    res.json(rows);
});
router.delete("/carrito/:id", autenticarToken, async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user?.id;
    await db.query(`DELETE FROM carrito WHERE id = ? AND usuario_id = ?`, [id, usuario_id]);
    res.json({ message: "Producto eliminado del carrito" });
});
export default router;
//# sourceMappingURL=carrito.js.map