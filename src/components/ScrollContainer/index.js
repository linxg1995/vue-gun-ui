/*
 * @Description: ScrollContainer组件管理
 * @Author: LXG
 * @Date: 2020-04-21
 * @LastEditTime: 2020-04-21
 */
import ScrollContainer from './ScrollContainer.vue'

ScrollContainer.install = Vue => {
    Vue.component(ScrollContainer.name, ScrollContainer)
}

export default ScrollContainer