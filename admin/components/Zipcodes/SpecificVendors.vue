<template>
  <viewing-card title="Specific vendors">
    <list-specific-vendors
      :specific-rules="specificRules"
      :total-data="totalSpecificRules"
      :per-page="perPage"
      :current-page="currentPage"
      :zipcode-rules="zipcodeRules"
      @get="onGet"
      @create="onCreate"
      @edit="onEdit"
      @delete="onDelete"
    ></list-specific-vendors>
    <edit-specific-vendors
      :specific-rules="specificRules"
      :zipcode-rules="zipcodeRules"
      :current-rule="currentRule"
      :active="toggleModal"
      @reload-rules="onGet"
      @close="closeModal"
    ></edit-specific-vendors>
  </viewing-card>
</template>

<script>
module.exports = {
  props: ["zipcodeRules"],
  components: {
    "list-specific-vendors": httpVueLoader(
      `./SpecificVendors/ListSpecificVendors.vue?v=${window.v}`
    ),
    "edit-specific-vendors": httpVueLoader(
      `./SpecificVendors/EditSpecificVendors.vue?v=${window.v}`
    )
  },
  data() {
    return {
      specificRules: [],
      toggleModal: false,
      currentRule: null,
      totalSpecificRules: 0,
      currentPage: 1,
      perPage: 3
    };
  },
  created() {
    this.onGet();
  },
  methods: {
    onGet(page) {
      this.currentPage = page ? page : this.currentPage;
      this.$http
        .get(window.zipcodeSpecificVendorsApi, {
          params: {
            action: "get",
            shop: window.shop,
            page: this.currentPage,
            limit: this.perPage
          }
        })
        .then(res => {
          if (res.body.success) {
            this.specificRules = res.body.zipcodeSpecificVendors;
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
      this.onGet(this.currentPage);
    },
    removeSpecificRule(rule) {
      let index = this.specificRules.findIndex(e => e.id == rule.id);
      if (index != -1) {
        this.specificRules.splice(index, 1);
      }
    },
    onDelete(rule) {
      this.$http
        .get(window.zipcodeSpecificVendorsApi, {
          params: {
            action: "delete",
            shop: window.shop,
            id: rule.id
          }
        })
        .then(res => {
          if (res.body.success) { 
            ShopifyNotification("Delete success","success"); 
            this.removeSpecificRule(rule);
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
