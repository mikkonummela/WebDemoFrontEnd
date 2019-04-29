import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import PostUser from './PostUser';

//Used to handle logins before accessing the main program
//Its children form the main components
class ChooseUser extends Component {

    constructor(props) {
        super(props);

        //props should have this.props.Logout function to be called when the logout button is pressed
        //and the user logs out
        this.state = {username: "", password: ""};

        //Binding some necessary functions
        this.DoStuff = this.DoStuff.bind(this);
        this.ChangeUsername = this.ChangeUsername.bind(this);
        this.ChangePassword = this.ChangePassword.bind(this);
    }


    //These functions simply store the values of the te_t bo_es
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

    //The method called when the user tries to log in
    DoStuff(event){
        event.preventDefault();

        //Make sure a proper username has been inserted
        if (this.state.username == "")
        {
            ReactDOM.render("You must specify a username", document.getElementById('testi'));
            return;
        }

        //Lets the user know the program is connecting and that it might take a while
        ReactDOM.render("Connecting...", document.getElementById('testi'));

        //The url used to access the backend api that handles the database connections
       const apiUrl= 'https://localhost:5001/api/users/' + this.state.username;
       console.log(apiUrl);

       //Checks the database for whether the username is in the system
       fetch(apiUrl, {
           method: "GET",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },
       }).then((response) => response.json())
           .then((json) => {
               console.log(json);
               
               const success = json;
               console.log(`Response from server: ${success}.`);

               //Empties the divs that don't have a purpose anymore
               document.getElementById('chooseuser').innerHTML = "<div/>"
               document.getElementById('testi').innerHTML = "<div/>"

               //Calls the PostUser component to show the data of the user that just logged in
               //Passes down the logout function and the user id
               ReactDOM.render(<PostUser Logout = {this.props.Logout} userId={success.userId}/>, document.getElementById('root2'));
               
           }).catch(function(error) {
            console.log(error);

            //Lets the user know that there were issues in logging in
            if(error.name === 'TypeError') ReactDOM.render("Connection failed, try again later", document.getElementById('testi'));
            else ReactDOM.render("Invalid username or other unspecific error", document.getElementById('testi'));
           });

        
    }

    render() {

        //chooseuser and testi are used for logging in, root2 is the main div to be used later on
        return (
            <div>
        <div id = "chooseuser">
            
        <form>
            <input type="text" placeholder="Username" value={this.state.username} onChange={this.ChangeUsername}></input>
            <input type="text" placeholder="Password" value={this.state.password} onChange={this.ChangePassword}></input>
            <button onClick={this.DoStuff}>Click</button>
        </form>
        </div>
        <div id="testi"></div>
        <div id="root2"/>
        </div>
        );
    }
}
export default ChooseUser;