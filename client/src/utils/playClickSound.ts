// utils/playClickSound.js

export const playClickSound = () => {
  const audio = new Audio("/audio/click.wav");
  audio.volume = 1.0; 
  
  audio.currentTime = 0; 
  
  audio.play().catch((err) => {
    console.log("Audio playback prevented by browser policy:", err);
  });
};