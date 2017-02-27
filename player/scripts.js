// https example: https://amazingfacts.live-s.cdn.bitgravity.com/cdn-live/_definst_/amazingfacts/live/feed01/chunklist_w2016423458.m3u8

// cors example http://e.shoxie.com/hls/patv.m3u8

// not limited example http://cspan2-lh.akamaihd.net/i/cspan2_1@304728/index_1000_av-p.m3u8

// mms://streams.tvknob.com/tvloops/CH12/tvknob.wsx - what is this?

// https example https://acaooyalahd2-lh.akamaihd.net/i/TBN01_delivery@186239/index_2528_av-p.m3u8

var defaultVideo = "http://mn-l.mncdn.com/kanal24/smil:kanal24.smil/playlist.m3u8";

if(window.location.search.length) {
  var parsedParams = window.location.search.substr(1);
  var params = {};
  parsedParams = parsedParams.split("&");
  for(var i=0; i<parsedParams.length; i++) {
    var paramItem = parsedParams[i];
    if(paramItem.split("=")[1]) {
      var key = paramItem.split("=")[0];
      var value = paramItem.split("=")[1];
      params[key] = value;
    }
  }

  if(params.video) {
    defaultVideo = decodeURIComponent(params.video);
  }
}

document.querySelector("#video-run").addEventListener("click", function(event) {
  var inputValue = document.querySelector("input#video-input").value;
  if(inputValue) {
   
    player.src({
      src: inputValue,
      type: 'application/x-mpegURL',
      withCredentials: true
    });

    player.play();
  }
  
  
});

var player = videojs('example-video');

    player.src({
      src: defaultVideo,
      type: 'application/x-mpegURL',
      withCredentials: true
    });

player.play();