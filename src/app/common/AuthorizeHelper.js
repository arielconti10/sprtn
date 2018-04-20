/**
 * verifica se o código de Token é válido
 * @param Integer http_code código http, como por exemplo: 200, 401, entre outros
 * @return Bool authorized flag indicando se está autorizado ou nāo
 */
export const verifyToken=(http_code)=>{
    let authorized = 0;
    
    if (http_code == 401) {
        sessionStorage.removeItem("token_type");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("expires_in");
    }

    return authorized;
}