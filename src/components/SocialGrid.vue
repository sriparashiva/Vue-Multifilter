<template>
  <div class="filters">
    <div class="filters__heading">Filter by Category:</div>
    <div class="filters__btnGroup">
      <button
        class="filters__btn"
        :class="{ active: allCategories }"
        @click="toggleAllCategories"
      >
        All
      </button>
      <button
        v-for="(category, index) in categories"
        :key="index"
        class="filters__btn"
        :class="{ active: category.active }"
        @click="toggleCategory(category)"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
  <div class="filters">
    <div class="filters__heading">Filter by Platform:</div>
    <div class="filters__btnGroup">
      <div class="filters__checkbox">
        <input
          type="checkbox"
          id="allPlatforms"
          v-model="allPlatforms"
          @change="toggleAllPlatforms"
        /><label for="allPlatforms">All</label>
      </div>
      <div
        class="filters__checkbox"
        v-for="(platform, index) in platforms"
        :key="index"
      >
        <input
          type="checkbox"
          :id="platform.name"
          v-model="platform.active"
          @change="togglePlatform(platform)"
        /><label :for="platform.name">{{ platform.name }}</label>
      </div>
    </div>
  </div>
  <div class="socialGrid">
    <social-item
      v-for="link in filteredLinks"
      :key="link.id"
      :title="link.title"
      :url="link.url"
      :platform="link.platform"
    />
  </div>
</template>

<script>
  import SocialItem from "./SocialItem.vue";
  import axios from "axios";

  //Source data Google Sheet ID
  const sheetID = "1uy6AQ0m_PJd5zGhqICjvX1jgWs7-pBoIL9C8Dpjb5r8";
  export default {
    name: "SocialGrid",
    components: {
      SocialItem,
    },
    data() {
      return {
        socialLinks: [],
        categories: [],
        platforms: [],
        allCategories: true,
        allPlatforms: true,
        activeCategories: [],
        activePlatforms: [],
      };
    },
    computed: {
      filteredLinks() {
        // If any category/platform filters have been selected
        if (
          this.activeCategories.length > 0 ||
          this.activePlatforms.length > 0
        ) {
          // If all categories are selected, filter only for platforms
          if (this.allCategories) {
            return this.socialLinks.filter((link) =>
              this.activePlatforms.includes(link.platform)
            );
          }
          // If all platforms are selected, filter only for categories
          else if (this.allPlatforms) {
            return this.socialLinks.filter((link) =>
              this.activeCategories.includes(link.category)
            );
          }
          // If both categories and platforms are selected, filter for both
          else {
            return this.socialLinks.filter(
              (link) =>
                this.activeCategories.includes(link.category) &&
                this.activePlatforms.includes(link.platform)
            );
          }
        }
        // If no categories/platforms are selected, display all links
        else {
          return this.socialLinks;
        }
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
          categorySet.add(value.gsx$category.$t);

          // Add to the set of categories
          platformSet.add(value.gsx$platform.$t);

          // Push entry into the list of all links
          this.socialLinks.push(entry);
        });

        // Add all categories from the Set to the object array
        categorySet.forEach((category) =>
          this.categories.push({ name: category, active: false })
        );

        // Add all platforms from the Set to the object array
        platformSet.forEach((platform) =>
          this.platforms.push({ name: platform, active: false })
        );
      },
      toggleCategory(category) {
        category.active = !category.active;

        // If this category filter has been turned on, add it to the active categories list and turn off the 'All' button
        if (category.active) {
          this.allCategories = false;
          this.activeCategories.push(category.name);
        }
        // If this category filter has been turned off
        else {
          // Remove it from the active categories list
          this.activeCategories = this.activeCategories.filter(
            (activeCategory) => activeCategory !== category.name
          );
          // If no other categories remain in active list, turn on the 'All' button
          if (this.activeCategories.length === 0) this.allCategories = true;
        }
      },
      togglePlatform(platform) {
        // If this platform filter has been turned on, add it to the active platforms list and turn off the 'All' button
        if (platform.active) {
          this.allPlatforms = false;
          this.activePlatforms.push(platform.name);
        }
        // If this platform filter has been turned off
        else {
          // Remove it from the active platforms list
          this.activePlatforms = this.activePlatforms.filter(
            (activePlatform) => activePlatform !== platform.name
          );
          // If no other platforms remain in active list, turn on the 'All' button
          if (this.activePlatforms.length === 0) this.allPlatforms = true;
        }
      },
      toggleAllCategories() {
        this.allCategories = !this.allCategories;
        if (this.allCategories) {
          this.categories.forEach((category) => (category.active = false));
          this.activeCategories = [];
        }
      },
      toggleAllPlatforms() {
        if (this.allPlatforms) {
          this.platforms.forEach((platform) => (platform.active = false));
          this.activePlatforms = [];
        }
      },
    },
    created() {
      axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`
        )
        .then((response) => this.parseData(response.data.feed.entry));
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .socialGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  .filters {
    display: flex;
    margin: 1rem 0;

    .filters__btnGroup {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      gap: 0.5rem;
      margin-left: 1rem;
    }

    .filters__checkbox {
      display: flex;
      align-items: center;
      label {
        color: #5e2121;
        font-size: 0.88rem;
        margin-left: 0.25rem;
      }
    }

    .filters__btn {
      padding: 0.25rem;
      background: #f1eded;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      color: #5e2121;
      transition: all 0.3s ease;

      &:hover {
        background: #5e2121;
        color: #fff;
      }
      &.active {
        background: #5e2121;
        color: #fff;
      }
    }
  }
</style>
