<template>
    <div id="app">
        <!-- <div id="nav"> -->
        <!-- <router-link to="/">Home</router-link> -->
        <!-- | -->
        <!-- <router-link to="/about">About</router-link> -->
        <!-- </div> -->
        <!-- <router-view /> -->

        <!-- CanvasPad -->
        <h3>Canvas2dPad</h3>
        <gun-canvas2d-pad id="myCanvasPad"></gun-canvas2d-pad>
        <!-- ScrollContainer -->
        <h3>ScrollContainer</h3>
        <gun-scroll-container style="width: 300px;height: 200px;margin:0 auto;" showX>
            <div style="width: 500px">
                <p
                    class="white-space: nowrap;"
                    v-for="(i, index) in scrollContainer.list"
                    :key="index"
                >测试ScrollContainer,测试ScrollContainer,测试ScrollContainer,{{index}}</p>
            </div>
        </gun-scroll-container>
        <hr />
        <!-- Select -->
        <h3>Select</h3>
        <gun-select
            style="margin:0 auto;"
            v-model="select.value"
            :options="select.options"
            @toggle="toggleSelect"
            @change="changeSelect"
        >
            <!-- <gun-option></gun-option> -->
        </gun-select>
    </div>
</template>

<script>
export default {
    data() {
        return {
            scrollContainer: {
                list: new Array(20)
            },
            select: {
                value: "",
                options: [
                    {
                        value: "value0",
                        label: "蜜汁凤爪",
                        price: 12
                    },
                    {
                        value: "value1",
                        label: "水晶虾饺",
                        price: 14
                    },
                    {
                        value: "value2",
                        label: "叉烧布拉肠",
                        price: 10
                    },
                    {
                        value: "value3",
                        label: "荷叶糯米鸡",
                        price: 7.5
                    },
                    {
                        value: "value4",
                        label: "黄金流沙包",
                        price: 5
                    },
                    {
                        value: "value5",
                        label: "三丝炒米粉",
                        price: 10
                    },
                    {
                        value: "value6",
                        label: "板烧鸡腿堡",
                        price: 9
                    },
                    {
                        value: "value7",
                        label: "菠萝咕噜肉",
                        price: 13
                    },
                    {
                        value: "value8",
                        label: "三杯鸡",
                        price: 8.5
                    },
                    {
                        value: "value9",
                        label: "冰淇淋面包",
                        price: 15
                    }
                ]
            }
        };
    },
    mounted() {
        let list = [
            {
                id: 1,
                isExtend: true,
                time: "2019-01-21",
                value: "12",
                prepOrder: 2
            },
            {
                id: 2,
                isExtend: false,
                time: "2019-01-11",
                value: "",
                prepOrder: 1
            },
            {
                id: 3,
                isExtend: true,
                time: "2019-01-11",
                value: "",
                apOrder: 2
            },
            {
                id: 4,
                isExtend: false,
                name: "a4",
                time: "2020-06-11",
                apOrder: 1
            },
            {
                id: 5,
                isExtend: true,
                name: "a5",
                time: "2020-01-07",
                sortIndex: 2
            },
            {
                id: 6,
                isExtend: false,
                name: "a6",
                time: "2019-01-11",
                sortIndex: 22
            },
            {
                id: 7,
                isExtend: false,
                name: "a7",
                time: "2019-01-12"
            }
        ];
        let test = [3, 6, 2, 2, 7, 1];
        this.$GunUtils.sort.merge(test, {
            sortKey: "sortIndex"
        });
        console.log(test);
        // console.log(
        //     this.$GunUtils.sort.merge(list, {
        //         sortKey: "sortIndex"
        //     })
        // );
    },
    methods: {
        toggleSelect(val) {
            // console.log("toggleSelect:", val);
        },
        changeSelect(val, info) {
            // console.log("changeSelect:", val, info);
        }
    }
};
</script>

<style lang="scss">
* {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
body {
    min-width: 1024px;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
