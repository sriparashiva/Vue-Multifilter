<template>
  <q-card flat bordered class="socialCard">
    <q-card-section>
      <div class="socialCard__title">{{ title }}</div>
      <div class="socialCard__subtitle">
        <q-chip
          size="12px"
          clickable
          @click="setPlatformFilter"
          color="positive"
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
      <q-btn
        flat
        type="a"
        :href="url"
        target="_blank"
        label="VISIT"
        color="primary"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
  export default {
    name: 'SocialItem',
    props: {
      title: String,
      url: String,
      platform: String,
      category: String,
    },
    emits: ['set-category-filter', 'set-platform-filter'],
    methods: {
      setCategoryFilter() {
        this.$emit('set-category-filter', this.category)
      },
      setPlatformFilter() {
        this.$emit('set-platform-filter', this.platform)
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .socialCard {
    padding: 0.25rem;
    // transition: box-shadow 0.5s ease;
    transition: transform 0.3s ease;
    background-color: white;
    display: flex;
    flex-flow: column nowrap;

    &:hover {
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.1) !important;
      transform: translateY(-3px);
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
      font-weight: 600;
    }

    .socialCard__divider {
      margin-top: auto;
    }

    .socialCard__linkIcon {
      transform: translateY(-1px);
    }
  }
</style>
