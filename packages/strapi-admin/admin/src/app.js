// /**
//  *
//  * app.js
//  *
//  * Entry point of the application
//  */

import '@babel/polyfill';
import 'sanitize.css/sanitize.css';

// Third party css library needed
// Currently unable to bundle them.
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/liquibyte.css';
import 'codemirror/theme/xq-dark.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/cobalt.css';

import 'react-select/dist/react-select.css';
import 'react-datetime/css/react-datetime.css';

import './styles/main.scss';

window.strapi = Object.assign(window.strapi || {}, {
  node: MODE || 'host',
  remoteURL,
  backendURL: BACKEND_URL,
  notification: {
    success: message => {
      displayNotification(message, 'success');
    },
    warning: message => {
      displayNotification(message, 'warning');
    },
    error: message => {
      displayNotification(message, 'error');
    },
    info: message => {
      displayNotification(message, 'info');
    },
  },
  refresh: pluginId => ({
    translationMessages: translationMessagesUpdated => {
      render(merge({}, translationMessages, translationMessagesUpdated));
    },
    leftMenuSections: leftMenuSectionsUpdated => {
      store.dispatch(
        updatePlugin(pluginId, 'leftMenuSections', leftMenuSectionsUpdated)
      );
    },
  }),
  router: history,
  languages,
  currentLanguage:
    window.localStorage.getItem('strapi-admin-language') ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    'en',
  lockApp,
  unlockApp,
  injectReducer,
  injectSaga,
  store,
});

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { merge } from 'lodash';
import {
  freezeApp,
  pluginLoaded,
  unfreezeApp,
  updatePlugin,
  getAppPluginsSucceeded,
} from './containers/App/actions';
import { showNotification } from './containers/NotificationProvider/actions';

import basename from './utils/basename';
import injectReducer from './utils/injectReducer';
import injectSaga from './utils/injectSaga';

// Import root component
import App from './containers/App';
// Import Language provider
import LanguageProvider from './containers/LanguageProvider';

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages, languages } from './i18n';

// Create redux store with history
import history from './utils/history';

const plugins = require('./plugins');

const initialState = {};
const store = configureStore(initialState, history);
const { dispatch } = store;
const MOUNT_NODE =
  document.getElementById('app') || document.createElement('div');

dispatch(getAppPluginsSucceeded(Object.keys(plugins)));

Object.keys(plugins).forEach(plugin => {
  const currentPlugin = plugins[plugin];

  const pluginTradsPrefixed = languages.reduce((acc, lang) => {
    const currentLocale = currentPlugin && currentPlugin.trads && currentPlugin.trads[lang];

    if (currentLocale) {
      const localeprefixedWithPluginId = Object.keys(currentLocale).reduce(
        (acc2, current) => {
          acc2[`${plugins[plugin].id}.${current}`] = currentLocale[current];

          return acc2;
        },
        {}
      );

      acc[lang] = localeprefixedWithPluginId;
    }

    return acc;
  }, {});

  try {
    merge(translationMessages, pluginTradsPrefixed);
    dispatch(pluginLoaded(currentPlugin));
  } catch (err) {
    console.log({ err });
  }
});

// TODO
const remoteURL = (() => {
  if (window.location.port === '4000') {
    return 'http://localhost:4000/admin';
  }

  // Relative URL (ex: /dashboard)
  if (process.env.REMOTE_URL[0] === '/') {
    return (window.location.origin + process.env.REMOTE_URL).replace(/\/$/, '');
  }

  return process.env.REMOTE_URL.replace(/\/$/, '');
})();

const displayNotification = (message, status) => {
  dispatch(showNotification(message, status));
};
const lockApp = data => {
  dispatch(freezeApp(data));
};
const unlockApp = () => {
  dispatch(unfreezeApp());
};

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <BrowserRouter basename={basename}>
          <App store={store} />
        </BrowserRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  module.hot.accept(['./i18n', './containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);

    render(translationMessages);
  });
}

if (NODE_ENV !== 'test') {
  // Chunked polyfill for browsers without Intl support
  if (!window.Intl) {
    new Promise(resolve => {
      resolve(import('intl'));
    })
      .then(() =>
        Promise.all([
          import('intl/locale-data/jsonp/en.js'),
          import('intl/locale-data/jsonp/de.js'),
        ])
      ) // eslint-disable-line prettier/prettier
      .then(() => render(translationMessages))
      .catch(err => {
        throw err;
      });
  } else {
    render(translationMessages);
  }
}

// @Pierre Burgy exporting dispatch for the notifications...
export { dispatch };

// TODO remove this for the new Cypress tests
if (window.Cypress) {
  window.__store__ = Object.assign(window.__store__ || {}, { store });
}
