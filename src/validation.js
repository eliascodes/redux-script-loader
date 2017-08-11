import { RSL_LOAD } from './constants.js';

export const isRSLA = ({ type }) => type === RSL_LOAD;

export const validateRSLAction = ({ payload, async, check }) => {
  const validationErrors = [];

  if (! payload) {
    validationErrors.push({ message: 'No "payload" attribute' });
  }

  if (async) {
    if (typeof async !== 'boolean') {
      validationErrors.push({ message: 'Optional parameter "async" must be boolean' });
    }
  }

  if (check) {
    if (typeof check !== 'function') {
      validationErrors.push({ message: 'Optional parameter "check" must be function' });
    }
  }

  return validationErrors;
};
