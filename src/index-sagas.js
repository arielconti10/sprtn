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
<<<<<<< HEAD
import StudentsSaga from './sagas/students';
=======
import EventSaga from './sagas/event';
import DistributionSaga from './sagas/distribution'
import MeetingSaga from './sagas/meeting'
>>>>>>> fe31be7b851d62e45101ec9c57a1d9e22f8f9462

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
<<<<<<< HEAD
    StudentsSaga(),
=======
    EventSaga(),
    DistributionSaga(),
    MeetingSaga()
>>>>>>> fe31be7b851d62e45101ec9c57a1d9e22f8f9462
  ]
}
