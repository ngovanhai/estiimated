<template>
  <el-dialog title="New Collection Rule" :visible.sync="isOpen">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Country</div>
        <div class="panel-component-item-content">
          <el-select v-model="rule.country_id" placeholder="Select a country">
            <el-option
              v-for="country of countryRules"
              :key="country.id"
              :label="country.name"
              :value="country.id"
            ></el-option>
          </el-select>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Collections</div>
        <div class="panel-component-item-content">
          <multiselect
            v-model="selectedCollections"
            :options="collections"
            placeholder="Search collections..."
            label="title"
            track-by="id"
            select-label="Select"
            deselect-label="Remove"
            :multiple="true"
          ></multiselect>
          <span
            class="panel-component-item-content-helper-text"
            v-if="noticeMsg"
            v-html="noticeMsg"
          ></span>
          <p>
            Not found your collections ?
            <clear-cached-shopify-data-button type="text"/>
          </p>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Minimum days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="rule.minimum_days" :min="0"></el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Estimated days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="rule.estimated_days" :min="0"></el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Custom text</div>
        <div class="panel-component-item-content">
          <el-input
            type="textarea"
            autosize
            placeholder="Your custom text"
            v-model="rule.custom_text"
          ></el-input>
        </div>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="onClose">Close</el-button>
      <el-button
        type="primary"
        :loading="creating"
        :disabled="selectedCollections.length == 0"
        @click="onSave"
      >Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
module.exports = {
  props: ["active"],
  components: {
    multiselect: window.VueMultiselect.default
  },
  data() {
    return {
      selectedCollections: [],
      selectedCountry: null,
      noticeMsg: null,
      rule: {
        country_id: null,
        minimum_days: 0,
        estimated_days: 0,
        custom_text: ""
      }
    };
  },
  computed: {
    ...Vuex.mapGetters({
      collections: "_shopify/collections/getCollections",
      countryRules: "countryDelivery/countryRules/getCountryRules",
      specificCollections: "countryDelivery/specificCollections/getRules",
      creating: "countryDelivery/specificCollections/getCreating"
    }),
    isOpen: {
      get: function() {
        return this.active;
      },
      set: function() {
        this.onClose();
      }
    }
  },
  watch: {
    selectedCollections: function(selectedCollections) {
      this.setNoticeText();
    },
    rule: function(rule) {
      this.setNoticeText();
    }
  },
  methods: {
    ...Vuex.mapActions({
      getRules: "countryDelivery/specificCollections/getRules",
      createRule: "countryDelivery/specificCollections/createRule"
    }),
    getCountryName(countryId) {
      let country = this.countryRules.find(e => e.id == countryId);
      if (country) {
        return country.name;
      } else {
        return "N/A";
      }
    },
    onSave() {
      let collections = this.selectedCollections;
      let rule = this.rule;
      let moveAlong = () => {
        if (collections.length) {
          let collection = collections.shift();
          rule.collection_id = collection.id;
          rule.collection_title = collection.title;
          this.createRule({
            rule
          })
            .then(() => {
              moveAlong();
            })
            .catch(error => { 
              ShopifyNotification(error,"error"); 
            });
        } else { 
          ShopifyNotification("Rules have been created","success"); 
          this.getRules();
          this.onClose();
          window.eventBus.$emit("generate-json-file");
        }
      };
      moveAlong();
    },
    setNoticeText() {
      if (this.rule.country_id && this.selectedCollections.length > 0) {
        let noticeText =
          "Rules of these collections : {listUpdate} will be replaced by this rule";
        let noticeCollections = [];
        this.selectedCollections.forEach(product => {
          if (
            this.specificCollections.some(
              e =>
                e.collection_id == product.id &&
                this.rule.country_id == e.country_id
            )
          ) {
            noticeCollections.push(product.title);
          }
        });
        if (noticeCollections.length > 0) {
          let arrayToText = noticeCollections.join(", ");
          this.noticeMsg = noticeText.replace("{listUpdate}", arrayToText);
        } else {
          this.noticeMsg = null;
        }
      } else {
        this.noticeMsg = null;
      }
    },
    onClose() {
      this.$emit("close");
    }
  }
};
</script>
