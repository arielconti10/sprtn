// import SignupSaga from './signup/sagas'
import LoginSaga from './sagas/login'
import DropdownSaga from './sagas/dropdown'

export default function* IndexSaga () {
  yield [
    LoginSaga(),
    DropdownSaga(),
  ]
}
