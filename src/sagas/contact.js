import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'

  import React, { Component } from 'react'

  import { Link } from 'react-router-dom'


  import {
    setContactsList, setContactsColumns, setContactCollapse, setContactJobTitles,
    setContactJobTitle, setContactStates, setContactStateId, setContactInfo,
    setContactError, setAuthorizeEmail, setFavorite
  } from '../actions/contact'
    
  const apiUrl = `${process.env.API_URL}/contact`
  const apiFind = `${process.env.API_URL}/school`
  const apiJob = `${process.env.API_URL}/job-title`
  const apiState = `${process.env.API_URL}/state`
  const apiCep = `${process.env.API_URL}/cep`
  
  // We'll use this function to redirect to different routes based on cases
  import {
    createHashHistory
  } from 'history'


  // Nice little helper to deal with the response
  // converting it to json, and handling errors
  function handleRequest(request) {
    return request
      .then(response => response.json())
      .then(json => json)
      .catch((error) => {
        throw error
      })
  }

/**
 * realiza a construçāo do array de colunas para um contato
 * @param {Bool} collapse flag indicando com status
 * @return {Array} columns colunas construidas
 */
function buildColumns(collapse) {
    const columns = [
        { Header: "Nome", accessor: "name", headerClassName: 'text-left'},
        { Header: "Cargo", accessor: "job_title.name", headerClassName: 'text-left' },
        { Header: "E-mail", accessor: "email", headerClassName: 'text-left' },
        {
            Header: "Telefone",
            id: "phone",
            width: 380,
            accessor: d => {
                let phones = "";
                if (d.phones !== undefined) {
                    d.phones.forEach(element => {
                        let type_text = "";
                        if (element.phone_type == "work") {
                            type_text = "Trabalho";
                        } else if (element.phone_type == "home") {
                            type_text = "Casa";
                        } else if (element.phone_type == "mobile") {
                            type_text = "Celular";
                        } else {
                            type_text = "Fax";
                        }
                        let item_phone = `${element.phone_number} (${type_text})`;
                        phones = phones + item_phone + ", ";
                    });
                    phones = phones.trim();
                    phones = phones.substring(0, phones.length - 1);
                }
                
                return phones;
            }
        }
    ];

    columns.unshift(
        {
            Header: "Status",
            accessor: "",
            width: 80, 
            headerClassName: 'text-center',
            sortable: false,
            Cell: (element) => (
                !element.value.deleted_at ?
                <div><span className="alert-success grid-record-status">Ativo</span></div>
                :
                <div><span className="alert-danger grid-record-status">Inativo</span></div>
            )
        }
    )

    columns.unshift(
        {
            Header: "Ações", accessor: "", sortable: false, width: 80, headerClassName: 'text-center', Cell: (element) => (
                !element.value.deleted_at ?
                    <div className="acoes">
                        <button className='btn btn-primary btn-sm' disabled={collapse}>
                            <i className='fa fa-pencil'></i>
                        </button>
                        <button className='btn btn-danger btn-sm' 
                            disabled={collapse}
                            onClick={() => {
                                }
                            }>
                            <i className='fa fa-ban'></i>
                        </button>
                    </div>
                    :
                    <div>
                        <button className='btn btn-success btn-sm' disabled={collapse}>
                            <i className='fa fa-check-circle'></i>
                        </button>
                    </div>

            )
        }
    )

    return columns;
}

/**
 * realiza a exclusāo/inativaçāo de um contato, de acordo com o ID
 * @param {Object} user usuário a ser autenticado
 * @param {Integer} contactId ID do contato a ser inativado
 * @return {Object} handleRequest retorno da request
 */
function deleteContact(user, contactId) {
    const url = `${apiUrl}/${contactId}`
    const request = fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
            Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
        }
    });
    
    return handleRequest(request)
}

