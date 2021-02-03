<template>
  <div class="socialCard">
    <h4 class="socialCard__title">{{ title }}</h4>
    <a class="socialCard__link" :href="url" target="_blank">Visit</a>
  </div>
</template>

<script>
  export default {
    name: "SocialItem",
    props: {
      title: String,
      url: String,
      platform: String,
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .socialCard {
    padding: 1rem;
    background-color: #f1eded;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-radius: 5px;
    transition: all 0.4ms ease;

    &:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .socialCard__title {
      font-size: 1rem;
      color: #5e2121;
    }

    .socialCard__link {
      color: #5e2121;
      &:hover {
        color: #d1af83;
      }
    }
  }
</style>
