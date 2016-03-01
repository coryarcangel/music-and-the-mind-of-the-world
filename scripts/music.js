

new Vue({
  el: '#app',
  data: {
    title: 'something else goes here',
    currentTime: '12',
    totalTime: '22',
    audio: '',
    playing: ''
  },
  methods: {
    playSong: function(title, id) {

      this.playing = id;
      console.log(playing);

      this.audio = new Audio('http://music-and-the-mind-of-the-world.s3.amazonaws.com/780119.mp3');
      var now = new Date()

      this.audio.onprogress = function(event) {
        this.currentTime = Math.floor((event.timeStamp - now.getTime())/1800);
      }.bind(this);


      this.audio.play();

      this.title = title;






      // this.timer = setInterval(function() {
      //   this.currentTime = this.audio.progress;
      // }.bind(this),1000);



    },
    stopSong: function() {
      this.audio.stop();

      clearInterval(this.timer);

      this.title = 'nothin';
    }
  }
})
