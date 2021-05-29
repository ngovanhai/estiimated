const apiUrl = window.countrySpecificProductsApi;
const shop = window.shop;

const actions = {
    getRules({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            let {
                page,
                perPage
            } = state;
            var data = {
                shop: shop,
                action: "get",
                page: page,
                limit: perPage
            } 
            if(typeof window.searchProduct != "undefined"){
                data.searchProduct = window.searchProduct;
            }
            if(typeof window.filterCountry != "undefined"){
                data.filterCountry = window.filterCountry;
            }
            commit("FETCHING_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULES");
            Vue.http
                .get(apiUrl, {
                    params: data
                })
                .then(res => {
                    if (res.body.success) {
                        commit("FETCH_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULES_SUCCESS");
                        commit("SET_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULES", {
                            rules: res.body.rules
                        });
                        commit("SET_COUNTRY_DELIVERY_TOTAL_SPECIFIC_PRODUCT_RULES", {
                            total: res.body.count
                        });
                        resolve();
                    } else {
                        throw new Error("Error when get country delivery - specific product rules");
                    }
                })
                .catch(error => {
                    commit("FETCH_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULES_ERROR");
                    reject(error.message)
                });
        });
    },
    setPage({
        commit
    }, {
        page
    }) {
        commit("SET_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_PAGE", {
            page
        });
    },
    deleteRule({
        commit
    }, {
        id
    }) {
        return new Promise((resolve, reject) => {
            commit("DELETING_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE");
            Vue.http
                .get(
                    apiUrl, {
                        params: {
                            id: id,
                            shop: shop,
                            action: "delete"
                        }
                    }, {
                        emulateJSON: true
                    }
                )
                .then(res => {
                    if (res.body.success) {
                        commit("DELETE_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE_SUCCESS");
                        commit("REMOVE_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE", {
                            id: id
                        });
                        resolve();
                        window.eventBus.$emit("generate-json-file");
                    } else {
                        throw new Error("Error when deleting country delivery - specific product rules");
                    }
                })
                .catch(error => {
                    commit("DELETE_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE_ERROR");
                    reject(error.message)
                });
        });
    },
    setEditingRule({
        commit
    }, {
        rule
    }) {
        commit("SET_COUNTRY_DELIVERY_EDITING_SPECIFIC_PRODUCT", {
            rule
        });
    },
    updateRule({
        commit,
        state,
        dispatch
    }) {
        return new Promise((resolve, reject) => {
            let rule = state.editingRule;
            dispatch("validateRule", {
                    rule
                })
                .then(() => {
                    commit("UPDATING_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE");
                    return Vue.http
                        .post(
                            apiUrl, {
                                rule,
                                shop,
                                action: "update"
                            }, {
                                emulateJSON: true
                            }
                        )
                })
                .then(response => {
                    if (response.body.success) {
                        commit("UPDATE_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE_SUCCESS");
                        commit("SET_COUNTRY_DELIVERY_UPDATED_SPECIFIC_PRODUCT", {
                            rule
                        });
                        window.eventBus.$emit("generate-json-file");
                        resolve();
                    } else {
                        throw new Error("Error when deleting country delivery - specific product rules");
                    }
                })
                .catch(error => {
                    commit("UPDATE_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE_ERROR");
                    reject(error.message)
                });
        });
    },
    createRule({
        commit,
        dispatch
    }, {
        rule
    }) {
        return new Promise((resolve, reject) => {
            dispatch("validateRule", {
                    rule
                })
                .then(() => {
                    commit("CREATING_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE");
                    return Vue.http
                        .post(
                            apiUrl, {
                                rule,
                                shop,
                                action: "create"
                            }, {
                                emulateJSON: true
                            }
                        )
                })
                .then(response => {
                    if (response.body.success) {
                        commit("CREATE_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE_SUCCESS");
                        rule = response.body.rule;
                        commit("PUSH_COUNTRY_DELIVERY_NEW_SPECIFIC_PRODUCT_RULE", {
                            rule
                        });
                        resolve();
                    } else {
                        throw new Error("Error when deleting country delivery - specific product rules");
                    }
                })
                .catch(error => {
                    commit("CREATE_COUNTRY_DELIVERY_SPECIFIC_PRODUCT_RULE_ERROR");
                    reject(error.message)
                });
        });
    },
    validateRule({}, {
        rule
    }) {
        return new Promise((resolve, reject) => {
            let errorMessage = null;
            if (!rule.country_id) {
                errorMessage = "You must select one country rule";
            }
            if (Number(rule.minimum_days) < 0) {
                errorMessage = '"Minimum Days" must be greater than or equal 0';
            }
            if (Number(rule.estimate_day) < 0) {
                errorMessage = '"Estimated Days" must be greater than or equal 0';
            }
            if (errorMessage) {
                reject({
                    message: errorMessage
                });
            } else {
                resolve();
            }
        });
    }
}

export default actions;