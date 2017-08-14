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
  t.deepEqual(errors[0].message, '"payload" is required');
});

test('validateRSLAction | payload, non-boolean "async"', (t) => {
  const action = { type: RSL_LOAD, payload: 'foo', async: 1 };

  const errors = validateRSLAction(action);

  t.is(errors.length, 1);
  t.deepEqual(errors[0].message, '"async" must be a boolean');
});

test('validateRSLAction | payload, non-string non-FSA append', (t) => {
  const action = { type: RSL_LOAD, payload: 'foo', append: 1 };

  const errors = validateRSLAction(action);

  t.is(errors.length, 2);
  t.deepEqual(errors[0].message, '"append" must be a string');
  t.deepEqual(errors[1].message, '"append" must be an object');
});

test('validateRSLAction | payload, string append', (t) => {
  const action = { type: RSL_LOAD, payload: 'foo', append: 'BAR' };

  const errors = validateRSLAction(action);

  t.is(errors.length, 0);
});

test('validateRSLAction | payload, FSA append', (t) => {
  const action = { type: RSL_LOAD, payload: 'foo', append: { type: 'BAR', payload: 1 } };

  const errors = validateRSLAction(action);

  t.is(errors.length, 0);
});
