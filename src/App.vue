<template>
  <v-app>
    <v-main>
      <social-grid />
    </v-main>
  </v-app>
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
    font-family: AnodinaDevanagariBold;
    src: url(https://nithyanandauniversity.github.io/fontrepo/AnodinaDevanagari/Anodina-Devanagari-Bold.ttf);
  }

  @font-face {
    font-family: AnodinaDevanagariRegular;
    src: url(https://nithyanandauniversity.github.io/fontrepo/AnodinaDevanagari/AnodinaDevanagariRegular.ttf);
  }
  #app {
    font-family: AnodinaDevanagariRegular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: 60px;
    width: 80%;
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 3rem;
  }
</style>
