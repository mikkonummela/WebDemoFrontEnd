import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';

class EditEntry extends Component {

constructor(props){
    super(props);
    //props has userId for the user ID, iEntry for the initial state of the entry to be edited,
    //ReturnCh and Returnf for returning to the table with and without fetching respectively

    this.state = {Returnf: this.props.Returnf, ReturnCh: this.props.ReturnCh, foodId: this.props.iEntry.foodId, foodAmount: this.props.iEntry.foodAmount,
                    timeOfDay: this.props.iEntry.timeOfDay};
        //Store the initial data in the state so we can actually use and change it

    this.ChangeFoodId = this.ChangeFoodId.bind(this);
    this.ChangeFoodAmount = this.ChangeFoodAmount.bind(this);
    this.ChangeTimeOfDay = this.ChangeTimeOfDay.bind(this);
    this.ClickChangeEntry = this.ClickChangeEntry.bind(this);
    this.state.Returnf = this.state.Returnf.bind(this);
    this.state.ReturnCh = this.state.ReturnCh.bind(this);
    this.ClickReturn = this.ClickReturn.bind(this);
}

ChangeFoodId(event)
{
    this.setState({...this.state, foodId: event.target.value});
}

ChangeFoodAmount(event)
{
    this.setState({...this.state, foodAmount: event.target.value});
}

ChangeTimeOfDay(event)
{
    this.setState({...this.state, timeOfDay: event.target.value});
}


//Function called when the change button is clicked, updates the database with the new data
ClickChangeEntry(event)
{
    event.preventDefault();

    //Checks the validity of the data
    if (this.props.userId == "" || this.state.foodId == "" || this.state.foodAmount == "")
    {
        document.getElementById('errors').innerHTML = "You must insert values into boxes";
        return;
    }
    if (!(/^\d+$/.test(this.props.userId) && /^\d+$/.test(this.state.foodId) && /^\d+$/.test(this.state.foodAmount)))
    {
        document.getElementById('errors').innerHTML = "Invalid input values";
        return;
    }

    //Stores the new entry for fetching
    var newEntry = {UserId: this.props.userId, EntryId: this.props.iEntry.entryId, FoodId: Number(this.state.foodId),
        TimeOfDay: Number(this.state.timeOfDay),
        FoodAmount: Number(this.state.foodAmount)};
    newEntry = JSON.stringify(newEntry);

    const apiUrl= 'https://localhost:5001/api/entry/' + this.props.iEntry.entryId;
    console.log(apiUrl);

    fetch(apiUrl, {
           method: "PUT",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },body: newEntry
       }).then((response) => response.json())
           .then((json) => {
               console.log(json)

               //We fetched so we need to get the new data from the database
               this.state.ReturnCh();
           }).catch(() =>{
            document.getElementById('errors').innerHTML = "Connection error";
           });
}

//Return without making changes
ClickReturn(event){
    event.preventDefault();

    //No need to fetch data from the database
    this.state.Returnf();
    
}



render(){
    return (
    <form>
        <input type='text' placeholder='FoodID' value = {this.state.foodId} onChange={this.ChangeFoodId}/>
        <input type='text' placeholder='FoodAmount(g)' value = {this.state.foodAmount} onChange={this.ChangeFoodAmount}/>
        <input type='text' placeholder='TimeOfDay' value={this.state.timeOfDay} onChange={this.ChangeTimeOfDay}/>
        <button onClick={this.ClickChangeEntry}>Change Entry</button>
        <button onClick={this.ClickReturn}>Return</button>
        <div id="errors"/>
    </form>);
}
    
}
export default EditEntry;