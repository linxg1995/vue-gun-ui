<!--
 * @Description: 带自定义滚动条的块容器
 * @Author: LXG
 * @Date: 2020-04-21
 * @LastEditTime: 2020-06-14
 -->
<template>
    <div class="gun-select" ref="gunSelect">
        <input
            class="select-input"
            ref="selectInput"
            v-model="comp_label"
            type="text"
            :placeholder="placeholder"
            readonly
            @click.stop="toggle()"
        />
        <div class="select-menu" ref="selectMenu" v-show="menuShow">
            <div class="select-menu-arrow"></div>
            <gun-scroll-container class="select-menu-options">
                <div
                    class="menu-options-item"
                    :class="{'opt--current': getcurrentOptClass(opt)}"
                    v-for="(opt, index) in tempOptions"
                    :key="index"
                    @click="clickOpt(opt,index)"
                >
                    <span>{{getOptLabel(opt)}}</span>
                </div>
            </gun-scroll-container>
        </div>
        <!-- <div class="select-menu" ref="selectMenu" v-show="menuShow">
            <div class="select-menu-arrow"></div>
            <div class="select-menu-options" ref="menuOptions">
                <div
                    class="menu-options-item"
                    :class="{'opt--current': getcurrentOptClass(opt)}"
                    v-for="(opt, index) in tempOptions"
                    :key="index"
                    @click="clickOpt(opt,index)"
                >
                    <span>{{getOptLabel(opt)}}</span>
                </div>
            </div>
        </div>-->
    </div>
</template>

<script>
export default {
    name: "GunSelect",
    props: {
        // value
        value: [String, Number],
        // 选项列表
        options: {
            type: [Array, String],
            default: () => []
        },
        // value字段
        valueKey: {
            type: String,
            default: "value"
        },
        // 显示字段
        labelKey: {
            type: String,
            default: "label"
        },
        // 文本提示
        placeholder: {
            type: String,
            default: "请选择"
        },
        // 尺寸
        size: {
            type: String,
            default: "default"
        }
    },
    data() {
        return {
            // 暂存 tempValue
            tempValue: "",
            // 暂存 options
            tempOptions: [],
            // 菜单显示状态
            menuShow: false
        };
    },
    computed: {
        // label
        comp_label() {
            // 判断时，优先基础数组，再对象数组
            // 返回时，优先对象数组，再基础数组
            for (let i = 0; i < this.tempOptions.length; i++) {
                const opt = this.tempOptions[i];
                if (opt === this.value || opt[this.valueKey] === this.value) {
                    return opt[this.labelKey] || opt;
                }
            }
            return "";
        }
    },
    mounted() {
        this.tempValue = this.value || "";
        this.tempOptions = this.options || [];
        this.initMount();
    },
    methods: {
        /**
         * @description: 渲染后初始化
         */
        initMount() {},
        /**
         * @description: 获取选项label
         * @param {Object} opt 选项
         */
        getOptLabel(opt) {
            return opt[this.labelKey] || opt;
        },
        /**
         * @description: 获取当前选项样式
         * @param {Object} opt 选项
         */
        getcurrentOptClass(opt) {
            if ((opt[this.valueKey] || opt) === this.value) {
                return true;
            }
            return false;
        },
        /**
         * @description: 点击选项
         * @param {Object} opt 选项
         * @param {Number} index 选项下标
         */
        clickOpt(opt, index) {
            if (this.tempValue !== (opt[this.valueKey] || opt)) {
                this.tempValue = opt[this.valueKey] || opt;
                this.$emit("change", this.tempValue, {
                    option: opt,
                    index: index
                });
            }
        },
        /**
         * @description: 切换菜单显示
         */
        toggle() {
            // 为了兼容 v-show 和 css动画，加入延迟来处理
            if (!this.menuShow) {
                setTimeout(() => {
                    this.$refs["gunSelect"].classList.add("sel--focus");
                }, 100);
                this.menuShow = !this.menuShow;
            } else {
                setTimeout(() => {
                    this.menuShow = !this.menuShow;
                }, 100);
                this.$refs["gunSelect"].classList.remove("sel--focus");
            }
        }
    },
    watch: {
        value(val) {
            this.tempValue = val;
        },
        tempValue(val) {
            this.$emit("input", val);
        },
        options(val) {
            this.tempOptions = val || [];
        },
        menuShow(val) {
            if (val) {
                this.$refs["selectInput"].focus();
                document.addEventListener("click", this.toggle, false);
            } else {
                this.$refs["selectInput"].blur();
                document.removeEventListener("click", this.toggle);
            }
            this.$nextTick(() => {
                this.$emit("toggle", val);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.gun-select {
    position: relative;
    width: 256px;
    text-align: left;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    -webkit-transition: all 0.1s linear;
    -moz-transition: all 0.1s linear;
    -o-transition: all 0.1s linear;
    transition: all 0.1s linear;
    &:hover {
        border-color: #bbb;
    }
    &.sel--focus {
        border-color: #3699ff;
        box-shadow: 0 0 1px 0 #3699ff;

        .select-menu {
            opacity: 1;
        }
        .select-menu-options {
            max-height: 200px;
        }
    }
}
.select-input {
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-right: 10px;
    padding-left: 10px;
    color: #444;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
}
.select-menu {
    position: absolute;
    top: calc(100% + 12px);
    width: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 0 2px 0 #bbb;
    opacity: 0;
    -webkit-transition: opacity 0.1s linear;
    -moz-transition: opacity 0.1s linear;
    -o-transition: opacity 0.1s linear;
    transition: opacity 0.1s linear;
}
.select-menu-arrow {
    position: absolute;
    left: 50%;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #bbb;
    border-left: 6px solid transparent;
    -webkit-transform: translate(-50%, -100%);
    -ms-transform: translate(-50%, -100%);
    -moz-transform: translate(-50%, -100%);
    -o-transform: translate(-50%, -100%);
    transform: translate(-50%, -100%);
    &::after {
        content: "";
        position: absolute;
        display: block;
        bottom: -10px;
        border-right: 5px solid transparent;
        border-bottom: 9px solid #fff;
        border-left: 5px solid transparent;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
    }
}
.select-menu-options {
    max-height: 0;
    -webkit-transition: all 0.1s linear;
    -moz-transition: all 0.1s linear;
    -o-transition: all 0.1s linear;
    transition: all 0.1s linear;
    .menu-options-item {
        line-height: 32px;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
            background-color: #eee;
        }
        &.opt--current {
            font-weight: bold;
            color: #3699ff;
            background-color: #eee;
        }
    }
}
</style>