

function isIOS() {
  return /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent);
}

class PointsRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  filter(data) {
    if (!data.alignment) {
      return;
    }
    const { alignment } = data;
    let pointArray = null;
    if (Array.isArray(alignment)) {
      pointArray = alignment;
    } else {
      const key = Object.keys(alignment)[0];
      pointArray = alignment[key];
    }

    console.log(pointArray);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    pointArray.map((point) => {
      this.ctx.beginPath();
      this.ctx.lineWidth = '3';
      this.ctx.strokeStyle = 'red';
      if (pointArray.length === 5) {
        this.ctx.rect(this.canvas.width - point.x / 2, point.y / 2, 3, 3);
      } else if (isIOS()) {
        this.ctx.rect(point.y / 2, point.x / 2, 2, 2);
      } else {
        this.ctx.rect(this.canvas.width - point.y / 2, this.canvas.height - point.x / 2, 2, 2);
      }

      this.ctx.stroke();
      return true;
    });
  }

  draw(data) {
    this.filter(data);
  }
}


export default PointsRenderer;
