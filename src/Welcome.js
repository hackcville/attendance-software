import React from "react";
import WeekNum from "./WeekNumberFunction";

const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;

class Welcome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    returnToHomeScreen = () => {
        this.setState({redirect: true})
    }

    componentDidMount(){
        setTimeout(() => {this.returnToHomeScreen()}, 5000)
    }

    render() {
        if (!this.state.redirect){
        return <div id="thanks-screen" className="container">
            <div className="all-text">
                <p className="welcome">Welcome, <span className="name">{this.props.student}</span>!</p>
            </div>
        </div>
        }
        else{
            return(
                <div>{window.location.reload()}</div>
            )
        }
    }
}

export default Welcome;