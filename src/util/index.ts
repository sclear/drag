interface Ipoint {
    x: number,
    y: number
}
type IRotatedPoint = (curPos: Ipoint, centerPos: Ipoint, angle: number) => Ipoint

type IRotate = (target: any) => number

type ITransferPosition = (left: number, top: number, width: number, height: number, angle: number, center: Ipoint, point: any) => void

type IinitPoint = (point: any, targetObj: any) => void

type Ithrottle = (fn: any, wait: number) => any
type IIsRectIn = (a: Ipoint, b: Ipoint, c: Ipoint, d: Ipoint, p: Ipoint, notXY: Ipoint) => boolean

export type IIsPointInMatrix = (a: Ipoint, b: Ipoint, c: Ipoint, d: Ipoint, p: any, notXY: Ipoint) => boolean
export const getRotatedPoint: IRotatedPoint = function (curPos, centerPos, angle) {
    return {
        x: Math.floor((curPos.x - centerPos.x) * Math.cos(Math.PI / 180 * angle) - (curPos.y - centerPos.y) * Math.sin(Math.PI / 180 * angle) + centerPos.x),
        y: Math.floor((curPos.x - centerPos.x) * Math.sin(Math.PI / 180 * angle) + (curPos.y - centerPos.y) * Math.cos(Math.PI / 180 * angle) + centerPos.y)
    }
}

export const getRotate: IRotate = function (target) {
    const st = window.getComputedStyle(target, null);
    const tr = st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform") || "FAIL";
    if (tr !== 'none') {
        const values = tr.split('(')[1].split(')')[0].split(',');
        const a: number = Number(values[0]);
        const b: number = Number(values[1]);
        const c: number = Number(values[2]);
        const d: number = Number(values[3]);
        const scale: number = Math.sqrt(a * a + b * b);
        const sin: number = b / scale;
        let angle: number = Math.round(Math.atan2(b, a) * (180 / Math.PI))
        if (angle < 0) {
            angle = 360 + angle
        }
        return angle
    } else {
        return 0
    }
}

/**
 * @param { 角度 } angle
 * @param { 中点坐标 } center
 * @param { 实例点阵 } point
 */
export const getTransferPosition: ITransferPosition = function (left, top, width, height, angle, center, point) {
    const a1: Ipoint = {
        x: left,
        y: top
    }
    const a2: Ipoint = {
        x: left,
        y: top + height
    }
    const a3: Ipoint = {
        x: left + width,
        y: top
    }
    const a4: Ipoint = {
        x: left + width,
        y: top + height
    }
    const a5: Ipoint = {
        x: left,
        y: top + height / 2
    }
    const a6: Ipoint = {
        x: left + width,
        y: top + height / 2
    }
    const a7: Ipoint = {
        x: left + width / 2,
        y: top
    }
    const a8: Ipoint = {
        x: left + width / 2,
        y: top + height
    }
    point.leftTopPoint = getRotatedPoint(a1, center, angle)
    point.leftBottomPoint = getRotatedPoint(a2, center, angle)
    point.rightTopPoint = getRotatedPoint(a3, center, angle)
    point.rightBottomPoint = getRotatedPoint(a4, center, angle)
    point.leftMiddlePoint = getRotatedPoint(a5, center, angle)
    point.rightMiddlePoint = getRotatedPoint(a6, center, angle)
    point.topMiddlePoint = getRotatedPoint(a7, center, angle)
    point.bottomMiddlePoint = getRotatedPoint(a8, center, angle)
}


// 初始化点阵
export const initPoint: IinitPoint = function (point, targetObj) {
    point.left = targetObj.offsetLeft
    point.top = targetObj.offsetTop
    point.width = targetObj.offsetWidth
    point.height = targetObj.offsetHeight
    point.angle = getRotate(targetObj)
    point.rightBottomPoint = {
        x: point.width + point.left,
        y: point.height + point.top
    }
    // 记录初始盒子右上角位置
    point.rightTopPoint = {
        x: point.width + point.left,
        y: point.top
    }
    // 记录左上角的位置
    point.leftTopPoint = {
        x: point.left,
        y: point.top
    }
    // 左下
    point.leftBottomPoint = {
        x: point.left,
        y: point.top + point.height
    }
    // 左中
    point.leftMiddlePoint = {
        x: point.left,
        y: point.top + point.height / 2
    }
    // 右中
    point.rightMiddlePoint = {
        x: point.left + point.width,
        y: point.top + point.height / 2
    }
    // 上中
    point.topMiddlePoint = {
        x: point.left + point.width / 2,
        y: point.top
    }
    // 下中
    point.bottomMiddlePoint = {
        x: point.left + point.width / 2,
        y: point.top + point.height
    }
    // 记录中心位置
    point.centerPos = {
        x: point.left + point.width / 2,
        y: point.top + point.height / 2
    }
}


export const throttle: Ithrottle = function (fn, wait = 10) {
    let timer: any = null;
    return function (this: any) {
        const context = this;
        const args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(context, args);
                timer = null;
            }, wait)
        }
    }
}


// 计算点是否在矩形内部
const IsRectIn: IIsRectIn = function (a, b, c, d, p, notXY) {
    return a.x - notXY.x < p.x && p.x < b.x - notXY.x && a.y - notXY.y < p.y && p.y < c.y - notXY.y
}
// 计算矩形是否在另一个矩形内部
export const IsPointInMatrix: IIsPointInMatrix = function (a, b, c, d, p, notXY) {
    const ary = [];
    ary.push(IsRectIn(a, b, c, d, p.leftTopPoint, notXY))
    ary.push(IsRectIn(a, b, c, d, p.leftBottomPoint, notXY))
    ary.push(IsRectIn(a, b, c, d, p.rightTopPoint, notXY))
    ary.push(IsRectIn(a, b, c, d, p.rightBottomPoint, notXY))
    return ary.every(item => item)
}