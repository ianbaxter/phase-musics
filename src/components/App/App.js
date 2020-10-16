import React, { useState } from "react";
// import Audio from "../../utils/audio";
import "./App.scss";

function App() {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [speed, setSpeed] = useState("1.002");
  const [loopStart, setLoopStart] = useState("0");
  const [loopEnd, setLoopEnd] = useState(null);

  const ctx = new AudioContext();

  const fileUploaded = (e) => {
    const file = e.target.files[0];

    // Check if the file is audio.
    if (file.type && file.type.indexOf("audio") === -1) {
      console.log("File is not audio.", file.type, file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      ctx
        .decodeAudioData(event.target.result)
        .then((audioBuffer) => {
          setAudioBuffer(audioBuffer);
        })
        .catch((e) => console.error(e));
    });
    reader.readAsArrayBuffer(file);
  };

  const start = () => {
    if (ctx.state !== "running") {
      ctx.resume();
    }
    startLoop(audioBuffer, -1, 1);
    startLoop(audioBuffer, 1, speed);
  };

  const startLoop = (audioBuffer, pan, rate = 1) => {
    const sourceNode = ctx.createBufferSource();
    const pannerNode = ctx.createStereoPanner();

    sourceNode.buffer = audioBuffer;
    sourceNode.loop = true;
    sourceNode.loopStart = loopStart;
    sourceNode.loopEnd = loopEnd;
    sourceNode.playbackRate.value = rate;
    pannerNode.pan.value = pan;

    sourceNode.connect(pannerNode);
    pannerNode.connect(ctx.destination);
    sourceNode.start(0, loopStart);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    switch (e.target.name) {
      case "speed":
        // console.log("speed: " + value);
        setSpeed(value);
        break;
      case "loop-start":
        // console.log("start: " + value);
        setLoopStart(value);
        break;
      case "loop-end":
        // console.log("end: " + value);
        setLoopEnd(value);
        break;
      default:
        break;
    }
  };

  let maxLength = 0;
  if (audioBuffer) {
    maxLength = Math.round(audioBuffer.duration * 10) / 10;
  }

  return (
    <div className="App">
      <h1>Phase Musics</h1>
      <p>
        Load a short .mp3 or .wav file. <br />
        Set the loop positions and speed difference. <br />
        Listen to the sample phase between itself. <br />
        Inspired by{" "}
        <a href="https://teropa.info/blog/2016/07/28/javascript-systems-music.html">
          this article
        </a>{" "}
        and Steve Reich. <br />
        Refresh page to reset.
      </p>
      <div className="card">
        <input type="file" accept=".wav, .mp3, .ogg" onChange={fileUploaded} />
        <button onClick={start} disabled={audioBuffer === null}>
          Start
        </button>
        {audioBuffer && (
          <div className="controls">
            <div className="control">
              <input
                type="range"
                orient="vertical"
                id="loop-start"
                name="loop-start"
                min="0"
                max={maxLength}
                step="1"
                onInput={handleChange}
                defaultValue="0"
              />
              <label htmlFor="loop-start">Loop Start</label>
            </div>
            <div className="control">
              <input
                type="range"
                orient="vertical"
                id="loop-end"
                name="loop-end"
                min="0"
                max={maxLength}
                step="1"
                onInput={handleChange}
                defaultValue={maxLength}
              />
              <label htmlFor="loop-start">Loop End</label>
            </div>
            <div className="control">
              <input
                type="range"
                orient="vertical"
                id="speed"
                name="speed"
                min="1.001"
                max="1.01"
                step="0.001"
                onInput={handleChange}
                defaultValue="1.002"
              />
              <label htmlFor="speed">Speed</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
