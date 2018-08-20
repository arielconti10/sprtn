import { DROPDOWN_SHOW, DROPDOWN_HIDE } from '../actionTypes/dropdown';

export function showDropdown() {
  return {
    type: DROPDOWN_SHOW,
  }
}

export function hideDropdown() {
  return {
    type: DROPDOWN_HIDE,
  }
}