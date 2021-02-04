<template>
  <v-card elevation="2" class="socialCard">
    <v-card-subtitle class="socialCard__header">
      <v-chip small class="socialCard__platform">{{ platform }}</v-chip>
      <v-chip small class="socialCard__platform">{{ category }}</v-chip>
    </v-card-subtitle>
    <v-card-title class="socialCard__title"> {{ title }}</v-card-title>
    <v-divider class="socialCard__divider"></v-divider>

    <v-card-actions class="socialCard__link">
      <v-btn color="#5e2121" text :href="url" target="_blank">
        VIEW<v-icon x-small class="socialCard__linkIcon">
          mdi-chevron-double-right
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
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
    padding: 0.5rem 0.5rem 0 0.5rem;
    transition: background-color 0.5s ease;
    background-color: white;
    display: flex;
    flex-flow: column nowrap;

    &:hover {
      //   border: 1px solid rgba(218, 218, 218, 0.766);
      background-color: #f1eded;
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
      font-size: 1rem;
      line-height: 1.3em;
      font-weight: 500;
      color: #5a4e3f;
      font-family: AnodinaDevanagariBold;
      word-break: break-word;
      padding-top: 0;
    }

    .socialCard__divider {
      margin-top: auto;
    }

    .socialCard__link {
      margin-top: auto;
    }

    .socialCard__linkIcon {
      transform: translateY(-1px);
    }
  }
</style>
