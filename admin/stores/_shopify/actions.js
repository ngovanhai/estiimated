const actions = {
    clearCacheData({
        commit
    }) {
        return new Promise((resolve, reject) => {
            commit("CLEARING_CACHED_SHOPIFY_DATA");
            Vue.http
                .get(window.shopifyApi, {
                    params: {
                        action: "clearCachedData",
                        shop: window.shop
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("CLEAR_CACHED_SHOPIFY_DATA_SUCCESS");
                        resolve();
                    } else {
                        throw new Error("An error has occured when clearing your cache");
                    }
                })
                .catch(error => {
                    commit("CLEAR_CACHED_SHOPIFY_DATA_ERROR");
                    reject(error.message);
                })
        })
    },
}

export default actions;