import { getRotate, getTransferPosition, initPoint, throttle } from '../util/index'
import elmentMotion from '../motion/motion.js'
class Observe {
    constructor(el) {
        this.el = el;
        this.el.className = ''
        this.point = {
            section: {
                x: parseInt(document.querySelector('section').style.left) || 0,
                y: parseInt(document.querySelector('section').style.top) || 0,
                s: 1 / document.querySelector('section').style.transform.match(/(?<=\().*(?=\))/g)[0] || 1
            }
        }
        this.MoveType = null;
        this.dragging = false;
        this.showPoint = false;
        this.initProxy()
        initPoint(this.point, this.el)
        this.init()
    }
    move(e) {
        if (this.dragging) {
            elmentMotion.update(this.MoveType, e, this.el, this.point)
        }
    }
    initProxy() {
        this.el.addEventListener('click', e => {
            setTimeout(()=> {
                this.showPoint = true
            },4)
        }, false)
        let a = this.showPoint
        Object.defineProperty(this, 'showPoint', {
            get() {
                return a
            },
            set(v) {
                if (v) this.el.className = 'dialog'
                else this.el.className = ''
                a = v
            }
        })
    }
    init() {
        this.el.addEventListener('mousedown', (event) => {
            this.MoveType = 'move'
            this.dragging = true;
            this.moveInit(1, event, 1)
        }, false)
        document.addEventListener('mouseup', (event) => {
            this.dragging = false;
            const { left, top, width, height } = this.el.style;
            let poins = {
                x: parseInt(width) / 2 + parseInt(left),
                y: parseInt(height) / 2 + parseInt(top)
            }
            getTransferPosition(parseInt(left), parseInt(top), parseInt(width), parseInt(height), this.point.angle, poins, this.point)
        }, false)
        function create(el, className) {
            let newEl = document.createElement('div');
            newEl.className = className;
            newEl.draggable = true
            el.appendChild(newEl)
        }
        create(this.el, 'left')
        create(this.el, 'right')
        create(this.el, 'top')
        create(this.el, 'rotate')
        create(this.el, 'bottom')
        create(this.el, 'topLeft')
        create(this.el, 'topRight')
        create(this.el, 'bottomLeft')
        create(this.el, 'bottomRight');
        [...this.el.children].forEach(item => {
            item.onmousedown = (event) => {
                event.stopPropagation()
                this.MoveType = item.className
                event.stopPropagation()
                event.preventDefault()
                this.dragging = true;
                this.moveInit(1, event, 1)
                this.moveInit(item.className === 'rotate' ? 0 : 1, event, 1)
            }
        })
    }
    // Move初始化
    moveInit(type, e) {
        this.point.mouseInit = {
            x: (Math.floor(e.clientX) - this.point.section.x),
            y: (Math.floor(e.clientY) - this.point.section.y)
        }
        this.point.scale = this.el.offsetWidth / this.el.offsetHeight
        this.point.initAngle = this.point.angle
        this.point.initRightBottomPoint = this.point.rightBottomPoint
        this.point.initRightTopPoint = this.point.rightTopPoint
        this.point.initLeftTopPoint = this.point.leftTopPoint
        this.point.initLeftBottomPoint = this.point.leftBottomPoint
        this.point.initLeftMiddlePoint = this.point.leftMiddlePoint
        this.point.initRightMiddlePoint = this.point.rightMiddlePoint
        this.point.initTopMiddlePoint = this.point.topMiddlePoint
        this.point.initBottomMiddlePoint = this.point.bottomMiddlePoint
        this.point.initCenterPos = this.point.centerPos
        this.point.initPosition = {
            x: this.point.left,
            y: this.point.top
        }
        if (type === 0) {
            this.point.preRadian = Math.atan2(this.point.mouseInit.y - this.point.centerPos.y, this.point.mouseInit.x - this.point.centerPos.x)
        }
    }
    remove() {
        this.el.parentNode.removeChild(this.el)
    }
}
export { Observe }