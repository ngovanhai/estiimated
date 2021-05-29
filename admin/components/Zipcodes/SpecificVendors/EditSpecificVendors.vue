<template>
  <el-dialog title="Vendor Rule" :visible.sync="isOpen" @close="onClose" v-loading="isSaving">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div class="panel-component-item-title">Vendors</div>
        <div class="panel-component-item-content">
          <multiselect
            v-model="selectedVendors"
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
          <span class="panel-component-item-content-helper-text">{{noticeMsg}}</span>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Zipcodes</div>
        <div class="panel-component-item-content">
          <multiselect
            v-model="selectedZipcodes"
            :options="zipcodeRules"
            placeholder="Search zipcodes..."
            label="name"
            track-by="id"
            select-label="Select"
            deselect-label="Remove"
            :multiple="true"
          ></multiselect>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Minimum days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="rule.minimum_days" :min="0">
            <template slot="append">day(s)</template>
          </el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Estimated days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="rule.estimated_days" :min="0">
            <template slot="append">day(s)</template>
          </el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Custom text</div>
        <div class="panel-component-item-content">
          <el-input type="textarea" autosize placeholder="Custom text" v-model="rule.custom_text"></el-input>
          <span
            class="panel-component-item-content-helper-text"
          >A text if you want to show a specific notice about this vendor.</span>
        </div>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="onClose">Close</el-button>
      <el-button type="primary" @click="onSave">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
const ruleSchema = {
  name: null,
  zipcode_id: null,
  minimum_days: 0,
  estimated_days: 2,
  custom_text: null
};
module.exports = {
  components: {
    multiselect: window.VueMultiselect.default
  },
  props: ["active", "zipcodeRules", "specificRules", "currentRule"],
  data() {
    return {
      selectedVendors: [],
      vendors: [],
      selectedZipcodes: [],
      noticeMsg: null,
      isSaving: false,
      rule: {}
    };
  },
  computed: {
    isOpen() {
      return this.active;
    }
  },
  watch: {
    isOpen: function(val) {
      if (val) {
        this.specificRules.forEach(e => {
          if (!this.vendors.some(vendor => vendor == e.name)) {
            this.vendors.push(e.name);
          }
        });
        if (this.currentRule) {
          this.rule = JSON.parse(JSON.stringify(this.currentRule));
          if (this.rule.name) {
            this.selectedVendors = [this.rule.name];
          }
          if (this.rule.zipcode_id) {
            let zipcode = this.zipcodeRules.find(
              e => e.id == this.rule.zipcode_id
            );
            this.selectedZipcodes = [zipcode];
          }
        } else {
          this.rule = JSON.parse(JSON.stringify(ruleSchema));
        }
      }
    }
  },
  methods: {
    getZipcodeName(zipcodeId) {
      let zipcode = this.zipcodeRules.find(e => e.id == zipcodeId);
      if (zipcode) {
        return country.name;
      } else {
        return "N/A";
      }
    },
    addVendor(newVendor) {
      newVendor = newVendor.trim();
      this.vendors.push(newVendor);
      this.selectedVendors.push(newVendor);
    },
    checkRule() {
      if (this.selectedVendors.length == 0) {
        return "You must select one vendor";
      }
      if (this.selectedZipcodes.length == 0) {
        return "You must select one zipcode rule";
      }
      if (Number(this.rule.minimum_days) < 0) {
        return '"Minimum Days" must be greater than or equal 0';
      }
      if (Number(this.rule.estimate_day) < 0) {
        return '"Estimated Days" must be greater than or equal 0';
      }
      return null;
    },
    onSave() {
      let rule = this.rule;
      let error = this.checkRule();
      if (error) {
        ShopifyApp.flashError(error);
      } else {
        this.isSaving = true;
        this.$http
          .post(
            window.zipcodeSpecificVendorsApi,
            {
              rule: rule,
              listVendors: this.selectedVendors,
              listZipcodes: this.selectedZipcodes,
              shop: window.shop,
              action: "update"
            },
            {
              emulateJSON: true
            }
          )
          .then(response => {
            if (response.body.success) {
              let rules = response.body.rules;
              ShopifyNotification("Rules have been updated","success"); 
              this.onClose();
              this.onReloadRules();
              window.eventBus.$emit("generate-json-file");
            } else {
               ShopifyNotification("Update failed","error"); 
            }
            this.isSaving = false;
          });
      }
    },
    onClose() {
      this.$emit("close");
    },
    onReloadRules() {
      this.$emit("reload-rules");
    }
  }
};
</script>
