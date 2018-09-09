import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {transcript: "", recording: false, parts: []};
  }

  handleRecord() {
    if (!this.state.recording) {
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
          // var xhr = new XMLHttpRequest();
          // xhr.open('POST', 'https://scribr-backend.herokuapp.com/transcribe', true);
          // xhr.setRequestHeader("Content-Type", "multipart/form-data");
  
          // xhr.send(blob);
  
          const data = new FormData();
          data.append('audio', blob, 'audio.opus');
  
          console.log(data);
  
          axios.create ({
            baseURL: 'http://scribr-backend.herokuapp.com',
            timeout: 10000}).post(`/transcribe`, data, {
              headers: {
              'Content-Type': `multipart/form-data;
              boundary = ${data._boundary}`,
            },
            timeout: 30000,
          })
          .then(response => {
            console.log(response.data);
            this.setState({transcript: response.data["transcript"], recording: this.state.recording, parts: response.data["transcript"].split('next')});
          });

          console.log(this.state.parts);
        }
  
      this.mr.start();
      this.setState({transcript: this.state.transcript, recording: true, parts: this.state.parts})
      });
    }
  }

  handleStop() {
    if (this.state.recording) {
      this.mr.stop();
      this.setState({transcript: this.state.transcript, recording: false, parts: this.state.parts})
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Scribr</h1>
        </header>
        <div className="container" id="button-container">
          <button id="sbtn" className="btn btn-success" type="button" onClick={this.handleRecord.bind(this)}>start</button>
          <button id="tbtn" className="btn btn-danger" type="button" onClick={this.handleStop.bind(this)}>end</button>
        </div>
        <div className="container" id="form-container">
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <input value={this.state.parts[0]} className="form-control" id="name" placeholder="Name"/>
              </div>
              <div className="form-group col-md-6">
                <input value={this.state.parts[1]} className="form-control" id="sex" placeholder="Sex"/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <input value={this.state.parts[2]} className="form-control" id="age" placeholder="Age"/>
              </div>
              <div className="form-group col-md-6">
                <input value={this.state.parts[3]} className="form-control" id="dob" placeholder="Date of Birth"/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <input value={this.state.parts[4]} className="form-control" id="height"placeholder="Height"/>
              </div>
              <div className="form-group col-md-6">
                <input value={this.state.parts[5]} className="form-control" id="weight" placeholder="Weight"/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <textarea value={this.state.parts[7]} className="form-control" id="symptoms" rows="3" placeholder="Symptoms"></textarea>
              </div>
              <div className="form-group col-md-6">
                <textarea value={this.state.parts[9]} className="form-control" id="locations" rows="3" placeholder="Locations"></textarea>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <textarea value={this.state.parts[11]} className="form-control" id="history" rows="3" placeholder="Pertinent medical history"></textarea>
              </div>
              <div className="form-group col-md-6">
                <textarea value={this.state.parts[13]} className="form-control" id="meds" rows="3" placeholder="Medications"></textarea>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <textarea value={this.state.parts[15]} className="form-control" id="diagnosis" rows="3" placeholder="Diagnosis"></textarea>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <textarea value={this.state.parts[17]} className="form-control" id="narrative" rows="3" placeholder="Narrative"></textarea>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
