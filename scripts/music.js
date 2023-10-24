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

function urlToId(url){
  return url.split("/").slice(-1)[0].split("_").slice(-1)[0].split(".")[0];
}

var app = new Vue({
  el: '#app',
  data: {
    date: localStorage.getItem('date') ? localStorage.getItem('date') :'',
    part: localStorage.getItem('part') ? localStorage.getItem('part') :'',
    currentTime: localStorage.getItem('currentTime') ? localStorage.getItem('currentTime') :'',
    totalTime: localStorage.getItem('totalTime') ? localStorage.getItem('totalTime') :'',
    audio: '',
    activeSong: localStorage.getItem('activeSong') ? localStorage.getItem('activeSong') :'',
    elapsedPercentage: localStorage.getItem('elapsedPercentage') ? localStorage.getItem('elapsedPercentage') :'',
    numberOfTracks: numberOfTracks,
    trackUrl: localStorage.getItem('trackUrl') ? localStorage.getItem('trackUrl') :'',
    paused: 'true',
    playhead: "",
    elapsed: "",
    transformElapsed: "0",
    fullscreenClicked: 'false'
  },
  methods: {
    playSong: function(id) {
      console.log("playing",id)
      app.paused = 'false';
      if (app.audio) {
        app.audio.pause();
      }

      $('#title-inner-wrapper').velocity("stop");

      currentTrack = document.getElementById('card-' + id);
      app.playhead = document.querySelector("#fullscreen .brand-small");
      app.elapsed = document.querySelector("#fullscreen .time-elapsed");
      //restart if we get to the end!
      if(!currentTrack) {
        currentTrack = document.getElementById('card-1');
      }

      var w = window.innerWidth;
      var offset = window.innerWidth <= 768 ? -500 : -400;

      $(currentTrack).velocity("scroll",  { duration: 1000, offset : offset });

      app.date = currentTrack.dataset.date;
      localStorage.setItem('date', app.date);
      app.part = currentTrack.dataset.part;
      localStorage.setItem('part', app.part);

      if (app.activeSong != id || !!!app.audio) {
        // this restarts the song
        app.activeSong = id;
        console.log("restarging",id)
        localStorage.setItem('activeSong', app.activeSong);
        app.audio = new Audio(currentTrack.dataset.url);
        app.currentTime = '';
        app.trackUrl = currentTrack.dataset.url;
        localStorage.setItem('trackUrl', app.trackUrl);
      }

      app.audio.onplaying = function() {
        app.totalTime = createTime(this.duration);
        localStorage.setItem('totalTime', app.totalTime);
      };

      app.audio.ontimeupdate = function() {
        app.currentTime = createTime(this.currentTime);
        localStorage.setItem('currentTime', app.currentTime);
        app.elapsedPercentage = ((this.currentTime / this.duration) * 100).toFixed(2);
        localStorage.setItem('elapsedPercentage', app.elapsedPercentage);
        if(this.currentTime % 60 < 1){
          let w = Math.floor(app.elapsed.getBoundingClientRect().width);
          let space = Math.floor(window.innerWidth*.005);
          app.transformElapsed = -1*(w+space)+"px"
        }
          
      };

      app.audio.onended = function() {
        if (app.activeSong < numberOfTracks) {
          app.playSong(parseInt(app.activeSong) + 1)
        }
      };

      app.audio.play();
      if (! $('#footer-audio-controls .audio-controls').hasClass('visible')) {
        $('#footer-audio-controls .audio-controls').addClass('visible');
      }

      setTimeout(function(){

        var outerWrapperWidth = $('#title-outer-wrapper').width();
        var innerWrapperWidth = $('#title-inner-wrapper .title').width();
        if (innerWrapperWidth > outerWrapperWidth ){

          $('#title-inner-wrapper').addClass('overflow');

          var leftDistance = '-' + (innerWrapperWidth - outerWrapperWidth) + 'px';

          $('#title-inner-wrapper')
          .velocity({ left: '0px' }, { duration: 3000, loop: true, delay: 3000  })
          .velocity({ left: leftDistance }, { duration: 3000, loop: true, delay: 3000 });
        } else {
          $('#title-inner-wrapper').removeClass('overflow');
        }
      }, 200);
      // document.getElementById("fullscreen").innerHTML = currentTrack.innerHTML;
      this.updateFullscreenPanel();
      if (app.fullscreenClicked == 'false') {
        document.getElementById("fullscreen").requestFullscreen();
      }
      fullscreenClicked = 'true';
    },
    updateFullscreenPanel(){
      //get current card
      console.log("updating fullscreen panel");
      console.log(this,this.activeSong)
      var currentTrack = document.getElementById('card-' + this.activeSong);
      $("#fullscreen .card-kiosk .small-part").html("MATMOTW_"+urlToId(app.trackUrl));
      $("#fullscreen .card-kiosk .card-title").html(app.date);
      $("#fullscreen .card-kiosk .card-subtitle").html(app.part ? "Part "+app.part : "");
      $("#fullscreen .card-kiosk").attr("data-song", this.activeSong);
      $("#fullscreen .card-kiosk").addClass("song-is-playing");
      // $("#fullscreen .card-body").html(currentTrack.innerHTML);
      console.log(currentTrack);
      if(currentTrack)
      $("#fullscreen .card .card-notes").html(currentTrack.dataset.title);
      // console.log(currentTrack.dataset);

    },
    updatePlayhead:function(event) {

      if (event.type == 'mouseup') {
        console.log('up!', event);
      }

      var percent = (event.pageX / window.innerWidth)*100
      app.elapsedPercentage = percent;
      localStorage.setItem('elapsedPercentage', app.elapsedPercentage);

      var newTime  = app.audio.duration * (percent/100);
      app.audio.currentTime = newTime.toFixed(0);
      
      console.log("YAH?",app.transformElapsed)
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
        app.playSong(parseInt(app.activeSong) + 1)
      }
    },
    previousSong: function() {
      if (app.activeSong > 1) {
        app.playSong(app.activeSong - 1)
      }
    }
  }
})

