/**
 * Maps Component file
 */
import { Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { L10n, Internationalization } from '@syncfusion/ej2-base';
import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Size, Point } from './utils/helper';
import { LayerSettings } from './model/base';
import { ZoomSettingsModel, LegendSettingsModel, LayerSettingsModel } from './model/base-model';
import { MarkerSettingsModel, SelectionSettingsModel } from './model/base-model';
import { TitleSettingsModel, BorderModel, MarginModel, CenterPositionModel } from './model/base-model';
import { MapsAreaSettingsModel, AnnotationModel } from './model/base-model';
import { Bubble } from './layers/bubble';
import { Legend } from './layers/legend';
import { Marker } from './layers/marker';
import { Highlight } from './user-interaction/highlight';
import { Selection } from './user-interaction/selection';
import { MapsTooltip } from './user-interaction/tooltip';
import { Zoom } from './user-interaction/zoom';
import { ProjectionType, MapsTheme, PanDirection, TooltipGesture } from './utils/enum';
import { MapsModel } from './maps-model';
import { ILoadEventArgs, ILoadedEventArgs, IMouseEventArgs, IResizeEventArgs, ITooltipRenderEventArgs } from './model/interface';
import { GeoPosition, ITooltipRenderCompleteEventArgs, ILegendRenderingEventArgs } from './model/interface';
import { ILayerRenderingEventArgs, IShapeRenderingEventArgs, IMarkerRenderingEventArgs, IMarkerClickEventArgs } from './model/interface';
import { IMarkerMoveEventArgs, ILabelRenderingEventArgs, IBubbleMoveEventArgs, IBubbleClickEventArgs } from './model/interface';
import { IMarkerClusterClickEventArgs, IMarkerClusterMoveEventArgs, IMarkerClusterRenderingEventArgs } from './model/interface';
import { ISelectionEventArgs, IShapeSelectedEventArgs, IMapPanEventArgs, IMapZoomEventArgs } from './model/interface';
import { IBubbleRenderingEventArgs, IAnimationCompleteEventArgs, IPrintEventArgs, IThemeStyle } from './model/interface';
import { LayerPanel } from './layers/layer-panel';
import { GeoLocation, Rect } from '../maps/utils/helper';
import { Annotations } from '../maps/user-interaction/annotation';
import { DataLabel, IAnnotationRenderingEventArgs } from './index';
import { NavigationLine } from './layers/navigation-selected-line';
import { ExportType } from '../maps/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { Print } from './model/print';
import { PdfExport } from './model/export-pdf';
import { ImageExport } from './model/export-image';
/**
 * Represents the Maps control.
 * ```html
 * <div id="maps"/>
 * <script>
 *   var maps = new Maps();
 *   maps.appendTo("#maps");
 * </script>
 * ```
 */
