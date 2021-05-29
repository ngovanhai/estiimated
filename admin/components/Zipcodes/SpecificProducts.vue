<template>
  <viewing-card title="Specific products">
    <list-specific-products
      :specific-rules="specificRules"
      :zipcode-rules="zipcodeRules"
      :total-data="totalSpecificRules"
      :per-page="perPage"
      :current-page="currentPage"
      @get="onGet"
      @create="onCreate"
      @edit="onEdit"
      @delete="onDelete"
    ></list-specific-products>
    <edit-specific-products
      :specific-rules="specificRules"
      :zipcode-rules="zipcodeRules"
      :current-rule="currentRule"
      :active="toggleModal"
      @update="onGet"
      @close="closeModal"
    ></edit-specific-products>
  </viewing-card>
</template>

<script>
module.exports = {
  components: {
    "list-specific-products": httpVueLoader(
      `./SpecificProducts/ListSpecificProducts.vue?v=${window.v}`
    ),
    "edit-specific-products": httpVueLoader(
      `./SpecificProducts/EditSpecificProducts.vue?v=${window.v}`
    )
  },
  props: ["zipcodeRules"],
  data() {
    return {
      totalSpecificRules: 0,
      specificRules: [],
      toggleModal: false,
      currentRule: null,
      currentPage: 1,
      perPage: 3
    };
  },
  mounted() {
    this.onGet();
  },
  methods: {
    onGet(page) {
      this.currentPage = page ? page : 1;
      this.$http
        .get(window.zipcodeSpecificProductsApi, {
          params: {
            action: "get",
            page: this.currentPage,
            limit: this.perPage,
            shop: window.shop
          }
        })
        .then(res => {
          if (res.body.success) {
            this.specificRules = res.body.zipcodeSpecificProducts;
            this.totalSpecificRules = Number(res.body.count);
          } else {
              ShopifyNotification("Error when get list zipcodes","error"); 
          }
        });
    },
    onCreate() {
      this.currentRule = null;
      this.openModal();
    },
    onEdit(rule) {
      this.currentRule = rule;
      this.openModal();
    },
    onUpdate() {
      this.countSpecificRules();
      this.onGet(this.currentPage);
    },
    removeRule(ruleId) {
      let index = this.specificRules.findIndex(e => e.id == ruleId);
      if (index != -1) {
        this.specificRules.splice(index, 1);
      }
    },
    onDelete(rule) {
      this.$http
        .get(window.zipcodeSpecificProductsApi, {
          params: {
            action: "delete",
            shop: window.shop,
            id: rule.id
          }
        })
        .then(res => {
          if (res.body.success) { 
            ShopifyNotification("Delete success","success"); 
            this.removeRule(rule.id);
            window.eventBus.$emit("generate-json-file");
          } else {
            ShopifyNotification("Error when delete rule","error");  
          }
        });
    },
    closeModal() {
      this.toggleModal = false;
    },
    openModal() {
      this.toggleModal = true;
    }
  }
};
</script>
