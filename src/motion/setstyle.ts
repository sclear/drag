interface Ioptions {
    [key: string]: string | number,
}
export function setStyle(options: Ioptions, element: any) {
    for (let key in options) {
        element.style[key] = options[key]
    }
}


