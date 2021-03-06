//import PropTypes from 'prop-types'; //This file holds the router and instantiates the authentication superpack
import React from 'react'
import { browserHistory, hashHistory, Router, Route, Link, Redirect, withRouter} from 'react-router'
//import { BrowserRouter as Router, Route } from 'react-router-dom'

import Login from './Login.jsx'
import Home from './Home.jsx'
import CalendarInterviewee from './IntervieweeCalendar.jsx' // this is the page interviewees come too to book availabilities
//import AuthService from '../Services/AuthService.js'
import InterviewRoom from './InterviewRoom.jsx'
import newAuth from '../Services/newAuthenticationService.js'
//const googleLoginService = new newAuth()

//const auth = new AuthService('R6x0iX25zFBEm6qY7QoJ2Dth5Tn2SBeE', 'sdm.auth0.com')



export default class App extends React.Component {
  constructor(props) {
    super(props);

  //   auth.on('logged_out', (bye) => {
  //    })
  }
// validate authentication for private routes
  // requireAuth (nextState, replace)  {
  //   console.log('auth', auth);
  //     if (!auth.loggedIn()) {
  //     replace({ pathname: '/login' })
  //    }
  // }
  requireAuth(nextState, replace)  {

     if (!localStorage.getItem('googleUser'))
      replace({ pathname: '/login' })

  }



  //newAuth.isLoggedIn
//still working on some of the routes but this works for now

  render() {
    return (
      <Router history={hashHistory}>

         <div>
         <Route path="/"  component={Home}  />
           <Route path='/home' component={Home}  />
           <Route path="/interviewee" component={CalendarInterviewee}  />
           <Route path="/interviewroom" component={InterviewRoom}  />
         </div>

      </Router>
    )
  }
}


//onEnter={this.requireAuth}


// (<Router history={hashHistory}>//<Route path="/login" component={Login} auth={auth} />
//         <div>
//           <Route path="/"  component={Home} auth={auth} onEnter={this.requireAuth} />

//           <Route path='/home' component={Home} auth={auth} onEnter={this.requireAuth} />
//           <Route path="/login" component={Login} auth={auth} />
//           <Route path="/interviewee" component={CalendarInterviewee} auth={auth} />
//           <Route path="/interviewroom" component={InterviewRoom} auth={auth} />
//         </div>

//       </Router>)
//<Route name='/' path="?access_token=:accesstoken&expires_in=:expiry&id_token=:idtoken&token_type=:tokentype&state=:stater" component={Home} auth={auth} onEnter={this.requireAuth} />
