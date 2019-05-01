import React, { Component } from 'react';
import './App.css';
import Autocomplete from 'react-autocomplete'
import ReactDOM from 'react-dom';

class EditEntry extends Component {

constructor(props){
    super(props);
    //props has userId for the user ID, iEntry for the initial state of the entry to be edited,
    //ReturnCh and Returnf for returning to the table with and without fetching respectively

    let foodList = this.props.foodList;
    let iEntry = this.props.iEntry;
    let iDate = this.props.iEntry.date;
    let iFood = this.props.foodList.find(function(f){return f.foodId == iEntry.foodId});
    let kcal = iFood.kcal;
    if (kcal == null || kcal == undefined) kcal = "";
    let iCat = this.props.foodCategory.find(function(f){return f.foodCategoryId == iFood.foodCategoryId});
    if (iCat == null || iCat == undefined) iCat = "";
    else iCat = iCat.foodCategoryName;
    let iTimeOfDay = this.props.iEntry.timeOfDay;
    if (iTimeOfDay == null || iTimeOfDay == undefined) iTimeOfDay = "";
    else iTimeOfDay = this.props.timesOfDay.find(function f(f){return iTimeOfDay == f.timeOfDay}).nameOfTime;
    if (!(iDate == undefined || iDate == null)) iDate = iDate.substr(0,10);
    else iDate = "";

    this.state = {foodName: iFood.foodName, 
        category: iCat, date: iDate, 
        foodId: this.props.iEntry.foodId, foodAmount: this.props.iEntry.foodAmount,
                    timeOfDay: iTimeOfDay, food: this.props.foodList,
                    categories: this.props.foodCategory, timesOfDay: this.props.timesOfDay,
                    Returnf: this.props.Returnf, ReturnCh: this.props.ReturnCh, kcal: kcal
                    };
        //Store the initial data in the state so we can actually use and change it

    this.ChangeFoodId = this.ChangeFoodId.bind(this);
    this.ChangeFoodAmount = this.ChangeFoodAmount.bind(this);
    this.ChangeTimeOfDay = this.ChangeTimeOfDay.bind(this);
    this.ClickChangeEntry = this.ClickChangeEntry.bind(this);
    this.state.Returnf = this.state.Returnf.bind(this);
    this.state.ReturnCh = this.state.ReturnCh.bind(this);
    this.ClickReturn = this.ClickReturn.bind(this);

    console.log(this.props.iEntry.timeOfDay);
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
    if (this.props.userId == "" || this.state.foodName == "" || this.state.foodAmount == ""|| this.state.timeOfDay == ""|| this.state.category == "")
    {
        document.getElementById('errors').innerHTML = "You must insert values into boxes";
        return;
    }
    if (!(/^\d+$/.test(this.props.userId) && /^\d+$/.test(this.state.foodId) && /^\d+$/.test(this.state.foodAmount)))
    {
        document.getElementById('errors').innerHTML = "Invalid input values";
        return;
    }

    let tempTime = this.state.timeOfDay;
    let timeOfDay = this.state.timesOfDay.find(function(f){return tempTime == f.nameOfTime}).timeOfDay;
    let categ = this.state.category;
    let categId = 0;
    let kcal = this.state.kcal;
    let userId = this.props.userId;
    console.log(this.state.categories);
    if (!(categ == null ||categ == undefined || categ==""))
    {
        categId = this.state.categories.find(function(f){
            console.log(f.foodCategoryName +"=" +categ);
            return f.foodCategoryName == categ}).foodCategoryId;
    }

    let newfood=[];
  let food = this.state.foodName;
  let tempId = this.state.food.find(function(f){
      return (food == f.foodName && (userId == f.addedUserId ||f.addedUserId == null));});
  if(tempId != undefined && (categId != tempId.foodCategoryId || kcal != tempId.kcal))
  {
    document.getElementById('errors').innerHTML = "Food names must be unique with their categories and kcals. Please give the food a unique name.";
      return;
  }
    if (tempId == undefined)
    {
        console.log("test1");
        newfood = {foodId: 0, foodName: this.state.foodName, foodCategoryId: this.state.categories.find(function (f){return f.foodCategoryName == categ}).foodCategoryId,
            kcal: this.state.kcal, addedUserId: this.props.userId};
        tempId = 0;
    }
    else
    {
        console.log("test2");
            tempId = tempId.foodId;
    }
    //Create a variable to store the data into for the fetch
    var newEntry = {UserId: this.props.userId, FoodId: tempId,
        TimeOfDay: timeOfDay,
        FoodAmount: Number(this.state.foodAmount),
    Date: this.state.date};
    //newEntry = JSON.stringify(newEntry);

    const apiUrl= 'https://localhost:5001/api/entry/' + this.props.iEntry.entryId;
    console.log(apiUrl);
        console.log(newEntry);
        console.log(newfood);
    new Promise(function f(resolve,reject){
        if (tempId > 0)
        {
            resolve();
        }
        else fetch("https://localhost:5001/api/foods", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },body: JSON.stringify(newfood)
        }).then((response) => response.json())
            .then((json) => {
                console.log(json);
                newEntry = {...newEntry, foodId: json};
                resolve();
            }).catch(()=>{reject()})}).then(()=>
            
            {fetch(apiUrl, {
           method: "PUT",
           headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
           },body: JSON.stringify(newEntry)
       }).then((response) => response.json())
           .then((json) => {
               console.log(json)

               //We fetched so we need to get the new data from the database
               this.state.ReturnCh();
           }).catch((e) =>{
               console.log(e);
            document.getElementById('errors').innerHTML = "Connection error";
           })});
}

