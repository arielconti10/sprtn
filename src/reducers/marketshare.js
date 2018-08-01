import { GET_YEAR, UNSET_MARKETSHARE, SET_DATA_TYPE, SET_PARAM_TYPE, UPDATE_SUBSIDIARY, 
    UPDATE_SECTOR, SET_SECTOR, SET_SHOW_PUBLISHERS, UPDATE_PUBLISH, UPDATE_COLLECTION,
    SET_CITY_HEADERS, SET_PARAM_SECRETARY, UPDATE_SECRETARY_CHART, UPDATE_DISCIPLINE_DATA, UPDATE_RING_LOAD,
    LOAD_MARKETSHARE, SUCCESS_LOAD_MARKETSHARE
} from '../actionTypes/marketshare'

const initialState = {
    data_year: null
}

const reducer = function marketshareReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_MARKETSHARE:
        const marketshare_loaded = false;

        return {
            ...state,
            marketshare_loaded
        };
    case SUCCESS_LOAD_MARKETSHARE:
        state.marketshare_loaded = true;
        return {
            ...state
        }
    case GET_YEAR:
       const data_year = action.year;
      return {
        ...state, 
        data_year
      }

    case SET_DATA_TYPE:
      const data_type = action.types;
      return {
          ...state,
          data_type
      };

    case SET_PARAM_TYPE:
      const param_type = action.param_type;
      return {
        ...state,
        param_type
      };

    case UPDATE_SUBSIDIARY:
      const subsidiary_object = action.subsidiary;
      const data_subsidiary = subsidiary_object.data_subsidiary;
      const param_secs = subsidiary_object.param_secs;
      const param_subsidiary = subsidiary_object.param_subsidiary;
      const show_no_register = subsidiary_object.show_no_register;

      return {
        ...state,
        data_subsidiary,
        param_secs,
        param_subsidiary,
        show_no_register
      };

    case UPDATE_SECTOR:
        const data_sector = action.sector.data_sector;
        const param_sector = action.sector.param_sector;

        return {
            ...state,
            data_sector,
            param_sector,
            // param_subsidiary
        }
    case SET_SECTOR:
        const sector_id = action.sector.value;
        const sector_object = {value: action.sector.value, label: action.sector.label};
        const new_state = state;
        new_state.param_sector = sector_id;

        return { ...new_state };
    case SET_SHOW_PUBLISHERS:
        // const show_publishers = action.show_publishers;
        return {
            ...state,
            // show_publishers
        }
    case UPDATE_PUBLISH:
        const data_publisher = action.data_publisher;
        const show_publishers = action.show_publishers;

        return {
            ...state,
            data_publisher,
            show_publishers
        }
    case UPDATE_COLLECTION:
        const data_collection = action.data_collection;
        const show_collections = action.show_collections;
        return {
            ...state,
            data_collection,
            show_collections
        }
    case SET_CITY_HEADERS:
        const data_city_header = action.cityHeaders;

        return {
            ...state,
            data_city_header
        }
    case SET_PARAM_SECRETARY:
        const param_secretary = Object.values(action.param_secretary);

        return {
            ...state,
            param_secretary
        }
    case UPDATE_SECRETARY_CHART:
        const dataActions = action.dataActions;

        return {
            ...state,
            dataActions
        }
    case UPDATE_DISCIPLINE_DATA:
        const data_discipline_header = action.data_discipline_header;
        const param_discipline = action.param_discipline;

        state.ring_load = false;

        return {
            ...state,
            data_discipline_header,
            param_discipline
        }
    case UPDATE_RING_LOAD:
        const ring_load = action.ring_load;
        return {
            ...state,
            ring_load
        }
    case UNSET_MARKETSHARE: 
        return {
            data_year: null
        }  
    default:
      return state
  }
}

export default reducer