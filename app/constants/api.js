const url = "https://test.sgmi.inveb.cl/api/auth/";

const api = {
    login: `${url}login`,
    logout: `${url}/logout-jwt`,
    doServerGetAllInfo: `${url}mobile/listar-checklists-gestiones-todos`,
    sendData: `${url}mobile/crear-gestion-mant-reactiva`,
};

export default api;