var fullScreenControlsTimeout;

$(document).ready(function(){

  //if activeSong is in localstorage, update fullscreen panel
  if (app.activeSong) {
    app.updateFullscreenPanel();
  }

  $('.scroll-link').click(function(e){
    e.preventDefault();
    var offset = window.innerWidth <= 768 ? -10 : -50;
    var year = $(this).attr("href");
    console.log(year);
    $(year).velocity("scroll",  { duration: 1000, offset : offset })
  });

  $(document).on("click","#fullscreen .card.song-is-playing", function(e){
    e.preventDefault();
    e.stopPropagation();
    console.log($(e.target).closest(".card").attr("data-song"));
    app.playSong($(e.target).closest(".card").attr("data-song"));
  });

  $(document).on("click","#fullscreen .card:not(.song-is-playing)", function(e){
    app.playSong(1);
  });

  $(document).on("click","#fullscreen-exit", function(e){
    document.exitFullscreen();
  });

  $(document).on("click","#fullscreen-play", function(e){
    // console.log("fullscreen play ",app.activeSong)
    // app.playSong(parseInt($("#fullscreen .card").attr("data-song")));
    app.audio.play();
    app.paused = 'false';
    console.log("app audio",app.audio)
  });

  $(document).on("click","#fullscreen-pause", function(e){
    app.pauseSong();
  });

  $(document).on("mousemove","#fullscreen", function(e){
    if (fullScreenControlsTimeout) {
      clearTimeout(fullScreenControlsTimeout);
    }
    $("#fullscreen").addClass("controls-visible");
    fullScreenControlsTimeout = setTimeout(function(){
      $("#fullscreen").removeClass("controls-visible");
    }, 3000);
  });

});
