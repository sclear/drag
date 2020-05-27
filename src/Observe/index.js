import { getRotate, getTransferPosition, initPoint } from '../util/index'
import elmentMotion from '../motion/motion.js'

class Observe {
    constructor(el) {
        this.el = el;
        this.point = {}
        this.MoveType = null;
        this.dragging = false;
        initPoint(this.point, this.el)
        this.init()
    }
    init() {
        this.el.addEventListener('mousedown', (event)=> {
            this.MoveType = 'move'
            this.dragging = true;
            this.moveInit(1, event, 1)
        }, false)
        document.addEventListener('mousemove', (e)=> {
            if (this.dragging) {
                elmentMotion.update(this.MoveType, e, this.el, this.point)
            }
        }, false)
        document.addEventListener('mouseup', (event)=> {
            this.dragging = false;
            getTransferPosition(this.point.left, this.point.top, this.point.width, this.point.height, this.point.angle, this.point.centerPos, this.point)
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
        [...this.el.children].forEach(item=> {
                item.onmousedown = (event)=>  {
                this.MoveType = item.className
                event.stopPropagation()
                event.preventDefault()
                this.dragging = true;
                this.moveInit(1, event, 1)
            }
        })
    }
    // Move初始化
    moveInit(type, e) {
        this.point.mouseInit = {
            x: Math.floor(e.clientX),
            y: Math.floor(e.clientY)
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
}
export { Observe }