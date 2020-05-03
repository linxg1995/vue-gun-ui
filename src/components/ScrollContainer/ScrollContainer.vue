<!--
 * @Description: 带自定义滚动条的块容器
 * @Author: LXG
 * @Date: 2020-04-21
 * @LastEditTime: 2020-05-03
 -->
<template>
    <div class="gun-scrollC" ref="scrollC" @mouseenter="enterScrollC" @mouseleave="leaveScrollC">
        <!-- wrap - Y滚动条 -->
        <div class="scrollC-scrollbarY" ref="scrollbarY">
            <div class="scrollbarY-slider" ref="scrollsliderY"></div>
        </div>
        <!-- wrap - 内容 -->
        <div class="scrollC-contentOuter" ref="contentOuter" @scroll="scrollContentOuter">
            <div class="contentOuter-contentInner" ref="contentInner">
                <slot />
            </div>
        </div>
        <!-- wrap - X滚动条 -->
        <div class="scrollC-scrollbarX" ref="scrollbarX" v-show="showX">
            <div class="scrollbarX-slider" ref="scrollsliderX"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "GunScrollContainer",
    props: {
        // 显示X滚动条
        showX: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            scrollbarYInfo: {},
            scrollsliderYInfo: {
                style: {
                    translateY: 0
                }
            },
            scrollsliderXInfo: {
                style: {
                    translateX: 0
                }
            }
        };
    },
    computed: {},
    mounted() {
        this.initMount();
    },
    methods: {
        /**
         * @description: 渲染后初始化
         */
        initMount() {
            // const scrollC = this.$refs.scrollC;
            // const scrollbarY = this.$refs.scrollbarY;
            const scrollsliderY = this.$refs.scrollsliderY;
            // const scrollbarX = this.$refs.scrollbarX;
            const scrollsliderX = this.$refs.scrollsliderX;
            const contentOuter = this.$refs.contentOuter;
            const contentInner = this.$refs.contentInner;

            // ----- 隐藏默认滚动条 -----
            // 总容器 隐藏溢出，外容器 显示滚动条
            // 计算滚动条宽度，调整外容器大小，使滚动条部分刚好溢出
            // 调整内容器大小，使YX滚动条不重叠
            //     offsetWidth 包含滚动条的整宽
            //     clientWidth 不包含混动条的可视宽
            var defaultScrollbarWidth =
                contentOuter.offsetWidth - contentOuter.clientWidth;
            contentOuter.style.marginRight = `-${defaultScrollbarWidth}px`;
            contentOuter.style.paddingRight = `${defaultScrollbarWidth}px`;
            contentOuter.style.height = `calc(100% + ${defaultScrollbarWidth}px)`;
            contentInner.style.marginRight = `-${defaultScrollbarWidth - 10}px`;

            // ----- 按比例初始化滚动条滑块的大小 -----
            // 有两种算法
            //     滑块/滚动条 = 外容器可视窗口/外容器内容窗口，得到px
            //     滑块/100 = 外容器可视窗口/外容器内容窗口，得到%
            scrollsliderY.style.height = `${contentOuter.clientHeight *
                (contentOuter.clientHeight / contentOuter.scrollHeight)}px`;
            scrollsliderX.style.width = `${(contentOuter.clientWidth - 10) *
                (contentOuter.clientWidth / contentOuter.scrollWidth)}px`;
            // scrollsliderY.style.height = `${(contentOuter.clientHeight /
            //     contentOuter.scrollHeight) *
            //     100}%`;
            // scrollsliderX.style.width = `${(contentOuter.clientWidth /
            //     contentOuter.scrollWidth) *
            //     100}%`;

            // ----- 监听滚动条及滑块 -----
            this.$nextTick(() => {
                this.initBarYHandler();
                this.initSliderYHandler();

                this.initBarXHandler();
                this.initSliderXHandler();
            });

            // ----- 监听内容器窗口 -----
            // ResizeObserver是新的JS API，支持观察某个元素的窗口变化
            //     .target dom元素
            //     .contentRect dom元素大小位置信息
            const myObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    // console.log("observer entry:", entry);
                    // element.classList.contains(<className>) 是否存在某个类名
                    if (
                        entry.target.classList.contains(
                            "contentOuter-contentInner"
                        )
                    ) {
                        // 按比例重绘滚动条滑块的大小
                        scrollsliderY.style.height = `${contentOuter.clientHeight *
                            (contentOuter.clientHeight /
                                contentOuter.scrollHeight)}px`;
                        scrollsliderX.style.width = `${(contentOuter.clientWidth -
                            10) *
                            (contentOuter.clientWidth /
                                contentOuter.scrollWidth)}px`;
                        // scrollsliderY.style.height = `${(contentOuter.clientHeight /
                        //     contentOuter.scrollHeight) *
                        //     100}%`;
                        // scrollsliderX.style.width = `${(contentOuter.clientWidth /
                        //     contentOuter.scrollWidth) *
                        //     100}%`;
                    }
                });
            });
            myObserver.observe(contentInner);
        },
        /**
         * @description: 注册Y滚动条的监听
         */
        initBarYHandler() {
            const scrollbarY = this.$refs.scrollbarY;
            const scrollsliderY = this.$refs.scrollsliderY;
            const contentOuter = this.$refs.contentOuter;
            // offsetTop 滑块距离上边的位置
            // offsetBottom 滑块距离下边的位置
            // maxScrollTop 最大滚动高度
            // inBar 位于滚动条上
            // longPress 长按
            // moveTimer 滚动定时器
            let offsetTop,
                offsetBottom,
                maxScrollTop,
                inBar,
                longPress = false,
                moveTimer = null;

            scrollbarY.onmouseenter = e => {
                inBar = true;
            };
            scrollbarY.onmouseleave = e => {
                inBar = false;
            };
            scrollbarY.onmousedown = e => {
                // console.log("mousedown scrollbarY:", e);
                // 刷新一下变量，保证鼠标按下瞬间是最新的
                offsetTop =
                    (this.scrollsliderYInfo.style.translateY / 100) *
                    scrollsliderY.clientHeight;
                offsetBottom = offsetTop + scrollsliderY.clientHeight;
                maxScrollTop =
                    contentOuter.scrollHeight - contentOuter.clientHeight;

                longPress = true;
                // 按下200s时进入长按
                setTimeout(() => {
                    if (longPress) {
                        // 增加一个类名，用于增加过渡动画
                        scrollsliderY.classList.add("moveAnimation");
                        moveTimer = setInterval(() => {
                            if (inBar) {
                                if (e.offsetY < offsetTop) {
                                    this.scrollsliderYInfo.style.translateY -= 5;
                                }
                                if (offsetBottom < e.offsetY) {
                                    this.scrollsliderYInfo.style.translateY += 5;
                                }
                                contentOuter.scrollTop =
                                    (this.scrollsliderYInfo.style.translateY /
                                        100) *
                                    contentOuter.clientHeight;
                                if (contentOuter.scrollTop <= 0) {
                                    contentOuter.scrollTop = 0;
                                    clearInterval(moveTimer);
                                }
                                if (maxScrollTop <= contentOuter.scrollTop) {
                                    contentOuter.scrollTop = maxScrollTop;
                                    clearInterval(moveTimer);
                                }
                            }
                        }, 50);
                    }
                }, 100);

                // 拖动过程中禁止文本选中
                document.onselectstart = () => false;
                document.onmouseup = e => {
                    // console.log("mouseup document:", e);
                    if (!e.target.classList.contains("scrollC-scrollbarY")) {
                        clearInterval(moveTimer);
                        moveTimer = null;
                    }
                    document.onselectstart = null;
                };
            };
            scrollbarY.onclick = e => {
                // console.log("click scrollbarY:", e);
                // 取消长按标识
                longPress = false;
                // 处于长按时不做操作
                if (moveTimer) {
                    clearInterval(moveTimer);
                    moveTimer = null;
                    // 定时滚动完成后移除过渡动画
                    scrollsliderY.classList.remove("moveAnimation");
                } else {
                    if (e.offsetY < offsetTop) {
                        this.scrollsliderYInfo.style.translateY -= 80;
                    }
                    if (offsetBottom < e.offsetY) {
                        this.scrollsliderYInfo.style.translateY += 80;
                    }
                    contentOuter.scrollTop =
                        (this.scrollsliderYInfo.style.translateY / 100) *
                        contentOuter.clientHeight;
                }
            };
        },
        /**
         * @description: 初始化滚动条滑块的监听
         */
        initSliderYHandler() {
            const ds = this;
            const scrollsliderY = this.$refs.scrollsliderY;
            const contentOuter = this.$refs.contentOuter;
            // currentClientY 当前Y位置
            // currentTranslateY 当前Y偏移量
            // arriveTop 滚动到达顶部
            // arriveBottom 滚动到达底部
            // maxScrollTop 最大滚动高度
            let currentClientY = 0,
                currentTranslateY = 0,
                arriveTop = false,
                arriveBottom = false,
                maxScrollTop = 0;

            scrollsliderY.onmousedown = e => {
                // console.log("mousedown scrollsliderY:", e);
                // scrollbarY的mousedown事件会被捕获，阻止默认
                e.stopPropagation();
                e.cancelBubble = true;

                // 限制左键
                if (e.button != 0) {
                    return;
                }
                // 刷新一下变量，保证鼠标按下瞬间是最新的
                currentClientY = e.clientY;
                currentTranslateY = ds.scrollsliderYInfo.style.translateY;
                maxScrollTop =
                    contentOuter.scrollHeight - contentOuter.clientHeight;
                // 希望鼠标离开滑块还能继续拖动，所以注册dom的mousemove
                document.addEventListener(
                    "mousemove",
                    movescrollsliderY,
                    false
                );
                // 拖动过程中禁止文本选中
                document.onselectstart = () => false;
                document.onmouseup = e => {
                    document.removeEventListener(
                        "mousemove",
                        movescrollsliderY
                    );
                    document.onselectstart = null;
                    document.onmouseup = null;
                };
            };
            scrollsliderY.onmouseup = e => {
                // console.log("mouseup scrollsliderY:", e);
                // scrollbarY的mouseup事件会被捕获，阻止默认
                e.stopPropagation();
                e.cancelBubble = true;

                document.removeEventListener("mousemove", movescrollsliderY);
            };
            scrollsliderY.onclick = e => {
                // console.log("click scrollsliderY:", e);
                // scrollbarY的click事件会被捕获，阻止默认
                e.stopPropagation();
                e.cancelBubble = true;
            };

            /**
             * @description: 拖动Y滚动条滑块
             * @param {Event} e 事件
             */
            function movescrollsliderY(e) {
                // console.log("move scrollsliderY:", e);
                // 按移动的比例距离，设置滑块的Y偏移量
                let offsetY = e.clientY - currentClientY;
                if (offsetY < 0 && contentOuter.scrollTop <= 0) {
                    if (!arriveTop) {
                        currentClientY = e.clientY;
                        currentTranslateY = 0;
                        arriveTop = true;
                    }
                    return;
                } else {
                    arriveTop = false;
                }
                if (offsetY > 0 && contentOuter.scrollTop == maxScrollTop) {
                    if (!arriveBottom) {
                        currentClientY = e.clientY;
                        currentTranslateY =
                            ds.scrollsliderYInfo.style.translateY;
                        arriveBottom = true;
                    }
                    return;
                } else {
                    arriveBottom = false;
                }
                ds.scrollsliderYInfo.style.translateY =
                    currentTranslateY +
                    (offsetY / scrollsliderY.clientHeight) * 100;
                contentOuter.scrollTop =
                    (ds.scrollsliderYInfo.style.translateY / 100) *
                    contentOuter.clientHeight;
            }
        },
        /**X
         * @description: 注册X滚动条的监听
         */
        initBarXHandler() {
            const scrollbarX = this.$refs.scrollbarX;
            const scrollsliderX = this.$refs.scrollsliderX;
            const contentOuter = this.$refs.contentOuter;
            // offsetLeft 滑块距离左边边的位置
            // offsetRight 滑块距离右边的位置
            // maxScrollLeft 最大滚动宽度
            // inBar 位于滚动条上
            // longPress 长按
            // moveTimer 滚动定时器
            let offsetLeft,
                offsetRight,
                maxScrollLeft,
                inBar,
                longPress = false,
                moveTimer = null;

            scrollbarX.onmouseenter = e => {
                inBar = true;
            };
            scrollbarX.onmouseleave = e => {
                inBar = false;
            };
            scrollbarX.onmousedown = e => {
                // console.log("mousedown scrollbarX:", e);
                // 刷新一下变量，保证鼠标按下瞬间是最新的
                offsetLeft =
                    (this.scrollsliderXInfo.style.translateX / 100) *
                    scrollsliderX.clientWidth;
                offsetRight = offsetLeft + scrollsliderX.clientWidth;
                maxScrollLeft =
                    contentOuter.scrollWidth - contentOuter.clientWidth;

                longPress = true;
                // 按下200s时进入长按
                setTimeout(() => {
                    if (longPress) {
                        // 增加一个类名，用于增加过渡动画
                        scrollsliderX.classList.add("moveAnimation");
                        moveTimer = setInterval(() => {
                            if (inBar) {
                                if (e.offsetX < offsetLeft) {
                                    this.scrollsliderXInfo.style.translateX -= 5;
                                }
                                if (offsetRight < e.offsetX) {
                                    this.scrollsliderXInfo.style.translateX += 5;
                                }
                                contentOuter.scrollLeft =
                                    (this.scrollsliderXInfo.style.translateX /
                                        100) *
                                    contentOuter.clientWidth;
                                if (contentOuter.scrollLeft <= 0) {
                                    contentOuter.scrollLeft = 0;
                                    clearInterval(moveTimer);
                                }
                                if (maxScrollLeft <= contentOuter.scrollLeft) {
                                    contentOuter.scrollLeft = maxScrollLeft;
                                    clearInterval(moveTimer);
                                }
                            }
                        }, 50);
                    }
                }, 100);

                // 拖动过程中禁止文本选中
                document.onselectstart = () => false;
                document.onmouseup = e => {
                    // console.log("mouseup document:", e);
                    if (!e.target.classList.contains("scrollC-scrollbarX")) {
                        clearInterval(moveTimer);
                        moveTimer = null;
                    }
                    document.onselectstart = null;
                };
            };
            scrollbarX.onclick = e => {
                // console.log("click scrollbarX:", e);
                // 取消长按标识
                longPress = false;
                // 处于长按时不做操作
                if (moveTimer) {
                    clearInterval(moveTimer);
                    moveTimer = null;
                    // 定时滚动完成后移除过渡动画
                    scrollsliderX.classList.remove("moveAnimation");
                } else {
                    if (e.offsetX < offsetLeft) {
                        this.scrollsliderXInfo.style.translateX -= 80;
                    }
                    if (offsetRight < e.offsetX) {
                        this.scrollsliderXInfo.style.translateX += 80;
                    }
                    contentOuter.scrollLeft =
                        (this.scrollsliderXInfo.style.translateX / 100) *
                        contentOuter.clientWidth;
                }
            };
        },
        /**
         * @description: 初始化X滚动条滑块的监听
         */
        initSliderXHandler() {
            const ds = this;
            const scrollsliderX = this.$refs.scrollsliderX;
            const contentOuter = this.$refs.contentOuter;
            // currentClientX 当前X位置
            // currentTranslateX 当前X偏移量
            // arriveLeft 滚动到达左部
            // arriveRight 滚动到达右部
            // maxScrollLeft 最大滚动宽度
            let currentClientX = 0,
                currentTranslateX = 0,
                arriveLeft = false,
                arriveRight = false,
                maxScrollLeft = 0;

            scrollsliderX.onmousedown = e => {
                // console.log("mousedown scrollsliderX:", e);
                // scrollbarX的mousedown事件会被捕获，阻止默认
                e.stopPropagation();
                e.cancelBubble = true;

                // 限制左键
                if (e.button != 0) {
                    return;
                }
                // 刷新一下变量，保证鼠标按下瞬间是最新的
                currentClientX = e.clientX;
                currentTranslateX = ds.scrollsliderXInfo.style.translateX;
                maxScrollLeft =
                    contentOuter.scrollWidth - contentOuter.clientWidth;
                // 希望鼠标离开滑块还能继续拖动，所以注册dom的mousemove
                document.addEventListener(
                    "mousemove",
                    moveScrollsliderX,
                    false
                );
                // 拖动过程中禁止文本选中
                document.onselectstart = () => false;
                document.onmouseup = e => {
                    document.removeEventListener(
                        "mousemove",
                        moveScrollsliderX
                    );
                    document.onselectstart = null;
                    document.onmouseup = null;
                };
            };
            scrollsliderX.onmouseup = e => {
                // console.log("mouseup scrollsliderX:", e);
                // scrollbarX的mouseup事件会被捕获，阻止默认
                e.stopPropagation();
                e.cancelBubble = true;

                document.removeEventListener("mousemove", moveScrollsliderX);
            };
            scrollsliderX.onclick = e => {
                // console.log("click scrollsliderX:", e);
                // scrollbarX的click事件会被捕获，阻止默认
                e.stopPropagation();
                e.cancelBubble = true;
            };

            /**
             * @description: 拖动X滚动条滑块
             * @param {Event} e 事件
             */
            function moveScrollsliderX(e) {
                // console.log("move scrollsliderX:", e);
                // 按移动的比例距离，设置滑块的X偏移量
                let offsetX = e.clientX - currentClientX;
                if (offsetX < 0 && contentOuter.scrollLeft <= 0) {
                    if (!arriveLeft) {
                        currentClientX = e.clientX;
                        currentTranslateX = 0;
                        arriveLeft = true;
                    }
                    return;
                } else {
                    arriveLeft = false;
                }
                if (offsetX > 0 && maxScrollLeft <= contentOuter.scrollLeft) {
                    if (!arriveRight) {
                        currentClientX = e.clientX;
                        currentTranslateX =
                            ds.scrollsliderXInfo.style.translateX;
                        arriveRight = true;
                    }
                    return;
                } else {
                    arriveRight = false;
                }
                ds.scrollsliderXInfo.style.translateX =
                    currentTranslateX +
                    (offsetX / scrollsliderX.clientWidth) * 100;
                contentOuter.scrollLeft =
                    (ds.scrollsliderXInfo.style.translateX / 100) *
                    contentOuter.clientWidth;
            }
        },
        /**
         * @description: 监听鼠标进入总容器
         * @param {Event} e 事件
         */
        enterScrollC(e) {
            // 显示滚动条
            this.$refs.scrollbarY.style.opacity = 1;
            this.$refs.scrollbarX.style.opacity = 1;
        },
        /**
         * @description: 监听鼠标离开总容器
         * @param {Event} e 事件
         */
        leaveScrollC(e) {
            // 隐藏滚动条
            this.$refs.scrollbarY.style.opacity = 0;
            this.$refs.scrollbarX.style.opacity = 0;
        },
        /**
         * @description: 监听外容器滚动
         * @param {Event} e 事件
         */
        scrollContentOuter(e) {
            // console.log("scroll contentOuter:", e);
            // 按比例偏移 滚动条滑块
            this.scrollsliderYInfo.style.translateY =
                (e.target.scrollTop / e.target.clientHeight) * 100;
            this.scrollsliderXInfo.style.translateX =
                (e.target.scrollLeft / e.target.clientWidth) * 100;
            this.$emit("scroll", e);
        }
    },
    watch: {
        "scrollsliderYInfo.style.translateY"(val) {
            const scrollsliderY = this.$refs.scrollsliderY;
            let value = `translateY(${val}%)`;
            scrollsliderY.style["-webkit-transform"] = value;
            scrollsliderY.style["-ms-transform"] = value;
            scrollsliderY.style["-moz-transform"] = value;
            scrollsliderY.style["-o-transform"] = value;
            scrollsliderY.style["transform"] = value;
            this.$forceUpdate();
        },
        "scrollsliderXInfo.style.translateX"(val) {
            const scrollsliderX = this.$refs.scrollsliderX;
            let value = `translateX(${val}%)`;
            scrollsliderX.style["-webkit-transform"] = value;
            scrollsliderX.style["-ms-transform"] = value;
            scrollsliderX.style["-moz-transform"] = value;
            scrollsliderX.style["-o-transform"] = value;
            scrollsliderX.style["transform"] = value;
            this.$forceUpdate();
        }
    }
};
</script>

