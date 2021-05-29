import importer from "../../lib/importer/importer.js";

export default new Promise(async $export => {
    // grab many modules at once
    const [getters, actions, mutations, products, collections, vendors, countries] = await importer(
        import(`./getters.js?v=${window.v}`),
        import(`./actions.js?v=${window.v}`),
        import(`./mutations.js?v=${window.v}`),
        import(`./products/index.js?v=${window.v}`),
        import(`./collections/index.js?v=${window.v}`),
        import(`./vendors/index.js?v=${window.v}`),
        import(`./countries/index.js?v=${window.v}`),

    );

    const modules = {
        products,
        collections,
        vendors,
        countries
    }

    const state = {
        clearingCachedData: false
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