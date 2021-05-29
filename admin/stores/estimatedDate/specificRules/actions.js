const actions = {
    getSpecificRules({
        commit,
        rootGetters,
        state
    }) {
        return new Promise((resolve, reject) => {
            commit("FETCHING_ESTIMATED_DATE_SPECIFIC_RULES");
            const settings = rootGetters["estimatedDate/getSettings"];
            const { page, values, limit } = state;  
            Vue.http
                .get(window.estimatedDateSpecificRulesApi, {
                    params: {
                        action: "get",
                        shop: window.shop,
                        page,
                        values,
                        limit,
                        group_by: settings["admin_group_rule_by"]
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("FETCH_ESTIMATED_DATE_SPECIFIC_RULES_SUCCESS");
                        commit("SET_ESTIMATED_DATE_SPECIFIC_RULES", {
                            rules: res.body.rules
                        });
                        commit("SET_ESTIMATED_DATE_TOTAL_SPECIFIC_RULES", {
                            total: res.body.total
                        });
                        resolve();
                    } else {
                        throw new Error("Error when fetching estimated date specific rules");
                    }
                })
                .catch(error => {
                    commit("FETCH_ESTIMATED_DATE_SPECIFIC_RULES_ERROR");
                    reject(error.message);
                });
        });
    },
    setLimit({
        commit
    }, {
        limit
    }) {
        commit("SET_ESTIMATED_DATE_PAGE_SPECIFIC_LIMIT", {
            limit
        });
    },
    setPage({
        commit
    }, {
        page
    }) {
        commit("SET_ESTIMATED_DATE_PAGE_SPECIFIC_RULES", {
            page
        });
    },
    deleteSpecificRule({
        commit
    }, {
        id
    }) {
        return new Promise((resolve, reject) => {
            commit("DELETING_ESTIMATED_DATE_SPECIFIC_RULE");
            Vue.http
                .get(window.estimatedDateSpecificRulesApi, {
                    params: {
                        action: "deleteById",
                        shop: window.shop,
                        id
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("DELETE_ESTIMATED_DATE_SPECIFIC_RULE_SUCCESS", {
                            id
                        });
                        resolve();
                        window.eventBus.$emit("generate-json-file");
                    } else {
                        throw new Error("Error when deleting estimated date specific rule");
                    }
                })
                .catch(error => {
                    commit("DELETE_ESTIMATED_DATE_SPECIFIC_RULE_ERROR");
                    reject(error.message);
                });
        });
    },
    getPreviewData({
        commit,
        rootGetters
    }, {
        id
    }) {
        // only work if settings.admin_group_rule_by === "method" --- shipping method
        return new Promise((resolve, reject) => {
            commit("FETCHING_ESTIMATED_DATE_SPECIFIC_RULE_PREVIEW_DATA");
            Vue.http
                .get(window.estimatedDateSpecificRulesApi, {
                    params: {
                        action: "getPreviewData",
                        shop: window.shop,
                        id
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("FETCH_ESTIMATED_DATE_SPECIFIC_RULE_PREVIEW_DATA_SUCCESS");
                        commit("SET_ESTIMATED_DATE_SPECIFIC_RULE_PREVIEW_DATA", {
                            data: res.body.targets,
                            products: rootGetters["_shopify/products/getProducts"],
                            collections: rootGetters["_shopify/collections/getCollections"],
                            vendors: rootGetters["_shopify/vendors/getVendors"],
                        });
                        resolve();
                    } else {
                        throw new Error("Error when fetching estimated date specific rule preview data");
                    }
                })
                .catch(error => {
                    commit("FETCH_ESTIMATED_DATE_SPECIFIC_RULE_PREVIEW_DATA_ERROR");
                    reject(error.message);
                });
        });
    },
    setSelectedValues({
        commit
    }, {
        values
    }) {
        commit("SET_ESTIMATED_DATE_SPECIFIC_RULE_SELECTED_VALUES", {
            values
        });
    }
}

export default actions;