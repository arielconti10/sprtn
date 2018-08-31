import {
  STUDENTS_CREATING,
  STUDENTS_CREATE_SUCCESS,
  STUDENTS_CREATE_ERROR,
  STUDENTS_REQUESTING,
  STUDENTS_REQUEST_SUCCESS,
  STUDENTS_REQUEST_ERROR,
  STUDENTS_SELECT_LEVEL,
  STUDENTS_SET_LEVEL,
  STUDENTS_SET_SHIFT,
  STUDENTS_SELECT_SHIFT,
  UNLOAD_STUDENTS,
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
          body: `students: being created...`,
          time: new Date(),
        }],
        errors: [],
      };

    // On success include the new shift into our list
    case STUDENTS_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.students]),
        requesting: false,
        successful: true,
        messages: [{
          body: `students:  awesomely created!`,
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

    case STUDENTS_SELECT_LEVEL:
      return {
        ...state
      }

    case STUDENTS_SET_LEVEL:
      const levelId = action.levelId;
      return {
        ...state,
        levelId
      }

    case STUDENTS_SELECT_SHIFT:
      return {
        ...state
      }

    case STUDENTS_SET_SHIFT:
      const shiftId = action.shiftId;
      return {
        ...state,
        shiftId
      }

    case UNLOAD_STUDENTS:
      state.students = {}
      state.levelId = ''
      state.shiftId = ''
      return {
        ...state
      }
    default:
      return state;
  }
};

export default reducer;
