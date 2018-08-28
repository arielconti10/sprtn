import {
  STUDENTS_CREATING,
  STUDENTS_CREATE_SUCCESS,
  STUDENTS_CREATE_ERROR,
  STUDENTS_REQUESTING,
  STUDENTS_REQUEST_SUCCESS,
  STUDENTS_REQUEST_ERROR,
} from '../actionTypes/students';

const initialState = {
  list: [],
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
};

const reducer = function studentsReducer(state = initialState, action) {
  switch (action.type) {
    case STUDENTS_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `students: ${action.shift.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      };

      // On success include the new shift into our list
    case STUDENTS_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.shift]),
        requesting: false,
        successful: true,
        messages: [{
          body: `shift: ${action.shift.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      };

    case STUDENTS_CREATE_ERROR:
      return {
        ...state,
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      };

    case STUDENTS_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching shifts...!',
          time: new Date(),
        }],
        errors: [],
      };

    case STUDENTS_REQUEST_SUCCESS:
      return {
        list: action.shifts, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'shifts awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      };

    case STUDENTS_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      };

    default:
      return state;
  }
};

export default reducer;
