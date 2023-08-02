
// export const formatDateDDMMYY = (date = '') => {
//     if (date) {
//         const arr = date.split('-');
//         return `${arr[2]}/${arr[1]}/${arr[0]}`;
//     } else {
//         return '';
//     }
// }
export const formatDateDDMMYY = (date = '') => {
    if (date) {
        if (typeof date == 'string') {
            // const arr = date.split('-');
            // return `${arr[2]}/${arr[1]}/${arr[0]}`;
            return date;
        } else {
            const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
            return `${day}/${month}/${date.getFullYear()}`;
        }

    } else {
        return '';
    }
}

export const formatDateYYMMDD = (date = '') => {
    if (date) {
        const arr = date.split('/');
        return `${arr[2]}-${arr[1]}-${arr[0]}`;
    } else {
        return '';
    }
}
export const formatStrToDate = (date = '') => {
    if (date) {
        const arr = date.split('/');
        if (arr.length == 3)
            return new Date(arr[2], arr[1] - 1, arr[0]);
        if (arr.length == 2) {
            if (+arr[0] < 13)
                return new Date(arr[1], arr[0] - 1, 1);
            else
                return new Date(arr[1], 0, arr[0]);
        }
        if (arr.length == 1)
            return new Date(arr[0], 0, 1);
    } else {
        return '';
    }
}