import React, { Component } from 'react';
import './App.css';

class DelEntry extends Component {

constructor(props){
    super(props);
    //props has userId for the user ID, iEntry for the initial state of the entry to be edited,
    //ReturnCh and Returnf for returning to the table with and without fetching respectively

    this.state = {Returnf: this.props.Returnf, ReturnCh: this.props.ReturnCh, date: this.props.iEntry.date.substr(0,10)};
        //Store the initial data in the state so we can actually use and change it

    this.ClickDelEntry = this.ClickDelEntry.bind(this);
    this.state.Returnf = this.state.Returnf.bind(this);
    this.state.ReturnCh = this.state.ReturnCh.bind(this);
    this.ClickReturn = this.ClickReturn.bind(this);
}


//Function called when the change button is clicked, updates the database with the new data
ClickDelEntry(event)
{
    event.preventDefault();

    const apiUrl= 'https://localhost:5001/api/entry/' + this.props.iEntry.entryId + '/' + this.props.userId;
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
               this.state.ReturnCh();
           });//.catch(() =>{return Promise.reject()});
}

//Return without making changes
ClickReturn(event){
    event.preventDefault();

    //No need to fetch data from the database
    this.state.Returnf();
    
}



render(){
    return (
        <div><form>
            <input type='text' readOnly placeholder='FoodName' value = {this.props.foodname}/>
        <input type='text' readOnly placeholder='FoodAmount(g)' value = {this.props.iEntry.foodAmount}/>
        <input type='date' readOnly value={this.state.date}/>
        </form>
        <button onClick={this.ClickDelEntry}>Delete Entry</button>
        <button onClick={this.ClickReturn}>Return</button>
        <div id="errors"/>
        </div>
    );
}
    
}
export default DelEntry;