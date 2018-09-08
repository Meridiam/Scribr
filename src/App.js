import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  handleRecord() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then((stream) => {
      this.mr = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mr.ondataavailable = e => {
        //inside callback function when recording is done
        console.log("recording...");
        this.audioChunks.push(e.data);
        console.log(this.audioChunks);

        let blob = new Blob(this.audioChunks, { 'type': 'audio/ogg; codecs=opus' });
        let blobURL = window.URL.createObjectURL(blob);
        var audioPlayer = document.createElement("AUDIO");
        audioPlayer.src = blobURL;      
        audioPlayer.setAttribute("id", "player");
        audioPlayer.setAttribute("controls", "controls");
        document.body.appendChild(audioPlayer); 

        //USE AXIOS TO SEND POST REQUEST TO SERVER WITH BLOB AS PART OF A FORM (LOOK IT UP)
        var fd = new FormData();
        fd.append('audio', blob, 'audio.opus');

        fetch('scribr-backend.herokuapp.com/transcribe', {
          method: 'POST',
          data: fd
        }).catch(err => alert(err))
      }

    this.mr.start();
    });
  }

  handleStop() {
    this.mr.stop();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button onClick={this.handleRecord.bind(this)}>start</button>
        <button onClick={this.handleStop.bind(this)}>end</button>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
