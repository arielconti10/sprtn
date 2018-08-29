// import SignupSaga from './signup/sagas'
import LoginSaga from './sagas/login'
import IndicatorsSaga from './sagas/indicators'
import ShiftSaga from './sagas/shifts'
import LocalizationSaga from './sagas/localization'
import SetorSaga from './sagas/setor'
import ChainSaga from './sagas/chain'
import ProfileSaga from './sagas/profile'
import LevelSaga from './sagas/level'
import DisciplineSaga from './sagas/discipline'
import CongregationSaga from './sagas/congregation'
import SubsidiarySaga from './sagas/subsidiary'
import SchoolTypesSaga from './sagas/schoolTypes'
import DropdownSaga from './sagas/dropdown'
import MarketshareSaga from './sagas/marketshare';
import JobTitleSaga from './sagas/job_title';
import UserSchoolSaga from './sagas/userSchool';
import GridApiSaga from './sagas/gridApi';
import UserSaga from './sagas/user';
import RoleSaga from './sagas/roles';
import RuleSaga from './sagas/rules';
import SchoolSaga from './sagas/schools';
import SchoolDashSaga from './sagas/schoolsDash';
import ContactSaga from './sagas/contact';
import EventSaga from './sagas/event';

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
    ChainSaga(),
    ProfileSaga(),
    LevelSaga(),
    DisciplineSaga(),
    CongregationSaga(),
    SubsidiarySaga(),
    SchoolTypesSaga(),
    UserSaga(),
    RoleSaga(),
    JobTitleSaga(),
    RuleSaga(),
    SchoolSaga(),
    SchoolDashSaga(),
    ContactSaga(),
    EventSaga()
  ]
}
