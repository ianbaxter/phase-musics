const ctx = new AudioContext();

class Audio {
  start() {
    console.log("starting");
    fetch("../assets/hurryboy.wav")
      .then((res) => res.arrayBuffer())
      .then((arrBuffer) => ctx.decodeAudioData(arrBuffer))
      .then((audioBuffer) => {
        startLoop(audioBuffer, -1);
        startLoop(audioBuffer, 1, 1.004);
      })
      .catch((err) => console.log(err));

    const startLoop = (audioBuffer, pan, rate = 1) => {
      const sourceNode = ctx.createBufferSource();
      const pannerNode = ctx.createStereoPanner();

      sourceNode.buffer = audioBuffer;
      sourceNode.loop = true;
      sourceNode.loopStart = 0;
      sourceNode.loopEnd = 0.65;
      sourceNode.playbackRate.value = rate;
      pannerNode.pan.value = pan;

      sourceNode.connect(pannerNode);
      pannerNode.connect(ctx.destination);
      sourceNode.start(0, 0);
    };
  }
}

export default Audio;
