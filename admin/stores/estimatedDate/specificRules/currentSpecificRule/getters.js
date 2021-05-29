const getters = {
    getRule: state => state.rule,
    getFetching: state => state.fetching,
    getDeleting: state => state.deleting,
    getUpdating: state => state.updating,
    getAvailableTargets: state => state.availableTargets
}

export default getters;