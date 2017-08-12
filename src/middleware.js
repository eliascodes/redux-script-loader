import { validateRSLAction, isRSLA } from './validation.js';
import { InvalidRSL } from './errors.js';
import { appendScriptTag, getScriptAttributes, getLoadingCheck } from './util.js';


export default (doc) => ({ dispatch }) => {
  const dispatchIf = makeDispatchIf(dispatch);

  return (next) => (action) => {
    // detect script loader action
    if (! isRSLA(action)) {
      return next(action);
    }

    // validate script loader action
    const validationErrors = validateRSLAction(action);
    if (validationErrors.length) {
      return dispatchIf(
        action.append,
        { payload: new InvalidRSL(validationErrors), error: true }
      );
    }

    // append script tag
    const attr = getScriptAttributes(action);
    appendScriptTag(doc, attr);

    // dispatch script loading tag
    dispatchIf(action.append, { payload: attr });

    const check = getLoadingCheck(action);

    // fire check
    check()
    // dispatch finish/timeout after check resolves/rejects
      .then(() => dispatchIf(action.success, { payload: attr }))
      .catch((e) => dispatchIf(action.fail, { payload: e, error: true }));
  };
};

const makeDispatchIf = (dispatch) => (action, other) => {
  if (action) {
    dispatch({ ...other, type: action.type || action });
  }
};
