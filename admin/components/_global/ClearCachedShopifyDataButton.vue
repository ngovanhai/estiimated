<template>
  <el-button :type="type" :size="size" @click="onClear" :loading="loading">
    <span v-html="removingText"></span>
  </el-button>
</template>

<script>
module.exports = {
  props: {
    type: {
      type: String,
      default: "text"
    },
    size: {
      type: String,
      default: "mini"
    }
  },
  data() {
    return {
      loading: false,
      removingText: "Reload data from Shopify" 
    };
  },
  methods: {
    ...Vuex.mapActions({
      getAllProducts: "_shopify/products/getAllProducts",
      getAllCollections: "_shopify/collections/getAllCollections",
      getAllVendors: "_shopify/vendors/getAllVendors",
      getAllCountries: "_shopify/countries/getAllCountries",
      clearCache: "_shopify/clearCacheData"
    }),
    onClear() {
      this.loading = true;
      this.removingText = "Clearing old data";
      this.clearCache()
        .then(() => {
          this.removingText = "Getting products"; 
          return this.getAllProducts();
        })
        .then(() => {
          this.removingText = "Getting collections"; 
          return this.getAllCollections();
        })
        .then(() => {
          this.removingText = "Getting vendors"; 
          return this.getAllVendors();
        })
        .then(() => { 
          this.removingText = "Getting countries"; 
          return this.getAllCountries();
        })
        .then(() => {
          this.removingText = "Reload data from shopify"; 
          this.loading = false;
        })
        .catch(error => {
          this.loading = false; 
           ShopifyNotification(error,"error"); 
        });
    }
  }
};
</script>
