import React, { Component } from 'react';
import './App.css';

class AddEntry extends Component {

constructor(props){
    super(props);
    //props has userId to know whose entry we are adding, as well as UpdateFunction so we know which function
    //to call when refreshing the table containing the data

    this.state = {foodId: "", foodAmount: "", timeOfDay: ""};
    this.ChangeFoodId = this.ChangeFoodId.bind(this);
    this.ChangeFoodAmount = this.ChangeFoodAmount.bind(this);
    this.ChangeTimeOfDay = this.ChangeTimeOfDay.bind(this);
    this.ClickAddEntry = this.ClickAddEntry.bind(this);
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

//Function to call when clicking the add button
ClickAddEntry(event)
{
    event.preventDefault();

    //Make sure the new entry is actually valid
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

    //Create a variable to store the data into for the fetch
    var newEntry = {UserId: this.props.userId, FoodId: Number(this.state.foodId),
        TimeOfDay: Number(this.state.timeOfDay),
        FoodAmount: Number(this.state.foodAmount)};
    newEntry = JSON.stringify(newEntry);
    const apiUrl= 'https://localhost:5001/api/entry/';
    fetch(apiUrl, {
           method: "POST",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },body: newEntry
       }).then((response) => response.json())
           .then((json) => {
               console.log(json)
               //Once the fetch has succeeded we will update the table containing the entries
               this.props.updateFunction();
           }).catch(() =>{
            document.getElementById('errors').innerHTML = "Connection error";
           });
}

//Simply contains the necessary te_t bo_es for inputting the new data into as well as the button for
//actual addition
render(){
    return (
    <form onSubmit={this.ClickAddEntry}>
        <input type='text' placeholder='FoodID' value = {this.state.foodId} onChange={this.ChangeFoodId}/>
        <input type='text' placeholder='FoodAmount(g)' value = {this.state.foodAmount} onChange={this.ChangeFoodAmount}/>
        <input type='text' placeholder='TimeOfDay' value={this.state.timeOfDay} onChange={this.ChangeTimeOfDay}/>
        <button type='submit'>Add New Entry</button>
        <div id="errors"/>
    </form>);
}
    
}
export default AddEntry;