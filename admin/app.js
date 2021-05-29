import importer from "./lib/importer/importer.js";
ELEMENT.locale(ELEMENT.lang.en);

(async function () {
    const [store] = await importer(
        import(`./stores/index.js?v=${window.v}`)
    );
    // document for register global components by httpVueLoader: https://www.npmjs.com/package/http-vue-loader
    httpVueLoader.register(Vue, 'admin/components/_global/ClearCachedShopifyDataButton.vue');
    httpVueLoader.register(Vue, 'admin/components/_global/ViewingCard.vue');


    window.app = new Vue({
        el: '#estimated-app',
        store,
        components: {
            'app': httpVueLoader(`admin/App.vue?v=${window.v}`),
        },
    }).$mount('#estimated-app');
})();
