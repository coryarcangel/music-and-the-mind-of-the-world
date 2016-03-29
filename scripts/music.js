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
    currentTime: '',
    totalTime: '',
    audio: '',
    playing: '',
    elapsedPercentage: '',
    numberOfTracks: numberOfTracks
  },
  methods: {
    playSong: function(id) {

      if (app.audio) {
        app.audio.pause();
      }

      currentTrack = document.getElementById('card-' + id);

      var w = window.innerWidth;
      var offset = window.innerWidth <= 768 ? -10 : -50;

      $(currentTrack).velocity("scroll",  { duration: 1000, offset : offset });

      app.date = currentTrack.dataset.date;

      app.playing = id;
      app.audio = new Audio(currentTrack.dataset.url);
      app.currentTime = '';

      app.audio.onplaying = function() {
        app.totalTime = createTime(this.duration);
      };

      app.audio.ontimeupdate = function() {
        app.currentTime = createTime(this.currentTime);
        app.elapsedPercentage = ((this.currentTime / this.duration) * 100).toFixed(2);
      };

      app.audio.onended = function() {
        if (app.playing < numberOfTracks) {
          app.playSong(app.playing + 1)
        }
      };

      app.audio.play();

    },
    stopSong: function() {
      app.audio.pause();
      app.playing = '';
      app.date = '';
    },
    nextSong: function() {
      if (app.playing < numberOfTracks) {
        app.playSong(app.playing + 1)
      }
    },
    previousSong: function() {
      if (app.playing > 1) {
        app.playSong(app.playing - 1)
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
