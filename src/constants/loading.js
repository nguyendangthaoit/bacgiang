
export const showLoad = () => {
    let loader = document.querySelector('.spinner');
    if (loader) {
        loader.style.display = 'flex';
        let spinner_i = document.getElementById('spinner_i');
        if (spinner_i)
            spinner_i.className += 'fa fa-spinner';
    }
};

export const hideLoad = () => {
    let loader = document.querySelector('.spinner');
    if (loader) {
        setTimeout(() => { loader.style.display = 'none'; }, 200);
    }
};