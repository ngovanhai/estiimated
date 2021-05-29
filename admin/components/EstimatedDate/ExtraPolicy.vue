<template>
  <viewing-card title="Extra Policy Info" :show-content="false">
    <ul class="panel-component-items">
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Policy Page</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Ex: Our shipping policy" v-model="settings.privacy_page_text"></el-input>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Policy Page Url</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Ex: https://policy.com" v-model="settings.privacy_page_url"></el-input>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">More Shipping Info</div>
        <div class="panel-component-item-content">
          <el-input
            type="textarea"
            autosize
            placeholder="Ex: We will try our best to ship on specific dates"
            v-model="settings.privacy_more"
          ></el-input>
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
      settings: "estimatedDate/getSettings"
    })
  }
};
</script>
