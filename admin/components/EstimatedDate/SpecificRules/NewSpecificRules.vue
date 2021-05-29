<template>
  <el-dialog title="New Rule" :visible.sync="isOpen">
    <el-progress :percentage="progressPercent" status="success"></el-progress>

    <div class="estimated-specific-rule-setup-steps mt30 mb30">
      <!-- Step 0 -->
      <div class="estimated-specific-rule-setup-step" v-if="step == 0">
        <h1 class="estimated-specific-rule-setup-step-title text-center">
          <span>Which shipping method will apply this special rule ?</span>
        </h1>
        <div class="estimated-specific-rule-setup-shipping-method df mt20 mb20 text-center">
          <step-0></step-0>
        </div>
      </div>

      <!-- Step 1 -->
      <div class="estimated-specific-rule-setup-step" v-if="step == 1">
        <h1 class="estimated-specific-rule-setup-step-title text-center">
          <span>Configure special rule</span>
        </h1>
        <step-1></step-1>
      </div>

      <!-- Step 2 -->
      <div class="estimated-specific-rule-setup-step" v-if="step == 2">
        <h1 class="estimated-specific-rule-setup-step-title text-center">
          <span>Which objects will apply this rule ?</span>
        </h1>
        <step-2></step-2>
      </div>

      <!-- Step 3 -->
      <div class="estimated-specific-rule-setup-step" v-if="step == 3">
        <h1 class="estimated-specific-rule-setup-step-title text-center">
          <span>Preview your rule. Is it displaying right ?</span>
        </h1>
        <step-3></step-3>
      </div>

      <!-- Step 4 -->
      <div class="estimated-specific-rule-setup-step" v-if="step == 4">
        <step-4></step-4>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <div class="df">
        <div class="df-half-start text-left">
          <el-button
            type="text"
            :disabled="step == 0"
            size="medium"
            icon="el-icon-arrow-left"
            @click="previousStep"
          >Back</el-button>
        </div>
        <div class="df-half-end text-right">
          <el-button
            v-if="step < 4"
            type="primary"
            size="medium"
            :disabled="buttonDisableConditions"
            :loading="creating"
            @click="nextStep"
          >
            <span v-html="nextButtonText"></span>
            <i class="el-icon-arrow-right el-icon-right"></i>
          </el-button>
          <el-button
            v-else
            type="primary"
            size="medium"
            @click="onClose"
            :disabled="buttonDisableConditions"
          >
            <span>Close</span>
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
module.exports = {
  name: "specific-rules",
  components: {
    "step-0": httpVueLoader(`./NewSpecificRules/Step0.vue?v=${window.v}`),
    "step-1": httpVueLoader(`./NewSpecificRules/Step1.vue?v=${window.v}`),
    "step-2": httpVueLoader(`./NewSpecificRules/Step2.vue?v=${window.v}`),
    "step-3": httpVueLoader(`./NewSpecificRules/Step3.vue?v=${window.v}`),
    "step-4": httpVueLoader(`./NewSpecificRules/Step4.vue?v=${window.v}`)
  },
  props: ["active"],
  computed: {
    isOpen: {
      get: function() {
        return this.active;
      },
      set: function() {
        this.onClose();
      }
    },
    ...Vuex.mapGetters({
      rule: "estimatedDate/specificRules/newSpecificRule/getRule",
      step: "estimatedDate/specificRules/newSpecificRule/getStep",
      creating: "estimatedDate/specificRules/newSpecificRule/getCreating",
      progressPercent:
        "estimatedDate/specificRules/newSpecificRule/getCreationProgress"
    }),
    buttonDisableConditions() {
      switch (this.step) {
        case 0:
          return this.rule.shipping_method_id ? false : true;
          break;
        case 1:
          return this.rule.estimated_text ? false : true;
          break;
        case 2:
          return this.rule.targets.some(e => e.enable && e.items.length == 0);
          break;
        default:
          return false;
          break;
      }
    },
    nextButtonText() {
      if (this.step < 2) {
        return "Next";
      } else if (this.step == 3) {
        return "Confirm";
      } else if (this.step == 3) {
        return "Create";
      } else {
        return "Done";
      }
    }
  },
  watch: {
    isOpen: function(status) {
      if (status) {
        this.reset();
      }
    }
  },
  methods: {
    ...Vuex.mapActions({ 
      nextStep: "estimatedDate/specificRules/newSpecificRule/increaseStep",
      previousStep: "estimatedDate/specificRules/newSpecificRule/decreaseStep",
      reset: "estimatedDate/specificRules/newSpecificRule/reset"
    }),
    onClose() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.estimated-specific-rule-setup-step-title {
  font-size: 24px;
}
</style>
