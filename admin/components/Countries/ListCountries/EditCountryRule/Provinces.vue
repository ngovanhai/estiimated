<template>
  <div v-if="show">
    <ul
      v-if="editingRule && editingRule.provinces && editingRule.provinces.length"
      class="panel-component-items"
    >
      <li class="panel-component-item">
        <div class="panel-component-item-title">Show sub regions</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="editingRule.show_sub_regions"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </div>
      </li>
      <li v-if="editingRule.show_sub_regions == 1" class="panel-component-item">
        <div class="panel-component-item-title">Regions</div>
        <div class="panel-component-item-content">
          <multiselect
            :value="selectedProvinces"
            :options="editingRule.provinces"
            placeholder="Search regions..."
            label="name"
            track-by="id"
            select-label="Select"
            deselect-label="Remove"
            :multiple="true"
            @input="setSelectedProvinces"
          ></multiselect>
          <span class="panel-component-item-content-helper-text" v-html="noticeText"></span>
        </div>
      </li>
      <li v-if="editingRule.show_sub_regions == 1" class="panel-component-item">
        <div class="panel-component-item-title">Enable Shipping</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="editingProvinceRule.enable_shipping"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </div>
      </li>
      <li
        v-if="editingRule.show_sub_regions == 1 && editingProvinceRule.enable_shipping == 1"
        class="panel-component-item"
      >
        <div class="panel-component-item-title">Use Custom Day</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="editingProvinceRule.use_custom_day"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </div>
      </li>
      <li
        v-if="editingRule.show_sub_regions == 1 && editingProvinceRule.enable_shipping == 1 && editingProvinceRule.use_custom_day == 1"
        class="panel-component-item"
      >
        <div class="panel-component-item-title panel-component-item-title-with-input">Minimum days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="editingProvinceRule.minimum_days" :min="0"></el-input-number>
        </div>
      </li>
      <li
        v-if="editingRule.show_sub_regions == 1 && editingProvinceRule.enable_shipping == 1 && editingProvinceRule.use_custom_day == 1"
        class="panel-component-item"
      >
        <div class="panel-component-item-title panel-component-item-title-with-input">Estimated days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="editingProvinceRule.estimated_days" :min="0"></el-input-number>
        </div>
      </li>
      <li
        v-if="editingRule.show_sub_regions == 1 && editingProvinceRule.enable_shipping == 1 && editingProvinceRule.use_custom_day == 1"
        class="panel-component-item"
      >
        <div class="panel-component-item-title">Custom infomation</div>
        <div class="panel-component-item-content">
          <el-input
            type="textarea"
            autosize
            placeholder="Some extra infomation..."
            v-model="editingProvinceRule.custom_info"
          ></el-input>
        </div>
      </li>
    </ul>
    <div v-else>
      <p style="text-align: center;">Empty list of provinces.</p>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ["show"],
  components: {
    multiselect: window.VueMultiselect.default
  },
  computed: {
    ...Vuex.mapGetters({
      editingRule: "countryDelivery/countryRules/getEditingRule",
      editingProvinceRule:
        "countryDelivery/countryRules/getEditingProvinceRule",
      selectedProvinces: "countryDelivery/countryRules/getSelectedProvinces"
    })
  },
  data() {
    return {
      noticeText: null
    };
  },
  mounted() {
    if (this.editingRule) {
      this.setEditingProvinceRule({
        rule: this.editingRule
      });
    }
  },
  watch: {
    selectedProvinces: function(listProvinces) {
      this.updateRule();
      this.updateNoticeText();
    }
  },
  methods: {
    ...Vuex.mapActions({
      setEditingProvinceRule:
        "countryDelivery/countryRules/setEditingProvinceRule",
      setSelectedProvinces: "countryDelivery/countryRules/setSelectedProvinces"
    }),
    updateNoticeText() {
      this.noticeText = null; 
      if (this.selectedProvinces.length > 1) {
        let listReplaced = [];

        this.selectedProvinces.forEach(province => {
          if (province.hasOwnProperty("enable_shipping")) {
            listReplaced.push(province.name);
          }
        });

        if (listReplaced.length > 0) {
          let noticeText =
            "Rule of these provinces : {listReplaced} will be replaced with this new rule.";
          let text = listReplaced.join(", ");
          this.noticeText = noticeText.replace("{listReplaced}", text);
        }
      }
    },
    updateRule() {
      if (this.selectedProvinces.length == 1) {
        let province = this.selectedProvinces[0];
        if (province.hasOwnProperty("enable_shipping")) {
          this.setEditingProvinceRule({
            rule: province
          });
        } else {
          this.setEditingProvinceRule({
            rule: this.editingRule
          });
        }
      }
    }
  }
};
</script>
