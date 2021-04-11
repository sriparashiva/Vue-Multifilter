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

<style lang="scss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    letter-spacing: 0px !important;
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
    font-weight: 600;
    font-display: fallback;
  }
  @font-face {
    font-family: SourceSansProDevanagariRegular;
    src: url('./assets/fonts/SourceSansPro-DevanagariRegular.woff2')
        format('woff2'),
      /* Modern Browsers */
        url('./assets/fonts/SourceSansPro-DevanagariRegular.otf')
        format('opentype'); /* Safari, Android, iOS */
    font-weight: normal;
    text-rendering: optimizeLegibility;
    font-style: normal;
    font-weight: 400;
    font-display: fallback;
  }
  @font-face {
    font-family: SourceSansProDevanagariSemiBold;
    src: url('./assets/fonts/SourceSansPro-Devanagari-SemiBold.woff2')
        format('woff2'),
      /* Modern Browsers */
        url('./assets/fonts/SourceSansPro-Devanagari-SemiBold.otf')
        format('opentype'); /* Safari, Android, iOS */
    font-weight: normal;
    text-rendering: optimizeLegibility;
    font-style: normal;
    font-weight: 600;
    font-display: fallback;
  }
  $body-font: SourceSansProDevanagariRegular;
  $heading-font: SourceSansProDevanagariSemiBold;
  #app {
    font-family: $body-font, sans-serif;
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
  .socialLinks__header {
    h1 {
      font-family: $heading-font;
      font-weight: 600;
    }
  }
  .socialCard__link {
    font-family: $heading-font;
  }
  .socialCard__title {
    font-family: $heading-font;
  }
  .socialCounter__number {
    font-size: 2rem;
    font-weight: 600;
    font-family: $heading-font;
  }

  .socialCounter__title {
    font-family: $heading-font;
    font-weight: 600;
  }
  .totalCount {
    font-family: $heading-font;
  }
</style>
