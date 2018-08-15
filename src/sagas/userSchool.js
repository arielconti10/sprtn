import { take, fork, cancel, call, put, cancelled, takeLatest, select } from 'redux-saga/effects'
import axios from '../app/common/axios';

import {
    LOAD_USER_SCHOOL, CHANGE_SUBSIDIARY_FLOW
} from '../actionTypes/userSchool'

import {
    setUsers, setMessageError, setUserId, setSubsidiaries, setSubsidiaryId, setSectors, setSchoolTypes, 
    setSchoolTypeId, setSectorId, setSchools, updateLoader, updateTotalSelected, setWalletSchools,
    updateWalletSelected
  } from '../actions/userSchool'

/**
 * concatena campos de um Array
 * por exemplo: login de rede e e-mail de um usuário
 * @param Array data array de objetos 
 * @param Array to_concat array unidimensional com os dados a serem concatenados
 * @return Array final_array lista com os dados concatenados 
 */
function concatenateArray(data, to_concat) {
    let final_array = data;
    let concat_size = to_concat.length;
    final_array.map(item => {
        let concat = '';
        let concat_array_total = 0;
        to_concat.map(label_concat => {
            concat = concat + ' – ' + item[label_concat];
            concat_array_total++;
            if (concat_size == concat_array_total) {
                item.concat_field = concat;
            }               
        })
        item.concat_field = item.concat_field.trim();
        item.concat_field = item.concat_field.substring(1).trim();
    });

    return final_array;
}

/**
 * obtem os usuários de uma hierarquia
 * @return Array dados usuários encontrados na busca
 */
function getUsers() {
    const labelConcat = ['username', 'full_name', 'email'];

    return axios.get(`hierarchy/childrens`).then(response => {
        let dados = response.data.data;
        if (labelConcat !== undefined && labelConcat.length > 0) {
            dados = concatenateArray(dados, labelConcat);
        }

        return dados;
    }).catch(function(error) {
        const message = `Ocorreu o seguinte erro: ${error.response.status} - ${error.response.statusText}`;
        
        return message;
    })
}

/**
 * obtem as filiais
 * @return Array dados filiais encontradas na busca
 */
function getSubsidiaries() {
    return axios.get(`subsidiary`).then(response => {
        let dados = response.data.data;
        return dados;
    }).catch(function(error) {
        const message = `Ocorreu o seguinte erro: ${error.response.status} - ${error.response.statusText}`;
        
        return message;
    })
}

/**
 * obtem os tipos de escola
 * @return Array tipos de escola encontrados na busca
 */
function getSchoolTypes() {
    return axios.get(`school-type`).then(response => {
        let dados = response.data.data;
        return dados;
    }).catch(function(error) {
        const message = `Ocorreu o seguinte erro: ${error.response.status} - ${error.response.statusText}`;
        
        return message;
    })
}

/**
 * monta a URL de pesquisa, de acordo com os parâmetros informados
 * @param {Integer} sector_id ID do setor selecionado
 * @param {Integer} subsidiary_id ID da filial selecionada
 * @param {Array} school_type_id conjunto de IDs dos tipos de escola
 * @return {Object} schools retorno da busca
 */
function getSearchParams(sector_id, subsidiary_id, school_type_id) {

    let filters = "&filter[active]=1";
    filters += "&filter[portfolio]=1";
    if (!sector_id && !school_type_id) {
        return false;
    }

    if (sector_id) {            
        filters += "&filter[sector_id]=" + sector_id;
    }

    if (subsidiary_id) {            
        filters += "&filter[subsidiary_id]=" + subsidiary_id;
    }

    if (school_type_id && school_type_id.length > 0) {
        const types_array = school_type_id.map(item => item.id);
        filters += "&filter[school_type_id][]=" + types_array.join("&filter[school_type_id][]=");
    }

    return filters;
}

/**
 * com base em uma lista, gera o texto completo da escola
 * por exemplo: Filial - Setor - Tipo de escola - Codigo TOTVS - Nome da escola
 * @param Array list lista de escolas
 * @return Array new_list lista com os nomes concatenados
 */
function getTextSchool(list) {
    let new_list = list;
    new_list.map(item => {
        if (item.school_type !== undefined || item.school_type !== null) {
            item.id = `${item.id} | ${item.school_type.name}`;
            item.label = `${item.subsidiary.name} - ${item.sector.name} - ${item.school_type.name} - ${item.school_code_totvs} - ${item.name}`;
        } else {
            item.label = `${item.subsidiary.name} - ${item.sector.name} - ${item.school_code_totvs} - ${item.name}`;
        }
    });

    return new_list;
}

/**
 * realiza a pesquisa de escolas de acordo com a URL de filtro informada
 * @param {String} filter URL de pesquisa a ser realizada
 * @return {Object} schools retorno da busca
 */
