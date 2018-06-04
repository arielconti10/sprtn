import axios from './axios';

/**
 * recebe uma açāo, por exemplo: "action.view"
 * com base nesta açāo, verifica se o usuário pode executa-la 
 * @param String action nome de uma açāo a ser pesquisada
 * @param Object history objeto de histórico
 * @param String mode se é modo visualizaçāo ou ediçāo
 * @param Function callback funçāo que será executada após verificações
 * @return Boolean user_can flag indicando se o usuário pode ou nāo realizar
 */
export const canUser=(action, history, mode, callback)=>{
    let rule_exists = [];

    const rules_ids = JSON.parse(sessionStorage.getItem("rules"));
    rule_exists = rules_ids.filter(function(item) {
        return item.indexOf(action) !== -1;
    });

    if (rule_exists.length == 0 && mode == "view") {
        history.goBack();
        sessionStorage.setItem('flash_message', 'Você nāo está autorizado a realizar esta açāo');
    }

    if (mode == "change") {
        callback(rule_exists);   
    }
}

export const getPermissions = (callback) => {
    const user_id = sessionStorage.getItem('user_id');

    axios.get(`user/${user_id}`)
    .then((response) => {
        const dados = response.data.data;
        const rules = dados.role.rules;
        const rules_ids = rules.map(a => a.code);

        // sessionStorage.setItem('role_name', dados.role.name);

        callback(rules_ids);

    })
    .catch(function (error) {
        console.log(error);
    }.bind(this));
}

export const verifyViewMode=() => {
    let status = true;

    if (!sessionStorage.getItem('block_fields')) {
        status = false;    
    } 

    return status;
}