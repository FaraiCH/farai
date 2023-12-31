import { Spreadsheet } from '../index';
/**
 * The `Resize` module is used to handle the resizing functionalities in Spreadsheet.
 */
export declare class Resize {
    private parent;
    private trgtEle;
    private event;
    private isMouseMoved;
    /**
     * Constructor for resize module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet);
    private addEventListener;
    private autoFit;
    private wireEvents;
    private wireResizeCursorEvent;
    private unWireResizeCursorEvent;
    private unwireEvents;
    private removeEventListener;
    private mouseMoveHandler;
    private mouseDownHandler;
    private mouseUpHandler;
    private dblClickHandler;
    private setTarget;
    private updateTarget;
    private setAutoFitHandler;
    private setAutofit;
    private createResizeHandler;
    private setColWidth;
    private showHiddenColumns;
    private setRowHeight;
    private resizeOn;
    private setWidthAndHeight;
    private resizeStart;
    private updateCursor;
    private getFloatingElementWidth;
    /**
     * To destroy the resize module.
     * @return {void}
     */
    destroy(): void;
    /**
     * Get the module name.
     * @returns string
     */
    protected getModuleName(): string;
}
