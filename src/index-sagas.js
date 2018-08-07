// import SignupSaga from './signup/sagas'
import LoginSaga from './sagas/login'
import IndicatorsSaga from './sagas/indicators'
import ShiftSaga from './sagas/shifts'
import DropdownSaga from './sagas/dropdown'
import MarketshareSaga from './sagas/marketshare';
import UserSchoolSaga from './sagas/userSchool';
import GridApiSaga from './sagas/gridApi';

export default function* IndexSaga () {
  yield [
    LoginSaga(),
    DropdownSaga(),
    MarketshareSaga(),
    UserSchoolSaga(),
    IndicatorsSaga(),
    ShiftSaga(),
    GridApiSaga()
  ]
}
