const getters = {
    getCountryRules: state => state.countryRules,
    getFetching: state => state.fetching,
    getDeleting: state => state.deleting,
    getUpdating: state => state.updating,
    getCreating: state => state.creating,
    getEditingRule: state => state.editingRule,
    getEditingProvinceRule: state => state.editingProvinceRule,
    getSelectedProvinces: state => state.selectedProvinces
}

export default getters;