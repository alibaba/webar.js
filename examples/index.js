import { setInterval } from 'timers';
import WebAR from '../dist/webar';

async function init() {
  const canvas = document.querySelector('#canvas');
  canvas.width = 480;
  canvas.height = 640;
  const gl = canvas.getContext('webgl');

  try {
    const camera = await WebAR.getWebCameraAsync({
      facing: 'FRONT',
      quality: 'LOW',
    });

    await camera.openAsync();

    const displayTarget = camera.createDisplayTarget(gl, { cameraSize: 'COVER' });

    setInterval(() => {
      displayTarget.draw();
    }, 30);

    const faceDetector = camera.setDetector('FaceDetector', {
      singleFace: false,
      turbo: true,
      dThreshold: {
        up: 0.32,
        right: 0.35,
        down: 0.5,
        left: 0.65,
      },
      speed: 4,
      minSize: 40,
      rect: true,
      confidence: true,
      alignment: true,
      pose: true,
      direction: true,
    });

    faceDetector.start();
    faceDetector.onResult((data) => {
      console.log(data);
    });
  } catch (e) {
    console.log(e);
  }
}

init();
