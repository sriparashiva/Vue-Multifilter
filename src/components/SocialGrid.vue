<template>
  <div>
    <div class="filters">
      <v-select
        v-model="selectedPlatforms"
        :items="platforms"
        label="Platforms"
        multiple
        chips
        hint="Filter by platforms"
        persistent-hint
        class="filters__select"
      ></v-select>
      <v-select
        v-model="selectedCategories"
        :items="categories"
        label="Categories"
        multiple
        chips
        hint="Filter by categories"
        persistent-hint
        class="filters__select"
      ></v-select>
    </div>

    <div class="socialGrid">
      <template v-if="!dataImported">
        <v-sheet v-for="n in 8" :key="n" :color="`grey lighten-4`" class="pa-3">
          <v-card elevation="0" outlined>
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="article"
            ></v-skeleton-loader>
          </v-card>
        </v-sheet>
      </template>
      <template v-else>
        <template
          v-if="filteredLinksToDisplay.length > 0"
          transition="fade-transition"
        >
          <social-item
            v-for="link in filteredLinksToDisplay"
            :key="link.id"
            :title="link.title"
            :url="link.url"
            :platform="link.platform"
            :category="link.category"
            transition="fade-transition"
            @set-category-filter="setCategoryFilter"
            @set-platform-filter="setPlatformFilter"
          />
        </template>
        <div v-else class="socialGrid__noLinksMessage">No links to display</div>

        <template v-if="loadedLinks.length > 0">
          <social-item
            v-for="link in loadedLinks"
            :key="link.id"
            :title="link.title"
            :url="link.url"
            :platform="link.platform"
            :category="link.category"
          />
        </template>
      </template>
    </div>
    <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
      <!-- The no-more slot will not be displayed -->
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </infinite-loading>
  </div>
</template>

<script>
  import SocialItem from "./SocialItem.vue";
  import axios from "axios";
  import InfiniteLoading from "vue-infinite-loading";

  //Source data Google Sheet ID
  const sheetID = "1uy6AQ0m_PJd5zGhqICjvX1jgWs7-pBoIL9C8Dpjb5r8";
  export default {
    name: "SocialGrid",
    components: {
      SocialItem,
      InfiniteLoading,
    },
    data() {
      return {
        socialLinks: [],
        displayedLinks: [],
        perPage: 30,
        categories: [],
        selectedCategories: [],
        platforms: [],
        selectedPlatforms: [],
        dataImported: false,
        loadedLinks: [],
        infiniteId: +new Date(),
      };
    },
    computed: {
      filteredLinks() {
        // If both categories and platforms are selected, filter for both
        if (
          this.selectedCategories.length > 0 &&
          this.selectedPlatforms.length > 0
        ) {
          this.resetLoadedLinks();
          return this.socialLinks.filter(
            (link) =>
              this.selectedCategories.includes(link.category) &&
              this.selectedPlatforms.includes(link.platform)
          );
        }
        // If only categories are selected, filter for categories
        else if (
          this.selectedCategories.length > 0 &&
          this.selectedPlatforms.length === 0
        ) {
          this.resetLoadedLinks();
          return this.socialLinks.filter((link) =>
            this.selectedCategories.includes(link.category)
          );
        }
        // If only platforms are selected, filter for platforms
        else if (
          this.selectedCategories.length === 0 &&
          this.selectedPlatforms.length > 0
        ) {
          this.resetLoadedLinks();
          return this.socialLinks.filter((link) =>
            this.selectedPlatforms.includes(link.platform)
          );
        }
        // If no categories/platforms are selected, display all links
        else {
          this.resetLoadedLinks();
          return this.socialLinks;
        }
      },
      loadBuffer() {
        return this.filteredLinks.filter((link, index) => index > 30);
      },
      filteredLinksToDisplay() {
        return this.filteredLinks.filter((link, index) => index < 30);
      },
    },
    methods: {
      parseData(entries) {
        let categorySet = new Set();
        let platformSet = new Set();

        entries.forEach((value) => {
          let entry = {
            id: value.id.$t,
            platform: value.gsx$platform.$t,
            title: value.gsx$title.$t,
            url: value.gsx$url.$t,
            category: value.gsx$category.$t,
          };

          // Add to the set of categories
          if (value.gsx$category.$t !== "")
            categorySet.add(value.gsx$category.$t);

          // Add to the set of categories
          if (value.gsx$platform.$t !== "")
            platformSet.add(value.gsx$platform.$t);

          // Push entry into the list of all links
          this.socialLinks.push(entry);
        });

        // Add category set to array of categories
        this.categories = [...categorySet];
        // Add platforms set to array of platforms
        this.platforms = [...platformSet];
      },
      infiniteHandler($state) {
        if (this.loadBuffer.length) {
          this.loadedLinks = [
            ...this.loadedLinks,
            ...this.loadBuffer.splice(0, this.perPage),
          ];
          $state.loaded();
        } else {
          $state.complete();
        }
      },
      resetLoadedLinks() {
        this.infiniteId += 1;
        this.loadedLinks = [];
      },
      setCategoryFilter(category) {
        this.selectedCategories = [category];
        this.selectedPlatforms = [];
      },
      setPlatformFilter(platform) {
        this.selectedCategories = [];
        this.selectedPlatforms = [platform];
      },
    },
    created() {
      axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`
        )
        .then((response) => {
          this.dataImported = true;
          this.parseData(response.data.feed.entry);
        });
    },
  };
</script>

<style lang="scss" scoped>
  .socialGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    justify-content: center;

    .socialGrid__noLinksMessage {
      display: flex;
      justify-content: center;
      margin-top: 3rem;
      color: #717171;
    }
  }
  .filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0 3rem 0;

    .filters__select {
      max-width: 45%;
    }
  }
</style>
