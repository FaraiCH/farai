import { FieldElementBox } from '../viewer/page';
import { Point } from '../editor/editor-helper';
import { DocumentEditor } from '../../document-editor';
/**
 * @private
 */
export declare class FormFieldPopUp {
    private target;
    private textBoxContainer;
    private textBoxInput;
    private numberInput;
    private dateInput;
    private dropDownInput;
    private numbericInput;
    private popupObject;
    private owner;
    private formField;
    private textBoxInstance;
    private numericTextBoxInstance;
    private datePickerInstance;
    private ddlInstance;
    private dataPickerOkButton;
    constructor(owner: DocumentEditor);
    private initPopup;
    private initTextBoxInput;
    private initNumericTextBox;
    private initDatePicker;
    private initDropDownList;
    private applyTextFormFieldValue;
    private applyNumberFormFieldValue;
    private applyDateFormFieldValue;
    private applyDropDownFormFieldValue;
    private enableDisableDatePickerOkButton;
    /**
     * @private
     */
    showPopUp(formField: FieldElementBox, point: Point): void;
    /**
     * @private
     */
    private closeButton;
    /**
     * @private
     */
    hidePopup: () => void;
}
