const getters = {
    getRules: state => state.rules,
    getFetching: state => state.fetching,
    getTotalRules: state => state.total,
    getPage: state => state.page,
    getFetchingPreviewData: state => state.fetchingPreviewData,
    getPreviewData: state => state.previewData,
    getValues: state => state.values,
    getLimit: state => state.limit,
}

export default getters;