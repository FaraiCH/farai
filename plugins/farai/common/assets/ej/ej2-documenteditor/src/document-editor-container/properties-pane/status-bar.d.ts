import { DocumentEditor, ViewChangeEventArgs } from '../../document-editor/index';
import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../document-editor-container';
/**
 * Represents document editor status bar.
 * @private
 */
export declare class StatusBar {
    private container;
    private statusBarDiv;
    private pageCount;
    private zoom;
    private pageNumberInput;
    private editablePageNumber;
    startPage: number;
    localObj: L10n;
    private spellCheckButton;
    private currentLanguage;
    private allowSuggestion;
    private pageButton;
    private webButton;
    readonly documentEditor: DocumentEditor;
    readonly editorPageCount: number;
    constructor(parentElement: HTMLElement, docEditor: DocumentEditorContainer);
    private initializeStatusBar;
    private addSpellCheckElement;
    private onZoom;
    private onSpellCheck;
    updateZoomContent: () => void;
    private setSpellCheckValue;
    private setZoomValue;
    /**
     * Updates page count.
     */
    updatePageCount: () => void;
    /**
     * Updates page number.
     */
    updatePageNumber: () => void;
    updatePageNumberOnViewChange: (args: ViewChangeEventArgs) => void;
    private wireEvents;
    private updatePageNumberWidth;
    /**
     * @private
     */
    toggleWebLayout(): void;
    private addRemoveClass;
    private createButtonTemplate;
    /**
     * @private
     */
    destroy(): void;
}
