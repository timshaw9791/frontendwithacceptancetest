export function judgeRules(required=false, type="String", value="", validate) {
    let judge = true;
    switch (type) {
        case "Number":
            judge = /^-?\d+(\.\d+)?$/.test(value);
            break;
        case "Email":
            judge = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/.test(value);
            break;
        case 'Phone':
            judge = /^1[3456789]\d{9}$/.test(value);
            break;
        case 'CardId':
            judge = /(^\d{15}$)|(^\d{17}(\d|x|X)$)/i.test(value);
            break;
        case 'Integer':
            judge = /^-?[0-9]\d*$/.test(value);
            break;
        case 'Decimal':
            judge = /^-?([0-9]+\.[0-9]+)$/.test(value);
            break;
        case 'Require':
            judge = Boolean(value);
            break;
        case 'URL':
            judge = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/.test(value);
            break;
        default:
            judge = typeof validate == 'function'?validate(value):true;
            break;
    }
    if(required&&value=='') {
        judge = false;
    }
    return judge;  
}