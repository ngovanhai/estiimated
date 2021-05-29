window.app = new Vue({
    el: '#estimated-app',
    components: {
        'error': httpVueLoader(`admin/Error.vue?v=${window.v}`),
    },
}).$mount('#estimated-app');