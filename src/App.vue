<template>
  <div id="app">
    <social-grid />
  </div>
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
  @font-face {
    font-family: SourceSansProDevanagariRegular;
    src: url("./assets/fonts/SourceSansProDevanagariRegular.ttf");
  }
  @font-face {
    font-family: SourceSansProDevanagariSemiBold;
    src: url("./assets/fonts/SourceSansProDevanagariSemiBold.ttf");
  }
  #app {
    font-family: SourceSansProDevanagariRegular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #5f4444;
    margin-top: 60px;
    width: 80%;
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 3rem;
  }
</style>
