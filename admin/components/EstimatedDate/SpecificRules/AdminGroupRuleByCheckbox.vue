<template>
  <div class="df">
    <div class="fx">
      <el-checkbox-group v-model="groupBy" size="mini">
        <el-checkbox-button
          v-for="groupType in groupTypes"
          :key="groupType.label"
          :label="groupType.label"
        >
          <i :class="{ [groupType.icon] : true}"></i>
          <span v-html="groupType.title"></span>
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div>
      <el-popover
        placement="right-start"
        width="200"
        trigger="hover"
        content="See your rules by grouping it by shipping method or target audience"
      >
        <span class="notification-mark" slot="reference">
          <i class="fas fa-question-circle"></i>
        </span>
      </el-popover>
    </div>
  </div>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      settings: "estimatedDate/getSettings"
    }),
    groupBy: {
      get: function() {
        return [this.settings.admin_group_rule_by];
      },
      set: function(value) {
        this.settings.admin_group_rule_by = value[1];
      }
    }
  },
  data() {
    return {
      groupTypes: [
        {
          label: "method",
          title: "Method", 
          icon: "fas fa-sitemap"
        },
        {
          label: "target",
          title: "Target",
          icon: "fas fa-crosshairs"
        }
      ]
    };
  }
};
</script>
