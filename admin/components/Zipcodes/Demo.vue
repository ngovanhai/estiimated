<template>
    <div style="padding: 0 35px;">
        <h3>Demo Preview</h3>
        <md-divider></md-divider>
        <div v-if="demo" 
            :style="{
                'font-size' : generalSettings.text_size + 'px',
                'color' : generalSettings.text_color
            }"
        >
            <p v-if="demo.zipcode_available == 1">{{settings.zipcode_available_text}} {{getFirstZipcode()}}</p>
            <p v-else>{{settings.zipcode_not_available_text}} {{getFirstZipcode()}}</p>
            <p v-if="demo.show_estimated_date == 1">{{handleDemoEstimateText()}}</p>
            <p v-if="demo.show_cash_delivery == 1">
                <span v-if="demo.cash_delivery_available == 1">{{settings.cash_available_text}}</span>
                <span v-else>{{settings.cash_not_available_text}}</span>
            </p>
            <p v-if="demo.show_extra_cost == 1">
                {{settings.extra_cost_text}} {{demo.extra_cost}}
            </p>
            <p v-if="demo.show_courier == 1">
                {{settings.shipping_via}} 
                <a :href="demo.courier_url">{{demo.courier_name}}</a>
            </p>
            <p v-if="demo.show_custom_text == 1" v-html="demo.custom_text"></p>
        </div>
    </div>
</template>

<script>
var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
module.exports = {
    name : 'label-settings',
    props: ['generalSettings','settings', 'demo'],
    data () {
        return {
        }
    },
    mounted () {
    },
    methods: {
        getFirstZipcode () {
            let zipcodes = this.demo.zipcode_list.split(',');
            return zipcodes[0].trim();
        },
        handleDemoEstimateText () {
            let dateFormat = this.generalSettings.date_format;
            let rawText = this.settings.estimated_text;
            let minimumDays = this.demo.minimum_days;
            let estimatedDays = this.demo.estimated_days;
            let calculatedDay = this.calculateStartAndEndDay(minimumDays, estimatedDays);
            let startDate = calculatedDay.startDay;
            let endDate = calculatedDay.endDate;

            rawText = rawText.replace('{date}', moment(startDate).format(dateFormat));
            rawText = rawText.replace('{date+1}', moment(endDate).format(dateFormat));
            return rawText;
        },
        increaseDateTimeByDays(currentDay, time) {
            let d = new Date(currentDay);
            d.setDate(d.getDate() + Number(time));
            d = new Date(d);
            return d;
        },
        calculateStartAndEndDay (minimumDays, estimatedDays) {
            let dayOffs        = this.generalSettings.week_day_off;
            let specialDayOffs = this.generalSettings.specific_day_off;
            // Begin calculate start day
            let startDay = this.calculateStartDay(minimumDays, specialDayOffs, dayOffs);
            // Begin calculate end day
            let endDay   = this.calculateEndDay(startDay, estimatedDays, specialDayOffs, dayOffs);
            return {
                startDay : startDay,
                endDay   : endDay
            }
        },
        calculateStartDay (minimumDays, specialDayOffs, dayOffs ) {
            let startDay = new Date();
            for (let i = 0; i < minimumDays; i++) {
                startDay = this.increaseDateTimeByDays(startDay, 1);
                let compareDay = this.handleLocalDateTime(startDay);
                if (specialDayOffs.indexOf(compareDay) > -1) {
                    minimumDays++;
                } else if (dayOffs.length < 7 && dayOffs.indexOf(daysOfWeek[new Date(startDay).getDay()]) > -1) {
                    minimumDays++;
                }
            }
            return startDay;
        },
        calculateEndDay (startDay, estimatedDays, specialDayOffs, dayOffs) {
            let endDay = startDay;
            for (let i = 1; i < estimatedDays; i++) {
                endDay = this.increaseDateTimeByDays(endDay, 1);
                let compareDay = this.handleLocalDateTime(endDay);
                if (specialDayOffs.indexOf(compareDay) > -1) {
                    estimatedDays++;
                } else if (dayOffs.length < 7 && dayOffs.indexOf(daysOfWeek[new Date(endDay).getDay()]) > -1) {
                    estimatedDays++;
                }
            }
            return endDay;
        },
        handleLocalDateTime(time) {
            var day = time.getDate();
            var month = time.getMonth();
            var year = time.getFullYear();
            if (day < 10) {
                day = '0' + day;
            }
            month = month + 1;
            if (month < 10) {
                month = '0' + month;
            }
            return `${year}-${month}-${day}`;
        },
        increaseDateTimeByDays(currentDay, time) {
            let d = new Date(currentDay);
            d.setDate(d.getDate() + Number(time));
            d = new Date(d);
            return d;
        }
    },
    components: {
        
    }
}
</script>

<style>
p {
    display: block;
}
</style>
