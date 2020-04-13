const url = "https://pdrventas.inveb.cl/api/auth";

const api = {
    login: `${url}/login`,
    logout: `${url}/logout-jwt`,
    listProspectosConGestiones: `${url}/mobile/listar-prospectos-con-gestiones-fecha`,
    listProspectosTodos:`${url}/mobile/listar-prospectos-con-gestiones-todos`,
    actualizarProspecto:`${url}/mobile/actualizar-prospecto`,
    guardarNuevaGestion:`${url}/mobile/guardar-nueva-gestion`,
    crearPropecto:`${url}/mobile/crear-prospecto`,
    guardarCoordenadasActividad:`${url}/mobile/guardar-coordenadas-actividad`,
    actualizarTokenNotificacionVendedor:`${url}/mobile/actualizar-token-notificacion-vendedor`,
    listarTurnosPorteosPorVendedor:`${url}/mobile/listar-turnos-porteos-por-vendedor`,
    registerApp:`${url}/register-app`,
};

export default api;