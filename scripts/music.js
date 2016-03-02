function createTime(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

var totalLength,
    totalLengthMinutes,
    totalLengthSeconds;


new Vue({
  el: '#app',
  data: {
    title: 'something else goes here',
    currentTime: '',
    totalTime: '',
    audio: '',
    playing: '',
    elapsedPercentage: ''
  },
  methods: {
    playSong: function(title, id) {

      if (this.audio) {
        this.audio.pause();
      }

      console.log(id);

      this.playing = id;
      this.audio = new Audio('http://music-and-the-mind-of-the-world.s3.amazonaws.com/780119.mp3');
      this.currentTime = '';

      this.audio.onplaying = function(event) {
        this.totalTime = createTime(event.currentTarget.duration);
      }.bind(this);

      this.audio.ontimeupdate = function(event) {
        this.currentTime = createTime(event.currentTarget.currentTime);
        this.elapsedPercentage = ((event.currentTarget.currentTime / event.currentTarget.duration) * 100).toFixed(2);
      }.bind(this);

      this.audio.play();
      this.title = title;

    },
    stopSong: function() {
      this.audio.pause();
      this.playing = '';
      this.title = 'nothin';
    },
    nextSong: function(id) {
      console.log(id);
      this.playing = (Number(id) +1);

    }
  }
})
