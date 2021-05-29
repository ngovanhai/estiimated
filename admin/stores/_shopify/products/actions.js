var since_id = 0;
const actions = { 
    countProducts({
        commit
    }) {
        return new Promise((resolve, reject) => {
            Vue.http
                .get(window.shopifyApi, {
                    params: {
                        action: "countProducts",
                        shop: window.shop
                    }
                })
                .then(res => {
                    let count = res.body;
                    commit("SET_SHOPIFY_TOTAL_PRODUCTS", {
                        total: count
                    });
                    resolve(count);
                })
                .catch(error => {
                    reject({
                        message: error.message
                    })
                });
        }) 
    },
    getAllProducts({
        commit,
        state,
        dispatch
    }) {
        let currentPage = 0;
        let totalPages = 0;
        let limit = state.limit;
        return new Promise((resolve, reject) => {
            commit("FETCHING_SHOPIFY_PRODUCTS");
            dispatch("countProducts")
                .then(total => {
                    totalPages = Math.ceil(total / limit);
                    var handleQueue = () => {
                        if (currentPage < totalPages) {
                            currentPage++;
                            $(".el-progress-bar__inner").css("width",Math.ceil((currentPage/totalPages)*100)+"%");
                            $(".el-progress-bar__innerText").html(Math.ceil((currentPage/totalPages)*100)+"%"); 
                            dispatch("getProductsByPage", {  
                            }).then(_ => {
                                handleQueue();
                            })
                        } else {
                            since_id = 0;
                            commit("FETCH_SHOPIFY_PRODUCTS_SUCCESS");
                            resolve();
                        }
                    }
                    handleQueue();
                })
                .catch(error => {
                    commit("FETCH_SHOPIFY_PRODUCTS_ERROR");
                    reject({
                        message: error.message
                    });
                });
        });
    },
    getProductsByPage({
        state,
        commit
    }, {
         
    }) {
        return new Promise((resolve, reject) => {
            Vue.http
                .get(window.shopifyApi, {
                    params: {
                        action: "getProducts",
                        shop: window.shop,
                        since_id: since_id,
                        limit: state.limit
                    }
                })
                .then(res => {
                    if (res.body && Array.isArray(res.body)) {
                        commit("PUSH_SHOPIFY_PRODUCTS", {
                            products: res.body
                        });
                        since_id = res.body[res.body.length - 1]['id']
                    }  
                    resolve();
                })
                .catch(error => {
                    reject({
                        message: error.message
                    });
                });
        });
    }
}

export default actions;
