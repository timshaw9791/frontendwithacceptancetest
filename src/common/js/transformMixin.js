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
            }else {
                return'暂无'
            }
        },
        countdown(lastChargeTime, chargeCycle) {
            let date = (new Date()).getTime(),
                countdownTime = '';
            countdownTime = ((date - (lastChargeTime + chargeCycle * 24 * 60 * 60 * 1000)) / (1000 * 60 * 60));

            return countdownTime.toFixed(1) > 0 ? `逾期:${(countdownTime / 24).toFixed(0)}天` : `${countdownTime.toFixed(1)}小时`
        },
        countdown1(lastChargeTime) {
            let date = (new Date()).getTime();
            return Math.round((date - lastChargeTime) / 1000 / 60 / 60 / 24) + '天'
        },
        applicationType(data) {
            switch (data) {
                case 'USE_POST_TIME':
                    return '使用到期报废';
                case 'USE_DAMAGE':
                    return '使用损坏';
                case 'MAINTAIN_FAIL':
                    return '维修失败报废';
            }
        },

    }
};