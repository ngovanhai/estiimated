import importer from "../../../lib/importer/importer.js";

export default new Promise(async $export => {

    // grab many modules at once
    const [getters, actions, mutations, currentSpecificRule, newSpecificRule] = await importer(
        import(`./getters.js?v=${window.v}`),
        import(`./actions.js?v=${window.v}`),
        import(`./mutations.js?v=${window.v}`),
        import(`./currentSpecificRule/index.js?v=${window.v}`),
        import(`./newSpecificRule/index.js?v=${window.v}`),
    );

    const state = {
        rules: [],
        total: 0,
        fetching: false,
        deleting: false,
        page: 1,
        limit: 3,
        fetchingPreviewData: false,
        previewData: [],
        values: [] // selected values
    }

    const modules = {
        currentSpecificRule,
        newSpecificRule
    }

    $export({
        namespaced: true,
        state,
        getters,
        actions,
        mutations,
        modules
    });
});