//Return without making changes
ClickReturn(event){
    event.preventDefault();

    //No need to fetch data from the database
    this.state.Returnf();
    
}



render(){
    return (
        <div>
        <form>
        <Autocomplete
        getItemValue={(item) => item.foodName}
        items={this.state.food}
        renderItem={(item, isHighlighted) =>
          <div key={item.foodId} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.foodName}
          </div>
        }
        value={this.state.foodName}

        onChange={(e) => {
            this.setState({...this.state, foodName: e.target.value, category: ""});
                }}

        onSelect={(value) => {console.log(value);
            let tempId = this.state.food.find(function(f){return value == f.foodName});
            let tempCat = this.state.categories.find(function(f){return tempId.foodCategoryId == f.foodCategoryId});
            let kcal = tempId.kcal;
            console.log(kcal);
            if (kcal == undefined ||kcal == null) kcal = "";
            if (tempCat == undefined) this.setState({...this.state, foodName: value, foodId: tempId.foodId, category: "", kcal: kcal});
            else{
                this.setState({...this.state, foodName: value, foodId: tempId.foodId, category:
                    tempCat.foodCategoryName, kcal: kcal
                });

            }
            console.log(tempId)}}
      />

<Autocomplete id="editcategory"
        getItemValue={(item) => item.foodCategoryName}
        items={this.state.categories}
        renderItem={(item, isHighlighted) =>
          <div key={item.foodCategoryId} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.foodCategoryName}
          </div>
        }
        value={this.state.category}

        onSelect={(value) => {this.setState({...this.state, category: value});}}
      />

    <input type='text' placeholder='kcal/100g' value={this.state.kcal} onChange={(e) => {this.setState({...this.state, kcal: e.target.value})}}></input>

    <input type='text' placeholder='FoodAmount(g)' value = {this.state.foodAmount} onChange={this.ChangeFoodAmount}/>

    

      <input type='date' placeholder='date' value={this.state.date} onChange={(e) => {this.setState({...this.state, date:e.target.value})}}></input>

      <Autocomplete
        getItemValue={(item) => item.nameOfTime}
        items={this.state.timesOfDay}
        renderItem={(item, isHighlighted) =>
          <div key={item.timeOfDay} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.nameOfTime}
          </div>
        }
        value={this.state.timeOfDay}

        onSelect={(value) => {this.setState({...this.state, timeOfDay: value});}}
      />

      </form>
        <button onClick={this.ClickChangeEntry}>Change Entry</button>
        <button onClick={this.ClickReturn}>Return</button>
        <div id="errors"/></div>);
}
    
}
export default EditEntry;