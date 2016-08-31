import { hashHistory } from 'react-router';

export function goToRoute(url) {
    hashHistory.push(url);
}

export function goBack() {
    hashHistory.goBack();
}
