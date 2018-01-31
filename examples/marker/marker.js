
import WebAR from '../../dist/webar';
import Viewer from './viewer';

async function marker() {
  console.log('MakerDetector');
  const canvas = document.querySelector('#canvas');
  canvas.width = 480;
  canvas.height = 640;
  const gl = canvas.getContext('webgl');

  try {
    const camera = await WebAR.getWebCameraAsync({
      facing: 'BACK',
      quality: 'LOW',
    });

    await camera.openAsync();
    const displayTarget = camera.createDisplayTarget(gl);

    setInterval(() => {
      displayTarget.draw();
    }, 40);

    const markerDetector = camera.setDetector('MarkerDetector', {
      markers: ['playbill', 'h'],
      option: { url: 'https://github.com/ferrum-team/static/blob/master/marker_data/marker_data.zip?raw=true' },
    });

    let viewer = null;
    let firstCameraMatrix = false;
    markerDetector.onResult((data) => {
      if (data.type === 'camera' && !firstCameraMatrix) {
        firstCameraMatrix = true;
        if (data.data) {
          viewer = new Viewer(document.querySelector('.three'), 480 / 2, 640 / 2, data.data);
        } else {
          viewer = new Viewer(document.querySelector('.three'), 480 / 2, 640 / 2, data.matrix);
        }
        viewer.gltflLoad('https://raw.githubusercontent.com/ferrum-team/static/master/gltf/squirrel.gltf');
      } else if (data.type === 'marker') {
        data.data.map((obj) => {
          if (obj.isDetected) {
            const { matrix } = obj;
            if (matrix.matrix) {
              viewer.detectionCatch(matrix.matrix);
            } else {
              viewer.detectionCatch(matrix);
            }
          }
          return [];
        });
      }
    });
    markerDetector.start().then(() => {});
  } catch (e) {
    console.log(e);
  }
}

export default marker;
