
import React from 'react';
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
import jsPDF from 'jspdf';

import './App.css'

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.cameraPhoto = null;
    this.videoRef = React.createRef();
    this.state = {
      dataUri: null
    }
  }

  componentDidMount() {
    // We need to instantiate CameraPhoto inside componentDidMount because we
    // need the refs.video to get the videoElement so the component has to be
    // mounted.
    this.cameraPhoto = new CameraPhoto(this.videoRef.current);
    this.startCamera();
  }

  startCamera(idealFacingMode, idealResolution) {
    this.setState({ dataUri: '' });
    this.cameraPhoto.startCamera(idealFacingMode, idealResolution)
      .then(() => {
        console.log('camera is started !');
      })
      .catch((error) => {
        console.error('Camera not started!', error);
      });
  }

  startCameraMaxResolution(idealFacingMode) {
    this.setState({ dataUri: '' });
    this.cameraPhoto.startCameraMaxResolution(idealFacingMode)
      .then(() => {
        console.log('camera is started !');
      })
      .catch((error) => {
        console.error('Camera not started!', error);
      });
  }

  takePhoto() {
    const config = {
      sizeFactor: 1
    };

    let dataUri = this.cameraPhoto.getDataUri(config);
    this.setState({ dataUri });
    console.log(dataUri)
    this.stopCamera();
    //this.onCreatePdf(dataUri)
  }

  rejectPhoto() {

    this.state = {
      dataUri: null,
      hasVideo: false
    }
    this.startCamera();
  }



  onCreatePdf(data) {
    // only jpeg is supported by jsPDF
    let pdf = new jsPDF()
    console.log(data);
    pdf.addImage(data, 'JPEG', 0, 0);
    pdf.save("screenshot.pdf");

  }

  stopCamera() {
    this.cameraPhoto.stopCamera()
      .then(() => {
        console.log('Camera stoped!');
      })
      .catch((error) => {
        console.log('No camera to stop!:', error);
      });
  }

  render() {
    return (
      <div>
        <button onClick={() => {
          let facingMode = FACING_MODES.ENVIRONMENT;
          let idealResolution = { width: 640, height: 480 };
          this.startCamera(facingMode, idealResolution);
        }}> Start Camera (640 x 480) </button>


        <button onClick={() => {
          let facingMode = FACING_MODES.USER;
          this.startCameraMaxResolution(facingMode);
        }}> Start user facingMode resolution maximum </button>

        <button onClick={() => {
          this.takePhoto();
        }}> Take Photo </button>

        <button onClick={() => {
          this.rejectPhoto();
        }}> Reject Photo</button>

        <button onClick={() => {
          this.stopCamera();
        }}> Stop Camera </button>

        <div>
          <video
            ref={this.videoRef}
            autoPlay={true}
          />
        </div>

        {this.state.dataUri &&
          <div>
            <h1>PICTURE</h1>
            <img
              alt="imgCamera"
              src={this.state.dataUri}
            />
          </div>
        }
      </div>
    );
  }
}

export default App;