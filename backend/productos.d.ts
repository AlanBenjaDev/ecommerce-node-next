import { WebSocketServer } from "ws";
declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
        }
    }
}
declare const router: import("express-serve-static-core").Router;
export declare let wss: WebSocketServer | undefined;
export declare function setWebSocketServer(wsServer: WebSocketServer): void;
export default router;
//# sourceMappingURL=productos.d.ts.map