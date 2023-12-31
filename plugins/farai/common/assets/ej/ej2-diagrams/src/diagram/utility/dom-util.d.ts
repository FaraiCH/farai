import { PointModel } from '../primitives/point-model';
import { Rect } from '../primitives/rect';
import { Size } from '../primitives/size';
import { TextStyleModel } from './../core/appearance-model';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { ITouches } from '../objects/interface/interfaces';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { Node } from '../objects/node';
import { DiagramNativeElement } from '../core/elements/native-element';
import { BaseAttributes, TextAttributes, SubTextElement } from '../rendering/canvas-interface';
import { Annotation, PathAnnotation } from '../objects/annotation';
import { SelectorModel } from '../objects/node-model';
/**
 * Defines the functionalities that need to access DOM
 */
/** @private */
export declare function removeElementsByClass(className: string, id?: string): void;
/** @private */
export declare function findSegmentPoints(element: PathElement): PointModel[];
export declare function getChildNode(node: SVGElement): SVGElement[] | HTMLCollection;
export declare function translatePoints(element: PathElement, points: PointModel[]): PointModel[];
/** @private */
export declare function measurePath(data: string): Rect;
export declare function measureHtmlText(style: TextStyleModel, content: string, width: number, height: number, maxWidth?: number): Size;
/** @private */
export declare function measureText(text: TextElement, style: TextStyleModel, content: string, maxWidth?: number, textValue?: string): Size;
/** @private */
export declare function measureImage(source: string, contentSize: Size, id?: string, callback?: Function): Size;
/** @private */
export declare function measureNativeContent(nativeContent: SVGElement): Rect;
/**
 * @private
 */
export declare function measureNativeSvg(nativeContent: SVGElement): Rect;
/** @private */
export declare function updatePath(element: PathElement, bounds: Rect, child: PathElement, options?: BaseAttributes): string;
/** @private */
export declare function getDiagramLayerSvg(diagramId: string): SVGSVGElement;
/** @private */
export declare function getDiagramElement(elementId: string, contentId?: string): HTMLElement;
/** @private */
export declare function getDomIndex(viewId: string, elementId: string, layer: string): number;
/**
 * @private
 */
export declare function getAdornerLayerSvg(diagramId: string): SVGSVGElement;
/** @private */
export declare function getSelectorElement(diagramId: string): SVGElement;
/**
 * @private
 */
export declare function getAdornerLayer(diagramId: string): SVGElement;
/**
 * @private
 */
export declare function getUserHandleLayer(diagramId: string): HTMLElement;
/** @private */
export declare function getDiagramLayer(diagramId: string): SVGElement;
/** @private */
export declare function getPortLayerSvg(diagramId: string): SVGSVGElement;
/** @private */
export declare function getNativeLayerSvg(diagramId: string): SVGSVGElement;
/** @private */
export declare function getGridLayerSvg(diagramId: string): SVGSVGElement;
/** @private */
export declare function getBackgroundLayerSvg(diagramId: string): SVGSVGElement;
/** @private */
export declare function getBackgroundImageLayer(diagramId: string): SVGSVGElement;
/** @private */
export declare function getBackgroundLayer(diagramId: string): SVGSVGElement;
/** @private */
export declare function getGridLayer(diagramId: string): SVGElement;
/** @private */
export declare function getNativeLayer(diagramId: string): SVGElement;
/** @private */
export declare function getHTMLLayer(diagramId: string): HTMLElement;
/** @private */
export declare function createHtmlElement(elementType: string, attribute: Object): HTMLElement;
/** @private */
export declare function createSvgElement(elementType: string, attribute: Object): SVGElement;
/** @hidden */
export declare function parentsUntil(elem: Element, selector: string, isID?: boolean): Element;
export declare function hasClass(element: HTMLElement, className: string): boolean;
/** @hidden */
export declare function getScrollerWidth(): number;
/**
 * Handles the touch pointer.
 * @return {boolean}
 * @private
 */
export declare function addTouchPointer(touchList: ITouches[], e: PointerEvent, touches: TouchList): ITouches[];
/**
 * removes the element from dom
 * @param {string} elementId
 */
export declare function removeElement(elementId: string, contentId?: string): void;
export declare function getContent(element: DiagramHtmlElement | DiagramNativeElement, isHtml: boolean, nodeObject?: Node | Annotation | PathAnnotation): HTMLElement | SVGElement;
/** @private */
export declare function setAttributeSvg(svg: SVGElement, attributes: Object): void;
/** @private */
export declare function applyStyleAgainstCsp(svg: SVGElement | HTMLElement, attributes: string): void;
/** @private */
export declare function setAttributeHtml(element: HTMLElement, attributes: Object): void;
/** @private */
export declare function createMeasureElements(): void;
/** @private */
export declare function setChildPosition(temp: SubTextElement, childNodes: SubTextElement[], i: number, options: TextAttributes): number;
/** @private */
export declare function getTemplateContent(annotationcontent: DiagramHtmlElement, annotation: Annotation, annotationTemplate?: string | Function): DiagramHtmlElement;
/** @private */
export declare function createUserHandleTemplates(userHandleTemplate: string, template: HTMLCollection, selectedItems: SelectorModel, diagramID: string): void;
