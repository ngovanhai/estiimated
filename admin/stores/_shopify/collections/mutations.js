const mutations = {
    FETCHING_SHOPIFY_COLLECTIONS(state) {
        state.fetching = true;
        state.collections = [];
    },
    FETCH_SHOPIFY_COLLECTIONS_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_SHOPIFY_COLLECTIONS_ERROR(state) {
        state.fetching = false;
    },
    PUSH_SHOPIFY_COLLECTIONS(state, payload) {
        payload.collections.forEach(collection => {
            state.collections.push(collection);
        });
    },
    SET_SHOPIFY_TOTAL_COLLECTIONS(state, payload) {
        let {
            total_custom_collections,
            total_smart_collections
        } = payload;
        state.totalSmartCollections = Number(total_smart_collections);
        state.totalCustomCollections = Number(total_custom_collections);
    }
}

export default mutations;