<template>
  <viewing-card title="List zipcodes">
    <list-zipcodes
      :zipcodes="zipcodes"
      :demo-zipcode="demoZipcode"
      @set-demo-zipcode="setDemoZipcode"
      @edit="onEdit"
      @delete="onDelete"
      @create="onCreate"
    ></list-zipcodes>
    <edit-zipcode
      :zipcode="currentZipcode"
      :active="openEditZipcodeModal"
      @update="onUpdate"
      @append="onAppend"
      @reload="onGet"
      @close="openEditZipcodeModal = false"
    ></edit-zipcode>
  </viewing-card>
</template>

<script>
module.exports = {
  props: ["demoZipcode"],
  components: {
    "list-zipcodes": httpVueLoader(
      `./ZipcodeList/ListZipcode.vue?v=${window.v}`
    ),
    "edit-zipcode": httpVueLoader(`./ZipcodeList/EditZipcode.vue?v=${window.v}`)
  },
  data() {
    return {
      zipcodes: [],
      currentZipcode: null,
      openEditZipcodeModal: false
    };
  },
  created() {
    this.onGet();
  },
  watch: {
    zipcodes: function() {
      this.$emit("set-list-zipcodes", this.zipcodes);
    }
  },
  methods: {
    onGet: function() {
      this.$http
        .get(window.zipcodeListApi, {
          params: {
            action: "get",
            shop: window.shop
          }
        })
        .then(res => {
          if (res.body.success) {
            this.zipcodes = res.body.zipcodes;
            if (this.zipcodes.length > 0) {
              this.setDemoZipcode(this.zipcodes[0]);
            }
          } else {
              ShopifyNotification("Error when get list zipcodes","error");  
          }
        });
    },
    onDelete: function(zipcode) {
      this.$http
        .get(
          window.zipcodeListApi,
          {
            params: {
              id: zipcode.id,
              shop: window.shop,
              action: "delete"
            }
          },
          {
            emulateJSON: true
          }
        )
        .then(status => {
          if (status.body.success) { 
             ShopifyNotification("Delete zipcode rule successfully !","success"); 
            this.zipcodes.splice(
              this.zipcodes.findIndex(e => e.id == zipcode.id),
              1
            );
            this.$emit("reload-specific-rules");
            window.eventBus.$emit("generate-json-file");
          } else {
               ShopifyNotification("Delete zipcode rule unsuccessfully !","success");  
          }
        });
    },
    setDemoZipcode(zipcode) {
      this.$emit("set-demo-zipcode", zipcode);
    },
    onCreate: function() {
      this.currentZipcode = null;
      this.openEditZipcodeModal = true;
    },
    onEdit: function(zipcode) {
      this.currentZipcode = zipcode;
      this.openEditZipcodeModal = true;
    },
    onAppend(zipcode) {
      this.zipcodes.push(zipcode);
    },
    onUpdate(zipcode) {
      let index = this.zipcodes.findIndex(e => e.id == zipcode.id);
      if (index > -1) {
        this.zipcodes.splice(index, 1);
        this.zipcodes.splice(index, 0, zipcode);
      }
    }
  }
};
</script>

<style>
</style>
