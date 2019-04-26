import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChooseUser from './ChooseUser';
import PostUser from './PostUser';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ChooseUser />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
