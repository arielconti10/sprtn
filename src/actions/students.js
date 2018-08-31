import {
  STUDENTS_CREATING,
  STUDENTS_CREATE_SUCCESS,
  STUDENTS_CREATE_ERROR,
  STUDENTS_REQUESTING,
  STUDENTS_REQUEST_SUCCESS,
  STUDENTS_REQUEST_ERROR,
  STUDENTS_SELECT_LEVEL,
  STUDENTS_SET_LEVEL,
  STUDENTS_SELECT_SHIFT,
  STUDENTS_SET_SHIFT,
  UNLOAD_STUDENTS
} from '../actionTypes/students';

export const studentsCreate = function studentsCreate(user, students) {

  return {
    type: STUDENTS_CREATING,
    user,
    students,
  };
};

export const studentsCreateSuccess = function studentsCreateSuccess(students) {
  return {
    type: STUDENTS_CREATE_SUCCESS,
    students,
  };
};

export const studentsCreateError = function studentsCreateError(error) {
  return {
    type: STUDENTS_CREATE_ERROR,
    error,
  };
};

export const studentsRequest = function studentsRequest(user) {
  return {
    type: STUDENTS_REQUESTING,
    user,
  };
};

export const studentsRequestSuccess = function studentsRequestSuccess(students) {
  return {
    type: STUDENTS_REQUEST_SUCCESS,
    students,
  };
};

export const studentsRequestError = function studentsRequestError(error) {
  return {
    type: STUDENTS_REQUEST_ERROR,
    error,
  };
};

export function studentsSelectLevel (levelId) {
  return {
    type: STUDENTS_SELECT_LEVEL,
    levelId,
  }
}

export function setStudentLevelId(levelId) {
  return {
    type: STUDENTS_SET_LEVEL,
    levelId
  }
}

export function studentsSelectShift (shiftId) {
  return {
    type: STUDENTS_SELECT_SHIFT,
    shiftId,
  }
}

export function setStudentShiftId(shiftId) {
  return {
    type: STUDENTS_SET_SHIFT,
    shiftId
  }
}

export function unloadStudents() {
  return {
    type: UNLOAD_STUDENTS,
  };
  
}