const mutations = {
    FETCHING_SHOPIFY_VENDORS(state) {
        state.fetching = true;
        state.vendors = [];
    },
    FETCH_SHOPIFY_VENDORS_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_SHOPIFY_VENDORS_ERROR(state) {
        state.fetching = false;
    },
    SET_SHOPIFY_VENDORS(state, payload) {
        state.vendors = payload.vendors;
    }
}

export default mutations;