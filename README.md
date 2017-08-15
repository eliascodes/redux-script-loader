# redux-script-loader

## Contents
1. [Usage](#usage)
2. [Installation](#installation)
3. [API](#api)
4. [RSL Actions](#rsl-actions)

## Usage
A simple example:

```js
import { RSL_LOAD } from 'redux-script-loader';

dispatch({
  type: RSL_LOAD,
  payload: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js',
  success: 'LOAD_SUCCESS',
  fail: 'LOAD_FAIL',
});
```

## Installation
To install from npm:
```
$ npm install --save redux-script-loader
```

Then to configure with your redux store:
```js
import { createStore, applyMiddleware } from 'redux';
import { loaderMiddleware } from 'redux-script-loader';
import reducer from './reducers';

const store = createStore(reducer, applyMiddleware(loaderMiddleware(document)));
```

## API

### `RSL_LOAD` :: `Symbol`
A symbol indicating that the action should be handled by the `redux-script-loader` middleware.

### `loaderMiddleware` :: `Function`
Returns a redux-compatible middleware. Must be initialised with the `document` object.

## RSL Actions

### `action.type` :: `Symbol`
Must be `RSL_LOAD` imported from the `redux-script-loader` package.

### `action.payload` :: `String`
The URL from which to load the script. Will be used as the `src` attribute of the `script` tag.

### `action.append` :: `String | FSA`
Action to dispatch when appending the script tag to the document. Can either be a string, or a Flux standard action.

### `action.success` :: `String | FSA`
Action to dispatch when the appended script tag finishes loading. Equivalent to the `load` event on the `script` element.

### `action.fail` :: `String | FSA`
Action to dispatch when the appended script tag fails to load. Equivalent to the `error` event on the `script` element.
