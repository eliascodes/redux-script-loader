import test from 'ava';
import { InvalidRSL } from '../src/errors.js';

const stripSpaces = (s) => s.replace(/[\n\s]/g, '');

test('InvalidRSL', (t) => {
  const errors = [
    { message: 'foo' },
    { message: 'bar' },
  ];

  const error = new InvalidRSL(errors);

  t.is(
    stripSpaces(error.message),
    stripSpaces('2 validation errors encountered: 1: foo 2:bar')
  );
  t.deepEqual(error.validationErrors, errors);
});