<style lang="scss" scoped>
.gun-scrollC {
    position: relative;
    overflow: hidden;
}
.scrollC-scrollbarY,
.scrollC-scrollbarY:hover,
.scrollC-scrollbarX,
.scrollC-scrollbarX:hover {
    -webkit-transition: opacity 0.5s linear;
    -moz-transition: opacity 0.5s linear;
    -o-transition: opacity 0.5s linear;
    transition: opacity 0.5s linear;
}
.scrollC-scrollbarY,
.scrollC-scrollbarX {
    position: absolute;
    background-color: #eee;
    border-radius: 10px;
    opacity: 0;
}
.scrollbarY-slider,
.scrollbarX-slider {
    background-color: #aaa;
    border-radius: 10px;
    &:hover {
        background-color: #888;
    }
    &.moveAnimation {
        -webkit-transition: transform 0.05s linear;
        -moz-transition: transform 0.05s linear;
        -o-transition: transform 0.05s linear;
        transition: transform 0.05s linear;
    }
}
.scrollC-scrollbarY {
    right: 0;
    width: 10px;
    height: 100%;
    .scrollbarY-slider {
        width: 10px;
    }
}
.scrollC-scrollbarX {
    bottom: 0;
    left: 0;
    width: calc(100% - 10px);
    height: 10px;
    .scrollbarX-slider {
        height: 10px;
    }
}
.scrollC-contentOuter {
    height: 100%;
    overflow: scroll;
}
</style>