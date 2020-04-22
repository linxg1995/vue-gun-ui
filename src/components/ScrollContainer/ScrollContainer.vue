<!--
 * @Description: 带自定义滚动条的块容器
 * @Author: LXG
 * @Date: 2020-04-21
 * @LastEditTime: 2020-04-22
 -->
<template>
    <div class="gun-scrollC" ref="scrollC">
        <!-- wrap - 纵向滚动条 -->
        <div class="scrollC-scrollbarY" ref="scrollbarY">
            <div class="scrollbarY-slider" ref="scrollsliderY"></div>
        </div>
        <div class="scrollC-contentOuter" ref="contentOuter" @scroll="scrollContentOuter">
            <div class="contentOuter-contentInner" ref="contentInner">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "GunScrollContainer",
    props: {
        id: String
    },
    data() {
        return {
            scrollbarYInfo: {},
            scrollsliderYInfo: {
                style: {
                    translateY: 0
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
            const contentOuter = this.$refs.contentOuter;
            const contentInner = this.$refs.contentInner;

            // ----- 隐藏默认滚动条 -----
            // 总容器 隐藏溢出，外容器 显示滚动条
            // 计算滚动条宽度，调整外容器大小，使滚动条部分刚好溢出
            //     offsetWidth 包含滚动条的整宽
            //     clientWidth 不包含混动条的可视宽
            var defaultScrollbarWidth =
                contentOuter.offsetWidth - contentOuter.clientWidth;
            contentOuter.style.marginRight = `-${defaultScrollbarWidth}px`;
            contentOuter.style.paddingRight = `${defaultScrollbarWidth}px`;
            contentOuter.style.height = `calc(100% + ${defaultScrollbarWidth}px)`;

            // ----- 按比例初始化滚动条滑块的大小 -----
            // 有两种算法
            //     滑块/滚动条 = 外容器可视窗口/外容器内容窗口，得到px
            //     滑块/100 = 外容器可视窗口/外容器内容窗口，得到%
            scrollsliderY.style.height = `${contentOuter.clientHeight *
                (contentOuter.clientHeight / contentOuter.scrollHeight)}px`;
            // scrollsliderY.style.height = `${(contentOuter.clientHeight /
            //     contentOuter.scrollHeight) *
            //     100}%`;

            // ----- 监听滚动条及滑块 -----
            this.$nextTick(() => {
                this.initBarYHandler();
                this.initSliderYHandler();
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
                        // scrollsliderY.style.height = `${(contentOuter.clientHeight /
                        //     contentOuter.scrollHeight) *
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
                        scrollsliderY.classList.add("isAnimation");
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
                    scrollsliderY.classList.remove("isAnimation");
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
        /**
         * @description: 监听外容器滚动
         * @param {Event} e 事件
         */
        scrollContentOuter(e) {
            // console.log("scroll contentOuter:", e);
            // 按比例偏移 滚动条滑块
            this.scrollsliderYInfo.style.translateY =
                (e.target.scrollTop / e.target.clientHeight) * 100;
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
        }
    }
};
</script>

<style lang="scss" scoped>
.gun-scrollC {
    position: relative;
    overflow: hidden;
}
.scrollC-scrollbarY {
    position: absolute;
    right: 0;
    width: 10px;
    height: 100%;
    background-color: #eee;
    border-radius: 10px;
    .scrollbarY-slider {
        width: 10px;
        background-color: #aaa;
        border-radius: 10px;
        &:hover {
            background-color: #888;
        }
        &.isAnimation {
            -webkit-transition: transform 0.05s linear;
            -moz-transition: transform 0.05s linear;
            -o-transition: transform 0.05s linear;
            transition: transform 0.05s linear;
        }
    }
}
.scrollC-contentOuter {
    height: 100%;
    overflow: scroll;
}
</style>