export declare class Maps extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Sets and gets the module to add bubbles in the maps component.
     */
    bubbleModule: Bubble;
    /**
     * Sets and get the module to add the marker in the maps component.
     */
    markerModule: Marker;
    /**
     * Sets and gets the module to add the data-label in the maps component.
     */
    dataLabelModule: DataLabel;
    /**
     * Sets and gets the module to highlight the element when mouse has hovered on it in maps.
     */
    highlightModule: Highlight;
    /**
     * Sets and gets the module to add the navigation lines in the maps component.
     */
    navigationLineModule: NavigationLine;
    /**
     * Sets and gets the module to add the legend in maps.
     */
    legendModule: Legend;
    /**
     * Sets and gets the module to select the geometric shapes when clicking in maps.
     */
    selectionModule: Selection;
    /**
     * Sets and gets the module to add the tooltip when mouse has hovered on an element in maps.
     */
    mapsTooltipModule: MapsTooltip;
    /**
     * Sets and gets the module to add the zooming operations in maps.
     */
    zoomModule: Zoom;
    /**
     * Sets and gets the module to add annotation elements in maps.
     */
    annotationsModule: Annotations;
    /**
     * This module enables the print functionality in Maps control.
     * @private
     */
    printModule: Print;
    /**
     * This module enables the export to PDF functionality in Maps control.
     * @private
     */
    pdfExportModule: PdfExport;
    /**
     * This module enables the export to image functionality in Maps control.
     * @private
     */
    imageExportModule: ImageExport;
    /**
     * Sets and gets the background color of the maps container.
     * @default null
     */
    background: string;
    /**
     * Enables or disables the visibility state of the separator for grouping.
     * @default false
     */
    useGroupingSeparator: boolean;
    /**
     * Sets and gets the format in which the text in the maps are to be rendered.
     * @default null
     */
    format: string;
    /**
     * Sets and gets the width in which the maps is to be rendered.
     * @default null
     */
    width: string;
    /**
     * Sets and gets the height in which the maps is to be rendered.
     * @default null
     */
    height: string;
    /**
     * Sets and gets the mode in which the tooltip is to be displayed.
     * The tooltip can be rendered on mouse move, click or double clicking on the
     * element on the map.
     * @default 'MouseMove'
     */
    tooltipDisplayMode: TooltipGesture;
    /**
     * Enables or disables the print functionality in map.
     * @default false
     */
    allowPrint: boolean;
    /**
     * Enables or disables the export to image functionality in map.
     * @default false
     */
    allowImageExport: boolean;
    /**
     * Enables or disables the export to PDF functionality in map.
     * @default false
     */
    allowPdfExport: boolean;
    /**
     * Sets and gets the title to be displayed for maps.
     */
    titleSettings: TitleSettingsModel;
    /**
     * Sets and gets the options to customize the zooming operations in maps.
     */
    zoomSettings: ZoomSettingsModel;
    /**
     * Sets and gets the options to customize the legend of the maps.
     */
    legendSettings: LegendSettingsModel;
    /**
     * Sets and gets the options to customize the layers of the maps.
     */
    layers: LayerSettingsModel[];
    /**
     *  Sets and gets the options for customizing the annotation of maps.
     */
    annotations: AnnotationModel[];
    /**
     *  Sets and gets the options to customize the margins of the maps.
     */
    margin: MarginModel;
    /**
     * Sets and gets the options for customizing the color and width of the maps border.
     */
    border: BorderModel;
    /**
     * Set and gets the theme supported for the maps.
     * @default Material
     */
    theme: MapsTheme;
    /**
     * Sets and gets the projection type for the maps.
     * @default Mercator
     */
    projectionType: ProjectionType;
    /**
     * Sets and gets the base map index of maps. It provides the option to select which layer to be visible in the maps.
     * @default 0
     */
    baseLayerIndex: number;
    /**
     * Sets and gets the description for maps.
     * @default null
     */
    description: string;
    /**
     * Sets and gets the tab index value for the maps.
     * @default 1
     */
    tabIndex: number;
    /**
     * Sets and gets the center position of the maps.
     */
    centerPosition: CenterPositionModel;
    /**
     * Sets and gets the options to customize the area around the map.
     */
    mapsArea: MapsAreaSettingsModel;
    /**
     * Triggers when the map is on load.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load: EmitType<ILoadEventArgs>;
    /**
     * Triggers before the print gets started.
     * @event
     * @blazorProperty 'OnPrint'
     */
    beforePrint: EmitType<IPrintEventArgs>;
    /**
     * Triggers after the maps gets rendered.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers when clicking an element in maps.
     * @event
     * @blazorProperty 'OnClick'
     */
    click: EmitType<IMouseEventArgs>;
    /**
     * Triggers when performing the double click operation on an element in maps.
     * @event
     * @blazorProperty 'OnDoubleClick'
     */
    doubleClick: EmitType<IMouseEventArgs>;
    /**
     * Triggers when performing the right click operation on an element in maps.
     * @event
     * @blazorProperty 'OnRightClick'
     */
    rightClick: EmitType<IMouseEventArgs>;
    /**
     * Triggers when resizing the maps.
     * @event
     * @blazorProperty 'Resizing'
     */
    resize: EmitType<IResizeEventArgs>;
    /**
     * Triggers before the maps tooltip gets rendered.
     * @event
     * @blazorProperty 'TooltipRendering'
     */
    tooltipRender: EmitType<ITooltipRenderEventArgs>;
    /**
     * Triggers before the legend gets rendered.
     * @event
     * @deprecated
     * @blazorProperty 'LegendRendering'
     */
    legendRendering: EmitType<ILegendRenderingEventArgs>;
    /**
     * Triggers after the maps tooltip gets rendered.
     * @deprecated
     * @event
     * @blazorProperty 'TooltipRenderComplete'
     */
    tooltipRenderComplete: EmitType<ITooltipRenderCompleteEventArgs>;
    /**
     * Triggers when clicking a shape in maps.
     * @event
     * @blazorProperty 'ShapeSelected'
     */
    shapeSelected: EmitType<IShapeSelectedEventArgs>;
    /**
     * Triggers when clicking the shape on maps and before the selection is applied.
     * @event
     * @blazorProperty 'OnItemSelect'
     */
    itemSelection: EmitType<ISelectionEventArgs>;
    /**
     * Trigger when mouse move on the shape in maps and before the shape gets highlighted.
     * @event
     * @blazorProperty 'OnItemHighlight'
     */
    itemHighlight: EmitType<ISelectionEventArgs>;
    /**
     * Triggers when mouse move on the shape in maps and before the shape gets highlighted.
     * @event
     * @blazorProperty 'ShapeHighlighted'
     */
    shapeHighlight: EmitType<IShapeSelectedEventArgs>;
    /**
     * Triggers before the maps layer gets rendered.
     * @event
     * @blazorProperty 'LayerRendering'
     */
    layerRendering: EmitType<ILayerRenderingEventArgs>;
    /**
     * Triggers before the maps shape gets rendered.
     * @event
     * @blazorProperty 'ShapeRendering'
     */
    shapeRendering: EmitType<IShapeRenderingEventArgs>;
    /**
     * Triggers before the maps marker gets rendered.
     * @event
     * @blazorProperty 'MarkerRendering'
     */
    markerRendering: EmitType<IMarkerRenderingEventArgs>;
    /**
     * Triggers before the maps marker cluster gets rendered.
     * @event
     */
    markerClusterRendering: EmitType<IMarkerClusterRenderingEventArgs>;
    /**
     * Triggers when clicking on the maps marker element.
     * @event
     * @blazorProperty 'OnMarkerClick'
     */
    markerClick: EmitType<IMarkerClickEventArgs>;
    /**
     * Triggers when clicking the marker cluster in maps.
     * @event
     */
    markerClusterClick: EmitType<IMarkerClusterClickEventArgs>;
    /**
     * Triggers when moving the mouse over the marker cluster element in maps.
     * @event
     */
    markerClusterMouseMove: EmitType<IMarkerClusterMoveEventArgs>;
    /**
     * Triggers when moving the mouse over the marker element in maps.
     * @event
     * @blazorProperty 'OnMarkerMouseMove'
     */
    markerMouseMove: EmitType<IMarkerMoveEventArgs>;
    /**
     * Triggers before the data-label gets rendered.
     * @event
     * @blazorProperty 'DataLabelRendering'
     */
    dataLabelRendering: EmitType<ILabelRenderingEventArgs>;
    /**
     * Triggers before the bubble element gets rendered on the map.
     * @event
     * @blazorProperty 'BubbleRendering'
     */
    bubbleRendering: EmitType<IBubbleRenderingEventArgs>;
    /**
     * Triggers when performing the click operation on the bubble element in maps.
     * @event
     * @blazorProperty 'OnBubbleClick'
     */
    bubbleClick: EmitType<IBubbleClickEventArgs>;
    /**
     * Triggers when hovering the mouse on the bubble element in maps.
     * @event
     * @blazorProperty 'OnBubbleMouseMove'
     */
    bubbleMouseMove: EmitType<IBubbleMoveEventArgs>;
    /**
     * Triggers after the animation completed in the maps component.
     * @event
     * @blazorProperty 'AnimationCompleted'
     */
    animationComplete: EmitType<IAnimationCompleteEventArgs>;
    /**
     * Triggers before rendering the annotation in maps.
     * @event
     * @blazorProperty 'AnnotationRendering'
     */
    annotationRendering: EmitType<IAnnotationRenderingEventArgs>;
    /**
     * Triggers before the zoom operations in the maps such as zoom in and zoom out.
     * @event
     * @blazorProperty 'OnZoom'
     */
    zoom: EmitType<IMapZoomEventArgs>;
    /**
     * Triggers before performing the panning operation.
     * @event
     * @blazorProperty 'OnPan'
     */
    pan: EmitType<IMapPanEventArgs>;
    /**
     * Specifies the function to format the text contents in the maps.
     * @private
     */
    formatFunction: Function;
    /**
     * Specifies the svg renderer object.
     * @private
     */
    renderer: SvgRenderer;
    /**
     * Specifies the svg element's object of maps.
     * @private
     */
    svgObject: Element;
    /** @public */
    mapScaleValue: number;
    /**
     * Specifies the available height and width of maps.
     * @private
     */
    availableSize: Size;
    /**
     * Specifies the localization object.
     * @private
     */
    localeObject: L10n;
    /**
     * Specifies the default values of localization values.
     */
    private defaultLocalConstants;
    /**
     * Internal use of internationalization instance.
     * @private
     */
    intl: Internationalization;
    /**
     * Check layer whether is geometry or tile
     * @private
     */
    isTileMap: boolean;
    /**
     * Resize the map
     */
    private resizeTo;
    /**
     * Resize the map
     */
    private isResize;
    /**
     * @private
     * Stores the map area rect
     */
    mapAreaRect: Rect;
    /**
     * @private
     * Stores layers collection for rendering
     */
    layersCollection: LayerSettings[];
    /**
     * @private
     * Calculates the axes bounds for map.
     * @hidden
     */
    mapLayerPanel: LayerPanel;
    /**
     * @private
     * Render the data label.
     * @hidden
     */
    /**
     * @private
     */
    themeStyle: IThemeStyle;
    /**
     * @private
     * Enables or disables the reset
     */
    isReset: boolean;
    /**
     * @private
     * Sets and gets the legend bounds
     */
    totalRect: Rect;
    /**
     * Specifies whether the shape is selected in the maps or not..
     */
    readonly isShapeSelected: boolean;
    dataLabel: DataLabel;
    /** @private */
    isTouch: boolean;
    /** @private */
    baseSize: Size;
    /** @private */
    scale: number;
    /** @private */
    baseScale: number;
    /** @private */
    mapSelect: boolean;
    /** @private */
    baseMapBounds: GeoLocation;
    /** @private */
    baseMapRectBounds: Object;
    /** @public */
    translatePoint: Point;
    /** @private */
    baseTranslatePoint: Point;
    /** @public */
    zoomTranslatePoint: Point;
    /** @private */
    markerZoomFactor: number;
    /** @private */
    markerZoomCenterPoint: CenterPositionModel;
    /** @private */
    markerZoomedState: boolean;
    /** @private */
    zoomPersistence: boolean;
    /** @private */
    defaultState: boolean;
    /** @private */
    markerCenterLatitude: number;
    /** @private */
    markerCenterLongitude: number;
    /** @private */
    previousCenterLatitude: number;
    /** @private */
    previousCenterLongitude: number;
    /** @private */
    centerPositionChanged: boolean;
    /** @private */
    previousZoomFactor: number;
    /** @private */
    isTileMapSubLayer: boolean;
    /** @private */
    shouldZoomCurrentFactor: number;
    /** @private */
    shouldZoomPreviousFactor: number;
    /** @private */
    markerNullCount: number;
    /** @private */
    translateType: string;
    /** @public */
    previousProjection: String;
    /** @private */
    currentShapeDataLength: number;
    /** @private */
    tileTranslatePoint: Point;
    /** @private */
    baseTileTranslatePoint: Point;
    /** @private */
    isDevice: Boolean;
    /** @private */
    tileZoomLevel: number;
    /** @private */
    tileZoomScale: number;
    /** @private */
    staticMapZoom: number;
    /** @private */
    serverProcess: Object;
    /** @private */
    previousScale: number;
    /** @private */
    previousPoint: Point;
    /** @private */
    centerLatOfGivenLocation: number;
    /** @private */
    centerLongOfGivenLocation: number;
    /** @private */
    minLatOfGivenLocation: number;
    /** @private */
    minLongOfGivenLocation: number;
    /** @private */
    maxLatOfGivenLocation: number;
    /** @private */
    maxLongOfGivenLocation: number;
    /** @private */
    scaleOfGivenLocation: number;
    /** @private */
    zoomNotApplied: boolean;
    /** @public */
    dataLabelShape: number[];
    zoomShapeCollection: object[];
    zoomLabelPositions: object[];
    mouseDownEvent: Object;
    mouseClickEvent: Object;
    /** @private */
    isBlazor: boolean;
    /** @private */
    shapeSelectionClass: Element;
    /** @private */
    selectedElementId: string[];
    /** @private */
    markerSelectionClass: Element;
    /** @private */
    selectedMarkerElementId: string[];
    /** @private */
    bubbleSelectionClass: Element;
    /** @private */
    selectedBubbleElementId: string[];
    /** @private */
    navigationSelectionClass: Element;
    /** @private */
    selectedNavigationElementId: string[];
    /** @private */
    legendSelectionClass: SelectionSettingsModel;
    /** @private */
    selectedLegendElementId: number[];
    /** @private */
    legendSelectionCollection: object[];
    /** @private */
    shapeSelections: boolean;
    /** @private */
    legendSelection: boolean;
    /** @private */
    toggledLegendId: number[];
    /** @private */
    toggledShapeElementId: string[];
    /** @private */
    checkInitialRender: boolean;
    /** @private */
    widthBeforeRefresh: number;
    /** @private */
    heightBeforeRefresh: number;
    /** @private */
    previousTranslate: Point;
    /** @private */
    initialTileTranslate: Point;
    /** @private */
    previousTileWidth: number;
    /** @private */
    previousTileHeight: number;
    /** @private */
    initialZoomLevel: number;
    /** @private */
    initialCheck: boolean;
    /** @private */
    applyZoomReset: boolean;
    /** @private */
    markerClusterExpandCheck: boolean;
    /** @private */
    markerClusterExpand: boolean;
    /** @private */
    shapeSelectionItem: object[];
    /**
     * Constructor for creating the widget
     */
    constructor(options?: MapsModel, element?: string | HTMLElement);
    /**
     * To manage persist maps data
     */
    private mergePersistMapsData;
    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    getLocalizedLabel(key: string): string;
    /**
     * Initializing pre-required values.
     */
    protected preRender(): void;
    /**
     * To Initialize the control rendering.
     */
    protected render(): void;
    protected processRequestJsonData(): void;
    private processAjaxRequest;
    /**
     * This method is used to process the JSON data to render the maps.
     * @param processType - Specifies the process type in maps.
     * @param data - Specifies the data for maps.
     * @param layer - Specifies the layer for the maps.
     * @param dataType - Specifies the data type for maps.
     */
    processResponseJsonData(processType: string, data?: object | string, layer?: LayerSettings, dataType?: string): void;
    private renderMap;
    /**
     * @private
     * To apply color to the initial selected marker
     */
    markerSelection(selectionSettings: SelectionSettingsModel, map: Maps, targetElement: Element, data: object): void;
    /**
     * @private
     * initial selection of marker
     *
     */
    markerInitialSelection(layerIndex: number, markerIndex: number, markerSettings: MarkerSettingsModel, latitude: number, longitude: number): void;
    /**
     * To append blazor templates
     * @private
     */
    blazorTemplates(): void;
    /**
     * Render the map area border
     */
    private renderArea;
    /**
     * To add tab index for map element
     */
    private addTabIndex;
    private zoomingChange;
    private createSecondaryElement;
    /**
     * @private
     */
    arrangeTemplate(): void;
    private createTile;
    /**
     * To initilize the private varibales of maps.
     */
    private initPrivateVariable;
    private findBaseAndSubLayers;
    /**
     * @private
     * Render the map border
     */
    private renderBorder;
    /**
     * @private
     * Render the title and subtitle
     */
    private renderTitle;
    /**
     * To create svg element for maps
     */
    private createSVG;
    /**
     * To Remove the SVG
     */
    private removeSvg;
    /**
     * To bind event handlers for maps.
     */
    private wireEVents;
    /**
     * To unbind event handlers from maps.
     */
    private unWireEVents;
    /**
     * This method is used to perform operations when mouse pointer leave from maps.
     * @param e - Specifies the pointer event on maps.
     */
    mouseLeaveOnMap(e: PointerEvent): void;
    /**
     * Gets the selected element to be maintained or not.
     * @private
     */
    SelectedElement(targetEle: Element): boolean;
    /**
     * This method is used to perform the operations when a click operation is performed on maps.
     * @param e - Specifies the pointer event on maps.
     * @blazorProperty 'PerformClick'
     */
    mapsOnClick(e: PointerEvent): void;
    /**
     * This method is used to perform operations when mouse click on maps.
     * @param e - Specifies the pointer event on maps.
     */
    mouseEndOnMap(e: PointerEvent): boolean;
    /**
     * This method is used to perform operations when mouse is clicked down on maps.
     * @param e - Specifies the pointer event on maps.
     */
    mouseDownOnMap(e: PointerEvent): void;
    /**
     * This method is used to perform operations when performing the double click operation on maps.
     * @param e - Specifies the pointer event.
     * @blazorProperty 'PerformDoubleClick'
     */
    mapsOnDoubleClick(e: PointerEvent): void;
    /**
     * This method is used to perform operations while performing mouse over on maps.
     * @param e - Specifies the pointer event on maps.
     */
    mouseMoveOnMap(e: PointerEvent): void;
    /**
     * This method is used to perform operations when mouse move event is performed on maps.
     * @param e - Specifies the pointer event on maps.
     */
    onMouseMove(e: PointerEvent): boolean;
    private legendTooltip;
    private titleTooltip;
    mapsOnResize(e: Event): boolean;
    /**
     * This method is used to zoom the map by specifying the center position.
     * @param centerPosition - Specifies the center position for maps.
     * @param zoomFactor - Specifies the zoom factor for maps.
     */
    zoomByPosition(centerPosition: {
        latitude: number;
        longitude: number;
    }, zoomFactor: number): void;
    /**
     * This method is used to perform panning by specifying the direction.
     * @param direction - Specifies the direction in which the panning is performed.
     * @param mouseLocation - Specifies the location of the mouse pointer in maps.
     */
    panByDirection(direction: PanDirection, mouseLocation?: PointerEvent | TouchEvent): void;
    /**
     * This method is used to add the layers dynamically to the maps.
     * @param layer - Specifies the layer for the maps.
     */
    addLayer(layer: Object): void;
    /**
     * This method is used to remove a layer from map.
     * @param index - Specifies the index number of the layer to be removed.
     */
    removeLayer(index: number): void;
    /**
     * This method is used to add markers dynamically in the maps.
     * If we provide the index value of the layer in which the marker to be added and the coordinates
     * of the marker as parameters, the marker will be added in the location.
     * @param layerIndex - Specifies the index number of the layer.
     * @param marker - Specifes the settings of the marker to be added.
     */
    addMarker(layerIndex: number, markerCollection: MarkerSettingsModel[]): void;
    /**
     * This method is used to select the geometric shape element in the maps component.
     * @param layerIndex - Specifies the index of the layer in maps.
     * @param propertyName - Specifies the property name from the data source.
     * @param name - Specifies the name of the shape that is selected.
     * @param enable - Specifies the shape selection to be enabled.
     */
    shapeSelection(layerIndex: number, propertyName: string | string[], name: string, enable?: boolean): void;
    /**
     * This method is used to zoom the maps component based on the provided coordinates.
     * @param minLatitude - Specifies the minimum latitude to be zoomed.
     * @param minLongitude - Specifies the minimum latitude to be zoomed.
     * @param maxLatitude - Specifies the maximum latitude to be zoomed.
     * @param maxLongitude - Specifies the maximum longitude to be zoomed.
     */
    zoomToCoordinates(minLatitude: number, minLongitude: number, maxLatitude: number, maxLongitude: number): void;
    /**
     * This method is used to remove multiple selected shapes in the maps.
     */
    private removeShapeSelection;
    /**
     * This method is used to set culture for maps component.
     */
    private setCulture;
    /**
     * This method to set locale constants to the maps component.
     */
    private setLocaleConstants;
    /**
     * This method disposes the maps component.
     */
    destroy(): void;
    /**
     * Gets component name
     */
    getModuleName(): string;
    /**
     * Gets the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData(): string;
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp: MapsModel, oldProp: MapsModel): void;
    /**
     * To provide the array of modules needed for maps rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * To find marker visibility
     */
    private isMarkersVisible;
    /**
     * To find DataLabel visibility
     */
    private isDataLabelVisible;
    /**
     * To find navigation line visibility
     */
    private isNavigationVisible;
    /**
     * To find marker visibility
     */
    private isBubbleVisible;
    /**
     * To find the bubble visibility from layer
     * @private
     */
    getBubbleVisible(layer: LayerSettingsModel): boolean;
    /**
     * This method handles the printing functionality for the maps component.
     * @param id - Specifies the element to be printed.
     */
    print(id?: string[] | string | Element): void;
    /**
     * This method handles the export functionality for the maps component.
     * @param type - Specifies the type of the exported file.
     * @param fileName - Specifies the name of the file with which the rendered maps need to be exported.
     * @param orientation - Specifies the orientation of the pdf document in exporting.
     * @param allowDownload - Specifies whether to download as a file or get as base64 string for the file
     */
    export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string>;
    /**
     * To find visibility of layers and markers for required modules load.
     */
    private findVisibleLayers;
    /**
     * This method is used to get the geo location points.
     * @param {number} layerIndex - Specifies the index number of the layer of the map.
     * @param {PointerEvent} location - Specifies the location in point format.
     * @return GeoPosition
     */
    getGeoLocation(layerIndex: number, location: PointerEvent): GeoPosition;
    private clip;
    /**
     * This method is used to get the geo location points when tile maps is rendered in the maps component.
     * @param {PointerEvent} - Specifies the location in point format.
     * @return GeoPosition
     */
    getTileGeoLocation(location: PointerEvent): GeoPosition;
    /**
     * This method is used to convert the point to latitude and longitude in maps.
     * @param pageX - Specifies the x value for the page.
     * @param pageY - Specifies the y value for the page.
     */
    pointToLatLong(pageX: number, pageY: number): Object;
}
