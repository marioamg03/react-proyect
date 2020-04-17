const url = "https://test.sgmi.inveb.cl/api/auth/";

const api = {
    login: `${url}login`,
    logout: `${url}/logout-jwt`,
    doServerGetAllInfo: `${url}mobile/listar-checklists-gestiones-todos`
};

export default api;