import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import PostUser from './PostUser';

class ChooseUser extends Component {

    constructor(props) {
        super(props);
        this.state = {username: "", password: ""};
        this.DoStuff = this.DoStuff.bind(this);
        this.ChangeUsername = this.ChangeUsername.bind(this);
        this.ChangePassword = this.ChangePassword.bind(this);
    }

    ChangeUsername(event)
    {
        event.preventDefault();
        this.setState({...this.state, username: event.target.value});
    }

    ChangePassword(event)
    {
        event.preventDefault();
        this.setState({...this.state, password: event.target.value});
    }

    DoStuff(event){
        event.preventDefault();
        if (this.state.username == "")
        {
            ReactDOM.render("You must specify a username", document.getElementById('testi'));
            return;
        }
        ReactDOM.render("Connecting...", document.getElementById('testi'));
       // send an asynchronous request to the backend

       const apiUrl= 'https://localhost:5001/api/users/' + this.state.username;
       console.log(apiUrl);
       fetch(apiUrl, {
           method: "GET",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },
       }).then((response) => response.json())
           .then((json) => {
               console.log(json);
               // store the data returned from the backend to the current state
               const success = json;
               console.log(`Response from server: ${success}.`);
               ReactDOM.render(<PostUser userId={success.userId}/>, document.getElementById('root'));
               
           }).catch(function(error) {
            console.log(error);;
            if(error.name === 'TypeError') ReactDOM.render("Connection failed, try again later", document.getElementById('testi'));
            else ReactDOM.render("Invalid username or other unspecific error", document.getElementById('testi'));
           });

        
    }

    render() {
        return (
            <div>
            
        <form>
            <input type="text" placeholder="Username" value={this.state.username} onChange={this.ChangeUsername}></input>
            <input type="text" placeholder="Password" value={this.state.password} onChange={this.ChangePassword}></input>
            <button onClick={this.DoStuff}>Click</button>
        </form>
        <div id="testi"></div>
        </div>
        );
    }
}
export default ChooseUser;