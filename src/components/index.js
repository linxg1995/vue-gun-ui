/*
 * @Description: 组件全局管理
 * @Author: LXG
 * @Date: 2020-04-21
 * @LastEditTime: 2020-04-21
 */
import ScrollContainer from './ScrollContainer/index.js'

const components = [
    ScrollContainer
]

const install = Vue => {
    if (install.installed) {
        return
    }
    install.installed = true
    for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        Vue.component(comp.name, comp)
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    components
}