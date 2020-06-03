import './polyfills';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
import './styles/index.css';
import './i18n';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
