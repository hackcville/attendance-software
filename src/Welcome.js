import React from "react"

const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;

class Welcome extends React.Component {
    render() {
        return <div id="thanks-screen" className="container">
            <div className="all-text">
                <p>Welcome, <span className="name">{this.props.student}</span>!
                <br/> 
                You just earned <span class="new-points">1</span> point.
                <br/>
                You have a total of <span class="total-points">{this.props.points}</span> points.</p>
            </div>
        </div>
    }
}

export default Welcome;