import { ContextMenu as Context } from '@syncfusion/ej2-navigations';
import { PdfViewer, PdfViewerBase, IContextMenu } from '../index';
/**
 * ContextMenu module is used to handle the context menus used in the control.
 * @hidden
 */
export declare class ContextMenu implements IContextMenu {
    /**
     * @private
     */
    contextMenuObj: Context;
    /**
     * @private
     */
    contextMenuElement: HTMLElement;
    private pdfViewer;
    private pdfViewerBase;
    private copyContextMenu;
    currentTarget: any;
    /**
     * @private
     */
    previousAction: string;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    createContextMenu(): void;
    private contextMenuOnCreated;
    private setTarget;
    private contextMenuOnBeforeOpen;
    private contextMenuItems;
    private getEnabledItemCount;
    private hideContextItems;
    private enableCommentPanelItem;
    private onOpeningForShape;
    OnItemSelected(selectedMenu: string): void;
    private onMenuItemSelect;
    /**
     * @private
     */
    destroy(): void;
    /**
     * @private
     */
    close(): void;
    open(top: number, left: number, target: HTMLElement): void;
}
