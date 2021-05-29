<template>
  <viewing-card title="Week Working Day" :show-content="true">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="title">
        <template slot-scope="scope">
          <div class="df">
            <span v-html="scope.row.title"></span>
            <div class="fx">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.description"
              >
                <span class="notification-mark" slot="reference">
                  <i class="fas fa-question-circle"></i>
                </span>
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-for="day in days" :key="day" :label="day" :prop="day">
        <template slot-scope="scope">
          <el-checkbox
            v-if="scope.row[day].hasOwnProperty('enable')"
            v-model="scope.row[day].enable"
            @change="updateWorkingDays($event, day, 'enable')"
          ></el-checkbox>
          <el-input
            v-else-if="scope.row[day].hasOwnProperty('cut_off_after')"
            size="small"
            placeholder="24hour mode"
            v-model="scope.row[day].cut_off_after"
            :disabled="scope.row[day].disable"
            @change="updateWorkingDays($event, day, 'cut_off')"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
  </viewing-card>
</template>

<script>
module.exports = {
  data() {
    return {
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    };
  },
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings"
    }),
    tableData() {
      let workingDays = this.settings.week_working_days;
      let tableData = [
        {
          title: "Enable",
          description: "Your working day in week"
        },
        {
          title: "Cut off",
          description:
            "After this time, the 'minimum day' will automatically increase by 1. Only works with 24-hour mode"
        }
      ];
      workingDays.forEach(workingDay => {
        let { day, enable, cut_off_after } = workingDay;
        let titleDay = this.genTitle(day);
        tableData[0][titleDay] = {
          enable: enable === 1
        };
        tableData[1][titleDay] = {
          cut_off_after,
          disable: enable === 0
        };
      });
      return tableData;
    }
  },
  methods: {
    genTitle(day) {
      return this.days[day];
    },
    updateWorkingDays(value, day, type) {
      let workingDays = this.settings.week_working_days;
      let dayIndex = this.days.indexOf(day);
      let workingDay = workingDays[dayIndex];
      if (type === "enable") {
        workingDay.enable = value ? 1 : 0;
      } else if (type === "cut_off") {
        workingDay.cut_off_after = value;
      }
    }
  }
};
</script>

<style scoped>
.week-working-days-item-status .week-working-days-item-status-title {
  width: 100px;
}
.week-working-days-item-cut-off {
  margin-top: 10px;
}
.week-working-days-item-cut-off .week-working-days-item-cut-off-title {
  line-height: 32px;
  width: 100px;
}
.week-working-days-item-cut-off .week-working-days-item-cut-off-input input {
  width: 80px;
}
</style>
