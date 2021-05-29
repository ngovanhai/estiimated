import importer from "../../lib/importer/importer.js";

export default new Promise(async $export => {

    // grab many modules at once
    const [getters, actions, mutations, specificRules] = await importer(
        import(`./getters.js?v=${window.v}`),
        import(`./actions.js?v=${window.v}`),
        import(`./mutations.js?v=${window.v}`),
        import(`./specificRules/index.js?v=${window.v}`)
    );

    const state = {
        settings: null,
        fetching: false,
        updating: false
    }

    const modules = {
        specificRules
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