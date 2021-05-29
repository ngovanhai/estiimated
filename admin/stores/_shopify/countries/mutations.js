const mutations = {
    FETCHING_SHOPIFY_COUNTRIES(state) {
        state.fetching = true;
        state.countries = [];
    },
    FETCH_SHOPIFY_COUNTRIES_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_SHOPIFY_COUNTRIES_ERROR(state) {
        state.fetching = false;
    },
    SET_SHOPIFY_COUNTRIES(state, payload) {
        state.countries = payload.countries;
        state.countries.push({
            id: "other_countries",
            code: "other_countries",
            name: "Other Countries",
            provinces: []
        });
    }
}

export default mutations;