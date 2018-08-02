// import SignupSaga from './signup/sagas'
import LoginSaga from './sagas/login'
import IndicatorsSaga from './sagas/indicators'
import ShiftSaga from './sagas/shifts'
import DropdownSaga from './sagas/dropdown'

export default function* IndexSaga () {
  yield [
    LoginSaga(),
    DropdownSaga(),
    IndicatorsSaga(),
    ShiftSaga()
  ]
}
