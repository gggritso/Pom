var Pom = (function(){

  // Constants
  var WORK_MINUTES = 25,
    BREAK_MINUTES = 5,
    MESSAGES = {
      '24': 'Off we go!',
      '20': 'Get it done!',
      '12': 'About halfway there!',
      '7': 'Keep at it!',
      '1': 'Almost done!',
      '0': 'Ding ding!'
    };

  var interval, currentMinute = WORK_MINUTES,
    currentSecond = 0,
    isRunning = false,
    currentCycle = 'work',
    todaysPoms = 0;

  var resetTimer = function( minutes ) {
    currentMinute = minutes;
    currentSecond = 0;
    updateTimerText( currentMinute, currentSecond );
  };

  var updateTimerText = function( minutes, seconds ){
    $( '#minutes' ).text( minutes );
    $( '#seconds' ).text( ( seconds < 10 ) ? ':0' + seconds : ':' + seconds );
  };

  var toggleTimer = function() {

    $( '.disappearing' ).fadeToggle(1000);

    if ( isRunning === true ) {
      // We just paused!
      $( '#playpause' ).text('N');
      clearInterval( interval );
      isRunning = false;
    } else {
      // We just started again
      $( '#playpause' ).text('O');
      interval = setInterval( updateTimer, 1000 );
      isRunning = true;
    }

  };

  var updateTimer = function() {
    var msg, eod;

    // Every minute see if we have a new message to show
    if ( currentSecond === 0 ) {
      msg = MESSAGES[currentMinute.toString()];
      $( '.motd' ).text( msg );
    }

    // Decrement the timer, update the text
    currentSecond -= 1;
    if ( currentSecond === -1 ) {
      currentSecond = 59;
      currentMinute -= 1;
    }
    updateTimerText( currentMinute, currentSecond );

    // When we hit 0:00 stop everything
    if ( currentMinute === 0 && currentSecond === 0 ) {
      $( '#ding' )[0].play();
      $( '#ding')[0].currentTime = 0; // gotta rewind!

      alert( 'Bingo!' );
      $( '.motd' ).text( 'Ding ding!' );
      toggleTimer();

      if ( currentCycle === 'work' ) {
        currentCycle = 'break';

        resetTimer( BREAK_MINUTES );

        // Register a successful pom
        eod = new Date();
        eod.setHours(23, 59, 59, 999);

        todaysPoms += 1;
        cookie.set( 'poms', ( todaysPoms ).toString(), { expires: eod });
        $( '#todays_poms' ).text( todaysPoms );

        $( '#userstyle' ).attr( 'href', 'css/regular.css' );

      } else {
        currentCycle = 'work';

        resetTimer( WORK_MINUTES );
        $( '#userstyle' ).attr( 'href', 'css/inverted.css' );

      }

    }

  };

  var init = function() {
    todaysPoms = parseInt( cookie.get( 'poms' ) || 0, 0 );
    $( '#todays_poms' ).text( todaysPoms );
  };

  // Expose API
  return {
    init: init,
    toggleTimer: toggleTimer
  };

})();

// Initialize the listeners, etc
$(function() {

  Pom.init();

  $( '#playpause' ).on( 'click', Pom.toggleTimer );

  $( 'body' ).on( 'keypress', function(e) {
    if (e.which === 32 ) {
      Pom.toggleTimer();
    }
  });

});
