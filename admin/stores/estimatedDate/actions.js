const actions = {
    getSettings({
        commit
    }) {
        return new Promise((resolve, reject) => {
            commit("FETCHING_ESTIMATED_DATE_SETTINGS");
            Vue.http
                .get(window.estimatedDateGeneralApi, {
                    params: {
                        action: "getSettings",
                        shop: window.shop
                    }
                })
                .then(res => {
                    if (res.body.success) {
                        commit("FETCH_ESTIMATED_DATE_SETTINGS_SUCCESS");
                        commit("SET_ESTIMATED_DATE_SETTINGS", {
                            settings: res.body.settings
                        });
                        resolve();
                    } else {
                        throw new Error("Error when fetching estimated date settings");
                    }
                })
                .catch(error => {
                    commit("FETCH_ESTIMATED_DATE_SETTINGS_SUCCESS");
                    reject(error.message);
                });
        });
    },
    saveSettings({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            commit("UPDATING_ESTIMATED_DATE_SETTINGS");
            Vue.http
                .post(
                    window.estimatedDateGeneralApi, {
                        settings: state.settings,
                        shop: window.shop,
                        action: "saveSettings"
                    }, {
                        emulateJSON: true
                    }
                )
                .then(response => {
                    if (response.body.error || !response.body.success) {
                        throw new Error(response.body.error);
                    } else {
                        commit("UPDATE_ESTIMATED_DATE_SETTINGS_SUCCESS");
                        commit("SET_ESTIMATED_DATE_SETTINGS", {
                            settings: response.body.settings
                        });
                        window.eventBus.$emit("generate-json-file");
                        resolve();
                    }
                })
                .catch(error => {
                    commit("UPDATE_ESTIMATED_DATE_SETTINGS_ERROR");
                    reject(error.message);
                })
        });
    }
}

export default actions;