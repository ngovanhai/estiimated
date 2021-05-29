const mutations = {
    FETCHING_COUNTRY_DELIVERY_COUNTRY_RULES(state) {
        state.fetching = true;
        state.countryRules = [];
    },
    FETCH_COUNTRY_DELIVERY_COUNTRY_RULES_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_COUNTRY_DELIVERY_COUNTRY_RULES_ERROR(state) {
        state.fetching = false;
    },
    SET_COUNTRY_DELIVERY_COUNTRY_RULES(state, payload) {
        let {
            rules
        } = payload;
        state.countryRules = rules.map(country => {
            country.show_sub_regions = Number(country.show_sub_regions);
            country.display_courier_info = Number(
                country.display_courier_info
            );
            if (country.provinces) {
                country.provinces = JSON.parse(country.provinces);
            }
            return country;
        });
    },
    DELETING_COUNTRY_DELIVERY_COUNTRY_RULE(state) {
        state.deleting = true;
    },
    DELETE_COUNTRY_DELIVERY_COUNTRY_RULE_SUCCESS(state) {
        state.deleting = false;
    },
    DELETE_COUNTRY_DELIVERY_COUNTRY_RULE_ERROR(state) {
        state.deleting = false;
    },
    REMOVE_COUNTRY_DELIVERY_COUNTRY_RULE(state, payload) {
        let {
            od
        } = payload;
        let index = state.countryRules.findIndex(rule => rule.od == od);
        if (index > -1) {
            state.countryRules.splice(index, 1);
        }
    },
    CREATING_COUNTRY_DELIVERY_NEW_COUNTRY_RULE(state) {
        state.creating = true;
    },
    CREATE_COUNTRY_DELIVERY_NEW_COUNTRY_RULE_SUCCESS(state) {
        state.creating = false;
    },
    CREATE_COUNTRY_DELIVERY_NEW_COUNTRY_RULE_ERROR(state) {
        state.creating = false;
    },
    PUSH_COUNTRY_DELIVERY_NEW_COUNTRY_RULE_SUCCESS(state, payload) {
        let {
            rule
        } = payload;
        state.countryRules.push(rule);
    },
    SET_COUNTRY_DELIVERY_EDITING_COUNTRY_RULE(state, payload) {
        let {
            rule
        } = payload;
        state.editingRule = JSON.parse(JSON.stringify(rule));
    },
    UPDATING_COUNTRY_DELIVERY_EDITING_COUNTRY_RULE(state) {
        state.updating = true;
    },
    UPDATE_COUNTRY_DELIVERY_EDITING_COUNTRY_RULE_SUCCESS(state) {
        state.updating = false;
    },
    UPDATE_COUNTRY_DELIVERY_EDITING_COUNTRY_RULE_ERROR(state) {
        state.updating = false;
    },
    SET_COUNTRY_DELIVERY_UPDATED_COUNTRY_RULE(state, payload) {
        let {
            rule
        } = payload;
        let index = state.countryRules.findIndex(e => e.od == rule.od);
        if (index > -1) {
            state.countryRules.splice(index, 1);
            state.countryRules.splice(index, 0, rule);
        }
    },
    SET_COUNTRY_DELIVERY_EDITING_COUNTRY_PROVINCE_RULE(state, payload) {
        let {
            rule
        } = payload;
        var obj = {
            enable_shipping: Number(rule.enable_shipping),
            use_custom_day: rule.use_custom_day != 0 ? 1 : 0,
            minimum_days: Number(rule.minimum_days),
            estimated_days: Number(rule.estimated_days),
            custom_info: rule.custom_info
        };
        state.editingProvinceRule = obj;
    },
    SET_COUNTRY_DELIVERY_EDITING_COUNTRY_SELECTED_PROVINCES(state, payload) {
        let {
            provinces
        } = payload;
        state.selectedProvinces = provinces;
    }
}

export default mutations;