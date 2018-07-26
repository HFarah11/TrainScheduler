var config = {
  apiKey: 'AIzaSyDxS3G1BvGF4bn-fbedsGu_jNx7Izf4uG0',
  authDomain: 'trainassignment-96aae.firebaseapp.com',
  databaseURL: 'https://trainassignment-96aae.firebaseio.com',
  projectId: 'trainassignment-96aae',
  storageBucket: 'trainassignment-96aae.appspot.com',
  messagingSenderId: '112290947792'
};

firebase.initializeApp(config);

var database = firebase.database();

setInterval(function(startTime) {
  $('#timer').html(moment().format('hh:mm a'));
}, 1000);

$('#add-train').on('click', function() {
  event.preventDefault();

  var train = $('#trainname-input')
    .val()
    .trim();
  var destination = $('#destination-input')
    .val()
    .trim();
  var frequency = $('#frequency-input')
    .val()
    .trim();
  var firstTime = $('#firsttime-input')
    .val()
    .trim();

  var trainInfo = {
    formtrain: train,
    formdestination: destination,
    formfrequency: frequency,
    formfirsttime: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref().push(trainInfo);

  console.log(trainInfo.formtrain);
  console.log(trainInfo.formdestination);
  console.log(trainInfo.formfrequency);
  console.log(trainInfo.formfirsttime);
  console.log(trainInfo.dateAdded);

  $('#trainname-input').val('');
  $('#destination-input').val('');
  $('#frequency-input').val('');
  $('#firsttime-input').val('');
});

database.ref().on(
  'child_added',
  function(childSnapshot, prevChildKey) {
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;

    var firstTimeConverted = moment(firstTime, 'hh:mm').subtract(1, 'years');
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm a'));

    $('#timer').text(currentTime.format('hh:mm a'));

    var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
    console.log('DIFFERENCE IN TIME: ' + diffTime);

    var tRemainder = diffTime % frequency;
    console.log('Remainder: ' + tRemainder);

    var minutesAway = frequency - tRemainder;
    console.log('MINUTES TILL TRAIN: ' + minutesAway);

    var nextArrival = moment()
      .add(minutesAway, 'minutes')
      .format('hh:mm a');
    console.log('ARRIVAL TIME: ' + moment(nextArrival).format('hh:mm a'));

    $('#train-table > tbody').append(
      '<tr><td>' +
        '<i class="fa fa-trash" id="trashcan" aria-hidden="true"></i>' +
        '</td><td>' +
        train +
        '</td><td>' +
        destination +
        '</td><td>' +
        frequency +
        '</td><td>' +
        nextArrival +
        '</td><td>' +
        minutesAway +
        '</td></tr>'
    );
  },
  function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  }
);

$('body').on('click', '.fa-trash', function() {
  $(this)
    .closest('tr')
    .remove();
  alert('delete button clicked');
});

function timeUpdater() {
  $('#train-table > tbody').empty();

  database.ref().on('child_added', function(childSnapshot, prevChildKey) {
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;

    var firstTimeConverted = moment(firstTime, 'hh:mm').subtract(1, 'years');
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm a'));

    $('#timer').text(currentTime.format('hh:mm a'));

    var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
    console.log('DIFFERENCE IN TIME: ' + diffTime);

    var tRemainder = diffTime % frequency;
    console.log('Remainder: ' + tRemainder);

    var minutesAway = frequency - tRemainder;
    console.log('MINUTES TILL TRAIN: ' + minutesAway);

    var nextArrival = moment()
      .add(minutesAway, 'minutes')
      .format('hh:mm a');
    console.log('ARRIVAL TIME: ' + moment(nextArrival).format('hh:mm a'));

    $('#train-table > tbody').append(
      '<tr><td>' +
        '<i class="fa fa-trash" aria-hidden="true"></i>' +
        '</td><td>' +
        train +
        '</td><td>' +
        destination +
        '</td><td>' +
        frequency +
        '</td><td>' +
        nextArrival +
        '</td><td>' +
        minutesAway +
        '</td></tr>'
    );
  });
}

setInterval(timeUpdater, 6000);
