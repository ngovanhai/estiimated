const getters = {
    getFetching: state => state.fetching,
    getDeleting: state => state.deleting,
    getUpdating: state => state.updating,
    getCreating: state => state.creating,
    getEditingRule: state => state.editingRule,
    getRules: state => state.rules,
    getTotal: state => state.total,
    getPage: state => state.page,
    getPerPage: state => state.perPage,
}

export default getters;