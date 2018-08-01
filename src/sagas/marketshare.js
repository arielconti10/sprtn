import { take, fork, cancel, call, put, cancelled, takeLatest } from 'redux-saga/effects'
import axios from '../app/common/axios';

// Our login constants
import {
  GET_YEAR, UNSET_MARKETSHARE, UPDATE_RING_LOAD, LOAD_MARKETSHARE
} from '../actionTypes/marketshare'

import {
  LOGIN_ERROR,
} from '../actionTypes/login'

// So that we can modify our Client piece of state
import {
  setYear, setDataType, setParamType, updateDataSubsidiary, updateSector, setShowPublishers, updatePublish,
  updateCollections, setCityHeaders, setParamSecretary, updateSecretaryChart, updateDisciplineData,
  updateRingLoad, loadMarketshareSuccess
} from '../actions/marketshare'

function getYear() {
    const array_year = [
        {value:'2016', label: '2016'}
    ];

  return array_year;
}

function getShowPublishers() {
    const show_publishers = false;

    return show_publishers;
}

function* getYearSearch() {
  let array_year
  try {
    array_year = yield call(getYear)

    yield put(setYear(array_year))
    
  } catch (error) {
    // error? send it to redux
    console.log(error)
    
    yield put({ type: LOGIN_ERROR, error })
  } finally {
    // No matter what, if our `forked` `task` was cancelled
    // we will then just redirect them to login
    if (yield cancelled()) {
      // history.push('/login')
    }
  }
}

function getDataType() {
    const data_type =  [
        { value: 'ESCOLA', label: 'ESCOLA' },
        { value: 'SECRETARIA', label: 'SECRETARIA' },
        { value: 'ESCOLA_DISCIPLINAS', label: 'DISCIPLINAS' }
    ];

    return data_type;
}

function getParamType() {
    const param_type = { value: 'ESCOLA', label: 'ESCOLA' };
    return param_type;
}

function createSelectValues(obj, user) {
    let param = {};
    param['label'] = `${obj.name} ${user ? ' (' + user + ')': ''}`;
    param['name'] = obj.name;
    param['value'] = obj.code;
    param['code'] = obj.code;

    return param;
}

function getUserCurrent() {
    const apiUserCurrent = `${process.env.API_URL}/user/current`;

    return axios.get(`${apiUserCurrent}`).then(response => response.data.data);
}

function getDataSubsidiary() {
    const apiUserCurrent = `${process.env.API_URL}/user/current`;
    const apiHierarchy = `${process.env.API_URL}/hierarchy/childrens`;

    let data = [];
    let paramSector = {};

    return axios.get(`${apiHierarchy}`).then(response => {    
        let subordinates = response.data.data;
        let subsidiaries = [];
        let arrSectors = [];

        subordinates.map(user => {
            if (user.subsidiary) {
                subsidiaries.push(user.subsidiary);

                let arr = paramSector[user.subsidiary_id] || [];
                let value_select = createSelectValues(user.sector, user.full_name);
                arr.push(value_select);
                paramSector[user.subsidiary_id] = arr;
            }
        });

        subsidiaries.sort(function (a, b) { return a.code - b.code }).map(sub => {
            let param = {};
            param['value'] = sub.id;
            param['label'] = `${sub.code} - ${sub.name}`;
            param['sectors'] = arrSectors;

            data.push(param);
        });

        data = data.filter((item, index, self) =>
            index === self.findIndex((obj) => (
                obj.value === item.value
            ))
        );

        if (data.length) {
            // yield put(setDataSubsidiary(data));
            const object_return = {
                show_no_register: false,
                data_subsidiary: data, 
                param_subsidiary: data[0]?data[0].value:[], 
                param_secs: paramSector
            };

            return object_return;
        } else {
            const object_return = {
                show_no_register: true
            };

            return object_return;
        }
    })

}

function loadSector(paramSector, subsidiary) {
    let data = [];
    let sec = '';

    console.log(paramSector);
    
    if (paramSector) {
        data = paramSector[subsidiary].sort((a, b) => a['label'].localeCompare(b['label']));
        sec = paramSector[subsidiary][0].code;
    } 
    
    return {
        data_sector: data, 
        param_sector: sec, 
        param_subsidiary: subsidiary
    };

}

function publisherChart(param_subsidiary, param_type, param_sector, param_year) {

    let urlPost = `marketshare?filter[subsidiary.id]=${param_subsidiary}&filter[key]=${param_type}_EDITORAS_CONSOLIDADO:${param_sector}:&filter[year]=${param_year}`;

    return axios.get(`${urlPost}`).then(response => {
        let marketShare = response.data.data;
        let isSchool = param_type == 'ESCOLA' ? true : false;

        marketShare.sort((a, b) => a.value - b.value).reverse();

        return marketShare;
    }).catch(err => console.log(4, err));
}

