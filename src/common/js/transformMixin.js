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
            } else {
                return '暂无'
            }
        },
        workType(data) {
            switch (data) {
                case 'DOWN_TO_UP':
                    return '调拨';
                case 'BORROW':
                    return '借用';
                case 'SCRAP':
                    return '报废';
                case 'DIRECT_TRANSFER':
                    return '报废';
            }
        },
        workState(data) {
            switch (data) {
                case 'UNDER_REVIEW':
                    return '审核中';
                case 'REJECTED':
                    return '已驳回';
                case 'PASS':
                    return '已通过';
                case 'INVALID':
                    return '作废';
            }
        },


        countdown(lastChargeTime, chargeCycle) {
            let date = (new Date()).getTime(),
                countdownTime = '';
            countdownTime = ((date - (lastChargeTime + chargeCycle)) / (1000 * 60 * 60));

            return countdownTime.toFixed(1) > 0 ? `逾期:${(countdownTime / 24).toFixed(0)}天` : `${Math.abs(Math.round(countdownTime))}小时`
        },
        countdown1(lastChargeTime) {
            let date = (new Date()).getTime();
            return Math.round((date - lastChargeTime) / 1000 / 60 / 60 / 24) + '天'
        },


        dayToMilli(data) {
            return Math.round(data * 24 * 60 * 60 * 1000);
        },

        milliToDay(data) {
            return Math.round(data / 24 / 60 / 60 / 1000)
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