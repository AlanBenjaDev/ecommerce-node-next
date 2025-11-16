export var RoleEstatus;
(function (RoleEstatus) {
    RoleEstatus["user"] = "user";
    RoleEstatus["admin"] = "admin";
})(RoleEstatus || (RoleEstatus = {}));
export function autorizarRolesAdmin(req, res, next) {
    const userRole = req.user?.role;
    console.log("Rol del usuario:", userRole);
    if (userRole !== RoleEstatus.admin) {
        return res.status(403).json({ mensaje: "Acceso denegado: rol no autorizado" });
    }
    next();
}
//# sourceMappingURL=autorizarRoles.js.map