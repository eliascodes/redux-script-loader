import test from 'ava';
import { RSL_LOAD } from '../src/constants.js';
import { isRSLA, validateRSLAction } from '../src/validation.js';


test('isRSLA | true', (t) => {
  t.true(isRSLA({ type: RSL_LOAD }));
});

test('isRSLA | false', (t) => {
  t.false(isRSLA({ type: 'FOO' }));
  t.false(isRSLA({}));
});

test('validateRSLAction | no payload', (t) => {
  const action = { type: RSL_LOAD };

  const errors = validateRSLAction(action);

  t.is(errors.length, 1);
  t.deepEqual(errors[0], { message: 'No "payload" attribute' });
});

test('validateRSLAction | payload, non-boolean "async"', (t) => {
  const action = { type: RSL_LOAD, payload: 'foo', async: 1 };

  const errors = validateRSLAction(action);

  t.is(errors.length, 1);
  t.deepEqual(errors[0], { message: 'Optional parameter "async" must be boolean' });
});

test('validateRSLAction | payload, non-function "check"', (t) => {
  const action = { type: RSL_LOAD, payload: 'foo', check: 1 };

  const errors = validateRSLAction(action);

  t.is(errors.length, 1);
  t.deepEqual(errors[0], { message: 'Optional parameter "check" must be function' });
});

test('validateRSLAction | payload, non-boolean "async", non-function "check"', (t) => {
  const action = { type: RSL_LOAD, payload: 'foo', async: 1, check: 1 };

  const errors = validateRSLAction(action);

  t.is(errors.length, 2);
  t.deepEqual(errors[0], { message: 'Optional parameter "async" must be boolean' });
  t.deepEqual(errors[1], { message: 'Optional parameter "check" must be function' });
});
