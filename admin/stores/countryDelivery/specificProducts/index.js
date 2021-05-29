import importer from "../../../lib/importer/importer.js";

export default new Promise(async $export => {

    // grab many modules at once
    const [getters, actions, mutations] = await importer(
        import(`./getters.js?v=${window.v}`),
        import(`./actions.js?v=${window.v}`),
        import(`./mutations.js?v=${window.v}`),
    );

    const state = {
        rules: [],
        page: 1,
        perPage: 3,
        total: 0,
        fetching: false,
        creating: false,
        deleting: false,
        updating: false,
        editingRule: null
    }

    $export({
        namespaced: true,
        state,
        getters,
        actions,
        mutations
    });
});