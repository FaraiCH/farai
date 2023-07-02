import { PdfViewer, IContextMenu } from '../index';
import { PdfViewerBase } from './pdfviewer-base';
/**
 * ContextMenu module is used to handle the context menus used in the control.
 * @hidden
 */
export declare class BlazorContextMenu implements IContextMenu {
    /**
     * @private
     */
    contextMenuElement: HTMLElement;
    private pdfViewer;
    private pdfViewerBase;
    currentTarget: any;
    /**
     * @private
     */
    previousAction: string;
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    createContextMenu(): void;
    open(top: number, left: number, target: HTMLElement): void;
    close(): void;
    destroy(): void;
    OnItemSelected(selectedMenu: any): void;
}
