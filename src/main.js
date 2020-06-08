import { Observe } from './Observe/index'
import { throttle } from './util/index'
import rectSelection from './util/rect-selection'

document.body.onclick = ()=> {
    Observes.forEach(item=> {
        item.showPoint = false
    })
}
let $ = el => document.querySelector(el)
let Observes = []

function createObserve(...args) {
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] === 'string') Observes.push(new Observe(document.querySelector(args[i])))
        else Observes.push(new Observe(args[i]))
    }
}
createObserve('#test', '#test1')
document.addEventListener('mousemove', throttle((e) => {
    Observes.forEach(item => {
        item.move(e)
    })
}), false)



new rectSelection()



$('.drag').addEventListener('dragstart', e => {
    e.dataTransfer.setData("Text", JSON.stringify({
        x: e.offsetX,
        y: e.offsetY
    }));
    console.log(e)
}, false)
$('section').addEventListener('drop', e => {
    // console.log(e.dataTransfer.getData('Text'))
    let xy = JSON.parse(e.dataTransfer.getData('Text'))
    console.log(xy)
    e.preventDefault()
    let dom = document.createElement('div')
    dom.style.height = '100px'
    dom.style.width = '100px'
    dom.style.background = 'red'
    dom.style.position = 'absolute'
    dom.style.left = (e.clientX - 300 - xy.x) + 'px'
    dom.style.top = (e.clientY - 150 - xy.y) + 'px'
    dom.className = 'dialog'
    $('section').appendChild(dom)
    createObserve(dom)
    console.log(e)
}, false)
$('section').addEventListener('dragover', e => {
    e.preventDefault()
    // console.log(e)
}, false)


// function allowDrop(e) {
//     event.preventDefault()
//     // console.log('移动', e)
// }
// function drop(e) {
//     e.preventDefault()
//     console.log('放置', e)
// }
// function drag(ev) {
//     console.log(ev)
//     // ev.dataTransfer.setData("Text", ev.target.id);
// }

// document.onkeydown = function (event) {
//     var e = event || window.event || arguments.callee.caller.arguments[0];
//     // console.log(e.keyCode)
//     if(e.keyCode === 46 ) {
//         Observes.forEach( (item, i)=> {
//             if(item.el === document.querySelector('#test')) {
//                 console.log(item.el)
//                 item.remove()
//                 Observes.splice(i,1)
//                 console.log(Observes)

//             }
//         })
//     }
//     // e.preventDefault()
// }