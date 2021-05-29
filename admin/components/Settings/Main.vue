<template>
  <viewing-card title="Toggle App" :show-content="true">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div class="panel-component-item-title">Enable App</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="settings.enable_app"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Layout</div>
        <div class="panel-component-item-content">
          <el-radio-group v-model="settings.layout">
            <el-radio :label="1">Estimated Date</el-radio>
            <el-radio :label="2">Zipcode Shipping</el-radio>
            <el-radio :label="3">Country Delivery</el-radio>
          </el-radio-group>
          <div class="settings-switch-tab">
            <span>You need to configure specific settings in tab :</span>
            <span
              v-if="settings.layout == 1"
              @click="$emit('change-tab', 'tab-estimated-date')"
              style="color: #409EFF; cursor: pointer;"
            >Estimated Date</span>
            <span
              v-if="settings.layout == 2"
              @click="$emit('change-tab', 'tab-zipcode')"
              style="color: #409EFF; cursor: pointer;"
            >Zipcode Shipping</span>
            <span
              v-if="settings.layout == 3"
              @click="$emit('change-tab', 'tab-countries')"
              style="color: #409EFF; cursor: pointer;"
            >Country Delivery</span>
          </div>
        </div>
      </li>
    </ul>
  </viewing-card>
</template>

<script>
module.exports = {
  name: "main-settings",
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings"
    })
  },
  data() {
    return {
      showContent: true,
      date: null,
      config: {
        altFormat: "m-d-Y"
      }
    };
  },
  components: {
    datepicker: VueFlatpickr
  }
};
</script>

<style scoped>
.settings-switch-tab {
  margin-top: 10px;
  font-size: 12px;
  color: #1d2129;
}
</style>
