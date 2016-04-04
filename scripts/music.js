function createTime(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

var totalLength,
    totalLengthMinutes,
    totalLengthSeconds,
    currentTrack;

var numberOfTracks = document.getElementById('year-1976').dataset.numberOfTracks;

var app = new Vue({
  el: '#app',
  data: {
    date: '',
    part: '',
    currentTime: '',
    totalTime: '',
    audio: '',
    activeSong: '',
    elapsedPercentage: '',
    numberOfTracks: numberOfTracks,
    trackUrl: '',
    paused: 'false'
  },
  methods: {
    playSong: function(id) {
      app.paused = 'false';
      console.log(id);
      if (app.audio) {
        app.audio.pause();
      }

      currentTrack = document.getElementById('card-' + id);

      var w = window.innerWidth;
      var offset = window.innerWidth <= 768 ? -10 : -50;

      $(currentTrack).velocity("scroll",  { duration: 1000, offset : offset });

      app.date = currentTrack.dataset.date;
      app.part = currentTrack.dataset.part;

      if (app.activeSong != id) {
        // this restarts the song
        app.activeSong = id;
        app.audio = new Audio(currentTrack.dataset.url);
        app.currentTime = '';
        app.trackUrl = currentTrack.dataset.url;
      }




      app.audio.onplaying = function() {
        app.totalTime = createTime(this.duration);
      };

      app.audio.ontimeupdate = function() {
        app.currentTime = createTime(this.currentTime);
        app.elapsedPercentage = ((this.currentTime / this.duration) * 100).toFixed(2);
      };

      app.audio.onended = function() {
        if (app.activeSong < numberOfTracks) {
          app.playSong(app.activeSong + 1)
        }
      };


      app.audio.play();

    },

    updatePlayhead:function(event) {

      if (event.type == 'mouseup') {
        console.log('up!', event);
      }

      var percent = (event.pageX / window.innerWidth)*100
      app.elapsedPercentage = percent;

      var newTime  = app.audio.duration * (percent/100);
      app.audio.currentTime = newTime.toFixed(0);
    },
    mouseDown:function(event) {
      if (app.activeSong) {

        event.preventDefault();

        app.updatePlayhead(event);

        window.addEventListener('mousemove',app.updatePlayhead);

        window.addEventListener('mouseup',function (e) {
          window.removeEventListener('mousemove',app.updatePlayhead );
          window.removeEventListener(e.type, arguments.callee);
        });
      }

    },
    pauseSong: function() {

      app.audio.pause();
      app.paused = 'true';

      // app.audio.currentTime = 0;
      // app.activeSong = '';
      // app.date = '';
    },
    nextSong: function() {
      console.log(app.activeSong + ' ' + numberOfTracks);
      if (app.activeSong < numberOfTracks) {
        app.playSong(app.activeSong + 1)
      }
    },
    previousSong: function() {
      if (app.activeSong > 1) {
        app.playSong(app.activeSong - 1)
      }
    }
  }
})

$(document).ready(function(){

  $('.scroll-link').click(function(e){
    e.preventDefault();
    var offset = window.innerWidth <= 768 ? -10 : -50;
    var year = $(this).attr("href");
    console.log(year);
    $(year).velocity("scroll",  { duration: 1000, offset : offset })

  });

});
