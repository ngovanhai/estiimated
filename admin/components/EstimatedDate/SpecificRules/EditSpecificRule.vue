<template>
  <el-dialog
    title="Edit Rule Editor"
    class="edit-specific-rule-modal"
    :visible.sync="isOpen"
    v-loading="loading"
  >
    <el-tabs v-if="rule" class="nav__left" v-model="activeName">
      <el-tab-pane label="Rule" name="rule">
        <edit-rule></edit-rule>
      </el-tab-pane>
      <el-tab-pane label="Targets" name="target">
        <edit-targets></edit-targets>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer">
      <el-button size="small" @click="onClose">Cancel</el-button>
      <el-button type="primary" size="small" :loading="updating" @click="onSave">Save</el-button>
    </div>
  </el-dialog>
</template>

<script>
module.exports = {
  components: {
    "edit-rule": httpVueLoader(`./EditSpecificRule/EditRule.vue?v=${window.v}`),
    "edit-targets": httpVueLoader(
      `./EditSpecificRule/EditTargets.vue?v=${window.v}`
    )
  },
  props: ["active"],
  computed: {
    ...Vuex.mapGetters({
      rule: "estimatedDate/specificRules/currentSpecificRule/getRule",
      loading: "estimatedDate/specificRules/currentSpecificRule/getFetching",
      updating: "estimatedDate/specificRules/currentSpecificRule/getUpdating",
      shippingMethods: "shippingMethods/getShippingMethods"
    }),
    isOpen: {
      get: function() {
        return this.active;
      },
      set: function() {
        this.onClose();
      }
    }
  },
  data() {
    return {
      activeName: "rule"
    };
  },
  watch: {
    isOpen() {
      this.getCurrentRule();
    }
  },
  methods: {
    ...Vuex.mapActions({
      getCurrentRule:
        "estimatedDate/specificRules/currentSpecificRule/getSpecificRule",
      saveCurrentRule:
        "estimatedDate/specificRules/currentSpecificRule/saveSpecificRule",
      reloadRules: "estimatedDate/specificRules/getSpecificRules"
    }),
    onClose() {
      this.$emit("close");
    },
    onSave() {
      this.saveCurrentRule()
        .then(() => {
          this.reloadRules();
          this.onClose();
        })
        .catch(error => {
          ShopifyNotification(error,"error"); 
        });
    }
  }
};
</script>

