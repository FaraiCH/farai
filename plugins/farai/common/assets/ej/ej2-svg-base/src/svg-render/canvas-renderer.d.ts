import { LineAttributes, PathAttributes, CircleAttributes, RectAttributes, EllipseAttributes, PolylineAttributes, BaseAttibutes, TextAttributes, ImageAttributes, SVGCanvasAttributes, GradientColor, SVGAttributes } from './svg-canvas-interface';
import { Rect } from '../tooltip';
/**
 * @private
 */
export declare class CanvasRenderer {
    private canvasObj;
    /**
     * Specifies root id of the canvas element
     * @default null
     */
    private rootId;
    /**
     * Specifies the height of the canvas element.
     * @default null
     */
    height: number;
    /**
     * Specifies the width of the canvas element.
     * @default null
     */
    width: number;
    /**
     * Specifies the context of the canvas.
     * @default null
     */
    ctx: CanvasRenderingContext2D;
    /**
     * Holds the context of the rendered canvas as string.
     * @default null
     */
    dataUrl: string;
    constructor(rootID: string);
    private getOptionValue;
    /**
     * To create a Html5 canvas element
     * @param {BaseAttibutes} options - Options to create canvas
     * @return {HTMLCanvasElement}
     */
    createCanvas(options: BaseAttibutes): HTMLCanvasElement;
    /**
     * To set the width and height for the Html5 canvas element
     * @param {number} width - width of the canvas
     * @param {number} height - height of the canvas
     * @return {void}
     */
    setCanvasSize(width: number, height: number): void;
    private setAttributes;
    /**
     * To draw a line
     * @param {LineAttributes} options - required options to draw a line on the canvas
     * @return {void}
     */
    drawLine(options: LineAttributes): void;
    /**
     * To draw a rectangle
     * @param {RectAttributes} options - required options to draw a rectangle on the canvas
     * @return {void}
     */
    drawRectangle(options: RectAttributes, canvasTranslate?: Int32Array): Element;
    private drawCornerRadius;
    /**
     * To draw a path on the canvas
     * @param {PathAttributes} options - options needed to draw path
     * @param {Int32Array} canvasTranslate - Array of numbers to translate the canvas
     * @return {void}
     */
    drawPath(options: PathAttributes, canvasTranslate?: Int32Array): Element;
    /**
     * To draw a text
     * @param {TextAttributes} options - options required to draw text
     * @param {string} label - Specifies the text which has to be drawn on the canvas
     * @return {void}
     */
    createText(options: TextAttributes, label: string, transX?: number, transY?: number, dy?: number, isTSpan?: boolean): Element;
    /**
     * To draw circle on the canvas
     * @param {CircleAttributes} options - required options to draw the circle
     * @return {void}
     */
    drawCircle(options: CircleAttributes, canvasTranslate?: Int32Array): Element;
    /**
     * To draw polyline
     * @param {PolylineAttributes} options - options needed to draw polyline
     * @return {void}
     */
    drawPolyline(options: PolylineAttributes): void;
    /**
     * To draw an ellipse on the canvas
     * @param {EllipseAttributes} options - options needed to draw ellipse
     * @return {void}
     */
    drawEllipse(options: EllipseAttributes, canvasTranslate?: Int32Array): void;
    /**
     * To draw an image
     * @param {ImageAttributes} options - options required to draw an image on the canvas
     * @return {void}
     */
    drawImage(options: ImageAttributes): void;
    /**
     * To create a linear gradient
     * @param {string[]} colors - Specifies the colors required to create linear gradient
     * @return {string}
     */
    createLinearGradient(colors: GradientColor[]): string;
    /**
     * To create a radial gradient
     * @param {string[]} colors - Specifies the colors required to create linear gradient
     * @return {string}
     */
    createRadialGradient(colors: GradientColor[]): string;
    private setGradientValues;
    /**
     * To set the attributes to the element
     * @param {SVGCanvasAttributes} options - Attributes to set for the element
     * @param {HTMLElement} element - The element to which the attributes need to be set
     * @return {HTMLElement}
     */
    setElementAttributes(options: SVGCanvasAttributes, element: HTMLElement | Element): HTMLElement | Element;
    /**
     * To update the values of the canvas element attributes
     * @param {SVGCanvasAttributes} options - Specifies the colors required to create gradient
     * @return {void}
     */
    updateCanvasAttributes(options: SVGCanvasAttributes): void;
    /**
     * This method clears the given rectangle region
     * @param options
     */
    clearRect(rect: Rect): void;
    /**
     * For canvas rendering in chart
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {BaseAttibutes} options - Options needed to create group
     * @return {Element}
     */
    createGroup(options: BaseAttibutes): Element;
    /**
     * To render a clip path
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {BaseAttibutes} options - Options required to render a clip path
     * @return {Element}
     */
    drawClipPath(options: BaseAttibutes): Element;
    /**
     * Clip method to perform clip in canvas mode
     * @param options
     */
    canvasClip(options: BaseAttibutes): void;
    /**
     * Tp restore the canvas
     * @param options
     */
    canvasRestore(): void;
    /**
     * To draw a polygon
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {PolylineAttributes} options - Options needed to draw a polygon in SVG
     * @return {Element}
     */
    drawPolygon(options: PolylineAttributes): Element;
    /**
     * To create defs element in SVG
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @return {Element}
     */
    createDefs(): Element;
    /**
     * To create clip path in SVG
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {BaseAttibutes} options - Options needed to create clip path
     * @return {Element}
     */
    createClipPath(options: BaseAttibutes): Element;
    /**
     * To create a Html5 SVG element
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {SVGAttributes} options - Options to create SVG
     * @return {Element}
     */
    createSvg(options: SVGAttributes): Element;
}
