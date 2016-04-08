import Action from 'd2-ui/lib/action/Action';
import {setAppState, default as appState} from '../App/appStateStore';
import {goToRoute} from '../router';
import { getInstance } from 'd2/lib/d2';
import { Observable } from 'rx';

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

async function searchForOrganisationUnitsWithinHeirarchy(searchValue) {
    const d2 = await getInstance();
    const organisationUnitsThatMatchQuery = await d2.models.organisationUnits
        .list({
            fields: 'id,displayName,path,children:isEmpty',
            query: searchValue,
            withinUserHierarchy: true,
            pageSize: 5,
        });

    return organisationUnitsThatMatchQuery.toArray();
}

export const onOrgUnitSearch = Action.create('onOrgUnitSearch', 'SideBar');
onOrgUnitSearch
    .filter(action => action.data)
    .distinctUntilChanged()
    .debounce(400)
    .map(({complete, error, data}) => {
        return Observable.fromPromise(searchForOrganisationUnitsWithinHeirarchy(data))
            .map(organisationUnits => {
                return {
                    complete,
                    error,
                    organisationUnits,
                };
            });
    })
    .concatAll()
    .subscribe(({complete, organisationUnits}) => {
        setAppState({
            sideBar: Object.assign({ ...appState.state.sideBar }, { organisationUnits }),
        });
        complete();
    });
