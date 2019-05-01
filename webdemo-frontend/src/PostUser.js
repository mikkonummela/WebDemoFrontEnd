import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import AddEntry from './AddEntry.js';
import EditEntry from './EditEntry.js';
import DelEntry from './DelEntry.js';


class PostUser extends Component {

    constructor(props)
    {
        super(props);
        //props include the Logout function for logging out and the userId to store the user ID

        //addrend is used to store info to make sure certain components aren't needlessly rerendered
        this.state = {addrend: false};

        //Necessary bindings
        this.GetEntries = this.GetEntries.bind(this);
        this.GetFoods = this.GetFoods.bind(this);
        this.GetCategories = this.GetCategories.bind(this);
        this.GetTimesOfDay = this.GetTimesOfDay.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.UpdateEntries = this.UpdateEntries.bind(this);
        this.DelFoodClick = this.DelFoodClick.bind(this);
        this.DelFood = this.DelFood.bind(this);
        this.EditFoodClick = this.EditFoodClick.bind(this);
        this.Logout = this.Logout.bind(this);
        this.PostEntries = this.PostEntries.bind(this);
    }

    //Called only when render() has been so we can affect the rendered <div>s
    componentDidMount()
     {
         this.UpdateEntries();
     }

    //This functions gets information from the database and shows it to the user
    UpdateEntries(){
        //Get rid of old mounts if necessary
        ReactDOM.unmountComponentAtNode(document.getElementById('postentry'));

        //Shows the user that we're fetching data again
        document.getElementById('postentry').innerHTML = "Connecting to database";
        document.getElementById('posterror').innerHTML = "";

        //Creates a chain of promises to make sure all necessary data has been fetched before rendering it
        //Can cause errors otherwise
        var testfunction = this.GetEntries;
        var testfunction2 = this.GetFoods;
        var testfunction3 = this.GetCategories;
        var testfunction4 = this.GetTimesOfDay;
        Promise.all([new Promise(function(resolve,reject){testfunction(resolve,reject);}),
            new Promise(function(resolve,reject){testfunction2(resolve,reject);}),
            new Promise(function(resolve,reject){testfunction3(resolve,reject);}),
            new Promise(function(resolve,reject){testfunction4(resolve,reject);})
        ])
            .then(()=>{
                this.PostEntries();

                //Renders things if they haven't already been rendered
                if (this.state.addrend == false){
                    this.setState({...this.state, addrend: true});
                    ReactDOM.render(<AddEntry returnf = {this.UpdateEntries} timesOfDay = {this.state.timesOfDay} foodCategory = {this.state.categories} foodList = {this.state.foods} userId = {this.props.userId} updateFunction = {this.UpdateEntries}/>, document.getElementById('addentry'));
                    ReactDOM.render(<button onClick={this.Logout}>Log Out</button>,document.getElementById('logoutbutton'))
                }
                    
            }).catch(()=>{
                //Just shows that the connection failed to the user
                document.getElementById('posterror').innerHTML = "Connection failure";
            });
    }

