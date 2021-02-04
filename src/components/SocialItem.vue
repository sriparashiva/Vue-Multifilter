<template>
  <div class="socialCard">
    <div class="socialCard__header">
      <v-chip x-small class="socialCard__platform">{{ platform }}</v-chip>
      <v-chip x-small class="socialCard__platform">{{ category }}</v-chip>
    </div>
    <p class="socialCard__title">{{ title }}</p>
    <!-- <v-btn color="#776551" text :href="url" target="_blank">
      View
    </v-btn> -->
    <a class="socialCard__link" :href="url" target="_blank"
      ><span>View</span
      ><v-icon x-small class="socialCard__linkIcon">
        mdi-chevron-double-right
      </v-icon>
    </a>
  </div>
</template>

<script>
  export default {
    name: "SocialItem",
    props: {
      title: String,
      url: String,
      platform: String,
      category: String,
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .socialCard {
    padding: 1rem;
    background-color: #ffffff;
    border: 1px solid rgba(218, 218, 218, 0.766);
    border-radius: 3px;
    transition: all 0.4ms ease;
    display: flex;
    flex-flow: column nowrap;

    &:hover {
      background-color: #f1eded;
      border: 1px solid #f1eded;
    }

    .socialCard__header {
      display: flex;
      flex-flow: row nowrap;
      gap: 1rem;
    }

    .socialCard__platform {
      color: #776551;
    }

    .socialCard__title {
      font-size: 0.88rem;
      line-height: 1.3em;
      font-weight: 500;
      color: #5a4e3f;
      margin-top: 1rem;
      font-family: AnodinaDevanagariBold;
    }

    a.socialCard__link {
      color: #5e2121;
      text-decoration: none;
      transition: all 0.4ms ease;
      font-size: 0.65em;
      margin-top: auto;
      width: fit-content;
      display: flex;
      align-items: center;
      text-transform: uppercase;
      letter-spacing: 1px;

      &:hover {
        color: #d1af83;
      }
    }
  }
</style>
