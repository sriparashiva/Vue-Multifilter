<template>
  <v-card elevation="2" class="socialCard">
    <v-card-title class="socialCard__title"> {{ title }}</v-card-title>
    <v-card-subtitle class="socialCard__subtitle">
      <v-chip
        small
        @click="setPlatformFilter"
        color="#B69D7E"
        class="socialCard__chip"
        >{{ platform }}</v-chip
      >
      <v-chip small @click="setCategoryFilter" class="socialCard__chip-light">{{
        category
      }}</v-chip>
    </v-card-subtitle>

    <v-card-actions class="socialCard__link">
      <v-divider class="socialCard__divider"></v-divider>

      <v-btn color="#5e2121" text :href="url" target="_blank">
        VISIT<v-icon x-small class="socialCard__linkIcon">
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
    emits: ["set-category-filter", "set-platform-filter"],
    methods: {
      setCategoryFilter() {
        this.$emit("set-category-filter", this.category);
      },
      setPlatformFilter() {
        this.$emit("set-platform-filter", this.platform);
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .socialCard {
    transition: background-color 0.5s ease;
    background-color: white;
    display: flex;
    flex-flow: column nowrap;

    &:hover {
      //   border: 1px solid rgba(218, 218, 218, 0.766);
      background-color: #f1eded;
    }

    .socialCard__subtitle {
      display: flex;
      flex-flow: row;
      gap: 0.5rem;
      letter-spacing: 0px;
      padding-top: 0.75rem;
    }

    .socialCard__chip {
      color: #fff;
    }

    .socialCard__chip-light {
      color: #5a4e3f;
    }

    .socialCard__title {
      font-size: 1rem;
      line-height: 1.25em;
      color: #5a4e3f;
      word-break: break-word;
      letter-spacing: 0px;
      font-family: SourceSansProDevanagariSemiBold;
    }

    .socialCard__link {
      margin-top: auto;
      font-family: SourceSansProDevanagariSemiBold;
    }

    .socialCard__linkIcon {
      transform: translateY(-1px);
    }
  }
</style>
