// function createTimeString(string,pad,length) {
//   return (new Array(length+1).join(pad)+string).slice(-length);
// }

// function createTime(time) {
//   var minutes = Math.floor(time / 60);
//   var seconds = time - minutes * 60;
//   return createTimeString(minutes,'0',2)+':'+createTimeString(seconds,'0',2);
// }

function createTime(d) {
d = Number(d);
var h = Math.floor(d / 3600);
var m = Math.floor(d % 3600 / 60);
var s = Math.floor(d % 3600 % 60);
return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); }

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
  },
  methods: {
    playSong: function(title, id) {

      this.playing = id;
      this.audio = new Audio('http://music-and-the-mind-of-the-world.s3.amazonaws.com/780119.mp3');
      var now = new Date();

      this.audio.onplaying = function(event) {
        this.totalTime = createTime(event.currentTarget.duration);
      }.bind(this);

      this.audio.ontimeupdate = function(event) {

        this.currentTime = createTime(event.currentTarget.currentTime);

        //this.currentTime = event.currentTarget.currentTime;
      }.bind(this);

      this.audio.play();

      this.title = title;

      // this.timer = setInterval(function() {
      //   this.currentTime = this.audio.progress;
      // }.bind(this),1000);
    },
    stopSong: function() {
      this.audio.pause();
      this.playing = '';
      clearInterval(this.timer);

      this.title = 'nothin';
    }
  }
})
