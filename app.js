// Initialize Firebase
var config = {
  apiKey: 'AIzaSyA7stppJmQwz9uJocopAkBMWXvYPVVYqtQ',
  authDomain: 'bootcamp-course.firebaseapp.com',
  databaseURL: 'https://bootcamp-course.firebaseio.com',
  projectId: 'bootcamp-course',
  storageBucket: 'bootcamp-course.appspot.com',
  messagingSenderId: '689151597222'
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var name = '';
var destination = '';
var firstTrain = '';
var frequency = 0;

// Capture Button Click
$(document).ready(function() {
  $('#add-train-btn').click(function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    name = $('#train-name-input')
      .val()
      .trim();
    destination = $('#destination-input')
      .val()
      .trim();
    firstTrain = $('#start-input')
      .val()
      .trim();
    frequency = $('#rate-input')
      .val()
      .trim();

    // Code for handling the push
    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $('form')
      .find('input:text')
      .val('');
  });
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on(
  'child_added',
  function(childSnapshot) {
    // full list of items to the well

    var tFrequency = childSnapshot.val().frequency;

    var firstTime = childSnapshot.val().firstTrain;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, 'HH:mm').subtract(1, 'years');

    // Current Time
    var currentTime = moment();
    // $("#currentTime".html(moment(currentTime).format('hh:mm'));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, 'minutes');

    // Create the new row
    var newRow = $('<tr>').append(
      $('<td>').text(childSnapshot.val().name),
      $('<td>').text(childSnapshot.val().destination),
      $('<td>').text(childSnapshot.val().frequency),
      $('<td>').text(moment(nextTrain).format('hh:mm A')),
      $('<td>').text(tMinutesTillTrain)
    );

    // Append the new row to the table
    $('#train-table > tbody').append(newRow);

    // Handle the errors
  },
  function(errorObject) {
    console.log('Errors handled: ' + errorObject.code);
  }
);
