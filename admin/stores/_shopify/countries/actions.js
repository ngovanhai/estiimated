const actions = {
    getAllCountries({
        commit
    }) {
        return new Promise((resolve, reject) => {
            commit("FETCHING_SHOPIFY_COUNTRIES");
            Vue.http
                .get(window.shopifyApi, {
                    params: {
                        shop: window.shop,
                        action: "getDefaultCountries"
                    }
                })
                .then(res => {
                    commit("FETCH_SHOPIFY_COUNTRIES_SUCCESS");
                    if (res.body.success) {
                        commit("SET_SHOPIFY_COUNTRIES", {
                            countries: res.body.countries
                        });
                        resolve();
                    } else {
                        throw new Error("Error when get default countries");
                    }
                })
                .catch(error => {
                    commit("FETCH_SHOPIFY_COUNTRIES_ERROR");
                    reject({
                        message: error.message
                    });
                });
        });
    }
}

export default actions;