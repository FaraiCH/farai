import { L10n } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';
import { Editor } from '../editor';
/**
 * The notes dialog is used to insert footnote.
 */
export declare class NotesDialog {
    private footCount;
    private target;
    /**
     * @private
     */
    documentHelper: DocumentHelper;
    editor: Editor;
    private notesList;
    private startValueTextBox;
    private list;
    /**
     * @private
     */
    private noteNumberFormat;
    private sectionFormat;
    /**
     * @private
     */
    constructor(documentHelper: DocumentHelper);
    private getModuleName;
    /**
     * @private
     */
    notesDialog(localValue: L10n, isRtl?: boolean): void;
    /**
     * @private
     */
    show(): void;
    /**
     * @private
     */
    onCancelButtonClick: () => void;
    /**
     * @private
     */
    loadFontDialog: () => void;
    /**
     * @private
     */
    onInsertFootnoteClick: () => void;
    private types;
    private reversetype;
    private endnoteListValue;
    /**
     * @private
     */
    unWireEventsAndBindings: () => void;
    /**
     * @private
     */
    destroy(): void;
}
