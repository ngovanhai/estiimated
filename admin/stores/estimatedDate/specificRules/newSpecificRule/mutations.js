const mutations = {
    CREATING_ESTIMATED_DATE_NEW_SPECIFIC_RULE(state) {
        state.creating = true;
    },
    CREATE_ESTIMATED_DATE_NEW_SPECIFIC_RULE_SUCCESS(state) {
        state.creating = false;
    },
    CREATE_ESTIMATED_DATE_NEW_SPECIFIC_RULE_ERROR(state) {
        state.creating = false;
    },
    INCREASE_ESTIMATED_DATE_NEW_SPECIFIC_RULE_STEP(state) {
        state.step += 1;
    },
    DECREASE_ESTIMATED_DATE_NEW_SPECIFIC_RULE_STEP(state) {
        state.step -= 1;
    },
    RESET_ESTIMATED_DATE_NEW_SPECIFIC_RULE(state) {
        state.step = 0;
        state.rule = {
            shipping_method_id: null,
            enable: 1,
            minimum_days: 0,
            estimated_days: 2,
            estimated_text: "Estimated between {date} and {date+1}",
            custom_text: null,
            targets: [{
                    enable: true,
                    title: "Products",
                    type: "product",
                    items: []
                },
                {
                    enable: false,
                    title: "Collections",
                    type: "collection",
                    items: []
                },
                {
                    enable: false,
                    title: "Vendors",
                    type: "vendor",
                    items: []
                }
            ]
        };
    }
}

export default mutations;