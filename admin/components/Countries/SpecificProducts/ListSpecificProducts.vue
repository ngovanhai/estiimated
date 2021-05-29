<template>
  <div>
    <div class="filter">
        <input placeholder="Search by product title or sku..." 
            v-model="searchProduct" 
            @input="searchOnTable"  
            class="regular-input el-input__inner" 
        /> 
        <multiselect
            v-model="filterCountry"
            :options="countryRules"
            placeholder="Search country..."
            label="name"
            track-by="id"
            @input="searchOnTable"
            select-label="Select"
            deselect-label="Remove"
            :multiple="false" /> 
    </div>
    <el-table :data="specificProducts" :span-method="getRowSpan" v-loading="loading">
      <el-table-column prop="product_id" label="Product" width="180">
        <template slot-scope="scope">
          <span v-html="getProductTitle(scope.row.product_id)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="country_id" label="Country" width="180">
        <template slot-scope="scope">
          <span v-html="getCountryName(scope.row.country_id,scope.$index)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="minimum_days" label="Minimum" width="100"></el-table-column>
      <el-table-column prop="estimated_days" label="Estimated" width="100"></el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              icon="far fa-edit"
              size="mini"
              title="Edit"
              @click="onEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              icon="far fa-trash-alt"
              size="mini"
              title="Delete"
              @click="onDelete(scope.$index, scope.row)"
            ></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="df">
      <div class="df-half-start">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="totalData"
          :page-size="perPage"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div class="df-half-end text-right">
        <el-button type="text" @click="onCreate">+ Product rule</el-button>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
    components: {
        multiselect: window.VueMultiselect.default
    },
  computed: {
    ...Vuex.mapGetters({
      products: "_shopify/products/getProducts",
      countryRules: "countryDelivery/countryRules/getCountryRules",
      specificProducts: "countryDelivery/specificProducts/getRules",
      loading: "countryDelivery/specificProducts/getFetching",
      totalData: "countryDelivery/specificProducts/getTotal",
      page: "countryDelivery/specificProducts/getPage",
      perPage: "countryDelivery/specificProducts/getPerPage"
    }),
    calculatedSpans: function() {
      if (this.specificProducts.length) {
        var currentId = this.specificProducts[0].product_id;
        var splits = [
          {
            index: 0,
            span: 1
          }
        ];
        for (var i = 1; i < this.specificProducts.length; i++) {
          if (this.specificProducts[i].product_id == currentId) {
            splits[splits.length - 1].span++;
          } else {
            currentId = this.specificProducts[i].product_id;
            splits[splits.length] = {
              index: i,
              span: 1
            };
          }
        }
        return splits;
      } else {
        return [];
      }
    },
    currentPage: {
      get: function() {
        return this.page;
      },
      set: function(page) {
        this.onGet(page);
      }
    }
  },
  data() {
    return { 
      searchProduct:"",
      filterCountry:[]
    };
  }, 
  mounted() {
    this.onGet(1); 
  },
  methods: {
    ...Vuex.mapActions({
      getRules: "countryDelivery/specificProducts/getRules",
      deleteRule: "countryDelivery/specificProducts/deleteRule",
      setPage: "countryDelivery/specificProducts/setPage",
      setEditingRule: "countryDelivery/specificProducts/setEditingRule"
    }),
    searchOnTable(){ 
      window.searchProduct = this.searchProduct;
      window.filterCountry = this.filterCountry.id; 
      this.onGet(1);
    },
     
    getProductTitle(productId) {
        
      let product = this.products.find(e => e.id == productId);
      if (product) {
        return product.title;
      } else {
           console.log("getProductTitle",productId);
         console.log("this.products",this.products);
        return "N/A";
      }
    },
    getCountryName(countryId,index) {  
      let country = this.countryRules.find(e => e.id == countryId);
      if (country) { 
        if(!this.specificProducts[index]['country_name']){
            this.specificProducts[index]['country_name'] = country.name;
        }
        return country.name;
      } else { 
          if(!this.specificProducts[index]['country_name']){
            this.specificProducts[index]['country_name'] = "N/A";
        }
        return "N/A";
      }
    },
    getRowSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        let calculated = this.calculatedSpans.find(e => e.index == rowIndex);
        if (calculated) {
          return {
            rowspan: calculated.span,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    onGet(page) {
      this.setPage({ page });
      this.getRules();
    },
    onCreate() {
      this.$emit("create");
    },
    onEdit(index, rule) {
      this.setEditingRule({
        rule
      });
      this.$emit("edit");
    },
    onDelete(index, rule) {
      this.$confirm("Do you want to delete rule of this product?", "Warning", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.deleteRule({
            id: rule.id
          }).then(() => { 
            ShopifyNotification("Delete rule success","success"); 
          });
        })
        .catch(_ => {});
    }
  }
};
</script>
<style>
.filter{
    display: flex;
}
.filter input{
    border-radius: 0px;
    border-right: none;
}
.filter>.multiselect {
    width:50%;
}
.filter .multiselect__tags{
    border-radius: 0px;   
}

.filter .multiselect .multiselect__single {
    color: #454546;
}
</style>