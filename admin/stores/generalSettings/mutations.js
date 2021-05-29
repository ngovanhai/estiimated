const mutations = {
    FETCHING_GENERAL_SETTINGS(state) {
        state.fetching = true;
    },
    FETCH_GENERAL_SETTINGS_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_GENERAL_SETTINGS_ERROR(state) {
        state.fetching = false;
    },
    SET_GENERAL_SETTINGS(state, payload) {
        // Parse settings first 
        let settings = payload.settings;
        settings.enable_app = Number(settings.enable_app);
        settings.layout = Number(settings.layout);
        settings.position_code = Number(settings.position_code);
        settings.show_on_line_item = Number(settings.show_on_line_item);
        settings.disable_when_product_is_out_of_stock = Number(settings.disable_when_product_is_out_of_stock);
        settings.requireAddToCart = Number(settings.requireAddToCart);
        settings.enableDebugger = Number(settings.enableDebugger);
        settings.specific_day_off = settings.specific_day_off ?
            JSON.parse(settings.specific_day_off) : [];
        settings.week_working_days = settings.week_working_days ?
            JSON.parse(settings.week_working_days) : [];
        settings.week_working_days = settings.week_working_days.map(
            workingDay => {
                workingDay.enable = Number(workingDay.enable);
                return workingDay;
            }
        );
        settings.show_on_pages = settings.show_on_pages.split(",");
        // Then assign
        state.settings = settings; 
    },
    UPDATING_GENERAL_SETTINGS(state) {
        state.updating = true;
    },
    UPDATE_GENERAL_SETTINGS_SUCCESS(state) {
        state.updating = false;
    },
    UPDATE_GENERAL_SETTINGS_ERROR(state) {
        state.updating = false;
    }
}

export default mutations;