const mutations = {
	FETCHING_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULES(state) {
		state.fetching = true;
	},
	FETCH_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULES_SUCCESS(state) {
		state.fetching = false;
	},
	FETCH_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULES_ERROR(state) {
		state.fetching = false;
	},
	SET_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULES(state, payload) {
		state.rules = payload.rules;
	},
	SET_COUNTRY_DELIVERY_TOTAL_SPECIFIC_COLLECTION_RULES(state, payload) {
		state.total = Number(payload.total);
	},
	SET_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_PAGE(state, payload) {
		state.page = Number(payload.page);
	},
	DELETING_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE(state) {
		state.deleting = true;
	},
	DELETE_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE_SUCCESS(state) {
		state.deleting = false;
	},
	DELETE_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE_ERROR(state) {
		state.deleting = false;
	},
	REMOVE_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE(state, payload) {
		let { id } = payload;
		let index = state.rules.findIndex(e => e.id == id);
		if (index > -1) {
			state.rules.splice(index, 1);
		}
	},
	SET_COUNTRY_DELIVERY_EDITING_SPECIFIC_COLLECTION(state, payload) {
		let { rule } = payload;
		state.editingRule = JSON.parse(JSON.stringify(rule));
	},
	UPDATING_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE(state) {
		state.updating = true;
	},
	UPDATE_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE_SUCCESS(state) {
		state.updating = false;
	},
	UPDATE_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE_ERROR(state) {
		state.updating = false;
	},
	SET_COUNTRY_DELIVERY_UPDATED_SPECIFIC_COLLECTION(state, payload) {
		let { rule } = payload;
		let index = state.rules.findIndex(e => e.id == rule.id);
		state.rules.splice(index, 1);
		state.rules.splice(index, 0, rule);
	},
	CREATING_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE(state) {
		state.creating = true;
	},
	CREATE_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE_SUCCESS(state) {
		state.creating = false;
	},
	CREATE_COUNTRY_DELIVERY_SPECIFIC_COLLECTION_RULE_ERROR(state) {
		state.creating = false;
	},
	PUSH_COUNTRY_DELIVERY_NEW_SPECIFIC_COLLECTION_RULE(state, payload) {
		let { rule } = payload;
		let index = state.rules.findIndex(e => e.id === rule.id);
		if (index === -1) {
			state.rules.push(rule);
		} else {
			state.rules.splice(index, 1);
			state.rules.splice(index, 0, rule);
		}
	},
};

export default mutations;
