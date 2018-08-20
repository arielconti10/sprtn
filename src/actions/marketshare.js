import { GET_YEAR, SET_DATA_TYPE , SET_PARAM_TYPE ,UNSET_MARKETSHARE, 
    UPDATE_SUBSIDIARY, UPDATE_SECTOR, SET_SECTOR, SET_SHOW_PUBLISHERS, 
    UPDATE_PUBLISH, UPDATE_COLLECTION, CHANGE_TYPE_FLOW, SET_CITY_HEADERS,
    SET_PARAM_SECRETARY, UPDATE_SECRETARY_CHART, UPDATE_DISCIPLINE_DATA,
    CHANGE_SECTOR_FLOW, UPDATE_RING_LOAD, LOAD_MARKETSHARE,
    SUCCESS_LOAD_MARKETSHARE
} from '../actionTypes/marketshare';

export function setYear(year) {
  return {
    type: GET_YEAR,
    year
  }
}

export function setDataType(types) {
    return {
        type: SET_DATA_TYPE,
        types
    }

}

export function setParamType(param_type) {
    return {
        type: SET_PARAM_TYPE,
        param_type
    }
}

export function unsetMarketshare() {
    return {
        type: UNSET_MARKETSHARE
    }
}

export function updateDataSubsidiary(subsidiary) {
    return {
        type: UPDATE_SUBSIDIARY,
        subsidiary
    }
}

export function updateSector(sector) {
    return {
        type: UPDATE_SECTOR,
        sector
    }
}

export function setSector(sector) {
    return {
        type: SET_SECTOR,
        sector
    }
}

export function setShowPublishers(show_publishers) {
    return {
        type: SET_SHOW_PUBLISHERS,
        show_publishers
    }
}

export function updatePublish(data_publisher, show_publishers) {
    return {
        type: UPDATE_PUBLISH,
        data_publisher,
        show_publishers
    }
}

export function updateCollections(data_collection, show_collections) {
    return {
        type: UPDATE_COLLECTION,
        data_collection,
        show_collections
    }
}

export function changeTypeFlow(param_subsidiary, param_type, param_sector, year) {
    return {
        type: CHANGE_TYPE_FLOW,
        param_subsidiary,
        param_type,
        param_sector,
        year
    }
}

export function setCityHeaders(cityHeaders) {
    return {
        type: SET_CITY_HEADERS,
        cityHeaders
    }
}

export function setParamSecretary(param_secretary) {
    return {
        type: SET_PARAM_SECRETARY,
        param_secretary
    }
}

export function updateSecretaryChart(dataActions) {
    return {
        type: UPDATE_SECRETARY_CHART,
        dataActions
    }
}

export function updateDisciplineData(data_discipline_header, param_discipline) {
    return {
        type: UPDATE_DISCIPLINE_DATA,
        data_discipline_header,
        param_discipline
    }
}

export function changeSectorFlow(param_subsidiary, param_type, param_sector, year) {
    return {
        type: CHANGE_SECTOR_FLOW,
        param_subsidiary,
        param_type,
        param_sector,
        year
    }
}

export function updateRingLoad(ring_load) {
    return {
        type: UPDATE_RING_LOAD,
        ring_load
    }
}

export function loadMarketshare() {
    return {
        type: LOAD_MARKETSHARE
    }
}

export function loadMarketshareSuccess() {
    return {
        type: SUCCESS_LOAD_MARKETSHARE
    }
}