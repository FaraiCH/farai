import { PdfViewer, PdfViewerBase, AnnotationType as AnnotType, ICommentsCollection, IReviewCollection, AllowedInteraction } from '../..';
import { PointModel } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
/**
 * @hidden
 */
export interface IFreeTextAnnotation {
    shapeAnnotationType: string;
    author: string;
    modifiedDate: string;
    subject: string;
    note: string;
    opacity: number;
    bounds: any;
    thickness: number;
    borderStyle: string;
    borderDashArray: number;
    rotateAngle: string;
    isLocked: boolean;
    id: string;
    annotName: string;
    position?: string;
    fillColor: string;
    strokeColor: string;
    dynamicText: string;
    fontColor: string;
    fontSize: number;
    fontFamily: string;
    textAlign: string;
    font: any;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    annotationSettings?: any;
    allowedInteractions?: AllowedInteraction;
    isCommentLock: boolean;
}
/**
 * @hidden
 */
export declare class FreeTextAnnotation {
    private pdfViewer;
    private pdfViewerBase;
    /**
     * @private
     */
    currentAnnotationMode: string;
    /**
     * @private
     */
    opacity: number;
    /**
     * @private
     */
    borderColor: string;
    /**
     * @private
     */
    borderWidth: number;
    /**
     * @private
     */
    defautWidth: number;
    /**
     * @private
     */
    defaultHeight: number;
    /**
     * @private
     */
    inputBoxElement: any;
    /**
     * @private
     */
    borderStyle: string;
    /**
     * @private
     */
    author: string;
    /**
     * @private
     */
    isNewFreeTextAnnot: boolean;
    /**
     * @private
     */
    isNewAddedAnnot: boolean;
    /**
     * @private
     */
    inputBoxCount: number;
    /**
     * @private
     */
    selectedAnnotation: PdfAnnotationBaseModel;
    /**
     * @private
     */
    isFreeTextValueChange: boolean;
    /**
     * @private
     */
    isInuptBoxInFocus: boolean;
    /**
     * @private
     */
    fontSize: number;
    /**
     * @private
     */
    annodationIntent: string;
    /**
     * @private
     */
    annotationFlags: string;
    /**
     * @private
     */
    fillColor: string;
    /**
     * @private
     */
    fontColor: string;
    /**
     * @private
     */
    fontFamily: string;
    /**
     * @private
     */
    freeTextPageNumbers: any;
    /**
     * @private
     */
    selectedText: string;
    /**
     * @private
     */
    isTextSelected: boolean;
    private selectionStart;
    private selectionEnd;
    /**
     * @private
     */
    isBold: boolean;
    /**
     * @private
     */
    isItalic: boolean;
    /**
     * @private
     */
    isUnderline: boolean;
    /**
     * @private
     */
    isStrikethrough: boolean;
    /**
     * @private
     */
    textAlign: string;
    private defaultText;
    private isReadonly;
    /**
     * @private
     */
    previousText: string;
    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    updateTextProperties(): void;
    /**
     * @private
     */
    renderFreeTextAnnotations(shapeAnnotations: any, pageNumber: number, isImportAction?: boolean): void;
    /**
     * @private
     */
    getSettings(annotation: any): any;
    /**
     * @private
     */
    setAnnotationType(type: AnnotType): void;
    /**
     * @private
     */
    modifyInCollection(property: string, pageNumber: number, annotationBase: any, isNewAdded?: boolean): IFreeTextAnnotation;
    /**
     * @private
     */
    addInCollection(pageNumber: number, annotationBase: IFreeTextAnnotation): void;
    /**
     * @private
     */
    saveFreeTextAnnotations(): string;
    private manageAnnotations;
    private getAnnotations;
    private getRgbCode;
    /**
     * @private
     */
    onFocusOutInputBox(): void;
    /**
     * @private
     */
    onKeyDownInputBox(event: KeyboardEvent): void;
    private updateFreeTextAnnotationSize;
    /**
     * @private
     */
    onMouseUpInputBox(event: MouseEvent): void;
    /**
     * @private
     */
    addInuptElemet(currentPosition: PointModel, annotation?: PdfAnnotationBaseModel): void;
    private applyFreetextStyles;
    /**
     * @private
     */
    copySelectedText(): void;
    /**
     * @private
     */
    pasteSelectedText(target: any): void;
    /**
     * @private
     */
    cutSelectedText(target: any): void;
    /**
     * @private
     */
    saveImportedFreeTextAnnotations(shapeAnnotations: any, pageNumber: number): void;
    /**
     * @private
     */
    updateFreeTextAnnotationCollections(shapeAnnotations: any, pageNumber: number): void;
}
