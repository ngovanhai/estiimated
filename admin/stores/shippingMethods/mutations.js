const mutations = {
    FETCHING_SHIPPING_METHODS(state) {
        state.fetching = true;
    },
    FETCH_SHIPPING_METHODS_SUCCESS(state, payload) {
        state.fetching = false;
        state.shippingMethods = payload.shippingMethods;
    },
    FETCH_SHIPPING_METHODS_ERROR(state) {
        state.fetching = false;
    },
    UPDATING_SHIPPING_METHOD(state) {
        state.updating = true;
    },
    UPDATE_SHIPPING_METHOD_SUCCESS(state, payload) {
        state.updating = false;
        let methodId = payload.shippingMethod.id;
        let index = state.shippingMethods.findIndex(e => e.id == methodId);
        state.shippingMethods.splice(index, 0, ...state.shippingMethods.splice(index, 1));
    },
    UPDATE_SHIPPING_METHOD_ERROR(state) {
        state.updating = false;
    },
    DELETING_SHIPPING_METHOD(state) {
        state.deleting = true;
    },
    DELETE_SHIPPING_METHOD_SUCCESS(state, payload) {
        state.deleting = false;
        let methodId = payload.id;
        let index = state.shippingMethods.findIndex(e => e.id == methodId);
        if (index > -1) {
            state.shippingMethods.splice(index, 1);
        }
    },
    DELETE_SHIPPING_METHOD_ERROR(state) {
        state.deleting = false;
    },
    CREATING_SHIPPING_METHOD(state) {
        state.creating = true;
    },
    CREATE_SHIPPING_METHOD_SUCCESS(state, payload) {
        state.creating = false;
        state.shippingMethods.push(payload.shippingMethod);
    },
    CREATE_SHIPPING_METHOD_ERROR(state) {
        state.creating = false;
    },
    RESET_NEW_SHIPPING_METHOD(state) {
        let schema = {
            name: "Express Shipping",
            minimum_days: 0,
            estimated_days: 3,
            estimated_text: "Estimated between {date} and {date+1}",
            privacy_text: "Seller ships within 1 day ",
            icon: "<i class='fa fa-check'></i>"
        }
        state.newShippingMethod = JSON.parse(JSON.stringify(schema));
    },
    UPDATING_SHIPPING_METHODS_POSITION(state) {
        state.updatingPosition = true;
    },
    UPDATE_SHIPPING_METHODS_POSITION_SUCCESS(state) {
        state.updatingPosition = false;
    },
    UPDATE_SHIPPING_METHODS_POSITION_ERROR(state) {
        state.updatingPosition = false;
    }
}

export default mutations;