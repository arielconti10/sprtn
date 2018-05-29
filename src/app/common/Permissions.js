import axios from './axios';

/**
 * recebe uma açāo, por exemplo: "action.view"
 * com base nesta açāo, verifica se o usuário pode executa-la 
 * @param String action nome de uma açāo a ser pesquisada
 * @param Object history objeto de histórico
 * @return Boolean user_can flag indicando se o usuário pode ou nāo realizar
 */
export const canUser=(action, history, mode, callback)=>{
    const user_id = sessionStorage.getItem('user_id');
    let rule_exists = [];

    axios.get(`user/${user_id}`)
    .then((response) => {
        const dados = response.data.data;
        const rules = dados.role.rules;
        const rules_ids = rules.map(a => a.code);
        rule_exists = rules_ids.filter(function(item) {
            return item.indexOf(action) !== -1;
        });

        if (rule_exists.length == 0 && mode == "view") {
            history.goBack();
            sessionStorage.setItem('flash_message', 'Você nāo está autorizado a realizar esta açāo');
        }

        if (mode == "change") {
            callback(rule_exists);   
            sessionStorage.setItem('block_fields', 1);
        }

    })
    .catch(function (error) {
        console.log(error);
    }.bind(this));
}

export const getPermissions = (callback) => {
    const user_id = sessionStorage.getItem('user_id');

    axios.get(`user/${user_id}`)
    .then((response) => {
        const dados = response.data.data;
        const rules = dados.role.rules;
        const rules_ids = rules.map(a => a.code);

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