import { Observe, IObserve } from './Observe/index'
import { throttle, IsPointInMatrix } from './util/index'
import rectSelection, { IPointltrb } from './rect-selection/rect-selection'

interface ICombination {
    selectArrrayObserves: Array<IObserve>
    motionObserves: Array<IObserve>
    time: number
    init(): void
    removeSelect(): void
    createDom(): void
    createObserve(): void
    addObserves(S: IObserve): void
    removeObserves(S: IObserve): void
    addMotion(M: IObserve): void
    removeMotion(M: IObserve): void
    $on(this: any, type: string, M?: IObserve): void
    downLoding(e: any): void
    downEnd(): void
}
class Combination implements ICombination {
    public selectArrrayObserves: Array<IObserve>
    public motionObserves: Array<IObserve>
    public time: number
    constructor() {
        this.time = 0
        this.selectArrrayObserves = []
        this.motionObserves = []
        this.$on = this.$on.bind(this)
        this.init();
    }
    public init() {
        const rect: any = new rectSelection((p: IPointltrb) => {
            this.removeSelect()
            this.selectArrrayObserves.forEach(observe => {
                // 矩形全包含=> 选中
                if (IsPointInMatrix(p.lt, p.rt, p.rb, p.lb, observe.point, observe.point.section)) {
                    observe.showPoint = true
                }
            })
        })
        document.addEventListener('mousemove', throttle((e: any) => {
            this.motionObserves.forEach(item => { item.move(e) })
        }, 10), false)

        document.body.onmousedown = (e) => {

            this.time = new Date().getTime()
        }
        document.body.onclick = () => {
            if ((new Date().getTime() - this.time) < 200) {
                for (let i = 0; i < this.motionObserves.length; i++) {
                    this.motionObserves[i].showPoint = false;
                    i--
                }
            }
        }
    }
    // 清空待运动实例
    public removeSelect() {
        for (let i = 0; i < this.motionObserves.length; i++) {
            this.motionObserves[i].showPoint = false;
            i--
        }
    }
    // 创建节点
    public createDom() {}
    // 创建实例 Element || String
    public createObserve(...args: Array<any>) {
        for (let i = 0; i < args.length - 1; i++) {
            if (typeof args[i] === 'string') this.addObserves(new Observe(document.querySelector(args[i]), this.$on, args[args.length - 1]))
            else this.addObserves(new Observe(args[i], this.$on, args[args.length - 1]))
        }
    }
    // 添加新实例
    public addObserves(S: IObserve) {
        this.removeSelect()
        this.selectArrrayObserves.push(S)
        S.showPoint = true
    }
    // 删除实例
    public removeObserves(S: IObserve) {
        const index = this.motionObserves.indexOf(S);
        const _index = this.selectArrrayObserves.indexOf(S);
        if (index !== -1 && _index !== -1) {
            this.motionObserves.splice(index, 1)
            this.selectArrrayObserves.splice(_index, 1)
        } else throw new Error('Observes未拥有该实例')
    }
    // 添加运动实例
    public addMotion(M: IObserve) {
        const M_Index = this.selectArrrayObserves.indexOf(M)
        const _M_index = this.motionObserves.indexOf(M)
        if (M_Index >= 0 && _M_index === -1) {
            this.motionObserves.push(M)
        }
        else throw new Error('实例添加错误')
    }
    // 运动实例移出运动列表
    public removeMotion(M: IObserve) {
        const _M_index = this.motionObserves.indexOf(M)
        this.motionObserves.splice(_M_index, 1)
    }
    // event $on
    public $on(this: any, type: string, M?: any) {
        this[type](M)
    }
    // 多选时触发 初始化实例InitMouse
    public downLoding(e: any) {
        this.motionObserves.forEach(M => {
            M.MoveType = 'move'
            M.dragging = true
            M.moveInit(1, e)
        })
    }
    // 解除时复位 实例
    public downEnd() {
        this.motionObserves.forEach(M => {
            M.MoveType = null
            M.dragging = false
        })
    }

}

let observes: any = new Combination()

observes.createObserve('#test', 'rect')
// observes.createObserve('#test', '#test1', '#test2', '#test3')

/**
 * @param { rect text  } type
 */
function createDom(html: any, type: string, option: any): void {
    const Htype: Array<string> = ['text']
    let dom = (window as any).document.createElement('div');
    if (html && typeof html === 'object') {
        html.style.height = '100%'
        html.style.width = '100%'
        dom.appendChild(html)
    }
    else if (html && typeof html === 'string') {
        dom.innerHTML = html
        dom.children[0].style.height = '100%'
        dom.children[0].style.width = '100%'
    }
    if (Htype.includes(type)) {

    }
    else {
        dom.style.height = '230px'
    }
    dom.style.left = 0 + 'px'
    dom.style.top = 0 + 'px'
    if (option) {
        dom.style.left = option.left + 'px'
        dom.style.top = option.top + 'px'
    }
    dom.style.width = '230px'
    dom.style.position = 'absolute'

    dom.className = 'newDom';
    (window as any).document.querySelector('section').appendChild(dom)
    observes.createObserve(dom, type)
}


let $ = (el: any) => document.querySelector(el)

$('.drag').addEventListener('dragstart', (e: any) => {
    e.dataTransfer.setData("Text", JSON.stringify({
        x: e.offsetX,
        y: e.offsetY,
        type: 'rect'
    }));
}, false)
$('.drags').addEventListener('dragstart', (e: any) => {
    e.dataTransfer.setData("Text", JSON.stringify({
        x: e.offsetX,
        y: e.offsetY,
        type: 'text',
        dom: '<div contenteditable="true" style="cursor: pointer;text-align:center;">text</div>'
    }));
}, false)
$('section').addEventListener('drop', (e: any) => {
    let xy = JSON.parse(e.dataTransfer.getData('Text'))
    e.preventDefault()
    let dom: any = $('.drag').cloneNode(true)
    dom.draggable = false
    createDom(
        xy.dom ? xy.dom : dom, xy.type, { left: e.clientX - 300 - xy.x, top: e.clientY - 150 - xy.y }
    )
}, false)
$('section').addEventListener('dragover', (e: any) => {
    e.preventDefault()
}, false)