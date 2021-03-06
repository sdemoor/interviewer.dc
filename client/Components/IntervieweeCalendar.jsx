import CalView from './CalendarViewViewee.jsx'
import React from 'react'
import moment from 'moment'
import events from '../events'
import BigCalendar from 'react-big-calendar'
//import CalendarService from '../Services/CalendarService.js'
//import CalendarAuth from './CalendarAuth.jsx'
import Modal from 'react-modal';
import Select from 'react-select';
import TimeslotService from '../Services/TimeslotService.js'
import googleCalendar from '../Services/cService.js'
import newAuth from '../Services/newAuthenticationService.js'




const customStyles = {
  overlay: {
    zIndex: 10
  },
  content : {
    top                   : '30%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

var slotServ = new TimeslotService();
//const googleCalendarService = new googleCalendar()
const userinfo = new newAuth()

// a localizer for BigCalendar
//BigCalendar.momentLocalizer(moment)

class CalendarInterviewee extends React.Component {
  constructor (props) {
    super(props)
    this.state = {events:[], availableSlots:[], modalIsOpen: false, slotInfo:{start:'', end:''}, selectable:false, slotLength: 30, booking:{start:'', end:''}, interviewerInfo:'', intervieweeName:'', intervieweeEmail:'', error:''};
    this.state.error = ''

    this.state.eventsAndSlots = this.state.events.concat(this.state.availableSlots)
    console.log('query', props.location.query);
    this.interviewer = Number(props.location.query.interviewer)

    this.state.roomDetails = props.location.state
    console.log('thestate', props.location.state)
    userinfo.getInfo(this.interviewer)
    userinfo.on('got_info', (info) => {
      console.log('got info:', info)
    this.setState({interviewerInfo: info.data})
    })
    this.job_position = props.location.query.job_position
    this.roomDbId = props.location.query.roomDbId

    slotServ.getThem(this.interviewer)
    //this.setState({eventsAndSlots:this.state.events.concat(this.state.availableSlots)})

    slotServ.on('got_slots', (slots) => {
      console.log('length', slots.data.length)
      if (!slots.data.length) {
        var errorMessage = 'Your interviewer has no availabilities, contact them directly.'
        this.setState({error: errorMessage})
      }
      //console.log('slots',typeof slots.data[0].start)
      this.setState({availableSlots: slots.data})
      this.setState({eventsAndSlots: this.state.events.concat(this.state.availableSlots)})
    })
    slotServ.on('slot_error', (error) => {
      this.setState({error: error})
    })
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addInfo = this.addInfo.bind(this)
    this.addAvailability = this.addAvailability.bind(this)
    this.logChange = this.logChange.bind(this)

  }

  addInfo(slotInfo) {
    this.setState({slotInfo:slotInfo, selectable:false})
    this.openModal();

  }
  logChange(val) {
    this.setState({slotLength: val.value})
    console.log("Selected: ", val);

  }

  openModal() {
    this.setState({modalIsOpen: true});
    //this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }
  addAvailability(slotLength, slotInfo) {
    var booking = this.state.booking
    console.log('booking', booking)
    this.setState({modalIsOpen: false});
    //post request to availability slots database

    var eventor = {interviewer_id: this.interviewer,
      job_position: this.job_position,
      interviewee_name: this.state.intervieweeName,
      interviewee_email: this.state.intervieweeEmail,
      interviewer_email: this.state.interviewerInfo.email,
      interviewer_name: this.state.interviewerInfo.username,
      roomid: this.job_position + this.interviewer,
      start: new Date(booking.start),
      end: new Date(booking.end),
      roomDbId: this.roomDbId
    }
    slotServ.createEvent(eventor, booking, this.interviewer);
    Materialize.toast(`Appointment booked for ${eventor.job_position} on ${eventor.start.toDateString()} at ${eventor.start.toTimeString()}!`, 6000);
  }


  eventClick(event) {

    if (event.title === 'Book Interview') {
      this.setState({booking:event})
      console.log('this is the event:', event);
      this.openModal();
    }
  }
  handleChangeName(event) {
    this.setState({intervieweeName: event.target.value});
  }
  handleChangeEmail(event) {
    this.setState({intervieweeEmail: event.target.value});
  }

  render () {
    return (
      <div>

        <nav className="splash-nav blue darken-3">
          <div className="nav-wrapper">
            <a href="/#/home" className="brand-logo center">Interviewer.DC</a>
          </div>
        </nav>

        <div className="container calendar-section">

          <div className="row">
            <div className="col s12">
              <div className="card">
                <div className="card-content">
                  <span className="card-title">Book your interview with {this.state.interviewerInfo.username} for the {this.job_position}  job.</span>
                  <div className="divider"></div><br />
                  <p>
                    Please book a calendar with {this.state.interviewerInfo.username} by clicking on one of the available timeslots.
                    <br />
                    Enter your email -- ideally GMail -- to receive the event invite with the details of the interview.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CalView events={this.state.eventsAndSlots} selectable={this.state.selectable}  selectSlot={this.addInfo.bind(this)} eventClick={this.eventClick.bind(this)} />
            <div className="container">
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Book interview"
              >

                <h2 ref="subtitle">Book interview</h2>
                <p>Confirm your interview with {this.state.interviewerInfo.username} on {new Date(this.state.booking.start).toLocaleDateString()} at {new Date(this.state.booking.start).toLocaleTimeString()}.</p>
                <p>Please enter your name and email, the interview details will be sent to this email address and the event invite must be accepted to be confirmed.</p>

                <form onSubmit={this.addAvailability}>
                  <input id="intervieweeName" placeholder="Type in your full name..." onChange={this.handleChangeName.bind(this)}/>
                  <input id="intervieweeEmail" className="validate" type="email" placeholder="Type in your email address..." onChange={this.handleChangeEmail.bind(this)}/>
                  <button className="btn btn-default blue darken-3" type="submit">Confirm</button>
                  <button className="btn btn-default red right" onClick={this.closeModal}>close</button>
                </form>

                <blockquote>Good luck!</blockquote>

              </Modal>
            </div>
            <p className="errorClass"> {this.state.error}</p>
          </div>

      </div>

    )
  }
}

module.exports = CalendarInterviewee
