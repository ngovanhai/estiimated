<template>
  <div class="fx">
    <div class="df">
      <div>
        <el-checkbox
          class="mb20"
          v-model="settings.only_show_specific_targets"
          :true-label="1"
          :false-label="0"
        >Only show these rules</el-checkbox>
      </div>
      <div class="fx">
        <el-popover
          placement="right-start"
          width="200"
          trigger="hover"
          content="Only show the estimated time for this specific rule goal applied to"
        >
          <span class="notification-mark" style="line-height: unset;" slot="reference">
            <i class="fas fa-question-circle"></i>
          </span>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  computed: { 
    ...Vuex.mapGetters({
      settings: "estimatedDate/getSettings"
    })
  }
};
</script>