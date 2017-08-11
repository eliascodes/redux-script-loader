import { RSL_APPEND, RSL_SUCCESS, RSL_FAIL } from './constants.js';
import { validateRSLAction, isRSLA } from './validation.js';
import { InvalidRSL } from './errors.js';
import { appendScriptTag, getScriptAttributes, getLoadingCheck } from './util.js';


export default (doc) => ({ dispatch }) => {
  return (next) => (action) => {
    // detect script loader action
    if (! isRSLA(action)) {
      return next(action);
    }

    // validate script loader action
    const validationErrors = validateRSLAction(action);
    if (validationErrors.length) {
      return dispatch({
        type: RSL_APPEND,
        payload: new InvalidRSL(validationErrors),
        error: true,
      });
    }

    // append script tag
    const attr = getScriptAttributes(action);
    appendScriptTag(doc, attr);

    // dispatch script loading tag
    dispatch({ type: RSL_APPEND, payload: attr });

    // fire check
    const check = getLoadingCheck(action);

    // dispatch finish/timeout after check resolves/rejects
    check()
      .then(() => dispatch({ type: RSL_SUCCESS, payload: attr }))
      .catch((e) => dispatch({ type: RSL_FAIL, payload: e, error: true }));
  };
};
