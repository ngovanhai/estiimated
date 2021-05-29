var collection_since_id_s = 0;
var collection_since_id_c = 0;
const actions = {
	countCollections({ commit }) {
		return new Promise((resolve, reject) => {
			Vue.http
				.get(window.shopifyApi, {
					params: {
						action: 'countCollections',
						shop: window.shop,
					},
				})
				.then(res => {
					commit('SET_SHOPIFY_TOTAL_COLLECTIONS', res.body);
					resolve();
				})
				.catch(error => {
					reject({
						message: error.message,
					});
				});
		});
	},
	getAllCollections({ commit, dispatch }) {
		return new Promise((resolve, reject) => {
			commit('FETCHING_SHOPIFY_COLLECTIONS');
			dispatch('countCollections')
				.then(() => {
					let types = ['smart', 'custom'];
					var handleQueue = () => {
						if (types.length) {
							let type = types.shift();
							dispatch('getCollectionsByType', {
								type,
							}).then(_ => {
								handleQueue();
							});
						} else {
							commit('FETCH_SHOPIFY_COLLECTIONS_SUCCESS');
							resolve();
						}
					};
					handleQueue();
				})
				.catch(error => {
					commit('FETCH_SHOPIFY_COLLECTIONS_ERROR');
					reject({
						message: error.message,
					});
				});
		});
	},
	getCollectionsByType({ state, dispatch }, { type }) {
		let { totalCustomCollections, totalSmartCollections, limit } = state;
		let totalPages = 0;
		switch (type) {
			case 'smart':
				totalPages = Math.ceil(totalSmartCollections / limit);
				break;
			case 'custom':
				totalPages = Math.ceil(totalCustomCollections / limit);
				break;
			default:
				break;
		}
		let currentPage = 0;
		return new Promise((resolve, reject) => {
			var handleQueue = () => {
				if (currentPage < totalPages) {
					currentPage++; 
					dispatch('getCollectionsByPage', {
						page: currentPage,
						type,
					})
						.then(_ => {
							handleQueue();
						})
						.catch(error => {
							reject({
								message: error.message,
							});
						});
				} else {
					resolve();
				}
			};
			handleQueue();
		});
	},
	getCollectionsByPage({ state, commit }, { page, type }) {
		return new Promise((resolve, reject) => {
			if (type == 'smart') {
				var collection_since_id = collection_since_id_s;
			} else {
				var collection_since_id = collection_since_id_c;
			}
			Vue.http
				.get(window.shopifyApi, {
					params: {
						action: 'getCollections',
						shop: window.shop,
						page: page,
						collection_since_id: collection_since_id,
						limit: state.limit,
						type,
					},
				})
				.then(res => {
					console.log('res.body.collections', res.body.collections);
					if (res.body.success && Array.isArray(res.body.collections) && res.body.collections.length > 0) {
						commit('PUSH_SHOPIFY_COLLECTIONS', {
							collections: res.body.collections,
						});
						console.log('res.body.collections', res.body.collections);
						if (
							type == 'smart' &&
							typeof res.body.collections[res.body.collections.length - 1]['id'] != 'undefined'
						) {
							collection_since_id_s = res.body.collections[res.body.collections.length - 1]['id'];
						} else {
							collection_since_id_c = res.body.collections[res.body.collections.length - 1]['id'];
						}
					}
					resolve();
				})
				.catch(error => {
					reject({
						message: error.message,
					});
				});
		});
	},
};

export default actions;

// getAllCollections({
//     commit,
//     state
// }) {
//     let limit = state.limit;
//     return new Promise((resolve, reject) => {
//         commit("FETCHING_SHOPIFY_COLLECTIONS");
//         Vue.http
//             .get(window.shopifyApi, {
//                 params: {
//                     action: "getCollections",
//                     shop: window.shop,
//                     limit
//                 }
//             }).then(response => {
//                 if (response.body.success) {
//                     let collections = response.body.collections;
//                     commit("PUSH_SHOPIFY_COLLECTIONS", {
//                         collections
//                     });
//                     resolve();
//                 } else {
//                     throw new Error("Fail to get collections");
//                 }
//             })
//             .catch(error => {
//                 commit("FETCH_SHOPIFY_COLLECTIONS_ERROR");
//                 reject(error.message);
//             });
//     });
// },
