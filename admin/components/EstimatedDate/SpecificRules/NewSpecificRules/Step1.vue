<template>
  <el-form
    class="estimated-specific-rule-setup-rule-form"
    :model="rule"
    label-width="120px"
    label-position="left"
  >
    <el-form-item label="Enable" prop="enable">
      <el-switch v-model="rule.enable" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="Minimum days" prop="minimum_days">
      <el-input-number v-model="rule.minimum_days" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="Estimated days" prop="estimated_days">
      <el-input-number v-model="rule.estimated_days" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="Estimated text" prop="estimated_text">
      <el-input placeholder="Estimated between {date} and {date+1}" v-model="rule.estimated_text"></el-input>
    </el-form-item>
    <el-form-item label="Custom text" prop="custom_text">
      <el-input
        placeholder="Your custom text..."
        autosize
        type="textarea"
        v-model="rule.custom_text"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      rule: "estimatedDate/specificRules/newSpecificRule/getRule"
    })
  }
};
</script>

<style scoped>
.estimated-specific-rule-setup-rule-form {
  max-width: 500px;
  margin: auto;
}
</style>
 