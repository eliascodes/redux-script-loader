import test from 'ava';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux';
import middleware from '../src/middleware.js';
import { InvalidRSL } from '../src/errors.js';
import { RSL_LOAD, RSL_APPEND, RSL_SUCCESS, RSL_FAIL } from '../src/constants.js';


test.cb('Middleware | Load Successfully', (t) => {
  const dom = new JSDOM('<!DOCTYPE html>', { runScripts: 'dangerously' });
  const reducer = sinon.spy(() => ({}));
  const store = createStore(reducer, applyMiddleware(middleware(dom.window.document)));
  const src = 'https://foo.com';

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

  store.dispatch({ type: RSL_LOAD, payload: src });
});


test.cb('Middleware | Load Failure', (t) => {
  const dom = new JSDOM('<!DOCTYPE html>', { runScripts: 'dangerously' });
  const reducer = sinon.spy(() => ({}));
  const store = createStore(reducer, applyMiddleware(middleware(dom.window.document)));
  const src = 'https://foo.com';

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
  });
});


test.cb('Middleware | Validation Error', (t) => {
  const dom = new JSDOM('<!DOCTYPE html>', { runScripts: 'dangerously' });
  const reducer = sinon.spy(() => ({}));
  const store = createStore(reducer, applyMiddleware(middleware(dom.window.document)));

  store.subscribe(() => {
    switch (reducer.callCount) {
    case 1: // ignore @@redux/INIT
      break;
    case 2:
      t.deepEqual(
        reducer.lastCall.args[1],
        {
          type: RSL_APPEND,
          payload: new InvalidRSL([ { message: 'No "payload" attribute' } ]),
          error: true
        }
      );
      t.end();
      break;
    default:
      t.end(new Error('Unexpected reducer call count'));
    }
  });

  store.dispatch({ type: RSL_LOAD });
});
