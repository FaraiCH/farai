import { Maps } from '../../index';
import { ColorMappingSettings } from '../index';
import { Rect } from '../utils/helper';
import { HighlightSettingsModel, SelectionSettingsModel } from '../model/base-model';
import { ShapeSettings } from '../model/base';
/**
 * Legend module is used to render legend for the maps
 */
export declare class Legend {
    legendCollection: Object[];
    legendRenderingCollections: Object[];
    private translate;
    legendBorderRect: Rect;
    private maps;
    /**
     * @private
     */
    totalPages: Object[];
    private page;
    /**
     * @private
     */
    currentPage: number;
    private legendItemRect;
    private heightIncrement;
    private widthIncrement;
    private textMaxWidth;
    private legendGroup;
    private shapeHighlightCollection;
    legendHighlightCollection: object[];
    shapePreviousColor: string[];
    selectedNonLegendShapes: object[];
    shapeToggled: boolean;
    private legendLinearGradient;
    private currentLayer;
    private defsElement;
    legendElement: Element[];
    oldShapeElement: Element;
    constructor(maps: Maps);
    /**
     * To calculate legend bounds and draw the legend shape and text.
     */
    renderLegend(): void;
    calculateLegendBounds(): void;
    /**
     *
     */
    private getLegends;
    private getPageChanged;
    private legendTextTrim;
    /**
     * To draw the legend shape and text.
     */
    drawLegend(): void;
    private drawLegendItem;
    legendHighLightAndSelection(targetElement: Element, value: string): void;
    private setColor;
    pushCollection(targetElement: Element, collection: object[], oldElement: object, shapeSettings: ShapeSettings): void;
    private removeLegend;
    removeLegendHighlightCollection(): void;
    removeLegendSelectionCollection(targetElement: Element): void;
    removeShapeHighlightCollection(): void;
    shapeHighLightAndSelection(targetElement: Element, data: object, module: SelectionSettingsModel | HighlightSettingsModel, getValue: string, layerIndex: number): void;
    private isTargetSelected;
    private updateLegendElement;
    private getIndexofLegend;
    private removeAllSelections;
    legendIndexOnShape(data: object, index: number): object;
    private shapeDataOnLegend;
    private shapesOfLegend;
    private legendToggle;
    private renderLegendBorder;
    changeNextPage(e: PointerEvent): void;
    private getLegendAlignment;
    private getMarkersLegendCollections;
    private getRangeLegendCollection;
    private getOverallLegendItemsCollection;
    private removeDuplicates;
    private getEqualLegendCollection;
    private getDataLegendCollection;
    interactiveHandler(e: PointerEvent): void;
    private renderInteractivePointer;
    wireEvents(element: Element): void;
    addEventListener(): void;
    private legendClick;
    private removeCollections;
    removeEventListener(): void;
    private getLegendData;
    legendGradientColor(colorMap: ColorMappingSettings, legendIndex: number): string;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    destroy(maps: Maps): void;
}
