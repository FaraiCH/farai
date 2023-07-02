import { ChangeArgs } from '@syncfusion/ej2-buttons';
import { DocumentEditor } from '../../document-editor';
import { DocumentHelper } from '../viewer';
/**
 * Form field checkbox dialog is used to modify the value in checkbox form field.
 */
export declare class CheckBoxFormFieldDialog {
    private target;
    private owner;
    private autoButton;
    private exactButton;
    private notCheckedButton;
    private checkedButton;
    private bookmarkInputText;
    private tooltipInputText;
    private checBoxEnableElement;
    private exactlyNumber;
    private exactNumberDiv;
    private fieldBegin;
    constructor(owner: DocumentEditor);
    /**
     * @private
     */
    readonly documentHelper: DocumentHelper;
    /**
     * @private
     */
    getModuleName(): string;
    private initCheckBoxDialog;
    /**
     * @private
     */
    show(): void;
    /**
     * @private
     */
    loadCheckBoxDialog(): void;
    /**
     * @private
     */
    changeBidirectional: (event: ChangeArgs) => void;
    /**
     * @private
     */
    changeBidirect: (event: ChangeArgs) => void;
    /**
     * @private
     */
    onCancelButtonClick: () => void;
    /**
     * @private
     */
    insertCheckBoxField: () => void;
    private closeCheckBoxField;
    private destroy;
}