function ftdToUp(param_array, isSchool) {
    let pubFTD = null;
    let others = 0;
    let values = [];
    let positionArray = isSchool ? 0 : 1;
    let contMax = isSchool ? 5 : 6;
    let cont = 0;

    param_array.map(item => {
        let label = isSchool ? item.key.split(':')[2] : item[0];
        let porcent = isSchool ? item.value : item[1];

        if (cont < contMax) {
            if (label.search("FTD") !== -1) {
                pubFTD = [label, porcent];
            } else {
                values.push([label, porcent]);
            }

            cont++;
        } else {
            others += porcent;
        }
    });

    if (others !== "") values.push(["OUTROS", others]);

    if (pubFTD) values.splice(positionArray, 0, pubFTD);

    return values;
}

function getSchools(marketshare, data_publisher) {
    let publishers = data_publisher;

    let marketShare = marketshare.filter((item, index, self) =>
        index === self.findIndex((obj) => (
            obj.key === item.key
        ))
    );

    return marketShare;
}

function collectionChart(param_subsidiary, param_type, param_sector, param_year) {
    let urlPost = `marketshare?filter[subsidiary.id]=${param_subsidiary}&filter[key]=${param_type}_COLECOES_CONSOLIDADO:${param_sector}:&filter[year]=${param_year}`;
    return axios.get(`${urlPost}`).then(response => {
        let marketShare = response.data.data;
        // let collections = this.state.data_collection;

        marketShare.sort((a, b) => a.value - b.value).reverse();

        return marketShare;
    }).catch(err => console.log(4, err));
}

function getCityHeaders(marketShare) {
    let cityHeaders = [];
    let paramSecretary = {};

    marketShare.map(item => {
        let register = item.key.split(':');
        let city = register[2];

        let valueCity = {};
        valueCity['value'] = city;
        valueCity['label'] = city;

        cityHeaders.push(city);
    });

    cityHeaders = cityHeaders.filter(function (item, pos) {
        return cityHeaders.indexOf(item) == pos;
    });

    cityHeaders.sort((a, b) => a.localeCompare(b));

    return cityHeaders;
}

function getSecretaries(marketShare) {
    let cont = 0;
    let paramSecretary = [];

    marketShare.map((item, i) => {
        let register = item.key.split(':');
        let city = register[2]
        let label = register[3];

        let array = paramSecretary[city] || [['SECRETARIAS', '%']];
        array.push([label, item.value]);

        paramSecretary[city] = array;

        cont = i;
    });

    return paramSecretary;
    // let show_pub = cont > 0 ? true : false;

    // this.setState({ show_publishers: show_pub, param_secretary: paramSecretary }, () => this.collectionChart());
}

function updateSecretaries(data_city_header, param_secretary) {
    let final_actions = [];
    data_city_header.map((city, i) => {
        let dataActions = ftdToUp(param_secretary[city], false);
        final_actions.push(dataActions);
    })

    return final_actions;
}

function getDisciplineMarketshare(param_subsidiary, param_type, param_sector, year) {
    let urlPost = `marketshare?filter[subsidiary.id]=${param_subsidiary}&filter[key]=${param_type}_CONSOLIDADO:${param_sector}:&filter[year]=${year}`;
    let disciplineHeaders = [];

    return axios.get(`${urlPost}`).then(response => {
        let marketShare = response.data.data;
        
        return marketShare;
    }).catch(err => console.log(4, err));
}

function getDisciplinesHeaders(marketShare) {
    let disciplineHeaders = [];

    marketShare.map(item => {
        let register = item.key.split(':');
        let discipline = register[2];

        let valueDiscipline = {};
        valueDiscipline['value'] = discipline;
        valueDiscipline['label'] = discipline;

        disciplineHeaders.push(discipline);
    });

    disciplineHeaders = disciplineHeaders.filter(function (item, pos) {
        return disciplineHeaders.indexOf(item) == pos;
    });

    disciplineHeaders.sort((a, b) => a.localeCompare(b));

    return disciplineHeaders;
}

function getDisciplines(marketShare) {
    let paramDiscipline = [];
    let final_disciplines = [];

    marketShare.sort((a, b) => a.value - b.value).reverse();

    marketShare.map((item, i) => {
        let register = item.key.split(':');
        let discipline = register[2]
        let label = register[3];

        let array = paramDiscipline[discipline] || [['DISCIPLINAS', '%', { role: 'annotation' }, { 'role': 'style' }]];
        array.push([label, item.value, item.value]);

        paramDiscipline[discipline] = array;

    });

    var sorted_keys = Object.keys(paramDiscipline).sort();

    sorted_keys.map((item, i) => {
        final_disciplines.push(paramDiscipline[item]);
    })

    return final_disciplines;
}

