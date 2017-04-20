import { EventEmitter } from 'events'
import axios from 'axios'

export default class TimeslotService extends EventEmitter {
  constructor() {
    super()
    //this.user = localStorage.getItem('dbUser');

  }

  addThem(timeslots) {
    this.addSlots(timeslots, this.hasBeenAdded.bind(this), this.getThem.bind(this))
  }

  getThem(userid) {
    this.getSlots(userid, this.gotthem.bind(this))
  }

  createEvent(eventor, slot, owner_id) {
    this.createAnEvent(eventor, this.deleteSlot.bind(this), slot, this.getThem.bind(this), owner_id)
  }

  deleteSlot(slotId, callback, owner_id) {
    axios.delete('/api/Timeslot?id=' + slotId)
    .then(function(response) {
      console.log('slot removed')
      callback(owner_id)
    });

  }

  addSlots (timeslots, callback, callback2) {
    axios.post('/api/Timeslots', {
      'timeslots': timeslots
    })
    .then(function (response) {
      console.log('added timeslots', response);
      callback(response)
      callback2(JSON.parse(localStorage.getItem('googleUser')).user.id)
      // this.hasBeenAdded(response).bind(this)
      // this.getSlots(localStorage.getItem('dbUser')).bind(this);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  getSlots(userid, callback) {
    axios.get('/api/Timeslots', {
      params: {
        owner_id: userid
      }
    })
    .then(function (response) {
     response.data.forEach(function(slot) {
        slot.start = new Date(slot.start)
        slot.end = new Date(slot.end)
      })
     // var future = response.data.filter(function(slot) {
     //    return slot.start.getTime() >= new Date().getTime();
     //  })

      callback(response)
      //this.gotthem(reponse).bind(this)
      console.log('got slots', response);
      console.log('got slots', response.data);


    })
    .catch(function (error) {
      console.log(error);
    });
  }
  hasBeenAdded(slots) {
    this.emit('slots_added', slots)
  }
  gotthem(slots) {
    this.emit('got_slots', slots)
  }
  createAnEvent (event, callback, slot, callback2, owner_id) {
    axios.post('/api/Event', event)
    .then(function (response) {
      console.log('added event', response);
      callback(slot.id, callback2, owner_id)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

}

