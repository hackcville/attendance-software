import React from "react"
import Welcome from "./Welcome"
import CoursePage from "./CoursePage"
import WeekNum from "./WeekNumberFunction"
import preventDoubleTapZoom from "./preventZoomOnDoubleTap"

let phoneValue = ""; // need this because of issues with onSubmit and the way variables get stored in state
let theRecords = [];
let studentObjectList = {}; // used for determining which attendance column to update
let eventsAttendedList = [];
const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY; // airtable api key from .env file


class Phone extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          students: [], // fields for each student in AirTable Fall 2019 involvement
          phone: "", // phone number student inputs
          idVal: "", // student ID value in AirTable
          valid: true, // set equal to false when the number a student inputs is not valid, is used to show error messages
          attendanceValStudying: null, 
          attendanceValEvent: null,
          mount: false, // whether or not componentDidMount has run
          redirect: false, // set equal to true when valid phone number is submitted, is used to redirect to welcome page
          redirectBack: false, // set equal to true when back button clicked, is used to redirect to first page
          studentName: "", // name of student whose valid phone number is submitted
          pointsVal: null, // is set equal to the number of points the student has in AirTable
          updatedPoints: null, // number of points student has upon submitting form
          numberClicked: "",
          addedPoints: "",
          plural: "",
          eventsAttended: []
        };
        this.handleChangeFromButton = this.handleChangeFromButton.bind(this);
        this.handleChangeFromTyping = this.handleChangeFromTyping.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      // studentData() is used to determine which student is signing in
      studentData(){
        if (phoneValue.length == 10) {
        for (let i = 0; i < this.state.students.length; i++){
          let x = ""+this.state.students[i].fields.Phone; // variable for an individual phone number in AirTable
          let zz = x.replace(/[-(). ]/g, "") // variable equal to the phone number value from AirTable with any typical non-number values removed. This is to standardize format for comparison since AirTable does not actually store phone number values in one format, though online it seems that way. Example: makes (555) 555-5555 5555555555 instead.
          console.log(this.state.students[i].fields.Name)
          console.log(this.state.students[i].fields["Events Attended"])
          console.log(zz)
          console.log(phoneValue)
          let studentFullName = "";
          let studentFirstName = "";
          if (this.state.students[i].fields.Name !== undefined){
            studentFullName = this.state.students[i].fields.Name // storing the full name of the student 
            studentFirstName = studentFullName.replace(/\s\w+$/g, "")
          }
          if (phoneValue == zz && zz != "" && phoneValue != ""){
            console.log("oh yeah")
            console.log(this.state.students[i].id)
            this.setState({idVal: this.state.students[i].id, studentName: studentFirstName, pointsVal: this.state.students[i].fields.Points, attendanceValStudying: this.state.students[i].fields.Studying, attendanceValEvent: this.state.students[i].fields.Events})
            if (this.state.students[i].fields["Events Attended"] !== undefined){ // only want to set these variables equal to the fields["Events Attended"] if the value is not undefined. These variables were initialized with empty arrays so that the first value could be pushed into them. If you set these variables = fields["Events Attended"] when the value is undefined, you won't be able to append the new eventID to an array later because the array won't exist.
              this.setState({eventsAttended: this.state.students[i].fields["Events Attended"]});
              eventsAttendedList = this.state.students[i].fields["Events Attended"];
              console.log(eventsAttendedList)
              console.log("yessirree")
            }
            else{
              this.setState({eventsAttended: []})
              console.log("should be empty")
            }
            let y = this.state.students[i].id
            console.log(y)
            studentObjectList[y] = [this.state.students[i].fields.W1, this.state.students[i].fields.W2, this.state.students[i].fields.W3, this.state.students[i].fields.W4, this.state.students[i].fields.W5, this.state.students[i].fields.W6, this.state.students[i].fields.W7, this.state.students[i].fields.W8, this.state.students[i].fields.W9, this.state.students[i].fields.W10, this.state.students[i].fields.OH1, this.state.students[i].fields.OH2, this.state.students[i].fields.OH3, this.state.students[i].fields.OH4, this.state.students[i].fields.OH5, this.state.students[i].fields.OH6, this.state.students[i].fields.OH7, this.state.students[i].fields.OH8, this.state.students[i].fields.OH9, this.state.students[i].fields.OH10]
            console.log(studentObjectList[y][0])
            break;
          }
          else {
            console.log("nope")
            this.setState({idVal: ""})
            continue;
          }
        }
        console.log("loop complete")
    }
    else{
      this.setState({idVal: ""})
    }
  }

      componentDidMount(){
        console.log(this.props.courseID, this.props.weekNumber, this.props.courseAtt, this.props.officeHoursBool, this.props.studyingBool, this.props.eventBool) // yay!
        var Airtable = require('airtable');
        var base = new Airtable({apiKey: API_KEY}).base('appMfcy98yxGtYwDO');
        base('Fall 2019 Involvement').select({
          view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
          records.forEach(function(record) {
          theRecords.push(record);  
        });
        fetchNextPage();
      }, function done(err) {
        if (err) { console.error(err); return; }
    });  
    this.setState({mount: true, students: theRecords});
    }

    setRedirect = () => {
      this.setState({
        redirect: true
      })
    }

    // updates phone number variables when a user presses one of the keypad buttons
    handleChangeFromButton(){
      if (this.state.phone === "Enter your phone number"){ // not needed now
        let numbersTyped = this.state.numberClicked;
        this.setState({phone: numbersTyped, valid: true});
        phoneValue = numbersTyped;
        this.studentData();
      }
      else {
      let numbersTyped = this.state.phone + this.state.numberClicked;
      this.setState({phone: numbersTyped, valid: true});
      phoneValue = numbersTyped;
      this.studentData();
      }
    }

    // updates number clicked in state when user presses a number button on keypad, calls handleChangeFromButton function
    numberUpdate(numberButton){
      this.setState({numberClicked: numberButton}, this.handleChangeFromButton);
    }

    // updates phone variables when user presses backspace button on keypad, calls studentData
    backspaceFunc(){
      // if (this.state.phone!="Enter your phone number"){
        let currentPhoneVal = this.state.phone
        currentPhoneVal = currentPhoneVal.slice(0, currentPhoneVal.length-1)
        this.setState({phone: currentPhoneVal, valid: true})
        phoneValue = currentPhoneVal;
        this.studentData();
      // }
    }

    // updates phone variables when user types on keyboard, calls studentData
    handleChangeFromTyping(e){
      this.setState({phone: e.target.value, valid: true})
      phoneValue = e.target.value
      this.studentData();
    }

    // updates AirTable depending on what values are passed in for parameters
    handleSubmit(idValue, studentAttendanceValue, ohAttendanceValue, courseIDVal, courseAttendanceValue, studentPoints, studyingAttendanceValue, eventAttendanceValue, studentCourseAttendanceNames){ //need to add a value for OH attendance
      var Airtable = require('airtable');
      let updatedOHAttendance = ohAttendanceValue + 1;
      let updatedStudentAttendance = studentAttendanceValue +1;
      let updatedCourseAttendance = courseAttendanceValue + 1;
      let updatedStudyingAttendance = studyingAttendanceValue + 1;
      let updatedEventAttendance = eventAttendanceValue + 1;
      let updatedPointValsForOfficeHours = studentPoints + 1;
      let updatedPointValsForStudying = studentPoints + 3;
      let updatedPointValsForEvent = studentPoints + 3;
      let updatedPointValsForCourse = studentPoints + 1;
      let weekNumberValue = "W"+this.props.weekNumber;
      let weekNumberValueStudents = "W"+this.props.weekNumber+" Students";
      let ohNumberValue = "OH"+this.props.weekNumber;
      console.log(studentCourseAttendanceNames);
      studentCourseAttendanceNames.push(idValue) // adds student name link to the appropriate attendance list in airtable
      var base = new Airtable({apiKey: API_KEY}).base('appMfcy98yxGtYwDO');
      eventsAttendedList.push(this.props.eventId) // necessary to update Events Attended column in AirTable. This is so the column will hold an array of eventIDs. This was written to overcome the problem of replacing whatever valaue was already in the cell with only the new eventID
      console.log(eventsAttendedList)
      console.log(weekNumberValue)
      console.log(this.props.eventId)
      if (this.state.idVal !== ""){
// do another if statement to determine whether you should update course and student workshop attendance or office hour attendance
      if (this.props.officeHoursBool != false){
        base('Fall 2019 Involvement').update(idValue, {
            [ohNumberValue]: updatedOHAttendance,
          "Points": updatedPointValsForOfficeHours
          }, function(err) {
            if (err) {
              console.error(err);
              return;
          }
          });
          this.setState({updatedPoints: updatedPointValsForOfficeHours, addedPoints: "1"})
     }
     else if (this.props.studyingBool != false){
      base('Fall 2019 Involvement').update(idValue, {
        Studying: updatedStudyingAttendance,
      "Points": updatedPointValsForStudying
      }, function(err) {
        if (err) {
          console.error(err);
          return;
      }
      });
      this.setState({updatedPoints: updatedPointValsForStudying, addedPoints: "3", plural:"s"})
     }
     else if (this.props.eventBool != false){
      base('Fall 2019 Involvement').update(idValue, {
        Events: updatedEventAttendance,
      "Points": updatedPointValsForEvent,
      "Events Attended": eventsAttendedList
      }, function(err) {
        if (err) {
          console.error(err);
          return;
      }
      });
      this.setState({updatedPoints: updatedPointValsForEvent, addedPoints: "3", plural: "s", eventsAttended: eventsAttendedList})
     }
else {
base('Fall 2019 Involvement').update(idValue, {
  [weekNumberValue]: updatedStudentAttendance, // need to change this to updatedStudentAttendance value
  "Points": updatedPointValsForCourse,
}, function(err) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(idValue)
});
this.setState({updatedPoints: updatedPointValsForCourse, addedPoints: "1"})

base('Courses').update(""+courseIDVal, {
[weekNumberValue]: updatedCourseAttendance,
[weekNumberValueStudents]: studentCourseAttendanceNames
}, function(err, record) {
if (err) {
  console.error(err);
  return;
}
console.log(updatedCourseAttendance)
});
}
      }

      else {
        console.log("oopsies!")
      }
}

