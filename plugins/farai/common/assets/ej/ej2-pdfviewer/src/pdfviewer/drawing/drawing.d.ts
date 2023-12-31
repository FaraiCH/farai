import { PdfViewer } from '../index';
import { PdfAnnotationBaseModel } from './pdf-annotation-model';
import { ZOrderPageTable } from './pdf-annotation';
import { Container, Rect, PointModel, ThumbsConstraints, BaseAttributes, CircleAttributes, IElement, SelectorConstraints } from '@syncfusion/ej2-drawings';
import { DrawingElement } from '@syncfusion/ej2-drawings';
import { Canvas } from '@syncfusion/ej2-drawings';
import { SelectorModel } from './selector-model';
import { AnnotationResizerLocation, AnnotationSelectorSettingsModel } from '../index';
/**
 * Renderer module is used to render basic diagram elements
 * @hidden
 */
export declare class Drawing {
    private pdfViewer;
    private renderer;
    private svgRenderer;
    private isDynamicStamps;
    constructor(viewer: PdfViewer);
    /**
     * @private
     */
    renderLabels(viewer: PdfViewer): void;
    private createNewZindexTable;
    /**
     * @private
     */
    getPageTable(pageId: number): ZOrderPageTable;
    /**
     * @private
     */
    setZIndex(index: number, obj: PdfAnnotationBaseModel): void;
    /**
     * @private
     */
    initObject(obj: PdfAnnotationBaseModel): PdfAnnotationBaseModel;
    private initNode;
    /**
     * Allows to initialize the UI of a node
     */
    /**
     * @private
     */
    init(obj: PdfAnnotationBaseModel, canvas: Container): DrawingElement;
    private textElement;
    /**
     * @private
     */
    setNodePosition(obj: DrawingElement, node: PdfAnnotationBaseModel): void;
    /**
     * @private
     */
    initContainer(obj: PdfAnnotationBaseModel): Container;
    /**
     * @private
     */
    initLine(obj: PdfAnnotationBaseModel): Canvas;
    /**
     * @private
     */
    add(obj: PdfAnnotationBaseModel): PdfAnnotationBaseModel;
    /**
     * @private
     */
    remove(obj: PdfAnnotationBaseModel): void;
    /**
     * @private
     */
    getPageObjects(pageIndex: number): (PdfAnnotationBaseModel)[];
    /**
     * @private
     */
    refreshCanvasDiagramLayer(diagramLayer?: HTMLCanvasElement, pageIndex?: number): void;
    /**
     * @private
     */
    clearHighlighter(index?: number): void;
    /**
     * @private
     */
    getSelectorElement(diagramId: string, index?: number): SVGElement;
    /**
     * @private
     */
    getAdornerLayerSvg(diagramId: string, index?: number): SVGSVGElement;
    /**
     * @private
     */
    clearSelectorLayer(index?: number): void;
    /**
     * @private
     */
    renderSelector(select?: number, currentSelector?: AnnotationSelectorSettingsModel, helper?: PdfAnnotationBaseModel, isSelect?: boolean): void;
    /**
     * Rotates the given nodes/connectors by the given angle
     * @param obj Defines the objects to be rotated
     * @param angle Defines the angle by which the objects have to be rotated
     * @param pivot Defines the reference point with reference to which the objects have to be rotated
     */
    /**
     * @private
     */
    rotate(obj: PdfAnnotationBaseModel | SelectorModel, angle: number, pivot?: PointModel, currentSelector?: AnnotationSelectorSettingsModel): boolean;
    /**
     * @private
     */
    rotateObjects(parent: PdfAnnotationBaseModel | SelectorModel, objects: PdfAnnotationBaseModel[], angle: number, pivot?: PointModel, includeParent?: boolean, currentSelector?: AnnotationSelectorSettingsModel): void;
    private getParentSvg;
    /**
     * @private
     */
    renderBorder(selector: DrawingElement, canvas: HTMLCanvasElement | SVGElement, currentSelector?: any, transform?: Transforms, enableNode?: number, isBorderTickness?: boolean, isSwimlane?: boolean, isSticky?: boolean): void;
    /**
     * @private
     */
    getSignBorder(type: PdfAnnotationBaseModel, options: BaseAttributes): void;
    /**
     * @private
     */
    getBorderSelector(type: PdfAnnotationBaseModel, options: BaseAttributes): void;
    /**
     * @private
     */
    renderCircularHandle(id: string, selector: DrawingElement, cx: number, cy: number, canvas: HTMLCanvasElement | SVGElement, visible: boolean, enableSelector?: number, t?: Transforms, connected?: boolean, canMask?: boolean, ariaLabel?: Object, count?: number, className?: string, currentSelector?: AnnotationSelectorSettingsModel): void;
    /**
     * @private
     */
    getShapeSize(type: PdfAnnotationBaseModel, options: CircleAttributes, currentSelector: any, t?: Transforms): void;
    /**
     * @private
     */
    getShape(type: PdfAnnotationBaseModel, currentSelector?: any): AnnotationSelectorSettingsModel;
    /**
     * @private
     */
    getResizerColors(type: PdfAnnotationBaseModel, options: CircleAttributes, currentSelector?: any, t?: Transforms): void;
    /**
     * @private
     */
    renderRotateThumb(wrapper: DrawingElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms, selectorConstraints?: SelectorConstraints, canMask?: boolean): void;
    /**
     * @private
     */
    renderResizeHandle(element: DrawingElement, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints, currentZoom: number, canMask?: boolean, enableNode?: number, nodeConstraints?: boolean, isStamp?: boolean, isSticky?: boolean, isPath?: boolean, isFreeText?: boolean, currentSelector?: AnnotationSelectorSettingsModel): void;
    /**
     * @private
     */
    getResizerLocation(type: PdfAnnotationBaseModel, currentSelector?: any): AnnotationResizerLocation;
    /**
     * @private
     */
    renderPivotLine(element: DrawingElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms, selectorConstraints?: SelectorConstraints, canMask?: boolean): void;
    /**
     * @private
     */
    renderEndPointHandle(selector: PdfAnnotationBaseModel, canvas: HTMLCanvasElement | SVGElement, constraints: ThumbsConstraints, transform: Transforms, connectedSource: boolean, connectedTarget?: boolean, isSegmentEditing?: boolean, currentSelector?: AnnotationSelectorSettingsModel): void;
    /**
     * @private
     */
    initSelectorWrapper(): void;
    /**
     * @private
     */
    select(objArray: string[], currentSelector?: any, multipleSelection?: boolean, preventUpdate?: boolean): void;
    /**
     * @private
     */
    dragSelectedObjects(tx: number, ty: number, pageIndex: number, currentSelector: any, helper: PdfAnnotationBaseModel): boolean;
    /**
     * @private
     */
    drag(obj: PdfAnnotationBaseModel | SelectorModel, tx: number, ty: number, currentSelector: any, helper: PdfAnnotationBaseModel): void;
    /**
     * @private
     */
    dragAnnotation(obj: PdfAnnotationBaseModel, tx: number, ty: number): void;
    /**
     * @private
     */
    dragControlPoint(obj: PdfAnnotationBaseModel, tx: number, ty: number, preventUpdate?: boolean, segmentNumber?: number): boolean;
    /**
     * @private
     */
    updateEndPoint(connector: PdfAnnotationBaseModel): void;
    /**
     * @private
     */
    nodePropertyChange(actualObject: PdfAnnotationBaseModel, node: PdfAnnotationBaseModel): void;
    private setLineDistance;
    /**
     * @private
     */
    scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean;
    /**
     * @private
     */
    scale(obj: PdfAnnotationBaseModel | SelectorModel, sx: number, sy: number, pivot: PointModel): boolean;
    /**
     * @private
     */
    scaleObject(sw: number, sh: number, pivot: PointModel, obj: IElement, element: DrawingElement, refObject: IElement): void;
    /**
     * @private
     */
    scaleAnnotation(obj: PdfAnnotationBaseModel, sw: number, sh: number, pivot: PointModel, refObject?: IElement): boolean;
    /**
     * @private
     */
    checkBoundaryConstraints(tx: number, ty: number, pageIndex: number, nodeBounds?: Rect, isStamp?: boolean): boolean;
    private RestrictStamp;
    /**
     * @private
     */
    getShapeBounds(shapeElement: DrawingElement): Rect;
    /**
     * @private
     */
    getShapePoint(x: number, y: number, w: number, h: number, angle: number, offsetX: number, offsetY: number, cornerPoint: PointModel): PointModel;
    /**
     * @private
     */
    dragConnectorEnds(endPoint: string, obj: IElement, point: PointModel, segment: PointModel, target?: IElement, targetPortId?: string, currentSelector?: any): boolean;
    /**
     * @private
     */
    dragSourceEnd(obj: PdfAnnotationBaseModel, tx: number, ty: number, i: number): boolean;
    /**
     * @private
     */
    updateConnector(connector: PdfAnnotationBaseModel, points: PointModel[]): void;
    /**
     * @private
     */
    copy(): Object;
    /**
     * @private
     */
    copyObjects(): Object[];
    private getNewObject;
    /**
     * @private
     */
    paste(obj: PdfAnnotationBaseModel[], index: number): void;
    private calculateCopyPosition;
    /**
     * @private
     */
    cut(index: number): void;
    /**
     * @private
     */
    sortByZIndex(nodeArray: Object[], sortID?: string): Object[];
}
/**
 * @hidden
 */
export interface Transforms {
    tx: number;
    ty: number;
    scale: number;
}
/**
 * @hidden
 */
export interface ClipBoardObject {
    pasteIndex?: number;
    clipObject?: Object;
    childTable?: {};
}
