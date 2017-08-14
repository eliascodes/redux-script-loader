import { createStore, applyMiddleware } from 'redux';
import { loaderMiddleware, RSL_LOAD } from '../dist/index.js';

const APPEND = '@@example/APPEND';
const SUCCESS = '@@example/SUCCESS';
const FAIL = '@@example/FAIL';

const SRC = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js';

const reducer = (state = {}, action) => {
  switch (action.type) {
  case APPEND:
    return { status: 'loading' };
  case SUCCESS:
    return { status: 'successfully loaded' };
  case FAIL:
    return { status: 'failed to load' };
  default:
    return { ...state };
  }
};

const store = createStore(reducer, applyMiddleware(loaderMiddleware(document)));

store.subscribe(() => {
  document.querySelector('#status').textContent = store.getState().status;
});

document.querySelector('#btn-success').addEventListener('click', () => {
  store.dispatch({
    type: RSL_LOAD,
    payload: SRC,
    append: APPEND,
    success: SUCCESS,
    fail: FAIL,
  });
});

document.querySelector('#btn-fail').addEventListener('click', () => {
  store.dispatch({
    type: RSL_LOAD,
    payload: 'https://example.com/foo.js',
    append: APPEND,
    success: SUCCESS,
    fail: FAIL,
  });
});
