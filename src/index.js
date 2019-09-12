import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import Board from './components/Board'

ReactDOM.render(<Board />, document.getElementById('root'));

serviceWorker.unregister();
