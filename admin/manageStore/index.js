
 new Vue({
    el: '#wp_list_script',
    components: { 
        'manage-store': httpVueLoader(`components/manageStore.vue?v=${window.v}`),  
      },
    data : function () {
        return {  
          tab:1
        }
    },  
    mounted: function() {            
         
    },  
    methods : {  
        
    }, 
})
 