// if the student inputs a phone number that is not 9 digits and/or is not found in AirTable
invalidPhoneNumber() {
  console.log(this.props.studentsAttended)
  console.log(this.state.idVal)
  console.log(this.state.phone)
  this.setState({valid: false})
}

// redirects to the Welcome component
renderRedirect = () => {
    //will need to also store point values (current gained and total) for student
    if (this.state.redirect){
    return <Welcome student = {this.state.studentName} points = {this.state.updatedPoints} pointsAddedToAT = {this.state.addedPoints} pluralOrNot = {this.state.plural}/>
    }
}

renderRedirectBack = () => {
  if (this.state.redirectBack){
    return <WeekNum/>
  }
}

// focusFunction() {
//   document.getElementById("phone-input").focus() // not sure what the relationship is between this and the other component
// } 

    render(){
          if (this.state.mount){
            if (!this.state.redirect && !this.state.redirectBack && this.state.valid){
          return <div id="phone-screen" className="container">
            <div>{console.log(this.props.studentsAttended)}</div>
            <div>{console.log(this.state.idVal)}</div>
              <div className="heading">Sign in to {this.props.eventVar}{this.props.studying}{this.props.officeHours}{this.props.courseName} {this.props.courseSection}</div>
              <div className="form"> 
                <input id="phone-input" placeholder="type your phone number" className="phone-number" type="text" onChange={this.handleChangeFromTyping} value={this.state.phone}></input>
                {/* <div>{this.state.phone}</div> */}
                <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
                <button className="submit" onClick={() => {this.state.idVal != "" ? this.handleSubmit(this.state.idVal, studentObjectList[this.state.idVal][this.props.weekNumber-1], studentObjectList[this.state.idVal][this.props.weekNumber+9], this.props.courseID, this.props.courseAtt, this.state.pointsVal, this.state.attendanceValStudying, this.state.attendanceValEvent, this.props.studentsAttended) : this.invalidPhoneNumber() ; if (this.state.idVal != "") {this.setRedirect()}}}>Submit!</button>
              </div>
              <div className="keypad">
                  <div className="row1">
                    <button touch-action="manipulation" onTouchStart={preventDoubleTapZoom} id="button1" onClick={() => {this.numberUpdate("1")}}>1</button>
                    <button onTouchStart={preventDoubleTapZoom} id="button2" onClick={() => {this.numberUpdate("2")}}>2</button>
                    <button onTouchStart={preventDoubleTapZoom} id="button3" onClick={() => {this.numberUpdate("3")}}>3</button>
                  </div>
                  <div className="row2">
                    <button onTouchStart={preventDoubleTapZoom} id="button4" onClick={() => {this.numberUpdate("4")}}>4</button>
                    <button onTouchStart={preventDoubleTapZoom} id="button5" onClick={() => {this.numberUpdate("5")}}>5</button>
                    <button onTouchStart={preventDoubleTapZoom} id="button6" onClick={() => {this.numberUpdate("6")}}>6</button>
                  </div>
                  <div className="row3">
                    <button onTouchStart={preventDoubleTapZoom} id="button7" onClick={() => {this.numberUpdate("7")}}>7</button>
                    <button onTouchStart={preventDoubleTapZoom} id="button8" onClick={() => {this.numberUpdate("8")}}>8</button>
                    <button onTouchStart={preventDoubleTapZoom} id="button9" onClick={() => {this.numberUpdate("9")}}>9</button>
                  </div>
                  <div className="row4">
                    <button></button>
                    <button onTouchStart={preventDoubleTapZoom} id="button0" onClick={() => {this.numberUpdate("0")}}>0</button> 
                    <button id="backspace" onClick={() => {this.backspaceFunc()}}>&#x232b;</button>
                  </div>
                </div>
            </div>
            }
            else if (!this.state.redirect && !this.state.redirectBack && !this.state.valid && phoneValue.length < 10){
              return <div className="container">
                <div className="heading">Sign in to {this.props.eventVar}{this.props.studying}{this.props.officeHours}{this.props.courseName} {this.props.courseSection}</div>
                <div className="form"> 
                  <input id="phone-input" placeholder="type your phone number" className="phone-number" type="text" onChange={this.handleChangeFromTyping} value={this.state.phone}></input>
                  {/* <div>{this.state.phone}</div> */}
                  <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
                  <button className="submit" onClick={() => {this.state.idVal != "" ? this.handleSubmit(this.state.idVal, studentObjectList[this.state.idVal][this.props.weekNumber-1], studentObjectList[this.state.idVal][this.props.weekNumber+9], this.props.courseID, this.props.courseAtt, this.state.pointsVal, this.state.attendanceValStudying, this.state.attendanceValEvent, this.props.studentsAttended) : this.invalidPhoneNumber() ; if (this.state.idVal != "") {this.setRedirect()}}}>Submit!</button>
                  </div>
                  <div className="error-message">Looks like there are too few numbers typed. Try at least 10 digits!</div>
                  <div className="keypad">
                  <div className="row1">
                    <button id="button1" onClick={() => {this.numberUpdate("1")}}>1</button>
                    <button id="button2" onClick={() => {this.numberUpdate("2")}}>2</button>
                    <button id="button3" onClick={() => {this.numberUpdate("3")}}>3</button>
                  </div>
                  <div className="row2">
                    <button id="button4" onClick={() => {this.numberUpdate("4")}}>4</button>
                    <button id="button5" onClick={() => {this.numberUpdate("5")}}>5</button>
                    <button id="button6" onClick={() => {this.numberUpdate("6")}}>6</button>
                  </div>
                  <div className="row3">
                    <button id="button7" onClick={() => {this.numberUpdate("7")}}>7</button>
                    <button id="button8" onClick={() => {this.numberUpdate("8")}}>8</button>
                    <button id="button9" onClick={() => {this.numberUpdate("9")}}>9</button>
                  </div>
                  <div className="row4">
                    <button></button>
                    <button id="button0" onClick={() => {this.numberUpdate("0")}}>0</button>
                    <button id="backspace" onClick={() => {this.backspaceFunc()}}>&#x232b;</button>
                  </div>
                </div>
                </div>
            }
            else if (!this.state.redirect && !this.state.redirectBack && !this.state.valid && phoneValue.length > 10){
              return <div className="container">
                <div className="header">Sign in to {this.props.eventVar}{this.props.studying}{this.props.officeHours}{this.props.courseName} {this.props.courseSection}</div>
                <div className="form"> 
                  <input id="phone-input" placeholder="type your phone number" className="phone-number" type="text" onChange={this.handleChangeFromTyping} value={this.state.phone}></input>
                  {/* <div>{this.state.phone}</div> */}
                  <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
                  <button className="submit" onClick={() => {this.state.idVal != "" ? this.handleSubmit(this.state.idVal, studentObjectList[this.state.idVal][this.props.weekNumber-1], studentObjectList[this.state.idVal][this.props.weekNumber+9], this.props.courseID, this.props.courseAtt, this.state.pointsVal, this.state.attendanceValStudying, this.state.attendanceValEvent, this.props.studentsAttended) : this.invalidPhoneNumber() ; if (this.state.idVal != "") {this.setRedirect()}}}>Submit!</button>
                  </div>
                  <div className="error-message">Looks like there are too many numbers... Try typing only 10 digits!</div>
                  <div className="keypad">
                  <div className="row1">
                    <button id="button1" onClick={() => {this.numberUpdate("1")}}>1</button>
                    <button id="button2" onClick={() => {this.numberUpdate("2")}}>2</button>
                    <button id="button3" onClick={() => {this.numberUpdate("3")}}>3</button>
                  </div>
                  <div className="row2">
                    <button id="button4" onClick={() => {this.numberUpdate("4")}}>4</button>
                    <button id="button5" onClick={() => {this.numberUpdate("5")}}>5</button>
                    <button id="button6" onClick={() => {this.numberUpdate("6")}}>6</button>
                  </div>
                  <div className="row3">
                    <button id="button7" onClick={() => {this.numberUpdate("7")}}>7</button>
                    <button id="button8" onClick={() => {this.numberUpdate("8")}}>8</button>
                    <button id="button9" onClick={() => {this.numberUpdate("9")}}>9</button>
                  </div>
                  <div className="row4">
                    <button></button>
                    <button id="button0" onClick={() => {this.numberUpdate("0")}}>0</button>
                    <button id="backspace" onClick={() => {this.backspaceFunc()}}>&#x232b;</button>
                  </div>
                </div>
                </div>
            }
            else if(!this.state.redirect && !this.state.redirectBack && !this.state.valid && phoneValue.length === 10){
              return <div className="container">
                <div className="header">Sign in to {this.props.eventVar}{this.props.studying}{this.props.officeHours}{this.props.courseName} {this.props.courseSection}
                </div>
                <div className="form"> 
                  <input id="phone-input" placeholder="type your phone number" className="phone-number" type="text" onChange={this.handleChangeFromTyping} value={this.state.phone}></input>
                  {/* <div>{this.state.phone}</div> */}
                  <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
                  <button className="submit" onClick={() => {this.state.idVal != "" ? this.handleSubmit(this.state.idVal, studentObjectList[this.state.idVal][this.props.weekNumber-1], studentObjectList[this.state.idVal][this.props.weekNumber+9], this.props.courseID, this.props.courseAtt, this.state.pointsVal, this.state.attendanceValStudying, this.state.attendanceValEvent, this.props.studentsAttended) : this.invalidPhoneNumber() ; if (this.state.idVal != "") {this.setRedirect()}}}>Submit!</button>
                  <div className="error-message">We can’t find your phone number, did you type it in correctly?</div>
                </div>
                <div className="keypad">
                  <div className="row1">
                    <button id="button1" onClick={() => {this.numberUpdate("1")}}>1</button>
                    <button id="button2" onClick={() => {this.numberUpdate("2")}}>2</button>
                    <button id="button3" onClick={() => {this.numberUpdate("3")}}>3</button>
                  </div>
                  <div className="row2">
                    <button id="button4" onClick={() => {this.numberUpdate("4")}}>4</button>
                    <button id="button5" onClick={() => {this.numberUpdate("5")}}>5</button>
                    <button id="button6" onClick={() => {this.numberUpdate("6")}}>6</button>
                  </div>
                  <div className="row3">
                    <button id="button7" onClick={() => {this.numberUpdate("7")}}>7</button>
                    <button id="button8" onClick={() => {this.numberUpdate("8")}}>8</button>
                    <button id="button9" onClick={() => {this.numberUpdate("9")}}>9</button>
                  </div>
                  <div className="row4">
                    <button></button>
                    <button id="button0" onClick={() => {this.numberUpdate("0")}}>0</button> 
                    <button id="backspace" onClick={() => {this.backspaceFunc()}}>&#x232b;</button>
                  </div>
                </div>
                </div>
            }
            else if(this.state.redirect && !this.state.redirectBack) {
              return <div>{this.renderRedirect()}</div>
            }
            else{
              return <div>{this.renderRedirectBack()}</div>
            }
          }
          else {
            return ( <div>Loading...</div>)
          }
  }
}

export default Phone;