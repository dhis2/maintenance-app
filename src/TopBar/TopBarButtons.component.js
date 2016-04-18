import React from 'react';
import IconButton from 'material-ui/lib/icon-button';
import { goToRoute } from '../router';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

function goToGroupEditor() {
    goToRoute('/group-editor');
}

function TopBarButtons(props, context) {
    const styles = {
        buttonStyle: {
            color: '#666',
        },
    };

    return (
        <div>
            <IconButton
                iconClassName="material-icons"
                tooltip={context.d2.i18n.getTranslation('metadata_group_editor')}
                tooltipPosition="bottom-left"
                onClick={goToGroupEditor}
                iconStyle={styles.buttonStyle}
            >
                &#xE428;
            </IconButton>
        </div>
    );
}

export default addD2Context(TopBarButtons);
