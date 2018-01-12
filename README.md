
# WebAR.js

### JS framework for WebAR.



## 概念

WebAR.js 包含几个模块：

- WebAR  WebAR.js入口，获取Camera
- Camera - 管理摄像头
- DisplayTarget - 绘制相关
- Detector - 识别检测算法



## Talk less, just show the code :

```javascript
import WebAR from 'WebAR';

/** 
* 从WebAR 获取配置好的camera对象
* @param {Object} option - 功能选项
* @param {String} option.facing - 摄像头方向，'FRONT' 或 'BACK'，可用camera.CAMERA_POSITION.FRONT/BACK
* @param {String} option.quality - 摄像头分辨率，内置3个级别：LOW/NORMAL/HIGH，在iOS 下对应分辨率为：[480 x 640], [720 x 1280], [1080 x 1920]，安卓没有准确的数值，根据设备分辨率列表取最近值；

*/
const camera = await WebAR.getWebCameraAsync({
   facing: 'FRONT',
   quality: 'LOW',
});

// 异步打开摄像机
await camera.openAsync();

const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl');
/*
* 配置并产生 displayTarget
* @param {Object} gl - canvas webgl context
* @param {Object} option - 配置
* @param {String} option.cameraSize - 贴图的适应方式，提供三个选项：'COVER/CONTAIN/STRETCH'
* @example
* option.cameraSize：'COVER' - 等比覆盖绘制区域，多余裁剪，默认值； 
* option.cameraSize: 'STRETCH' - 拉伸铺满；
* 
* @param {Object} stPosition - 渲染区域在canvas的位置，坐标轴和canvas2d一致，如下图所示。
* 如果不填stPosition，默认铺满
* ------------------→ x  (canvas.width, 0)
* |(0， 0)
* |
* |
* ↓ y  (0, canvas.height)
*/
const displayTarget = camera.createDisplayTarget(gl, { 
  cameraSize: 'COVER',
  stPosition: {
    x: 50,
    y: 10,
    width: 400,
    height: 500,
  }
});

// 绘制
setInterval(() => {
   displayTarget.draw();
}, 30);

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
faceDetector.start();

// Detector 回调数据
faceDetector.onResult(data => {
  console.log(data);
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
  option: { url: 'http://url/to/marker' },
});

// 启动detector
MarkerDetector.start();

// Detector 回调数据
MarkerDetector.onResult(data => {
  console.log(data);
});
```


