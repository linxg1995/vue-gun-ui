<!--
 * @Description: 带自定义滚动条的块容器
 * @Author: LXG
 * @Date: 2020-04-21
 * @LastEditTime: 2020-06-10
 -->
<template>
    <div class="gun-select" ref="gun-select">
        <input
            class="select-input"
            ref="select-input"
            v-model="tempValue"
            type="text"
            :placeholder="placeholder"
            readonly
            @focus="focusInput"
            @blur="blurInput"
        />
    </div>
</template>

<script>
export default {
    name: "GunSelect",
    props: {
        value: [String, Number, Array],
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
            tempValue: ""
        };
    },
    computed: {},
    mounted() {
        this.tempValue = this.value || "";
        this.initMount();
    },
    methods: {
        /**
         * @description: 渲染后初始化
         */
        initMount() {},
        /**
         * @description: 聚焦input
         * @param {Event} e 聚焦event
         */
        focusInput(e) {
            // console.log("focus:", e);
            // 给容器增加focus样式类，增加聚焦样式
            this.$refs["gun-select"].classList.add("focus");
        },
        /**
         * @description: 失焦input
         * @param {Event} e 失焦event
         */
        blurInput(e) {
            // console.log("blur:", e);
            this.$refs["gun-select"].classList.remove("focus");
        }
    },
    watch: {
        value(val) {
            this.tempValue = val;
        },
        tempValue(val) {
            this.$emit("input", val);
        }
    }
};
</script>

<style lang="scss" scoped>
.gun-select {
    position: relative;
    width: 256px;
    line-height: 32px;
    padding: 0 10px;
    text-align: left;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s linear;
    &:hover {
        border-color: #bbb;
    }
    &.focus {
        box-shadow: 0 0 0 1px #3699ff;
    }
}
.select-input {
    width: 100%;
    padding: 0;
    color: #444;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
}
</style>