const apiUrl = window.countryListCountriesApi;
const shop = window.shop;

const actions = {
    getCountryRules({
        commit
    }) { 
        var data = {
            shop: shop,
            action: "get"
        }
        if(typeof window.searchByCountryName != "undefined"){
            data.searchByCountryName = window.searchByCountryName;
        }
        return new Promise((resolve, reject) => {
            commit("FETCHING_COUNTRY_DELIVERY_COUNTRY_RULES");
            Vue.http
                .get(apiUrl, {
                    params: data
                })
                .then(res => {
                    if (res.body.success) {
                        commit("FETCH_COUNTRY_DELIVERY_COUNTRY_RULES_SUCCESS");
                        commit("SET_COUNTRY_DELIVERY_COUNTRY_RULES", {
                            rules: res.body.rules
                        });
                        resolve();
                    } else {
                        throw new Error("Error when get country delivery - country rules");
                    }
                })
                .catch(error => {
                    commit("FETCH_COUNTRY_DELIVERY_COUNTRY_RULES_ERROR");
                    reject(error.message)
                });
        });
    },
    deleteCountryRule({
        commit
    }, {
        od
    }) {
        return new Promise((resolve, reject) => {
            commit("DELETING_COUNTRY_DELIVERY_COUNTRY_RULE");
            Vue.http
                .get(apiUrl, {
                    params: {
                        od: od,
                        shop: shop,
                        action: "delete"
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("DELETE_COUNTRY_DELIVERY_COUNTRY_RULE_SUCCESS");
                        commit("REMOVE_COUNTRY_DELIVERY_COUNTRY_RULE", {
                            od
                        });
                        window.eventBus.$emit("generate-json-file");
                        resolve();
                    } else {
                        throw new Error("Error when delete country rule");
                    }
                })
                .catch(error => {
                    commit("DELETE_COUNTRY_DELIVERY_COUNTRY_RULE_ERROR");
                    reject(error.message);
                })
        });
    },
    createCountryRule({
        commit,
        dispatch
    }, {
        rule
    }) {
        return new Promise((resolve, reject) => {
            dispatch("validateCountryRule", {
                    rule
                })
                .then(() => {
                    commit("CREATING_COUNTRY_DELIVERY_NEW_COUNTRY_RULE");
                    return Vue.http
                        .post(
                            apiUrl, {
                                country: rule,
                                shop: window.shop,
                                action: "create"
                            }, {
                                emulateJSON: true
                            }
                        )
                })
                .then(response => {
                    let data = response.body;
                    if (data.success) {
                        rule.od = data.od;
                        commit("CREATE_COUNTRY_DELIVERY_NEW_COUNTRY_RULE_SUCCESS");
                        commit("PUSH_COUNTRY_DELIVERY_NEW_COUNTRY_RULE_SUCCESS", {
                            rule
                        });
                        window.eventBus.$emit("generate-json-file");
                        resolve();
                    } else if (data.error) {
                        throw new Error(data.error.message);
                    } else {
                        throw new Error("Create new Country Rule unsuccessfully !");
                    }
                })
                .catch(error => {
                    commit("CREATE_COUNTRY_DELIVERY_NEW_COUNTRY_RULE_ERROR");
                    reject(error.message);
                });
        });
    },
    updateCountryRule({
        commit,
        state,
        dispatch
    }) {
        return new Promise((resolve, reject) => {
            let {
                selectedProvinces,
                editingProvinceRule,
                editingRule
            } = state;
            let rule = editingRule;
            dispatch("validateCountryRule", {
                    rule
                })
                .then(() => {
                    commit("UPDATING_COUNTRY_DELIVERY_EDITING_COUNTRY_RULE");
                    if (selectedProvinces.length > 0) {
                        for (let province of rule.provinces) {
                            if (selectedProvinces.some(e => e.id == province.id)) {
                                province.enable_shipping = editingProvinceRule.enable_shipping;
                                province.use_custom_day = editingProvinceRule.use_custom_day;
                                province.minimum_days = editingProvinceRule.minimum_days;
                                province.estimated_days = editingProvinceRule.estimated_days;
                                province.custom_info = editingProvinceRule.custom_info;
                            }
                        }
                    }
                    return Vue.http
                        .post(
                            apiUrl, {
                                country: rule,
                                shop: window.shop,
                                action: "update"
                            }, {
                                emulateJSON: true
                            }
                        )
                })
                .then(response => {
                    let data = response.body;
                    if (data.success) {
                        commit("UPDATE_COUNTRY_DELIVERY_EDITING_COUNTRY_RULE_SUCCESS");
                        commit("SET_COUNTRY_DELIVERY_UPDATED_COUNTRY_RULE", {
                            rule
                        });
                        window.eventBus.$emit("generate-json-file");
                        resolve();
                    } else {
                        throw new Error("Save Country Rule unsuccessfully !");
                    }
                })
                .catch(error => {
                    commit("UPDATE_COUNTRY_DELIVERY_EDITING_COUNTRY_RULE_ERROR");
                    reject(error.message);
                });
        });
    },
    validateCountryRule({}, {
        rule
    }) {
        return new Promise((resolve, reject) => {
            let errorMessage = null;
            if (!rule.id) {
                errorMessage = "You must choose country first";
            } else if (!rule.name || rule.name == "") {
                errorMessage = "Name cannot be empty";
            } else if (rule.minimum_days < 0) {
                errorMessage = "Minimum days must greater than or equal 0 !";
            } else if (rule.estimated_days < 0) {
                errorMessage = "Estimated days must greater than or equal 0 !";
            } else if (!rule.estimated_text || rule.estimated_text == "") {
                errorMessage = "Estimated text cannot be empty !";
            }
            if (errorMessage) {
                reject({
                    message: errorMessage
                });
            } else {
                resolve();
            }
        });
    },
    setEditingRule({
        commit,
        dispatch
    }, {
        rule
    }) {
        dispatch("setEditingProvinceRule", {
            rule
        });
        dispatch("setSelectedProvinces", []);
        commit("SET_COUNTRY_DELIVERY_EDITING_COUNTRY_RULE", {
            rule
        });
    },
    setEditingProvinceRule({
        commit
    }, {
        rule
    }) {
        commit("SET_COUNTRY_DELIVERY_EDITING_COUNTRY_PROVINCE_RULE", {
            rule
        });
    },
    setSelectedProvinces({
        commit
    }, value) {
        commit("SET_COUNTRY_DELIVERY_EDITING_COUNTRY_SELECTED_PROVINCES", {
            provinces: value
        });
    }
}

export default actions;