    //Fetches the main entries from the database and stored them into the state
    //Calls resolve when done, or reject if the fetch fails
    GetEntries(resolve,reject)
    {
        const apiUrl= 'https://localhost:5001/api/entry/user/' + this.props.userId;
        console.log(apiUrl);
        fetch(apiUrl, {
           method: "GET",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },
       }).then((response) => response.json())
           .then((json) => {
               this.setState({...this.state, entries: json});
               console.log(this.state.entries)
               resolve();
           })//.catch(() =>{reject();});
           ;
    }

    GetCategories(resolve,reject)
    {
        const apiUrl= 'https://localhost:5001/api/foodcategory/';
        console.log(apiUrl);
        fetch(apiUrl, {
           method: "GET",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },
       }).then((response) => response.json())
           .then((json) => {
               this.setState({...this.state, categories: json});
               console.log(this.state.categories)
               resolve();
           }).catch(() =>{
               console.log("This failed");
               reject();});
    }

    GetTimesOfDay(resolve,reject)
    {
        const apiUrl= 'https://localhost:5001/api/timesofday/';
        console.log(apiUrl);
        fetch(apiUrl, {
           method: "GET",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },
       }).then((response) => response.json())
           .then((json) => {
               this.setState({...this.state, timesOfDay: json});
               resolve();
           }).catch(() =>{
               console.log("This failed");
               reject();});
    }

    //Makes two fetches for the Foods table (simplify into one? Prob requires backend changes....)
    GetFoods(resolve,reject)
    {
        let foods = [];

        //Fetches both the food items available for everyone or ones that the user added themself
        const apiUrl= 'https://localhost:5001/api/foods/user/0';
        const apiUrl2= 'https://localhost:5001/api/foods/user/' + this.props.userId;
        console.log(apiUrl);
        fetch(apiUrl, {
           method: "GET",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },
       }).then((response) => response.json())
       .then((json) =>{
               // store the data returned from the backend to the current state
               foods = json;
               console.log(foods);
           }).catch(() => {
                console.log("ERROR1");
                reject();
           }).then(() => fetch(apiUrl2, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
           })).then((response) => response.json())
        .then((json) =>{
                // store the data returned from the backend to the current state
                console.log(json);

                //Combines the fetched data
                foods = foods.concat(json);
                console.log(foods);
                this.setState({...this.state, foods: foods});
                resolve();
            }).catch(() =>{
                console.log("ERROR2");
                reject();
            })
            ;
    }

    //Called when the user clicks a delete button
    DelFoodClick(event)
    {

        //The ids used have the form DEL123456 so we remove the non-numerical characters
        let entryid = event.target.id.replace(/[^\d.]/g, '');

        let delentry = this.state.entries.find(function(f) {return f.entryId == entryid; });
        let foodname = this.state.foods.find(function(f) {return f.foodId == delentry.foodId; }).foodName;

        ReactDOM.render(<DelEntry foodname = {foodname} userId = {this.props.userId} iEntry = {delentry} ReturnCh = {this.UpdateEntries} Returnf = {this.PostEntries}/>, document.getElementById('postentry'));
        //This promise makes sure that we only update the table when the fetch is succesful
        /*new Promise(function(resolve,reject){
            testfunction(resolve,reject,entryid)
        }).then(() => {
            this.UpdateEntries();
        }).catch(()=> {
            document.getElementById('posterror').innerHTML = "Error in deletion";
        });*/
    }

    //Function for when Edit is clicked
    EditFoodClick(event)
    {
        //IDs have the form Edit123456 so we remove the non-numerical characters
        let entryid = event.target.id.replace(/[^\d.]/g, '');

        //Uses the properly formed ID to find the Entry in question we want to edit
        let editentry = this.state.entries.find(function(f) {return f.entryId == entryid; });

        //Rends an entry edit component, passes down the user id and the initial state, as well as the functions
        //to be called when returning from the edit screen, Returnf for when no edits were made and ReturnCh when the have been
        ReactDOM.render(<EditEntry timesOfDay = {this.state.timesOfDay} foodCategory = {this.state.categories} foodList = {this.state.foods} userId = {this.props.userId} iEntry = {editentry} ReturnCh = {this.UpdateEntries} Returnf = {this.PostEntries}/>, document.getElementById('postentry'));

    }

    //Function for deleting things (entry with the id entryid) from the database
    //Resolves when succesful and rejects when failed
    DelFood(resolve,reject,entryid){
        const apiUrl= 'https://localhost:5001/api/entry/' + entryid + '/' + this.props.userId;
        console.log(apiUrl);
        fetch(apiUrl, {
           method: "DELETE",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },
            }).then((response) => response.json())
           .then((json) => {
               console.log(json);
               resolve();
           });//.catch(() =>{return Promise.reject()});
        }

    //Posts the entries in a component after they have been fetched. Make sure the entry data actually e_ists
    //before calling this function
    PostEntries(resolve,reject)
    {
        //Removes needless mounts if necessary
        ReactDOM.unmountComponentAtNode(document.getElementById('postentry'));
        let food = [];
        let category = "";
        let timeofday = "";

        //Created a html code for the table where the data will be presented in
        let entries = "<table><thead><tr><th>Food</th><th>Amount</th><th>Category</th><th>Time of Day</th><th>Date</th><th>DEL</th><th>EDIT</th></tr></thead><tbody>";
        let e="";

        //Make sure that there is data in the entries state
        if(this.state.entries == null){
            document.getElementById('postentry').innerHTML = "No entries found (connection errors possible?)";
        }
        else{
            //Loops over the states in order to properly create the table
            for(e in this.state.entries)
            {
                var currentry = this.state.entries[e];

                timeofday = this.state.timesOfDay.find(function(f) {return currentry.timeOfDay == f.timeOfDay});
                if (timeofday == undefined) timeofday = "Unknown";
                else timeofday = timeofday.nameOfTime;
                //Finds the name of the food in question instead of posting a meaningless number ID
                food = this.state.foods.find(function(f) {return currentry.foodId == f.foodId });
                category = this.state.categories.find(function(f) {return food.foodCategoryId == f.foodCategoryId });
                //Includes the data as well as DEL and EDIT options
                entries += "<tr><td>" + food.foodName + "</td><td>" + currentry.foodAmount +"g</td><td>" 
                    + category.foodCategoryName + "</td><td>" + timeofday + "</td><td>" + currentry.date + "</td><td id=del" + currentry.entryId +" delid =" + currentry.entryId +">DEL</td><td id=edit" + currentry.entryId +" editlid =" + currentry.entryId +">EDIT</td></tr>";
            }
            //Finishes the table
            entries += "</tbody></table>";

            //Render the table we just created
            document.getElementById('postentry').innerHTML = entries;

            //Creates the onClick functionalities, they don't seem to work when added in the string itself
            for(e in this.state.entries)
            {
                document.getElementById('del' + this.state.entries[e].entryId).onclick = this.DelFoodClick;
                document.getElementById('edit' + this.state.entries[e].entryId).onclick = this.EditFoodClick;
            }
        }
    }

    //Logs out and returns to the username input screen. Unnecessary?
    Logout(event){
        event.preventDefault();
        this.props.Logout();
    }

    //Creates four divs to put things into
    render() {
        return (
            <div>
            <div id="postentry"/>
            <div id="posterror"/>
            <div id="addentry"/>
            <div id="logoutbutton"></div>
            </div>
        );
    }
}
export default PostUser;