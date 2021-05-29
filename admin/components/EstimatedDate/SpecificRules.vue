<template>
  <viewing-card title="Specific Rules" :show-content="true">
    <div class="df">
      <div class="fx">
        <only-show-specific-rules-checkbox></only-show-specific-rules-checkbox>
      </div>
      <div class="text-right">
        <admin-group-rule-by-checkbox></admin-group-rule-by-checkbox>
      </div>
    </div>
    <target-search-box class="mt10 mb10"></target-search-box>
    <list-specific-rules @create="onCreate" @edit="onEdit"></list-specific-rules>
    <new-specific-rules :active="toggleNewRule" @close="onClose"></new-specific-rules>
    <edit-specific-rule :active="toggleEditRule" @close="onClose"></edit-specific-rule>
  </viewing-card>
</template>

<script>
module.exports = {
  components: {
    "only-show-specific-rules-checkbox": httpVueLoader(
      `./SpecificRules/OnlyShowSpecificRulesCheckbox.vue?v=${window.v}`
    ),
    "admin-group-rule-by-checkbox": httpVueLoader(
      `./SpecificRules/AdminGroupRuleByCheckbox.vue?v=${window.v}`
    ),
    "new-specific-rules": httpVueLoader(
      `./SpecificRules/NewSpecificRules.vue?v=${window.v}`
    ),
    "edit-specific-rule": httpVueLoader(
      `./SpecificRules/EditSpecificRule.vue?v=${window.v}`
    ),
    "list-specific-rules": httpVueLoader(
      `./SpecificRules/ListSpecificRules.vue?v=${window.v}`
    ),
    "target-search-box": httpVueLoader(
      `./SpecificRules/TargetSearchBox.vue?v=${window.v}`
    )
  },
  data() {
    return {
      toggleNewRule: false,
      toggleEditRule: false
    };
  }, 
  methods: {
    onCreate() {
      this.toggleNewRule = true;
    },
    onEdit() {
      this.toggleEditRule = true;
    },
    onClose() {
      this.toggleNewRule = false;
      this.toggleEditRule = false;
    }
  }
};
</script>


