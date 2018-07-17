// import SignupSaga from './signup/sagas'
import LoginSaga from './sagas/login'

export default function* IndexSaga () {
  yield [
    LoginSaga(),
  ]
}
