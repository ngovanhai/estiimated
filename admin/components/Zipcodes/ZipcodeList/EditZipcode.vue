<template>
  <el-dialog title="Zipcode Rule" :visible.sync="isOpen">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Rule Name</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Ex: Boston" v-model="editZipcode.name"></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Zipcodes</div>
        <div class="panel-component-item-content">
          <el-input
            type="textarea"
            autosize
            placeholder="Ex: 100,200-1000,2000"
            v-model="editZipcode.zipcode_list"
          ></el-input>
          <span
            class="panel-component-item-content-helper-text"
          >Enter area codes separated by comma (,)</span>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Minimum days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="editZipcode.minimum_days" :min="0"></el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Estimated days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="editZipcode.estimated_days" :min="0"></el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Show Estimated Text</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="editZipcode.show_estimated_date"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Show COD Info</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="editZipcode.show_cash_delivery"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <ul v-if="editZipcode.show_cash_delivery == 1" class="panel-component-items">
            <li class="panel-component-item panel-component-item-content-inline">
              <div class="panel-component-item-title">Is COD available ?</div>
              <div class="panel-component-item-content">
                <el-radio v-model="editZipcode.cash_delivery_available" :label="1" border>Yes</el-radio>
                <el-radio v-model="editZipcode.cash_delivery_available" :label="0" border>No</el-radio>
              </div>
            </li>
          </ul>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Show Extra Cost</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="editZipcode.show_extra_cost"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <ul v-if="editZipcode.show_extra_cost == 1" class="panel-component-items">
            <li class="panel-component-item panel-component-item-content-inline">
              <div class="panel-component-item-title">Extra Shipping Cost (in number)</div>
              <div class="panel-component-item-content">
                <el-input-number v-model="editZipcode.extra_cost" :min="0"></el-input-number>
              </div>
            </li>
          </ul>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Show Courier Information</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="editZipcode.show_courier"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <ul v-if="editZipcode.show_courier == 1" class="panel-component-items">
            <li class="panel-component-item panel-component-item-content-inline">
              <div class="panel-component-item-title">Courier Name</div>
              <div class="panel-component-item-content">
                <el-input v-model="editZipcode.courier_name" placeholder="Ex: FedEx"></el-input>
              </div>
            </li>
            <li class="panel-component-item panel-component-item-content-inline">
              <div class="panel-component-item-title">Courier Site URL</div>
              <div class="panel-component-item-content">
                <el-input v-model="editZipcode.courier_url" placeholder="Ex: https://www.fedex.com"></el-input>
              </div>
            </li>
          </ul>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Show Custom Text</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="editZipcode.show_custom_text"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <ul v-if="editZipcode.show_custom_text == 1" class="panel-component-items">
            <li class="panel-component-item panel-component-item-content-inline">
              <div class="panel-component-item-title">Custom Text</div>
              <div class="panel-component-item-content">
                <el-input
                  type="textarea"
                  autosize
                  v-model="editZipcode.custom_text"
                  placeholder="Your extra infomation."
                ></el-input>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="onClose">Close</el-button>
      <el-button type="primary" :loading="isSaving" @click="onSave">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
module.exports = {
  props: ["settings", "zipcode", "active"],
  data() {
    return {
      editZipcode: {},
      isSaving: false
    };
  },
  computed: {
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
    isOpen: function(val) {
      if (val) {
        this.editZipcode = this.zipcode
          ? JSON.parse(JSON.stringify(this.zipcode))
          : {
              name: "",
              minimum_days: 2,
              zipcode_list: "",
              estimated_days: 2,
              show_estimated_date: 1,
              show_cash_delivery: 0,
              cash_delivery_available: 0,
              show_extra_cost: 0,
              extra_cost: 20,
              show_courier: 0,
              courier_name: "",
              courier_url: "",
              show_custom_text: 0,
              custom_text: ""
            };
        this.editZipcode.show_estimated_date = Number(
          this.editZipcode.show_estimated_date
        );
        this.editZipcode.show_cash_delivery = Number(
          this.editZipcode.show_cash_delivery
        );
        this.editZipcode.cash_delivery_available = Number(
          this.editZipcode.cash_delivery_available
        );
        this.editZipcode.show_extra_cost = Number(
          this.editZipcode.show_extra_cost
        );
        this.editZipcode.show_courier = Number(this.editZipcode.show_courier);
        this.editZipcode.show_custom_text = Number(
          this.editZipcode.show_custom_text
        );
      }
    }
  },
  methods: {
    onSave() {
      let zipcode = this.editZipcode;
      let error = this.checkZipcode(zipcode);
      if (error) {
        ShopifyApp.flashError(error);
      } else {
        if (zipcode.hasOwnProperty("id")) {
          this.update(zipcode);
        } else {
          this.create(zipcode);
        }
      }
    },
    create(zipcode) {
      this.$http
        .post(
          window.zipcodeListApi,
          {
            zipcode: zipcode,
            shop: window.shop,
            action: "create"
          },
          {
            emulateJSON: true
          }
        )
        .then(status => {
          if (status.body.success) {
              ShopifyNotification("Create new zipcode rule successfully","success");  
            zipcode.id = status.body.id;
            this.$emit("append", zipcode);
            this.onClose();
            window.eventBus.$emit("generate-json-file");
          } else {
             ShopifyNotification("Create new zipcode rule successfully","success");  
          }
        });
    },
    update(zipcode) {
      this.$http
        .post(
          window.zipcodeListApi,
          {
            zipcode: zipcode,
            shop: window.shop,
            action: "update"
          },
          {
            emulateJSON: true
          }
        )
        .then(status => {
          if (status.body.success) {
             ShopifyNotification("Save zipcode rule successfully","success");  
            this.$emit("update", zipcode);
            this.onClose();
            window.eventBus.$emit("generate-json-file");
          } else {
             ShopifyNotification("Save zipcode rule successfully","success"); 
          }
        });
    },
    checkZipcode: function(zipcode) {
      if (zipcode.name == "") {
        return "Rule Name cannot be empty !!!";
      }
      if (zipcode.minimum_days < 0) {
        return "Minimum days must greater than or equal 0 !!!";
      }
      if (zipcode.estimated_days < 0) {
        return "Estimated Delivery days must greater than or equal 0 !!!";
      }
      if (zipcode.zipcode_list == "") {
        return "Zipcodes cannot be empty !!!";
      }
      if (zipcode.show_extra_cost == "1" && zipcode.extra_cost < 0) {
        return "Extra cost must greater than or equal 0 !!!";
      }
      if (zipcode.show_courier == "1" && zipcode.courier_name == "") {
        return "Courier Name cannot be empty when enable Show Courier Information";
      }
      if (zipcode.show_custom_text == "1" && zipcode.custom_text == "") {
        return "Custom Text cannot be empty when enable Show Custom Text";
      }
      return null;
    },
    onClose() {
      this.$emit("close");
    }
  }
};
</script>
