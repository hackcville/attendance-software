import React from "react"
import Welcome from "./Welcome"
import CoursePage from "./CoursePage"
import WeekNum from "./WeekNumberFunction"
import preventDoubleTapZoom from "./preventZoomOnDoubleTap"

let phoneValue = ""; // need this because of issues with onSubmit and the way variables get stored in state
let theRecords = [];
let studentObjectList = {}; // used for determining which attendance column to update
const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;


class Phone extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          students: [], // fields for each student in AirTable Fall 2019 involvement
          phone: "Enter your phone number", // phone number student inputs
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
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      studentData(){
        if (phoneValue.length == 10) {
        for (let i = 0; i < this.state.students.length; i++){
          let x = ""+this.state.students[i].fields.Phone; // comes directly from airtable
          let zz = x.replace(/[-(). ]/g, "")
          console.log(this.state.students[i].fields.Name)
          console.log(x)
          console.log(phoneValue)
          let studentFullName = this.state.students[i].fields.Name
          let studentFirstName = studentFullName.replace(/\s\w+$/g, "")
          if (phoneValue == zz && zz != "" && phoneValue != ""){
            console.log("oh yeah")
            this.setState({idVal: this.state.students[i].id, studentName: studentFirstName, pointsVal: this.state.students[i].fields.Points, attendanceValStudying: this.state.students[i].fields.Studying, attendanceValEvent: this.state.students[i].fields.Events})
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

    handleChange(){
      if (this.state.phone === "Enter your phone number"){
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

    numberUpdate(numberButton){
      this.setState({numberClicked: numberButton}, this.handleChange);
    }

    backspaceFunc(){
      let currentPhoneVal = this.state.phone
      currentPhoneVal = currentPhoneVal.slice(0, currentPhoneVal.length-1)
      this.setState({phone: currentPhoneVal, valid: true})
      phoneValue = currentPhoneVal;
      this.studentData();
    }

    handleSubmit(idValue, studentAttendanceValue, ohAttendanceValue, courseIDVal, courseAttendanceValue, studentPoints, studyingAttendanceValue, eventAttendanceValue){ //need to add a value for OH attendance
      var Airtable = require('airtable');
      let updatedOHAttendance = ohAttendanceValue + 1;
      let updatedStudentAttendance = studentAttendanceValue +1;
      let updatedCourseAttendance = courseAttendanceValue + 1;
      let updatedStudyingAttendance = studyingAttendanceValue + 1;
      let updatedEventAttendance = eventAttendanceValue + 1;
      let updatedPointVals = studentPoints + 1;
      let weekNumberValue = "W"+this.props.weekNumber;
      let ohNumberValue = "OH"+this.props.weekNumber;
      var base = new Airtable({apiKey: API_KEY}).base('appMfcy98yxGtYwDO');
      console.log(weekNumberValue)
      if (this.state.idVal !== ""){
// do another if statement to determine whether you should update course and student workshop attendance or office hour attendance
      if (this.props.officeHoursBool != false){
        base('Fall 2019 Involvement').update(idValue, {
            [ohNumberValue]: updatedOHAttendance,
          "Points": updatedPointVals
          }, function(err) {
            if (err) {
              console.error(err);
              return;
          }
          });
          this.setState({updatedPoints: updatedPointVals})
     }
     else if (this.props.studyingBool != false){
      base('Fall 2019 Involvement').update(idValue, {
        Studying: updatedStudyingAttendance,
      "Points": updatedPointVals
      }, function(err) {
        if (err) {
          console.error(err);
          return;
      }
      });
      this.setState({updatedPoints: updatedPointVals})
     }
     else if (this.props.eventBool != false){
      base('Fall 2019 Involvement').update(idValue, {
        Events: updatedEventAttendance,
      "Points": updatedPointVals
      }, function(err) {
        if (err) {
          console.error(err);
          return;
      }
      });
      this.setState({updatedPoints: updatedPointVals})
     }
else {
base('Fall 2019 Involvement').update(idValue, {
  [weekNumberValue]: updatedStudentAttendance, // need to change this to updatedStudentAttendance value
  "Points": updatedPointVals
}, function(err) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(idValue)
});
this.setState({updatedPoints: updatedPointVals})

base('Courses').update(""+courseIDVal, {
[weekNumberValue]: updatedCourseAttendance
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
  this.setState({valid: false})
}

// redirects to the Welcome component
renderRedirect = () => {
    //will need to also store point values (current gained and total) for student
    if (this.state.redirect){
    return <Welcome student = {this.state.studentName} points = {this.state.updatedPoints}/>
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
              <div className="heading">Sign in to {this.props.eventVar}{this.props.studying}{this.props.officeHours}{this.props.courseName} {this.props.courseSection}</div>
              <div className="form"> 
                {/* <input id="phone-input" placeholder="tap here" className="phone-number" type="text" value={this.state.phone}></input> */}
                <div>{this.state.phone}</div>
                <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
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
                    <button onTouchStart={preventDoubleTapZoom} id="backspace" onClick={() => {this.backspaceFunc()}}>&#8592;</button>
                    <button onTouchStart={preventDoubleTapZoom} id="button0" onClick={() => {this.numberUpdate("0")}}>0</button>
                    <button className="submit" onClick={() => {this.state.idVal != "" ? this.handleSubmit(this.state.idVal, studentObjectList[this.state.idVal][this.props.weekNumber-1], studentObjectList[this.state.idVal][this.props.weekNumber+9], this.props.courseID, this.props.courseAtt, this.state.pointsVal, this.state.attendanceValStudying, this.state.attendanceValEvent) : this.invalidPhoneNumber() ; if (this.state.idVal != "") {this.setRedirect()}}}>Submit!</button> 
                  </div>
                </div>
            </div>
            }
            else if (!this.state.redirect && !this.state.redirectBack && !this.state.valid && phoneValue.length < 10){
              return <div className="container">
                <div className="heading">Sign in to {this.props.eventVar}{this.props.studying}{this.props.officeHours}{this.props.courseName} {this.props.courseSection}</div>
                <div className="form"> 
                  <div>{this.state.phone}</div>
                  <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
                  </div>
                  <div className="error-message">Need at least 10 digits. Please try again.</div>
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
                    <button id="button0" onClick={() => {this.numberUpdate("0")}}>0</button>
                    <button id="backspace" onClick={() => {this.backspaceFunc()}}>&#8592;</button> 
                    <button className="submit" onClick={() => {this.state.idVal != "" ? this.handleSubmit(this.state.idVal, studentObjectList[this.state.idVal][this.props.weekNumber-1], studentObjectList[this.state.idVal][this.props.weekNumber+9], this.props.courseID, this.props.courseAtt, this.state.pointsVal, this.state.attendanceValStudying, this.state.attendanceValEvent) : this.invalidPhoneNumber() ; if (this.state.idVal != "") {this.setRedirect()}}}>Submit!</button>
                  </div>
                </div>
                </div>
            }
            else if (!this.state.redirect && !this.state.redirectBack && !this.state.valid && phoneValue.length > 10){
              return <div className="container">
                <div className="header">Sign in to {this.props.eventVar}{this.props.studying}{this.props.officeHours}{this.props.courseName} {this.props.courseSection}</div>
                <div className="form"> 
                {/* <input id="phone-input" placeholder="tap here" className="phone-number" type="text" value={this.state.phone}></input> */}
                  <div>{this.state.phone}</div>
                  <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
                  </div>
                  <div className="error-message">Need only 10 digits. Please try again.</div>
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
                    <button id="backspace" onClick={() => {this.backspaceFunc()}}>&#8592;</button>
                    <button id="button0" onClick={() => {this.numberUpdate("0")}}>0</button>
                    <button className="submit" onClick={() => {this.state.idVal != "" ? this.handleSubmit(this.state.idVal, studentObjectList[this.state.idVal][this.props.weekNumber-1], studentObjectList[this.state.idVal][this.props.weekNumber+9], this.props.courseID, this.props.courseAtt, this.state.pointsVal, this.state.attendanceValStudying, this.state.attendanceValEvent) : this.invalidPhoneNumber() ; if (this.state.idVal != "") {this.setRedirect()}}}>Submit!</button> 
                  </div>
                </div>
                </div>
            }
            else if(!this.state.redirect && !this.state.redirectBack && !this.state.valid && phoneValue.length === 10){
              return <div className="container">
                <div className="header">Sign in to {this.props.eventVar}{this.props.studying}{this.props.officeHours}{this.props.courseName} {this.props.courseSection}
                </div>
                <div className="form"> 
                  {/* <input id="phone-input" placeholder="tap here" className="phone-number" type="text" value={this.state.phone}></input> */}
                  <div>{this.state.phone}</div>
                  <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
                  <div className="error-message">Invalid :( Please try again.</div>
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
                    <button id="backspace" onClick={() => {this.backspaceFunc()}}>&#8592;</button>
                    <button id="button0" onClick={() => {this.numberUpdate("0")}}>0</button> 
                    <button className="submit" onClick={() => {this.state.idVal != "" ? this.handleSubmit(this.state.idVal, studentObjectList[this.state.idVal][this.props.weekNumber-1], studentObjectList[this.state.idVal][this.props.weekNumber+9], this.props.courseID, this.props.courseAtt, this.state.pointsVal, this.state.attendanceValStudying, this.state.attendanceValEvent) : this.invalidPhoneNumber() ; if (this.state.idVal != "") {this.setRedirect()}}}>Submit!</button>
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