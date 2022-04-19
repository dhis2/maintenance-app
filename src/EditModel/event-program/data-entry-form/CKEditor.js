import PropTypes from 'prop-types';
import { noop } from 'lodash/fp';
import { CKEditor } from 'ckeditor4-react';
import { useDebouncedCallback } from 'use-debounce';
import { ckeditorConfig } from '../../ckeditorConfig';

const CKEditorWrapper = ({ initialContent, onEditorInitialized = noop, onEditorChange = noop }) => {
    const debouncedOnChange = useDebouncedCallback(onEditorChange, 250)

    // The 'change' event is only triggered in WYSIWYG mode
    // See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
    // and https://jira.dhis2.org/browse/DHIS2-5276
    const handleModeChange = (event) => {
        const { editor } = event
        if (editor.mode === 'source') {
            const editable = editor.editable()
            editable.attachListener(editable, 'input', () => {
                debouncedOnChange(editor.getData())
            })
        }
    }

    return (
        <CKEditor
            initData={initialContent}
            onInstanceReady={(event) => {
                onEditorInitialized(event.editor)
            }}
            onChange={(event) => debouncedOnChange(event.editor.getData())}
            onMode={handleModeChange}
            config={ckeditorConfig}
        />
    )
}

CKEditorWrapper.propTypes = {
    /**
     * Change handler that will be called when the content of the editor changed.
     */
    onEditorChange: PropTypes.func,
    /**
     * This callback will be called when the editor is mounted to the DOM. It will receive the instance of the CKEditor
     * that was mounted.
     */
    onEditorInitialized: PropTypes.func,
    /**
     * This is the initial content that the editor should render with. This content will only be added on the
     * `componentDidMount` lifecycle, updating the content will need to be done though setting it on the editor instance
     * directly by calling CKEditor functions like `editor.insertHtml()`.
     */
    initialContent: PropTypes.string,
};

export default CKEditorWrapper
