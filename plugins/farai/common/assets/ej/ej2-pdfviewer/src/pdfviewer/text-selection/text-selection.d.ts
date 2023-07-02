import { PdfViewer, PdfViewerBase } from '../index';
/**
 * The `IRectangle` module is used to handle rectangle property of PDF viewer.
 * @hidden
 */
export interface IRectangle {
    bottom: number;
    height: number;
    left: number;
    top: number;
    right: number;
    width: number;
}
/**
 * The `ISelection` module is used to handle selection property of PDF viewer.
 * @hidden
 */
export interface ISelection {
    isBackward: boolean;
    startNode: string;
    startOffset: number;
    endNode: string;
    endOffset: number;
    textContent: string;
    pageNumber: number;
    bound: IRectangle;
    rectangleBounds: IRectangle[];
}
/**
 * The `TextSelection` module is used to handle the text selection of PDF viewer.
 */
export declare class TextSelection {
    /**
     * @private
     */
    isTextSelection: boolean;
    /**
     * @private
     */
    selectionStartPage: number;
    private pdfViewer;
    private pdfViewerBase;
    private isBackwardPropagatedSelection;
    private dropDivElementLeft;
    private dropDivElementRight;
    private dropElementLeft;
    private dropElementRight;
    private contextMenuHeight;
    /**
     * @private
     */
    selectionRangeArray: ISelection[];
    private selectionAnchorTouch;
    private selectionFocusTouch;
    private scrollMoveTimer;
    private isMouseLeaveSelection;
    private isTouchSelection;
    private previousScrollDifference;
    private topStoreLeft;
    private topStoreRight;
    private isTextSearched;
    private isSelectionStartTriggered;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    textSelectionOnMouseMove(target: EventTarget, x: number, y: number, isExtended?: boolean): void;
    /**
     * @private
     */
    textSelectionOnDrag(target: EventTarget, x: number, y: number, isforward: boolean): boolean;
    /**
     * Select the target text region in the PDF document of the given bounds.
     * @param  {number} pageNumbers - Specifies the page number
     * @param  {IRectangle[]} bounds -  Specifies the bounds of the texts.
     * @returns void
     */
    selectTextRegion(pageNumbers: number, bounds: IRectangle[]): void;
    /**
     * @private
     */
    checkLeftBounds(left: number, textDiVLeft: number, totalLeft: number, x: number): boolean;
    /**
     * @private
     */
    checkTopBounds(top: number, currentTop: number, y: number): boolean;
    /**
     * @private
     */
    textSelectionOnMouseLeave(event: MouseEvent): void;
    private scrollForwardOnSelection;
    private scrollBackwardOnSelection;
    /**
     * @private
     */
    clear(): void;
    /**
     * @private
     */
    selectAWord(element: any, x: number, y: number, isStoreSelection: boolean): void;
    private getSelectionRange;
    /**
     * @private
     */
    selectEntireLine(event: MouseEvent): void;
    /**
     * @private
     */
    enableTextSelectionMode(): void;
    clearTextSelection(): void;
    /**
     * @private
     */
    removeTouchElements(): void;
    /**
     * @private
     */
    resizeTouchElements(): void;
    /**
     * @private
     */
    textSelectionOnMouseup(event: MouseEvent): void;
    /**
     * @private
     */
    fireTextSelectEnd(): void;
    /**
     * @private
     */
    maintainSelectionOnZoom(isMaintainSelection: boolean, isStich: boolean): void;
    /**
     * @private
     */
    isSelectionAvailableOnScroll(pageNumber: number): boolean;
    /**
     * @private
     */
    applySelectionRangeOnScroll(pageNumber: number): void;
    private getSelectionRangeFromArray;
    private applySelectionRange;
    private applySelectionMouseScroll;
    /**
     * @private
     */
    maintainSelectionOnScroll(pageNumber: number, isStich: boolean): void;
    /**
     * @private
     */
    maintainSelection(pageNumber: number, isStich: boolean): void;
    private getCorrectOffset;
    private pushSelectionRangeObject;
    private extendCurrentSelection;
    private stichSelection;
    /**
     * @private
     */
    textSelectionOnMouseWheel(currentPageNumber: number): void;
    /**
     * @private
     */
    stichSelectionOnScroll(currentPageNumber: number): void;
    private extendSelectionStich;
    /**
     * @private
     */
    createRangeObjectOnScroll(pageNumber: number, anchorPageId: number, focusPageId: number): ISelection;
    private getSelectionRangeObject;
    private getSelectionBounds;
    private getSelectionRectangleBounds;
    private getTextId;
    private normalizeBounds;
    private getMagnifiedValue;
    /**
     * @private
     */
    getCurrentSelectionBounds(pageNumber: number): IRectangle;
    private createRangeForSelection;
    private maintainSelectionArray;
    /**
     * @private
     */
    applySpanForSelection(): void;
    /**
     * @private
     */
    initiateTouchSelection(event: TouchEvent, x: number, y: number): void;
    private selectTextByTouch;
    private setTouchSelectionStartPosition;
    private getTouchAnchorElement;
    private getTouchFocusElement;
    private createTouchSelectElement;
    /**
     * @private
     */
    calculateContextMenuPosition(top: any, left: any): any;
    private onLeftTouchSelectElementTouchStart;
    private onRightTouchSelectElementTouchStart;
    private onLeftTouchSelectElementTouchEnd;
    private onRightTouchSelectElementTouchEnd;
    /**
     * @private
     */
    initiateSelectionByTouch(): void;
    private terminateSelectionByTouch;
    private onLeftTouchSelectElementTouchMove;
    private onRightTouchSelectElementTouchMove;
    private getNodeElement;
    private isTouchedWithinContainer;
    private onTouchElementScroll;
    private isCloserTouchScroll;
    private getClientValueTop;
    private isScrolledOnScrollBar;
    private getTextLastLength;
    private getNodeElementFromNode;
    /**
     * Copy the selected text in the PDF Document.
     * @returns void
     */
    copyText(): void;
    /**
     * @private
     */
    destroy(): void;
    /**
     * @private
     */
    getModuleName(): string;
}