function* changeTypeFlow(action) {
    yield put(updateDisciplineData([], []));
    yield put(updateRingLoad(true));

    if (action.param_type === "SECRETARIA") {
        let marketshare = yield call(publisherChart, action.param_subsidiary, action.param_type, action.param_sector, action.year); 
        let city_headers = yield call(getCityHeaders, marketshare);
        let param_secretary = yield call(getSecretaries, marketshare);
        let show_pub = marketshare.length > 0 ? true : false;
        let data_actions = yield call(updateSecretaries, city_headers, param_secretary);
    
        yield put(setCityHeaders(city_headers));
        yield put(setParamSecretary(param_secretary));
        yield put(updateSecretaryChart(data_actions));

        yield put(updateRingLoad(false));
    }

    if (action.param_type === "ESCOLA_DISCIPLINAS") {
        let disciplines_marketshare = yield call(getDisciplineMarketshare, action.param_subsidiary, action.param_type, action.param_sector, action.year);
        let disciplines_headers = yield call(getDisciplinesHeaders, disciplines_marketshare);
        let disciplines = yield call(getDisciplines, disciplines_marketshare);

        yield put(updateDisciplineData(disciplines_headers, disciplines));
    }

    
}

function* changeSectorFlow(action) {
    yield put(updateDisciplineData([], []));
    yield put(setCityHeaders([]));
    yield put(updateRingLoad(true));

    let marketshare = yield call(publisherChart, action.param_subsidiary, action.param_type, action.param_sector, action.year); 
    
    switch(action.param_type) {
        case "ESCOLA": 
            let pub = yield ftdToUp(marketshare, true);
            pub.splice(0, 0, ['EDITORAS', '%']);
            let show_pub = pub.length > 2 ? true : false;
            yield put(updatePublish(pub, show_pub));
    
            const collections = yield call(collectionChart, action.param_subsidiary, action.param_type, action.param_sector, action.year);
            let coll = yield ftdToUp(collections, true);
            coll.splice(0, 0, ['COLEÇÕES', '%']);
            let show_col = coll.length > 3 ? true : false;
    
            yield put(updateCollections(coll, show_col));  
            yield put(updateRingLoad(false));
            break;
        case "SECRETARIA":
            let city_headers = yield call(getCityHeaders, marketshare);
            let param_secretary = yield call(getSecretaries, marketshare);
            let data_actions = yield call(updateSecretaries, city_headers, param_secretary);
        
            yield put(setCityHeaders(city_headers));
            yield put(setParamSecretary(param_secretary));
            yield put(updateSecretaryChart(data_actions));
            yield put(updateRingLoad(false));
            break;
        case "ESCOLA_DISCIPLINAS":
            let disciplines_marketshare = yield call(getDisciplineMarketshare, action.param_subsidiary, action.param_type, action.param_sector, action.year);
            let disciplines_headers = yield call(getDisciplinesHeaders, disciplines_marketshare);
            let disciplines = yield call(getDisciplines, disciplines_marketshare);

            yield put(updateDisciplineData(disciplines_headers, disciplines));
            break;
    }

}

function* marketshareFlow() {
    yield put(updateRingLoad(true));

    let array_year = yield call(getYear);
    yield put(setYear(array_year));

    let data_type = yield call(getDataType);
    yield put(setDataType(data_type));

    let param_type = yield call(getParamType);
    yield put(setParamType(param_type));

    let object_subsidiary = yield call(getDataSubsidiary);
    yield put(updateDataSubsidiary(object_subsidiary));

    let data_sector = yield call(loadSector, object_subsidiary.param_secs, object_subsidiary.param_subsidiary);
    yield put(updateSector(data_sector));

    let data_publisher = [['EDITORAS', '%']];

    let marketshare = yield call(publisherChart, object_subsidiary.param_subsidiary, param_type.value, data_sector.param_sector, array_year[0].value); 
        
    if (param_type.value == "ESCOLA") {
        const school_filter = yield call(getSchools, marketshare, data_publisher);         
        let pub = yield ftdToUp(marketshare, true);
        pub.splice(0, 0, ['EDITORAS', '%']);
        let show_pub = pub.length > 2 ? true : false;
        yield put(updatePublish(pub, show_pub));

        const collections = yield call(collectionChart, object_subsidiary.param_subsidiary, param_type.value, data_sector.param_sector, array_year[0].value);
        let coll = yield ftdToUp(collections, true);
        coll.splice(0, 0, ['COLEÇÕES', '%']);
        let show_col = coll.length > 3 ? true : false;

        yield put(updateCollections(coll, show_col));    
    } 

    yield takeLatest("CHANGE_TYPE_FLOW", changeTypeFlow);
    yield takeLatest("CHANGE_SECTOR_FLOW", changeSectorFlow);
    
    let show_publishers = yield call(getShowPublishers);
    yield put(setShowPublishers(show_publishers));
    yield put(updateRingLoad(false));
    yield put(loadMarketshareSuccess());
}

// Our watcher (saga).  It will watch for many things.
function* marketshareWatcher() {
  yield [
    takeLatest(LOAD_MARKETSHARE, marketshareFlow),
  ]
}

export default marketshareWatcher;