function getSchools(filter) {
    return axios.get('user-schools?' + filter)
    .then(response => {
        let dados = getTextSchool(response.data.data);
        return dados;
    }).catch(function(error) {
        const message = `Ocorreu o seguinte erro: ${error.response.status} - ${error.response.statusText}`;
        return message;
    })


}

function* callGetUsers() {
    try {
        const users = yield call(getUsers);

        if (typeof users !== "object") { throw users };

        yield put(setUsers(users));
    } catch (error) {
        yield put(setMessageError(error));
    }
}

function* callGetSubsidiaries() {
    try {
        const subsidiaries = yield call(getSubsidiaries);

        if (typeof subsidiaries !== "object") { throw subsidiaries };

        yield put(setSubsidiaries(subsidiaries));
    } catch (error) {
        yield put(setMessageError(error));
    }
}

function* callGetSchoolTypes() {
    try {
        const school_types = yield call(getSchoolTypes);

        if (typeof school_types !== "object") { throw school_types };

        yield put(setSchoolTypes(school_types));
    } catch (error) {
        yield put(setMessageError(error));
    }
}

function* callGetSchools(sector_id, subsidiary_id, school_type_id, schools_wallet) {
    try {
        const filter = yield call(getSearchParams, sector_id, subsidiary_id, school_type_id);
        const schools = yield call(getSchools, filter);

        const filtered_schools = filterAvailableSchools(schools_wallet, schools);

        if (typeof schools !== "object") { throw schools };

        yield put(setSchools(filtered_schools));
    } catch (error) {
        yield put(setMessageError(error));
    }
    
}

function* loadUserSchool() {
    yield call(callGetUsers);
    yield call(callGetSubsidiaries);
    yield call(callGetSchoolTypes);

}

/**
 * obtem as escolas da carteira referente a um usuário
 * @param {Integer} user_id ID do usuário
 * @return {Array} dados retorno encontrado
 */
function getUserSchools(user_id) {
    return axios.get(`user-school/${user_id}`)
    .then(response => {
        let dados = getTextSchool(response.data.data);
        return dados;
    })
    .catch(function(error) {
        const message = `Ocorreu o seguinte erro: ${error.response.status} - ${error.response.statusText}`;
        return message;
    });   
}

/**
 * retorna os IDs de uma seleçāo de dados
 * funçāo chamada para arrays separados com id | valor
 * @param Array results lista com os resultados encontrados
 * @return Array arrays_id lista com os IDs
 */
function verifyOptionsId(results) {
    let array_ids = [];
    results.map(item => {
        let item_split = item.id.toString().split("|");
        let id = item_split[0].trim();
        array_ids.push(id);
    });

    return array_ids;
}

/**
 * com base na lista de escolas na carteira, retorna as escolas disponíveis
 * ou seja, as escolas disponíveis nāo terá escolas que estāo nas carteiras
 * @param {Array} selectedOptions opções selecionadas 
 * @param {Array} schools lista com todas as escolas disponíveis
 * @return {Array} filtered escolas que estāo apenas na aba de disponíveis
 */
function filterAvailableSchools(selectedOptions, schools) {
    let filtered = schools;

    if (selectedOptions && selectedOptions.length > 0) {
        let selected_ids = selectedOptions.map(a => a.school_code_totvs);
        filtered = schools.filter(function(value) {
            let value_id = value.school_code_totvs;
            return selected_ids.indexOf(value_id) == -1;
        });   
    }

    return filtered;
}

/**
 * realiza a transferência de escolas
 * ou seja, de "disponível" para "na carteira"
 * @param {Integer} user_id ID do usuário a ser pesquisado 
 * @param {Array} available_schools lista com as escolas disponíveis
 * @param {Array} schools lista com todas as escolas
 * @return {Array} data lista de resultados encontrados
 */
function transferSchool(user_id, available_schools, schools) {
    
    if (user_id == 0) {
        return false;
    }
    available_schools.sort((a, b) => a.id - b.id);

    let array_ids = verifyOptionsId(available_schools);

    return axios.post('user-school', {
        'user_id': user_id,
        'school_id': array_ids,
        'type': 'insert'
    })
    .then(response => {
        if (response.status === 200) {
            const filtered = filterAvailableSchools(available_schools, schools);
            return filtered;
        }
    })
    .catch(function(error) {
        let message = `Ocorreu o seguinte erro: ${error.response.status} - ${error.response.statusText}`;
        if (error == "Error: Network Error") {
            message = "Error 500 - Allowed memory size exhausted";
        }
        return message;
    });
}

/**
 * realiza a remoçāo de escolas da carteira do usuário, de acordo com as escolhas
 * @param {Array} deselected_options opções a serem removidas
 * @param {Array} wallet_schools escolas da carteira
 * @param {Integer} user_id ID do usuário
 * @param {Array} schools lista com escolas disponíveis
 * @return {Array} new_wallet escolas atualizadas
 */
