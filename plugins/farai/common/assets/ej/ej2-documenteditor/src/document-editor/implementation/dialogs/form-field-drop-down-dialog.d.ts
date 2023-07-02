import { DocumentEditor } from '../../document-editor';
import { DocumentHelper } from '../viewer';
/**
 * Form field drop-down dialog is used to modify the value in drop-down form field.
 */
export declare class DropDownFormFieldDialog {
    private target;
    private owner;
    private drpDownItemsInput;
    private listviewInstance;
    private addButton;
    private editButton;
    private removeButton;
    private tooltipInput;
    private bookmarkInput;
    private dropDownEnable;
    private moveUpButton;
    private moveDownButton;
    private currentSelectedItem;
    private dropDownInstance;
    private fieldBegin;
    private dropDownItems;
    constructor(owner: DocumentEditor);
    /**
     * @private
     */
    readonly documentHelper: DocumentHelper;
    /**
     * @private
     */
    getModuleName(): string;
    private initTextDialog;
    /**
     * @private
     */
    show(): void;
    /**
     * @private
     */
    loadDropDownDialog(): void;
    private updateList;
    /**
     * @private
     */
    addItemtoList: () => void;
    /**
     * @private
     */
    removeItemFromList: () => void;
    private selectHandler;
    /**
     * @private
     */
    moveUpItem: () => void;
    /**
     * @private
     */
    moveDownItem: () => void;
    private getSelectedIndex;
    private moveUp;
    private moveDown;
    /**
     * @private
     */
    onKeyUpOnTextBox: () => void;
    private enableOrDisableButton;
    /**
     * @private
     */
    onCancelButtonClick: () => void;
    /**
     * @private
     */
    insertDropDownField: () => void;
    private closeDropDownField;
    private destroy;
}
