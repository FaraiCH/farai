import { RenderType } from '../base/enum';
import { IRichTextEditor, IToolbarItems } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { BaseQuickToolbar } from './base-quick-toolbar';
import { BaseToolbar } from './base-toolbar';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export declare class QuickToolbar {
    private offsetX;
    private offsetY;
    private deBouncer;
    private target;
    private locator;
    private parent;
    private contentRenderer;
    linkQTBar: BaseQuickToolbar;
    textQTBar: BaseQuickToolbar;
    imageQTBar: BaseQuickToolbar;
    tableQTBar: BaseQuickToolbar;
    inlineQTBar: BaseQuickToolbar;
    private renderFactory;
    constructor(parent?: IRichTextEditor, locator?: ServiceLocator);
    private formatItems;
    private getQTBarOptions;
    /**
     * createQTBar method
     * @hidden
     * @deprecated
     */
    createQTBar(popupType: string, mode: string, items: (string | IToolbarItems)[], type: RenderType): BaseQuickToolbar;
    private initializeQuickToolbars;
    private onMouseDown;
    private renderQuickToolbars;
    private renderInlineQuickToolbar;
    /**
     * Method for showing the inline quick toolbar
     * @hidden
     * @deprecated
     */
    showInlineQTBar(x: number, y: number, target: HTMLElement): void;
    /**
     * Method for hidding the inline quick toolbar
     * @hidden
     * @deprecated
     */
    hideInlineQTBar(): void;
    /**
     * Method for hidding the quick toolbar
     * @hidden
     * @deprecated
     */
    hideQuickToolbars(): void;
    private deBounce;
    private mouseUpHandler;
    private keyDownHandler;
    private inlineQTBarMouseDownHandler;
    private keyUpHandler;
    private selectionChangeHandler;
    private onSelectionChange;
    /**
     * getInlineBaseToolbar method
     * @hidden
     * @deprecated
     */
    getInlineBaseToolbar(): BaseToolbar;
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    destroy(): void;
    private wireInlineQTBarEvents;
    private unWireInlineQTBarEvents;
    private toolbarUpdated;
    /**
     * addEventListener
     * @hidden
     * @deprecated
     */
    addEventListener(): void;
    private onKeyDown;
    private onIframeMouseDown;
    private setRtl;
    /**
     * removeEventListener
     * @hidden
     * @deprecated
     */
    removeEventListener(): void;
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    protected onPropertyChanged(e: {
        [key: string]: RichTextEditorModel;
    }): void;
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName;
}
