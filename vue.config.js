module.exports = {
  productionSourceMap: false,

  transpileDependencies: [
    'vuetify',
    'quasar'
  ],

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
};
