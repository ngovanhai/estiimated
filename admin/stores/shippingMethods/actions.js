const actions = {
    getShippingMethods({
        commit
    }) {
        return new Promise((resolve, reject) => {
            commit("FETCHING_SHIPPING_METHODS");
            Vue.http
                .get(window.estimatedDateShippingMethodsApi, {
                    params: {
                        action: "get",
                        shop: window.shop
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("FETCH_SHIPPING_METHODS_SUCCESS", {
                            shippingMethods: res.body.methods
                        });
                        resolve();
                    } else {
                        throw new Error("An error has occured when fetching methods");
                    }
                })
                .catch(error => {
                    commit("FETCH_SHIPPING_METHODS_SUCCESS");
                    reject(error.message);
                });
        });
    },
    createShippingMethod({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            commit("CREATING_SHIPPING_METHOD");
            Vue.http
                .post(
                    window.estimatedDateShippingMethodsApi, {
                        method: state.newShippingMethod,
                        shop: window.shop,
                        action: "create"
                    }, {
                        emulateJSON: true
                    }
                )
                .then(res => {
                    if (res.body.success) {
                        commit("CREATE_SHIPPING_METHOD_SUCCESS", {
                            shippingMethod: res.body.method
                        });
                        commit("RESET_NEW_SHIPPING_METHOD");
                        resolve();
                        window.eventBus.$emit("generate-json-file");
                    } else {
                        throw new Error("An error has occured when creating methods");
                    }
                })
                .catch(error => {
                    commit("CREATE_SHIPPING_METHOD_ERROR");
                    reject(error.message);
                });
        });
    },
    updateShippingMethod({
        commit
    }, method) {
        return new Promise((resolve, reject) => {
            commit("UPDATING_SHIPPING_METHOD");
            Vue.http
                .post(
                    window.estimatedDateShippingMethodsApi, {
                        method: method,
                        shop: window.shop,
                        action: "update"
                    }, {
                        emulateJSON: true
                    }
                )
                .then(res => {
                    if (res.body.success) {
                        commit("UPDATE_SHIPPING_METHOD_SUCCESS", {
                            shippingMethod: res.body.method
                        });
                        resolve();
                        window.eventBus.$emit("generate-json-file");
                    } else {
                        ShopifyApp.flashError("An error has occured when updating method");
                    }
                })
                .catch(error => {
                    commit("UPDATE_SHIPPING_METHOD_ERROR");
                    reject();
                })
        });
    },
    updateShippingMethodsPosition({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            commit("UPDATING_SHIPPING_METHODS_POSITION");
            var sortedArr = state.shippingMethods.map((e, position) => {
                return e.id;
            });
            Vue.http
                .post(
                    window.estimatedDateShippingMethodsApi, {
                        methods: sortedArr,
                        shop: window.shop,
                        action: "updatePosition"
                    }, {
                        emulateJSON: true
                    }
                )
                .then(res => {
                    commit("UPDATE_SHIPPING_METHODS_POSITION_SUCCESS");
                    resolve();
                    window.eventBus.$emit("generate-json-file");
                })
                .catch(error => {
                    commit("UPDATE_SHIPPING_METHODS_POSITION_ERROR");
                    reject(error.message);
                });
        });
    },
    deleteShippingMethod({
        commit
    }, {
        id
    }) {
        return new Promise((resolve, reject) => {
            commit("DELETING_SHIPPING_METHOD");
            Vue.http
                .get(window.estimatedDateShippingMethodsApi, {
                    params: {
                        action: "delete",
                        shop: window.shop,
                        id
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("DELETE_SHIPPING_METHOD_SUCCESS", {
                            id
                        });
                        resolve();
                        window.eventBus.$emit("generate-json-file");
                    } else {
                        throw new Error("An error has occured when deleting method");
                    }
                })
                .catch(error => {
                    commit("DELETE_SHIPPING_METHOD_ERROR");
                    reject(error.message);
                });
        });
    },
    countRelatedSpecificRules({
        commit
    }, {
        id
    }) {
        return new Promise((resolve, reject) => {
            Vue.http
                .get(window.estimatedDateShippingMethodsApi, {
                    params: {
                        action: "countRelatedRules",
                        shop: window.shop,
                        id
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        resolve(res.body.count);
                    } else {
                        throw new Error("An error has occured when counting related rules of method");
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        });
    }
}

export default actions;