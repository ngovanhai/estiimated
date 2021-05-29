<template>
  <div>
    <div
      class="estimated-specific-rule-setup-target df mt20 mb20"
      v-for="target in rule.targets"
      :key="target.type"
    >
      <div class="estimated-specific-rule-setup-target-checkbox">
        <el-checkbox v-model="target.enable" :label="target.type" border>{{target.title}}</el-checkbox>
      </div>
      <div v-if="target.enable" class="estimated-specific-rule-setup-target-selectbox">
        <multiselect
          v-if="target.type === 'product'"
          v-model="target.items"
          :options="products"
          placeholder="Search product..."
          label="title"
          track-by="id"
          select-label="Select"
          deselect-label="Remove"
          :multiple="true"
          :options-limit="20"
        ></multiselect>
        <multiselect
          v-if="target.type === 'collection'"
          v-model="target.items"
          :options="collections"
          placeholder="Search collections..."
          label="title"
          track-by="id"
          select-label="Select"
          deselect-label="Remove"
          :multiple="true"
          :options-limit="20"
        ></multiselect>
        <multiselect
          v-if="target.type === 'vendor'"
          v-model="target.items"
          :options="vendors"
          :multiple="true"
          :close-on-select="true"
          tag-placeholder="Add this vendor"
          placeholder="Add a vendor"
          select-label="Select"
          deselect-label="Remove"
          :taggable="true"
          @tag="addVendor"
        ></multiselect>
      </div>
    </div>
    <div class="mt30">
      <div class="df clear-cached-container">
        <p class="m10">Not found your products/collections ?</p>
        <div class="fx">
          <clear-cached-shopify-data-button class="mt5" type="text"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  components: {
    multiselect: window.VueMultiselect.default
  },
  computed: {
    ...Vuex.mapGetters({
      rule: "estimatedDate/specificRules/newSpecificRule/getRule",
      products: "_shopify/products/getProducts",
      collections: "_shopify/collections/getCollections",
      vendors: "_shopify/vendors/getVendors"
    })
  },
  methods: {
    addVendor(newVendor) {
      if (newVendor && newVendor != "") {
        newVendor = newVendor.trim();
        if (!this.vendors.some(e => e == newVendor)) {
          this.vendors.push(newVendor);
        }
        for (let i = 0; i < this.rule.targets.length; i++) {
          if (this.rule.targets[i].type == "vendor") {
            this.rule.targets[i].items.push(newVendor);
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.estimated-specific-rule-setup-target-checkbox { 
  width: 150px;
  margin-right: 20px;
}
.estimated-specific-rule-setup-target-selectbox {
  width: 100%;
}
.clear-cached-container {
  margin: auto;
  max-width: 400px;
}
</style>