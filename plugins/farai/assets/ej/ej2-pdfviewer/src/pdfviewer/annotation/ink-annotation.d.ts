import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { AnnotationSelectorSettingsModel } from '../pdfviewer-model';
export declare class InkAnnotation {
    private pdfViewer;
    private pdfViewerBase;
    newObject: any;
    /**
     * @private
     */
    outputString: string;
    /**
     * @private
     */
    mouseX: number;
    /**
     * @private
     */
    mouseY: number;
    /**
     * @private
     */
    inkAnnotationindex: any;
    /**
     * @private
     */
    currentPageNumber: string;
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase);
    /**
     * @private
     */
    drawInk(): void;
    drawInkAnnotation(pageNumber?: number): void;
    /**
     * @private
     */
    storePathData(): void;
    /**
     * @private
     */
    drawInkInCanvas(position: any, pageIndex: number): void;
    private convertToPath;
    private linePath;
    private movePath;
    /**
     * @private
     */
    addInk(pageNumber?: number): any;
    /**
     * @private
     */
    setAnnotationMode(): void;
    saveInkSignature(): string;
    /**
     * @private
     */
    addInCollection(pageNumber: number, annotationBase: any): void;
    private calculateInkSize;
    /**
     * @private
     */
    renderExistingInkSignature(annotationCollection: any, pageIndex: number, isImport: boolean): void;
    /**
     * @private
     */
    storeInkSignatureData(pageNumber: number, annotations: any): void;
    getSelector(type: string, subject: string): AnnotationSelectorSettingsModel;
    private getAnnotations;
    /**
     * @private
     */
    modifySignatureInkCollection(property: string, pageNumber: number, annotationBase: any): any;
    private manageInkAnnotations;
    /**
     * @private
     */
    updateInkCollections(currentAnnotation: any, pageIndex: number, isImport?: boolean): any;
}
