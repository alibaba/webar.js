
import WebAR from '../../dist/webar';
import facePoint from './facePoints';

async function face() {
  console.log('FaceDetector');
  const canvas = document.querySelector('#canvas');
  canvas.width = 480;
  canvas.height = 640;
  const coverCanvas = document.querySelector('.cover');
  coverCanvas.width = 480 / 2;
  coverCanvas.height = 640 / 2;
  const fpointer = new facePoint(coverCanvas);
  const gl = canvas.getContext('webgl');
  let camera = null;
  try {
    camera = await WebAR.getWebCameraAsync({
      facing: 'FRONT',
      quality: 'LOW',
    });

    await camera.openAsync();
    const displayTarget = camera.createDisplayTarget(gl);
    setInterval(() => {
      displayTarget.draw();
    }, 50);

    const faceDetector = camera.setDetector('FaceDetector', { rect: true, alignment: true });
    faceDetector.onDetectorInitResult((data) => {
      console.log('onDetectorInitResult', data);
    });
    faceDetector.onResult((data) => {
      if (data.count === 0) return;
      fpointer.draw(data);
    });
    faceDetector.start();
  } catch (e) {
    console.log(e);
  }
}

export default face;
