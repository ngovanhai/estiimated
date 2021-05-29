const getters = {
    getShippingMethods: state => state.shippingMethods.map(method => {
        method.is_private = Number(method.is_private);
        return method;
    }),
    getFetching: state => state.fetching,
    getCreating: state => state.creating,
    getUpdating: state => state.updating,
    getDeleting: state => state.deleting,
    getUpdatingPosition: state => state.updatingPosition,
    getNewShippingMethod: state => state.newShippingMethod,
    getIcons: state => state.icons
}

export default getters;