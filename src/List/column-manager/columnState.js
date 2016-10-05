import appState from '../../App/appStateStore';

const columnConfig = {
    'dataElement': ['name', 'code', 'categoryOptionCombo'],
}

export default appState
    .filter(appState => appState.sideBar && appState.sideBar.currentSubSection)
    .map(appState => appState.sideBar.currentSubSection)
    .distinctUntilChanged()
    .map(subSection => {
        if (subSection === 'organisationUnitLevel') {
            return ['name', 'level', 'lastUpdated'];
        }

        if (columnConfig[subSection]) {
            return columnConfig[subSection];
        }

        return ['name', 'publicAccess', 'lastUpdated'];
    })
    .map((v) => {
        return v;
    })
