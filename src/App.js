import React from "react";
import WeekNum from "./WeekNumberFunction"

const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;

class App extends React.Component {
  render(){
    return(
        <WeekNum/>
    )
  }
}

export default App;