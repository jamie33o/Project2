
/**audio element selector for adding source of audio */
const audio = document.getElementById('track');

/** play/pause button */
const mutePlayButton = document.querySelectorAll('.mute-play-btn');

//-------functions for audio--------

/**function's for mute/unmute audio */
function toggleMutePlay() {
    if (audio.paused) {
      audio.play();
      //sets the image for mute/sound button on start over lay and in game
      mutePlayButton.forEach(button => {
        button.style.backgroundImage = 'url("assets/images/no-sound.png")';
      });
      mute = false;
    } else {
      audio.pause();
      mutePlayButton.forEach(button => {
      button.style.backgroundImage = 'url("assets/images/sound-on.png")';
      });
      mute = true;
    }
  }
  
/** 
 * Function to change the audio source, and then play it if sound not muted 
 * @param {url} sourceUrl - url of audio file
 * */ 
  function playAudioWithSrc(sourceUrl) {
    audio.src = sourceUrl;
    if(mute){
        audio.pause();
    } else {
        audio.play();
    }
  }
