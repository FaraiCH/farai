import { PdfAnnotationBase } from '../drawing/pdf-annotation';
import { PdfViewer, PdfViewerBase, ICommentsCollection, IReviewCollection, AllowedInteraction } from '../../index';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
/**
 * @hidden
 */
export interface IStampAnnotation {
    stampAnnotationPath: string;
    author: string;
    creationDate: string;
    modifiedDate: string;
    subject: string;
    note: string;
    strokeColor: string;
    fillColor: string;
    opacity: number;
    bounds: IRectangles;
    icon: string;
    pageNumber: number;
    rotateAngle: string;
    randomId: string;
    stampAnnotationType: string;
    stampFillcolor: string;
    isDynamicStamp: boolean;
    dynamicText?: string;
    shapeAnnotationType: string;
    comments: ICommentsCollection[];
    review: IReviewCollection;
    annotName: string;
    position?: string;
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    annotationSettings?: any;
    customData: object;
    allowedInteractions?: AllowedInteraction;
    isPrint: boolean;
    isCommentLock: boolean;
}
interface IRectangles {
    height: number;
    left: number;
    top: number;
    width: number;
}
/**
 * The `StampAnnotation` module is used to handle annotation actions of PDF viewer.
 * @hidden
 */
export declare class StampAnnotation {
    private pdfViewer;
    private pdfViewerBase;
    private author;
    /**
     * @private
     */
    currentStampAnnotation: any;
    /**
     * @private
     */
    isStampAnnotSelected: boolean;
    /**
     * @private
     */
    isStampAddMode: boolean;
    /**
     * @private
     */
    isNewStampAnnot: boolean;
    private isExistingStamp;
    /**
     * @private
     */
    stampPageNumber: any;
    private dynamicText;
    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    renderStampAnnotations(stampAnnotations: any, pageNumber: number, canvass?: any, isImport?: boolean): void;
    /**
     * @private
     */
    moveStampElement(X: number, Y: number, pageIndex: number): PdfAnnotationBase;
    private ConvertPointToPixel;
    private calculateImagePosition;
    /**
     * @private
     */
    createCustomStampAnnotation(imageSource: any, annotName?: string): void;
    /**
     * @private
     */
    renderStamp(X: number, Y: number, width: number, height: number, pageIndex: number, opacity: number, rotation: any, canvass: any, existingAnnotation: any, isDynamic?: any): any;
    /**
     * @private
     */
    getSettings(annotation: any): any;
    /**
     * @private
     */
    resetAnnotation(): void;
    /**
     * @private
     */
    updateDeleteItems(pageNumber: number, annotation: any, opacity?: number): any;
    /**
     * @private
     */
    renderCustomImage(position: any, pageIndex: any, image: any, currentDate: any, modifiedDate: any, RotationAngle: any, opacity: any, canvas?: any, isExistingStamp?: boolean, annotation?: any, annotName?: string): void;
    /**
     * @private
     */
    retrieveDynamicStampAnnotation(icontype: any): any;
    /**
     * @private
     */
    retrievestampAnnotation(icontype: any): any;
    /**
     * @private
     */
    saveStampAnnotations(): any;
    /**
     * @private
     */
    storeStampInSession(pageNumber: number, annotation: IStampAnnotation): any;
    /**
     * @private
     */
    updateSessionStorage(annotation: any, id: any, type: String): any;
    /**
     * @private
     */
    saveImportedStampAnnotations(annotation: any, pageNumber: number): any;
    /**
     * @private
     */
    updateStampAnnotationCollections(annotation: any, pageNumber: number): any;
    private findImageData;
    private findDynamicText;
    private getAnnotations;
    /**
     * @private
     */
    modifyInCollection(property: string, pageNumber: number, annotationBase: any): IStampAnnotation;
    private manageAnnotations;
}
export {};
