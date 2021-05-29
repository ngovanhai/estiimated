<template>
  <el-dialog v-if="editingRule" title="Edit Product Rule" :visible.sync="isOpen">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Country</div>
        <div class="panel-component-item-content">
          <el-select
            v-model="editingRule.country_id"
            placeholder="Select a country"
            @change="switchRule"
          >
            <el-option
              v-for="rule of rulesOfProduct"
              :key="rule.country_id"
              :label="getCountryName(rule.country_id)"
              :value="rule.country_id"
            ></el-option>
          </el-select>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Minimum days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="editingRule.minimum_days" :min="0"></el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Estimated days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="editingRule.estimated_days" :min="0"></el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Custom text</div>
        <div class="panel-component-item-content">
          <el-input
            type="textarea"
            autosize
            placeholder="Your custom text"
            v-model="editingRule.custom_text"
          ></el-input>
        </div>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="onClose">Close</el-button>
      <el-button type="primary" :loading="updating" @click="onSave">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
module.exports = {
  components: {
    multiselect: window.VueMultiselect.default
  },
  props: ["active"],
  computed: {
    ...Vuex.mapGetters({
      products: "_shopify/products/getProducts",
      countryRules: "countryDelivery/countryRules/getCountryRules",
      editingRule: "countryDelivery/specificProducts/getEditingRule",
      specificProducts: "countryDelivery/specificProducts/getRules",
      updating: "countryDelivery/specificProducts/getUpdating"
    }),
    isOpen: {
      get: function() {
        return this.active;
      },
      set: function() {
        this.onClose();
      }
    },
    rulesOfProduct() {
      if (this.editingRule) {
        return this.specificProducts.filter(
          e => e.product_id == this.editingRule.product_id
        );
      } else {
        return [];
      }
    }
  },
  methods: {
    ...Vuex.mapActions({
      updateRule: "countryDelivery/specificProducts/updateRule",
      setEditingRule: "countryDelivery/specificProducts/setEditingRule"
    }),
    getCountryName(countryId) {
      let country = this.countryRules.find(e => e.id == countryId);
      if (country) {
        return country.name;
      } else {
        return "N/A";
      }
    },
    switchRule() {
      let rule = this.specificProducts.find(
        e => e.country_id == this.editingRule.country_id
      );
      this.setEditingRule({
        rule
      });
    },
    onSave() {
      this.updateRule()
        .then(() => { 
          ShopifyNotification("Rules have been updated","success"); 
          this.onClose();
        })
        .catch(error => {
          ShopifyNotification(error,"error"); 
        });
    },
    onClose() {
      this.$emit("close");
    }
  }
};
</script>
