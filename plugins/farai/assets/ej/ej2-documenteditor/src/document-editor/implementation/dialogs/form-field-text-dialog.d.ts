import { DocumentEditor } from '../../document-editor';
import { DocumentHelper } from '../viewer';
import { ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
/**
 * Form field text dialog is used to modify the value in text form field.
 */
export declare class TextFormFieldDialog {
    private target;
    private owner;
    private defaultTextInput;
    private maxLengthNumber;
    private tooltipTextInput;
    private bookmarkTextInput;
    private fillInEnable;
    private defaultTextLabel;
    private defaultTextDiv;
    private textFormatLabel;
    private typeDropDown;
    private textFormatDropDown;
    private fieldBegin;
    private localObj;
    constructor(owner: DocumentEditor);
    readonly documentHelper: DocumentHelper;
    /**
     * @private
     */
    getModuleName(): string;
    private initTextDialog;
    show(): void;
    /**
     * @private
     */
    changeTypeDropDown(args: ChangeEventArgs): void;
    /**
     * @private
     */
    loadTextDialog(): void;
    /**
     * @private
     */
    updateTextFormtas: () => void;
    private updateFormats;
    /**
     * @private
     */
    onCancelButtonClick: () => void;
    /**
     * @private
     */
    isValidDateFormat(): boolean;
    /**
     * @private
     */
    insertTextField: () => void;
    private closeTextField;
    private destroy;
}
