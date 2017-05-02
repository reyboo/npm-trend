import EventEmitter from 'events';
import _ from 'lodash';
import URL from 'url-parse';

import * as globals from '../helpers/globals';

const history = globals.get('history');
const emiter = new EventEmitter();
let prevPath = '';

function emitChange(url) {
  const urlInfos = new URL(url, true);
  const info = {
    prevPath,
    path: urlInfos.pathname,
    query: urlInfos.query,
    url,
  };
  prevPath = info.path;
  emiter.emit('change', info);
}

export function on(...args) {
  emiter.on(...args);
}

export function off(...args) {
  emiter.off(...args);
}

export function push(url, title = '') {
  history.pushState(null, title, url);
  emitChange(url);
}

export function relace(url, title = '') {
  history.replaceState(null, title, url);
  emitChange(url);
}

_.defer(() => emitChange(globals.get('location.href')));

globals.set('onpopstate', () => emitChange(globals.get('location.href')));
