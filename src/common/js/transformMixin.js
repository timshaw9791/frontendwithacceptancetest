export const transformMixin = {
    methods: {
        formatTime(time) {
            if (time == null) return;
            return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
        },
        surface(data) {
            if (data === 'A_SURFACE') {
                return 'A面'
            } else if (data === 'B_SURFACE') {
                return 'B面'
            } else if (data === 'ALL') {
                return 'AB面'
            }
        },
        countdown(lastChargeTime, chargeCycle) {
            let date = (new Date()).getTime(),
                countdownTime = '';
            countdownTime = ((date - (lastChargeTime + chargeCycle * 24 * 60 * 60 * 1000)) / (1000 * 60 * 60));

            return countdownTime.toFixed(1) > 0 ? `逾期:${(countdownTime / 24).toFixed(1)}天` : `${countdownTime.toFixed(1)}小时`
        },
        countdown1(lastChargeTime) {
            let date = (new Date()).getTime();
            return Math.round((date - lastChargeTime) / 1000 / 60 / 60 / 24) + '天'
        }

    }
};