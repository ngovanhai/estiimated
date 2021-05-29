import importer from "../../lib/importer/importer.js";

export default new Promise(async $export => {

    // grab many modules at once
    const [getters, actions, mutations] = await importer(
        import(`./getters.js?v=${window.v}`),
        import(`./actions.js?v=${window.v}`),
        import(`./mutations.js?v=${window.v}`),
    );

    const state = {
        shippingMethods: [],
        fetching: false,
        updating: false,
        creating: false,
        deleting: false,
        updatingPosition: false,
        newShippingMethod: {
            name: "Express Shipping",
            minimum_days: 0,
            estimated_days: 3,
            estimated_text: "Estimated between {date} and {date+1}",
            privacy_text: "Seller ships within 1 day ",
            icon: "<i class='fa fa-check'></i>"
        },
        icons: [
            "🚚",
            "🚛",
            "✈️",
            "🚀",
            "🚄",
            "🚂",
            "🚈",
            "🚢",
            "🛳️",
            "🛵",
            "🐢",
            "<i class='fa fa-check'></i>",
            ""
        ]
    }
    $export({
        namespaced: true,
        state,
        getters,
        actions,
        mutations
    });
});