const actions = {
    increaseStep({
        commit
    }) {
        commit("INCREASE_ESTIMATED_DATE_NEW_SPECIFIC_RULE_STEP");
    },
    decreaseStep({
        commit
    }) {
        commit("DECREASE_ESTIMATED_DATE_NEW_SPECIFIC_RULE_STEP");
    },
    reset({
        commit
    }) {
        commit("RESET_ESTIMATED_DATE_NEW_SPECIFIC_RULE");
    },
    createSpecificRule({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            commit("CREATING_ESTIMATED_DATE_NEW_SPECIFIC_RULE");
            Vue.http
                .post(window.estimatedDateSpecificRulesApi, {
                    action: "create",
                    shop: window.shop,
                    rule: state.rule
                }, {
                    emulateJSON: true
                })
                .then(res => {
                    if (res.body.success) {
                        commit("CREATE_ESTIMATED_DATE_NEW_SPECIFIC_RULE_SUCCESS");
                        resolve();
                        window.eventBus.$emit("generate-json-file");
                    } else {
                        throw new Error("Error when updating estimated date specific rules");
                    }
                })
                .catch(error => {
                    commit("CREATE_ESTIMATED_DATE_NEW_SPECIFIC_RULE_ERROR");
                    reject(error.message);
                });
        });
    }
}

export default actions;