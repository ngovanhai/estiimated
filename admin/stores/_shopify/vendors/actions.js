const actions = {
    getAllVendors({
        commit
    }) {
        return new Promise((resolve, reject) => {
            commit("FETCHING_SHOPIFY_VENDORS");
            Vue.http
                .get(window.shopifyApi, {
                    params: {
                        action: "getVendors",
                        shop: window.shop,
                    }
                })
                .then(res => {
                    commit("FETCH_SHOPIFY_VENDORS_SUCCESS");
                    if (res.body.success) {
                        commit("SET_SHOPIFY_VENDORS", {
                            vendors: res.body.vendors
                        });
                    } else {
                        throw new Error("Error when fetching vendors");
                    }
                    resolve();
                })
                .catch(error => {
                    commit("FETCH_SHOPIFY_VENDORS_ERROR");
                    reject({
                        message: error.message
                    });
                });
        });
    }
}

export default actions;