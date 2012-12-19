var Pom = (function(){

  var WORK_MINUTES = 25,
    BREAK_MINUTES = 5;

  var interval, currentMinute = WORK_MINUTES,
    currentSecond = 0,
    isRunning = false,
    currentCycle = 'work',
    todaysPoms = 0;

  var resetTimer = function( minutes ) {
    currentMinute = minutes;
    currentSecond = 0;
    updateTimer();
  };

  var toggleTimer = function() {

    $( '.disappearing' ).animate({
      'opacity': 'toggle'
    }, 1000);

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

    $( '#minutes' ).text( currentMinute );
    $( '#seconds' ).text( ( currentSecond < 10 ) ? ':0' + currentSecond : ':' + currentSecond );

    if ( currentSecond === 0 ) {
      currentSecond = 60;
      currentMinute -= 1;
    }

    currentSecond -= 1;
    if ( currentMinute === 0 && currentSecond === 0 ) {
      toggleTimer();
      msg = 'Ready?';

      if ( currentCycle === 'work' ) {
        currentCycle = 'break';
        resetTimer( BREAK_MINUTES );
        todaysPoms += 1;

        eod = new Date();
        eod.setHours(23,59,59,999);

        cookie.set( 'poms', todaysPoms.toString(), { expires: eod });
        $( '#todays_poms' ).text( todaysPoms );

        $( '#userstyle' ).attr( 'href', 'css/regular.css' );
      } else {
        currentCycle = 'work';
        resetTimer( WORK_MINUTES );
        $( '#userstyle' ).attr( 'href', 'css/inverted.css' );
      }
    }

    if ( currentSecond === 0 ) {
      switch ( currentMinute ) {
        case 24:
          msg = 'Off we go!';
          break;
        case 20:
          msg = 'Get it done!';
          break;
        case 12:
          msg = 'About halfway there!';
          break;
        case 7:
          msg = 'Keep at it!';
          break;
        case 1:
          msg = 'Almost done!';
      }
    }

    $( '.motd' ).text( msg );

  };

  var init = function() {

    $( '#minutes' ).text( WORK_MINUTES );

    todaysPoms = cookie.get( 'poms' );
    if ( todaysPoms === undefined ) {
      todaysPoms = 0;
    }

    todaysPoms = parseInt( todaysPoms, 10 );
    $( '#todays_poms' ).text( todaysPoms );
  };

  // Expose API
  return {
    init: init,
    toggleTimer: toggleTimer,
    resetTimer: resetTimer
  };

})();

// Initialize the listeners, etc
$(function() {

  Pom.init();

  $( '#playpause' ).on( 'click', function() {
    Pom.toggleTimer();
  });

  $( 'body' ).on( 'keypress', function(e) {
    if (e.which === 32 ) {
      Pom.toggleTimer();
    }
  });

});
