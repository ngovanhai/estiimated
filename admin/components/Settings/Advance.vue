<template>
  <viewing-card title="Advance Config" :show-content="false">
    <ul class="panel-component-items">
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Show for each product on cart page</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="settings.show_on_line_item"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Show on pages</div>
        <div class="panel-component-item-content">
          <el-checkbox-group v-model="settings.show_on_pages" :min="1">
            <el-checkbox label>Home</el-checkbox>
            <el-checkbox label="products">Product</el-checkbox>
            <el-checkbox label="collections">Collection</el-checkbox>
            <el-checkbox label="pages">Page</el-checkbox>
            <el-checkbox label="cart">Cart</el-checkbox>
          </el-checkbox-group>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Auto Detect Customer's Zipcode/Country</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="settings.get_customer_zipcode"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <span
            v-if="settings.get_customer_zipcode"
            class="panel-component-item-content-helper-text warning"
          >
            <i class="el-icon-warning"></i>
            <span>This will make the application a bit slower</span>
          </span>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Enable debugger</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="settings.enableDebugger"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <span
            v-if="settings.enableDebugger"
            class="panel-component-item-content-helper-text warning"
          >
        </span>
        </div>
      </li>

      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Disable when product is out of stock</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="settings.disable_when_product_is_out_of_stock"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <span
            v-if="settings.disable_when_product_is_out_of_stock"
            class="panel-component-item-content-helper-text warning"
          >
            <i class="el-icon-warning"></i>
            <span>This will make the application a bit slower</span>
          </span>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline"> 
        <div class="panel-component-item-title">Require estimated date before adding product to cart  </div>
        <div class="panel-component-item-content">
            <el-switch
            v-model="settings.requireAddToCart"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Min all file js from app</div>
        <el-select v-model="settings.clientJsUrl" placeholder="Select">
            <el-option
              v-for="(element, index) in [{'label':'Default','value':'development'},{'label':'Min all file js','value':'product'}]"
              :key="index"
              :label="element.label"
              :value="element.value"
            ></el-option>
        </el-select>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Custom Css</div>
        <div class="panel-component-item-content">
          <el-input type="textarea" autosize placeholder="Custom css" v-model="settings.custom_css"></el-input>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Clear Cache</div>
        <div class="panel-component-item-content">
          <clear-cached-shopify-data-button type="primary"/>
        </div>
      </li> 
    </ul>
  </viewing-card>
</template>

<script>
module.exports = {
  name: "advance-settings",
    data() {
        return {

        }
    },
    computed: {
        ...Vuex.mapGetters({
            settings: "generalSettings/getSettings"
        }) 
    }
};
</script>
