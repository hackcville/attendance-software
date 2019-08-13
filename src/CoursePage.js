import React from 'react';
import Phone from "./PhonePage";
import Member from "./memberOrNot";

const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;

let date = new Date();
let coursesObjectList = {};
let x = -1;
let studentNamesAttendanceObject = {};

class CoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.state = {
      courses: [],
      events: [],
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
      event: "",
      eventName: "",
      eventId: "",
      courseClicked: false,
      studentsAttendedList: []
    };
    //this.focusFunc = this.focusFunc.bind(this)
  }

  componentDidMount() {
    let coursesCall = fetch('https://api.airtable.com/v0/appMfcy98yxGtYwDO/Courses?api_key='+API_KEY)
    let eventsCall = fetch('https://api.airtable.com/v0/appMfcy98yxGtYwDO/Events?api_key='+API_KEY)

    Promise.all([coursesCall, eventsCall])
    .then(values => Promise.all(values.map(value => value.json())))
    .then(finalVals => {
      let coursesResp = finalVals[0];
      let eventsResp = finalVals[1];
      console.log(coursesResp);
      console.log(eventsResp)
      console.log(eventsResp.records)
      console.log(coursesResp.records)
      this.setState({courses: coursesResp.records, events: eventsResp.records, mount: true});
    }).catch(err => {
      // Error 🙁
    });
  }



    // fetch('https://api.airtable.com/v0/appMfcy98yxGtYwDO/Courses?api_key='+API_KEY)
    // .then((resp) => resp.json())
    // .then(data => {
    //    this.setState({ courses: data.records, mount: true });
    // }).catch(err => {
    //   // Error 🙁
    // });


  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  courseListFunction(){
    for (let i = 0; i < this.state.courses.length; i++){
        if (date.getDay() == this.state.courses[i].fields.Day){
            x = this.state.courses[i].id; // key is the course ID
            coursesObjectList[x] = [this.state.courses[i].fields.W1, this.state.courses[i].fields.W2, this.state.courses[i].fields.W3, this.state.courses[i].fields.W4, this.state.courses[i].fields.W5]
            studentNamesAttendanceObject[x] = [this.state.courses[i].fields["W1 Students"], this.state.courses[i].fields["W2 Students"], this.state.courses[i].fields["W3 Students"], this.state.courses[i].fields["W4 Students"], this.state.courses[i].fields["W5 Students"], this.state.courses[i].fields["W6 Students"], this.state.courses[i].fields["W7 Students"], this.state.courses[i].fields["W8 Students"], this.state.courses[i].fields["W9 Students"], this.state.courses[i].fields["W10 Students"]]
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
          console.log(studentNamesAttendanceObject[x][this.props.weekNumber-1])
          if (studentNamesAttendanceObject[x][this.props.weekNumber-1] !== undefined){
            buttonDataList.push(
              <div key={this.state.courses[i].id}><button onClick={() => {this.setState({courseVal: x, courseAttendanceVariable: coursesObjectList[x][this.props.weekNumber-1], courseName: this.state.courses[i].fields.Courses, courseSection: this.state.courses[i].fields.Section, courseClicked: true, studentsAttendedList: studentNamesAttendanceObject[x][this.props.weekNumber-1]}); this.setRedirect()}}>{this.state.courses[i].fields.Courses} {this.state.courses[i].fields.Section}</button></div>
            )
          }
          else{
            buttonDataList.push(
              <div key={this.state.courses[i].id}><button onClick={() => {this.setState({courseVal: x, courseAttendanceVariable: coursesObjectList[x][this.props.weekNumber-1], courseName: this.state.courses[i].fields.Courses, courseSection: this.state.courses[i].fields.Section, courseClicked: true, studentsAttendedList: []}); this.setRedirect()}}>{this.state.courses[i].fields.Courses} {this.state.courses[i].fields.Section}</button></div>
            )
          }
        }
    }
    console.log(this.state.courseAttendanceVariable)
    return buttonDataList; // return button data list because that is what is rendered when this function is called in render()
  }

  eventsButtonDataFunction(){
    let eventsButtonDataList = [];
    let dayOfMonth = ""+date.getDate();
    let monthNum = ""+(date.getMonth()+1);
    let yearNum = ""+date.getFullYear();
    if (date.getMonth() < 10){
      monthNum = "0"+monthNum;
    }
    if(dayOfMonth < 10){
      dayOfMonth = "0"+dayOfMonth;
    }
    let currentDate = yearNum + "-" + monthNum + "-" + dayOfMonth;
    console.log(currentDate)
    console.log(this.state.events)
    for (let i = 0; i < this.state.events.length; i++){
        if (currentDate == this.state.events[i].fields.Date){
          let eventNameColumn = this.state.events[i].fields["Marketing Name"]
          console.log(eventNameColumn)
          let eventIdValue = this.state.events[i].id;
          eventsButtonDataList.push(
            <div key={this.state.events[i].id}><button onClick={() => {this.setState({eventName: eventNameColumn, eventId: eventIdValue, eventBoolean: true, event: eventNameColumn}); this.setRedirect()}}>{eventNameColumn}</button></div>
          )
        }
    }
    return eventsButtonDataList; // return button data list because that is what is rendered when this function is called in render()
  }

  // when this.state.redirect is true, render the PhonePage component. to be clear, this isn't rerouting.
  renderRedirect = () => {
    console.log(this.state.studentsAttendedList)
    if (this.state.redirect && this.state.courseClicked) {
      return <Phone weekNumber = {this.props.weekNumber} courseID = {this.state.courseVal} courseAtt = {this.state.courseAttendanceVariable} officeHoursBool = {this.state.OHBoolean} courseName = {this.state.courseName} courseSection = {this.state.courseSection} officeHours = {this.state.officeHours} studyingBool = {this.state.studyingBoolean} studying = {this.state.studying} eventBool = {this.state.eventBoolean} eventVar ={this.state.event} eventId = {this.state.eventId} studentsAttended = {this.state.studentsAttendedList}/>
    }
    else {
      return <Member weekNumber = {this.props.weekNumber} courseID = {this.state.courseVal} courseAtt = {this.state.courseAttendanceVariable} officeHoursBool = {this.state.OHBoolean} courseName = {this.state.courseName} courseSection = {this.state.courseSection} officeHours = {this.state.officeHours} studyingBool = {this.state.studyingBoolean} studying = {this.state.studying} eventBool = {this.state.eventBoolean} eventVar ={this.state.event} eventId = {this.state.eventId} studentsAttended = {this.state.studentsAttendedList}/>
    }
  }

  // focusFunc(){
  //   this.nameInput.focus()
  // }

  // handleClick = (e) => {
  //   //this.nameInput.click(); // this does not seem to be clicking the textboc
  //   this.nameInput.focus(); // this does focus the textbox
  // }


  render() {
      if (this.state.mount){
        if (!this.state.redirect){
        return <div id="welcome-screen" className="container">
            <div>{this.courseListFunction()}</div>
            <div className="welcome"><h1>What brings you to HackCville?</h1></div>
            <div className="buttons">
              <div className="all-courses"> {this.buttonDataFunction()}</div>
              <div className="all-events">{this.eventsButtonDataFunction()}</div>
              <div className="other">
                <div><button onClick = {() => {this.setState({OHBoolean: true, officeHours: "Office Hours", courseClicked: true}); this.setRedirect();}}>Office Hours</button></div>
                <div><button onClick = {() => {this.setState({studyingBoolean: true, studying: "Studying"}); this.setRedirect()}}>Studying</button></div>
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
