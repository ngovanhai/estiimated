const mutations = {
    FETCHING_ESTIMATED_DATE_SPECIFIC_RULES(state) {
        state.fetching = true;
    },
    FETCH_ESTIMATED_DATE_SPECIFIC_RULES_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_ESTIMATED_DATE_SPECIFIC_RULES_ERROR(state) {
        state.fetching = false;
    },
    SET_ESTIMATED_DATE_SPECIFIC_RULES(state, { rules }) {
        state.rules = rules;
    },
    SET_ESTIMATED_DATE_TOTAL_SPECIFIC_RULES(state, { total }) {
        state.total = Number(total);
    },
    SET_ESTIMATED_DATE_PAGE_SPECIFIC_RULES(state, { page }) {
        state.page = page;
    },
    SET_ESTIMATED_DATE_PAGE_SPECIFIC_LIMIT(state, { limit }) {
        state.limit = limit;
    },
    DELETING_ESTIMATED_DATE_SPECIFIC_RULE(state) {
        state.deleting = true;
    },
    DELETE_ESTIMATED_DATE_SPECIFIC_RULE_SUCCESS(state, { id }) {
        state.deleting = false;
        state.total -= 1;
        state.rules.splice(state.rules.findIndex(e => e.id === id), 1);
    },
    DELETE_ESTIMATED_DATE_SPECIFIC_RULE_ERROR(state) {
        state.deleting = false;
    },
    FETCHING_ESTIMATED_DATE_SPECIFIC_RULE_PREVIEW_DATA(state) {
        state.previewData = [];
        state.fetchingPreviewData = true;
    },
    FETCH_ESTIMATED_DATE_SPECIFIC_RULE_PREVIEW_DATA_SUCCESS(state) {
        state.fetchingPreviewData = false;
    },
    FETCH_ESTIMATED_DATE_SPECIFIC_RULE_PREVIEW_DATA_ERROR(state) {
        state.fetchingPreviewData = false;
    },
    SET_ESTIMATED_DATE_SPECIFIC_RULE_PREVIEW_DATA(state, payload) {
        let {
            data,
            products,
            collections,
            vendors
        } = payload;
        let limit = 3;

        let previewData = [{
            enable: data.product.length > 0,
            type: "product",
            title: "Products",
            isOverLimit: data.product.length >= limit,
            items: [...products.filter(product => data.product.slice(0, limit).indexOf(product.id) > -1)]
        },
        {
            enable: data.collection.length > 0,
            type: "collection",
            title: "Collections",
            isOverLimit: data.collection.length >= limit,
            items: [...collections.filter(collection => data.collection.slice(0, limit).indexOf(collection.id) > -1)]
        },
        {
            enable: data.collection.length > 0,
            type: "vendor",
            title: "Vendors",
            isOverLimit: data.vendor.length >= limit,
            items: [...vendors.filter(vendor => data.vendor.slice(0, limit).indexOf(vendor) > -1)]
        }
        ];
        state.previewData = previewData;
    },
    SET_ESTIMATED_DATE_SPECIFIC_RULE_SELECTED_VALUES(state, { values }) {
        state.values = values;
    }
}

export default mutations;