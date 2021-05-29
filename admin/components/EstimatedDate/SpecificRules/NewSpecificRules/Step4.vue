<template>
  <div>
    <h1 class="text-center" v-html="title"></h1>
    <div class="text-center ml30 mt20 mb20">
      <p v-for="notice in createdStreaming" :key="notice">
        <span class="icon-success">
          <i class="el-icon-success"></i>
        </span>
        <span v-html="notice"></span>
      </p>
    </div>
    <div v-if="creating" v-loading="creating"></div>
  </div>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      creating: "estimatedDate/specificRules/newSpecificRule/getCreating"
    })
  },
  data() {
    return {
      title: "We are saving your configuration",
      createdStreaming: []
    };
  },
  created() {
    this.createSpecificRule()
      .then(() => {
        this.createdStreaming.push(`Done !`);
        this.getSpecificRules();
      })
      .catch(error => {
         ShopifyNotification("Error when create new rule","error"); 
      });
  },
  methods: {
    ...Vuex.mapActions({
      createSpecificRule:
        "estimatedDate/specificRules/newSpecificRule/createSpecificRule",
      getSpecificRules: "estimatedDate/specificRules/getSpecificRules" 
    })
  }
};
</script> 

<style scoped>
.icon-success {
  color: #67c23a;
}
</style>
