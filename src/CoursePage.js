import React from 'react';
import PhonePage from "./PhonePage"

const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;

let date = new Date();
let coursesObjectList = {};
let x = -1;

class CoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      courseVal: "",
      courseAttendanceValues: [],
      courseAttendanceVariable: null,
      mount: false,
      redirect: false,
      OHBoolean: false,
      studyingBoolean: false,
      eventBoolean: false,
      courseName: "",
      courseSection: "",
      officeHours: "",
      studying: "",
      event: ""
    };
  }

  componentDidMount() {
    fetch('https://api.airtable.com/v0/appMfcy98yxGtYwDO/Courses?api_key='+API_KEY)
    .then((resp) => resp.json())
    .then(data => {
       this.setState({ courses: data.records, mount: true });
    }).catch(err => {
      // Error 🙁
    });
  }


  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  courseListFunction(){
    for (let i = 0; i < this.state.courses.length; i++){
        if (date.getDay() == this.state.courses[i].fields.Day){
            x = this.state.courses[i].id;
            coursesObjectList[x] = [this.state.courses[i].fields.W1, this.state.courses[i].fields.W2, this.state.courses[i].fields.W3, this.state.courses[i].fields.W4, this.state.courses[i].fields.W5]
        }
    }
  } 

  // this creates buttons with courses' name and section. buttons are rendered for a course if it is the day of the week that is listed in AirTable (numbered 0-6) for that course. onClick, updating state with the course id, the total attendance for the course for that week, as well as the course name and section. also onClick is when setRedirect() is called.
  buttonDataFunction(){
    let buttonDataList = [];
    for (let i = 0; i < this.state.courses.length; i++){
        if (date.getDay() == this.state.courses[i].fields.Day){
          let x = this.state.courses[i].id;
          console.log(x)
          console.log(coursesObjectList[x][this.props.weekNumber-1])
          buttonDataList.push(
            <div key={this.state.courses[i].id}><button onClick={() => {this.setState({courseVal: x, courseAttendanceVariable: coursesObjectList[x][this.props.weekNumber-1], courseName: this.state.courses[i].fields.Courses, courseSection: this.state.courses[i].fields.Section}); this.setRedirect()}}>{this.state.courses[i].fields.Courses} {this.state.courses[i].fields.Section}</button></div>
          )
        }
    }
    console.log(this.state.courseAttendanceVariable)
    return buttonDataList; // return button data list because that is what is rendered when this function is called in render()
  }

  // when this.state.redirect is true, render the PhonePage component. to be clear, this isn't rerouting.
  renderRedirect = () => {
    if (this.state.redirect) {
      return <PhonePage weekNumber = {this.props.weekNumber} courseID = {this.state.courseVal} courseAtt = {this.state.courseAttendanceVariable} officeHoursBool = {this.state.OHBoolean} courseName = {this.state.courseName} courseSection = {this.state.courseSection} officeHours = {this.state.officeHours} studyingBool = {this.state.studyingBoolean} studying = {this.state.studying} eventBool = {this.state.eventBoolean} eventVar ={this.state.event}/>
    }
  }


  render() {
      if (this.state.mount){
        if (!this.state.redirect){
        return <div id="welcome-screen" className="container">
            <div>{this.courseListFunction()}</div>
            <div className="welcome"><h1>Welcome!</h1></div>
            <div className="buttons">
              <div className="all-courses"> {this.buttonDataFunction()}</div>
              <div className="other">
                <div><button onClick = {() => {this.setState({OHBoolean: true, officeHours: "Office Hours"}); this.setRedirect()}}>Office Hours</button></div>
                <div><button onClick = {() => {this.setState({studyingBoolean: true, studying: "Studying"}); this.setRedirect()}}>Studying</button></div>
                <div><button onClick = {() => {this.setState({eventBoolean: true, event: "Event"}); this.setRedirect()}}>Event</button></div>
              </div>
            </div>
          </div>;
        }
        else {
          return <div>{this.renderRedirect()}</div>
        }
      }

      else {
        return (<div>Loading...</div>)
      }
  }
}


export default CoursePage;
