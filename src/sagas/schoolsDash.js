import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'

  import {
    setYears, setYearParam, setPublishers, updateLoader, setColections
  } from '../actions/schoolDash'
    
  const apiUrl = `${process.env.API_URL}/school`
  
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
 * obtem os anos que existem em um marketshare de uma escola
 * @param {Array} marketshare dados referentes ao marketshare de uma escola
 * @param {Array} years anos encontrados
 */
function filterYears(marketshare) {

    let selectedYear = parseInt(new Date().getFullYear());
    let years = [];
    let aux = 0;

    if (marketshare.length > 0) {
        selectedYear = marketshare.reduce(function (prevVal, elem) {
            return Math.max(elem.year);
        });

        marketshare.map(item => {
            let year = {};

            if (aux !== item.year) {
                year['value'] = item.year;
                year['label'] = item.year;

                years.push(year);
                aux = item.year;
            }
        });

        years.push({ value: 2017, label: 2017 }, { value: 2018, label: 2018 })
    }

    return years;        
}

/**
 * carrega os dados das editoras, para ser utilizado no gráfico
 * @param {Array} marketshare dados do marketshare
 * @return {Array} publishers dados a serem publicados
 */
function loadPublishers(marketshare, year_param) {
    let pubFTD = null;
    let publishers = [
        ['Editoras', '%']
    ];

    marketshare.map((item, i) => {
        if (item.year !== year_param.value) return;

        let register = item.key.split(':');
        let key = register[0];
        let label = register[1];
        if (key === 'EDITORAS') {
            if (label.search("FTD") !== -1) {
                pubFTD = [label, item.value];
            } else {
                publishers.push([label, item.value]);
            }
        } 

    });

    if (pubFTD) {
        publishers.splice(1, 0, pubFTD);
    }

    return publishers;
}

/**
 * carrega as coleções referentes a editora
 * @param {Array} marketshare dados do marketshare
 * @param {Object} year_param ano selecionadp
 * @return {Array} colections coleções a serem publicadas
 */
function loadColections(marketshare, year_param) {
    let colections = [
        ['Coleções', '%', { 'role': 'style' }],['',0,'']
    ];

    const paletteColors = ["#009de8", "#FD0006", "#1aaf5d", "#f45b00", "#8e0000", "#000000", "#7D7D7D", "#00CB19", "#8C0172", "#F70060", "#1B7474", "#0a3b60", "#f2c500", "#BCF25B", "#00DDCD"];

    marketshare.map((item, i) => {
        if (item.year !== year_param.value) return;
        
        let register = item.key.split(':');
        let key = register[0];
        let label = register[1];
        
        if (key !== 'EDITORAS') {
            if(paletteColors[i]){
                colections.push([label, item.value, `color: ${paletteColors[i]}`]);
            } else {
                colections.push([label, item.value, `color: ${paletteColors[Math.floor(Math.random()*paletteColors.length)]}`]);
            }
        }

    });

    return colections;
}

function* verifySelectedYear(years, marketshare) {
    if (years.length > 0) {
        const first_year = years[0];

        const publishers = yield call(loadPublishers, marketshare, first_year);
        const colections = yield call(loadColections, marketshare, first_year);

        yield put(setYearParam(first_year));
        yield put(setPublishers(publishers));
        yield put(setColections(colections));
    } else {
        yield put(setPublishers([
            ['Editoras', '%']
        ]));
        yield put(setColections([
            ['Coleções', '%', { 'role': 'style' }],['',0,'']
        ]));
    }
}

function* loadDashFlow(action) {
    const years = yield call(filterYears, action.marketshare);

    yield put(setYears(years));

    yield call(verifySelectedYear, years, action.marketshare);
}

function* changeYearFlow(action) {
    yield put(updateLoader(true));

    const year_param = action.year_param;
    const publishers = yield call(loadPublishers, action.marketshare, year_param);
    const colections = yield call(loadColections, action.marketshare, year_param);

    yield put(setYearParam(year_param));
    yield put(setPublishers(publishers));
    yield put(setColections(colections));
    
    yield put(updateLoader(false));
}

function* schoolDashWatcher() {
    yield [
        takeLatest("LOAD_DASH_FLOW", loadDashFlow),
        takeLatest("CHANGE_YEAR_FLOW", changeYearFlow)
    ]
}
  
  export default schoolDashWatcher