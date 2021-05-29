const getters = {
    getRule: state => state.rule,
    getStep: state => state.step,
    getCreating: state => state.creating,
    getCreationProgress: state => (state.step / state.totalStep) * 100
}

export default getters;