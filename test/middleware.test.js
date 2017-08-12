import test from 'ava';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux';
import middleware from '../src/middleware.js';
import { InvalidRSL } from '../src/errors.js';
import { RSL_LOAD } from '../src/constants.js';


test.cb('Middleware | Load Successfully', (t) => {
  const dom = new JSDOM('<!DOCTYPE html>', { runScripts: 'dangerously' });
  const reducer = sinon.spy(() => ({}));
  const store = createStore(reducer, applyMiddleware(middleware(dom.window.document)));
  const src = 'https://foo.com';
  const RSL_APPEND = 'RSL_APPEND';
  const RSL_SUCCESS = 'RSL_SUCCESS';

  store.subscribe(() => {
    switch (reducer.callCount) {
    case 1: // ignore @@redux/INIT
      break;
    case 2:
      t.deepEqual(
        reducer.lastCall.args[1],
        { type: RSL_APPEND, payload: { src, async: true } }
      );
      break;
    case 3:
      t.deepEqual(
        reducer.lastCall.args[1],
        { type: RSL_SUCCESS, payload: { src, async: true } }
      );
      t.end();
      break;
    default:
      t.end(new Error('Unexpected reducer call count'));
    }
  });

  store.dispatch({ type: RSL_LOAD, payload: src, append: RSL_APPEND, success: RSL_SUCCESS });
});


test.cb('Middleware | Load Failure', (t) => {
  const dom = new JSDOM('<!DOCTYPE html>', { runScripts: 'dangerously' });
  const reducer = sinon.spy(() => ({}));
  const store = createStore(reducer, applyMiddleware(middleware(dom.window.document)));
  const src = 'https://foo.com';
  const RSL_APPEND = 'RSL_APPEND';
  const RSL_FAIL = 'RSL_FAIL';

  store.subscribe(() => {
    switch (reducer.callCount) {
    case 1: // ignore @@redux/INIT
      break;
    case 2:
      t.deepEqual(
        reducer.lastCall.args[1],
        { type: RSL_APPEND, payload: { src, async: true } }
      );
      break;
    case 3:
      t.deepEqual(
        reducer.lastCall.args[1],
        { type: RSL_FAIL, payload: new Error('oops'), error: true }
      );
      t.end();
      break;
    default:
      t.end(new Error('Unexpected reducer call count'));
    }
  });

  store.dispatch({
    type: RSL_LOAD,
    payload: src,
    check: () => Promise.reject(new Error('oops')),
    append: RSL_APPEND,
    fail: RSL_FAIL,
  });
});


test.cb('Middleware | Validation Error', (t) => {
  const dom = new JSDOM('<!DOCTYPE html>', { runScripts: 'dangerously' });
  const reducer = sinon.spy(() => ({}));
  const store = createStore(reducer, applyMiddleware(middleware(dom.window.document)));
  const RSL_APPEND = 'RSL_APPEND';

  store.subscribe(() => {
    switch (reducer.callCount) {
    case 1: // ignore @@redux/INIT
      break;
    case 2:
      t.deepEqual(
        reducer.lastCall.args[1],
        {
          type: RSL_APPEND,
          payload: new InvalidRSL([ { message: '"payload" is required' } ]),
          error: true
        }
      );
      t.end();
      break;
    default:
      t.end(new Error('Unexpected reducer call count'));
    }
  });

  store.dispatch({ type: RSL_LOAD, append: RSL_APPEND });
});


test.cb('Middleware | No consequent actions', (t) => {
  const dom = new JSDOM('<!DOCTYPE html>', { runScripts: 'dangerously' });
  const reducer = sinon.spy(() => ({}));
  const store = createStore(reducer, applyMiddleware(middleware(dom.window.document)));
  const src = 'https://foo.com';

  store.subscribe(() => {
    t.fail(new Error('Unexpected reducer call count'));
    t.end();
  });

  store.dispatch({ type: RSL_LOAD, payload: src });

  t.is(reducer.callCount, 1);
  t.end();
});
