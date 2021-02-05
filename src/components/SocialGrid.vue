<template>
  <div>
    <div class="filters">
      <q-select
        filled
        use-input
        input-debounce="0"
        :options="platformSelectOptions"
        @filter="filterPlatformSelect"
        v-model="selectedPlatforms"
        multiple
        use-chips
        label="Platforms"
        hint="Filter by social media platform"
        class="filters__select"
        options-dense
        color="primary"
        style="width: 100%;"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        filled
        use-input
        input-debounce="0"
        :options="categories"
        v-model="selectedCategories"
        multiple
        use-chips
        label="Categories"
        hint="Filter by category"
        class="filters__select"
        options-dense
        color="primary"
        style="width: 100%"
      />
    </div>

    <div class="filters">
      <q-select
        filled
        v-model="selectedLanguage"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        clearable
        options-dense
        :options="languageSelectOptions"
        @filter="filterLanguagesSelect"
        label="Language"
        hint="View social media in your language"
        color="primary"
        style="width: 100%"
        class="filters__select"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        filled
        v-model="selectedRegion"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        clearable
        options-dense
        :options="regionSelectOptions"
        @filter="filterRegionsSelect"
        label="Region"
        hint="View social media related to your region"
        color="primary"
        style="width: 100%"
        class="filters__select"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <q-separator color="grey-5" inset style="margin-bottom: 2rem" />

    <div v-if="!dataImported" class="socialGrid">
      <q-card v-for="n in 8" :key="n" bordered flat style="max-width: 300px">
        <q-card-section>
          <q-skeleton type="text" height="30px" />
          <q-skeleton type="text" height="30px" />

          <div
            style="margin-top: 1rem; display: flex; flex-flow: row nowrap; gap: .5rem"
          >
            <q-skeleton type="QChip" width="75px" />
            <q-skeleton type="QChip" width="75px" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-skeleton type="QBtn" height="25px" width="75px" />
        </q-card-actions>
      </q-card>
    </div>
    <div v-else>
      <div v-if="filteredLinksToDisplay.length > 0">
        <q-infinite-scroll class="socialGrid" @load="loadMore" :offset="250">
          <social-item
            v-for="link in filteredLinksToDisplay"
            :key="link.id"
            :title="link.title"
            :url="link.url"
            :platform="link.platform"
            :category="link.category"
            @set-category-filter="setCategoryFilter"
            @set-platform-filter="setPlatformFilter"
            class="socialCardShown"
          />
          <social-item
            v-show="loadedLinks.length > 0"
            v-for="link in loadedLinks"
            :key="link.id"
            :title="link.title"
            :url="link.url"
            :platform="link.platform"
            :category="link.category"
          />
          <template v-slot:loading>
            <div
              v-if="loadBuffer.length > 0"
              class="row justify-center q-my-md"
            >
              <q-spinner color="accent" size="40px"></q-spinner>
            </div>
          </template>
        </q-infinite-scroll>
      </div>
      <div v-else class="socialGrid__noLinksMessage">No links to display</div>
    </div>
  </div>
</template>

<script>
  import SocialItem from "./SocialItem.vue";
  import axios from "axios";
  import intersection from "lodash.intersection";

  //Source data Google Sheet ID
  const sheetID = "1uy6AQ0m_PJd5zGhqICjvX1jgWs7-pBoIL9C8Dpjb5r8";
  // const sheetID = "1Lz4onaG5HB-ue84ka4QT0H1OrHrzIO2eRjnvzZCXPUY";
  export default {
    name: "SocialGrid",
    components: {
      SocialItem,
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
        platformSelectOptions: [],
        dataImported: false,
        loadedLinks: [],
        allLanguages: [],
        languageSelectOptions: [],
        selectedLanguage: null,
        allRegions: [],
        regionSelectOptions: [],
        selectedRegion: null,
      };
    },
    computed: {
      filteredLinks() {
        this.resetLoadedLinks();
        return intersection(
          this.filterPlatforms(),
          this.filterCategories(),
          this.filterLanguage(),
          this.filterRegion()
        );
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
            language: value.gsx$language.$t,
            region: value.gsx$geography.$t,
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
      loadMore(index, done) {
        setTimeout(() => {
          if (this.loadBuffer.length > 0) {
            this.loadedLinks = [
              ...this.loadedLinks,
              ...this.loadBuffer.splice(0, this.perPage),
            ];
            done();
          }
        }, 600);
      },
      resetLoadedLinks() {
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
      filterCategories() {
        if (this.selectedCategories.length > 0)
          return this.socialLinks.filter((link) =>
            this.selectedCategories.includes(link.category)
          );
        else return this.socialLinks;
      },
      filterPlatforms() {
        if (this.selectedPlatforms.length > 0)
          return this.socialLinks.filter((link) =>
            this.selectedPlatforms.includes(link.platform)
          );
        else return this.socialLinks;
      },
      filterLanguage() {
        if (this.selectedLanguage !== null)
          return this.socialLinks.filter(
            (link) => this.selectedLanguage === link.language
          );
        else return this.socialLinks;
      },
      filterRegion() {
        if (this.selectedRegion !== null)
          return this.socialLinks.filter(
            (link) => this.selectedRegion.value === link.region
          );
        else return this.socialLinks;
      },
      filterPlatformSelect(val, update) {
        if (val === "") {
          update(() => {
            this.platformSelectOptions = this.platforms;
          });
          return;
        }
        update(() => {
          const needle = val.toLowerCase();
          this.platformSelectOptions = this.platforms.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
      filterLanguagesSelect(val, update) {
        if (val === "") {
          update(() => {
            this.languageSelectOptions = this.allLanguages;
          });
          return;
        }
        update(() => {
          const needle = val.toLowerCase();
          this.languageSelectOptions = this.allLanguages.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
      filterRegionsSelect(val, update) {
        if (val === "") {
          update(() => {
            this.regionSelectOptions = this.allRegions;
          });
          return;
        }
        update(() => {
          const needle = val.toLowerCase();
          this.regionSelectOptions = this.allRegions.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        });
      },
      getLinksData() {
        axios
          .get(
            `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`
          )
          .then((response) => {
            this.dataImported = true;
            this.parseData(response.data.feed.entry);
          });
      },
      getLanguages() {
        axios
          .get(
            `https://spreadsheets.google.com/feeds/list/${sheetID}/2/public/values?alt=json`
          )
          .then((response) => this.parseLanguages(response.data.feed.entry));
      },
      getRegions() {
        axios
          .get(
            `https://spreadsheets.google.com/feeds/list/${sheetID}/3/public/values?alt=json`
          )
          .then((response) => this.parseRegions(response.data.feed.entry));
      },
      parseLanguages(entries) {
        entries.forEach((value) => this.allLanguages.push(value.gsx$name.$t));
      },
      parseRegions(entries) {
        entries.forEach((value) =>
          this.allRegions.push({
            label: value.gsx$name.$t,
            value: value.gsx$key.$t,
          })
        );
      },
    },
    created() {
      this.getLinksData();
      this.getLanguages();
      this.getRegions();
    },
  };
</script>

<style lang="scss" scoped>
  .socialGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    justify-content: center;
  }
  .filters {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    justify-content: space-between;
    margin: 1rem 0 2rem 0;
  }
  .filters__select {
    flex: 1 1 50%;
  }

  @media screen and (max-width: 768px) {
    .filters__select {
      flex: 1 1 100%;
    }
  }
  .socialGrid__noLinksMessage {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    color: #776551;
    font-size: 1.25rem;
  }
</style>
