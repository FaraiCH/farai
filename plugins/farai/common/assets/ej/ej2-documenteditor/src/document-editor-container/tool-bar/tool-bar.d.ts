import { Toolbar as EJ2Toolbar } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { DocumentEditorContainer } from '../document-editor-container';
import { DocumentEditor } from '../../document-editor/document-editor';
import { ToolbarItem } from '../../document-editor/base';
import { XmlHttpRequestHandler } from '../../document-editor/base/ajax-helper';
import { CustomToolbarItemModel } from '../../document-editor/base/events-helper';
/**
 * Toolbar Module
 */
export declare class Toolbar {
    /**
     * @private
     */
    toolbar: EJ2Toolbar;
    /**
     * @private
     */
    container: DocumentEditorContainer;
    /**
     * @private
     */
    filePicker: HTMLInputElement;
    /**
     * @private
     */
    imagePicker: HTMLInputElement;
    /**
     * @private
     */
    propertiesPaneButton: Button;
    /**
     * @private
     */
    importHandler: XmlHttpRequestHandler;
    /**
     * @private
     */
    isCommentEditing: boolean;
    private restrictDropDwn;
    private imgDropDwn;
    private breakDropDwn;
    private formFieldDropDown;
    private toolbarItems;
    private toolbarTimer;
    private buttonElement;
    /**
     * @private
     */
    readonly documentEditor: DocumentEditor;
    /**
     * @private
     */
    constructor(container: DocumentEditorContainer);
    private getModuleName;
    /**
     * Enables or disables the specified Toolbar item.
     * @param  {number} itemIndex - Index of the toolbar items that need to be enabled or disabled.
     * @param  {boolean} isEnable  - Boolean value that determines whether the toolbar item should be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @blazorArgsType itemIndex|int,isEnable|Boolean
     * @returns void.
     */
    enableItems(itemIndex: number, isEnable: boolean): void;
    /**
     * @private
     */
    initToolBar(items: (CustomToolbarItemModel | ToolbarItem)[]): void;
    private renderToolBar;
    private initToolbarDropdown;
    private showHidePropertiesPane;
    private onWrapText;
    private wireEvent;
    private initToolbarItems;
    /**
     * @private
     */
    reInitToolbarItems(items: (CustomToolbarItemModel | ToolbarItem)[]): void;
    private getToolbarItems;
    private clickHandler;
    private toggleLocalPaste;
    private toggleEditing;
    private toggleButton;
    private toggleTrackChangesInternal;
    private togglePropertiesPane;
    private onDropDownButtonSelect;
    private onFileChange;
    private convertToSfdt;
    private failureHandler;
    private successHandler;
    private onImageChange;
    private insertImage;
    /**
     * @private
     */
    enableDisableFormField(enable: boolean): void;
    /**
     * @private
     */
    enableDisableInsertComment(enable: boolean): void;
    /**
     * @private
     *
     */
    toggleTrackChanges(enable: boolean): void;
    /**
     * @private
     */
    enableDisableToolBarItem(enable: boolean, isProtectedContent: boolean): void;
    /**
     * @private
     */
    enableDisableUndoRedo(): void;
    private onToc;
    /**
     * @private
     */
    enableDisablePropertyPaneButton(isShow: boolean): void;
    /**
     * @private
     */
    destroy(): void;
}
