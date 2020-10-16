import React from "react";
import Audio from "../../utils/audio";
import "./App.css";

function App() {
  const audio = new Audio();
  return (
    <div className="App">
      <button onClick={() => audio.start()}>Start</button>
    </div>
  );
}

export default App;
