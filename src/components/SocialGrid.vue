<template>
  <div>
    <div class="socialLinks__header">
      <h1 class="text-h4 text-weight-bold text-center">
        KAILASA's Digital Media Initiatives
      </h1>
      <div class="text-subtitle1 text-center">
        Over 1 Billion Lives Enriched Worldwide
      </div>
    </div>

    <div
      v-if="dataImported"
      class="socialCounters row justify-evenly align-center"
    >
      <div class="socialCounter col-xs-12 col-sm-6 col-md-3">
        <div class="socialCounter__number">
          {{ formatNumber(socialLinks.length) }}
        </div>
        <div class="socialCounter__title">
          Digital Media Assets
        </div>
      </div>
      <div class="socialCounter col-xs-12 col-sm-6 col-md-3">
        <div class="socialCounter__number">
          {{ formatNumber(platforms.length) }}
        </div>
        <div class="socialCounter__title">
          Social Media and Web Platforms
        </div>
      </div>
      <div class="socialCounter col-xs-12 col-sm-6 col-md-3">
        <div class="socialCounter__number">
          {{ formatNumber(languages.length) }}
        </div>
        <div class="socialCounter__title">
          Languages
        </div>
      </div>
      <div class="socialCounter col-xs-12 col-sm-6 col-md-3">
        <div class="socialCounter__number">
          {{ formatNumber(regions.length) }}
        </div>
        <div class="socialCounter__title">
          Regions of the World
        </div>
      </div>
    </div>

    <div class="filters">
      <q-select
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
        v-model="selectedRegion"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        clearable
        options-dense
        emit-value
        map-options
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

    <q-separator color="grey-3" class="socialGrid__separator" />

    <div v-if="filteredLinks.length < socialLinks.length" class="resultsCount">
      Showing {{ formatNumber(filteredLinks.length) }} matching result{{
        filteredLinks.length > 1 ? 's' : ''
      }}
    </div>

    <div v-if="!dataImported" class="socialGrid">
      <q-card
        v-for="n in 8"
        :key="n"
        flat
        style="max-width: 300px"
        class="socialGrid__skeleton"
      >
        <q-card-section>
          <q-skeleton type="text" height="30px" />
          <q-skeleton type="text" height="30px" />

          <div
            style="margin-top: 1rem; margin-bottom: 1rem; display: flex; flex-flow: row nowrap; gap: .5rem"
          >
            <q-skeleton type="QChip" width="75px" />
            <q-skeleton type="QChip" width="75px" />
          </div>

          <q-separator
            color="grey-3"
            style="margin-bottom: 1rem;"
            inset
            class="socialCard__divider"
          />

          <q-skeleton type="QBtn" height="25px" width="75px" />
        </q-card-section>
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
      <div v-else class="socialGrid__noLinksMessage">No results to display</div>
    </div>
  </div>
</template>

