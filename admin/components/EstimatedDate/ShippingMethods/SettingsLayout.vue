<template>
  <viewing-card title="display settings" :show-content="true">
    <ul class="panel-component-items">
      <!-- <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Estimated text
        </div>
        <div class="panel-component-item-content">
          <el-input
            class="fixed-input-width"
            placeholder="Please input"
            v-model="settings.estimated_text"
          >
          </el-input>
        </div>
      </li> -->
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Text Size
        </div>
        <div class="panel-component-item-content">
          <el-input
            class="fixed-input-width"
            placeholder="Please input"
            v-model="settings.text_size"
          >
            <template slot="append">px</template>
          </el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Text Color
        </div>
        <div class="panel-component-item-content">
          <el-color-picker v-model="settings.text_color"></el-color-picker>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Background Color
        </div>
        <div class="panel-component-item-content">
          <el-color-picker
            v-model="settings.background_color"
          ></el-color-picker>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Border Color
        </div>
        <div class="panel-component-item-content">
          <el-color-picker v-model="settings.border_color"></el-color-picker>
        </div>
      </li>
      <!-- <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Icons
        </div> -->
      <!-- <div class="panel-component-item-content">
          <el-select v-model="data.icon" placeholder="Select">
            <el-option
              v-for="(icon, index) in icons"
              :key="index"
              :label="icon"
              :value="icon"
            >
              <span v-html="icon"></span>
            </el-option>
          </el-select>
        </div> -->
      <!-- </li> -->
    </ul>
    <!-- <div class="action">
      <el-button class="btn_save" size="mini" round @click="cancelSample"
        >Cancel</el-button
      >
      <el-button
        type="primary"
        class="btn_save"
        size="mini"
        round
        @click="saveSample()"
        >Save</el-button
      >
    </div> -->
  </viewing-card>
</template>

<script>
module.exports = {
  props: ["data"],
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings",
      icons: "shippingMethods/getIcons",
      shippingMethotd: "shippingMethods/getShippingMethods",
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...Vuex.mapActions({
      saveSettings: "generalSettings/saveSettings",
    }),
    saveSample() {
      this.$emit("data_sample", this.data, false);
      this.settings.text_size = this.data.text_size;
      this.settings.text_color = this.data.text_color;
      this.settings.background_color = this.data.background_color;
      this.settings.border_color = this.data.border_color;
      this.saveSettings()
        .then((_) => {
          ShopifyNotification("Save Settings successfully", "success");
        })
        .catch((error) => {
          ShopifyNotification(error, "error");
        });
    },
    cancelSample() {
      // this.$emit("submitCancel",showSetting = false,showAll = true)
      this.$emit("submit_cancel", false, true);
    },
  },
};
</script>

<style scoped>
.btn_save {
  float: right;
  margin-bottom: 10px;
}
.panel-component-item {
  padding: 10px 0px;
}
.action {
  margin-bottom: 10px;
}
</style>
