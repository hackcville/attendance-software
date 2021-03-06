import React from "react"
import CoursePage from "./CoursePage"

let date = new Date();
let currentDay = date.getDate();
let currentMonth = date.getMonth() + 1;
let currentYear = date.getFullYear();
let startDay = 8;
let startMonth = 9;
let startYear = 2019
let daysInBetween = 0;
let weekNumberVal = 0;


class WeekNum extends React.Component{

    daysInMonth (month, year) { 
        return new Date(year, month, 0).getDate(); 
    }

    daysInBetweenFunction(){
        if (startMonth === currentMonth){
            daysInBetween = currentDay - startDay;
        }
        else if (currentMonth - startMonth === 1){
            let startMonthDays = this.daysInMonth(startMonth, startYear, 0)
            console.log(startMonthDays)
            daysInBetween = startMonthDays - startDay + currentDay
        }
        else if (currentMonth - startMonth > 1){
            let startMonthDays = this.daysInMonth(startMonth, startYear, 0)
            let middleMonthDays = this.daysInMonth(startMonth + 1, currentYear, 0)
            daysInBetween = startMonthDays - startDay + middleMonthDays + currentDay
        }
        console.log(daysInBetween)
        return(daysInBetween)
    }
    weekNumFunction(){
        weekNumberVal = Math.ceil(this.daysInBetweenFunction()/7)
        console.log(weekNumberVal)
        return(
            weekNumberVal+""
        )
    }

    render(){
        return(
            <div>
            <div>{console.log(this.weekNumFunction())}</div>
            <CoursePage weekNumber = {this.weekNumFunction()}/>
            </div>
        )
    }

}

export default WeekNum;