function removeWalletOption(deselected_options, wallet_schools, user_id, schools) {

    if (user_id == 0) {
        //validação de obrigatoriedade do campo de usuário
        return false;
    }

    var selectedOptions = wallet_schools.slice()
    deselected_options.forEach(option => {
      selectedOptions.splice(selectedOptions.indexOf(option), 1)
    })

    let array_ids = verifyOptionsId(selectedOptions);

    return axios.post('user-school', {
        'user_id': user_id,
        'school_id': array_ids,
        'type': 'insert'
    })
    .then(response => {
        if (response.status === 200) {
            return selectedOptions;
        }
    })
    .catch(function(error) {
        /*
        para todos os outros erros, é retornado mensagem de erro com código
        para estouro de memória, retorna apenas a mensagem "Error: Network Error"
        condicao para tratar a mensagem
        */
       let message = `Ocorreu o seguinte erro: ${error.response.status} - ${error.response.statusText}`;
       if (error == "Error: Network Error") {
           message = "Error 500 - Allowed memory size exhausted";
       }
       return message;
    }.bind(this)); 
}

function* callGetUserSchools(user_id) {
    try {
        const user_schools = yield call(getUserSchools, user_id);

        if (typeof user_schools !== "object") { throw user_schools };

        yield put(setWalletSchools(user_schools));
    } catch (error) {
        yield put(setMessageError(error));
    }
}

function* callRemoveWalletOption(deselected_options, wallet_schools, user_id, schools) {
    try {
        yield put(updateLoader(true));
        const new_wallet = yield call(removeWalletOption, deselected_options, wallet_schools, user_id, schools);
        
        if (typeof new_wallet !== "object") { throw new_wallet };

        const available_filtered = schools.concat(deselected_options);

        yield put(setWalletSchools(new_wallet));
        yield put(setSchools(available_filtered));
        yield put(updateWalletSelected(0));
        yield put(updateLoader(false));
    } catch (error) {   
        yield put(setMessageError(error));
    }
}

function* callTransferSchool(user_id, available_schools, schools, schools_wallet) {
    try {
        const concat_schools = schools_wallet.concat(available_schools);
        const filter_schools = yield call(transferSchool, user_id, concat_schools, schools);

        if (typeof filter_schools !== "object") { throw filter_schools };

        yield put(setSchools(filter_schools));

        yield put(setWalletSchools(concat_schools));
    } catch (error) {
        yield put(setMessageError(error));
    }
}

function* changeUserFlow(action) {
    yield put(updateLoader(true));
    yield put(setUserId(action.user_id));
    yield call(callGetUserSchools,action.user_id);
    yield put(updateLoader(false));
}

function* changeSubsidiaryFlow(action) {
    yield put(updateLoader(true));
    yield put(setSubsidiaryId(action.subsidiary_id));
    yield put(setSectors(action.sectors));
    yield put(setSectorId(''));
    yield put(setSchools([]));
    yield put(updateLoader(false));
}

function* changeSectorFlow(action) {
    yield put(updateLoader(true));
    yield put(setSectorId(action.sector_id));
    yield call(callGetSchools, action.sector_id, action.subsidiary_id, action.school_type_id, action.schools_wallet);
    yield put(updateTotalSelected(0));
    yield put(updateLoader(false));
}

function* changeSchoolType(action) {
    yield put(setSchoolTypeId(action.school_type_id));
}

function* selectOptionFlow(action) {
    yield put(updateTotalSelected(action.total_selected_available));
}

function* selectWalletOption(action) {
    yield put(updateWalletSelected(action.total_selected_wallet));
}

function* selectSchoolFlow(action) {
    yield put(updateLoader(true));
    yield call(callTransferSchool, action.user_id, action.available_schools, action.schools, action.schools_wallet);
    yield put(updateTotalSelected(0));
    yield put(updateLoader(false));
}

function* removeWalletOptionFlow(action) {
    yield call(callRemoveWalletOption, action.deselected_options, action.wallet_schools, action.user_id, action.schools)
}

// Our watcher (saga).  It will watch for many things.
function* userSchoolWatcher() {
  yield [
    takeLatest("LOAD_USER_SCHOOL", loadUserSchool),
    takeLatest("CHANGE_USER_FLOW", changeUserFlow),
    takeLatest("CHANGE_SUBSIDIARY_FLOW", changeSubsidiaryFlow),
    takeLatest("CHANGE_SECTOR_SCHOOL_FLOW", changeSectorFlow),
    takeLatest("CHANGE_SCHOOL_TYPE", changeSchoolType),
    takeLatest("SELECT_OPTION_FLOW", selectOptionFlow),
    takeLatest("SELECT_WALLET_OPTION", selectWalletOption),
    takeLatest("SELECT_SCHOOL_FLOW", selectSchoolFlow),
    takeLatest("REMOVE_WALLET_OPTION_FLOW", removeWalletOptionFlow)
  ]
}

export default userSchoolWatcher;
