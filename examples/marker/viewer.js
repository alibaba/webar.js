
class Viewer {
  constructor(el, ARWidth, ARHeight, ARCameraMatrix) {
    this.el = el;
    this.ARWidth = ARWidth;
    this.ARHeight = ARHeight;
    this.ARCameraMatrix = ARCameraMatrix;
    this.lights = [];
    this.content = null;
    this.mixer = null;
    this.clips = [];
    this.isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent);

    this.state = {
      playAnimation: true,
      addLights: true,
      directColor: 0xffeedd,
      ambientColor: 0x222222,
    };

    this.prevTime = 0;
    this.scene = new window.THREE.Scene();
    this.camera = new window.THREE.Camera();
    this.camera.projectionMatrix.elements = this.ARCameraMatrix;
    this.renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.clear();
    this.el.appendChild(this.renderer.domElement);
    this.renderer.setSize(ARWidth, ARHeight);
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.renderer.setSize(this.ARWidth, this.ARHeight);
  }

  gltflLoad(url) {
    const loader = new window.THREE.GLTF2Loader();
    loader.setCrossOrigin('anonymous');
    loader.load(url, gltf => {
      this.setContent(gltf.scene || gltf.scenes[0]);
      this.setClips(gltf.animations || []);
    }, undefined);
  }

  setContent(object) {
    console.log('gltflLoad');
    this.clear();
    this.object = object;
    this.object.matrixAutoUpdate = false;
    this.scene.add(this.object);
    this.content = this.object;

    this.state.addLights = true;
    this.content.traverse(node => {
      if (node.isLight) {
        this.state.addLights = false;
      }
    });

    this.updateLights();
  }

  setClips(clips) {
    this.stopAnimation();
    if (this.mixer) {
      this.mixer.uncacheRoot(this.mixer.getRoot());
      this.mixer = null;
    }

    this.clips = clips;
    if (!clips.length) return;
    this.mixer = new window.THREE.AnimationMixer(this.content);
    if (this.state.playAnimation) this.playAnimation();
  }

  playAnimation() {
    this.clips.forEach(clip => this.mixer.clipAction(clip).play());
  }

  stopAnimation() {
    if (this.mixer) this.mixer.stopAllAction();
  }

  updateLights() {
    if (this.state.addLights && !this.lights.length) {
      this.addLights();
    } else if (!this.state.addLights && this.lights.length) {
      this.removeLights();
    }
  }

  addLights() {
    const light1 = new window.THREE.DirectionalLight(this.state.directColor);
    light1.position.set(0, 0, 1);
    this.scene.add(light1);

    const light2 = new window.THREE.DirectionalLight(this.state.directColor);
    light2.position.set(0, 5, -5);
    this.scene.add(light2);

    const light3 = new window.THREE.AmbientLight(this.state.ambientColor);
    this.scene.add(light3);
    this.lights.push(light1, light2, light3);
  }

  removeLights() {
    this.lights.forEach(light => this.scene.remove(light));
    this.lights.length = 0;
  }

  clear() {
    this.scene.remove(this.content);
  }

  detectionCatch(matrix) {
    const time = +new Date();
    const dt = (time - this.prevTime) / 1000;
    this.mixer && this.mixer.update(dt);
    this.prevTime = time;
    this.render();
    if (this.isIOS) {
      const scaleNum = 0.8 * 1e-4;
      window.mat4.scale(matrix, matrix, [ scaleNum, scaleNum, scaleNum * 200 ]);
    } else {
      const scaleNum = 0.02;
      window.mat4.scale(matrix, matrix, [ scaleNum, scaleNum, scaleNum ]);
    }
    window.mat4.rotate(matrix, matrix, Math.PI, [ 0, 1, 0 ]);
    window.mat4.rotate(matrix, matrix, -Math.PI / 2, [ 1, 0, 0 ]);
    this.object.matrix.elements = matrix;
    this.render();
  }

}

export default Viewer;
