import test from 'ava';
import { JSDOM } from 'jsdom';
import { appendScriptTag, getScriptAttributes } from '../src/util.js';

test('appendScriptTag', (t) => {
  const dom = new JSDOM('<!DOCTYPE html>', { runScripts: 'dangerously' });
  const document = dom.window.document; // eslint-disable-line
  const src = 'https://foo.com/';
  const async = true;

  appendScriptTag(document, { src, async });

  const script = document.querySelector('script');

  t.not(script, null);
  t.is(script.src, src);
});

test('getScriptAttributes | w/ async', (t) => {
  const action = { payload: 'https://foo.com', async: false };

  const attrs = getScriptAttributes(action);

  t.is(typeof attrs, 'object');
  t.is(attrs.src, action.payload);
  t.is(attrs.async, action.async);
});

test('getScriptAttributes | w/o async', (t) => {
  const action = { payload: 'https://foo.com' };

  const attrs = getScriptAttributes(action);

  t.is(typeof attrs, 'object');
  t.is(attrs.src, action.payload);
  t.is(attrs.async, true);
});
