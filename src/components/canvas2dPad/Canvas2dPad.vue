<!--
 * @Description: canvas2D画板
 * @Author: LXG
 * @Date: 2020-09-04
 * @LastEditTime: 2020-09-10
-->
<template>
    <div class="gun-canvas2d-pad">
        <!-- canvas -->
        <canvas ref="c2d" @mouseleave="leave" @mousedown="down" @mouseup="up" @click="click"></canvas>
        <button @click="get">get</button>
        <button @click="setCtx">set ctx</button>
        <button @click="back">撤回</button>
        <button @click="next">恢复</button>
        <button @click="clear">清除</button>
        <button @click="toDataURL()">toDataURL</button>
    </div>
</template>

<script>
// Canvas2d类
class Canvas2d {
    constructor(domEle) {
        // Canvas实例
        this.domEle = domEle;
        // CanvasRenderingContext2D实例
        this.ctx = domEle.getContext("2d");
        // 设置默认样式
        this.ctx.strokeStyle = "#333333"; // 笔色
        this.ctx.shadowBlur = 2; // 阴影级别
        this.ctx.shadowColor = "#ffffff"; // 阴影色
        this.ctx.lineWidth = 4; // 线粗
        this.ctx.lineCap = "round"; // 线末圆帽

        // 将初始状态保存在前栈底
        this.preStack.push(
            this.ctx.getImageData(
                0,
                0,
                this.domEle.clientWidth,
                this.domEle.clientHeight
            )
        );
    }

    drawing = false; // 绘制中
    preStack = new Array(); // 图像前栈
    nextStack = new Array(); // 图像后栈

    /**
     * @description: 从某点开始绘制
     * @param {Number} x x坐标
     * @param {Number} y y坐标
     */
    beginStrokeIn(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }
    /**
     * @description: 从当前点绘制直线到某点
     * @param {Number} x x坐标
     * @param {Number} y y坐标
     */
    strokeLineTo(x, y) {
        this.drawing = true;

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
    /**
     * @description: 结束绘制
     */
    endStroking() {
        if (this.drawing) {
            this.preStack.push(
                this.ctx.getImageData(
                    0,
                    0,
                    this.domEle.clientWidth,
                    this.domEle.clientHeight
                )
            );
            if (!!this.nextStack.length) {
                this.nextStack = [];
            }
        }
        this.drawing = false;
    }
    // --------------------------------------------------
    /**
     * @description: 设置ctx
     * @param {String} key 属性名
     * @param {String} value 属性值
     */
    setCtx(key, value) {
        this.ctx[key] = value;
    }
    /**
     * @description: 撤回上一步
     */
    back() {
        if (1 < this.preStack.length) {
            this.nextStack.push(this.preStack.pop());
            this.ctx.putImageData(
                this.preStack[this.preStack.length - 1],
                0,
                0
            );
        }
    }
    /**
     * @description: 恢复下一步
     */
    next() {
        if (!!this.nextStack.length) {
            this.ctx.putImageData(
                this.nextStack[this.nextStack.length - 1],
                0,
                0
            );
            this.preStack.push(this.nextStack.pop());
        }
    }
    /**
     * @description: 清除画板
     */
    clear() {
        this.ctx.clearRect(
            0,
            0,
            this.domEle.clientWidth,
            this.domEle.clientHeight
        );
    }
    /**
     * @description: 解析得到dataURL
     */
    toDataURL() {
        return this.domEle.toDataURL();
    }
}
// ImgHandler类
class ImgHandler {
    constructor() {}
    /**
     * @description: 加工处理(入口)
     * @param {String} dataUrl dataURL
     * @param {Object} option 选项
     */
    handle(dataUrl, option) {
        return new Promise((resolve, reject) => {
            const ds = this;
            let newImg = new Image();
            newImg.src = dataUrl;
            newImg.onload = function() {
                // 创建Canvas对象
                let canvas = document.createElement("canvas");
                //  创建canvas的2D上下文（CanvasRenderingContext2D对象)
                let ctx = canvas.getContext("2d");
                [canvas.width, canvas.height] = [newImg.width, newImg.height];

                if (option.rotateDeg) {
                    ds.rotate(canvas, ctx, option.rotateDeg);
                }
                if (option.bgColor) {
                    if ([0, -0, 2, -2].includes(option.rotateDeg % 4)) {
                        ds.fillBgColor(
                            ctx,
                            option.bgColor,
                            canvas.width,
                            canvas.height
                        );
                    } else {
                        ds.fillBgColor(
                            ctx,
                            option.bgColor,
                            canvas.height,
                            canvas.width
                        );
                    }
                }

                // img铺在ctx上
                ctx.drawImage(newImg, 0, 0);

                resolve(canvas.toDataURL());
            };
        });
    }
    /**
     * @description: 旋转
     * @param {Canvas} canvas
     * @param {CanvasRenderingContext2D} ctx ctx
     * @param {Number} rotateDeg 旋转角倍率(90的倍率)
     */
    rotate(canvas, ctx, rotateDeg) {
        let newDeg = rotateDeg % 4;
        switch (newDeg) {
            // 无旋转
            case 0:
            case -0:
                [canvas.width, canvas.height] = [canvas.width, canvas.height];
                break;
            // 顺时针旋转90°(逆时针旋转270°)
            case 1:
            case -3:
                [canvas.width, canvas.height] = [canvas.height, canvas.width];
                ctx.translate(canvas.width, 0);
                break;
            // 逆时针旋转90°(顺时针旋转270°)
            case -1:
            case 3:
                [canvas.width, canvas.height] = [canvas.height, canvas.width];
                ctx.translate(0, canvas.height);
                break;
            // 倒转
            case 2:
            case -2:
                [canvas.width, canvas.height] = [canvas.width, canvas.height];
                ctx.translate(canvas.width, canvas.height);
                break;
            // 参数异常
            default:
                return "";
        }
        // 数学中的pi = 180°
        ctx.rotate((newDeg * 90 * Math.PI) / 180);

        return true;
    }
    /**
     * @description: 填充背景色
     * @param {CanvasRenderingContext2D} ctx ctx
     * @param {String} bgColor 背景色
     * @param {Number} width 宽
     * @param {Number} height 高
     */
    fillBgColor(ctx, bgColor, width, height) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        return true;
    }
}

