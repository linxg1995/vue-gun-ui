/*
 * @Description: 组件全局管理
 * @Author: LXG
 * @Date: 2020-04-21
 * @LastEditTime: 2020-06-10
 */
import ScrollContainer from './scrollContainer/index.js'
import Select from './select/index.js'
import GunUtils from '@/assets/js/utils.js'

const components = [
    ScrollContainer,
    Select
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
    ...components,
    GunUtils
}