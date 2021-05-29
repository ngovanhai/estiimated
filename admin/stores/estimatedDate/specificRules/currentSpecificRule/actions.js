const actions = {
    setSpecificRuleId({
        commit
    }, {
        id
    }) {
        commit("SET_ESTIMATED_DATE_SPECIFIC_RULE_ID", {
            id
        });
    },
    getSpecificRule({
        commit,
        state,
        rootGetters
    }) {
        return new Promise((resolve, reject) => {
            commit("FETCHING_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE");
            Vue.http
                .get(window.estimatedDateSpecificRulesApi, {
                    params: {
                        action: "getById",
                        shop: window.shop,
                        id: state.id
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("FETCH_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE_SUCCESS");
                        commit("SET_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE", {
                            rule: res.body.rule,
                            products: rootGetters["_shopify/products/getProducts"],
                            collections: rootGetters["_shopify/collections/getCollections"],
                            vendors: rootGetters["_shopify/vendors/getVendors"],
                        });
                        resolve();
                    } else {
                        throw new Error("Error when fetching estimated date specific rules");
                    }
                })
                .catch(error => {
                    commit("FETCH_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE_ERROR");
                    reject(error.message);
                });
        });
    },
    saveSpecificRule({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            commit("UPDATING_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE");
            Vue.http
                .post(window.estimatedDateSpecificRulesApi, {
                    action: state.forceCreate ? "create" : "update",
                    shop: window.shop,
                    rule: state.rule
                }, {
                        emulateJSON: true
                    })
                .then(res => {
                    if (res.body.success) {
                        commit("UPDATE_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE_SUCCESS");
                        resolve();
                        window.eventBus.$emit("generate-json-file");
                    } else {
                        throw new Error("Error when updating estimated date specific rules");
                    }
                })
                .catch(error => {
                    commit("UPDATE_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE_ERROR");
                    reject(error.message);
                });
        });
    },
    setSelectedTargets({
        commit
    }, {
        targets
    }) {
        commit("SET_ESTIMATED_DATE_SPECIFIC_RULE_SELECTED_TARGETS", {
            targets
        });
    },
    setForceCreate({
        commit
    }, {
        forceCreate
    }) {
        commit("SET_ESTIMATED_DATE_SPECIFIC_RULE_FORCE_CREATE", {
            forceCreate
        });
    },
}

export default actions;