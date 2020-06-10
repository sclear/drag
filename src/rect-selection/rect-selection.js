import { throttle } from '../util/index'
class rectSelection {
  constructor(cb = null) {
    this.cb = cb;
    this.select = false;
    this.downX = 0;
    this.downY = 0;
    this.mouseMoveX = 0;
    this.mouseMoveY = 0;
    this.el = null
    this.createDom()
    this.init()
    this.time = null
  }
  createDom() {
    const rect = document.createElement('div')
    rect.style.position = 'absolute';
    rect.style.border = '1px dashed black';
    rect.style.width = 0;
    rect.style.height = 0;
    rect.style.visibility = 'hidden';
    rect.style.zIndex = 1000;
    document.body.appendChild(rect)
    this.el = rect
  }
  init() {
    document.body.addEventListener('mousedown', event => {
      // event.stopPropagation()
      // 鼠标按下时才允许处理鼠标的移动事件
      if (event.target === document.body || event.target === document.querySelector('#section')) {
        this.time = new Date().getTime()
        this.select = true;
        // 取得鼠标按下时的坐标位置
        this.downX = event.clientX;
        this.downY = event.clientY;
        //设置你要画的矩形框的起点位置
        this.el.style.left = this.downX;
        this.el.style.top = this.downY;
      }

    }, false)
    document.body.addEventListener('mouseup', event => {
      if ((new Date().getTime() - this.time) > 200 && this.time !== null) {
        this.calcPoint(event)
        this.time = null
      } else {
        this.time = null
      }
      this.select = false;
      this.el.style.visibility = 'hidden';
    }, false)
    document.body.addEventListener('mouseleave', event => {
      event.stopPropagation()
      this.select = false;
      this.el.style.visibility = 'hidden';
    }, false)
    document.body.addEventListener('mousemove', throttle(event => {
      event.stopPropagation()
      // 取得鼠标移动时的坐标位置
      this.mouseMoveX = event.clientX;
      this.mouseMoveY = event.clientY;
      // 设置拉框的大小    
      if (this.select) {
        this.el.style.width = Math.abs(this.mouseMoveX - this.downX) + 'px';
        this.el.style.height = Math.abs(this.mouseMoveY - this.downY) + 'px';
        this.el.style.visibility = 'visible';
        if (this.mouseMoveX < this.downX && this.mouseMoveY < this.downY) {
          this.el.style.left = this.mouseMoveX + 'px';
          this.el.style.top = this.mouseMoveY + 'px';
        }
        if (this.mouseMoveX > this.downX && this.mouseMoveY < this.downY) {
          this.el.style.left = this.downX + 'px';
          this.el.style.top = this.mouseMoveY + 'px';
        }
        if (this.mouseMoveX < this.downX && this.mouseMoveY > this.downY) {
          this.el.style.left = this.mouseMoveX + 'px';
          this.el.style.top = this.downY + 'px';
        }
        if (this.mouseMoveX > this.downX && this.mouseMoveY > this.downY) {
          this.el.style.left = this.downX + 'px';
          this.el.style.top = this.downY + 'px';
        }

      }
      // window.event.cancelBubble = true;
      // window.event.returnValue = false;
    }), false)
  }
  calcPoint(e) {
    const left = parseInt(this.el.style.left)
    const top = parseInt(this.el.style.top)
    const height = parseInt(this.el.style.height)
    const width = parseInt(this.el.style.width)
    const point = {
      lt: {
        x: left,
        y: top
      },
      rt: {
        x: left + width,
        y: top
      },
      rb: {
        x: left + width,
        y: top + height
      },
      lb: {
        x: left,
        y: top + height
      }
    }
    this.cb && this.cb(point)
  }
  destory() {
    document.body.removeEventListener('mouseup', () => { })
    document.body.removeEventListener('mousedown', () => { })
    document.body.removeEventListener('mousleave', () => { })
    document.body.removeEventListener('mousemove', () => { })
  }

}
export default rectSelection