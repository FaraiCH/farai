import { PdfViewer, PdfViewerBase, IRectangle, ICommentsCollection, IReviewCollection, AllowedInteraction } from '../index';
import { ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
/**
 * @hidden
 */
export interface ITextMarkupAnnotation {
    textMarkupAnnotationType: string;
    author: string;
    subject: string;
    modifiedDate: string;
    note: string;
    bounds: any;
    color: any;
    opacity: number;
    rect: any;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    annotName: string;
    shapeAnnotationType: string;
    position?: string;
    pageNumber: number;
    textMarkupContent: string;
    textMarkupStartIndex: number;
    textMarkupEndIndex: number;
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    customData: object;
    isMultiSelect?: boolean;
    annotNameCollection?: any[];
    annotpageNumbers?: any[];
    annotationAddMode: string;
    annotationSettings?: any;
    allowedInteractions?: AllowedInteraction;
    isPrint: boolean;
    isCommentLock: boolean;
}
/**
 * @hidden
 */
export interface IPageAnnotationBounds {
    pageIndex: number;
    bounds: IRectangle[];
    rect: any;
    startIndex?: number;
    endIndex?: number;
    textContent?: string;
}
/**
 * The `TextMarkupAnnotation` module is used to handle text markup annotation actions of PDF viewer.
 * @hidden
 */
export declare class TextMarkupAnnotation {
    private pdfViewer;
    private pdfViewerBase;
    /**
     * @private
     */
    isTextMarkupAnnotationMode: boolean;
    /**
     * @private
     */
    currentTextMarkupAddMode: string;
    /**
     * @private
     */
    highlightColor: string;
    /**
     * @private
     */
    underlineColor: string;
    /**
     * @private
     */
    strikethroughColor: string;
    /**
     * @private
     */
    highlightOpacity: number;
    /**
     * @private
     */
    underlineOpacity: number;
    /**
     * @private
     */
    annotationAddMode: string;
    /**
     * @private
     */
    strikethroughOpacity: number;
    /**
     * @private
     */
    selectTextMarkupCurrentPage: number;
    /**
     * @private
     */
    currentTextMarkupAnnotation: ITextMarkupAnnotation;
    private currentAnnotationIndex;
    private isAnnotationSelect;
    private dropDivAnnotationLeft;
    private dropDivAnnotationRight;
    private dropElementLeft;
    private dropElementRight;
    /**
     * @private
     */
    isDropletClicked: boolean;
    /**
     * @private
     */
    isRightDropletClicked: boolean;
    /**
     * @private
     */
    isLeftDropletClicked: boolean;
    /**
     * @private
     */
    isSelectionMaintained: boolean;
    private isExtended;
    private isNewAnnotation;
    private selectedTextMarkup;
    private multiPageCollection;
    private triggerAddEvent;
    /**
     * @private
     */
    isSelectedAnnotation: boolean;
    private dropletHeight;
    /**
     * @private
     */
    annotationClickPosition: object;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, viewerBase: PdfViewerBase);
    /**
     * @private
     */
    createAnnotationSelectElement(): void;
    private maintainSelection;
    private selectionEnd;
    private annotationLeftMove;
    private annotationRightMove;
    /**
     * @private
     */
    textSelect(target: any, x: any, y: any): void;
    /**
     * @private
     */
    showHideDropletDiv(hide: boolean): void;
    /**
     * @private
     */
    isEnableTextMarkupResizer(type: string): boolean;
    private updateDropletStyles;
    private updateAnnotationBounds;
    private updateMultiAnnotBounds;
    private retreieveSelection;
    /**
     * @private
     */
    updatePosition(x: number, y: number, isSelected?: boolean): void;
    /**
     * @private
     */
    updateLeftposition(x: number, y: number, isSelected?: boolean): void;
    private getClientValueTop;
    /**
     * @private
     */
    renderTextMarkupAnnotationsInPage(textMarkupAnnotations: any, pageNumber: number, isImportTextMarkup?: boolean): void;
    private renderTextMarkupAnnotations;
    /**
     * @private
     */
    getSettings(annotation: any): any;
    /**
     * @private
     */
    drawTextMarkupAnnotations(type: string): void;
    private isMultiPageAnnotations;
    private isMultiAnnotation;
    private modifyCurrentAnnotation;
    private drawAnnotationSelector;
    private selectMultiPageAnnotations;
    private deletMultiPageAnnotation;
    private modifyMultiPageAnnotations;
    private convertSelectionToTextMarkup;
    private updateTextMarkupAnnotationBounds;
    /**
     * @private
     */
    multiPageCollectionList(annotation: any): any;
    private updateAnnotationNames;
    private updateAnnotationContent;
    private drawTextMarkups;
    private retreiveTextIndex;
    private renderHighlightAnnotation;
    private renderStrikeoutAnnotation;
    private renderUnderlineAnnotation;
    private getProperBounds;
    private drawLine;
    /**
     * @private
     */
    printTextMarkupAnnotations(textMarkupAnnotations: any, pageIndex: number, stampData: any, shapeData: any, measureShapeData: any, stickyData: any): string;
    /**
     * @private
     */
    saveTextMarkupAnnotations(): string;
    /**
     * @private
     */
    deleteTextMarkupAnnotation(): void;
    /**
     * @private
     */
    modifyColorProperty(color: string): void;
    /**
     * @private
     */
    modifyOpacityProperty(args: ChangeEventArgs, isOpacity?: number): void;
    /**
     * @private
     */
    modifyAnnotationProperty(property: string, value: any, status: string, annotName?: string): ITextMarkupAnnotation[];
    /**
     * @private
     */
    undoTextMarkupAction(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, action: string): void;
    /**
     * @private
     */
    undoRedoPropertyChange(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, property: string, isUndoAction?: boolean): ITextMarkupAnnotation;
    /**
     * @private
     */
    redoTextMarkupAction(annotation: ITextMarkupAnnotation, pageNumber: number, index: number, action: string): void;
    /**
     * @private
     */
    saveNoteContent(pageNumber: number, note: string): void;
    private clearCurrentAnnotation;
    /**
     * @private
     */
    clearCurrentAnnotationSelection(pageNumber: number, isSelect?: boolean): void;
    private getBoundsForSave;
    private getAnnotationBounds;
    private getRgbCode;
    private getDrawnBounds;
    private getIndexNumbers;
    /**
     * @private
     */
    rerenderAnnotationsPinch(pageNumber: number): void;
    /**
     * @private
     */
    rerenderAnnotations(pageNumber: number): void;
    /**
     * @private
     */
    onTextMarkupAnnotationMouseUp(event: MouseEvent): void;
    /**
     * @private
     */
    onTextMarkupAnnotationTouchEnd(event: TouchEvent): void;
    /**
     * @private
     */
    clearCurrentSelectedAnnotation(): void;
    /**
     * @private
     */
    onTextMarkupAnnotationMouseMove(event: MouseEvent): void;
    private showPopupNote;
    private getCurrentMarkupAnnotation;
    private compareCurrentAnnotations;
    /**
     * @private
     */
    clearAnnotationSelection(pageNumber: number): void;
    /**
     * @private
     */
    selectAnnotation(annotation: ITextMarkupAnnotation, canvas: HTMLElement, pageNumber?: number, event?: MouseEvent | TouchEvent, isProgrammaticSelection?: boolean): void;
    /**
     * @private
     */
    updateCurrentResizerPosition(annotation?: any): void;
    private drawAnnotationSelectRect;
    /**
     * @private
     */
    enableAnnotationPropertiesTool(isEnable: boolean): void;
    /**
     * @private
     */
    maintainAnnotationSelection(): void;
    /**
     * @private
     */
    manageAnnotations(pageAnnotations: ITextMarkupAnnotation[], pageNumber: number): void;
    /**
     * @private
     */
    getAnnotations(pageIndex: number, textMarkupAnnotations: any[], id?: string): any[];
    private getAddedAnnotation;
    private getSelector;
    private getAnnotationSettings;
    private getIsPrintValue;
    private annotationDivSelect;
    private getPageContext;
    private getDefaultValue;
    private getMagnifiedValue;
    /**
     * @private
     */
    saveImportedTextMarkupAnnotations(annotation: any, pageNumber: number): any;
    /**
     * @private
     */
    updateTextMarkupAnnotationCollections(annotation: any, pageNumber: number): any;
    /**
     * @private
     */
    updateTextMarkupSettings(textMarkUpSettings: string): any;
    /**
     * @private
     */
    clear(): void;
}
