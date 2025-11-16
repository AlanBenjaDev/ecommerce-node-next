declare const router: import("express-serve-static-core").Router;
import "express";
declare global {
    namespace Express {
        interface Request {
            usuario: {
                id: number;
                email?: string;
                nombre?: string;
            };
        }
    }
}
export default router;
//# sourceMappingURL=carrito.d.ts.map