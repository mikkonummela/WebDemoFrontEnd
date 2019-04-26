import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class PostUser extends Component {

    constructor(props)
    {
        super(props);
        this.GetEntries = this.GetEntries.bind(this);
        this.GetFoods = this.GetFoods.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount()
     {
         var testfunction = this.GetEntries;
         var testfunction2 = this.GetFoods;
        Promise.all([new Promise(function(resolve,reject){testfunction(resolve,reject);}),
            new Promise(function(resolve,reject){testfunction2(resolve,reject);})])
            .then(()=>{this.PostEntries()}).catch(()=>{document.getElementById('postentry').innerHTML = "Connection failure";});
     }

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
               // store the data returned from the backend to the current state
               this.setState({...this.state, entries: json});
               console.log(this.state.entries)
               resolve();
           }).catch(() =>{reject();});
    }

    GetFoods(resolve,reject)
    {
        let foods = [];
        const apiUrl= 'https://localhost:5001/api/foods/user/0';
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
           }).catch(() =>{reject();});
           const apiUrl2= 'https://localhost:5001/api/foods/user/' + this.props.userId;
        console.log(apiUrl2);
           fetch(apiUrl2, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        }).then((response) => response.json())
        .then((json) =>{
                // store the data returned from the backend to the current state
                foods = foods.concat(json);
                console.log(foods)
                this.setState({...this.state, foods: foods});
                resolve();
            }).catch(() =>{reject();});
    }

    PostEntries(resolve,reject)
    {
        var food = [];
        let entries = "<table><thead><tr><th>Food</th><th>Amount</th><th>Category</th></tr></thead><tbody>";
        let e="";
        if(this.state.entries == null){
            document.getElementById('postentry').innerHTML = "No entries found (connection errors possible?)";
        }
        else{
            for(e in this.state.entries)
            {
                var currentry = this.state.entries[e];
                food = this.state.foods.find(function(f) {return currentry.foodId == f.foodId });
                console.log(food);
                console.log(this.state.foods)
                entries += "<tr><td>" + food.foodName + "</td><td>" + currentry.foodAmount + "g</td><td>"
                    + food.foodCategoryId + "</td></tr>";
            }
            entries += "</tbody></table>";

            document.getElementById('postentry').innerHTML = entries;
         }
    }

    render() {
        return (
            <div id="postentry">Connecting to database...</div>
        );
    }
}
export default PostUser;