<script>
  import SocialItem from './SocialItem.vue'
  import axios from 'axios'
  import intersection from 'lodash.intersection'

  //Source data Google Sheet ID
  const sheetID = '1uy6AQ0m_PJd5zGhqICjvX1jgWs7-pBoIL9C8Dpjb5r8'
  // const sheetID = "1Lz4onaG5HB-ue84ka4QT0H1OrHrzIO2eRjnvzZCXPUY";

  const regionOptions = [
    { label: 'Aruba', value: 'ABW' },
    { label: 'Afghanistan', value: 'AFG' },
    { label: 'Africa', value: 'AFR' },
    { label: 'Angola', value: 'AGO' },
    { label: 'Anguilla', value: 'AIA' },
    { label: 'Åland Islands', value: 'ALA' },
    { label: 'Albania', value: 'ALB' },
    { label: 'Andorra', value: 'AND' },
    { label: 'Netherlands Antilles', value: 'ANT' },
    { label: 'United Arab Emirates', value: 'ARE' },
    { label: 'Argentina', value: 'ARG' },
    { label: 'Armenia', value: 'ARM' },
    { label: 'Asia Others', value: 'ASA' },
    { label: 'American Samoa', value: 'ASM' },
    { label: 'Antigua and Barbuda', value: 'ATG' },
    { label: 'Australia', value: 'AUS' },
    { label: 'Austria', value: 'AUT' },
    { label: 'Azerbaijan', value: 'AZE' },
    { label: 'Burundi', value: 'BDI' },
    { label: 'Belgium', value: 'BEL' },
    { label: 'Benin', value: 'BEN' },
    { label: 'Burkina Faso', value: 'BFA' },
    { label: 'Bangladesh', value: 'BGD' },
    { label: 'Bulgaria', value: 'BGR' },
    { label: 'Bahrain', value: 'BHR' },
    { label: 'Bahamas', value: 'BHS' },
    { label: 'Bosnia and Herzegovina', value: 'BIH' },
    { label: 'Saintélemy', value: 'BLM' },
    { label: 'Belarus', value: 'BLR' },
    { label: 'Belize', value: 'BLZ' },
    { label: 'Bermuda', value: 'BMU' },
    { label: 'Bolivia', value: 'BOL' },
    { label: 'Brazil', value: 'BRA' },
    { label: 'Barbados', value: 'BRB' },
    { label: 'Brunei Darussalam', value: 'BRN' },
    { label: 'Bhutan', value: 'BTN' },
    { label: 'Botswana', value: 'BWA' },
    { label: 'Central African Republic', value: 'CAF' },
    { label: 'Canada', value: 'CAN' },
    { label: 'Switzerland', value: 'CHE' },
    { label: 'Chile', value: 'CHL' },
    { label: 'China', value: 'CHN' },
    { label: "Côte d'Ivoire", value: 'CIV' },
    { label: 'Cameroon', value: 'CMR' },
    { label: 'Central Ameria', value: 'CNA' },
    { label: 'Democratic Republic of the Congo', value: 'COD' },
    { label: 'Congo', value: 'COG' },
    { label: 'Cook Islands', value: 'COK' },
    { label: 'Colombia', value: 'COL' },
    { label: 'Comoros', value: 'COM' },
    { label: 'Cape Verde', value: 'CPV' },
    { label: 'Carribean', value: 'CRB' },
    { label: 'Costa Rica', value: 'CRI' },
    { label: 'Cuba', value: 'CUB' },
    { label: 'Cayman Islands', value: 'CYM' },
    { label: 'Cyprus', value: 'CYP' },
    { label: 'Czech Republic', value: 'CZE' },
    { label: 'Germany', value: 'DEU' },
    { label: 'Djibouti', value: 'DJI' },
    { label: 'Dominica', value: 'DMA' },
    { label: 'Denmark', value: 'DNK' },
    { label: 'Dominican Republic', value: 'DOM' },
    { label: 'Algeria', value: 'DZA' },
    { label: 'Ecuador', value: 'ECU' },
    { label: 'Egypt', value: 'EGY' },
    { label: 'Eritrea', value: 'ERI' },
    { label: 'Western Sahara', value: 'ESH' },
    { label: 'Spain', value: 'ESP' },
    { label: 'Estonia', value: 'EST' },
    { label: 'Ethiopia', value: 'ETH' },
    { label: 'Europe Others', value: 'EUR' },
    { label: 'Finland', value: 'FIN' },
    { label: 'Fiji', value: 'FJI' },
    { label: 'Falkland Islands (Malvinas)', value: 'FLK' },
    { label: 'France', value: 'FRA' },
    { label: 'Faeroe Islands', value: 'FRO' },
    { label: 'Micronesia, Federated States of', value: 'FSM' },
    { label: 'Gabon', value: 'GAB' },
    {
      label: 'United Kingdom of Great Britain and Northern Ireland',
      value: 'GBR',
    },
    { label: 'Georgia', value: 'GEO' },
    { label: 'Guernsey', value: 'GGY' },
    { label: 'Ghana', value: 'GHA' },
    { label: 'Gibraltar', value: 'GIB' },
    { label: 'Guinea', value: 'GIN' },
    { label: 'Guadeloupe', value: 'GLP' },
    { label: 'Gambia', value: 'GMB' },
    { label: 'Guinea Bissau', value: 'GNB' },
    { label: 'Equatorial Guinea', value: 'GNQ' },
    { label: 'Greece', value: 'GRC' },
    { label: 'Grenada', value: 'GRD' },
    { label: 'Greenland', value: 'GRL' },
    { label: 'Guatemala', value: 'GTM' },
    { label: 'French Guiana', value: 'GUF' },
    { label: 'Guam', value: 'GUM' },
    { label: 'Guyana', value: 'GUY' },
    {
      label: 'Hong Kong Special Administrative Region of China',
      value: 'HKG',
    },
    { label: 'Honduras', value: 'HND' },
    { label: 'Croatia', value: 'HRV' },
    { label: 'Haiti', value: 'HTI' },
    { label: 'Hungary', value: 'HUN' },
    { label: 'Indonesia', value: 'IDN' },
    { label: 'Isle of Man', value: 'IMN' },
    { label: 'India', value: 'IND' },
    { label: 'India-Andaman and Nicobar Islands', value: 'IND-AN' },
    { label: 'India-Andhra Pradesh', value: 'IND-AP' },
    { label: 'India-Arunachal Pradesh', value: 'IND-AR' },
    { label: 'India-Assam', value: 'IND-AS' },
    { label: 'India-Bihar', value: 'IND-BR' },
    { label: 'India-Chhattisgarh', value: 'IND-CG' },
    { label: 'India-Chandigarh', value: 'IND-CH' },
    { label: 'India-Daman and Diu', value: 'IND-DD' },
    { label: 'India-Dadra and Nagar Haveli', value: 'IND-DH' },
    { label: 'India-Delhi', value: 'IND-DL' },
    { label: 'India-Goa', value: 'IND-GA' },
    { label: 'India-Gujarat', value: 'IND-GJ' },
    { label: 'India-Himachal Pradesh', value: 'IND-HP' },
    { label: 'India-Haryana', value: 'IND-HR' },
    { label: 'India-Jharkhand', value: 'IND-JH' },
    { label: 'India-Jammu and Kashmir', value: 'IND-JK' },
    { label: 'India-Karnataka', value: 'IND-KA' },
    { label: 'India-Kerala', value: 'IND-KL' },
    { label: 'India-Lakshadweep', value: 'IND-LD' },
    { label: 'India-Maharashtra', value: 'IND-MH' },
    { label: 'India-Meghalaya', value: 'IND-ML' },
    { label: 'India-Manipur', value: 'IND-MN' },
    { label: 'India-Madhya Pradesh', value: 'IND-MP' },
    { label: 'India-Mizoram', value: 'IND-MZ' },
    { label: 'India-Nagaland', value: 'IND-NL' },
    { label: 'India-Orissa', value: 'IND-OR' },
    { label: 'India-Punjab', value: 'IND-PB' },
    { label: 'India-Pondicherry', value: 'IND-PY' },
    { label: 'India-Rajasthan', value: 'IND-RJ' },
    { label: 'India-Sikkim', value: 'IND-SK' },
    { label: 'India-Tamil Nadu', value: 'IND-TN' },
    { label: 'Tamil Nadu-Ariyalur', value: 'IND-TN-AR' },
    { label: 'Tamil Nadu-Chengalpattu', value: 'IND-TN-CG' },
    { label: 'Tamil Nadu-Chennai', value: 'IND-TN-CH' },
    { label: 'Tamil Nadu-Coimbatore', value: 'IND-TN-CO' },
    { label: 'Tamil Nadu-Cuddalore', value: 'IND-TN-CU' },
    { label: 'Tamil Nadu-Dharmapuri', value: 'IND-TN-DH' },
    { label: 'Tamil Nadu-Dindigul', value: 'IND-TN-DI' },
    { label: 'Tamil Nadu-Erode', value: 'IND-TN-ER' },
    { label: 'Tamil Nadu-Kanchipuram', value: 'IND-TN-KC' },
    { label: 'Tamil Nadu-Krishnagiri', value: 'IND-TN-KG' },
    { label: 'Tamil Nadu-Kanniyakumari', value: 'IND-TN-KK' },
    { label: 'Tamil Nadu-Karur', value: 'IND-TN-KR' },
    { label: 'Tamil Nadu-Madurai', value: 'IND-TN-MA' },
    { label: 'Tamil Nadu-Nagapattinam', value: 'IND-TN-NG' },
    { label: 'Tamil Nadu-The Nilgiris', value: 'IND-TN-NI' },
    { label: 'Tamil Nadu-Namakkal', value: 'IND-TN-NM' },
    { label: 'Tamil Nadu-Perambalur', value: 'IND-TN-PE' },
    { label: 'Tamil Nadu-Pudukkottai', value: 'IND-TN-PU' },
    { label: 'Tamil Nadu-Ramanathapuram', value: 'IND-TN-RA' },
    { label: 'Tamil Nadu-Salem', value: 'IND-TN-SA' },
    { label: 'Tamil Nadu-Sivaganga', value: 'IND-TN-SI' },
    { label: 'Tamil Nadu-Tiruchirappalli', value: 'IND-TN-TC' },
    { label: 'Tamil Nadu-Theni', value: 'IND-TN-TH' },
    { label: 'Tamil Nadu-Tirunelveli', value: 'IND-TN-TI' },
    { label: 'Tamil Nadu-Thanjavur', value: 'IND-TN-TJ' },
    { label: 'Tamil Nadu-Thoothukudi', value: 'IND-TN-TK' },
    { label: 'Tamil Nadu-Tiruvallur', value: 'IND-TN-TL' },
    { label: 'Tamil Nadu-Tiruppur', value: 'IND-TN-TP' },
    { label: 'Tamil Nadu-Tiruvarur', value: 'IND-TN-TR' },
    { label: 'Tamil Nadu-Tiruppattur', value: 'IND-TN-TU' },
    { label: 'Tamil Nadu-Tiruvannamalai', value: 'IND-TN-TV' },
    { label: 'Tamil Nadu-Vellore', value: 'IND-TN-VE' },
    { label: 'Tamil Nadu-Viluppuram', value: 'IND-TN-VL' },
    { label: 'Tamil Nadu-Virudhunagar', value: 'IND-TN-VR' },
    { label: 'India-Tripura', value: 'IND-TR' },
    { label: 'India-Uttarakhand', value: 'IND-UK' },
    { label: 'India-Uttar Pradesh', value: 'IND-UP' },
    { label: 'India-West Bengal', value: 'IND-WB' },
    { label: 'Ireland', value: 'IRL' },
    { label: 'Iran, Islamic Republic of', value: 'IRN' },
    { label: 'Iraq', value: 'IRQ' },
    { label: 'Iceland', value: 'ISL' },
    { label: 'Israel', value: 'ISR' },
    { label: 'Italy', value: 'ITA' },
    { label: 'Jamaica', value: 'JAM' },
    { label: 'Jersey', value: 'JEY' },
    { label: 'Jordan', value: 'JOR' },
    { label: 'Japan', value: 'JPN' },
    { label: 'Kazakhstan', value: 'KAZ' },
    { label: 'Kenya', value: 'KEN' },
    { label: 'Kyrgyzstan', value: 'KGZ' },
    { label: 'Cambodia', value: 'KHM' },
    { label: 'Kiribati', value: 'KIR' },
    { label: 'Saint Kitts and Nevis', value: 'KNA' },
    { label: 'Republic of Korea', value: 'KOR' },
    { label: 'Kuwait', value: 'KWT' },
    { label: "Lao People's Democratic Republic", value: 'LAO' },
    { label: 'Lebanon', value: 'LBN' },
    { label: 'Liberia', value: 'LBR' },
    { label: 'Libyan Arab Jamahiriya', value: 'LBY' },
    { label: 'Saint Lucia', value: 'LCA' },
    { label: 'Liechtenstein', value: 'LIE' },
    { label: 'Sri Lanka', value: 'LKA' },
    { label: 'Lesotho', value: 'LSO' },
    { label: 'Lithuania', value: 'LTU' },
    { label: 'Luxembourg', value: 'LUX' },
    { label: 'Latvia', value: 'LVA' },
    {
      label: 'Macao Special Administrative Region of China',
      value: 'MAC',
    },
    { label: 'Saint(French part)', value: 'MAF' },
    { label: 'Morocco', value: 'MAR' },
    { label: 'Monaco', value: 'MCO' },
    { label: 'Moldova', value: 'MDA' },
    { label: 'Madagascar', value: 'MDG' },
    { label: 'Maldives', value: 'MDV' },
    { label: 'Mexico', value: 'MEX' },
    { label: 'Marshall Islands', value: 'MHL' },
    { label: 'The former Yugoslav Republic of Macedonia', value: 'MKD' },
    { label: 'Mali', value: 'MLI' },
    { label: 'Malta', value: 'MLT' },
    { label: 'Myanmar', value: 'MMR' },
    { label: 'Montenegro', value: 'MNE' },
    { label: 'Mongolia', value: 'MNG' },
    { label: 'Northern Mariana Islands', value: 'MNP' },
    { label: 'Mozambique', value: 'MOZ' },
    { label: 'Mauritania', value: 'MRT' },
    { label: 'Montserrat', value: 'MSR' },
    { label: 'Martinique', value: 'MTQ' },
    { label: 'Mauritius', value: 'MUS' },
    { label: 'Malawi', value: 'MWI' },
    { label: 'Malaysia', value: 'MYS' },
    { label: 'Malaysia-Johor', value: 'MYS-JHR' },
    { label: 'Malaysia-Kedah', value: 'MYS-KDH' },
    { label: 'Malaysia-Kelantan', value: 'MYS-KTN' },
    {
      label: 'Malaysia-Federal Territory of Kuala Lumpur',
      value: 'MYS-KUL',
    },
    { label: 'Malaysia-Federal Territory of Labuan', value: 'MYS-LBN' },
    { label: 'Malaysia-Malacca', value: 'MYS-MLK' },
    { label: 'Malaysia-Negeri Sembilan', value: 'MYS-NSN' },
    { label: 'Malaysia-Pahang', value: 'MYS-PHG' },
    {
      label: 'Malaysia-Federal Territory of Putrajaya',
      value: 'MYS-PJY',
    },
    { label: 'Malaysia-Perlis', value: 'MYS-PLS' },
    { label: 'Malaysia-Penang', value: 'MYS-PNG' },
    { label: 'Malaysia-Perak', value: 'MYS-PRK' },
    { label: 'Malaysia-Sabah', value: 'MYS-SBH' },
    { label: 'Malaysia-Selangor', value: 'MYS-SGR' },
    { label: 'Malaysia-Sarawak', value: 'MYS-SWK' },
    { label: 'Malaysia-Terengganu', value: 'MYS-TRG' },
    { label: 'Mayotte', value: 'MYT' },
    { label: 'Namibia', value: 'NAM' },
    { label: 'New Caledonia', value: 'NCL' },
    { label: 'Niger', value: 'NER' },
    { label: 'Norfolk Island', value: 'NFK' },
    { label: 'Nigeria', value: 'NGA' },
    { label: 'Nicaragua', value: 'NIC' },
    { label: 'Niue', value: 'NIU' },
    { label: 'Netherlands', value: 'NLD' },
    { label: 'Norway', value: 'NOR' },
    { label: 'Nepal', value: 'NPL' },
    { label: 'North America Others', value: 'NRM' },
    { label: 'Nauru', value: 'NRU' },
    { label: 'New Zealand', value: 'NZL' },
    { label: 'Oceania Others', value: 'OCN' },
    { label: 'Oman', value: 'OMN' },
    { label: 'Pakistan', value: 'PAK' },
    { label: 'Panama', value: 'PAN' },
    { label: 'Pitcairn', value: 'PCN' },
    { label: 'Peru', value: 'PER' },
    { label: 'Philippines', value: 'PHL' },
    { label: 'Palau', value: 'PLW' },
    { label: 'Papua New Guinea', value: 'PNG' },
    { label: 'Poland', value: 'POL' },
    { label: 'Puerto Rico', value: 'PRI' },
    { label: "Democratic People's Republic of Korea", value: 'PRK' },
    { label: 'Portugal', value: 'PRT' },
    { label: 'Paraguay', value: 'PRY' },
    { label: 'Occupied Palestinian Territory', value: 'PSE' },
    { label: 'French Polynesia', value: 'PYF' },
    { label: 'Qatar', value: 'QAT' },
    { label: 'R_union', value: 'REU' },
    { label: 'Romania', value: 'ROU' },
    { label: 'Russian Federation', value: 'RUS' },
    { label: 'Rwanda', value: 'RWA' },
    { label: 'Saudi Arabia', value: 'SAU' },
    { label: 'Sudan', value: 'SDN' },
    { label: 'Senegal', value: 'SEN' },
    { label: 'Singapore', value: 'SGP' },
    { label: 'Saint Helena', value: 'SHN' },
    { label: 'Svalbard and Jan Mayen Islands', value: 'SJM' },
    { label: 'Solomon Islands', value: 'SLB' },
    { label: 'Sierra Leone', value: 'SLE' },
    { label: 'El Salvador', value: 'SLV' },
    { label: 'San Marino', value: 'SMR' },
    { label: 'Somalia', value: 'SOM' },
    { label: 'Saint Pierre and Miquelon', value: 'SPM' },
    { label: 'Serbia', value: 'SRB' },
    { label: 'South America', value: 'STM' },
    { label: 'Sao Tome and Principe', value: 'STP' },
    { label: 'Suriname', value: 'SUR' },
    { label: 'Slovakia', value: 'SVK' },
    { label: 'Slovenia', value: 'SVN' },
    { label: 'Sweden', value: 'SWE' },
    { label: 'Swaziland', value: 'SWZ' },
    { label: 'Seychelles', value: 'SYC' },
    { label: 'Syrian Arab Republic', value: 'SYR' },
    { label: 'Turks and Caicos Islands', value: 'TCA' },
    { label: 'Chad', value: 'TCD' },
    { label: 'Togo', value: 'TGO' },
    { label: 'Thailand', value: 'THA' },
    { label: 'Tajikistan', value: 'TJK' },
    { label: 'Tokelau', value: 'TKL' },
    { label: 'Turkmenistan', value: 'TKM' },
    { label: 'Timor', value: 'TLS' },
    { label: 'Tonga', value: 'TON' },
    { label: 'Trinidad and Tobago', value: 'TTO' },
    { label: 'Tunisia', value: 'TUN' },
    { label: 'Turkey', value: 'TUR' },
    { label: 'Tuvalu', value: 'TUV' },
    { label: 'United Republic of Tanzania', value: 'TZA' },
    { label: 'Uganda', value: 'UGA' },
    { label: 'Ukraine', value: 'UKR' },
    { label: 'Uruguay', value: 'URY' },
    { label: 'United States of America', value: 'USA' },
    { label: 'USA-Alaska', value: 'USA-AK' },
    { label: 'USA-Alabama', value: 'USA-AL' },
    { label: 'USA-Arkansas', value: 'USA-AR' },
    { label: 'USA-Arizona', value: 'USA-AZ' },
    { label: 'USA-California', value: 'USA-CA' },
    { label: 'USA-Colorado', value: 'USA-CO' },
    { label: 'USA-Connecticut', value: 'USA-CT' },
    { label: 'USA-District of Columbia', value: 'USA-DC' },
    { label: 'USA-Delaware', value: 'USA-DE' },
    { label: 'USA-Florida', value: 'USA-FL' },
    { label: 'USA-Georgia', value: 'USA-GA' },
    { label: 'USA-Hawaii', value: 'USA-HI' },
    { label: 'USA-Iowa', value: 'USA-IA' },
    { label: 'USA-Idaho', value: 'USA-ID' },
    { label: 'USA-Illinois', value: 'USA-IL' },
    { label: 'USA-Indiana', value: 'USA-IN' },
    { label: 'USA-Kansas', value: 'USA-KS' },
    { label: 'USA-Kentucky', value: 'USA-KY' },
    { label: 'USA-Louisiana', value: 'USA-LA' },
    { label: 'USA-Massachusetts', value: 'USA-MA' },
    { label: 'USA-Maryland', value: 'USA-MD' },
    { label: 'USA-Maine', value: 'USA-ME' },
    { label: 'USA-Michigan', value: 'USA-MI' },
    { label: 'USA-Minnesota', value: 'USA-MN' },
    { label: 'USA-Missouri', value: 'USA-MO' },
    { label: 'USA-Mississippi', value: 'USA-MS' },
    { label: 'USA-Montana', value: 'USA-MT' },
    { label: 'USA-North Carolina', value: 'USA-NC' },
    { label: 'USA-North Dakota', value: 'USA-ND' },
    { label: 'USA-Nebraska', value: 'USA-NE' },
    { label: 'USA-New Hampshire', value: 'USA-NH' },
    { label: 'USA-New Jersey', value: 'USA-NJ' },
    { label: 'USA-New Mexico', value: 'USA-NM' },
    { label: 'USA-Nevada', value: 'USA-NV' },
    { label: 'USA-New York', value: 'USA-NY' },
    { label: 'USA-Ohio', value: 'USA-OH' },
    { label: 'USA-Oklahoma', value: 'USA-OK' },
    { label: 'USA-Oregon', value: 'USA-OR' },
    { label: 'USA-Pennsylvania', value: 'USA-PA' },
    { label: 'USA-Rhode Island', value: 'USA-RI' },
    { label: 'USA-South Carolina', value: 'USA-SC' },
    { label: 'USA-South Dakota', value: 'USA-SD' },
    { label: 'USA-Tennessee', value: 'USA-TN' },
    { label: 'USA-Texas', value: 'USA-TX' },
    { label: 'USA-Utah', value: 'USA-UT' },
    { label: 'USA-Virginia', value: 'USA-VA' },
    { label: 'USA-Vermont', value: 'USA-VT' },
    { label: 'USA-Washington', value: 'USA-WA' },
    { label: 'USA-Wisconsin', value: 'USA-WI' },
    { label: 'USA-West Virginia', value: 'USA-WV' },
    { label: 'USA-Wyoming', value: 'USA-WY' },
    { label: 'United States of Kailaasa', value: 'USK' },
    { label: 'Uzbekistan', value: 'UZB' },
    { label: 'Holy See', value: 'VAT' },
    { label: 'Saint Vincent and the Grenadines', value: 'VCT' },
    { label: 'Venezuela (Bolivarian Republic of)', value: 'VEN' },
    { label: 'British Virgin Islands', value: 'VGB' },
    { label: 'United States Virgin Islands', value: 'VIR' },
    { label: 'Viet Nam', value: 'VNM' },
    { label: 'Vanuatu', value: 'VUT' },
    { label: 'Wallis and Futuna Islands', value: 'WLF' },
    { label: 'Samoa', value: 'WSM' },
    { label: 'Yemen', value: 'YEM' },
    { label: 'South Africa', value: 'ZAF' },
    { label: 'Zambia', value: 'ZMB' },
    { label: 'Zimbabwe', value: 'ZWE' },
  ]

  export default {
    name: 'SocialGrid',
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
        languages: [],
        languageSelectOptions: [],
        selectedLanguage: null,
        regions: [],
        regionSelectOptions: regionOptions,
        selectedRegion: null,
      }
    },
    computed: {
      filteredLinks() {
        this.resetLoadedLinks()
        return intersection(
          this.filterPlatforms(),
          this.filterCategories(),
          this.filterLanguage(),
          this.filterRegion()
        )
      },
      loadBuffer() {
        return this.filteredLinks.filter((link, index) => index > 30)
      },
      filteredLinksToDisplay() {
        return this.filteredLinks.filter((link, index) => index < 30)
      },
    },
    methods: {
      parseData(entries) {
        let categorySet = new Set()
        let platformSet = new Set()
        let languageSet = new Set()
        let regionSet = new Set()

        entries.forEach((value) => {
          let entry = {
            id: value.id.$t,
            platform: value.gsx$platform.$t,
            title: value.gsx$title.$t,
            url: value.gsx$url.$t,
            category: value.gsx$category.$t,
            language: value.gsx$language.$t,
            region: value.gsx$geography.$t,
          }

          if (entry.category === '') entry.category = 'Other'

          // Add to the set of categories
          if (value.gsx$category.$t !== '')
            categorySet.add(value.gsx$category.$t)

          // Add to the set of platforms
          if (value.gsx$platform.$t !== '')
            platformSet.add(value.gsx$platform.$t)

          // Add to the set of languages
          if (value.gsx$language.$t !== '')
            languageSet.add(value.gsx$language.$t)

          // Add to the set of regions
          if (value.gsx$geography.$t !== '')
            regionSet.add(value.gsx$geography.$t)

          // Push entry into the list of all links
          this.socialLinks.push(entry)
        })

        // Add category set to array of categories
        this.categories = [...categorySet]
        this.categories.sort()
        // Add platforms set to array of platforms
        this.platforms = [...platformSet]
        this.platforms.sort()
        // Add platforms set to array of platforms
        this.languages = [...languageSet]
        this.languages.sort()
        // Add platforms set to array of platforms
        this.regions = [...regionSet]
        this.regions.sort()
      },
      loadMore(index, done) {
        setTimeout(() => {
          if (this.loadBuffer.length > 0) {
            this.loadedLinks = [
              ...this.loadedLinks,
              ...this.loadBuffer.splice(0, this.perPage),
            ]
            done()
          }
        }, 600)
      },
      resetLoadedLinks() {
        this.loadedLinks = []
      },
      setCategoryFilter(category) {
        this.resetLoadedLinks()
        this.selectedPlatforms = []
        this.selectedCategories = [category]
      },
      setPlatformFilter(platform) {
        this.resetLoadedLinks()
        this.selectedCategories = []
        this.selectedPlatforms = [platform]
      },
      filterCategories() {
        if (this.selectedCategories.length > 0)
          return this.socialLinks.filter((link) =>
            this.selectedCategories.includes(link.category)
          )
        else return this.socialLinks
      },
      filterPlatforms() {
        if (this.selectedPlatforms.length > 0)
          return this.socialLinks.filter((link) =>
            this.selectedPlatforms.includes(link.platform)
          )
        else return this.socialLinks
      },
      filterLanguage() {
        if (this.selectedLanguage !== null)
          return this.socialLinks.filter(
            (link) => this.selectedLanguage === link.language
          )
        else return this.socialLinks
      },
      filterRegion() {
        if (this.selectedRegion !== null)
          return this.socialLinks.filter(
            (link) => this.selectedRegion === link.region
          )
        else return this.socialLinks
      },
      filterPlatformSelect(val, update) {
        if (val === '') {
          update(() => {
            this.platformSelectOptions = this.platforms
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          this.platformSelectOptions = this.platforms.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      filterLanguagesSelect(val, update) {
        if (val === '') {
          update(() => {
            this.languageSelectOptions = this.languages
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          this.languageSelectOptions = this.languages.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      filterRegionsSelect(val, update) {
        if (val === '') {
          update(() => {
            this.regionSelectOptions = regionOptions
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          this.regionSelectOptions = regionOptions.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      getLinksData() {
        axios
          .get(
            `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`
          )
          .then((response) => {
            this.dataImported = true
            this.parseData(response.data.feed.entry)
          })
      },
      formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
    },
    created() {
      this.getLinksData()
    },
  }
</script>

<style lang="scss" scoped>
  .totalCount {
    text-align: center;
    font-size: 1.5rem;
    margin: 2rem 0;
    color: #5e2121;
  }
  .socialGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    justify-content: center;

    .socialGrid__skeleton {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1) !important;
      padding: 0.5rem;
    }
  }
  .filters {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    gap: 3rem;
    justify-content: space-between;
    margin: 1rem 0 2rem 0;
  }
  .filters__select {
    flex: 1 1 45%;
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
  .resultsCount {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    color: rgb(140, 140, 140);
  }
  .socialGrid__separator {
    margin-bottom: 1.5rem;
  }
  .socialCounters {
    margin: 2rem 0;
    row-gap: 1rem;

    .socialCounter {
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;
      max-width: 150px;
      text-align: center;
    }
  }
  .socialLinks__header {
    max-width: 600px;
    margin: 0 auto;
  }
</style>
