import { hashHistory } from 'react-router';

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