// Canvas2d实例
let canvas2d;
// ImgHandler实例
let imgHandler = new ImgHandler();

// 节流
let throttle = null;

export default {
    name: "GunCanvas2dPad",
    props: {},
    data() {
        return {};
    },
    created() {
        // 定义一个节流函数
        throttle = new this.$GunUtils.throttle();
    },
    mounted() {
        this.initMount();
    },
    methods: {
        /**
         * @description: 渲染后初始化
         */
        initMount() {
            // 实例化Canvas2d
            let domEle = null;
            if (this.$attrs.id) {
                domEle = document
                    .querySelector(`#${this.$attrs.id}`)
                    .getElementsByTagName("canvas")[0];
            } else {
                domEle = this.$refs["c2d"];
            }
            canvas2d = new Canvas2d(domEle);
            // console.log("c2d:", canvas2d);
        },
        /**
         * @description: c2d mouseleave
         * @param {Event} e 事件
         */
        leave(e) {
            // console.log("c2d mouseleave:", e);
            // 注销mousemove
            canvas2d.domEle.removeEventListener("mousemove", this.move);
        },
        /**
         * @description: c2d mousedown
         * @param {Event} e 事件
         */
        down(e) {
            // console.log("c2d mousedown:", e);
            // 注册mousemove
            canvas2d.domEle.addEventListener("mousemove", this.move, false);
            // 开始绘制
            canvas2d.beginStrokeIn(e.offsetX, e.offsetY);
        },
        /**
         * @description: c2d mousemove
         * @param {Event} e 事件
         */
        move(e) {
            // 利用节流50毫秒，尝试优化move事件的频繁程度
            throttle(() => {
                // console.log("c2d mousemove:", e);
                // 绘制
                canvas2d.strokeLineTo(e.offsetX, e.offsetY);
            }, 50);
        },
        /**
         * @description: c2d mouseup
         * @param {Event} e 事件
         */
        up(e) {
            // console.log("c2d mouseup:", e);
            // 注销mousemove
            canvas2d.domEle.removeEventListener("mousemove", this.move);
            // 结束绘制
            canvas2d.endStroking();
        },
        /**
         * @description: c2d click
         * @param {Event} e 事件
         */
        click(e) {
            // console.log("c2d click:", e);
            // 注销mousemove
            canvas2d.domEle.removeEventListener("mousemove", this.move);
        },
        // --------------------------------------------------
        /**
         * @description: API
         * @description: get
         * @param {String} key 属性名
         */
        get(key) {
            return canvas2d[key];
        },
        /**
         * @description: API
         * @description: set
         * @param {String} key 属性名
         * @param {String} value 属性值
         */
        setCtx(key, value) {
            if (key) {
                canvas2d.setCtx(key, value);
            }
        },
        /**
         * @description: API
         * @description: 撤回
         */
        back() {
            canvas2d.back();
        },
        /**
         * @description: API
         * @description: 恢复
         */
        next() {
            canvas2d.next();
        },
        /**
         * @description: API
         * @description: 清除
         */
        clear() {
            canvas2d.clear();
        },
        /**
         * @description: API
         * @description: 解析得到dataURL
         * @param {Object} option 选项
         * @param {String}   option.bgColor 背景色
         * @param {String}   option.rotateDeg 旋转角倍率(90的倍率)
         */
        async toDataURL(option = {}) {
            option = {
                bgColor: "#3699ff",
                rotateDeg: -1
            };
            let dataUrl = canvas2d.toDataURL();
            if (!!Object.keys(option).length) {
                dataUrl = await imgHandler.handle(dataUrl, option);
            }
            console.log(dataUrl);
            return dataUrl;
        }
    }
};
</script>

<style lang="scss" scoped>
.gun-canvas2d-pad canvas {
    border: 1px solid #ccc;
}
</style>