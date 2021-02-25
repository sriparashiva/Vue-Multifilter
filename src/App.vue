<template>
  <div id="app">
    <social-grid />
  </div>
</template>

<script>
  import SocialGrid from './components/SocialGrid.vue'
  export default {
    name: 'App',
    components: {
      SocialGrid,
    },
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  @font-face {
    font-family: UpgradeDevanagariRegular;
    src: url('./assets/fonts/Upgrade-Devanagari-Regular.woff2') format('woff2'),
      /* Modern Browsers */ url('./assets/fonts/Upgrade-Devanagari-Regular.otf')
        format('opentype'); /* Safari, Android, iOS */
    font-weight: normal;
    text-rendering: optimizeLegibility;
    font-style: normal;
    font-weight: 400;
    font-display: fallback;
  }
  @font-face {
    font-family: UpgradeDevanagariMedium;
    src: url('./assets/fonts/Upgrade-Devanagari-Medium.woff2') format('woff2'),
      /* Modern Browsers */ url('./assets/fonts/Upgrade-Devanagari-Medium.otf')
        format('opentype'); /* Safari, Android, iOS */
    font-weight: normal;
    text-rendering: optimizeLegibility;
    font-style: normal;
    font-weight: 500;
    font-display: fallback;
  }
  #app {
    font-family: UpgradeDevanagariRegular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #5f4444;
    margin-top: 1.5rem;
    width: 80%;
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 3rem;
  }
</style>
