import { PdfViewer, PdfViewerBase } from '../index';
/**
 * Magnification module
 */
export declare class Magnification {
    /**
     * @private
     */
    zoomFactor: number;
    /**
     * @private
     */
    previousZoomFactor: number;
    private scrollWidth;
    private pdfViewer;
    private pdfViewerBase;
    private zoomLevel;
    private higherZoomLevel;
    private lowerZoomLevel;
    private zoomPercentages;
    private isNotPredefinedZoom;
    private pinchStep;
    private reRenderPageNumber;
    private magnifyPageRerenderTimer;
    private rerenderOnScrollTimer;
    private rerenderInterval;
    private previousTouchDifference;
    private touchCenterX;
    private touchCenterY;
    private pageRerenderCount;
    private imageObjects;
    private topValue;
    private isTapToFitZoom;
    /**
     * @private
     */
    fitType: string;
    /**
     * @private
     */
    isInitialLoading: boolean;
    /**
     * @private
     */
    isPinchZoomed: boolean;
    /**
     * @private
     */
    isPagePinchZoomed: boolean;
    /**
     * @private
     */
    isRerenderCanvasCreated: boolean;
    /**
     * @private
     */
    isMagnified: boolean;
    /**
     * @private
     */
    isPagesZoomed: boolean;
    /**
     * @private
     */
    isPinchScrolled: boolean;
    /**
     * @private
     */
    isAutoZoom: boolean;
    private isWebkitMobile;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase);
    /**
     * Zoom the PDF document to the given zoom value
     * @param  {number} zoomValue - Specifies the Zoom Value for magnify the PDF document
     * @returns void
     */
    zoomTo(zoomValue: number): void;
    /**
     * Magnifies the page to the next value in the zoom drop down list.
     * @returns void
     */
    zoomIn(): void;
    /**
     * Magnifies the page to the previous value in the zoom drop down list.
     * @returns void
     */
    zoomOut(): void;
    /**
     * Scales the page to fit the page width to the width of the container in the control.
     * @returns void
     */
    fitToWidth(): void;
    /**
     * @private
     */
    fitToAuto(): void;
    /**
     * Scales the page to fit the page in the container in the control.
     * @param  {number} zoomValue - Defines the Zoom Value for fit the page in the Container
     * @returns void
     */
    fitToPage(): void;
    /**
     * Returns zoom factor for the fit zooms.
     */
    private calculateFitZoomFactor;
    /**
     * Performs pinch in operation
     */
    private pinchIn;
    /**
     * Performs pinch out operation
     */
    private pinchOut;
    /**
     * returns zoom level for the zoom factor.
     */
    private getZoomLevel;
    /**
     * @private
     */
    checkZoomFactor(): boolean;
    /**
     * Executes when the zoom or pinch operation is performed
     */
    private onZoomChanged;
    /**
     * @private
     */
    setTouchPoints(clientX: number, clientY: number): void;
    /**
     * @private
     */
    initiatePinchMove(pointX1: number, pointY1: number, pointX2: number, pointY2: number): void;
    private magnifyPages;
    private updatePageLocation;
    private clearRerenderTimer;
    /**
     * @private
     */
    clearIntervalTimer(): void;
    /**
     * @private
     */
    pushImageObjects(image: HTMLImageElement): void;
    private clearRendering;
    private rerenderMagnifiedPages;
    private renderInSeparateThread;
    private responsivePages;
    private calculateScrollValues;
    private rerenderOnScroll;
    /**
     * @private
     */
    pinchMoveScroll(): void;
    private initiateRerender;
    private reRenderAfterPinch;
    private designNewCanvas;
    /**
     * @private
     */
    pageRerenderOnMouseWheel(): void;
    /**
     * @private
     */
    renderCountIncrement(): void;
    /**
     * @private
     */
    rerenderCountIncrement(): void;
    private resizeCanvas;
    private zoomOverPages;
    /**
     * @private
     */
    pinchMoveEnd(): void;
    /**
     * @private
     */
    fitPageScrollMouseWheel(event: WheelEvent): void;
    /**
     * @private
     */
    magnifyBehaviorKeyDown(event: KeyboardEvent): void;
    private upwardScrollFitPage;
    /**
     * @private
     */
    updatePagesForFitPage(currentPageIndex: number): void;
    /**
     * @private
     */
    onDoubleTapMagnification(): void;
    private downwardScrollFitPage;
    private getMagnifiedValue;
    /**
     * @private
     */
    destroy(): void;
    /**
     * returns zoom factor when the zoom percent is passed.
     */
    private getZoomFactor;
    /**
     * @private
     */
    getModuleName(): string;
}
