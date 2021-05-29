const mutations = {
    CLEARING_CACHED_SHOPIFY_DATA(state) {
        state.clearingCachedData = true;
    },
    CLEAR_CACHED_SHOPIFY_DATA_SUCCESS(state) {
        state.clearingCachedData = false;
    },
    CLEAR_CACHED_SHOPIFY_DATA_ERROR(state) {
        state.clearingCachedData = false;
    }
}

export default mutations;