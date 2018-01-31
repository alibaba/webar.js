# WebAR.js

### JS framework for WebAR.

## Installing WebAR.js

    npm install --save webar.js

## Docs

- <a href="http://ar.uc.cn/docs/webar/index.html">Website && Documentations</a>

## Getting Started:

WebAR.js 包含几个模块：

-   WebAR - WebAR.js入口，获取Camera对象
-   Camera - 摄像头模块
-   DisplayTarget - 绘制模块
-   Detector - 检测算法模块

```javascript
import WebAR from 'webar.js';

// 从 WebAR 获取配置好的camera对象
const camera = await WebAR.getWebCameraAsync();

// 异步打开摄像机
await camera.openAsync();

const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl');

// 配置并生成 displayTarget
const displayTarget = camera.createDisplayTarget(gl);

// 绘制
const draw = () => {
  displayTarget.draw();
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);

/*
* 配置FaceDetector
* @param {String} detectorName - camera.DETECTOR.FACE = 'FACE', 配置FaceDetector
* @param {Object} option - option
* @param {Boolean} option.singleFace - 是否只检测最大的脸
* @param {Boolean} option.rect - 是否返回人脸框位置
* @param {Boolean} option.alignment - 是否返回人脸五官的点
*/
const faceDetector = camera.setDetector(camera.DETECTOR.FACE, {
  singleFace: false,
  rect: true,
  alignment: true,
});

// 启动detector
faceDetector.start().then(() => {
  // MarkerDetector 回调数据
  faceDetector.onResult(data => {
    console.log(data);
  });
}, () => {
  // rejecjt 回调。detector 异常。
  // 在安卓上可能是SO 下载失败，SO 初始化失败等
  // 如果在iOS 上进入错误回调，请发issue。
});

/*
* 配置MarkerDetector
* @param {String} detectorName - camera.DETECTOR.FACE = 'FACE', 配置FaceDetector
* @param {Array} marker - marker id
* @param {Object} option - 选项
* @param {String} option.url - marder 训练数据地址
*/
const MarkerDetedctor = camera.setDetector(camera.DETECTOR.FACE, {
  markers: [ 'playbill', 'h' ],
  option: { url: 'http://' },
});

// 启动detector
MarkerDetector.start().then(() => {
  // MarkerDetector 回调数据
  MarkerDetector.onResult(data => {
    console.log(data);
  });
}, () => {
  // rejecjt 回调。detector 异常。
  // 在安卓上可能是SO 下载失败，SO 初始化失败等
  // 如果在iOS 上进入错误回调，请发issue。
});

```
## License
<a href="https://github.com/alibaba/webar.js/blob/master/LICENSE">MIT</a>
