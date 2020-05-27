import { setStyle } from './setstyle'
import { getRotatedPoint, getRotate } from './../util/index'

class Motion {
    constructor() {
        this.MotionType = {}
    }
    addMotion(type, fn) {
        this.MotionType[type] = fn
    }
    removeMotion(type) {
        delete this.MotionType[type]
    }
    update(type, e, dragObj, point) {
        this.MotionType[type].call(this, e, dragObj, point)
    }
}

let elmentMotion = new Motion()
elmentMotion.addMotion('move', function(e, dragObj, point) {
    let dis = {
        x: Math.floor(e.clientX - point.mouseInit.x),
        y: Math.floor(e.clientY - point.mouseInit.y)
    }
    point.left = dis.x + point.initPosition.x;
    point.top = dis.y + point.initPosition.y;
    setStyle({
        left: `${point.left}px`,
        top: `${point.top}px`
    }, dragObj)
    point.centerPos = {
        x: point.initCenterPos.x + dis.x,
        y: point.initCenterPos.y + dis.y
    }
})
elmentMotion.addMotion('top', function(e, dragObj, point) {
    // 求旋转图像Tm
    let rotateCurrentPos = getRotatedPoint({
        x: e.clientX,
        y: e.clientY
    }, point.bottomMiddlePoint, -point.initAngle)
    // 图像Tm
    let rotatedTopMiddlePoint = {
        x: point.bottomMiddlePoint.x,
        y: rotateCurrentPos.y
    }
    let newHeight = point.bottomMiddlePoint.y - rotatedTopMiddlePoint.y;
    if (newHeight <= 42) {
        newHeight = 42
        rotatedTopMiddlePoint.y = point.bottomMiddlePoint.y - 42
    }
    point.topMiddlePoint = getRotatedPoint(rotatedTopMiddlePoint, point.bottomMiddlePoint, point.initAngle)
    point.centerPos = {
        x: (point.topMiddlePoint.x + point.bottomMiddlePoint.x) / 2,
        y: (point.topMiddlePoint.y + point.bottomMiddlePoint.y) / 2
    }
    point.left = point.centerPos.x - dragObj.offsetWidth / 2
    point.top = point.centerPos.y - newHeight / 2
    point.height = newHeight
    setStyle({
        left: `${point.left}px`,
        height: `${point.height}px`,
        top: `${point.top}px`
    }, dragObj)
})
elmentMotion.addMotion('bottom', function(e, dragObj, point) {
    // 求旋转图像Tm
    let rotateCurrentPos = getRotatedPoint({
        x: e.clientX,
        y: e.clientY
    }, point.topMiddlePoint, -point.initAngle)
    // 图像Tm
    let rotatedBottomMiddlePoint = {
        x: point.topMiddlePoint.x,
        y: rotateCurrentPos.y
    }
    let newHeight = rotatedBottomMiddlePoint.y - point.topMiddlePoint.y;
    if (newHeight <= 42) {
        newHeight = 42
        rotatedBottomMiddlePoint.y = point.topMiddlePoint.y + 42
    }
    point.bottomMiddlePoint = getRotatedPoint(rotatedBottomMiddlePoint, point.topMiddlePoint, point.initAngle)
    point.centerPos = {
        x: (point.bottomMiddlePoint.x + point.topMiddlePoint.x) / 2,
        y: (point.bottomMiddlePoint.y + point.topMiddlePoint.y) / 2
    }
    point.left = point.centerPos.x - dragObj.offsetWidth / 2
    point.top = point.centerPos.y - newHeight / 2
    point.height = newHeight
    setStyle({
        left: `${point.left}px`,
        height: `${point.height}px`,
        top: `${point.top}px`
    }, dragObj)
})
elmentMotion.addMotion('left', function(e, dragObj, point) {
    // 求旋转图像Tm
    let rotateCurrentPos = getRotatedPoint({
        x: e.clientX,
        y: e.clientY
    }, point.rightMiddlePoint, -point.initAngle)
    // 图像Tm
    let rotatedLeftMiddlePonit = {
        x: rotateCurrentPos.x,
        y: point.rightMiddlePoint.y
    }
    let newWidth = point.rightMiddlePoint.x - rotatedLeftMiddlePonit.x;
    if (newWidth <= 42) {
        newWidth = 42
        rotatedLeftMiddlePonit.x = point.rightMiddlePoint.x - 42
    }
    point.leftMiddlePoint = getRotatedPoint(rotatedLeftMiddlePonit, point.rightMiddlePoint, point.initAngle)
    point.centerPos = {
        x: Math.floor((point.leftMiddlePoint.x + point.rightMiddlePoint.x) / 2),
        y: Math.floor((point.leftMiddlePoint.y + point.rightMiddlePoint.y) / 2)
    }
    point.left = point.centerPos.x - newWidth / 2
    point.top = point.centerPos.y - dragObj.offsetHeight / 2
    point.width = newWidth
    setStyle({
        left: `${point.left}px`,
        width: `${point.width}px`,
        top: `${point.top}px`
    }, dragObj)
})
elmentMotion.addMotion('right', function(e, dragObj, point) {
    // 求旋转图像Tm
    let rotateCurrentPos = getRotatedPoint({
        x: e.clientX,
        y: e.clientY
    }, point.leftMiddlePoint, -point.initAngle)
    // 图像Tm
    let rotatedRightMiddlePoint = {
        x: rotateCurrentPos.x,
        y: point.leftMiddlePoint.y
    }
    let newWidth = rotatedRightMiddlePoint.x - point.leftMiddlePoint.x;
    if (newWidth <= 42) {
        newWidth = 42
        rotatedRightMiddlePoint.x = point.leftMiddlePoint.x + 42
    }
    point.rightMiddlePoint = getRotatedPoint(rotatedRightMiddlePoint, point.leftMiddlePoint, point.initAngle)
    point.centerPos = {
        x: Math.floor((point.leftMiddlePoint.x + point.rightMiddlePoint.x) / 2),
        y: Math.floor((point.leftMiddlePoint.y + point.rightMiddlePoint.y) / 2)
    }
    point.left = point.centerPos.x - newWidth / 2
    point.top = point.centerPos.y - dragObj.offsetHeight / 2
    point.width = newWidth
    setStyle({
        left: `${point.left}px`,
        width: `${point.width}px`,
        top: `${point.top}px`
    }, dragObj)
})
elmentMotion.addMotion('rotate', function(e, dragObj, point) {
    point.rotateCurrent = {
        x: Math.floor(e.clientX),
        y: Math.floor(e.clientY)
    }
    point.curRadian = Math.atan2(point.rotateCurrent.y - point.centerPos.y, point.rotateCurrent.x - point.centerPos.x)
    point.tranformRadian = point.curRadian - point.preRadian
    point.angle = getRotate(dragObj) + Math.round(point.tranformRadian * 180 / Math.PI)
    setStyle({
        transform: `rotate(${point.angle}deg)`
    }, dragObj)
    point.preRadian = point.curRadian
    // 重新计算旋转后四个点的坐标变化
    let disAngle = point.angle - point.initAngle
    point.rightBottomPoint = getRotatedPoint(point.initRightBottomPoint, point.centerPos, disAngle)
    point.rightTopPoint = getRotatedPoint(point.initRightTopPoint, point.centerPos, disAngle)
    point.leftTopPoint = getRotatedPoint(point.initLeftTopPoint, point.centerPos, disAngle)
    point.leftBottomPoint = getRotatedPoint(point.initLeftBottomPoint, point.centerPos, disAngle)
    point.leftMiddlePoint = getRotatedPoint(point.initLeftMiddlePoint, point.centerPos, disAngle)
    point.rightMiddlePoint = getRotatedPoint(point.initRightMiddlePoint, point.centerPos, disAngle)
    point.topMiddlePoint = getRotatedPoint(point.initTopMiddlePoint, point.centerPos, disAngle)
    point.bottomMiddlePoint = getRotatedPoint(point.initBottomMiddlePoint, point.centerPos, disAngle)
})
elmentMotion.addMotion('topLeft', function(e, dragObj, point) {
    point.centerPos = {
        x: Math.floor((e.clientX + point.rightBottomPoint.x) / 2),
        y: Math.floor((e.clientY + point.rightMiddlePoint.y) / 2)
    }
    // 计算旋转为水平角度的两点坐标
    let newLeftTopPoint = getRotatedPoint({
        x: e.clientX,
        y: e.clientY
    }, point.centerPos, -point.initAngle)
    let newRightBottomPoint = getRotatedPoint(point.rightBottomPoint, point.centerPos, -point.initAngle)
    let newWidth = newRightBottomPoint.x - newLeftTopPoint.x
    let newHeight = newRightBottomPoint.y - newLeftTopPoint.y
    // if (point.isScale) {
    if (newWidth / newHeight > point.scale) {
        newLeftTopPoint.x = newLeftTopPoint.x + Math.abs(newWidth - newHeight * point.scale)
        newWidth = newHeight * point.scale
    } else {
        newLeftTopPoint.y = newLeftTopPoint.y + Math.abs(newHeight - newWidth / point.scale)
        newHeight = newWidth / point.scale
    }
    // 计算出左上角等比角度变换后水平坐标后，再计算旋转后的角度
    var rotateLeftTopPoint = getRotatedPoint(newLeftTopPoint, point.centerPos, point.initAngle)
    point.centerPos = {
        x: Math.floor((rotateLeftTopPoint.x + point.rightBottomPoint.x) / 2),
        y: Math.floor((rotateLeftTopPoint.y + point.rightBottomPoint.y) / 2)
    }
    newLeftTopPoint = getRotatedPoint(rotateLeftTopPoint, point.centerPos, -point.initAngle)
    newRightBottomPoint = getRotatedPoint(point.rightBottomPoint, point.centerPos, -point.initAngle)
    newWidth = newRightBottomPoint.x - newLeftTopPoint.x
    newHeight = newRightBottomPoint.y - newLeftTopPoint.y
    if (newWidth <= 42) {
        newWidth = 42
        newHeight = Math.floor(newWidth / point.scale)
        newLeftTopPoint.x = newRightBottomPoint.x - newWidth
        newLeftTopPoint.y = newRightBottomPoint.y - newHeight
    }
    if (newHeight <= 42) {
        newHeight = 42
        newWidth = Math.floor(newHeight * point.scale)
        newLeftTopPoint.y = newRightBottomPoint.y - newHeight
        newLeftTopPoint.x = newRightBottomPoint.x - newWidth
    }
    if (newHeight > 42 && newWidth > 42) {
        point.left = newLeftTopPoint.x
        point.top = newLeftTopPoint.y
        point.width = newWidth
        point.height = newHeight
        setStyle({
            left: `${point.left}px`,
            top: `${point.top}px`,
            width: `${point.width}px`,
            height: `${point.height}px`
        }, dragObj)
    }
})
elmentMotion.addMotion('topRight', function(e, dragObj, point) {
    point.centerPos = {
        x: Math.floor((e.clientX + point.leftBottomPoint.x) / 2),
        y: Math.floor((e.clientY + point.leftBottomPoint.y) / 2)
    }
    let newRightTopPoint = getRotatedPoint({
        x: e.clientX,
        y: e.clientY
    }, point.centerPos, -point.initAngle)
    let newLeftBottomPoint = getRotatedPoint(point.leftBottomPoint, point.centerPos, -point.initAngle)
    let newWidth = newRightTopPoint.x - newLeftBottomPoint.x
    let newHeight = newLeftBottomPoint.y - newRightTopPoint.y
    // if (point.isScale) {
    if (newWidth / newHeight > point.scale) {
        newRightTopPoint.x = newRightTopPoint.x - Math.abs(newWidth - newHeight * point.scale)
        newWidth = newHeight * point.scale
    } else {
        newRightTopPoint.y = newRightTopPoint.y + Math.abs(newHeight - newWidth / point.scale)
        newHeight = newWidth / point.scale
    }
    let rotatedRightTopPoint = getRotatedPoint(newRightTopPoint, point.centerPos, point.initAngle)
    point.centerPos = {
        x: Math.floor((rotatedRightTopPoint.x + point.leftBottomPoint.x) / 2),
        y: Math.floor((rotatedRightTopPoint.y + point.leftBottomPoint.y) / 2)
    }
    newLeftBottomPoint = getRotatedPoint(point.leftBottomPoint, point.centerPos, -point.initAngle)
    newRightTopPoint = getRotatedPoint(rotatedRightTopPoint, point.centerPos, -point.initAngle)
    newWidth = newRightTopPoint.x - newLeftBottomPoint.x
    newHeight = newLeftBottomPoint.y - newRightTopPoint.y
    // }
    if (newWidth <= 42) {
        newWidth = 42
        newHeight = Math.floor(newWidth / point.scale)
        newRightTopPoint = {
            x: newLeftBottomPoint.x + newWidth,
            y: newLeftBottomPoint.y - newHeight
        }
    }
    if (newHeight <= 42) {
        newHeight = 42
        newWidth = Math.floor(newHeight * point.scale)
        newRightTopPoint = {
            x: newLeftBottomPoint.x + newWidth,
            y: newLeftBottomPoint.y - newHeight
        }
    }

    if (newWidth > 42 && newHeight > 42) {
        point.left = newLeftBottomPoint.x
        point.top = newRightTopPoint.y
        point.width = newWidth
        point.height = newHeight
        setStyle({
            left: `${point.left}px`,
            top: `${point.top}px`,
            width: `${point.width}px`,
            height: `${point.height}px`

        }, dragObj)
    }
})
elmentMotion.addMotion('bottomLeft', function(e, dragObj, point) {
    point.centerPos = {
        x: Math.floor((e.clientX + point.rightTopPoint.x) / 2),
        y: Math.floor((e.clientY + point.rightTopPoint.y) / 2)
    }
    let newLeftBottomPoint = getRotatedPoint({
        x: e.clientX,
        y: e.clientY
    }, point.centerPos, -point.initAngle)
    let newRightTopPoint = getRotatedPoint(point.rightTopPoint, point.centerPos, -point.initAngle)
    let newWidth = newRightTopPoint.x - newLeftBottomPoint.x
    let newHeight = newLeftBottomPoint.y - newRightTopPoint.y
    // if (point.isScale) {
    if (newWidth / newHeight > point.scale) {
        newLeftBottomPoint.x = newLeftBottomPoint.x + Math.abs(newWidth - newHeight * point.scale)
        newWidth = newHeight * point.scale
    } else {
        newLeftBottomPoint.y = newLeftBottomPoint.y - Math.abs(newHeight - newWidth / point.scale)
        newHeight = newWidth / point.scale
    }
    var rotatedLeftBottomPoint = getRotatedPoint(newLeftBottomPoint, point.centerPos, point.initAngle)
    point.centerPos = {
        x: Math.floor((rotatedLeftBottomPoint.x + point.rightTopPoint.x) / 2),
        y: Math.floor((rotatedLeftBottomPoint.y + point.rightTopPoint.y) / 2)
    }
    newLeftBottomPoint = getRotatedPoint(rotatedLeftBottomPoint, point.centerPos, -point.initAngle)
    newRightTopPoint = getRotatedPoint(point.rightTopPoint, point.centerPos, -point.initAngle)
    newWidth = newRightTopPoint.x - newLeftBottomPoint.x
    newHeight = newLeftBottomPoint.y - newRightTopPoint.y
    // }
    if (newHeight <= 42) {
        newHeight = 42
        newWidth = Math.floor(newHeight * point.scale)
        newLeftBottomPoint = {
            x: newRightTopPoint.x - newWidth,
            y: newRightTopPoint.y + newHeight
        }
    }
    if (newWidth <= 42) {
        newWidth = 42
        newHeight = Math.floor(newWidth / point.scale)
        newLeftBottomPoint = {
            x: newRightTopPoint.x - newWidth,
            y: newRightTopPoint.y + newHeight
        }
    }
    if (newHeight > 42 && newHeight > 42) {
        point.left = newLeftBottomPoint.x
        point.top = newRightTopPoint.y
        point.width = newWidth
        point.height = newHeight
        setStyle({
            left: `${point.left}px`,
            top: `${point.top}px`,
            width: `${point.width}px`,
            height: `${point.height}px`,
        }, dragObj)
    }
})
elmentMotion.addMotion('bottomRight', function(e, dragObj, point) {
    point.centerPos = {
        x: Math.floor((e.clientX + point.leftTopPoint.x) / 2),
        y: Math.floor((e.clientY + point.leftTopPoint.y) / 2)
    }
    let newRightBottomPoint = getRotatedPoint({
        x: e.clientX,
        y: e.clientY
    }, point.centerPos, -point.initAngle)
    let newLeftTopPoint = getRotatedPoint(point.leftTopPoint, point.centerPos, -point.initAngle)
    let newWidth = newRightBottomPoint.x - newLeftTopPoint.x
    let newHeight = newRightBottomPoint.y - newLeftTopPoint.y
    if (newWidth / newHeight > point.scale) {
        newRightBottomPoint.x = newRightBottomPoint.x - Math.abs(newWidth - newHeight * point.scale)
        newWidth = newHeight * point.scale
    } else {
        newRightBottomPoint.y = newRightBottomPoint.y - Math.abs(newHeight - newWidth / point.scale)
        newHeight = newWidth / point.scale
    }
    let rotatedRightBottomPoint = getRotatedPoint(newRightBottomPoint, point.centerPos, point.initAngle)
    point.centerPos = {
        x: Math.floor((rotatedRightBottomPoint.x + point.leftTopPoint.x) / 2),
        y: Math.floor((rotatedRightBottomPoint.y + point.leftTopPoint.y) / 2)
    }
    newLeftTopPoint = getRotatedPoint(point.leftTopPoint, point.centerPos, -point.initAngle)
    newRightBottomPoint = getRotatedPoint(rotatedRightBottomPoint, point.centerPos, -point.initAngle)
    newWidth = newRightBottomPoint.x - newLeftTopPoint.x
    newHeight = newRightBottomPoint.y - newLeftTopPoint.y
    if (newWidth <= 42) {
        newWidth = 42
        newHeight = Math.floor(newWidth / point.scale)
        newRightBottomPoint = {
            x: newLeftTopPoint.x + newWidth,
            y: newLeftTopPoint.y + newHeight
        }
    }
    if (newHeight <= 42) {
        newHeight = 42
        newWidth = Math.floor(newHeight * point.scale)
        newRightBottomPoint = {
            x: newLeftTopPoint.x + newWidth,
            y: newLeftTopPoint.y + newHeight
        }
    }
    if (newWidth > 42 && newHeight > 42) {
        point.left = newLeftTopPoint.x
        point.top = newLeftTopPoint.y
        point.width = newWidth
        point.height = newHeight
        setStyle({
            left: `${point.left}px`,
            top: `${point.top}px`,
            width: `${point.width}px`,
            height: `${point.height}px`
        }, dragObj)
    }
})

export default elmentMotion