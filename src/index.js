import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import AppRouter from './routers/AppRouter'

ReactDOM.render(<AppRouter />, document.getElementById('root'));

serviceWorker.unregister();