/**
 * realiza a atualizaçāo de um contato, de acordo com os dados e o ID
 * @param {Object} user dados de autenticaçāo do usuário
 * @param {Integer} contactId ID do contato
 * @param {Object} dados a serem atualizados
 * @return {Object} handleRequest retorno da request
 */
function updateContact(user, contactId, dataUpdate) {  
    dataUpdate.phones.map(item => {
        if (item.phone_extension == "") {
            delete item.phone_extension;
        }
    });

    dataUpdate.school_id = dataUpdate.pivot.school_id;

    const url = `${apiUrl}/${contactId}`
    const request = fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
            Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
        },
        body: JSON.stringify(dataUpdate),
    })
    
    return handleRequest(request)
}

/**
 * realiza a busca de uma escola de acordo com o seu ID
 * @param {Object} user usuário corrent
 * @param {Integer} school_id ID da escola a ser procurada
 * @return {Object} escola encontrada
 */
function findSchool(user, school_id) {
    const url = `${apiFind}/${school_id}`
    const request = fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // passe our token as an "Authorization" header
            Authorization: 'Bearer ' + user.access_token || undefined,
        },
    })

    return handleRequest(request)
}

/**
 * realiza a atualizaçāo de status do collapse
 * usado, por exemplo, para formulários com collapse
 * @param {Bool} collapse flag indicando o status
 * @return {Bool} updatedCollapse nova flag
 */
function updateCollapse(collapse) {
    const updatedCollapse = !collapse;
    return updatedCollapse;
}

/**
 * carrega os cargos referentes a adiçāo/listagem de contatos
 * @param {Object} user usuário corrente
 * @return {Array} jobs cargos encontrados
 */
function loadContactsJobs(user) {
    const url = `${apiJob}?filter[job_title_type_id]=2&order[name]=asc`
    const request = fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // passe our token as an "Authorization" header
            Authorization: 'Bearer ' + user.access_token || undefined,
        },
    })

    return handleRequest(request)
}

/**
 * carrega os estados (brasil) referentes a adiçāo/listagem de contatos
 * @param {Object} user usuário corrente
 * @return {Array} states estados encontrados
 */
function loadStates(user) {
    const url = `${apiState}`
    const request = fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // passe our token as an "Authorization" header
            Authorization: 'Bearer ' + user.access_token || undefined,
        },
    })

    return handleRequest(request)
}

/**
 * realiza o mapeamento para o Select
 * @param {Array} array_data lista a ser mapeada
 * @return {Array} final_map lista mapeada
 */
function mapToSelect(array_data) {
    let final_map = [];

    array_data.map(item => {
        const label = `${item.name}`;
        const object_map = {value: item.id, label};
        final_map.push(object_map);
    })
    
    return final_map;
}

/**
 * realiza a busca de endereço de acordo com o CEP
 * @param {Object} user dados do usuário corrent
 * @param {String} cep endereço postal a ser pesquisado
 * @return {Object} adressInfo informações gerais do endereço
 */
function searchCep(user, cep) {
    const url = `${apiCep}/${cep}`
    const request = fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // passe our token as an "Authorization" header
            Authorization: 'Bearer ' + user.access_token || undefined,
        },
    })

    return handleRequest(request)
}

function transformeAdress(adressInfo) {
    const newAdress = adressInfo;
    newAdress.address = adressInfo.logradouro;
    newAdress.neighborhood = adressInfo.bairro;
    newAdress.city = adressInfo.localidade;

    if (adressInfo.cep) {
        newAdress.zip_code = adressInfo.cep.replace("-","");
    }
    
    return newAdress;
}

function createContact(user, contact) {
    contact.active = true;
    const url = `${apiUrl}`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
      body: JSON.stringify(contact),
    })
  
    return handleRequest(request)
  }

function* loadContactsFlow(action) {
    const columns = yield call(buildColumns, action.collapse);
    yield put(setContactsList(action.contacts));
    yield put(setContactsColumns(columns));
}

