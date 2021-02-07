<template>
  <q-card flat class="socialCard">
    <q-card-section>
      <div class="socialCard__title">{{ title }}</div>
      <div class="socialCard__subtitle">
        <q-chip
          size="12px"
          clickable
          @click="setPlatformFilter"
          color="accent"
          text-color="white"
          class="socialCard__chip"
        >
          {{ platform }}
        </q-chip>
        <q-chip
          size="12px"
          clickable
          @click="setCategoryFilter"
          color="info"
          text-color="secondary"
          class="socialCard__chip"
        >
          {{ category }}
        </q-chip>
      </div>
    </q-card-section>

    <q-separator color="grey-3" inset class="socialCard__divider" />

    <q-card-actions class="socialCard__link" align="left">
      <q-btn flat :href="url" target="_blank" color="primary">VISIT</q-btn>
    </q-card-actions>
  </q-card>
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
    transition: box-shadow 0.5s ease;
    background-color: white;
    display: flex;
    flex-flow: column nowrap;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1) !important;

    &:hover {
      //   border: 1px solid rgba(218, 218, 218, 0.766);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2),
        0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
    }

    .socialCard__subtitle {
      letter-spacing: 0px;
      padding-top: 0.75rem;
    }

    .socialCard__chip {
      margin: 0 0.25rem 0.5rem 0;
    }

    .socialCard__title {
      font-size: 1rem;
      line-height: 1.25em;
      color: #5a4e3f;
      word-break: break-word;
      letter-spacing: 0px;
      font-family: SourceSansProDevanagariSemiBold;
    }

    .socialCard__divider {
      margin-top: auto;
    }

    .socialCard__link {
      font-family: SourceSansProDevanagariSemiBold;
      letter-spacing: 1px;
    }

    .socialCard__linkIcon {
      transform: translateY(-1px);
    }
  }
</style>
