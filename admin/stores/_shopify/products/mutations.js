const mutations = {
    FETCHING_SHOPIFY_PRODUCTS(state) {
        state.fetching = true;
        state.products = [];
    },
    FETCH_SHOPIFY_PRODUCTS_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_SHOPIFY_PRODUCTS_ERROR(state) {
        state.fetching = false;
    },
    PUSH_SHOPIFY_PRODUCTS(state, payload) {
        payload.products.forEach(product => {
            state.products.push(product);
        });
    },
    SET_SHOPIFY_TOTAL_PRODUCTS(state, payload) {
        state.total = payload.total;
    }
}

export default mutations;