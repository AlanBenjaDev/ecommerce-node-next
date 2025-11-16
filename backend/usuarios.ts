
import express from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "./db.js";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { RoleEstatus } from "./autorizarRoles.js";
import dotenv from "dotenv";
dotenv.config();

interface Usuario {
  id: number;
  user: string;
  email: string;
  password: string;
  role: RoleEstatus;
}

interface TokenRow {
  id: number;
  usuario_id: number;
  token: string;
  created_at: any;
  expires_at: any;
  ip: string | null;
  user_agent: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; user: string; role: RoleEstatus };
    }
  }
}

const router = express.Router();
const saltRounds = 10;


const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";


const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos, intenta más tarde" },
});

router.post(
  "/register",
  formLimiter,
  [
    body("user").isLength({ min: 3 }).withMessage("Usuario es obligatorio"),
    body("email").isEmail().withMessage("El Email debe ser válido"),
    body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

    try {
      const { user, email, password } = req.body;
      const hash = await bcrypt.hash(password, saltRounds);

      await db.query<ResultSetHeader>("INSERT INTO usuarios (user, email, password) VALUES (?, ?, ?)", [
        user,
        email,
        hash,
      ]);

      res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (err) {
      console.error("Error al registrar el usuario:", err);

      type MysqlError = Error & { code?: string };
      const mysqlErr = err as MysqlError;

      if (mysqlErr.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "El usuario o email ya existe" });
      }

      res.status(500).json({ error: "Error del servidor" });
    }
  }
);


router.post(
  "/login",
  formLimiter,
  [
    body("user").isLength({ min: 3 }).withMessage("Usuario es obligatorio"),
    body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

    try {
      const { user, password } = req.body;

     
      const [rows] = await db.query<(RowDataPacket & Usuario)[]>(
        "SELECT id, user, email, password, rol AS role FROM usuarios WHERE user = ? LIMIT 1",
        [user]
      );

      if (!rows || rows.length === 0) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      const userData = rows[0]!;
      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

     
      const accessToken = jwt.sign(
        { id: userData.id, user: userData.user, role: userData.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m", issuer: "mi-app" }
      );

      const refreshToken = jwt.sign({ id: userData.id }, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });

      await db.query<ResultSetHeader>(
        `INSERT INTO sesiones (usuario_id, token, expires_at, ip, user_agent)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), ?, ?)`,
        [userData.id, refreshToken, req.ip || null, req.headers["user-agent"] || null]
      );

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "Login exitoso",
          user: { id: userData.id, user: userData.user, role: userData.role },
          accessToken,
        });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      res.status(500).json({ error: "Error del servidor" });
    }
  }
);


router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refresh = req.cookies?.refreshToken;
    if (!refresh) return res.status(401).json({ error: "No refresh token" });

    const [rows] = await db.query<(RowDataPacket & TokenRow)[]>(
      "SELECT * FROM sesiones WHERE token = ? AND expires_at > NOW()",
      [refresh]
    );

    if (!rows || rows.length === 0) return res.status(403).json({ error: "Refresh token inválido" });

    jwt.verify(refresh, REFRESH_TOKEN_SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err || !decoded) {
        console.error("Refresh verify error:", err);
        return res.status(403).json({ error: "Refresh token inválido o expirado" });
      }

      const newAccessToken = jwt.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

      return res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("Error en /refresh:", err);
    return res.status(500).json({ error: "Error del servidor" });
  }
});


router.post("/logout", async (req: Request, res: Response) => {
  try {
    const refresh = req.cookies?.refreshToken;
    if (!refresh) {
      
      res.clearCookie("refreshToken");
      return res.sendStatus(204);
    }

    await db.query("DELETE FROM sesiones WHERE token = ?", [refresh]);

    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (err) {
    console.error("Error en logout:", err);
    return res.status(500).json({ error: "Error del servidor" });
  }
});

export default router;
