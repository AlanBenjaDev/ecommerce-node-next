import type{ Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "" ;



export function autenticarToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log('Token recibido en middleware:', token);
  if (!token) return res.sendStatus(401);

   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user)  => {
    if (err) return res.sendStatus(403);
    (req as any).user = user; 
    next();
  });
}