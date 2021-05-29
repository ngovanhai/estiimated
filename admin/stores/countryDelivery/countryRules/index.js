import importer from "../../../lib/importer/importer.js";

export default new Promise(async $export => {

    // grab many modules at once
    const [getters, actions, mutations] = await importer(
        import(`./getters.js?v=${window.v}`),
        import(`./actions.js?v=${window.v}`),
        import(`./mutations.js?v=${window.v}`),
    );

    const state = {
        countryRules: [],
        fetching: false,
        creating: false,
        deleting: false,
        updating: false,
        editingRule: null,
        editingProvinceRule: null,
        selectedProvinces: []
    }

    $export({
        namespaced: true,
        state,
        getters,
        actions,
        mutations
    });
});