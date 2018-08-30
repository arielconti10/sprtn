import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'

  import React, { Component } from 'react'

  import { Link } from 'react-router-dom'


  import {
    setContactsList, setContactsColumns, setContactCollapse, setContactJobTitles,
    setContactJobTitle, setContactStates, setContactStateId, setAdressInfo,
    setContactError, setAuthorizeEmail, setFavorite, setContactInfo,
    setPhoneType, setPhoneData
  } from '../actions/contact'

  import { formatDateToBrazilian } from '../app/common/DateHelper'
    
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
function updateContact(user, contactId, dataUpdate, phones) {
    dataUpdate.phones = phones;
     
    if (dataUpdate.phones) {
        dataUpdate.phones.map(item => {
            if (item.phone_extension == "") {
                delete item.phone_extension;
            }
        });
    }

    if (dataUpdate.pivot) {
        dataUpdate.school_id = dataUpdate.pivot.school_id;
    } 
    
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
 * realiza a consulta de um contato, de acordo com o ID
 * @param {Object} user usuário corrent
 * @param {Integer} contactId ID do contato a ser procurado
 * @return {Object} handleRequest contato encontrado
 */
function findContact(user, contactId) {
    const url = `${apiUrl}/${contactId}`
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

function createContact(user, contact, phones) {
    contact.active = true;
    contact.phones = phones;
     
    if (contact.phones) {
        contact.phones.map(item => {
            if (item.phone_extension == "") {
                delete item.phone_extension;
            }
        });
    }

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

/**
 * realiza a formataçāo de campos do contato
 * por exemplo: data de nascimento, cpf entre outros
 * @param {Object} contact contato sem os dados formatados
 * @return {Object} newContact contato com os dados formatados
 */
function formatFindContact(contact) {
    let newContact = contact;

    if (contact.data.cpf) {
        let newCpf = newContact.data.cpf.replace(new RegExp(/\./, 'g'), '');
        newCpf = newCpf.replace('-', '');
        newContact.data.cpf = newCpf;
    }

    newContact.data.birthday = formatDateToBrazilian(newContact.data.birthday);
    newContact.data.jobTitleId = newContact.data.job_title_id;

    return newContact.data;
}

/**
 * retorna uma filtragem de telefones
 * usado, por exemplo, na exclusāo de lista de telefones
 * @param {Array} phones lista com os telefones disponíveis
 * @param {Integer} phoneId identificador do telefone
 * @return {Array} phonesFilter listagem com os telefones filtrados
 */
function filterPhones(phones, phoneId) {
    let phonesFilter = phones.filter(function(item){
        return item.phone_number !== phoneId 
    });

    return phonesFilter;
}

function* loadContactsFlow(action) {
    yield put(setContactsList(action.contacts));
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
        const contactObject = yield call(findContact, action.user, id);
        const contactFormat = contactObject.data;
        const phones = contactFormat.phones;
        contactFormat.active = true;
        contactFormat.school_id = action.school_id;

        const activedContact = yield call(updateContact, action.user, id, contactFormat, phones);
        
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
    let totalChars = action.cep.match(/\d/g);

    if (totalChars && totalChars.length === 8) {
        const fullAdress = yield call(searchCep, action.user, action.cep);

        if (fullAdress.errors || fullAdress.data.erro) {
            const message = "CEP nāo encontrado. Verifique!";
            yield put(setAdressInfo({}));
            yield put(setContactError(message));
        } else {
            const transformedAdress = yield call(transformeAdress, fullAdress.data);
            yield put(setAdressInfo(transformedAdress));
            yield put(setContactError(""));
        }
    } else {
        yield put(setAdressInfo({}));
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
          phoneData
        } = action
        
        const createdContact = yield call(createContact, user, contact, phoneData);

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

function* contactUpdateFlow(action) {
    try {
        const {
          user,
          contact,
          contactId,
          phoneData
        } = action
        
        const updatedContact = yield call(updateContact, user, contactId, contact, phoneData);

        if (updatedContact) {
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

function* findContactFlow(action) {
    const contactObject = yield call(findContact, action.user, action.contactId);
    const contactFormat = yield call(formatFindContact, contactObject);

    yield put(setContactCollapse(true));
    yield put(setContactInfo(contactFormat));
    yield put(setAdressInfo(contactObject.data));
    yield put(setContactJobTitle(contactObject.data.jobTitleId));
    yield put(setContactStateId(contactObject.data.state_id));
}

function* addPhoneFlow(action) {
    const phoneData = action.phoneData;
    const phone = action.phone;

    let phoneFormat = phone;

    if (phoneFormat.phone_number && phoneFormat.phone_number.indexOf("_") !== -1) {
        phoneFormat.phone_number = phone.phone_number.replace("_","");
    }
    
    const concatPhone = phoneData.concat(phoneFormat);
    yield put(setPhoneData(concatPhone));
}

function* deletePhoneFlow(action) {
    const phones = yield call(filterPhones, action.phoneData, action.phoneId);
    yield put(setPhoneData(phones));
}

function* changePhoneFlow(action) {
    const phoneTypeId = action.phoneTypeId;
    yield put(setPhoneType(phoneTypeId));
}

function* loadPhoneDataFlow(action) {
    yield put(setPhoneData(action.phones));
}

function* updatePhoneFlow(action) {
    yield put(setPhoneData(action.phoneData));
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
        takeLatest("CONTACT_CREATE_FLOW", contactCreateFlow),
        takeLatest("FIND_CONTACT_FLOW", findContactFlow),
        takeLatest("CONTACT_UPDATE_FLOW", contactUpdateFlow),
        takeLatest("CHANGE_PHONE_FLOW", changePhoneFlow),
        takeLatest("LOAD_PHONE_DATA_FLOW", loadPhoneDataFlow),
        takeLatest("ADD_PHONE_FLOW", addPhoneFlow),
        takeLatest("UPDATE_PHONE_FLOW", updatePhoneFlow),
        takeLatest("DELETE_PHONE_FLOW", deletePhoneFlow)
    ]
}
  
  export default contactWatcher