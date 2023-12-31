import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { IRenderer, IRichTextEditor, IToolbarOptions, IDropDownModel, IColorPickerModel } from '../base/interface';
import { ColorPicker } from '@syncfusion/ej2-inputs';
/**
 * `Toolbar renderer` module is used to render toolbar in RichTextEditor.
 * @hidden
 * @deprecated
 */
export declare class ToolbarRenderer implements IRenderer {
    private mode;
    private toolbarPanel;
    protected parent: IRichTextEditor;
    private popupContainer;
    private currentElement;
    private currentDropdown;
    private popupOverlay;
    /**
     * Constructor for toolbar renderer module
     */
    constructor(parent?: IRichTextEditor);
    private wireEvent;
    private unWireEvent;
    private toolbarBeforeCreate;
    private toolbarCreated;
    private toolbarClicked;
    private dropDownSelected;
    private beforeDropDownItemRender;
    private dropDownOpen;
    private dropDownClose;
    private removePopupContainer;
    /**
     * renderToolbar method
     * @hidden
     * @deprecated
     */
    renderToolbar(args: IToolbarOptions): void;
    /**
     * renderDropDownButton method
     * @hidden
     * @deprecated
     */
    renderDropDownButton(args: IDropDownModel): DropDownButton;
    private onPopupOverlay;
    private setIsModel;
    private paletteSelection;
    /**
     * renderColorPickerDropDown method
     * @hidden
     * @deprecated
     */
    renderColorPickerDropDown(args: IColorPickerModel, item: string, colorPicker: ColorPicker): DropDownButton;
    private pickerRefresh;
    private popupModal;
    private setColorPickerContentWidth;
    /**
     * renderColorPicker method
     * @hidden
     * @deprecated
     */
    renderColorPicker(args: IColorPickerModel, item: string): ColorPicker;
    /**
     * The function is used to render Rich Text Editor toolbar
     * @hidden
     * @deprecated
     */
    renderPanel(): void;
    /**
     * Get the toolbar element of RichTextEditor
     * @return {Element}
     * @hidden
     * @deprecated
     */
    getPanel(): Element;
    /**
     * Set the toolbar element of RichTextEditor
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    setPanel(panel: Element): void;
}
