new Vue({
  el: '#app',
  data: {
    title: 'nothing',
    currentTime: '12:00',
    totalTime: '22:00'
  },
  methods: {
    playSong: function(title) {
      this.title = title;
    }
  }
})
