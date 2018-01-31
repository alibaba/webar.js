
import WebAR from '../dist/webar';

async function render() {
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
    const displayTarget = camera.createDisplayTarget(gl);

    setInterval(() => {
      displayTarget.draw();
    }, 30);
  } catch (e) {
    console.log(e);
  }
}

export default render;
