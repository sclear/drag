import { getRotate, getTransferPosition, initPoint, throttle } from '../util/index'
import elmentMotion from '../motion/motion'
interface Ipoint {
    x: number
    y: number
    [key: string]: number
}
export interface IObserve {
    el: any
    type: string
    $emit(): void
    point: any
    MoveType: any
    dragging: boolean
    showPoint: boolean
    init(): void
    move(e: any): void
    initProxy(): void
    moveInit(type: number, e: any): void
    remove(): void
}
class Observe implements IObserve {
    public el: any
    public type: string
    public $emit: any
    public point: any
    public MoveType: any
    public dragging: boolean
    public showPoint: boolean
    constructor(el: any, $emit: any, type: string) {
        this.el = el;
        this.$emit = $emit
        this.el.className = ''
        this.type = type
        this.point = {
            section: {
                x: parseInt((window as any).document.querySelector('section').style.left, 10) || 0,
                y: parseInt((window as any).document.querySelector('section').style.top, 10) || 0,
                // s: 1 / document.querySelector('section').style.transform.match(/(?<=\().*(?=\))/g)[0] || 1
            }
        }
        this.MoveType = null;
        this.dragging = false;
        this.showPoint = false;
        this.initProxy()
        initPoint(this.point, this.el)
        this.init()
    }
    // 初始化当前实例状态
    public init() {
        this.el.addEventListener('mousedown', (event: any) => {
            // Emit 传递多选信息
            event.stopPropagation()
            // 当前本身选中down时 不执行
            if (this.showPoint) { }
            // 未选中时执行删除选中的
            else {
                this.$emit('removeSelect')
                setTimeout(() => {
                    this.showPoint = true
                }, 4)
            }

            this.MoveType = 'move'
            this.dragging = true;
            this.moveInit(1, event)
            this.$emit('downLoding', event)
        }, false)
        document.addEventListener('mouseup', (event) => {
            event.stopPropagation()
            this.dragging = false;
            this.$emit('downEnd')
            // const { left, top, width, height } = this.el.style;
            const { left, top, width, height } = getComputedStyle(this.el);
            let poins = {
                x: parseInt(width, 10) / 2 + parseInt(left, 10),
                y: parseInt(height, 10) / 2 + parseInt(top, 10)
            }
            getTransferPosition(parseInt(left, 10), parseInt(top, 10), parseInt(width, 10), parseInt(height, 10), this.point.angle, poins, this.point)
        }, false)
        function create(el: any, className: string) {
            let newEl = document.createElement('div');
            newEl.className = className;
            newEl.draggable = true
            el.appendChild(newEl)
        }

        if (['text'].includes(this.type)) {
            create(this.el, 'left')
            create(this.el, 'right')
            create(this.el, 'rotate')
        }
        else {
            create(this.el, 'left')
            create(this.el, 'right')
            create(this.el, 'top')
            create(this.el, 'rotate')
            create(this.el, 'bottom')
            create(this.el, 'topLeft')
            create(this.el, 'topRight')
            create(this.el, 'bottomLeft')
            create(this.el, 'bottomRight');
        }
        [...this.el.children].forEach(item => {
            item.onmousedown = (event: any) => {
                if (['left', 'right', 'top', 'rotate', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(item.className)) {
                    this.MoveType = item.className
                    event.stopPropagation()
                    event.preventDefault()
                }
                this.dragging = true;
                this.moveInit(1, event)
                this.moveInit(item.className === 'rotate' ? 0 : 1, event)
            }
        })
    }
    // 函数节流后移动函数
    public move(e: any) {
        if (this.dragging) {
            elmentMotion.update(this.MoveType, e, this.el, this.point)
        }
    }
    // 修改Observe状态
    public initProxy() {
        let a: boolean = this.showPoint
        Object.defineProperty(this, 'showPoint', {
            get() {
                return a
            },
            set(v) {
                if (v) {
                    this.$emit('addMotion', this)
                    this.el.className = 'dialog'
                }
                else {
                    this.$emit('removeMotion', this)
                    this.el.className = ''
                }
                a = v
            }
        })
    }

    // Move开始时候的初始化
    public moveInit(type: number, e: any) {
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
    public remove() {
        this.el.parentNode.removeChild(this.el)
    }
}
export { Observe }


