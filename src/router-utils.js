// import { hashHistory } from 'react-router';

const hashHistory = {
    push() {},
    goBack() {},
};

export function goToRoute(url) {
    hashHistory.push(url);
}

export function goToAndScrollUp(url) {
    goToRoute(url);
    global.scrollTo && global.scrollTo(0, 0);
}

export function goBack() {
    hashHistory.goBack();
}
