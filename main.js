'use strict';

const VOICE_RSS_KEY = '<YOUR_KEY_HERE>';

function randomElement(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)];
}

const QUOTES = [
  'I have so much stuff to tell you!',
  'The princess is in another castle.',
  'Believe in your dreams!',
  'This is so well-made I want to lick it.',
];

// Global state variables
let ANIMATED = false;
let sound;
let lastReadQuote = null;
let quote;

function toggleAnimated() {
  ANIMATED = !ANIMATED;
}

function setFrame1() {
  const everythingDOM = document.getElementById('everything');
  everythingDOM.className = 'bg frame_1';
}

function toggleFrame() {
  const everythingDOM = document.getElementById('everything');
  if (everythingDOM.classList.contains('frame_2')) {
    everythingDOM.className = 'bg frame_1';
  } else {
    everythingDOM.className = 'bg frame_2';
  }
}

function update() {
  toggleFrame();
  if (ANIMATED) {
    const playingRatio = Math.min(sound.seek() / (sound.duration() - 0.6));
    const nbOfLetters = Math.ceil(quote.length * playingRatio);
    const partialQuote = quote.slice(0, nbOfLetters);

    const quoteDOM = document.getElementById('quoteText');
    quoteDOM.innerHTML = partialQuote;

    // Disable animation 1s before the end (because there is silence at the end of the file)
    if (playingRatio > 1) {
      ANIMATED = false;
    }

    setTimeout(update, 100);
  } else {
    setFrame1();
  }
}

function onClick() {
  if (ANIMATED) {
    // animation in progress, do nothing
    return;
  }

  const everythingDOM = document.getElementById('everything');

  quote;
  do {
    quote = randomElement(QUOTES);
  } while (quote === lastReadQuote);
  lastReadQuote = quote;

  sound = new Howl({
    src: [
      // `https://api.voicerss.org/?key=${VOICE_RSS_KEY}&hl=en-us&r=1&src=${quote}`,
      'placeholder_speak.wav',
    ],
    format: 'mp3',
    autoplay: false,
  });

  sound.play();

  sound.once('play', function() {
    ANIMATED = true;
    const quoteDOM = document.getElementById('quoteText');
    quoteDOM.className = '';
    quoteDOM.innerHTML = '';

    setTimeout(update, 100);
  });

  sound.once('end', function() {
    ANIMATED = false;
    const quoteDOM = document.getElementById('quoteText');
    quoteDOM.className = 'hidden';

    sound.unload();
  });
}
