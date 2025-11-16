import  Express  from "express";
import type { Request, Response, NextFunction } from "express";

export enum RoleEstatus {
  user = "user",
  admin = "admin"
}

export function autorizarRolesAdmin(req: Request, res: Response, next: NextFunction) {
  const userRole = req.user?.role;

  console.log("Rol del usuario:", userRole);

  if (userRole !== RoleEstatus.admin) {
    return res.status(403).json({ mensaje: "Acceso denegado: rol no autorizado" });
  }

  next();
}