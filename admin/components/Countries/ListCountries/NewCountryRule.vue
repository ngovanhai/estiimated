<template>
  <el-dialog title="New Country Rule" :visible.sync="isOpen" @close="onClose">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Country</div>
        <div class="panel-component-item-content">
        
          
        <multiselect 
            :options="defaultCountries"
            placeholder="Search a country..."
            label="name"
            track-by="name"
            select-label="Select"
            deselect-label="Remove"
            :multiple="false"
            @input="selectcountry"
            v-model="countriedSelected"
        ></multiselect>
          <span class="panel-component-item-content-helper-text">
            List countries based on
            <a
              :href="`https://${shop}/admin/settings/shipping`"
              target="_blank"
            >your shipping settings.</a>
          </span>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Name</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Ex: United States" v-model="newCountryRule.name"></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Ordering</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Ordering Countries in table" v-model="newCountryRule.Ordering"></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Minimum days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="newCountryRule.minimum_days" :min="0"></el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Estimated days</div>
        <div class="panel-component-item-content">
          <el-input-number v-model="newCountryRule.estimated_days" :min="0"></el-input-number>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Estimated text</div>
        <div class="panel-component-item-content">
          <el-input
            placeholder="Ex: Estimated between {date} and {date+1}"
            v-model="newCountryRule.estimated_text"
          ></el-input>
          <span
            class="panel-component-item-content-helper-text"
          >Please do not modify content in the '{}'.</span>
        </div>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="onClose">Close</el-button>
      <el-button type="primary" :loading="creating" @click="onSave">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
module.exports = {
  props: ["active"],
  data() {
    return {
      selectedCountry: null,
      newCountryRule: {
        id: null,
        name: null,
        code: null,
        provinces: [],
        minimum_days: 0,
        estimated_days: 2,
        estimated_text: "Estimated between {date} and {date+1}",
        shop: window.shop
      },
      countriedSelected:null,
      shop: window.shop
    };
  },
components: {
    multiselect: window.VueMultiselect.default
  },
  computed: {
    ...Vuex.mapGetters({
      defaultCountries: "_shopify/countries/getCountries",
      countryRules: "countryDelivery/countryRules/getCountryRules",
      creating: "countryDelivery/countryRules/getCreating"
    }),
    isOpen: {
      get: function() {
          console.log(this.defaultCountries)

          if(this.countryRules.length > 0){
              for(let i = 0; i < this.defaultCountries.length ;i++){
                  if(this.isRuleExist(this.defaultCountries[i]['id'])){
                      this.defaultCountries.splice(i,1); 
                  }
              }
          } 
        return this.active;
      },
      set: function() {
        this.onClose();
      }
    }
  },
  watch: {
    "newCountryRule.id": function(newCountryId) {
      if (newCountryId) {
        let country = this.defaultCountries.find(
          country => country.id == newCountryId
        );
        if (country) {
          this.newCountryRule.name = country.name;
          this.newCountryRule.code = country.code;
          this.newCountryRule.provinces = country.provinces || [];
        } else {
          this.newCountryRule.name = null;
          this.newCountryRule.code = null;
          this.newCountryRule.provinces = [];
        }
      }
    }
  },
  mounted() {
       
  },
  methods: {
    ...Vuex.mapActions({
      createCountryRule: "countryDelivery/countryRules/createCountryRule"
    }),
    isRuleExist(countryId) { 
      return this.countryRules.some(rule => rule.id == countryId);
    },
    selectcountry(){ 
        this.newCountryRule.id = this.countriedSelected.id; 
    },
    onSave() {
      let country = this.newCountryRule;
      this.createCountryRule({
        rule: country
      })
        .then(() => { 
          this.onClose();
        })
        .catch(error => {
           ShopifyNotification(error,"error"); 
        });
    },
    onClose() {
      this.$emit("close");
    }
  }
};
</script>
