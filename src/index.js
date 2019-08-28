import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducers';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as mr from 'mobx-react';
import storePro from 'store';

const Pro = mr.Provider;
let composeEnhancers = compose;
const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  // middleware.push(createLogger());
  if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
}
const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)));
const EL = document.getElementById('root');
let render = () => {
  ReactDOM.render(
    <Pro {...storePro}>
      <Provider store={store}>
        <LocaleProvider locale={zh_CN}>
          <App />
        </LocaleProvider>
      </Provider>
    </Pro>,
    EL
  );
};

if (module.hot) {
  module.hot.accept(['./App', './reducers', './mobx'], () =>
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(EL);
      render();
    })
  );
}
render();
registerServiceWorker();