function* deleteContactFlow(action) {
    const { id } = action.rowInfo.original;

    try {
        const deletedContact = yield call(deleteContact, action.user, id);
        if (deletedContact) {
            const school = yield call(findSchool, action.user, action.school_id);
            const contacts = school.data.contacts;
            yield put(setContactsList(contacts));
        }
    } catch (error) {
        console.log(error);
    }
}

function* activeContactFlow(action) {
    const data = action.rowInfo.original;
    const { id } = data;

    try {
        data.active = true;
        const activedContact = yield call(updateContact, action.user, id, data);
        if (activedContact) {
            const school = yield call(findSchool, action.user, action.school_id);
            const contacts = school.data.contacts;
            yield put(setContactsList(contacts));
        }
    } catch (error) {
        console.log(error);
    }
}

function* addContactFlow(action) {
    const updatedCollapse = yield call(updateCollapse, action.collapse);
    yield put(setContactCollapse(updatedCollapse));
}

function* loadContactInitialFlow(action) {
    const jobTitles = yield call(loadContactsJobs, action.user);
    const jobTitlesMaped = yield call(mapToSelect, jobTitles.data);
    const states = yield call(loadStates, action.user);
    const statesMaped = yield call(mapToSelect, states.data);

    yield put(setContactJobTitles(jobTitlesMaped));
    yield put(setContactStates(statesMaped));
}

function* selectJobFlow(action) {
    const jobTitleId = action.jobTitleId;
    yield put(setContactJobTitle(jobTitleId));
}

function* selectStateFlow(action) {
    const stateId = action.stateId;
    yield put(setContactStateId(stateId));
}

function* searchCepFlow(action) {
    const fullAdress = yield call(searchCep, action.user, action.cep);

    if (fullAdress.errors || fullAdress.data.erro) {
        const message = "CEP nāo encontrado. Verifique!";
        yield put(setContactInfo({}));
        yield put(setContactError(message));
    } else {
        const transformedAdress = yield call(transformeAdress, fullAdress.data);
        yield put(setContactInfo(transformedAdress));
        yield put(setContactError(""));
    }


}

function* updateAuthEmailFlow(action) {
    const authorizeEmail = action.authorizeEmail;
    yield put(setAuthorizeEmail(authorizeEmail));
}

function* updateFavoriteFlow(action) {
    const favorite = action.favorite;
    yield put(setFavorite(favorite));
}

function* contactCreateFlow(action) {
    try {
        const {
          user,
          contact,
        } = action
        
        const createdContact = yield call(createContact, user, contact);

        console.log(createContact);

        if (createdContact) {
            const school = yield call(findSchool, action.user, contact.school_id);
            const contacts = school.data.contacts;

            yield put(setContactsList(contacts));
            yield put(setContactCollapse(false));
        }
    
      } catch (error) {
          console.log(error);
          console.log(error.status);
        //   yield put(setContactError(error));
      }
}

function* contactWatcher() {
    yield [
        takeLatest("LOAD_CONTACTS_FLOW", loadContactsFlow),
        takeLatest("ON_DELETE_CONTACT_FLOW", deleteContactFlow),
        takeLatest("ON_ACTIVE_CONTACT_FLOW", activeContactFlow),
        takeLatest("ADD_CONTACT_FLOW", addContactFlow),
        takeLatest("LOAD_CONTACT_INITIAL_FLOW", loadContactInitialFlow),
        takeLatest("SELECT_JOB_FLOW", selectJobFlow),
        takeLatest("SELECT_STATE_FLOW", selectStateFlow),
        takeLatest("SEARCH_CEP_FLOW", searchCepFlow),
        takeLatest("UPDATE_AUTH_EMAIL_FLOW", updateAuthEmailFlow),
        takeLatest("UPDATE_FAVORITE_FLOW", updateFavoriteFlow),
        takeLatest("CONTACT_CREATE_FLOW", contactCreateFlow)
    ]
}
  
  export default contactWatcher