const actions = {
    getSettings({
        commit
    }) {
        return new Promise((resolve, reject) => {
            commit("FETCHING_GENERAL_SETTINGS");
            Vue.http
                .get(window.generalSettingsApi, { 
                    params: {
                        action: "getSettings",
                        shop: window.shop
                    }
                })
                .then(res => { 
                    if (res.body.success) {
                        commit("FETCH_GENERAL_SETTINGS_SUCCESS");
                        commit("SET_GENERAL_SETTINGS", {
                            settings: res.body.settings
                        });
                        resolve();
                    } else {
                        throw new Error("Error when fetching general settings");
                    }
                })
                .catch(error => {
                    commit("FETCH_GENERAL_SETTINGS_SUCCESS");
                    reject({
                        message: error.message
                    });
                });
        });
    },
    saveSettings({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            commit("UPDATING_GENERAL_SETTINGS");
            Vue.http
                .post(
                    window.generalSettingsApi, {
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
                        commit("UPDATE_GENERAL_SETTINGS_SUCCESS");
                        commit("SET_GENERAL_SETTINGS", {
                            settings: response.body.settings
                        });
                        window.eventBus.$emit("generate-json-file");
                        resolve();
                    }
                })
                .catch(error => {
                    commit("UPDATE_GENERAL_SETTINGS_ERROR");
                    reject(error.message);
                })
        });
    }
}

export default actions;