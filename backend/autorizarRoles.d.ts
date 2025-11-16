import Express from "express";
import type { Request, Response, NextFunction } from "express";
export declare enum RoleEstatus {
    user = "user",
    admin = "admin"
}
export declare function autorizarRolesAdmin(req: Request, res: Response, next: NextFunction): Express.Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=autorizarRoles.d.ts.map