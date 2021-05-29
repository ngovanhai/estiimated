import importer from "../lib/importer/importer.js";

export default new Promise(async $export => {
    const [generalSettings, shippingMethods, estimatedDate, countryDelivery, _shopify] = await importer(
        import(`./generalSettings/index.js?v=${window.v}`),
        import(`./shippingMethods/index.js?v=${window.v}`),
        import(`./estimatedDate/index.js?v=${window.v}`),
        import(`./countryDelivery/index.js?v=${window.v}`),
        import(`./_shopify/index.js?v=${window.v}`),
    );

    const modules = {
        generalSettings,
        shippingMethods,
        estimatedDate,
        countryDelivery,
        _shopify
    }

    const store = new Vuex.Store({
        modules
    });

    $export(
        store
    );
});