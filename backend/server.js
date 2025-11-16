import express from 'express';
import cors from 'cors';
import { WebSocketServer } from "ws";
import usuarios from './usuarios.js';
import { autenticarToken } from './autenticacion.js';
import productos from './productos.js';
import carrito from './carrito.js';
import path from "path";
import { fileURLToPath } from "url";
import { MercadoPagoConfig, Preference } from "mercadopago";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const frontend_url = process.env.URL_FRONTEND;
app.use(cors({
    origin: frontend_url,
    credentials: true
}));
import cookieParser from 'cookie-parser';
app.use(cookieParser());
import http from "http";
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/Api/productos', productos);
app.use('/Api/Usuarios', usuarios);
app.use('/api/carrito', autenticarToken, carrito);
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "APP_USR-2998645348514580-110814-1a1e39753cf519ca78ef0a345a8727de-2974538461",
});
app.post("/create_preference", async (req, res) => {
    try {
        const { title, unit_price, quantity } = req.body;
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: title,
                        title,
                        unit_price: Number(unit_price),
                        quantity: Number(quantity),
                    },
                ],
                back_urls: {
                    success: "http://localhost:3000/success",
                    failure: "http://localhost:3000/failure",
                    pending: "http://localhost:3000/pending",
                },
            },
        });
        res.json({ preferenceId: response.id });
    }
    catch (err) {
        console.error("Error al crear preferencia:", err);
        res.status(500).json({ error: err.message });
    }
});
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map