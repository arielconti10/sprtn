import React from 'react'
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer'
import {Login} from '../app/containers/login/Login'
import configureStore from 'redux-mock-store'
import {Provider} from 'react-redux'

import {addInputs,subtractInputs} from '../src/js/actions/calculatorActions'
import {createStore} from 'redux'
import calculatorReducers from '../src/js/reducers/calculatorReducers'

//*********************************
describe('<Login />', () => {
    describe('render()', () => {
      test('renders the component', () => {
        const wrapper = shallow(<Login />);
        const component = wrapper.dive();
  
        expect(toJson(component)).toMatchSnapshot();
      });
    });
  });