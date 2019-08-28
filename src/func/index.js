import createHistory from 'history/createHashHistory';
export const history = createHistory();
const EventEmitter = require('events').EventEmitter;
export const toggleLoading = (block) => {
  const el = document.getElementById('loadingContainer');
  el.style.display = block || 'none';
};

export const events = new EventEmitter();
