import snackActions from '../../../../Snackbar/snack.actions';
import { afterDeleteHook$ } from '../../../../List/ContextActions';
import programStore from '../../eventProgramStore';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import { getInstance } from 'd2/lib/d2';
import log from 'loglevel';
import { set } from 'lodash/fp';
import { deleteProgramStageFromState } from "../epics";
import { Observable } from 'rxjs';

export async function deleteProgramStageWithSnackbar(model) {
    const d2 = await getInstance();
    snackActions.show({
        message: [
            d2.i18n.getTranslation(
                `confirm_delete_${camelCaseToUnderscores(
                    model.modelDefinition.name
                )}`
            ),
            model.name,
        ].join(' '),
        action: 'confirm',
        //TODO we cant delete from the API if the item is not already saved to the server!
        // e.g. when creating a new stage then deleting
        onActionTouchTap: () => {
            model
                .delete()
                .then(() => {
                    deleteProgramStageFromState(model.id);
                    snackActions.show({
                        message: `${model.displayName} ${d2.i18n.getTranslation(
                            'was_deleted'
                        )}`,
                    });

                    // Fire the afterDeleteHook
                    afterDeleteHook$.next({
                        model,
                        modelType: model.modelDefinition.name,
                    });
                })
                .catch(response => {
                    snackActions.show({
                        message: response.message
                            ? response.message
                            : `${model.name} ${d2.i18n.getTranslation(
                                  'was_not_deleted'
                              )}`,
                        action: 'ok',
                    });
                });
        },
    });
}


export function translationSaved() {
    snackActions.show({ message: 'translation_saved', translate: true });
};

export function translationError(errorMessage) {
    log.error(errorMessage);
    snackActions.show({ message: 'translation_save_error', action: 'ok', translate: true });
};
