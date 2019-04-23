const path = require('path');
const pkg = require('./package.json');

module.exports = {
  'object-assign': require.resolve('object-assign'),
  'whatwg-fetch': require.resolve('whatwg-fetch'),
  classnames: require.resolve('classnames'),
  'codemirror$': require.resolve('codemirror'),
  crypto: require.resolve('crypto'),
  history: require.resolve('history'),
  'hoist-non-react-statics': require.resolve('hoist-non-react-statics'),
  immutable: require.resolve('immutable'),
  'intl$': require.resolve('intl'),
  invariant: require.resolve('invariant'),
  moment: require.resolve('moment'),
  'prop-types$': require.resolve('prop-types'),
  react: require.resolve('react'),
  'react-copy-to-clipboard': require.resolve('react-copy-to-clipboard'),
  'react-datetime$': require.resolve('react-datetime'),
  'react-dnd': require.resolve('react-dnd'),
  'react-dnd-html5-backend': require.resolve('react-dnd-html5-backend'),
  'react-dom': require.resolve('react-dom'),
  'react-ga': require.resolve('react-ga'),
  'react-helmet': require.resolve('react-helmet'),
  'react-intl$': require.resolve('react-intl'),
  'react-loadable': require.resolve('react-loadable'),
  'react-redux': require.resolve('react-redux'),
  'react-router': require.resolve('react-router'),
  'react-router-dom': require.resolve('react-router-dom'),
  'react-select$': require.resolve('react-select'),
  'react-transition-group': require.resolve('react-transition-group'),
  reactstrap: require.resolve('reactstrap'),
  redux: require.resolve('redux'),
  'redux-immutable': require.resolve('redux-immutable'),
  'redux-saga$': require.resolve('redux-saga'),
  'remove-markdown': require.resolve('remove-markdown'),
  reselect: require.resolve('reselect'),
  'strapi-helper-plugin': require.resolve('strapi-helper-plugin'),
  'styled-components': require.resolve('styled-components'),
  'video-react$': require.resolve('video-react'),
};

// module.exports = alias.reduce((acc, curr) => {
//   try {
//     acc[curr] = require.resolve(curr);
//   } catch (e) {
//     // ignore
//   }

//   return acc;
// }, {});
