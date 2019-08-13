import React from 'react';
import Phone from './PhonePage';
import WeekNum from './WeekNumberFunction'


class Member extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            redirectBack: false
        }
    }

    componentDidMount(){
        return (console.log("mounted!"))
    }

    renderRedirectBack = () => {
        if (this.state.redirectBack){
          return <WeekNum/>
        }
      }      

    setRedirectPhone = () => {
        this.setState({
          redirect: true
        })
      }

    renderRedirectPhone = () => {
        if (this.state.redirect) {
          return <Phone weekNumber = {this.props.weekNumber} courseID = {this.props.courseID} courseAtt = {this.props.courseAtt} officeHoursBool = {this.props.officeHoursBool} courseName = {this.props.courseName} courseSection = {this.props.courseSection} officeHours = {this.props.officeHours} studyingBool = {this.props.studyingBool} studying = {this.props.studying} eventBool = {this.props.eventBool} eventVar ={this.props.eventVar} eventId = {this.props.eventId} studentsAttended = {this.props.studentsAttended}/>
        }
      }

    redirectATForm = () => {
        window.location.href = "https://airtable.com/shr0wTwj1No5M8txt"
    }

    render(){
        if (!this.state.redirect && !this.state.redirectBack){
        return(
            <div className="container">
                <div className="member-question">Are you currently involved with HackCville?</div>
                <div className="yes-no-buttons">
                    <button onClick = {() => {this.setRedirectPhone()}}>Yes!</button>
                    <button onClick = {() => {window.location.href = "https://airtable.com/shrp2LKBFAjCsYJjv"}}>Nope, just a guest</button>
                </div>
                <div className="return-button">
                    <button className="back" onClick={() => this.setState({redirectBack: true})}>Return</button>
                </div>
            </div>
        )
        }
        else if(!this.state.redirect && this.state.redirectBack){
            return(
                <div>{this.renderRedirectBack()}</div>
            )
        }
        else{
            return(
            <div>{this.renderRedirectPhone()}</div>
            )
        }
    }
}

export default Member;