import { L10n } from '@syncfusion/ej2-base';
import { ElementBox } from '../viewer/page';
import { DocumentEditor } from '../../document-editor';
import { DocumentHelper } from '../viewer';
/**
 * Spell check dialog
 */
export declare class SpellCheckDialog {
    private target;
    private elementBox;
    /**
     * @private
     */
    localValue: L10n;
    private errorText;
    private spellingListView;
    private suggestionListView;
    private selectedText;
    documentHelper: DocumentHelper;
    private isSpellChecking;
    constructor(documentHelper: DocumentHelper);
    /**
     * Gets the spell checker
     * @private
     */
    readonly parent: DocumentEditor;
    private getModuleName;
    private selectHandler;
    /**
     * @private
     */
    onCancelButtonClick: () => void;
    /**
     * @private
     */
    onIgnoreClicked: () => void;
    /**
     * Method to remove errors
     */
    private removeErrors;
    /**
     * @private
     */
    onIgnoreAllClicked: () => void;
    /**
     * @private
     */
    addToDictClicked: () => void;
    /**
     * @private
     */
    changeButtonClicked: () => void;
    /**
     * @private
     */
    changeAllButtonClicked: () => void;
    /**
     * @private
     */
    show(error?: string, elementbox?: ElementBox, callSpellChecker?: boolean): void;
    /**
     * @private
     */
    updateSuggestionDialog(error: string, elementBox: ElementBox, callSpellChecker?: boolean): void;
    /**
     * Method to handle retrieved suggestions from server side
     * @param {string} error
     * @param {any} jsonObject
     */
    private handleRetrievedSuggestion;
    /**
     * @private
     */
    initSpellCheckDialog(localValue: L10n, error?: string, suggestion?: string[]): void;
    /**
     * @private
     */
    destroy(): void;
}
