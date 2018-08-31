import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';

// We'll use this function to redirect to different routes based on cases
import {
  createHashHistory,
} from 'history';

// import { handleApiErrors } from '../lib/api-errors'
import {
  STUDENTS_CREATING,
  STUDENTS_REQUESTING,
  STUDENTS_SELECT_LEVEL,
  STUDENTS_SELECT_SHIFT,
} from '../actionTypes/students';

import {
  studentsCreateSuccess,
  studentsCreateError,
  studentsRequestSuccess,
  studentsRequestError,
  setStudentLevelId,
  setStudentShiftId,
} from '../actions/students';

const studentsUrl = `${process.env.API_URL}`;

export const history = createHashHistory();

function handleRequest(request) {
  return request
    .then(response => response.json())
    .then(json => json)
    .catch((error) => {
      throw error;
    });
}

function* studentsSelectLevel(action){
  const levelId = action.levelId
  yield put(setStudentLevelId(levelId))
}

function* studentsSelectShift(action){
  const shiftId = action.shiftId;
  yield put(setStudentShiftId(shiftId))
}

function studentsCreate(user, students) {
  const dataStudents = students;
  dataStudents.active = true;

  console.log(dataStudents)

  const url = `${studentsUrl}/students`;
  const request = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // passes our token as an "Authorization" header in
      // every POST request.
      Authorization: `Bearer ${user.access_token}` || undefined, // will throw an error if no login
    },
    body: JSON.stringify(dataStudents),
  });

  return handleRequest(request);
}

function* studentsCreateFlow(action) {
  try {
    const {
      user,
      students,
    } = action;


    // if (student.id !== undefined) {
    //   const updatedShift = yield call(shiftUpdate, user, shift)
    //   yield put(shiftUpdateSuccess(updatedShift))
    // } else {
    const createdStudent = yield call(studentsCreate, user, students);
    yield put(studentsCreateSuccess(createdStudent));

    // history.push('/cadastro/turnos');
  } catch (error) {
    // same with error
    yield put(studentsCreateError(error));
  }
}

function studentsRequest(user) {
  const url = `${studentsUrl}/shifts`;
  const request = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // passe our token as an "Authorization" header
      Authorization: `Bearer ${user.access_token}` || undefined,
    },
  });
  return handleRequest(request);
}

function* shiftRequestFlow(action) {
  try {
    // grab the user from our action
    const {
      user, 
      // students,
    } = action;

    const students = yield call(studentsRequest, user);
    yield put(studentsRequestSuccess(students));
  } catch (error) {
    yield put(studentsRequestError(error));
  }
}

function* studentsWatcher() {
  // each of the below RECEIVES the action from the .. action
  yield [
    takeLatest(STUDENTS_CREATING, studentsCreateFlow),
    takeLatest(STUDENTS_REQUESTING, shiftRequestFlow),
    takeLatest(STUDENTS_SELECT_LEVEL, studentsSelectLevel),
    takeLatest(STUDENTS_SELECT_SHIFT, studentsSelectShift),
  ];
}

export default studentsWatcher;
