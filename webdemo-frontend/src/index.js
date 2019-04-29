import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChooseUser from './ChooseUser';
import * as serviceWorker from './serviceWorker';

// A function passed down to be called when the user logouts and the program essentially restarts
function Logout(){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    Rerender();
}

//Recreates the initial render after a logout
function Rerender()
{
    ReactDOM.render(<ChooseUser Logout = {Logout}/>, document.getElementById('root'));
}

//Passes down a logout function to be used when logging out
ReactDOM.render(<ChooseUser Logout = {Logout}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
