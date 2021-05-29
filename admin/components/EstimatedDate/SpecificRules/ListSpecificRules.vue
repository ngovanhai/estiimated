<template>
  <div>
    <group-by-method v-if="groupBy === 'method'" @edit="onEdit"></group-by-method>
    <group-by-target v-else @edit="onEdit"></group-by-target>
    <div class="df">
      <div class="df-half-start">
        <el-pagination
          v-if="total > limit"
          small
          layout="prev, pager, next"
          :total="total"
          :page-size="limit"
          :current-page.sync="page"
          @current-change="onGet"
        ></el-pagination>
      </div>
      <div class="df-half-end text-right">
        <el-button class="new-button-text" type="text" @click="onCreate">+ New rule</el-button>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  components: {
    "group-by-method": httpVueLoader(
      `./ListSpecificRules/ListGroupByMethod.vue?v=${window.v}`
    ),
    "group-by-target": httpVueLoader(
      `./ListSpecificRules/ListGroupByTarget.vue?v=${window.v}`
    )
  },
  computed: {
    ...Vuex.mapGetters({
      settings: "estimatedDate/getSettings",
      total: "estimatedDate/specificRules/getTotalRules",
      page: "estimatedDate/specificRules/getPage",
      limit: "estimatedDate/specificRules/getLimit",
      values: "estimatedDate/specificRules/getValues"
    }),
    groupBy() {
      return this.settings.admin_group_rule_by;
    }
  },
  mounted() {
    this.onGet();
    this.setLimit({
      limit: this.groupBy === "method" ? 5 : 3
    });
  },
  watch: {
    groupBy: function() {
      this.setLimit({
        limit: this.groupBy === "method" ? 5 : 3
      });
      this.onGet(1);
    },
    values: function() {
      this.onGet(1);
    }
  },
  methods: {
    ...Vuex.mapActions({
      getSpecificRules: "estimatedDate/specificRules/getSpecificRules",
      setPage: "estimatedDate/specificRules/setPage",
      setLimit: "estimatedDate/specificRules/setLimit"
    }),
    onGet(page) {
      this.setPage({
        page: page ? page : this.page
      });
      this.getSpecificRules()
        .then(() => {})
        .catch(error => {
          console.log(error);
        });
    },
    onCreate() {
      this.$emit("create"); 
    },
    onEdit() {
      this.$emit("edit");
    }
  }
};
</script>
