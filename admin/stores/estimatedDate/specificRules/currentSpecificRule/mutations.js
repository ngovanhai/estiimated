const mutations = {
    FETCHING_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE(state) {
        state.fetching = true;
    },
    FETCH_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE_SUCCESS(state) {
        state.fetching = false;
    },
    FETCH_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE_ERROR(state) {
        state.fetching = false;
    },
    SET_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE(state, payload) {
        let {
            rule,
            products,
            collections,
            vendors
        } = payload;
        for (let property in rule) {
            if (!isNaN(rule[property]) && rule[property] !== "") {
                rule[property] = Number(rule[property]);
            }
        }
        if (state.selectedTargets.length) {
            // take only first target because in this case, we will only push one target into selectedTargets
            let target = state.selectedTargets[0];
            let targets = [
                {
                    enable: false,
                    type: "product",
                    title: "Products",
                    items: []
                },
                {
                    enable: false,
                    type: "collection",
                    title: "Collections",
                    items: []
                },
                {
                    enable: false,
                    type: "vendor",
                    title: "Vendors",
                    items: []
                }
            ];
            switch (target.type) {
                case "product":
                    targets[0].enable = true;
                    targets[0].items = products.filter(product => product.id == target.value);
                    break;
                case "collection":
                    targets[1].enable = true;
                    targets[1].items = collections.filter(collection => collection.id == target.value);
                    break;
                case "vendor":
                    targets[2].enable = true;
                    targets[2].items = vendors.filter(vendor => vendor == target.value);
                    break;
                default:
                    break;
            }
            rule.targets = targets;
            state.rule = rule;
        } else {
            let targets = [{
                enable: rule.targets.product.length > 0,
                type: "product",
                title: "Products",
                items: products.filter(product => rule.targets.product.indexOf(product.id) > -1)
            },
            {
                enable: rule.targets.collection.length > 0,
                type: "collection",
                title: "Collections",
                items: collections.filter(collection => rule.targets.collection.indexOf(collection.id) > -1)
            },
            {
                enable: rule.targets.vendor.length > 0,
                type: "vendor",
                title: "Vendors",
                items: vendors.filter(vendor => rule.targets.vendor.indexOf(vendor) > -1)
            }
            ];
            rule.targets = targets;
            state.rule = rule;
        }
    },
    SET_ESTIMATED_DATE_SPECIFIC_RULE_ID(state, payload) {
        state.id = payload.id;
    },
    UPDATING_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE(state) {
        state.updating = true;
    },
    UPDATE_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE_SUCCESS(state) {
        state.updating = false;
    },
    UPDATE_ESTIMATED_DATE_CURRENT_SPECIFIC_RULE_ERROR(state) {
        state.updating = false;
    },
    SET_ESTIMATED_DATE_SPECIFIC_RULE_SELECTED_TARGETS(state, { targets }) {
        state.selectedTargets = targets || [];
    },
    SET_ESTIMATED_DATE_SPECIFIC_RULE_FORCE_CREATE(state, { forceCreate }) {
        state.forceCreate = forceCreate;
    },
}

export default mutations;