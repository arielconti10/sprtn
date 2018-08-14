// import SignupSaga from './signup/sagas'
import LoginSaga from './sagas/login'
import IndicatorsSaga from './sagas/indicators'
import ShiftSaga from './sagas/shifts'
import LocalizationSaga from './sagas/localization'
import SetorSaga from './sagas/setor'
import SchoolTypesSaga from './sagas/schoolTypes'
import DropdownSaga from './sagas/dropdown'
import MarketshareSaga from './sagas/marketshare';
import UserSchoolSaga from './sagas/userSchool';
import GridApiSaga from './sagas/gridApi';
import UserSaga from './sagas/user';

export default function* IndexSaga () {
  yield [
    LoginSaga(),
    DropdownSaga(),
    MarketshareSaga(),
    UserSchoolSaga(),
    IndicatorsSaga(),
    ShiftSaga(),
    GridApiSaga(),
    LocalizationSaga(),
    SetorSaga(),
    SchoolTypesSaga(),
    UserSaga()

  ]
}
