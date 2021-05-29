<template>
  <viewing-card title="CountDown Config" :show-content="false"> 
    <ul class="panel-component-items"> 
       <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Timer countdown format</div>
        <div class="panel-component-item-content"> 
            <select 
                 v-model="settings.typeTimeCountdown"
                class="el-input__inner"
            >
                <option
                    v-for="position in typeTimeCountdownOption"
                    :key="position.code"
                    :label="position.title"
                    :value="position.code"
                >{{position.title}}</option>
            </select> 
            <div v-show="settings.typeTimeCountdown == 1">
                <el-input
                    class=""
                    placeholder="Label 'hour(s)'"
                    v-model="settings.hours"
                ></el-input> 
                <el-input
                    class=""
                    placeholder="Label 'minute(s)'"
                    v-model="settings.minutes"
                ></el-input> 
                <el-input
                    class=""
                    placeholder="Label 'second(s)'"
                    v-model="settings.seconds"
                ></el-input>
            </div>  
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Phrase</div>
        <div class="panel-component-item-content">
          <el-input
            class=""
            placeholder="Order today within {TimeCountDown}  and you will receive"
            v-model="settings.textCountDownFormat"
          ></el-input> 
          
          <p><small>Example: Order today within {TimeCountDown}  and you will receive</small></p>
          <p><small>{TimeCountDown}: will display count down. Please blank if you don't use</small></p>
        </div>
      </li> 
    </ul>
  </viewing-card>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings"
    })
  },
  data() {
    return {
      showContent: true,  
      typeTimeCountdownOption: [
        {
            code: 1,
            title: "1 hour(s) 10 minute(s) 10 second(s)"
        }, 
        {
            code: 2,
            title: "1:10:59"
        }, 
        {
            code: 3,
            title: "1:10"
        }  
    ],
    };
  }
};
</script>

<style scoped>
.fixed-input-width {
  width: 220px;
}
</style>
