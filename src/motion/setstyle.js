export function setStyle(options, element) {
    for(let key in options) {
        element.style[key] = options[key]
    }
}


