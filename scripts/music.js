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

var numberOfTracks = document.getElementById('card-first').dataset.numberOfTracks;

new Vue({
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

      if (this.audio) {
        this.audio.pause();
      }

      currentTrack = document.getElementById('card-' + id);
      this.date = currentTrack.dataset.date;

      this.playing = id;
      this.audio = new Audio(currentTrack.dataset.url);
      this.currentTime = '';

      this.audio.onplaying = function(event) {
        this.totalTime = createTime(event.currentTarget.duration);
      }.bind(this);

      this.audio.ontimeupdate = function(event) {
        this.currentTime = createTime(event.currentTarget.currentTime);
        this.elapsedPercentage = ((event.currentTarget.currentTime / event.currentTarget.duration) * 100).toFixed(2);
      }.bind(this);

      this.audio.play();

    },
    stopSong: function() {
      this.audio.pause();
      this.playing = '';
      this.date = '';
    },
    nextSong: function() {
      if (this.playing < numberOfTracks) {
        this.playSong(this.playing + 1)
      }
    },
    previousSong: function() {
      if (this.playing > 1) {
        this.playSong(this.playing - 1)
      }
    }
  }
})
