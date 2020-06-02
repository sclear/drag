/**
 * @param { 记录坐标 } curPos 
 * @param { 中点坐标 } centerPos 
 * @param { 角度 } angle 
 */
export function getRotatedPoint(curPos, centerPos, angle) {
    return {
        x: Math.floor((curPos.x - centerPos.x) * Math.cos(Math.PI / 180 * angle) - (curPos.y - centerPos.y) * Math.sin(Math.PI / 180 * angle) + centerPos.x),
        y: Math.floor((curPos.x - centerPos.x) * Math.sin(Math.PI / 180 * angle) + (curPos.y - centerPos.y) * Math.cos(Math.PI / 180 * angle) + centerPos.y)
    }
}

/**
 * @param { Element } target 
 */
export function getRotate(target) {
    let st = window.getComputedStyle(target, null);
    let tr = st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform") || "FAIL";
    if (tr !== 'none') {
        let values = tr.split('(')[1].split(')')[0].split(',');
        let a = values[0];
        let b = values[1];
        let c = values[2];
        let d = values[3];
        let scale = Math.sqrt(a * a + b * b);
        let sin = b / scale;
        let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
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
export function getTransferPosition(left, top, width, height, angle, center, point) {
    let a1 = {
        x: left,
        y: top
    }
    let a2 = {
        x: left,
        y: top + height
    }
    let a3 = {
        x: left + width,
        y: top
    }
    let a4 = {
        x: left + width,
        y: top + height
    }
    let a5 = {
        x: left,
        y: top + height / 2
    }
    let a6 = {
        x: left + width,
        y: top + height / 2
    }
    let a7 = {
        x: left + width / 2,
        y: top
    }
    let a8 = {
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
export function initPoint(point, targetObj) {
    point.left = targetObj.offsetLeft
    point.top = targetObj.offsetTop
    point.width = targetObj.offsetWidth
    point.height = targetObj.offsetHeight
    point.angle = getRotate(targetObj)
    // point.preRadian = 0;
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