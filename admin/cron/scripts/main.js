new Vue({
    el: '#app',
    data: function () {
        return {
            fetching: false,
            tableData: [],
            isUpdateAll: false,
            percentage: 0
        }
    },
    created() {
        this.getAllShops();
    },
    methods: {
        getAllShops() {
            this.fetching = true;
            this.$http
                .get(window.rootApi, {
                    params: {
                        action: "getAllShops",
                    }
                })
                .then(res => {
                    this.tableData = res.body.shops.map(e => {
                        e.updating = false;
                        e.updated = false;
                        e.status = 'Not Update';
                        return e;
                    });
                    this.fetching = false;
                });
        },
        updateScriptTag(index, callback) {
            this.tableData[index].updating = true;
            this.$http
                .get(window.rootApi, {
                    params: {
                        action: "generate",
                        shop: this.tableData[index].shop
                    }
                })
                .then(res => {
                    var data = res.body;
                    if (data && data.error) {
                        this.tableData[index].status = 'Uninstalled';
                    } else {
                        this.tableData[index].status = 'Updated Script Tag';
                    }
                    this.tableData[index].updating = false;
                    if (typeof callback == 'function') {
                        callback();
                    }
                })
                .catch(error => {
                    this.tableData[index].status = 'Error';
                    this.tableData[index].updating = false;
                    if (typeof callback == 'function') {
                        callback();
                    }
                })
        },
        updateAllScripts() {
            this.isUpdateAll = true;
            var index = -1;
            var queue = () => {
                if (index < this.tableData.length - 1) {
                    index++;
                    this.percentage = Math.floor((index / this.tableData.length) * 100);
                    this.updateScriptTag(index, queue);
                } else {
                    this.percentage = 100;
                    setTimeout(() => {
                        this.isUpdateAll = false;
                    }, 2000);
                }
            }
            queue();
        },
        migrateData() {
            this.isUpdateAll = true;
            this.$http
                .get(window.rootUpdateApi, {
                    params: {
                        action: "migrateData",
                    }
                })
                .then(res => {
                    this.isUpdateAll = false;
                })
                .catch(error => {
                    this.isUpdateAll = false;
                });
        },
        genColor() {
            return `rgba(103, 194, 58, ${this.percentage / 100})`;
        },
        filterStatus(status) {
            switch (status) {
                case "Uninstalled":
                    return 'warning';
                    break;
                case "Success":
                    return 'success';
                    break;
                default:
                    return 'info';
                    break;
            }
        }
    }
});