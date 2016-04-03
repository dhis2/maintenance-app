import Action from 'd2-ui/lib/action/Action';
import {setAppState, default as appState} from '../App/appStateStore';
import {goToRoute} from '../router';

export const onSectionChanged = Action.create('onSectionChanged', 'SideBar');

onSectionChanged
    .subscribe(({data}) => {
        if (data.section) {
            setAppState({
                sideBar: Object.assign({}, appState.state.sideBar, {
                    currentSection: data.section,
                    currentSubSection: data.subSection,
                }),
            });
            goToRoute(`/list/${data.section}/${data.subSection}`);
        } else {
            // When clicking a mainSection the subSection passed in is actually a mainSection.
            // TODO: Make this code less confusing and reduce the duplication
            setAppState({
                sideBar: Object.assign({}, appState.state.sideBar, {
                    currentSection: data.subSection,
                    currentSubSection: undefined,
                }),
            });
            goToRoute(`/list/${data.subSection}`);
        }
    });

export const onBackToSections = Action.create('onSectionChanged', 'SideBar');
onBackToSections
    .subscribe(() => {
        goToRoute(`/`);
    });
