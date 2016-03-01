new Vue({
  el: '#app',
  data: {
    title: 'nothing',
    currentTime: '12:00',
    totalTime: '22:00'
  },
  methods: {
    playSong: function(title) {
      var audio = new Audio('http://music-and-the-mind-of-the-world.s3.amazonaws.com/780119.mp3');
      audio.play();

      this.title = title;
    },
    stopSong: function(title) {
      this.title = 'nothin';
    }
  }
})
