<template>
    <div id="app">
        <!-- <div id="nav"> -->
        <!-- <router-link to="/">Home</router-link> -->
        <!-- | -->
        <!-- <router-link to="/about">About</router-link> -->
        <!-- </div> -->
        <!-- <router-view /> -->
        <h3>ScrollContainer</h3>
        <gun-scroll-container style="height: 200px">
            <div>
                <p
                    v-for="(i, index) in scrollContainer.list"
                    :key="index"
                >测试ScrollContainer,{{index}}</p>
            </div>
        </gun-scroll-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            scrollContainer: {
                list: new Array(20)
            }
        };
    }
};
</script>

<style lang="scss">
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
