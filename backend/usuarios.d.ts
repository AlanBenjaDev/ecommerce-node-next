import { RoleEstatus } from "./autorizarRoles.js";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                user: string;
                role: RoleEstatus;
            };
        }
    }
}
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=usuarios.d.ts.map