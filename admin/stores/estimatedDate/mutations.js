const mutations = {
    FETCHING_ESTIMATED_DATE_SETTINGS(state) {
        state.fetching = true;
    },
    FETCH_ESTIMATED_DATE_SETTINGS_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_ESTIMATED_DATE_SETTINGS_ERROR(state) {
        state.fetching = false;
    },
    SET_ESTIMATED_DATE_SETTINGS(state, payload) {
        // Parse settings first
        let settings = payload.settings;
        settings.only_show_specific_targets = Number(
            settings.only_show_specific_targets
        );
        // Then assign
        state.settings = settings;
    },
    UPDATING_ESTIMATED_DATE_SETTINGS(state) {
        state.updating = true;
    },
    UPDATE_ESTIMATED_DATE_SETTINGS_SUCCESS(state) {
        state.updating = false;
    },
    UPDATE_ESTIMATED_DATE_SETTINGS_ERROR(state) {
        state.updating = false;
    }
}

export default mutations;