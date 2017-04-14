import React from 'react'
import CalendarService from '../Services/CalendarService.js'


var CalendarAuth = ({calserv}) => (


<div>
  {/* <button id="authorize-button" onClick={calserv.handleAuthClick.bind(calserv)}>See Google Calendar events</button>
  <button id="signout-button">Hide other Google calendar events</button> */}

  <a id="authorize-button" className="btn-floating btn-large waves-effect waves-light blue darken-3 view-cal-events-button" onClick={calserv.handleAuthClick.bind(calserv)}>
    <i className="glyphicons glyphicons-eye-open"></i>
  </a>

  <pre id="content"></pre>
</div>
)

module.exports = CalendarAuth;
