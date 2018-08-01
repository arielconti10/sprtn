// import SignupSaga from './signup/sagas'
import LoginSaga from './sagas/login'
import DropdownSaga from './sagas/dropdown'
import MarketshareSaga from './sagas/marketshare';

export default function* IndexSaga () {
  yield [
    LoginSaga(),
    DropdownSaga(),
    MarketshareSaga()
  ]
}
