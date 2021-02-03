<template>
  <social-grid />
</template>

<script>
  import SocialGrid from "./components/SocialGrid.vue";

  export default {
    name: "App",
    components: {
      SocialGrid,
    },
  };
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
    width: 80%;
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
