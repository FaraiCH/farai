var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component, Property, Complex, Collection, EventHandler, L10n, Droppable, remove, Ajax, isBlazor } from '@syncfusion/ej2-base';
import { Browser, Event } from '@syncfusion/ej2-base';
import { updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { SvgRenderer } from './rendering/svg-renderer';
import { DiagramRenderer } from './rendering/renderer';
import { PageSettings, ScrollSettings } from './diagram/page-settings';
import { ServiceLocator } from './objects/service';
import { Container } from './core/containers/container';
import { Node, BpmnShape } from './objects/node';
import { cloneBlazorObject, cloneSelectedObjects, findObjectIndex } from './utility/diagram-util';
import { checkBrowserInfo } from './utility/diagram-util';
import { updateDefaultValues, getCollectionChangeEventArguements } from './utility/diagram-util';
import { flipConnector, updatePortEdges, alignElement, setConnectorDefaults, getPreviewSize } from './utility/diagram-util';
import { Connector } from './objects/connector';
import { SnapSettings } from './diagram/grid-lines';
import { RulerSettings } from './diagram/ruler-settings';
import { removeRulerElements, updateRuler, getRulerSize } from './ruler/ruler';
import { renderRuler, renderOverlapElement } from './ruler/ruler';
import { Size } from './primitives/size';
import { Keys, KeyModifiers, DiagramTools, AnnotationConstraints, NodeConstraints, ScrollActions } from './enum/enum';
import { RendererAction } from './enum/enum';
import { BlazorAction } from './enum/enum';
import { DiagramConstraints, SelectorConstraints, PortVisibility, DiagramEvent } from './enum/enum';
import { DiagramAction, ThumbsConstraints } from './enum/enum';
import { RealAction, ElementAction, PortConstraints } from './enum/enum';
import { PathElement } from './core/elements/path-element';
import { TextElement } from './core/elements/text-element';
import { updateStyle, removeItem, updateConnector, updateShape, setUMLActivityDefaults, findNodeByName } from './utility/diagram-util';
import { setSwimLaneDefaults } from './utility/diagram-util';
import { checkPortRestriction, serialize, deserialize, updateHyperlink, getObjectType, removeGradient } from './utility/diagram-util';
import { Rect } from './primitives/rect';
import { getPortShape } from './objects/dictionary/common';
import { ShapeAnnotation, PathAnnotation } from './objects/annotation';
import { Canvas } from './core/containers/canvas';
import { GridPanel, ColumnDefinition } from './core/containers/grid';
import { DataSource } from './diagram/data-source';
import { Layout } from './layout/layout-base';
import { Selector, Text } from './objects/node';
import { DiagramEventHandler } from './interaction/event-handlers';
import { CommandHandler } from './interaction/command-manager';
import { DiagramScroller } from './interaction/scroller';
import { isSelected } from './interaction/actions';
import { SpatialSearch } from './interaction/spatial-search/spatial-search';
import { setAttributeSvg, setAttributeHtml, measureHtmlText, removeElement, createMeasureElements, getDomIndex } from './utility/dom-util';
import { getDiagramElement, getScrollerWidth, getHTMLLayer, createUserHandleTemplates } from './utility/dom-util';
import { getBackgroundLayer, createHtmlElement, createSvgElement, getNativeLayerSvg, getUserHandleLayer } from './utility/dom-util';
import { getPortLayerSvg, getDiagramLayerSvg, applyStyleAgainstCsp } from './utility/dom-util';
import { getAdornerLayerSvg, getSelectorElement, getGridLayerSvg, getBackgroundLayerSvg } from './utility/dom-util';
import { CommandManager, ContextMenuSettings } from './diagram/keyboard-commands';
import { canDelete, canInConnect, canOutConnect, canRotate, canVitualize, canDrawThumbs } from './utility/constraints-util';
import { canPortInConnect, canPortOutConnect } from './utility/constraints-util';
import { canResize, canSingleSelect, canZoomPan, canZoomTextEdit, canMultiSelect } from './utility/constraints-util';
import { canDragSourceEnd, canDragTargetEnd, canDragSegmentThumb, enableReadOnly, canMove } from './utility/constraints-util';
import { findAnnotation, arrangeChild, getInOutConnectPorts, removeChildNodes, canMeasureDecoratorPath } from './utility/diagram-util';
import { randomId, cloneObject, extendObject, getFunction, getBounds } from './utility/base-util';
import { DiagramTooltip, initTooltip } from './objects/tooltip';
import { PointPort } from './objects/port';
import { canShadow } from './utility/constraints-util';
import { Layer } from './diagram/layer';
import { DiagramNativeElement } from './core/elements/native-element';
import { DiagramHtmlElement } from './core/elements/html-element';
import { canAllowDrop } from './utility/constraints-util';
import { checkParentAsContainer, addChildToContainer, updateLaneBoundsAfterAddChild } from './interaction/container-interaction';
import { getConnectors, updateConnectorsProperties, phaseDefine } from './utility/swim-lane-util';
import { swimLaneMeasureAndArrange } from './utility/swim-lane-util';
import { arrangeChildNodesInSwimLane, updateHeaderMaxWidth, updatePhaseMaxWidth } from './utility/swim-lane-util';
import { addLane, addPhase } from './utility/swim-lane-util';
import { SerializationSettings } from './diagram/serialization-settings';
import { removeSwimLane, removeLane, removePhase, removeLaneChildNode } from './utility/swim-lane-util';
import { RowDefinition } from './core/containers/grid';
import { CustomCursorAction } from './diagram/custom-cursor';
import { DiagramSettings } from '../diagram/diagram-settings';
import { StackPanel } from './core/containers/stack-panel';
import { ConnectorFixedUserHandle, NodeFixedUserHandle } from './objects/fixed-user-handle';
/**
 * Represents the Diagram control
 * ```html
 * <div id='diagram'/>
 * ```
 * ```typescript
 * let diagram: Diagram = new Diagram({
 * width:'1000px', height:'500px' });
 * diagram.appendTo('#diagram');
 * ```
 */
var Diagram = /** @class */ (function (_super) {
    __extends(Diagram, _super);
    /**
     * Constructor for creating the widget
     */
    function Diagram(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.version = 17.1;
        /** @private */
        _this.checkMenu = false;
        /** @private */
        _this.isServerUpdate = false;
        /** @private */
        _this.oldNodeObjects = [];
        /** @private */
        _this.oldDiagramObject = {};
        /** @private */
        _this.oldConnectorObjects = [];
        /** @private */
        _this.canEnableBlazorObject = false;
        /** @private */
        _this.connectorTable = {};
        /** @private */
        _this.groupTable = {};
        /** @private */
        _this.scrollActions = ScrollActions.None;
        /** @private */
        _this.blazorActions = BlazorAction.Default;
        /** @private */
        _this.activeLabel = { id: '', parentId: '', isGroup: false, text: undefined };
        /** @private */
        _this.textEditing = false;
        /** @private */
        _this.isTriggerEvent = false;
        /** @private */
        _this.preventNodesUpdate = false;
        /** @private */
        _this.preventConnectorsUpdate = false;
        /** @private */
        _this.callBlazorModel = true;
        /** @private */
        _this.selectionConnectorsList = [];
        /** @private */
        _this.deleteVirtualObject = false;
        _this.changedConnectorCollection = [];
        _this.changedNodesCollection = [];
        _this.previousNodeCollection = [];
        _this.previousConnectorCollection = [];
        _this.crudDeleteNodes = [];
        // Group update to server when BlazorAction is isGroupAction;
        _this.blazorAddorRemoveCollection = [];
        _this.blazorRemoveIndexCollection = [];
        _this.diagramid = 88123;
        /** @private */
        _this.selectedObject = { helperObject: undefined, actualObject: undefined };
        _this.renderTimer = null;
        var child;
        var node;
        var blazor = 'Blazor';
        var canCloneObject = isBlazor() && window && window[blazor] && !_this.dataSourceSettings.dataSource;
        _this.ignoreCollectionWatch = true;
        for (var i = 0; options && options.nodes && i < options.nodes.length; i++) {
            child = options.nodes[i];
            node = _this.nodes[i];
            if (child.children && child.children.length > 0) {
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'transparent';
                }
                if (!child.style || !child.style.strokeColor) {
                    node.style.strokeColor = 'transparent';
                }
            }
            if (child.shape && child.shape.type === 'UmlActivity') {
                setUMLActivityDefaults(child, node);
            }
            if (child.shape && child.shape.type === 'SwimLane') {
                setSwimLaneDefaults(child, node);
            }
            if (canCloneObject) {
                _this.previousNodeCollection.push(cloneObject(node, undefined, undefined, true));
            }
            if (_this.nodeDefaults) {
                updateDefaultValues(node, child, _this.nodeDefaults);
            }
            _this.updateAnnotationText(node.annotations);
        }
        if (options && options.connectors) {
            for (var i = 0; options && options.connectors && i < options.connectors.length; i++) {
                child = options.connectors[i];
                node = _this.connectors[i];
                if (canCloneObject) {
                    _this.previousConnectorCollection.push(cloneObject(node, undefined, undefined, true));
                }
                if (_this.connectorDefaults) {
                    updateDefaultValues(node, child, _this.connectorDefaults);
                }
                _this.updateAnnotationText(node.annotations);
            }
        }
        for (var i = 0; options && options.connectors && i < options.connectors.length; i++) {
            var defaultConnector = options.connectors[i];
            var connector = _this.connectors[i];
            if (defaultConnector.shape && defaultConnector.shape.type !== 'None') {
                setConnectorDefaults(defaultConnector, connector);
            }
            if (isBlazor()) {
                var defaultPropChanges = cloneObject(_this.bulkChanges);
                _this.enableServerDataBinding(true);
                _this.protectPropertyChange(true);
                var keys = Object.keys(defaultPropChanges);
                for (var i_1 = 0; i_1 < keys.length; i_1++) {
                    var key = keys[i_1];
                    var split = key.split('-');
                    if (split && split[0]) {
                        if (split[0] === 'nodes') {
                            defaultPropChanges[key].sfIndex = Number(split[1]);
                            _this.changedNodesCollection.push(defaultPropChanges[key]);
                        }
                        if (split[0] === 'connectors') {
                            defaultPropChanges[key].sfIndex = Number(split[1]);
                            _this.changedConnectorCollection.push(defaultPropChanges[key]);
                        }
                    }
                }
            }
        }
        return _this;
    }
    Diagram.prototype.updateAnnotationText = function (annotations) {
        if (isBlazor() && annotations.length > 0) {
            for (var i = 0; annotations && i < annotations.length; i++) {
                var label = annotations[i];
                label.content = label.content.split('\\n').join('\n');
            }
        }
    };
    Diagram.prototype.callFromServer = function (arg) {
        var methodName = 'methodName';
        var mId = 'id';
        if (arg[methodName] === 'getParentID') {
            var id = arg[mId];
            return this.nameTable[id].parentId;
        }
        else if (arg[methodName] === 'getEdges') {
            var outEdge = 'outEdge';
            var isOutEdge = arg[outEdge];
            var id = arg[mId];
            if (isOutEdge) {
                return this.nameTable[id].outEdges;
            }
            else {
                return this.nameTable[id].inEdges;
            }
        }
        else if (arg[methodName] === 'updateDiagramObjects') {
            var obj = 'obj';
            var isAdding = 'IsAdding';
            var args = arg[obj];
            this.isServerUpdate = true;
            if (arg[isAdding]) {
                var add = 'add';
                this[add].apply(this, args);
            }
            else {
                var remove_1 = 'remove';
                this[remove_1].apply(this, args);
            }
            this.isServerUpdate = false;
        }
        else if (arg[methodName] === 'invokeLoadDiagramMethod') {
            var data = 'data';
            this.loadDiagram(arg[data]);
        }
    };
    ;
    Diagram.prototype.clearCollection = function (isConnector) {
        var collection = [];
        var obj;
        for (var _i = 0, _a = Object.keys(this.nameTable); _i < _a.length; _i++) {
            var key = _a[_i];
            obj = this.nameTable[key];
            if (obj && ((isConnector && obj instanceof Connector) || (!isConnector && obj instanceof Node))) {
                collection.push(obj);
            }
        }
        this.clearObjects(collection);
    };
    /**
     * Updates the diagram control when the objects are changed
     * @param {DiagramModel} newProp - Lists the new values of the changed properties
     * @param {DiagramModel} oldProp - Lists the old values of the changed properties
     */
    /* tslint:disable */
    Diagram.prototype.onPropertyChanged = function (newProp, oldProp) {
        // Model Changed
        var newValue;
        var oldValue;
        var isPropertyChanged = true;
        var refreshLayout = false;
        var refereshColelction = false;
        if (this.diagramActions & DiagramAction.Render) {
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'width':
                    case 'height':
                        this.element.style.width = this.getSizeValue(this.width);
                        this.element.style.height = this.getSizeValue(this.height);
                        this.eventHandler.updateViewPortSize(this.element);
                        for (var _b = 0, _c = this.views; _b < _c.length; _b++) {
                            var view = _c[_b];
                            var temp = this.views[view];
                            if (!(temp instanceof Diagram)) {
                                temp.updateView(temp);
                            }
                        }
                        break;
                    case 'nodes':
                        if (newProp.nodes.length > 0 && oldProp.nodes.length === 0) {
                            this.clearCollection();
                            refereshColelction = true;
                        }
                        else {
                            for (var _d = 0, _e = Object.keys(newProp.nodes); _d < _e.length; _d++) {
                                var key = _e[_d];
                                var index = Number(key);
                                var actualObject = this.nodes[index];
                                var changedProp = newProp.nodes[index];
                                refreshLayout = refreshLayout || changedProp.excludeFromLayout !== undefined;
                                this.nodePropertyChange(actualObject, oldProp.nodes[index], changedProp, undefined, true, true);
                                var args = {
                                    element: cloneBlazorObject(actualObject), cause: this.diagramActions,
                                    oldValue: cloneBlazorObject(oldProp.nodes[index]),
                                    newValue: cloneBlazorObject(newProp.nodes[index])
                                };
                                if (isBlazor()) {
                                    args.element = { node: cloneBlazorObject(actualObject) };
                                    args.oldValue = { node: cloneBlazorObject(oldValue) };
                                    args.newValue = { node: cloneBlazorObject(newValue) };
                                }
                                this.triggerEvent(DiagramEvent.propertyChange, args);
                                if (isPropertyChanged) {
                                    isPropertyChanged = false;
                                }
                            }
                            if (this.mode === 'Canvas') {
                                this.refreshDiagramLayer();
                            }
                        }
                        break;
                    case 'connectors':
                        var oldObject = void 0;
                        if (newProp.connectors.length > 0 && oldProp.connectors.length === 0) {
                            this.clearCollection(true);
                            refereshColelction = true;
                        }
                        else {
                            for (var _f = 0, _g = Object.keys(newProp.connectors); _f < _g.length; _f++) {
                                var key = _g[_f];
                                var index = Number(key);
                                var actualObject = this.connectors[index];
                                var changedProp = newProp.connectors[index];
                                if (changedProp && (changedProp.sourceDecorator || changedProp.targetDecorator)) {
                                    this.diagramActions |= DiagramAction.DecoratorPropertyChange;
                                }
                                this.connectorPropertyChange(actualObject, oldProp.connectors[index], changedProp, true, true);
                                if (changedProp && (changedProp.sourceDecorator || changedProp.targetDecorator)) {
                                    this.diagramActions = this.diagramActions & ~DiagramAction.DecoratorPropertyChange;
                                }
                                var args = {
                                    element: cloneBlazorObject(actualObject), cause: this.diagramActions,
                                    oldValue: cloneBlazorObject(oldProp.connectors[index]),
                                    newValue: cloneBlazorObject(newProp.connectors[index])
                                };
                                if (isBlazor()) {
                                    args.element = { connector: cloneBlazorObject(actualObject) };
                                    args.oldValue = { connector: cloneBlazorObject(oldValue) };
                                    args.newValue = { connector: cloneBlazorObject(newValue) };
                                }
                                this.triggerEvent(DiagramEvent.propertyChange, args);
                                if (actualObject && actualObject.parentId && this.nameTable[actualObject.parentId].shape.type === 'UmlClassifier') {
                                    this.updateConnectorEdges(this.nameTable[actualObject.parentId] || actualObject);
                                }
                                if (isPropertyChanged) {
                                    isPropertyChanged = false;
                                }
                            }
                            this.updateBridging();
                            if (this.mode === 'Canvas') {
                                this.refreshDiagramLayer();
                            }
                        }
                        break;
                    case 'bridgeDirection':
                        this.updateBridging();
                        if (this.mode === 'Canvas') {
                            this.refreshDiagramLayer();
                        }
                        break;
                    case 'backgroundColor':
                        this.intOffPageBackground();
                        break;
                    case 'pageSettings':
                        this.validatePageSize();
                        this.updatePage();
                        break;
                    case 'selectedItems':
                        if (newProp.selectedItems.userHandles && this.selectedItems.wrapper && this.selectedItems.userHandles) {
                            if (this.selectedItems.userHandles.length > 0) {
                                this.renderSelector(true);
                                break;
                            }
                        }
                        if (newProp.selectedItems.constraints) {
                            this.renderSelector(true);
                            break;
                        }
                        break;
                    case 'snapSettings':
                        this.updateSnapSettings(newProp);
                        break;
                    case 'commandManager':
                        this.initCommands();
                        break;
                    case 'layout':
                        refreshLayout = true;
                        break;
                    case 'dataSourceSettings':
                        this.clear();
                        this.initObjects();
                        if (this.layout.type === 'None') {
                            refereshColelction = true;
                        }
                        else {
                            refreshLayout = true;
                        }
                        break;
                    case 'tooltip':
                        initTooltip(this);
                        break;
                    case 'rulerSettings':
                        this.updateRulerSettings(newProp);
                        break;
                    case 'layers':
                        this.updateLayer(newProp);
                        break;
                    case 'scrollSettings':
                        this.scrollActions |= ScrollActions.PropertyChange;
                        this.updateScrollSettings(newProp);
                        this.scrollActions &= ~ScrollActions.PropertyChange;
                        break;
                    case 'locale':
                        if (newProp.locale !== oldProp.locale) {
                            this.realActions |= RealAction.PreventDataInit;
                            _super.prototype.refresh.call(this);
                            this.realActions &= ~RealAction.PreventDataInit;
                        }
                        break;
                    case 'contextMenuSettings':
                        if (newProp.contextMenuSettings.showCustomMenuOnly !== undefined) {
                            this.contextMenuSettings.showCustomMenuOnly = newProp.contextMenuSettings.showCustomMenuOnly;
                        }
                        if (newProp.contextMenuSettings.show !== undefined) {
                            this.contextMenuSettings.show = newProp.contextMenuSettings.show;
                        }
                        if (newProp.contextMenuSettings.items) {
                            var items = newProp.contextMenuSettings.items;
                            for (var _h = 0, _j = Object.keys(items); _h < _j.length; _h++) {
                                var key = _j[_h];
                                var index = Number(key);
                                this.contextMenuSettings.items[index] = items[index];
                            }
                        }
                        break;
                    case 'serializationSettings':
                        if (newProp.serializationSettings.preventDefaults !== undefined) {
                            this.serializationSettings.preventDefaults = newProp.serializationSettings.preventDefaults;
                        }
                        break;
                }
            }
            if (refreshLayout && !refereshColelction) {
                if (oldProp.layout && oldProp.layout.connectionPointOrigin === "DifferentPoint" && newProp.layout.connectionPointOrigin === "SamePoint") {
                    for (var i = 0; i < this.nodes.length; i++) {
                        var node = this.nodes[i];
                        if ((node.ports && node.ports.length > 0)) {
                            var ports = [];
                            for (var j = node.ports.length - 1; j >= 0; j--) {
                                if (node.ports[j].id.split('_')[1] === 'LineDistribution') {
                                    ports.push(node.ports[j]);
                                }
                            }
                            this.removePorts(node, ports);
                        }
                    }
                    for (var j = 0; j < this.connectors.length; j++) {
                        var connector = this.connectors[j];
                        var sourcePortid = connector.sourcePortID;
                        var targetPortId = connector.targetPortID;
                        var oldSegment = connector.segments;
                        connector.sourcePortID = "";
                        connector.targetPortID = "";
                        connector.sourcePortWrapper = undefined;
                        connector.targetPortWrapper = undefined;
                        connector.segments = [];
                        this.connectorPropertyChange(connector, {
                            sourcePortID: sourcePortid, targetPortID: targetPortId
                        }, { sourcePortID: "", targetPortID: "" });
                    }
                }
                this.doLayout();
                this.renderReactTemplates();
            }
            if (isPropertyChanged && this.propertyChange) {
                var args = {
                    element: cloneBlazorObject(this), cause: this.diagramActions,
                    oldValue: cloneBlazorObject(oldProp), newValue: cloneBlazorObject(newProp)
                };
                if (isBlazor()) {
                    args.element = { diagram: cloneBlazorObject(this) };
                    args.oldValue = { diagram: cloneBlazorObject(oldValue) };
                    args.newValue = { diagram: cloneBlazorObject(newValue) };
                }
                this.triggerEvent(DiagramEvent.propertyChange, args);
            }
            if (!refereshColelction && (this.canLogChange()) && (this.modelChanged(newProp, oldProp))) {
                var entry = { type: 'PropertyChanged', undoObject: oldProp, redoObject: newProp, category: 'Internal' };
                if (this.historyManager) {
                    this.addHistoryEntry(entry);
                }
            }
            this.resetDiagramActions();
            if (refereshColelction) {
                this.initObjects(true);
                this.refreshDiagramLayer();
                if (refreshLayout) {
                    this.doLayout();
                }
            }
            var scrollAlone = ((Object.keys(newProp).length === 1) && newProp.scrollSettings !== undefined);
            if (!refereshColelction) {
                for (var _k = 0, _l = this.views; _k < _l.length; _k++) {
                    var temp = _l[_k];
                    var view = this.views[temp];
                    if (!(view instanceof Diagram)) {
                        if (newProp.scrollSettings && newProp.scrollSettings.currentZoom != oldProp.scrollSettings.currentZoom) {
                            view.updateHtmlLayer(view);
                        }
                        if (!scrollAlone) {
                            this.refreshCanvasDiagramLayer(view);
                        }
                    }
                }
            }
            this.resetTemplate();
        }
    };
    /* tslint:enable */
    Diagram.prototype.updateSnapSettings = function (newProp) {
        if (newProp.snapSettings.constraints !== undefined || newProp.snapSettings.horizontalGridlines ||
            newProp.snapSettings.verticalGridlines || newProp.snapSettings.gridType) {
            this.diagramRenderer.updateGrid(this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler);
        }
    };
    Diagram.prototype.updateRulerSettings = function (newProp) {
        if (newProp.rulerSettings.dynamicGrid !== undefined) {
            this.diagramRenderer.updateGrid(this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler);
        }
        if (newProp.rulerSettings.showRulers !== undefined) {
            this.intOffPageBackground();
            this.scroller.setSize();
            this.renderRulers();
        }
        else if (newProp.rulerSettings.horizontalRuler !== undefined ||
            newProp.rulerSettings.verticalRuler !== undefined) {
            if (newProp.rulerSettings.horizontalRuler.thickness !== undefined ||
                newProp.rulerSettings.verticalRuler.thickness !== undefined) {
                removeRulerElements(this);
                this.intOffPageBackground();
                this.scroller.setSize();
                this.renderRulers();
            }
            else {
                updateRuler(this);
            }
        }
        this.diagramRenderer.updateGrid(this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    Diagram.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Initialize nodes, connectors and renderer
     */
    Diagram.prototype.preRender = function () {
        this.initializePrivateVariables();
        this.isProtectedOnChange = true;
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
        this.setCulture();
        var measureWindowElement = 'measureElement';
        if (window[measureWindowElement]) {
            window[measureWindowElement] = null;
        }
        this.initDiagram();
        this.initViews();
        this.unWireEvents();
        this.wireEvents();
        this.element.classList.add('e-diagram');
    };
    Diagram.prototype.initializePrivateVariables = function () {
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-diagram').length;
            this.element.id = 'diagram_' + this.diagramid + '_' + collection;
        }
        this.defaultLocale = {
            Copy: 'Copy',
            Cut: 'Cut',
            Paste: 'Paste',
            Undo: 'Undo',
            Redo: 'Redo',
            SelectAll: 'Select All',
            Grouping: 'Grouping',
            Group: 'Group',
            UnGroup: 'Un Group',
            Order: 'Order',
            BringToFront: 'Bring To Front',
            MoveForward: 'Move Forward',
            SendToBack: 'Send To Back',
            SendBackward: 'Send Backward'
        };
        this.layerZIndex = -1;
        this.layerZIndexTable = {};
        this.nameTable = {};
        this.pathTable = {};
        this.groupTable = {};
        this.commands = {};
        if (!this.isLoading) {
            this.views = [];
        }
        this.commandHandler = new CommandHandler(this);
        this.eventHandler = new DiagramEventHandler(this, this.commandHandler);
        this.spatialSearch = new SpatialSearch(this.nameTable);
        this.scroller = new DiagramScroller(this);
    };
    Diagram.prototype.initializeServices = function () {
        this.serviceLocator.register('localization', this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale));
    };
    /**
     * Method to set culture for chart
     */
    Diagram.prototype.setCulture = function () {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    };
    /* tslint:disable */
    /**
     * Renders the diagram control with nodes and connectors
     */
    Diagram.prototype.render = function () {
        if (this.refreshing && this.dataSourceSettings.dataSource && !this.isLoading) {
            this.nodes = [];
            this.connectors = [];
        }
        this.ignoreCollectionWatch = true;
        var domTable = 'domTable';
        window[domTable] = {};
        var collapsedNode = [];
        if (isBlazor()) {
            var changedNodes = [];
            var changedConnectors = [];
            for (var i = 0; i < this.changedNodesCollection.length; i++) {
                changedNodes.push(this.commandHandler.deepDiffer.removeEmptyValues(this.changedNodesCollection[i]));
            }
            for (var i = 0; i < this.changedConnectorCollection.length; i++) {
                changedConnectors.push(this.commandHandler.deepDiffer.removeEmptyValues(this.changedConnectorCollection[i]));
            }
            var blazorInterop = 'sfBlazor';
            var blazor = 'Blazor';
            var diagramObject = { nodes: changedNodes, connectors: changedConnectors };
            if (window && window[blazor] && !this.dataSourceSettings.dataSource && (changedNodes.length > 0 || changedConnectors.length > 0)) {
                var obj = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': diagramObject };
                window[blazorInterop].updateBlazorProperties(obj, this);
            }
        }
        if (this.dataSourceSettings.crudAction.read) {
            this.renderInitialCrud();
        }
        this.initHistory();
        this.diagramRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), this.mode === 'SVG');
        this.initLayers();
        this.initializeDiagramLayers();
        this.diagramRenderer.setLayers();
        this.initObjects(true);
        var isLayout = false;
        if (isBlazor() && !this.dataSourceSettings.dataSource && this.layout.type !== "None") {
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var obj = _a[_i];
                this.insertValue(cloneObject(obj), true);
            }
            for (var _b = 0, _c = this.connectors; _b < _c.length; _b++) {
                var obj = _c[_b];
                this.insertValue(cloneObject(obj), false);
            }
            isLayout = true;
        }
        this.doLayout();
        if (isLayout) {
            this.commandHandler.getBlazorOldValues();
        }
        if (this.lineRoutingModule) {
            var previousConnectorObject = [];
            var updateConnectorObject = [];
            var changeConnectors = [];
            if (isBlazor()) {
                for (var _d = 0, _e = this.connectors; _d < _e.length; _d++) {
                    var obj = _e[_d];
                    previousConnectorObject.push(cloneObject(obj, undefined, undefined, true));
                }
            }
            this.lineRoutingModule.lineRouting(this);
            if (isBlazor()) {
                for (var _f = 0, _g = this.connectors; _f < _g.length; _f++) {
                    var obj = _g[_f];
                    updateConnectorObject.push(cloneObject(obj, undefined, undefined, true));
                }
                this.commandHandler.getObjectChanges(previousConnectorObject, updateConnectorObject, changeConnectors);
                if (!(this.blazorActions & BlazorAction.ClearObject)) {
                    var blazorInterop = 'sfBlazor';
                    var blazor = 'Blazor';
                    var diagramObject = { nodes: [], connectors: changeConnectors };
                    if (window && window[blazor]) {
                        var obj = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': diagramObject };
                        window[blazorInterop].updateBlazorProperties(obj, this);
                    }
                }
            }
        }
        this.validatePageSize();
        this.renderPageBreaks();
        this.diagramRenderer.renderSvgGridlines(this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler);
        this.commandHandler.initSelectorWrapper();
        /**
         * Used to render context menu
         */
        this.notify('initial-load', {});
        /**
         * Used to load context menu
         */
        this.trigger('load');
        this.scroller.setSize();
        this.scroller.updateScrollOffsets();
        this.refreshDiagramLayer();
        if (this.scrollSettings.verticalOffset > 0 || this.scrollSettings.horizontalOffset > 0) {
            this.updateScrollOffset();
        }
        /**
         * Used to end the context menu rendering
         */
        if (Browser.isDevice) {
            this.tool = DiagramTools.ZoomPan | DiagramTools.SingleSelect;
        }
        this.notify('initial-end', {});
        this.isProtectedOnChange = false;
        this.tooltipObject = initTooltip(this);
        this.diagramActions = DiagramAction.Render;
        var nodes = this.nodes;
        for (var i = 0; i < nodes.length; i++) {
            if (!nodes[i].isExpanded) {
                collapsedNode.push(nodes[i]);
            }
        }
        if (collapsedNode.length) {
            for (var i = collapsedNode.length - 1; i >= 0; i--) {
                this.commandHandler.expandNode(collapsedNode[i], this);
            }
        }
        this.initCommands();
        var hiddenUserHandleTemplate = document.getElementsByClassName(this.element.id + '_hiddenUserHandleTemplate');
        createUserHandleTemplates(this.userHandleTemplate, hiddenUserHandleTemplate, this.selectedItems, this.element.id);
        this.updateTemplate();
        this.isLoading = false;
        this.renderComplete();
        this.updateFitToPage();
        if (this.refreshing) {
            this.renderReactTemplates();
        }
    };
    /* tslint:enable */
    Diagram.prototype.updateFitToPage = function () {
        if (this.pageSettings && this.pageSettings.fitOptions && this.pageSettings.fitOptions.canFit) {
            this.fitToPage(this.pageSettings.fitOptions);
        }
    };
    Diagram.prototype.updateTemplate = function () {
        var node;
        var annotation;
        var pathAnnotation;
        for (var i = 0; i < this.nodes.length; i++) {
            node = this.nodes[i];
            if (node.shape.type === 'HTML' || node.shape.type === 'Native') {
                updateBlazorTemplate('diagramsf_node_template', 'NodeTemplate', this, false);
                break;
            }
        }
        for (var i = 0; i < this.nodes.length; i++) {
            node = this.nodes[i];
            annotation = node.annotations[0];
            if (annotation && annotation.annotationType === 'Template') {
                updateBlazorTemplate('diagramsf_annotation_template', 'AnnotationTemplate', this, false);
                break;
            }
        }
        for (var i = 0; i < this.connectors.length; i++) {
            pathAnnotation = this.connectors[i].annotations[0];
            if (pathAnnotation && pathAnnotation.annotationType === 'Template') {
                updateBlazorTemplate('diagramsf_annotation_template', 'AnnotationTemplate', this, false);
                break;
            }
        }
        for (var i = 0; i < this.selectedItems.userHandles.length; i++) {
            if (this.selectedItems.userHandles[i].template) {
                updateBlazorTemplate('diagramsf_userHandle_template', 'UserHandleTemplate', this, false);
                break;
            }
        }
    };
    Diagram.prototype.resetTemplate = function () {
        var htmlNode;
        var templateAnnotation;
        var path;
        for (var i = 0; i < this.nodes.length; i++) {
            htmlNode = this.nodes[i];
            if (htmlNode.shape.type === 'HTML' && htmlNode.shape.content instanceof HTMLElement) {
                resetBlazorTemplate('diagramsf_node_template', 'NodeTemplate');
                break;
            }
        }
        for (var i = 0; i < this.nodes.length; i++) {
            htmlNode = this.nodes[i];
            templateAnnotation = htmlNode.annotations[0];
            if (templateAnnotation && templateAnnotation.annotationType === 'Template'
                && templateAnnotation.content instanceof HTMLElement) {
                resetBlazorTemplate('diagramsf_annotation_template', 'AnnotationTemplate');
                break;
            }
        }
        for (var i = 0; i < this.connectors.length; i++) {
            path = this.connectors[i].annotations[0];
            if (path && path.annotationType === 'Template' && path.content instanceof HTMLElement) {
                resetBlazorTemplate('diagramsf_annotation_template', 'AnnotationTemplate');
                break;
            }
        }
        for (var i = 0; i < this.selectedItems.userHandles.length; i++) {
            if (this.selectedItems.userHandles[i].template) {
                updateBlazorTemplate('diagramsf_userHandle_template', 'UserHandleTemplate', this, false);
                break;
            }
        }
    };
    //Call back function to the node template
    // private measureNode(node: NodeModel): void {
    //     if (node.shape.type === 'Native' && isBlazor()) {
    //         node.wrapper.measure(new Size(node.width, node.height));
    //         node.wrapper.arrange(node.wrapper.desiredSize);
    //     }
    // }
    Diagram.prototype.renderInitialCrud = function () {
        var tempObj = this;
        if (tempObj.dataSourceSettings.crudAction.read) {
            var callback = new Ajax(tempObj.dataSourceSettings.crudAction.read, 'GET', false);
            callback.onSuccess = function (data) {
                if (tempObj.dataSourceSettings.dataManager) {
                    tempObj.dataSourceSettings.dataManager = JSON.parse(data);
                }
                else {
                    tempObj.dataSourceSettings.dataSource = JSON.parse(data);
                }
                tempObj.dataBind();
            };
            callback.send().then();
        }
        if (tempObj.dataSourceSettings.connectionDataSource.crudAction.read) {
            var callback = new Ajax(tempObj.dataSourceSettings.connectionDataSource.crudAction.read, 'GET', false);
            callback.onSuccess = function (data) {
                tempObj.dataSourceSettings.connectionDataSource.dataManager = JSON.parse(data);
                tempObj.dataBind();
            };
            callback.send().then();
        }
    };
    /**
     * Returns the module name of the diagram
     */
    Diagram.prototype.getModuleName = function () {
        return 'diagram';
    };
    /**
     * @private
     * Returns the name of class Diagram
     */
    Diagram.prototype.getClassName = function () {
        return 'Diagram';
    };
    /* tslint:disable */
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    Diagram.prototype.requiredModules = function () {
        var modules = [];
        modules.push({
            member: 'Bpmn',
            args: []
        });
        modules.push({
            member: 'Bridging',
            args: []
        });
        modules.push({
            member: 'ConnectorEditingTool',
            args: []
        });
        if (isBlazor()) {
            modules.push({
                member: 'BlazorTooltip',
                args: []
            });
        }
        if (this.constraints & DiagramConstraints.UndoRedo) {
            modules.push({
                member: 'UndoRedo',
                args: []
            });
        }
        if (this.layout.type === 'OrganizationalChart' || this.layout.type === 'HierarchicalTree' ||
            this.layout.enableAnimation) {
            modules.push({
                member: 'LayoutAnimate',
                args: []
            });
        }
        if (this.snapSettings.constraints) {
            modules.push({
                member: 'Snapping',
                args: [this]
            });
        }
        modules.push({
            member: 'PrintandExport',
            args: [this]
        });
        if (this.contextMenuSettings.show) {
            modules.push({
                member: 'contextMenu',
                args: [this, this.serviceLocator]
            });
        }
        if (this.layout.type === 'OrganizationalChart' || this.layout.type === 'HierarchicalTree') {
            modules.push({
                member: 'OrganizationalChart',
                args: [this]
            });
        }
        if (this.layout.type === 'ComplexHierarchicalTree') {
            modules.push({
                member: 'ComplexHierarchicalTree',
                args: []
            });
        }
        if (this.layout.type === 'MindMap') {
            modules.push({
                member: 'MindMapChart',
                args: []
            });
        }
        if (this.layout.type === 'RadialTree') {
            modules.push({
                member: 'RadialTree',
                args: []
            });
        }
        if (this.layout.type === 'SymmetricalLayout') {
            modules.push({
                member: 'SymmetricalLayout',
                args: []
            });
        }
        if (this.dataSourceSettings.dataManager || this.dataSourceSettings.dataSource ||
            this.dataSourceSettings.crudAction.read || this.dataSourceSettings.connectionDataSource.crudAction.read) {
            modules.push({
                member: 'DataBinding',
                args: []
            });
        }
        if (this.constraints & DiagramConstraints.LineRouting) {
            modules.push({
                member: 'LineRouting',
                args: []
            });
        }
        if ((this.layout && this.layout.connectionPointOrigin === "DifferentPoint") || (this.layout.arrangement === "Linear")) {
            modules.push({
                member: 'LineDistribution',
                args: []
            });
        }
        return modules;
    };
    /* tslint:enable */
    Diagram.prototype.removeUserHandlesTemplate = function () {
        if (this.selectedItems.userHandles.length) {
            for (var i = 0; i < this.selectedItems.userHandles.length; i++) {
                for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
                    var elementId = _a[_i];
                    removeElement(this.selectedItems.userHandles[i].name + '_template_hiddenUserHandle', elementId);
                }
            }
        }
    };
    /**
     * Destroys the diagram control
     */
    Diagram.prototype.destroy = function () {
        clearInterval(this.renderTimer);
        this.renderTimer = null;
        if (this.hRuler && this.vRuler) {
            this.hRuler.destroy();
            this.vRuler.destroy();
        }
        this.tooltipObject.destroy();
        this.droppable.destroy();
        this.unWireEvents();
        this.notify('destroy', {});
        _super.prototype.destroy.call(this);
        this.removeUserHandlesTemplate();
        this.clearTemplate();
        if (document.getElementById(this.element.id)) {
            this.element.classList.remove('e-diagram');
            var tooltipelement = document.getElementsByClassName('e-diagram-tooltip');
            while (tooltipelement.length > 0) {
                tooltipelement[0].parentNode.removeChild(tooltipelement[0]);
            }
            var content = document.getElementById(this.element.id + 'content');
            if (content) {
                this.element.removeChild(content);
            }
            var measureWindowElement = 'measureElement';
            if (window[measureWindowElement]) {
                window[measureWindowElement].usageCount -= 1;
                var measureElementCount = 'measureElementCount';
                window[measureElementCount]--;
                if (window[measureElementCount] === 0) {
                    window[measureWindowElement].parentNode.removeChild(window[measureWindowElement]);
                    window[measureWindowElement] = null;
                }
            }
        }
        var domTable = 'domTable';
        window[domTable] = {};
        for (var i = 0; i < this.layers.length; i++) {
            var currentLayer = this.layers[i];
            currentLayer.zIndexTable = {};
        }
        this.diagramActions = undefined;
    };
    /**
     * Wires the mouse events with diagram control
     */
    Diagram.prototype.wireEvents = function () {
        var startEvent = Browser.touchStartEvent;
        var stopEvent = Browser.touchEndEvent;
        var moveEvent = Browser.touchMoveEvent;
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        var isIE11Pointer = Browser.isPointer;
        var wheelEvent = Browser.info.name === 'mozilla' ?
            (isIE11Pointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
        EventHandler.add(this.diagramCanvas, startEvent, this.eventHandler.mouseDown, this.eventHandler);
        EventHandler.add(this.diagramCanvas, moveEvent, this.eventHandler.mouseMove, this.eventHandler);
        EventHandler.add(this.diagramCanvas, stopEvent, this.eventHandler.mouseUp, this.eventHandler);
        EventHandler.add(this.diagramCanvas, cancelEvent, this.eventHandler.mouseLeave, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'keydown', this.eventHandler.keyDown, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'keyup', this.eventHandler.keyUp, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'dblclick', this.eventHandler.doubleClick, this.eventHandler);
        EventHandler.add(this.diagramCanvas, 'scroll', this.eventHandler.scrolled, this.eventHandler);
        EventHandler.add(this.diagramCanvas, wheelEvent, this.eventHandler.mouseWheel, this.eventHandler);
        EventHandler.add(window, 'resize', this.eventHandler.windowResize, this.eventHandler);
        this.initDroppables();
    };
    /**
     * Unwires the mouse events from diagram control
     */
    Diagram.prototype.unWireEvents = function () {
        var startEvent = Browser.touchStartEvent;
        var moveEvent = Browser.touchMoveEvent;
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        var isIE11Pointer = Browser.isPointer;
        var wheelEvent = Browser.info.name === 'mozilla' ?
            (isIE11Pointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
        var stopEvent = Browser.touchEndEvent;
        EventHandler.remove(this.diagramCanvas, startEvent, this.eventHandler.mouseDown);
        EventHandler.remove(this.diagramCanvas, moveEvent, this.eventHandler.mouseMove);
        EventHandler.remove(this.diagramCanvas, stopEvent, this.eventHandler.mouseUp);
        EventHandler.remove(this.diagramCanvas, cancelEvent, this.eventHandler.mouseLeave);
        EventHandler.remove(this.diagramCanvas, 'keydown', this.eventHandler.keyDown);
        EventHandler.remove(this.diagramCanvas, 'keyup', this.eventHandler.keyUp);
        EventHandler.remove(this.diagramCanvas, 'dblclick', this.eventHandler.doubleClick);
        EventHandler.remove(this.diagramCanvas, 'scroll', this.eventHandler.scrolled);
        EventHandler.remove(this.diagramCanvas, wheelEvent, this.eventHandler.mouseWheel);
        EventHandler.remove(window, 'resize', this.eventHandler.windowResize);
    };
    //public methods - start region
    /**
     * Selects the given collection of objects
     * @param {NodeModel | ConnectorModel} objects - Defines the collection of nodes and connectors to be selected
     * @param {boolean} multipleSelection - Defines whether the existing selection has to be cleared or not
     */
    Diagram.prototype.select = function (objects, multipleSelection) {
        if (isBlazor()) {
            for (var i = 0; i < objects.length; i++) {
                objects[i] = this.nameTable[objects[i].id];
            }
            objects = this.nameTable[objects.id] || objects;
        }
        if (objects != null) {
            this.commandHandler.selectObjects(objects, multipleSelection);
        }
    };
    /**
     * Selects the all the objects.
     */
    Diagram.prototype.selectAll = function () {
        var selectedItems = [];
        selectedItems = this.getObjectsOfLayer(this.activeLayer.objects);
        this.select(selectedItems);
    };
    /**
     * Removes the given object from selection list
     * @param {NodeModel | ConnectorModel} obj - Defines the object to be unselected
     */
    Diagram.prototype.unSelect = function (obj) {
        if (isBlazor()) {
            this.commandHandler.oldSelectedObjects = cloneObject(this.selectedItems);
            obj = this.nameTable[obj.id] || obj;
        }
        if (obj && isSelected(this, obj)) {
            this.commandHandler.unSelect(obj);
            this.commandHandler.updateBlazorSelector();
        }
    };
    /**
     * Removes all elements from the selection list
     */
    Diagram.prototype.clearSelection = function () {
        this.commandHandler.clearSelection(true);
    };
    /**
     * Update the diagram clipboard dimension
     */
    Diagram.prototype.updateViewPort = function () {
        var attribute = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.eventHandler.updateViewPortSize(this.element);
        this.updateBlazorDiagramProperties(attribute, true);
    };
    Diagram.prototype.cutCommand = function () {
        this.cut();
    };
    /**
     * Removes the selected nodes and connectors from diagram and moves them to diagram clipboard
     */
    Diagram.prototype.cut = function () {
        this.commandHandler.cut();
    };
    /**
     * Add a process into the sub-process
     * @blazorArgsType process|DiagramNode
     */
    Diagram.prototype.addProcess = function (process, parentId) {
        if (this.bpmnModule) {
            this.bpmnModule.addProcess(process, parentId, this);
        }
    };
    /**
     * Remove a process from the sub-process
     */
    Diagram.prototype.removeProcess = function (id) {
        if (this.bpmnModule) {
            this.bpmnModule.removeProcess(id, this);
        }
    };
    Diagram.prototype.pasteCommand = function () {
        this.paste();
    };
    /**
     * Adds the given objects/ the objects in the diagram clipboard to diagram control
     * @param {NodeModel[] | ConnectorModel[]} obj - Defines the objects to be added to diagram
     * @deprecated
     */
    Diagram.prototype.paste = function (obj) {
        this.commandHandler.paste(obj);
    };
    /**
     * fit the diagram to the page with respect to mode and region
     */
    Diagram.prototype.fitToPage = function (options) {
        var attribute = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.fitToPage(options);
        this.updateBlazorDiagramProperties(attribute, true);
    };
    /**
     * bring the specified bounds into the viewport
     */
    Diagram.prototype.bringIntoView = function (bound) {
        var attribute = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.bringIntoView(bound);
        this.updateBlazorDiagramProperties(attribute, true);
    };
    /**
     * bring the specified bounds to the center of the viewport
     */
    Diagram.prototype.bringToCenter = function (bound) {
        var attribute = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.bringToCenter(bound);
        this.updateBlazorDiagramProperties(attribute, true);
    };
    Diagram.prototype.copyCommand = function () {
        this.copy();
    };
    /**
     * Copies the selected nodes and connectors to diagram clipboard
     */
    Diagram.prototype.copy = function () {
        var obj = this.commandHandler.copy();
        return obj;
    };
    /**
     * Group the selected nodes and connectors in diagram
     */
    Diagram.prototype.group = function () {
        this.callBlazorModel = false;
        this.insertBlazorDiagramObjects(this.selectedItems);
        this.commandHandler.group();
        this.callBlazorModel = true;
        this.commandHandler.getBlazorOldValues();
    };
    /**
     * UnGroup the selected nodes and connectors in diagram
     */
    Diagram.prototype.unGroup = function () {
        this.callBlazorModel = false;
        this.insertBlazorDiagramObjects(this.selectedItems);
        this.commandHandler.unGroup();
        this.callBlazorModel = true;
        this.commandHandler.getBlazorOldValues();
    };
    /**
     * send the selected nodes or connectors back
     */
    Diagram.prototype.sendToBack = function () {
        this.commandHandler.sendToBack();
    };
    /**
     * set the active layer
     *  @param {string} layerName - defines the name of the layer which is to be active layer
     */
    Diagram.prototype.setActiveLayer = function (layerName) {
        var layer = this.commandHandler.getLayer(layerName);
        this.activeLayer = layer;
    };
    /**
     * add the layer into diagram
     * @param {LayerModel} layer - defines the layer model which is to be added
     * @param {Object[]} layerObject - defines the object of the layer
     * @blazorArgsType layer|DiagramLayer
     * @deprecated
     */
    Diagram.prototype.addLayer = function (layer, layerObject) {
        this.commandHandler.addLayer(layer, layerObject);
    };
    /**
     *  @private
     */
    Diagram.prototype.addDiagramLayer = function (layer, layerObject) {
        this.commandHandler.addLayer(layer, layerObject, false);
    };
    /**
     * remove the layer from diagram
     * @param {string} layerId - define the id of the layer
     * @deprecated
     */
    Diagram.prototype.removeLayer = function (layerId) {
        this.commandHandler.removeLayer(layerId, isBlazor());
    };
    /**
     *  @private
     */
    Diagram.prototype.removeDiagramLayer = function (layerId) {
        this.commandHandler.removeLayer(layerId, false);
    };
    /**
     * move objects from the layer to another layer from diagram
     * @param {string[]} objects - define the objects id of string array
     */
    Diagram.prototype.moveObjects = function (objects, targetLayer) {
        var oldValues = cloneObject(this.layers);
        this.enableServerDataBinding(false);
        this.commandHandler.moveObjects(objects, targetLayer);
        var result = this.commandHandler.deepDiffer.map(oldValues, cloneObject(this.layers));
        var diffValue = this.commandHandler.deepDiffer.frameObject({}, result);
        this.oldDiagramObject = { layers: diffValue };
        this.commandHandler.updateBlazorProperties();
    };
    /* tslint:disable */
    Diagram.prototype.layerObjectUpdate = function () {
        if (isBlazor()) {
            this.enableServerDataBinding(false);
            this.oldDiagramObject['layers'] = [];
            for (var i = 0; i < this.layers.length; i++) {
                var leyerObject = cloneObject(this.layers[i]);
                leyerObject.sfIndex = this.layers[i].zIndex;
                this.oldDiagramObject['layers'].push(leyerObject);
            }
        }
    };
    /* tslint:enable */
    /**
     * move the layer backward
     * @param {string} layerName - define the name of the layer
     */
    Diagram.prototype.sendLayerBackward = function (layerName) {
        this.layerObjectUpdate();
        this.commandHandler.sendLayerBackward(layerName);
        this.commandHandler.updateLayerObject(this.oldDiagramObject, true);
    };
    /**
     * move the layer forward
     * @param {string} layerName - define the name of the layer
     */
    Diagram.prototype.bringLayerForward = function (layerName) {
        this.layerObjectUpdate();
        this.commandHandler.bringLayerForward(layerName);
        this.commandHandler.updateLayerObject(this.oldDiagramObject);
    };
    /**
     * clone a layer with its object
     * @param {string} layerName - define the name of the layer
     */
    Diagram.prototype.cloneLayer = function (layerName) {
        this.commandHandler.cloneLayer(layerName);
    };
    /**
     * bring the selected nodes or connectors to front
     */
    Diagram.prototype.bringToFront = function () {
        this.commandHandler.bringToFront();
    };
    /**
     * send the selected nodes or connectors forward
     */
    Diagram.prototype.moveForward = function () {
        this.commandHandler.sendForward();
    };
    /**
     * send the selected nodes or connectors back
     */
    Diagram.prototype.sendBackward = function () {
        this.commandHandler.sendBackward();
    };
    /**
     * gets the node or connector having the given name
     */
    Diagram.prototype.getObject = function (name) {
        return this.nameTable[name];
    };
    /**
     * gets the node object for the given node ID
     */
    Diagram.prototype.getNodeObject = function (id) {
        return cloneObject(this.nameTable[id]);
    };
    /**
     * gets the connector object for the given node ID
     */
    Diagram.prototype.getConnectorObject = function (id) {
        return cloneObject(this.nameTable[id]);
    };
    /**
     * gets the active layer back
     */
    Diagram.prototype.getActiveLayer = function () {
        return this.activeLayer;
    };
    Diagram.prototype.nudgeCommand = function (direction, x, y) {
        if (typeof direction !== 'object' && (this.selectedItems.nodes.length || this.selectedItems.connectors.length) > 0) {
            this.nudge(direction);
        }
    };
    /**
     * Moves the selected objects towards the given direction
     * @param {NudgeDirection} direction -  Defines the direction by which the objects have to be moved
     * @param {number} x - Defines the distance by which the selected objects have to be horizontally moved
     * @param {number} y -  Defines the distance by which the selected objects have to be vertically moved
     */
    Diagram.prototype.nudge = function (direction, x, y) {
        var tx = 0;
        var ty = 0;
        var negativeDirection;
        if (direction === 'Left' || direction === 'Right') {
            negativeDirection = (direction === 'Left');
            tx = (negativeDirection ? -1 : 1) * (x ? x : 1);
        }
        else {
            negativeDirection = (direction === 'Up');
            ty = (negativeDirection ? -1 : 1) * (y ? y : 1);
        }
        var obj = this.selectedItems;
        var annotation = this.selectedItems.wrapper.children[0];
        if (annotation instanceof TextElement) {
            this.commandHandler.labelDrag(obj.nodes[0], annotation, tx, ty);
        }
        else {
            var undoObject = cloneObject(this.selectedItems);
            this.protectPropertyChange(true);
            this.drag(obj, tx, ty);
            this.protectPropertyChange(false);
            var entry = {
                type: 'PositionChanged',
                redoObject: cloneObject(this.selectedItems), undoObject: undoObject, category: 'Internal'
            };
            this.addHistoryEntry(entry);
        }
        this.refreshCanvasLayers();
    };
    Diagram.prototype.insertBlazorDiagramObjects = function (actualObject) {
        if (isBlazor() && !(this.blazorActions & BlazorAction.interaction)) {
            this.enableServerDataBinding(false);
            if (actualObject instanceof Selector) {
                for (var i = 0; i < actualObject.nodes.length; i++) {
                    this.insertBlazorDiagramObjects(actualObject.nodes[i]);
                }
                for (var i = 0; i < actualObject.connectors.length; i++) {
                    this.insertBlazorDiagramObjects(actualObject.connectors[i]);
                }
            }
            if (!(actualObject instanceof Selector)) {
                var object = void 0;
                if (actualObject && actualObject.children && actualObject.children.length > 0) {
                    for (var i = 0; i < actualObject.children.length; i++) {
                        this.insertBlazorDiagramObjects(this.nameTable[actualObject.children[i]]);
                    }
                }
                object = cloneObject(this.nameTable[actualObject.id]);
                this.insertValue(object, !(getObjectType(actualObject) === Connector));
            }
        }
    };
    /**
     * Drags the given object by the specified pixels
     * @param {NodeModel | ConnectorMode | SelectorModel} obj - Defines the nodes/connectors to be dragged
     * @param {number} tx - Defines the distance by which the given objects have to be horizontally moved
     * @param {number} ty - Defines the distance by which the given objects have to be vertically moved
     */
    Diagram.prototype.drag = function (obj, tx, ty) {
        this.insertBlazorDiagramObjects(obj);
        if (isBlazor() && obj.id) {
            obj = this.nameTable[obj.id] || obj;
        }
        if (this.bpmnModule && (obj instanceof Node)) {
            var updated = this.bpmnModule.updateAnnotationDrag(obj, this, tx, ty);
            if (updated) {
                return;
            }
        }
        if (obj instanceof Selector) {
            this.preventConnectorsUpdate = true;
            if (obj.nodes && obj.nodes.length) {
                for (var _i = 0, _a = obj.nodes; _i < _a.length; _i++) {
                    var node = _a[_i];
                    this.callBlazorModel = false;
                    this.drag(node, tx, ty);
                    if (node.parentId) {
                        var parent_1 = this.nameTable[node.parentId];
                        if (parent_1.isLane) {
                            var swimlane = this.nameTable[parent_1.parentId];
                            updateLaneBoundsAfterAddChild(parent_1, swimlane, node, this);
                        }
                    }
                }
                this.callBlazorModel = true;
            }
            if (obj.connectors && obj.connectors.length) {
                this.callBlazorModel = false;
                for (var _b = 0, _c = obj.connectors; _b < _c.length; _b++) {
                    var conn = _c[_b];
                    this.drag(conn, tx, ty);
                    if (this.selectionConnectorsList.indexOf(conn) === -1) {
                        this.selectionConnectorsList.push(conn);
                    }
                }
                this.callBlazorModel = true;
            }
            this.updateSelector();
            if ((this.diagramActions & DiagramAction.DragUsingMouse)) {
                this.updatePage();
            }
        }
        else {
            if (obj instanceof Node) {
                if (this.bpmnModule) {
                    this.bpmnModule.updateAnnotationDrag(obj, this, tx, ty);
                }
            }
            this.commandHandler.drag(obj, tx, ty);
        }
        if (obj instanceof Selector) {
            this.preventConnectorsUpdate = false;
            for (var _d = 0, _e = this.selectionConnectorsList; _d < _e.length; _d++) {
                var connectors = _e[_d];
                this.updateConnectorProperties(this.nameTable[connectors.id]);
                if (connectors.shape.type === 'Bpmn' && connectors.shape.sequence === 'Default') {
                    this.commandHandler.updatePathElementOffset(connectors);
                }
            }
            this.selectionConnectorsList = [];
        }
        if (!(this.diagramActions & DiagramAction.ToolAction) && !(this.diagramActions & DiagramAction.DragUsingMouse)) {
            this.updateSelector();
        }
        if (this.callBlazorModel && (!(this.blazorActions & BlazorAction.interaction)) &&
            (!(this.blazorActions & BlazorAction.GroupClipboardInProcess))) {
            this.commandHandler.getBlazorOldValues();
        }
    };
    Diagram.prototype.disableStackContainerPadding = function (wrapper, disable) {
        if (wrapper instanceof StackPanel) {
            wrapper.considerPadding = disable;
        }
        if (wrapper.children) {
            for (var _i = 0, _a = wrapper.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.disableStackContainerPadding(child, false);
            }
        }
    };
    /**
     * Scales the given objects by the given ratio
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - Defines the objects to be resized
     * @param {number} sx - Defines the ratio by which the objects have to be horizontally scaled
     * @param {number} sy - Defines the ratio by which the objects have to be vertically scaled
     * @param {PointModel} pivot - Defines the reference point with respect to which the objects will be resized
     */
    Diagram.prototype.scale = function (obj, sx, sy, pivot) {
        this.disableStackContainerPadding(obj.wrapper, false);
        this.insertBlazorDiagramObjects(obj);
        var checkBoundaryConstraints = true;
        if (obj.id) {
            obj = this.nameTable[obj.id] || obj;
        }
        if (obj instanceof Selector) {
            if (obj.nodes && obj.nodes.length) {
                this.callBlazorModel = false;
                for (var _i = 0, _a = obj.nodes; _i < _a.length; _i++) {
                    var node = _a[_i];
                    checkBoundaryConstraints = this.commandHandler.scale(node, sx, sy, pivot, obj);
                    if (!this.commandHandler.checkBoundaryConstraints(undefined, undefined, obj.wrapper.bounds)) {
                        this.commandHandler.scale(node, 1 / sx, 1 / sy, pivot, obj);
                    }
                }
                this.callBlazorModel = true;
            }
            if (obj.connectors && obj.connectors.length) {
                this.callBlazorModel = false;
                for (var _b = 0, _c = obj.connectors; _b < _c.length; _b++) {
                    var conn = _c[_b];
                    this.commandHandler.scale(conn, sx, sy, pivot, obj);
                    if (!this.commandHandler.checkBoundaryConstraints(undefined, undefined, obj.wrapper.bounds)) {
                        this.commandHandler.scale(conn, 1 / sx, 1 / sy, pivot, obj);
                    }
                }
                this.callBlazorModel = true;
            }
            this.updateSelector();
            this.refreshCanvasLayers();
        }
        else {
            this.commandHandler.scale(obj, sx, sy, pivot, (obj.children ? obj : undefined));
        }
        if (this.callBlazorModel && (!(this.blazorActions & BlazorAction.interaction)) &&
            (!(this.blazorActions & BlazorAction.GroupClipboardInProcess))) {
            this.commandHandler.getBlazorOldValues();
        }
        this.disableStackContainerPadding(obj.wrapper, true);
        return checkBoundaryConstraints;
    };
    /**
     * Rotates the given nodes/connectors by the given angle
     * @param {NodeModel | ConnectorModel | SelectorModel} obj - Defines the objects to be rotated
     * @param {number} angle - Defines the angle by which the objects have to be rotated
     * @param {PointModel} pivot - Defines the reference point with reference to which the objects have to be rotated
     */
    Diagram.prototype.rotate = function (obj, angle, pivot) {
        this.insertBlazorDiagramObjects(obj);
        var checkBoundaryConstraints;
        if (obj.id) {
            obj = this.nameTable[obj.id] || obj;
        }
        if (obj) {
            pivot = pivot || { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
            if (obj instanceof Selector) {
                this.callBlazorModel = false;
                obj.rotateAngle += angle;
                obj.wrapper.rotateAngle += angle;
                var bounds = getBounds(obj.wrapper);
                checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, bounds);
                if (!checkBoundaryConstraints) {
                    obj.rotateAngle -= angle;
                    obj.wrapper.rotateAngle -= angle;
                    return checkBoundaryConstraints;
                }
                var objects = [];
                objects = objects.concat(obj.nodes);
                objects = objects.concat(obj.connectors);
                this.commandHandler.rotateObjects(obj, objects, angle, pivot);
                this.callBlazorModel = true;
            }
            else {
                this.commandHandler.rotateObjects(obj, [obj], angle, pivot);
            }
        }
        if (this.callBlazorModel && (!(this.blazorActions & BlazorAction.interaction))) {
            this.commandHandler.getBlazorOldValues();
        }
        return checkBoundaryConstraints;
    };
    /**
     * Moves the source point of the given connector
     * @param {ConnectorModel} obj - Defines the connector, the end points of which has to be moved
     * @param {number} tx - Defines the distance by which the end point has to be horizontally moved
     * @param {number} ty - Defines the distance by which the end point has to be vertically moved
     */
    Diagram.prototype.dragSourceEnd = function (obj, tx, ty) {
        this.insertBlazorDiagramObjects(obj);
        this.commandHandler.dragSourceEnd(obj, tx, ty);
        if (this.callBlazorModel) {
            this.commandHandler.getBlazorOldValues();
        }
    };
    /**
     * Moves the target point of the given connector
     * @param {ConnectorModel} obj - Defines the connector, the end points of which has to be moved
     * @param {number} tx - Defines the distance by which the end point has to be horizontally moved
     * @param {number} ty - Defines the distance by which the end point has to be vertically moved
     */
    Diagram.prototype.dragTargetEnd = function (obj, tx, ty) {
        this.insertBlazorDiagramObjects(obj);
        this.commandHandler.dragTargetEnd(obj, tx, ty);
        if (this.callBlazorModel) {
            this.commandHandler.getBlazorOldValues();
        }
    };
    /**
     * Finds all the objects that is under the given mouse position
     * @param {PointModel} position - Defines the position, the objects under which has to be found
     * @param {IElement} source - Defines the object, the objects under which has to be found
     */
    Diagram.prototype.findObjectsUnderMouse = function (position, source) {
        return this.eventHandler.findObjectsUnderMouse(position, source);
    };
    /**
     * Finds the object that is under the given mouse position
     * @param {NodeModel[] | ConnectorModel[]}objects - Defines the collection of objects, from which the object has to be found.
     * @param {Actions} action - Defines the action, using which the relevant object has to be found.
     * @param {boolean} inAction - Defines the active state of the action.
     */
    Diagram.prototype.findObjectUnderMouse = function (objects, action, inAction) {
        return this.eventHandler.findObjectUnderMouse(objects, action, inAction);
    };
    /**
     * Finds the object that is under the given active object (Source)
     * @param {NodeModel[] | ConnectorModel[]} objects - Defines the collection of objects, from which the object has to be found.
     * @param {Actions} action - Defines the action, using which the relevant object has to be found.
     * @param {boolean} inAction - Defines the active state of the action.
     */
    Diagram.prototype.findTargetObjectUnderMouse = function (objects, action, inAction, position, source) {
        return this.eventHandler.findTargetUnderMouse(objects, action, inAction, position, source);
    };
    /**
     * Finds the child element of the given object at the given position
     * @param {IElement} obj - Defines the object, the child element of which has to be found
     * @param {PointModel} position - Defines the position, the child element under which has to be found
     * @param {number} padding - Defines the padding, the child element under which has to be found
     */
    Diagram.prototype.findElementUnderMouse = function (obj, position, padding) {
        return this.eventHandler.findElementUnderMouse(obj, position, padding);
    };
    /**
     * Defines the action to be done, when the mouse hovers the given element of the given object
     * @param {NodeModel | ConnectorModel} obj - Defines the object under mouse
     * @param {DiagramElement} wrapper - Defines the target element of the object under mouse
     * @param {PointModel} position - Defines the current mouse position
     * @private
     */
    Diagram.prototype.findActionToBeDone = function (obj, wrapper, position, target) {
        return this.eventHandler.findActionToBeDone(obj, wrapper, position, target);
    };
    /**
     * Returns the tool that handles the given action
     * @param {string} action - Defines the action that is going to be performed
     */
    Diagram.prototype.getTool = function (action) {
        var tool;
        var getCustomTool = getFunction(this.getCustomTool);
        if (getCustomTool) {
            tool = getCustomTool(action);
            if (tool) {
                return tool;
            }
        }
        return this.eventHandler.getTool(action);
    };
    /**
     * Defines the cursor that corresponds to the given action
     * @param {string} action - Defines the action that is going to be performed
     */
    Diagram.prototype.getCursor = function (action, active) {
        var cursor;
        var getCustomCursor = getFunction(this.getCustomCursor);
        if (getCustomCursor) {
            cursor = getCustomCursor(action, active);
            if (cursor) {
                return cursor;
            }
        }
        if (this.customCursor.length) {
            for (var i = 0; i < this.customCursor.length; i++) {
                if (this.customCursor[i].action === action) {
                    return this.customCursor[i].cursor;
                }
            }
        }
        return this.eventHandler.getCursor(action);
    };
    /**
     * Initializes the undo redo actions
     * @private
     */
    Diagram.prototype.initHistory = function () {
        if (this.undoRedoModule) {
            this.undoRedoModule.initHistory(this);
        }
    };
    /**
     * Adds the given change in the diagram control to the track
     * @param {HistoryEntry} entry - Defines the entry/information about a change in diagram
     */
    Diagram.prototype.addHistoryEntry = function (entry) {
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo) && !this.currentSymbol) {
            if (entry.undoObject && entry.undoObject.id === 'helper') {
                return;
            }
            this.undoRedoModule.addHistoryEntry(entry, this);
            if (entry.type !== 'StartGroup' && entry.type !== 'EndGroup') {
                this.historyChangeTrigger(entry, 'CustomAction');
            }
        }
    };
    /**
     * Adds the given custom change in the diagram control to the track
     * @param {HistoryEntry} entry - Defines the entry/information about a change in diagram
     */
    Diagram.prototype.addCustomHistoryEntry = function (entry) {
        if (isBlazor() && this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            entry.type = undefined;
            entry.category = 'External';
            this.undoRedoModule.addHistoryEntry(entry, this);
        }
    };
    /** @private */
    Diagram.prototype.historyChangeTrigger = function (entry, action) {
        var change = {};
        var oldValue = 'oldValue';
        var newValue = 'newValue';
        var type = 'type';
        var entryType = 'entryType';
        var source = [];
        if (entry.category === 'Internal') {
            if (entry && entry.redoObject && ((entry.redoObject.nodes) instanceof Array) &&
                ((entry.redoObject.connectors) instanceof Array)) {
                source = entry.redoObject.nodes.concat(entry.redoObject.connectors);
            }
            else {
                if (entry.redoObject) {
                    source.push(entry.redoObject);
                }
            }
            change[type] = entry.type;
            if (isBlazor()) {
                change[entryType] = entry.type;
            }
            switch (entry.type) {
                case 'PositionChanged':
                    change[oldValue] = {
                        offsetX: entry.undoObject.offsetX,
                        offsetY: entry.undoObject.offsetY
                    };
                    change[newValue] = {
                        offsetX: entry.redoObject.offsetX,
                        offsetY: entry.redoObject.offsetY
                    };
                    break;
                case 'RotationChanged':
                    change[oldValue] = { rotateAngle: entry.undoObject.rotateAngle };
                    change[newValue] = { rotateAngle: entry.redoObject.rotateAngle };
                    break;
                case 'SizeChanged':
                    change[oldValue] = {
                        offsetX: entry.undoObject.offsetX, offsetY: entry.undoObject.offsetY,
                        width: entry.undoObject.width, height: entry.undoObject.height
                    };
                    change[newValue] = {
                        offsetX: entry.redoObject.offsetX, offsetY: entry.redoObject.offsetY,
                        width: entry.redoObject.width, height: entry.redoObject.height
                    };
                    break;
                case 'CollectionChanged':
                    change[entry.changeType] = source;
                    break;
                case 'ConnectionChanged':
                    change[oldValue] = {
                        offsetX: entry.undoObject.offsetX,
                        offsetY: entry.undoObject.offsetY
                    };
                    change[newValue] = {
                        offsetX: entry.redoObject.offsetX,
                        offsetY: entry.redoObject.offsetY
                    };
                    break;
            }
            var arg = void 0;
            arg = {
                cause: entry.category, source: cloneBlazorObject(source), change: cloneBlazorObject(change),
                action: action
            };
            if (isBlazor()) {
                arg = {
                    cause: entry.category, change: cloneBlazorObject(change),
                    source: { connectors: undefined, nodes: undefined }, action: action
                };
                var sourceValue = arg.source;
                sourceValue.connectors = [];
                sourceValue.nodes = [];
                var object = void 0;
                for (var i = 0; i < source.length; i++) {
                    object = cloneBlazorObject(source[i]);
                    (getObjectType(source[i]) === Connector) ?
                        (sourceValue.connectors.push(object)) : (sourceValue.nodes.push(object));
                }
                arg.source = sourceValue;
            }
            if (source.length) {
                this.triggerEvent(DiagramEvent.historyChange, arg);
            }
        }
    };
    /**
     * Starts grouping the actions that will be undone/restored as a whole
     */
    Diagram.prototype.startGroupAction = function () {
        var entry = { type: 'StartGroup', category: 'Internal' };
        if (!(this.diagramActions & DiagramAction.UndoRedo)) {
            this.addHistoryEntry(entry);
        }
    };
    /**
     * Closes grouping the actions that will be undone/restored as a whole
     */
    Diagram.prototype.endGroupAction = function () {
        var entry = { type: 'EndGroup', category: 'Internal' };
        if (!(this.diagramActions & DiagramAction.UndoRedo)) {
            this.addHistoryEntry(entry);
        }
    };
    /**
     * Restores the last action that is performed
     */
    Diagram.prototype.undo = function () {
        this.canEnableBlazorObject = true;
        this.callBlazorModel = false;
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            this.undoRedoModule.undo(this);
        }
        this.commandHandler.getBlazorOldValues();
        this.callBlazorModel = true;
        this.canEnableBlazorObject = false;
    };
    /**
     * Restores the last undone action
     */
    Diagram.prototype.redo = function () {
        this.canEnableBlazorObject = true;
        this.callBlazorModel = false;
        if (this.undoRedoModule && (this.constraints & DiagramConstraints.UndoRedo)) {
            this.undoRedoModule.redo(this);
        }
        this.commandHandler.getBlazorOldValues();
        this.callBlazorModel = true;
        this.canEnableBlazorObject = false;
    };
    Diagram.prototype.getBlazorDiagramObjects = function (objects) {
        if (objects) {
            for (var j = 0; j < objects.length; j++) {
                this.insertBlazorDiagramObjects(objects[j]);
            }
        }
        else {
            this.insertBlazorDiagramObjects(this.selectedItems);
        }
        this.callBlazorModel = false;
        this.canEnableBlazorObject = true;
    };
    /**
     * Aligns the group of objects to with reference to the first object in the group
     * @param {NodeModel[] | ConnectorModel[]} objects - Defines the objects that have to be aligned
     * @param {AlignmentOptions}option - Defines the factor, by which the objects have to be aligned
     */
    Diagram.prototype.align = function (option, objects, type) {
        this.getBlazorDiagramObjects(objects);
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.align(objects, option, (type ? type : 'Object'));
        this.commandHandler.getBlazorOldValues();
        this.callBlazorModel = true;
        this.canEnableBlazorObject = false;
    };
    /**
     * Arranges the group of objects with equal intervals, but within the group of objects
     * @param {DistributeOptions} objects - Defines the objects that have to be equally spaced
     * @param {NodeModel[] | ConnectorModel[]} option - Defines the factor to distribute the shapes
     */
    Diagram.prototype.distribute = function (option, objects) {
        this.getBlazorDiagramObjects(objects);
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.distribute(objects, option);
        this.commandHandler.getBlazorOldValues();
        this.canEnableBlazorObject = false;
        this.callBlazorModel = true;
    };
    /**
     * Scales the given objects to the size of the first object in the group
     * @param {NodeModel[] | ConnectorModel[]}objects - Defines the collection of objects that have to be scaled
     * @param {SizingOptions} option - Defines whether the node has to be horizontally scaled, vertically scaled or both
     */
    Diagram.prototype.sameSize = function (option, objects) {
        this.getBlazorDiagramObjects(objects);
        if (!objects) {
            objects = [];
            objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        }
        this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
        this.commandHandler.sameSize(objects, option);
        this.commandHandler.getBlazorOldValues();
        this.canEnableBlazorObject = false;
        this.callBlazorModel = true;
    };
    Diagram.prototype.updateBlazorDiagramProperties = function (attribute, canCall) {
        if (isBlazor() && !canCall) {
            this.enableServerDataBinding(false);
            for (var i = 0; i < attribute.length; i++) {
                this.oldDiagramObject[attribute[i]] = cloneObject(this[attribute[i]]);
            }
        }
        if (canCall) {
            this.commandHandler.getDiagramOldValues(this.oldDiagramObject, attribute);
        }
    };
    Diagram.prototype.getZoomingAttribute = function () {
        var attribute = [];
        attribute.push('scrollSettings');
        attribute.push('snapSettings');
        return attribute;
    };
    /**
     * Scales the diagram control by the given factor
     * @param {number} factor - Defines the factor by which the diagram is zoomed
     * @param {PointModel} focusedPoint - Defines the point with respect to which the diagram has to be zoomed
     */
    Diagram.prototype.zoom = function (factor, focusedPoint) {
        var attribute = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.zoom(factor, 0, 0, focusedPoint);
        if (!(this.blazorActions & BlazorAction.interaction)) {
            this.updateBlazorDiagramProperties(attribute, true);
        }
    };
    /**
     * Scales the diagram control by the given factor
     * @param {ZoomOptions} options - used to define the zoom factor, focus point and zoom type.
     *
     */
    Diagram.prototype.zoomTo = function (options) {
        var attribute = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        var factor = options.zoomFactor ? options.zoomFactor : 0.2;
        factor = options.type === 'ZoomOut' ? 1 / (1 + factor) : (1 + factor);
        this.scroller.zoom(factor, 0, 0, options.focusPoint);
        this.updateBlazorDiagramProperties(attribute, true);
    };
    /**
     * Pans the diagram control to the given horizontal and vertical offsets
     * @param {number} horizontalOffset - Defines the horizontal distance to which the diagram has to be scrolled
     * @param {number} verticalOffset - Defines the vertical distance to which the diagram has to be scrolled
     */
    Diagram.prototype.pan = function (horizontalOffset, verticalOffset, focusedPoint) {
        var attribute = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.setCursor('grabbing');
        this.scroller.zoom(1, horizontalOffset, verticalOffset, focusedPoint);
        this.updateBlazorDiagramProperties(attribute, true);
    };
    /**
     * Resets the zoom and scroller offsets to default values
     */
    Diagram.prototype.reset = function () {
        var attribute = this.getZoomingAttribute();
        this.updateBlazorDiagramProperties(attribute);
        this.scroller.zoom(1 / this.scroller.currentZoom, -this.scroller.horizontalOffset, -this.scroller.verticalOffset, { x: 0, y: 0 });
        this.updateBlazorDiagramProperties(attribute, true);
    };
    /**
     * Resets the segments of the connectors
     */
    Diagram.prototype.resetSegments = function () {
        var previousConnectorObject = [];
        var updateConnectorObject = [];
        var changeConnectors = [];
        if (isBlazor()) {
            for (var _i = 0, _a = this.connectors; _i < _a.length; _i++) {
                var obj = _a[_i];
                previousConnectorObject.push(cloneObject(obj, undefined, undefined, true));
            }
        }
        if (this.constraints & DiagramConstraints.LineRouting && this.lineRoutingModule) {
            this.lineRoutingModule.lineRouting(this);
        }
        else {
            this.protectPropertyChange(true);
            var connector = void 0;
            for (var i = 0; i < this.connectors.length; i++) {
                connector = this.connectors[i];
                connector.segments = [];
                this.connectorPropertyChange(connector, {}, { segments: connector.segments });
            }
            this.protectPropertyChange(false);
        }
        if (isBlazor()) {
            for (var _b = 0, _c = this.connectors; _b < _c.length; _b++) {
                var obj = _c[_b];
                updateConnectorObject.push(cloneObject(obj, undefined, undefined, true));
            }
            this.commandHandler.getObjectChanges(previousConnectorObject, updateConnectorObject, changeConnectors);
            var blazorInterop = 'sfBlazor';
            var blazor = 'Blazor';
            var diagramObject = { nodes: [], connectors: changeConnectors };
            if (window && window[blazor]) {
                var obj = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': diagramObject };
                window[blazorInterop].updateBlazorProperties(obj, this);
            }
        }
    };
    /** @private */
    Diagram.prototype.setBlazorDiagramProps = function (arg) {
        var attribute = this.getZoomingAttribute();
        if (arg) {
            this.updateBlazorDiagramProperties(attribute);
        }
        else {
            this.updateBlazorDiagramProperties(attribute, true);
        }
    };
    /** @private */
    Diagram.prototype.triggerEvent = function (eventName, args) {
        return __awaiter(this, void 0, void 0, function () {
            var eventArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (args) {
                            this.updateEventValue(args);
                        }
                        return [4 /*yield*/, this.trigger(DiagramEvent[eventName], args)];
                    case 1:
                        eventArgs = _a.sent();
                        if (isBlazor() && typeof eventArgs === 'string') {
                            eventArgs = JSON.parse(eventArgs);
                        }
                        return [2 /*return*/, eventArgs];
                }
            });
        });
    };
    Diagram.prototype.updateEventValue = function (args) {
        var element = args.element;
        if (args.element && element instanceof Selector && (element.nodes.length + element.connectors.length === 1)) {
            args.element = (element.nodes.length === 1) ? element.nodes[0] : element.connectors[0];
        }
    };
    /**
     * Adds the given node to the lane
     * @deprecated
     */
    Diagram.prototype.addNodeToLane = function (node, swimLane, lane) {
        if (this.nameTable[swimLane]) {
            var swimlaneNode = this.nameTable[swimLane];
            this.protectPropertyChange(true);
            if (this.undoRedoModule) {
                this.historyManager.startGroupAction();
            }
            if (!this.nameTable[node.id]) {
                node.offsetX = swimlaneNode.wrapper.bounds.width + swimlaneNode.wrapper.bounds.x;
                node.offsetY = swimlaneNode.wrapper.bounds.height + swimlaneNode.wrapper.bounds.y;
                node = this.add(node);
            }
            node.parentId = '';
            if (!swimlaneNode.shape.phases.length) {
                var laneId = swimLane + lane + '0';
                if (this.nameTable[laneId]) {
                    addChildToContainer(this, this.nameTable[laneId], node, undefined, true);
                    updateLaneBoundsAfterAddChild(this.nameTable[laneId], swimlaneNode, node, this);
                }
            }
            else {
                for (var i = 0; i < swimlaneNode.shape.phases.length; i++) {
                    var laneId = swimLane + lane + i;
                    if (this.nameTable[laneId] && this.nameTable[laneId].isLane) {
                        var laneNode = this.nameTable[laneId].wrapper.bounds;
                        var focusPoint = {
                            x: laneNode.x +
                                (laneNode.x - swimlaneNode.wrapper.bounds.x + node.margin.left + (node.wrapper.bounds.width / 2)),
                            y: laneNode.y + swimlaneNode.wrapper.bounds.y - node.margin.top
                        };
                        if (swimlaneNode.shape.orientation === 'Horizontal') {
                            focusPoint.y = laneNode.y;
                        }
                        else {
                            focusPoint.x = laneNode.x;
                            var laneHeaderId = this.nameTable[laneId].parentId +
                                swimlaneNode.shape.lanes[0].id + '_0_header';
                            focusPoint.y = laneNode.y +
                                (swimlaneNode.wrapper.bounds.y - this.nameTable[laneHeaderId].wrapper.bounds.height +
                                    node.margin.top + (node.wrapper.bounds.height / 2));
                        }
                        if (laneNode.containsPoint(focusPoint) ||
                            (laneId === swimLane + lane + (swimlaneNode.shape.phases.length - 1))) {
                            addChildToContainer(this, this.nameTable[laneId], node, undefined, true);
                            updateLaneBoundsAfterAddChild(this.nameTable[laneId], swimlaneNode, node, this);
                            break;
                        }
                    }
                }
            }
            if (this.undoRedoModule) {
                this.historyManager.endGroupAction();
            }
            this.protectPropertyChange(false);
        }
        this.updateDiagramElementQuad();
    };
    /**
     * Shows tooltip for corresponding diagram object
     * @param {NodeModel | ConnectorModel} obj - Defines the object for that tooltip has to be shown
     */
    Diagram.prototype.showTooltip = function (obj) {
        if (obj && obj.id && !obj.wrapper) {
            obj = this.nameTable[obj.id];
        }
        var bounds = getBounds(obj.wrapper);
        var position = { x: 0, y: 0 };
        var content = obj.tooltip.content ?
            obj.tooltip.content : 'X:' + Math.round(bounds.x) + ' ' + 'Y:' + Math.round(bounds.y);
        if (obj && obj.tooltip.openOn === 'Custom') {
            if (obj instanceof Node) {
                position = { x: obj.offsetX + (obj.width / 2), y: obj.offsetY + (obj.height / 2) };
            }
            else {
                position = { x: obj.targetPoint.x, y: obj.targetPoint.x };
            }
            this.commandHandler.showTooltip(obj, position, content, 'SelectTool', true);
        }
    };
    /**
     * hides tooltip for corresponding diagram object
     * @param {NodeModel | ConnectorModel} obj - Defines the object for that tooltip has to be hide
     */
    Diagram.prototype.hideTooltip = function (obj) {
        if (obj && obj.tooltip.openOn === 'Custom') {
            this.tooltipObject.close();
        }
    };
    /**
     * Adds the given node to diagram control
     * @param {NodeModel} obj - Defines the node that has to be added to diagram
     * @blazorArgsType obj|DiagramNode
     */
    Diagram.prototype.addNode = function (obj, group) {
        return this.add(obj, group);
    };
    /**
     * Adds the given diagram object to the group.
     * @param {NodeModel} Group - defines where the diagram object to be added.
     * @param {string | NodeModel | ConnectorModel} Child - defines the diagram object to be added to the group
     * @blazorArgsType obj|DiagramNode
     */
    Diagram.prototype.addChildToGroup = function (group, child) {
        var severDataBind = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        var propChange = this.isProtectedOnChange;
        this.protectPropertyChange(true);
        group = this.getObject(group.id);
        if (isBlazor()) {
            this.insertValue(group, true);
        }
        var isHistoryAdded = (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group) &&
            !(this.diagramActions & DiagramAction.PreventHistory));
        if (isHistoryAdded) {
            this.startGroupAction();
        }
        var id = this.addChild(group, child);
        if (isHistoryAdded) {
            var childTable = {};
            childTable[id] = cloneObject(this.getObject(id));
            var entry = {
                type: 'AddChildToGroupNode', changeType: 'Insert', undoObject: cloneObject(group),
                redoObject: cloneObject(group), category: 'Internal', objectId: id, childTable: childTable
            };
            this.addHistoryEntry(entry);
            this.endGroupAction();
        }
        this.protectPropertyChange(propChange);
        this.enableServerDataBinding(severDataBind);
        this.updateSelector();
        if (isBlazor() && isHistoryAdded) {
            this.commandHandler.getBlazorOldValues();
        }
    };
    /**
     * Will return the history stack values
     * @param {boolean} isUndoStack - returns the history stack values
     */
    Diagram.prototype.getHistoryStack = function (isUndoStack) {
        var temp;
        var historyEntry = [];
        temp = isUndoStack ? this.historyManager.undoStack : this.historyManager.redoStack;
        if (this.historyManager.stackLimit !== undefined) {
            for (var i = temp.length - 1; i >= 0; i--) {
                historyEntry.push(temp[i]);
                if (historyEntry.length > this.historyManager.stackLimit) {
                    return historyEntry;
                }
            }
        }
        else {
            historyEntry = temp;
        }
        return historyEntry;
    };
    /* tslint:disable */
    /**
     * Return the edges for the given node
     * @deprecated
     * @param {Object} args - return the edge of the given node
     */
    Diagram.prototype.getEdges = function (args) {
        return args['outEdge'] ? this.nameTable[args['id']].outEdges : this.nameTable[args['id']].inEdges;
    };
    /* tslint:enable */
    /**
     * Returns the parent id for the node
     * @deprecated
     * @param {string} id - returns the parent id
     */
    Diagram.prototype.getParentId = function (id) {
        return this.nameTable[id].parentId;
    };
    /**
     * Adds the given connector to diagram control
     * @param {ConnectorModel} obj - Defines the connector that has to be added to diagram
     * @blazorArgsType obj|DiagramConnector
     */
    Diagram.prototype.addConnector = function (obj) {
        return this.add(obj);
    };
    /** @private */
    Diagram.prototype.UpdateBlazorDiagramModelCollection = function (obj, copiedObject, multiSelectDelete, isBlazorGroupUpdate) {
        if (!(this.blazorActions & BlazorAction.ClearObject)) {
            var blazorInterop = 'sfBlazor';
            var blazor = 'Blazor';
            if (window && window[blazor]) {
                var updatedModel = void 0;
                var connectorModelCollection = [];
                var updatedModelCollection = [];
                var objectTypeCollection = [];
                var removalIndexCollection = [];
                if (isBlazorGroupUpdate && !copiedObject) {
                    for (var i = 0; i < this.blazorAddorRemoveCollection.length; i++) {
                        objectTypeCollection.push(getObjectType(this.blazorAddorRemoveCollection[i]) === Connector ? 'Connector' : 'Node');
                        updatedModel = cloneBlazorObject(this.blazorAddorRemoveCollection[i]);
                        updatedModelCollection.push(updatedModel);
                        removalIndexCollection = this.blazorRemoveIndexCollection;
                    }
                }
                else if ((!this.isServerUpdate || multiSelectDelete)) {
                    this.isServerUpdate = true;
                    var updatedModel_1 = cloneBlazorObject(obj);
                    var elements = [];
                    var removalIndex = void 0;
                    var tempNode = [];
                    if (!copiedObject) {
                        if (!multiSelectDelete) {
                            tempNode = this.commandHandler.getChildren(obj, elements);
                        }
                        else {
                            tempNode = multiSelectDelete;
                        }
                        for (var i = 0; i < tempNode.length; i++) {
                            updatedModel_1 = cloneBlazorObject(tempNode[i]);
                            updatedModelCollection.push(updatedModel_1);
                            if (getObjectType(tempNode[i]) === Connector) {
                                removalIndex = this.connectors.indexOf(tempNode[i]);
                            }
                            else {
                                removalIndex = this.nodes.indexOf(tempNode[i]);
                            }
                            removalIndexCollection.push(removalIndex);
                            objectTypeCollection.push(getObjectType(tempNode[i]) === Connector ? 'Connector' : 'Node');
                        }
                        if (!multiSelectDelete) {
                            updatedModelCollection.push(cloneBlazorObject(obj));
                            removalIndexCollection.push(this.nodes.indexOf(obj));
                            objectTypeCollection.push(getObjectType(obj) === Connector ? 'Connector' : 'Node');
                        }
                    }
                    if (copiedObject && copiedObject.length > 0) {
                        for (var i = 0; i < copiedObject.length; i++) {
                            updatedModel_1 = cloneBlazorObject(copiedObject[i]);
                            var isNode = (copiedObject[i] instanceof Node) ? true : false;
                            isNode ? updatedModelCollection.push(updatedModel_1) : connectorModelCollection.push(updatedModel_1);
                            objectTypeCollection.push(getObjectType(copiedObject[i]) === Connector ? 'Connector' : 'Node');
                        }
                    }
                    this.isServerUpdate = false;
                }
                var dgmObj = {
                    'methodName': 'UpdateBlazorDiagramObjects',
                    'diagramobj': {
                        'nodeObj': JSON.stringify(updatedModelCollection),
                        'ObjectType': objectTypeCollection,
                        'removalIndex': copiedObject ? undefined : removalIndexCollection,
                        'isMultipleObjects': true, 'annotationIndex': undefined,
                        'connectorObj': JSON.stringify(connectorModelCollection)
                    }
                };
                window[blazorInterop].updateBlazorProperties(dgmObj, this);
                if (isBlazorGroupUpdate && !copiedObject) {
                    this.blazorAddorRemoveCollection = [];
                    this.blazorRemoveIndexCollection = [];
                }
            }
        }
    };
    /**
     * @private
     */
    Diagram.prototype.UpdateBlazorDiagramModel = function (obj, objectType, removalIndex, annotationNodeIndex) {
        if (!(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
            var blazorInterop = 'sfBlazor';
            var blazor = 'Blazor';
            if (window && window[blazor] && !this.isServerUpdate && !(this.diagramActions & DiagramAction.Clear)) {
                var updatedModel = cloneBlazorObject(obj);
                var dgmObj = {
                    'methodName': 'UpdateBlazorDiagramObjects',
                    'diagramobj': {
                        'nodeObj': JSON.stringify(updatedModel),
                        'ObjectType': objectType, 'removalIndex': removalIndex,
                        'isMultipleObjects': false,
                        'annotationIndex': annotationNodeIndex, 'connectorObj': undefined
                    }
                };
                window[blazorInterop].updateBlazorProperties(dgmObj, this);
            }
        }
    };
    Diagram.prototype.UpdateBlazorLabelOrPortObjects = function (obj, objectType, removalIndex, nodeIndex) {
        var blazorInterop = 'sfBlazor';
        var blazor = 'Blazor';
        if (window && window[blazor] && obj.length > 0 && !this.isServerUpdate && !(this.diagramActions & DiagramAction.Clear)) {
            var updatedModelCollection = [];
            var objectTypeCollection = [];
            var nodeIndexCollection = [];
            for (var i = 0; i < obj.length; i++) {
                updatedModelCollection.push(cloneBlazorObject(obj[i]));
                objectTypeCollection.push(objectType);
                nodeIndexCollection.push(nodeIndex);
            }
            var dgmObj = {
                'methodName': 'UpdateBlazorDiagramObjects',
                'diagramobj': {
                    'nodeObj': JSON.stringify(updatedModelCollection),
                    'ObjectType': objectTypeCollection, 'removalIndex': removalIndex,
                    'isMultipleObjects': true,
                    'annotationIndex': nodeIndexCollection,
                    'connectorObj': null,
                    'portIndex': (objectType === 'Port') ? nodeIndexCollection : []
                }
            };
            window[blazorInterop].updateBlazorProperties(dgmObj, this);
        }
    };
    /**
     * @private
     */
    Diagram.prototype.addBlazorDiagramObjects = function () {
        var nodesCollection = [];
        var connectorCollection = [];
        if (this.dataBindingModule && !(this.realActions & RealAction.PreventDataInit)) {
            for (var i = 0; i < this.nodes.length; i++) {
                nodesCollection.push(cloneObject(this.nodes[i], undefined, undefined, true));
            }
            for (var i = 0; i < this.connectors.length; i++) {
                connectorCollection.push(cloneObject(this.connectors[i], undefined, undefined, true));
            }
        }
        var blazorInterop = 'sfBlazor';
        var blazor = 'Blazor';
        if (window && window[blazor]) {
            var obj = {
                'methodName': 'AddBlazorObjects',
                'diagramobj': { 'nodeObj': JSON.stringify(nodesCollection), 'isConnector': false }
            };
            window[blazorInterop].updateBlazorProperties(obj, this);
            obj = {
                'methodName': 'AddBlazorObjects',
                'diagramobj': { 'nodeObj': JSON.stringify(connectorCollection), 'isConnector': true }
            };
            window[blazorInterop].updateBlazorProperties(obj, this);
        }
    };
    Diagram.prototype.removeNodeEdges = function (elementId, id, isOutEdges) {
        var node = this.nameTable[elementId];
        var edges = isOutEdges ? node.outEdges : node.inEdges;
        if (edges.length > 0) {
            for (var i = 0; i < edges.length; i++) {
                if (edges[i] === id) {
                    edges.splice(i, 1);
                }
            }
        }
    };
    /** @private */
    Diagram.prototype.insertBlazorConnector = function (obj) {
        if (isBlazor() && (obj instanceof Connector)) {
            if (obj.sourceID && this.nameTable[obj.sourceID]) {
                this.insertValue(cloneObject(this.nameTable[obj.sourceID]), true);
            }
            if (obj.targetID && this.nameTable[obj.targetID]) {
                this.insertValue(cloneObject(this.nameTable[obj.targetID]), true);
            }
        }
    };
    /* tslint:disable */
    /**
     * Adds the given object to diagram control
     * @param {NodeModel | ConnectorModel} obj - Defines the object that has to be added to diagram
     */
    Diagram.prototype.add = function (obj, group) {
        var newObj;
        var propertyChangeValue = this.isProtectedOnChange;
        this.protectPropertyChange(true);
        if (obj) {
            obj = cloneObject(obj);
            var args = void 0;
            args = {
                element: obj, cause: this.diagramActions, state: 'Changing', type: 'Addition', cancel: false
            };
            if (this.parentObject) {
                args.parentId = this.parentObject.id;
            }
            if (isBlazor()) {
                args = getCollectionChangeEventArguements(args, obj, 'Changing', 'Addition');
            }
            if (obj.id !== 'helper' && !(this.diagramActions & DiagramAction.PreventCollectionChangeOnDragOver)) {
                this.triggerEvent(DiagramEvent.collectionChange, args);
            }
            if (args.cancel && this.drawingObject) {
                this.removeElements(args.element);
                this.tooltipObject.close();
                if (getObjectType(args.element) === Connector) {
                    if (args.element.sourceID) {
                        this.removeNodeEdges(args.element.sourceID, args.element.id, true);
                    }
                    if (args.element.targetID) {
                        this.removeNodeEdges(args.element.targetID, args.element.id, false);
                    }
                }
            }
            this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
            obj.id = obj.id || randomId();
            var layers = this.activeLayer;
            if (!args.cancel && !layers.lock) {
                if (layers.objects.indexOf(obj.id) < 0 && !layers.lock) {
                    if (!layers.visible) {
                        layers.visible = true;
                        this.dataBind();
                    }
                    layers.objects.push(obj.id);
                }
                if (getObjectType(obj) === Connector) {
                    newObj = new Connector(this, 'connectors', obj, true);
                    newObj.status = 'New';
                    updateDefaultValues(newObj, obj, this.connectorDefaults);
                    this.connectors.push(newObj);
                    this.initObject(newObj);
                    if (isBlazor()) {
                        if ((this.blazorActions & BlazorAction.GroupingInProgress)) {
                            this.blazorAddorRemoveCollection.push(newObj);
                        }
                        else if (this.blazorAddorRemoveCollection.length > 0) {
                            this.isServerUpdate = false;
                            this.blazorAddorRemoveCollection.push(newObj);
                            this.UpdateBlazorDiagramModelCollection(undefined, this.blazorAddorRemoveCollection, undefined, true);
                            this.blazorAddorRemoveCollection = [];
                            this.commandHandler.getBlazorOldValues();
                        }
                        else if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                            this.UpdateBlazorDiagramModel(newObj, "Connector");
                            this.commandHandler.getBlazorOldValues();
                        }
                    }
                    if (obj.visible === false) {
                        this.updateElementVisibility(newObj.wrapper, newObj, obj.visible);
                    }
                    this.updateEdges(newObj);
                    this.insertBlazorConnector(newObj);
                }
                else {
                    newObj = new Node(this, 'nodes', obj, true);
                    updateDefaultValues(newObj, obj, this.nodeDefaults);
                    newObj.parentId = obj.parentId;
                    newObj.umlIndex = obj.umlIndex;
                    newObj.status = 'New';
                    this.nodes.push(newObj);
                    this.initObject(newObj, layers, undefined, group);
                    if (isBlazor()) {
                        if ((this.blazorActions & BlazorAction.GroupingInProgress)) {
                            this.blazorAddorRemoveCollection.push(newObj);
                        }
                        else if (this.blazorAddorRemoveCollection.length > 0) {
                            this.blazorAddorRemoveCollection.push(newObj);
                            this.isServerUpdate = false;
                            this.UpdateBlazorDiagramModelCollection(undefined, this.blazorAddorRemoveCollection, undefined, true);
                            this.commandHandler.getBlazorOldValues();
                            this.blazorAddorRemoveCollection = [];
                        }
                        else if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                            this.UpdateBlazorDiagramModel(newObj, "Node");
                            this.commandHandler.getBlazorOldValues();
                        }
                    }
                    this.updateTemplate();
                    if (this.bpmnModule) {
                        if (newObj.shape.annotations && newObj.shape.annotations.length !== 0) {
                            for (var _i = 0, _a = this.bpmnModule.getTextAnnotationConn(newObj); _i < _a.length; _i++) {
                                var obj_1 = _a[_i];
                                this.initConnectors(obj_1, layers, false);
                            }
                        }
                        if (newObj.shape.activity && newObj.shape.activity.subProcess.processes &&
                            newObj.shape.activity.subProcess.processes.length) {
                            this.bpmnModule.updateDocks(newObj, this);
                        }
                    }
                    if (this.lineRoutingModule && (this.constraints & DiagramConstraints.LineRouting)) {
                        var objects = this.spatialSearch.findObjects(newObj.wrapper.outerBounds);
                        for (var i = 0; i < objects.length; i++) {
                            var object = objects[i];
                            if (object instanceof Connector) {
                                this.connectorPropertyChange(object, {}, {
                                    sourceID: object.sourceID, targetID: object.targetID, sourcePortID: object.sourcePortID,
                                    targetPortID: object.targetPortID, sourcePoint: object.sourcePoint, targetPoint: object.targetPoint
                                });
                            }
                        }
                    }
                    if (newObj.umlIndex > -1 && obj.parentId && this.nameTable[obj.parentId] &&
                        this.nameTable[obj.parentId].shape.type === 'UmlClassifier') {
                        var parent_2 = this.nameTable[obj.parentId];
                        parent_2.children.splice(newObj.umlIndex, 0, newObj.id);
                        parent_2.wrapper.children.splice(newObj.umlIndex, 0, newObj.wrapper);
                        parent_2.wrapper.measure(new Size());
                        parent_2.wrapper.arrange(parent_2.wrapper.desiredSize);
                        this.updateDiagramObject(parent_2);
                    }
                }
                args = {
                    element: newObj, cause: this.diagramActions, state: 'Changed', type: 'Addition', cancel: false
                };
                if (this.parentObject) {
                    args.parentId = this.parentObject.id;
                }
                if (isBlazor()) {
                    args = getCollectionChangeEventArguements(args, obj, 'Changed', 'Addition');
                }
                if (obj.id !== 'helper' && !(this.diagramActions & DiagramAction.PreventCollectionChangeOnDragOver)) {
                    this.triggerEvent(DiagramEvent.collectionChange, args);
                }
                if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group) &&
                    !(this.diagramActions & DiagramAction.PreventHistory)) {
                    var entry = {
                        type: 'CollectionChanged', changeType: 'Insert', undoObject: cloneObject(obj),
                        redoObject: cloneObject(obj), category: 'Internal'
                    };
                    this.addHistoryEntry(entry);
                }
                this.parentObject = undefined;
                if (this.mode === 'SVG') {
                    this.updateSvgNodes(newObj);
                    this.updateTextElementValue(newObj);
                    this.updateDiagramObject(newObj);
                    if (newObj.shape.activity && newObj.shape.activity.subProcess.processes &&
                        newObj.shape.activity.subProcess.processes.length) {
                        this.updateProcesses(newObj);
                    }
                    this.updateBridging();
                }
            }
        }
        this.protectPropertyChange(propertyChangeValue);
        this.resetDiagramActions(DiagramAction.PublicMethod);
        if (newObj && this.layers.length > 1) {
            this.moveNode(newObj);
        }
        for (var _b = 0, _c = this.views; _b < _c.length; _b++) {
            var temp = _c[_b];
            var view = this.views[temp];
            if (!(view instanceof Diagram)) {
                this.refreshCanvasDiagramLayer(view);
            }
        }
        this.renderReactTemplates();
        return newObj;
    };
    /* tslint:enable */
    Diagram.prototype.updateSvgNodes = function (node) {
        if (node.children) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var j = _a[_i];
                if (this.nameTable[j] && this.nameTable[j].parentId) {
                    var child = getDiagramElement(j + '_groupElement', this.element.id);
                    if (child) {
                        child.parentNode.removeChild(child);
                    }
                }
            }
        }
    };
    /** @private */
    Diagram.prototype.updateProcesses = function (node) {
        if (this.bpmnModule && node && node.shape && node.shape.activity &&
            node.shape.activity.subProcess.processes &&
            node.shape.activity.subProcess.processes.length) {
            var processes = node.shape.activity.subProcess.processes;
            this.moveSvgNode(node.id);
            for (var _i = 0, processes_1 = processes; _i < processes_1.length; _i++) {
                var j = processes_1[_i];
                this.moveSvgNode(j);
                var edges = [];
                edges = edges.concat(this.nameTable[j].outEdges, this.nameTable[j].inEdges);
                for (var i = edges.length - 1; i >= 0; i--) {
                    this.moveSvgNode(edges[i]);
                }
            }
            for (var _a = 0, processes_2 = processes; _a < processes_2.length; _a++) {
                var j = processes_2[_a];
                if (this.nameTable[j].shape.activity.subProcess.processes &&
                    this.nameTable[j].shape.activity.subProcess.processes.length) {
                    this.updateProcesses(this.nameTable[j]);
                }
            }
        }
        else {
            this.moveSvgNode(node.id);
        }
    };
    /** @private */
    Diagram.prototype.moveSvgNode = function (nodeId) {
        var child = getDiagramElement(nodeId + '_groupElement', this.element.id);
        var parent = child.parentElement;
        child.parentNode.removeChild(child);
        parent.appendChild(child);
    };
    /**
     * Adds the given annotation to the given node
     * @param {BpmnAnnotationModel} annotation - Defines the annotation to be added
     * @param {NodeModel} node - Defines the node to which the annotation has to be added
     */
    Diagram.prototype.addTextAnnotation = function (annotation, node) {
        if (this.bpmnModule) {
            var connector = this.bpmnModule.addAnnotation(node, annotation, this);
            this.initConnectors(connector, this.commandHandler.getObjectLayer(node.id), false);
            this.updateDiagramObject(node);
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                var entry = {
                    type: 'CollectionChanged', changeType: 'Insert', undoObject: cloneObject(annotation),
                    redoObject: cloneObject(annotation), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
        }
    };
    /**
     * Splice the InEdge and OutEdge of the for the node with respect to corresponding connectors that is deleting
     */
    Diagram.prototype.spliceConnectorEdges = function (connector, isSource) {
        var node;
        var edges = [];
        var isInEdge;
        node = isSource ? this.nameTable[connector.sourceID] : this.nameTable[connector.targetID];
        if (node) {
            edges = isSource ? node.outEdges : node.inEdges;
            for (var i = edges.length - 1; i >= 0; i--) {
                if (edges[i] === connector.id) {
                    edges.splice(i, 1);
                }
            }
            for (var j = 0; node.ports && j < node.ports.length; j++) {
                isInEdge = isSource ? false : true;
                this.removePortEdges(node, node.ports[j].id, connector.id, isInEdge);
            }
        }
    };
    /**
     * Remove the dependent connectors if the node is deleted
     * @private
     */
    Diagram.prototype.removeDependentConnector = function (node) {
        var connector;
        var edges = [];
        edges = edges.concat(node.outEdges, node.inEdges);
        for (var i = edges.length - 1; i >= 0; i--) {
            connector = this.nameTable[edges[i]];
            if (connector) {
                this.connectorTable[connector.id] = cloneObject(connector);
                this.remove(connector);
            }
        }
    };
    /** @private */
    Diagram.prototype.removeObjectsFromLayer = function (obj) {
        if (obj.children) {
            for (var i = 0; i < obj.children.length; i++) {
                var object = this.nameTable[obj.children[i]];
                if (object) {
                    this.removeObjectsFromLayer(object);
                }
            }
        }
        var layer = this.layers.indexOf(this.commandHandler.getObjectLayer(obj.id));
        var objects = this.layers[layer].objects;
        var objIndex = objects.indexOf(obj.id);
        if (objIndex > -1) {
            if (isSelected(this, obj)) {
                this.unSelect(obj);
            }
            this.layers[layer].objects.splice(objIndex, 1);
            delete this.layers[layer].zIndexTable[this.nameTable[obj.id].zIndex];
        }
    };
    /** @private */
    Diagram.prototype.removeElements = function (currentObj) {
        if (this.mode === 'SVG' || (this.mode === 'Canvas' && currentObj.shape.type === 'Native')) {
            var removeElement_1 = getDiagramElement(currentObj.id + '_groupElement', this.element.id);
            var object = currentObj;
            if ((object).ports && (object).ports.length > 0) {
                for (var i = 0; i < (object).ports.length; i++) {
                    var port = (object).ports[i];
                    var removePort = getDiagramElement(object.id + '_' + port.id + '_groupElement', this.element.id);
                    if (removePort) {
                        removePort.parentNode.removeChild(removePort);
                    }
                }
            }
            if (removeElement_1) {
                removeElement_1.parentNode.removeChild(removeElement_1);
            }
        }
        this.refreshCanvasLayers();
        var children = currentObj.wrapper.children;
        var element;
        var view;
        if (children) {
            for (var i = 0; i < children.length; i++) {
                if (children[i] instanceof DiagramNativeElement || ((children[i].id) && (children[i].id).indexOf('icon_content') > 0)) {
                    if ((children[i].id).indexOf('icon_content') > 0 && this.mode === 'SVG') {
                        element = getDiagramElement(children[i].id + '_shape_groupElement', this.element.id);
                        if (element) {
                            element.parentNode.removeChild(element);
                        }
                        element = getDiagramElement(children[i].id + '_rect_groupElement', this.element.id);
                        if (element) {
                            element.parentNode.removeChild(element);
                        }
                    }
                    for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
                        var elementId = _a[_i];
                        removeElement(children[i].id + '_groupElement', elementId);
                        var nodeIndex = this.scroller.removeCollection.indexOf(currentObj.id);
                        this.scroller.removeCollection.splice(nodeIndex, 1);
                    }
                }
                else if (children[i] instanceof DiagramHtmlElement) {
                    for (var _b = 0, _c = this.views; _b < _c.length; _b++) {
                        var elementId = _c[_b];
                        removeElement(currentObj.id + '_html_element', elementId);
                        removeElement(children[i].id + '_html_element', elementId);
                        this.clearTemplate(['nodeTemplate' + '_' + currentObj.id]);
                        if (children[i].annotationId) {
                            this.clearTemplate(['annotationTemplate' + '_' + currentObj.id + (children[i].annotationId)]);
                        }
                    }
                }
                removeGradient(children[i].id);
            }
        }
    };
    Diagram.prototype.removeCommand = function () {
        this.remove();
    };
    /**
     * Removes the given object from diagram
     * @param {NodeModel | ConnectorModel} obj - Defines the object that has to be removed from diagram
     */
    /* tslint:disable */
    Diagram.prototype.remove = function (obj) {
        var selectedItems = [];
        selectedItems = selectedItems.concat(this.selectedItems.nodes, this.selectedItems.connectors);
        var args;
        var groupAction = false;
        if (obj) {
            obj = this.nameTable[obj.id];
            this.insertBlazorConnector(obj);
            if (obj && obj.shape && obj.shape.type === 'SwimLane') {
                removeSwimLane(this, obj);
            }
            if (obj && (canDelete(obj) || (this.diagramActions & DiagramAction.Clear))) {
                args = {
                    element: obj, cause: this.diagramActions,
                    state: 'Changing', type: 'Removal', cancel: false
                };
                if (isBlazor()) {
                    args = getCollectionChangeEventArguements(args, obj, 'Changing', 'Removal');
                }
                if (!(this.diagramActions & DiagramAction.Clear) && (obj.id !== 'helper')) {
                    this.triggerEvent(DiagramEvent.collectionChange, args);
                }
                if (!args.cancel) {
                    if (this.bpmnModule) {
                        if (this.bpmnModule.checkAndRemoveAnnotations(obj, this)) {
                            this.refreshCanvasLayers();
                            return;
                        }
                    }
                    if ((!(this.diagramActions & DiagramAction.UndoRedo)) && !(this.diagramActions & DiagramAction.PreventHistory) &&
                        (obj instanceof Node || obj instanceof Connector)) {
                        var entry = {
                            type: 'CollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj),
                            redoObject: cloneObject(obj), category: 'Internal'
                        };
                        if (!(this.diagramActions & DiagramAction.Clear)) {
                            if (obj.children && !obj.isLane && !obj.isPhase && obj.children.length > 0 && this.undoRedoModule && this.layout.type === 'None') {
                                this.historyManager.startGroupAction();
                                groupAction = true;
                            }
                        }
                        if (obj instanceof Node) {
                            this.removeDependentConnector(obj);
                        }
                        if (!obj.isLane && !obj.isPhase) {
                            if (!(this.diagramActions & DiagramAction.Clear) && !this.isStackChild(obj)) {
                                this.addHistoryEntry(entry);
                            }
                        }
                    }
                    if (obj.children && !obj.isLane && !obj.isPhase &&
                        (!isBlazor() || !(this.diagramActions & DiagramAction.UndoRedo))) {
                        this.deleteGroup(obj);
                    }
                    if (obj.parentId) {
                        this.deleteChild(obj);
                        if (this.nameTable[obj.parentId] && this.nameTable[obj.parentId].shape.type === 'UmlClassifier') {
                            this.updateDiagramObject(this.nameTable[obj.parentId]);
                            this.updateConnectorEdges(this.nameTable[obj.parentId]);
                        }
                    }
                    var index = void 0;
                    this.diagramActions = this.diagramActions | DiagramAction.PublicMethod;
                    var currentObj = this.nameTable[obj.id];
                    if (currentObj instanceof Node) {
                        if (currentObj.shape.type === 'Bpmn' && this.bpmnModule) {
                            this.bpmnModule.removeBpmnProcesses(currentObj, this);
                        }
                        if (currentObj.isLane || currentObj.isPhase || currentObj.shape.type === 'SwimLane') {
                            var swimLaneNode = (currentObj.isLane || currentObj.isPhase) ?
                                this.nameTable[currentObj.parentId] : this.nameTable[currentObj.id];
                            var grid = swimLaneNode.wrapper.children[0];
                            if (currentObj.isLane) {
                                removeLane(this, currentObj, swimLaneNode);
                            }
                            else if (currentObj.isPhase) {
                                removePhase(this, currentObj, swimLaneNode);
                            }
                        }
                        index = this.nodes.indexOf(currentObj);
                        if (isBlazor() && (obj.id !== 'helper')) {
                            if (this.blazorActions & BlazorAction.GroupingInProgress) {
                                this.blazorRemoveIndexCollection.splice(0, 0, index);
                                this.blazorAddorRemoveCollection.splice(0, 0, obj);
                            }
                            else if (this.blazorAddorRemoveCollection.length > 0) {
                                this.commandHandler.getBlazorOldValues();
                                this.blazorRemoveIndexCollection.splice(0, 0, index);
                                this.blazorAddorRemoveCollection.splice(0, 0, obj);
                                this.UpdateBlazorDiagramModelCollection(undefined, undefined, undefined, true);
                            }
                            else if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                                this.UpdateBlazorDiagramModel(obj, "Node", index);
                            }
                        }
                        if (index !== -1) {
                            this.crudDeleteNodes.push(this.nameTable[currentObj.id]);
                            this.nodes.splice(index, 1);
                            this.updateNodeEdges(currentObj);
                        }
                    }
                    else {
                        index = this.connectors.indexOf(currentObj);
                        if (isBlazor()) {
                            if (this.blazorActions & BlazorAction.GroupingInProgress) {
                                this.blazorAddorRemoveCollection.splice(0, 0, obj);
                                this.blazorRemoveIndexCollection.splice(0, 0, index);
                            }
                            else if (this.blazorAddorRemoveCollection.length > 0) {
                                this.commandHandler.getBlazorOldValues();
                                this.blazorAddorRemoveCollection.splice(0, 0, obj);
                                this.blazorRemoveIndexCollection.splice(0, 0, index);
                                this.UpdateBlazorDiagramModelCollection(undefined, undefined, undefined, true);
                            }
                            else if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                                this.UpdateBlazorDiagramModel(obj, "Connector", index);
                            }
                        }
                        if (index !== -1) {
                            this.crudDeleteNodes.push(this.nameTable[currentObj.id]);
                            this.connectors.splice(index, 1);
                        }
                        this.updateEdges(currentObj);
                        this.spliceConnectorEdges(obj, true);
                        this.spliceConnectorEdges(obj, false);
                    }
                    if ((!this.isServerUpdate) && !(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
                        this.commandHandler.getBlazorOldValues();
                    }
                    if (groupAction) {
                        this.historyManager.endGroupAction();
                    }
                    if (isSelected(this, currentObj)) {
                        this.unSelect(currentObj);
                    }
                    if (!currentObj.isPhase) {
                        this.removeObjectsFromLayer(obj);
                        if (this.currentDrawingObject) {
                            this.currentDrawingObject.wrapper = undefined;
                        }
                        delete this.nameTable[obj.id];
                        if (selectedItems.length > 0 && selectedItems[0].id === currentObj.id && currentObj.parentId) {
                            var parentnode = this.nameTable[currentObj.parentId];
                            if (parentnode && parentnode.isLane && this.nameTable[parentnode.parentId].shape.type === 'SwimLane') {
                                var swimLaneNode = this.nameTable[parentnode.parentId];
                                removeLaneChildNode(this, swimLaneNode, parentnode, currentObj);
                            }
                        }
                        this.removeElements(currentObj);
                        this.updateBridging();
                        if (this.mode !== 'SVG') {
                            this.refreshDiagramLayer();
                        }
                        if (!(this.diagramActions & DiagramAction.Clear)) {
                            this.removeFromAQuad(currentObj);
                            args = {
                                element: obj, cause: this.diagramActions,
                                state: 'Changed', type: 'Removal', cancel: false
                            };
                            if (isBlazor()) {
                                args = getCollectionChangeEventArguements(args, obj, 'Changed', 'Removal');
                            }
                            if (obj.id !== 'helper') {
                                this.triggerEvent(DiagramEvent.collectionChange, args);
                            }
                            this.resetTool();
                        }
                    }
                }
            }
        }
        else if (selectedItems.length > 0) {
            if (this.undoRedoModule) {
                this.historyManager.startGroupAction();
                this.blazorActions |= BlazorAction.GroupingInProgress;
                groupAction = true;
            }
            if (isBlazor() && selectedItems.length > 1) {
                this.clearSelection();
            }
            for (var i = 0; i < selectedItems.length; i++) {
                var node = selectedItems[i];
                if (this.nameTable[selectedItems[i].id]) {
                    if ((selectedItems[i] instanceof Connector) && this.bpmnModule &&
                        this.bpmnModule.textAnnotationConnectors.indexOf(selectedItems[i]) > -1) {
                        this.remove(this.nameTable[selectedItems[i].targetID]);
                        return;
                    }
                    if (isBlazor()) {
                        if (!this.isServerUpdate && selectedItems && selectedItems.length > 1) {
                            this.isServerUpdate = true;
                        }
                        if (selectedItems[i].parentId) {
                            this.insertBlazorDiagramObjects(this.nameTable[selectedItems[i].parentId]);
                        }
                    }
                    this.remove(selectedItems[i]);
                    if (isBlazor() && selectedItems[i].parentId) {
                        this.commandHandler.getBlazorOldValues();
                        this.isServerUpdate = false;
                    }
                }
            }
            if (groupAction) {
                this.blazorActions &= ~BlazorAction.GroupingInProgress;
                this.isServerUpdate = true;
                this.commandHandler.getBlazorOldValues();
                this.UpdateBlazorDiagramModelCollection(undefined, undefined, undefined, true);
                this.historyManager.endGroupAction();
                this.isServerUpdate = false;
            }
            this.clearSelection();
        }
        this.tooltipObject.close();
        if (isBlazor() && selectedItems && selectedItems.length > 0) {
            var check = true;
            for (var k = 0; k < selectedItems.length; k++) {
                if (this.nameTable[selectedItems[k].id]) {
                    check = false;
                }
            }
            if (check) {
                this.isServerUpdate = false;
            }
        }
    };
    /* tslint:enable */
    Diagram.prototype.isStackChild = function (obj) {
        var isstack;
        var parent = this.nameTable[obj.parentId];
        if (obj && obj.parentId && parent.container &&
            (parent.container.type === 'Stack' &&
                this.nameTable[obj.parentId].shape.type !== 'UmlClassifier')) {
            isstack = true;
            var redoElement = {
                sourceIndex: parent.wrapper.children.indexOf(obj.wrapper), source: obj,
                target: undefined, targetIndex: undefined
            };
            var entry = {
                type: 'StackChildPositionChanged', redoObject: {
                    sourceIndex: undefined, source: obj,
                    target: undefined, targetIndex: undefined
                },
                undoObject: redoElement,
                category: 'Internal'
            };
            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                this.addHistoryEntry(entry);
            }
        }
        return isstack;
    };
    /** @private */
    Diagram.prototype.deleteChild = function (node, parentNode) {
        var id;
        parentNode = parentNode ? this.nameTable[parentNode.id] : this.nameTable[node.parentId];
        if (typeof node === 'string') {
            id = node;
        }
        else {
            id = node.id;
        }
        if (parentNode && parentNode.children) {
            for (var i = 0; i < parentNode.children.length; i++) {
                if (parentNode.children[i] === id) {
                    parentNode.children.splice(i, 1);
                    for (var j = 0; j < parentNode.wrapper.children.length; j++) {
                        if (parentNode.wrapper.children[j].id === id) {
                            parentNode.wrapper.children.splice(j, 1);
                        }
                    }
                }
            }
            parentNode.wrapper.measure(new Size());
            parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
        }
    };
    /** @private  */
    Diagram.prototype.addChild = function (node, child, index) {
        var id;
        var parentNode = this.nameTable[node.id];
        if (!parentNode.children) {
            parentNode.children = [];
        }
        if (parentNode.children) {
            if (typeof child === 'string') {
                if (this.nameTable[child]) {
                    id = child;
                }
            }
            else {
                id = child.id = child.id || randomId();
                this.add(child);
            }
            if (id && (!child.umlIndex || child.umlIndex === -1)) {
                var childNode = this.nameTable[id];
                childNode.parentId = parentNode.id;
                if (parentNode.container && parentNode.container.type === 'Stack') {
                    this.updateStackProperty(parentNode, childNode);
                }
                if (index) {
                    parentNode.children.splice(index, 0, id);
                    parentNode.wrapper.children.splice(index, 0, childNode.wrapper);
                }
                else {
                    parentNode.children.push(id);
                    parentNode.wrapper.children.push(childNode.wrapper);
                }
                parentNode.wrapper.measure(new Size());
                parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
                if (!parentNode.isLane) {
                    this.nameTable[node.id].width = parentNode.wrapper.actualSize.width;
                    this.nameTable[node.id].height = parentNode.wrapper.actualSize.height;
                    this.nameTable[node.id].offsetX = parentNode.wrapper.offsetX;
                    this.nameTable[node.id].offsetY = parentNode.wrapper.offsetY;
                }
                if (parentNode.container !== undefined) {
                    childNode.offsetX = childNode.wrapper.offsetX;
                    childNode.offsetY = childNode.wrapper.offsetY;
                }
                if (!parentNode.parentId ||
                    (this.nameTable[parentNode.parentId] &&
                        this.nameTable[parentNode.parentId].shape.type !== 'SwimLane')) {
                    this.updateDiagramObject(parentNode);
                }
            }
        }
        return id;
    };
    /**
     * Clears all nodes and objects in the diagram
     * @deprecated
     */
    Diagram.prototype.clear = function () {
        this.clearObjects();
    };
    Diagram.prototype.clearObjects = function (collection) {
        var objects = [];
        if (!collection) {
            objects = objects.concat(this.nodes);
            objects = objects.concat(this.connectors);
        }
        else {
            objects = collection;
        }
        this.diagramActions = this.diagramActions | DiagramAction.Clear;
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var obj = objects_1[_i];
            if (this.nameTable[obj.id]) {
                this.remove(obj);
            }
        }
        this.diagramActions = this.diagramActions & ~DiagramAction.Clear;
        this.spatialSearch = new SpatialSearch(this.nameTable);
        this.initHistory();
    };
    Diagram.prototype.startEditCommad = function () {
        var laneHeader;
        var node = (this.selectedItems.nodes[0]) ? this.selectedItems.nodes[0] : undefined;
        if (node && node instanceof Node) {
            if (node.isLane && node.parentId) {
                var swimlane = this.nameTable[node.parentId];
                var lanes = swimlane.shape.lanes;
                var canvasId = (node.id.slice(swimlane.id.length));
                var currentParentId = canvasId.substring(0, canvasId.length - 1);
                for (var i = 0; i < lanes.length; i++) {
                    if (node.isLane && currentParentId === lanes[i].id) {
                        laneHeader = this.nameTable[lanes[i].header.id];
                    }
                }
            }
            else if (node.shape.type === 'SwimLane' && node.shape.header && node.shape.hasHeader) {
                var id = node.wrapper.children[0].rows[0].cells[0].children[0].id;
                laneHeader = this.nameTable[id];
            }
        }
        this.startTextEdit(laneHeader);
    };
    /* tslint:disable */
    /**
     * Specified annotation to edit mode
     * @param {NodeModel | ConnectorModel} node - Defines node/connector that contains the annotation to be edited
     * @param {string} id - Defines annotation id to be edited in the node
     */
    Diagram.prototype.startTextEdit = function (node, id) {
        if ((!canZoomPan(this) && !canMultiSelect(this)) || canSingleSelect(this)) {
            this.textEditing = true;
            var transform = this.scroller.transform;
            var scale = canZoomTextEdit(this) ? transform.scale : 1;
            var minWidth = 90;
            var text = void 0;
            var bounds = void 0;
            var attributes = void 0;
            var x = void 0;
            var y = void 0;
            var textWrapper = void 0;
            if (!node) {
                node = (this.selectedItems.nodes[0]) ? this.selectedItems.nodes[0] : this.selectedItems.connectors[0];
            }
            if (node) {
                if (isBlazor()) {
                    var selectedNode = cloneObject(node);
                    if (selectedNode.annotations.length > 0) {
                        this.insertValue(selectedNode, (node instanceof Node) ? true : false);
                    }
                    node = this.nameTable[node.id] || node;
                }
                if (node.shape && node.shape.type === 'UmlClassifier') {
                    node = this.nameTable[node.children[0]];
                }
                var bpmnAnnotation = false;
                if (this.bpmnModule) {
                    textWrapper = this.bpmnModule.getTextAnnotationWrapper(node, id);
                    if (textWrapper) {
                        node = this.nameTable[node.id.split('_textannotation_')[0]];
                    }
                }
                if (!textWrapper) {
                    if (node.shape.type !== 'Text' && node.annotations.length === 0) {
                        if (!(node.constraints & NodeConstraints.ReadOnly)) {
                            this.activeLabel.isGroup = true;
                            this.startGroupAction();
                            this.addLabels(node, [{ id: randomId(), content: '' }]);
                        }
                    }
                    if (!id && ((node.shape.type !== 'Text' && node.annotations.length > 0) || (node.shape.type === 'Text'))) {
                        id = (node.shape.type === 'Text') ? (node.wrapper.children[0].id).split('_')[1] : node.annotations[0].id;
                    }
                    if (id) {
                        textWrapper = this.getWrapper(node.wrapper, id);
                    }
                }
                else {
                    bpmnAnnotation = true;
                }
                if (node && textWrapper && !(textWrapper instanceof DiagramHtmlElement) &&
                    (!enableReadOnly(textWrapper, node) || bpmnAnnotation)) {
                    var style = (textWrapper.style);
                    var maxWidth = void 0;
                    maxWidth = textWrapper.bounds.width < node.wrapper.bounds.width ? textWrapper.bounds.width : node.wrapper.bounds.width;
                    maxWidth = minWidth > maxWidth ? minWidth : maxWidth;
                    var textEditing = document.getElementById(this.element.id + '_editTextBoxDiv');
                    var textArea = document.getElementById(this.element.id + '_editBox');
                    text = textArea ? textArea.value : textWrapper.content;
                    this.activeLabel.text = text;
                    if (!textEditing && !textArea) {
                        textEditing = createHtmlElement('div', {});
                        textArea = createHtmlElement('textarea', {});
                        this.diagramCanvas.appendChild(textEditing);
                        textEditing.appendChild(textArea);
                        textArea.appendChild(document.createTextNode(text));
                    }
                    bounds = measureHtmlText(textWrapper.style, text, undefined, undefined, maxWidth);
                    if (bounds.isEmpty()) {
                        if (node.shape.type !== 'Text') {
                            bounds = new Size(findAnnotation(node, (textWrapper.id).split(node.id + '_')[1]).width || 50, textWrapper.style.fontSize);
                        }
                        else {
                            bounds = new Size((node.width > 50) ? 50 : node.width, textWrapper.style.fontSize);
                        }
                    }
                    if (node.parentId && this.nameTable[node.parentId].shape.type === 'UmlClassifier') {
                        bounds.width = node.wrapper.bounds.width - 20;
                        x = ((((node.wrapper.bounds.center.x + transform.tx) * transform.scale) - (bounds.width / 2) * scale) - 2.5);
                        y = ((((node.wrapper.bounds.center.y + transform.ty) * transform.scale) - (bounds.height / 2) * scale) - 3);
                        textWrapper.style.textAlign = 'Left';
                    }
                    else {
                        bounds.width = Math.max(bounds.width, 50);
                        x = ((((textWrapper.bounds.center.x + transform.tx) * transform.scale) - (bounds.width / 2) * scale) - 2.5);
                        y = ((((textWrapper.bounds.center.y + transform.ty) * transform.scale) - (bounds.height / 2) * scale) - 3);
                    }
                    attributes = {
                        'id': this.element.id + '_editTextBoxDiv', 'style': 'position: absolute' + ';left:' + x + 'px;top:' +
                            y + 'px;width:' + ((bounds.width + 1) * scale) + 'px;height:' + (bounds.height * scale) +
                            'px; containerName:' + node.id + ';'
                    };
                    setAttributeHtml(textEditing, attributes);
                    attributes = {
                        'id': this.element.id + '_editBox', 'style': 'width:' + ((bounds.width + 1) * scale) +
                            'px;height:' + (bounds.height * scale) + 'px;resize: none;outline: none;overflow: hidden;' +
                            ';font-family:' + style.fontFamily +
                            ';font-size:' + (style.fontSize * scale) + 'px;text-align:' +
                            (textWrapper.style.textAlign.toLocaleLowerCase()) + ';', 'class': 'e-diagram-text-edit'
                    };
                    setAttributeHtml(textArea, attributes);
                    textArea.style.fontWeight = (style.bold) ? 'bold' : '';
                    textArea.style.fontStyle = (style.italic) ? 'italic' : '';
                    textArea.style.lineHeight = (style.fontSize * 1.2 + 'px;').toString();
                    textArea.style.textDecoration = (style.textDecoration) ? style.textDecoration : '';
                    this.activeLabel.parentId = node.id;
                    this.activeLabel.id = id;
                    textWrapper.visible = false;
                    this.updateDiagramObject(node);
                    this.diagramActions = this.diagramActions | DiagramAction.TextEdit;
                    if (!this.isTriggerEvent) {
                        EventHandler.add(textArea, 'input', this.eventHandler.inputChange, this.eventHandler);
                        EventHandler.add(textArea, 'focusout', this.focusOutEdit, this);
                        textArea.select();
                    }
                }
            }
        }
    };
    Diagram.prototype.updateConnectorfixedUserHandles = function (connector) {
        if (connector.fixedUserHandles.length) {
            var fixedUserHandleWrapper = void 0;
            for (var _i = 0, _a = connector.fixedUserHandles; _i < _a.length; _i++) {
                var fixedUserHandle = _a[_i];
                fixedUserHandleWrapper = this.getWrapper(connector.wrapper, fixedUserHandle.id);
                connector.updateAnnotation(fixedUserHandle, connector.intermediatePoints, connector.wrapper.bounds, fixedUserHandleWrapper);
            }
        }
        connector.wrapper.measure(new Size(connector.wrapper.width, connector.wrapper.height));
        connector.wrapper.arrange(connector.wrapper.desiredSize);
    };
    /* tslint:enable */
    Diagram.prototype.updateNodeExpand = function (node, visibility) {
        for (var i = 0; i < node.outEdges.length; i++) {
            var connector = this.nameTable[node.outEdges[i]];
            var target = this.nameTable[connector.targetID];
            connector.visible = visibility;
            if (!visibility) {
                this.updateElementVisibility(connector.wrapper, connector, false);
                target.isExpanded = visibility;
            }
            this.updateNodeExpand(target, target.isExpanded);
            target.visible = visibility;
            if (!visibility) {
                this.updateElementVisibility(target.wrapper, target, false);
            }
        }
    };
    Diagram.prototype.updateConnectorAnnotation = function (connector) {
        if (connector.annotations.length) {
            var annotationWrapper = void 0;
            for (var _i = 0, _a = connector.annotations; _i < _a.length; _i++) {
                var annotation = _a[_i];
                annotationWrapper = this.getWrapper(connector.wrapper, annotation.id);
                connector.updateAnnotation(annotation, connector.intermediatePoints, connector.wrapper.bounds, annotationWrapper, (this.diagramActions & DiagramAction.Interactions));
            }
        }
        connector.wrapper.measure(new Size(connector.wrapper.width, connector.wrapper.height));
        connector.wrapper.arrange(connector.wrapper.desiredSize);
    };
    Diagram.prototype.removeChildrenFromLayout = function (nodes) {
        var nodesCollection = [];
        var node;
        var parentId = 'parentId';
        var processId = 'processId';
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (!node[parentId] && !node[processId]) {
                nodesCollection.push(node);
            }
        }
        return nodesCollection;
    };
    /* tslint:disable */
    /**
     * Automatically updates the diagram objects based on the type of the layout
     */
    Diagram.prototype.doLayout = function () {
        var update = false;
        var layout;
        var canDoOverlap = (this.layout.type == "ComplexHierarchicalTree" || this.layout.type === "HierarchicalTree");
        var propChange = this.isProtectedOnChange;
        this.protectPropertyChange(true);
        var nodes = this.removeChildrenFromLayout(this.nodes);
        var viewPort = { x: this.scroller.viewPortWidth, y: this.scroller.viewPortHeight };
        if (this.layout.type !== 'None') {
            if ((this.layout.connectionPointOrigin === "DifferentPoint" && this.lineDistributionModule && canDoOverlap) || this.layout.arrangement === "Linear") {
                this.lineDistributionModule.initLineDistribution(this.layout, this);
            }
            if (this.organizationalChartModule) {
                layout = this.organizationalChartModule.updateLayout(nodes, this.nameTable, this.layout, viewPort, this.dataSourceSettings.id, this.diagramActions);
                update = true;
                if (this.layoutAnimateModule && layout.rootNode && !this.diagramActions) {
                    this.updateNodeExpand(layout.rootNode, layout.rootNode.isExpanded);
                }
            }
            else if (this.mindMapChartModule) {
                if (nodes && nodes.length > 0) {
                    this.mindMapChartModule.updateLayout(nodes, this.nameTable, this.layout, viewPort, this.dataSourceSettings.id, this.dataSourceSettings.root);
                }
                update = true;
            }
            else if (this.radialTreeModule) {
                this.radialTreeModule.updateLayout(nodes, this.nameTable, this.layout, viewPort);
                update = true;
            }
            else if (this.symmetricalLayoutModule) {
                this.symmetricalLayoutModule.maxIteration = this.layout.maxIteration;
                this.symmetricalLayoutModule.springLength = this.layout.springLength;
                this.symmetricalLayoutModule.springFactor = this.layout.springFactor;
                this.symmetricalLayoutModule.updateLayout(nodes, this.connectors, this.symmetricalLayoutModule, this.nameTable, this.layout, viewPort);
                update = true;
            }
            else if (this.complexHierarchicalTreeModule) {
                var nodes_1 = this.complexHierarchicalTreeModule.getLayoutNodesCollection(this.nodes);
                if (nodes_1.length > 0) {
                    this.complexHierarchicalTreeModule.doLayout(nodes_1, this.nameTable, this.layout, viewPort, this.lineDistributionModule);
                }
                update = true;
            }
            if (update) {
                this.preventDiagramUpdate = true;
                var connectors = {};
                var updatedNodes = nodes;
                if (isBlazor()) {
                    this.updateTemplate();
                }
                for (var _i = 0, updatedNodes_1 = updatedNodes; _i < updatedNodes_1.length; _i++) {
                    var obj = updatedNodes_1[_i];
                    var node = obj;
                    if (!this.preventNodesUpdate && (!this.diagramActions || !(this.diagramActions & DiagramAction.PreventIconsUpdate))) {
                        this.updateIcon(node);
                        this.updateDefaultLayoutIcons(node);
                    }
                    this.preventNodesUpdate = true;
                    this.nodePropertyChange(node, {}, { offsetX: node.offsetX, offsetY: node.offsetY }, true);
                    this.preventNodesUpdate = false;
                    node.wrapper.measure(new Size(node.wrapper.width, node.wrapper.height));
                    node.wrapper.arrange(node.wrapper.desiredSize);
                    this.updateDiagramObject(node, true);
                    if (node.inEdges.length > 0) {
                        for (var j = 0; j < node.inEdges.length; j++) {
                            var connector = this.nameTable[node.inEdges[j]];
                            connectors[connector.id] = connector;
                        }
                    }
                    if (node.outEdges.length > 0) {
                        for (var k = 0; k < node.outEdges.length; k++) {
                            var connection = this.nameTable[node.outEdges[k]];
                            connectors[connection.id] = connection;
                        }
                    }
                }
                for (var _a = 0, _b = Object.keys(connectors); _a < _b.length; _a++) {
                    var conn = _b[_a];
                    var connector = connectors[conn];
                    var points = this.getPoints(connector);
                    updateConnector(connector, points);
                    if (connector.shape.type === 'Bpmn' && connector.shape.sequence === 'Default') {
                        this.commandHandler.updatePathElementOffset(connector);
                    }
                    connector.wrapper.measure(new Size(undefined, undefined));
                    connector.wrapper.arrange(connector.wrapper.desiredSize);
                    this.updateConnectorAnnotation(connector);
                    this.updateConnectorfixedUserHandles(connector);
                    this.updateQuad(connector);
                    this.updateDiagramObject(connector, true);
                }
                if (this.layout.connectionPointOrigin === "DifferentPoint" && this.lineDistributionModule && canDoOverlap) {
                    this.lineDistributionModule.distributeLines(this.layout, this);
                }
                this.preventDiagramUpdate = false;
                this.updatePage();
                if ((!(this.diagramActions & DiagramAction.Render)) || this.mode === 'Canvas') {
                    this.refreshDiagramLayer();
                }
            }
            if (!propChange) {
                this.protectPropertyChange(propChange);
            }
        }
        if (update) {
            this.updateDiagramElementQuad();
        }
        return ((this.blazorActions & BlazorAction.expandNode) ? layout : isBlazor() ? null : true);
    };
    /* tslint:enable */
    /**
     * Serializes the diagram control as a string
     */
    Diagram.prototype.saveDiagram = function () {
        return serialize(this);
    };
    /**
     * Converts the given string as a Diagram Control
     * @param {string} data - Defines the behavior of the diagram to be loaded
     * @deprecated
     */
    Diagram.prototype.loadDiagram = function (data) {
        return deserialize(data, this);
    };
    /**
     * To  get the html diagram content
     * @param {StyleSheetList} styleSheets - defines the collection of style files to be considered while exporting.
     */
    Diagram.prototype.getDiagramContent = function (styleSheets) {
        if (this.printandExportModule) {
            var data = this.printandExportModule.getDiagramContent(styleSheets);
            return data;
        }
        return '';
    };
    /**
     * To export diagram native/html image
     * @param {string} image - defines image content to be exported.
     * @param {IExportOptions} options - defines the image properties.
     */
    Diagram.prototype.exportImage = function (image, options) {
        if (this.printandExportModule) {
            this.printandExportModule.exportImages(image, options);
        }
    };
    /**
     * To print native/html nodes of diagram
     * @param {string} image - defines image content.
     * @param {IExportOptions} options - defines the properties of the image
     */
    Diagram.prototype.printImage = function (image, options) {
        if (this.printandExportModule) {
            options.printOptions = true;
            this.printandExportModule.exportImages(image, options);
        }
    };
    /**
     * To limit the history entry of the diagram
     * @param {number} stackLimit - defines stackLimit of the history manager.
     */
    Diagram.prototype.setStackLimit = function (stackLimit) {
        if (this.undoRedoModule && stackLimit) {
            this.historyManager.stackLimit = stackLimit;
            this.undoRedoModule.applyLimit(this.historyManager.currentEntry, stackLimit, this, true);
        }
    };
    /**
     * To clear history of the diagram
     */
    Diagram.prototype.clearHistory = function () {
        if (this.undoRedoModule) {
            this.undoRedoModule.clearHistory(this);
        }
    };
    /**
     * To get the bound of the diagram
     */
    Diagram.prototype.getDiagramBounds = function () {
        if (this.printandExportModule) {
            var bounds = this.printandExportModule.getDiagramBounds('', {});
            bounds.width = bounds.width > this.scrollSettings.viewPortWidth ?
                bounds.width + (bounds.x > 0 ? bounds.x : 0) : this.scrollSettings.viewPortWidth;
            bounds.height = bounds.height > this.scrollSettings.viewPortHeight ?
                bounds.height + (bounds.y > 0 ? bounds.y : 0) : this.scrollSettings.viewPortHeight;
            bounds.x = bounds.x > 0 ? 0 : bounds.x;
            bounds.y = bounds.y > 0 ? 0 : bounds.y;
            return bounds;
        }
        return new Rect();
    };
    /**
     * To export Diagram
     * @param {IExportOptions} options - defines the how the image to be exported.
     */
    Diagram.prototype.exportDiagram = function (options) {
        if (this.printandExportModule) {
            var data = this.printandExportModule.exportDiagram(options);
            return data;
        }
        return '';
    };
    /**
     * To print Diagram
     * @param {IPrintOptions} optons - defines how the image to be printed.
     */
    Diagram.prototype.print = function (options) {
        if (this.printandExportModule) {
            this.printandExportModule.print(options);
        }
    };
    /**
     * Add ports at the run time
     * @blazorArgsType obj|DiagramNode
     */
    Diagram.prototype.addPorts = function (obj, ports) {
        this.protectPropertyChange(true);
        var portCollection = [];
        var isAddPortInServer = true;
        if (isBlazor() && obj !== null && (obj.ports.length > 0 && !(this.diagramActions & DiagramAction.UndoRedo))) {
            var index = Number(findObjectIndex(obj, ports[0].id, false));
            if (index !== -1) {
                isAddPortInServer = false;
            }
        }
        obj = this.nameTable[obj.id] || obj;
        var newObj;
        if (ports.length > 1) {
            this.startGroupAction();
        }
        for (var i = 0; i < ports.length; i++) {
            newObj = new PointPort(obj, 'ports', ports[i], true);
            obj.ports.push(newObj);
            if (isBlazor() && isAddPortInServer) {
                portCollection.push(newObj);
            }
            if (obj.children) {
                var container = obj.wrapper;
                obj.initPort(this.getDescription, obj.wrapper.children[container.children.length - 1], newObj);
            }
            else {
                var canvas = obj.wrapper;
                canvas.children.push(obj.initPortWrapper(obj.ports[obj.ports.length - 1]));
            }
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                var entry = {
                    type: 'PortCollectionChanged', changeType: 'Insert', undoObject: cloneObject(newObj),
                    redoObject: cloneObject(obj), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
        }
        if (ports.length > 1) {
            this.endGroupAction();
        }
        if (isBlazor() && isAddPortInServer) {
            this.UpdateBlazorLabelOrPortObjects(portCollection, 'Port', undefined, this.nodes.indexOf(obj));
        }
        obj.wrapper.measure(new Size(obj.width, obj.height));
        obj.wrapper.arrange(obj.wrapper.desiredSize);
        this.updateDiagramObject(obj);
        this.protectPropertyChange(false);
    };
    /**
     * Add constraints at run time
     */
    Diagram.prototype.addConstraints = function (constraintsType, constraintsValue) {
        return constraintsType | constraintsValue;
    };
    /**
     * Remove constraints at run time
     */
    Diagram.prototype.removeConstraints = function (constraintsType, constraintsValue) {
        return constraintsType & ~constraintsValue;
    };
    /**
     * Add labels in node at the run time in the blazor platform
     */
    Diagram.prototype.addNodeLabels = function (obj, labels) {
        this.addLabels(obj, labels);
    };
    /**
     * Add labels in connector at the run time in the blazor platform
     */
    Diagram.prototype.addConnectorLabels = function (obj, labels) {
        this.addLabels(obj, labels);
    };
    /**
     * Add Labels at the run time
     */
    Diagram.prototype.addLabels = function (obj, labels) {
        this.protectPropertyChange(true);
        var isAddLabelInServer = true;
        var annotationCollection = [];
        if (isBlazor() && obj != null && obj.annotations.length > 0 && !(this.diagramActions & DiagramAction.UndoRedo)) {
            var index = Number(findObjectIndex(obj, labels[0].id, true));
            if (index !== -1) {
                isAddLabelInServer = false;
            }
        }
        obj = this.nameTable[obj.id] || obj;
        var canvas = obj.wrapper;
        var newObj;
        if (labels.length > 1) {
            this.startGroupAction();
        }
        for (var i = 0; i < labels.length; i++) {
            if (obj instanceof Node) {
                newObj = new ShapeAnnotation(obj, 'annotations', labels[i], true);
                obj.annotations.push(newObj);
                if (isBlazor() && isAddLabelInServer) {
                    annotationCollection.push(newObj);
                }
                if (obj.children) {
                    var node = obj;
                    for (var i_2 = 0; i_2 < node.wrapper.children.length; i_2++) {
                        if (node.wrapper.children[i_2].id === node.id + 'group_container') {
                            var container = node.wrapper.children[i_2];
                            container.children.push(obj.initAnnotationWrapper(obj.annotations[obj.annotations.length - 1], this.element.id));
                        }
                    }
                }
                else {
                    canvas.children.push(obj.initAnnotationWrapper(obj.annotations[obj.annotations.length - 1], this.element.id));
                }
            }
            else if (obj instanceof Connector) {
                newObj = new PathAnnotation(obj, 'annotations', labels[i], true);
                obj.annotations.push(newObj);
                if (isBlazor() && isAddLabelInServer) {
                    annotationCollection.push(newObj);
                }
                var segment = canvas.children[0];
                var bounds = new Rect(segment.offsetX - segment.width / 2, segment.offsetY - segment.height / 2, segment.width, segment.height);
                canvas.children.push(obj.getAnnotationElement(obj.annotations[obj.annotations.length - 1], obj.intermediatePoints, bounds, this.getDescription, this.element.id));
            }
            if (!(this.diagramActions & DiagramAction.UndoRedo) && !(this.diagramActions & DiagramAction.Group)) {
                var entry = {
                    type: 'LabelCollectionChanged', changeType: 'Insert', undoObject: cloneObject(newObj),
                    redoObject: cloneObject(obj), category: 'Internal'
                };
                this.addHistoryEntry(entry);
            }
        }
        if (labels.length > 1) {
            this.endGroupAction();
        }
        if (isBlazor() && isAddLabelInServer) {
            this.UpdateBlazorLabelOrPortObjects(annotationCollection, (obj instanceof Node) ? 'NodeAnnotation' : 'ConnectorAnnotation', undefined, (obj instanceof Node) ? this.nodes.indexOf(obj) : this.connectors.indexOf(obj));
        }
        obj.wrapper.measure(new Size(canvas.width, canvas.height));
        obj.wrapper.arrange(canvas.desiredSize);
        this.updateDiagramObject(obj);
        this.protectPropertyChange(false);
    };
    /**
     * Add dynamic Lanes to swimLane at runtime
     */
    Diagram.prototype.addLanes = function (node, lane, index) {
        node = this.nameTable[node.id] || node;
        for (var i = 0; i < lane.length; i++) {
            addLane(this, node, lane[i], index);
            if (index !== undefined) {
                index += 1;
            }
        }
        this.updateDiagramElementQuad();
    };
    /**
     * Add a phase to a swimLane at runtime
     */
    Diagram.prototype.addPhases = function (node, phases) {
        node = this.nameTable[node.id] || node;
        for (var i = 0; i < phases.length; i++) {
            addPhase(this, node, phases[i]);
        }
        this.updateDiagramElementQuad();
    };
    /**
     * Remove dynamic Lanes to swimLane at runtime
     */
    Diagram.prototype.removeLane = function (node, lane) {
        removeLane(this, undefined, node, lane);
        this.updateDiagramElementQuad();
    };
    /**
     * Remove a phase to a swimLane at runtime
     */
    Diagram.prototype.removePhase = function (node, phase) {
        removePhase(this, undefined, node, phase);
        this.updateDiagramElementQuad();
    };
    Diagram.prototype.removelabelExtension = function (obj, labels, j, wrapper) {
        for (var i = 0; i < wrapper.children.length; i++) {
            var canvas = wrapper.children[i];
            if ((canvas instanceof TextElement) || (canvas instanceof DiagramHtmlElement)) {
                if (canvas.id.match('_' + labels[j].id + '$')) {
                    for (var k = 0; k < obj.annotations.length; k++) {
                        if (canvas.id.match('_' + obj.annotations[k].id + '$')) {
                            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                var entry = {
                                    type: 'LabelCollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj.annotations[k]),
                                    redoObject: cloneObject(obj), category: 'Internal'
                                };
                                this.addHistoryEntry(entry);
                            }
                            obj.annotations.splice(k, 1);
                        }
                    }
                    wrapper.children.splice(i, 1);
                    if (this.mode === 'SVG') {
                        var element = getDiagramElement(canvas.id, this.element.id);
                        if (element) {
                            var element_1 = getDiagramElement(canvas.id, this.element.id);
                            element_1.parentNode.removeChild(element_1);
                        }
                        var textElement = getDiagramElement(canvas.id + '_text', this.element.id);
                        if (textElement) {
                            element = getDiagramElement(canvas.id + '_text', this.element.id);
                            element.parentNode.removeChild(element);
                        }
                        var htmlElement = getDiagramElement(canvas.id + '_html_element', this.element.id);
                        if (htmlElement) {
                            htmlElement.parentNode.removeChild(htmlElement);
                        }
                    }
                    else {
                        this.refreshCanvasLayers();
                    }
                }
            }
        }
    };
    /**
     * Remove Labels at the run time
     */
    Diagram.prototype.removeLabels = function (obj, labels) {
        var isAddLabelInServer = true;
        if (isBlazor() && obj !== null && !(this.diagramActions & DiagramAction.UndoRedo)) {
            var index = (obj.annotations.length > 0) ? Number(findObjectIndex(obj, (labels[0]).id, true)) : -1;
            if (index === -1) {
                isAddLabelInServer = false;
            }
        }
        obj = this.nameTable[obj.id] || obj;
        if (isBlazor() && isAddLabelInServer) {
            var annotationCollection = [];
            var removalIndexCollection = [];
            for (var j = 0; j < labels.length; j++) {
                var index = Number(findObjectIndex(obj, labels[j].id, true));
                removalIndexCollection.push(index);
                annotationCollection.push(labels[j]);
            }
            this.UpdateBlazorLabelOrPortObjects(annotationCollection, (obj instanceof Node) ? 'NodeAnnotation' : 'ConnectorAnnotation', removalIndexCollection, (obj instanceof Node) ? this.nodes.indexOf(obj) : this.connectors.indexOf(obj));
        }
        if (labels.length > 1) {
            this.startGroupAction();
        }
        for (var j = labels.length - 1; j >= 0; j--) {
            if (obj.children && obj.children.length > 0) {
                for (var k = 0; k < obj.wrapper.children.length; k++) {
                    this.removelabelExtension(obj, labels, j, obj.wrapper.children[k]);
                }
            }
            else {
                this.removelabelExtension(obj, labels, j, obj.wrapper);
            }
        }
        if (labels.length > 1) {
            this.endGroupAction();
        }
    };
    Diagram.prototype.removePortsExtenion = function (obj, ports, j, wrapper) {
        for (var i = 0; i < wrapper.children.length; i++) {
            var canvas = wrapper.children[i];
            if (canvas instanceof PathElement) {
                if (canvas.id.match('_' + ports[j].id + '$')) {
                    for (var k = 0; k < obj.ports.length; k++) {
                        if (canvas.id.match('_' + obj.ports[k].id + '$')) {
                            if (!(this.diagramActions & DiagramAction.UndoRedo)) {
                                var entry = {
                                    type: 'PortCollectionChanged', changeType: 'Remove', undoObject: cloneObject(obj.ports[k]),
                                    redoObject: cloneObject(obj), category: 'Internal'
                                };
                                this.addHistoryEntry(entry);
                            }
                            obj.ports.splice(k, 1);
                        }
                    }
                    wrapper.children.splice(i, 1);
                    if (this.mode === 'SVG') {
                        var element = getDiagramElement(canvas.id, this.element.id);
                        element.parentNode.removeChild(element);
                    }
                    else {
                        this.refreshCanvasLayers();
                    }
                }
            }
        }
    };
    /**
     * Remove Ports at the run time
     */
    Diagram.prototype.removePorts = function (obj, ports) {
        var isAddPortInServer = true;
        if (isBlazor() && obj !== null && !(this.diagramActions & DiagramAction.UndoRedo)) {
            var index = (obj.ports.length > 0) ? Number(findObjectIndex(obj, ports[0].id, false)) : -1;
            if (index === -1) {
                isAddPortInServer = false;
            }
        }
        obj = this.nameTable[obj.id] || obj;
        if (isBlazor() && isAddPortInServer) {
            var removalIndexCollection = [];
            var portCollection = [];
            for (var j = ports.length - 1; j >= 0; j--) {
                var index = Number(findObjectIndex(obj, ports[j].id, false));
                removalIndexCollection.push(index);
                portCollection.push(ports[j]);
            }
            this.UpdateBlazorLabelOrPortObjects(portCollection, 'Port', removalIndexCollection, this.nodes.indexOf(obj));
        }
        if (ports.length > 1) {
            this.startGroupAction();
        }
        for (var j = ports.length - 1; j >= 0; j--) {
            if (obj.children && obj.children.length > 0) {
                for (var k = 0; k < obj.wrapper.children.length; k++) {
                    this.removePortsExtenion(obj, ports, j, obj.wrapper.children[k]);
                }
            }
            else {
                this.removePortsExtenion(obj, ports, j, obj.wrapper);
            }
        }
        if (ports.length > 1) {
            this.endGroupAction();
        }
    };
    //public methods - end region
    //helper methods - start region
    /**
     * @private
     * @param {string | number} real - real value
     * @param {number} rulerSize - ruler size
     */
    Diagram.prototype.getSizeValue = function (real, rulerSize) {
        var value;
        if (real.toString().indexOf('px') > 0) {
            value = real.toString();
        }
        else if (real.toString().indexOf('%') > 0) {
            value = rulerSize !== undefined ? '100%' : real.toString();
        }
        else {
            value = real.toString() + 'px';
        }
        if (rulerSize) {
            var position = getRulerSize(this);
            value = 'calc(' + value + ' - ' + rulerSize + 'px)';
        }
        return value;
    };
    Diagram.prototype.renderRulers = function () {
        if (this.rulerSettings.showRulers) {
            renderOverlapElement(this);
            renderRuler(this, true);
            renderRuler(this, false);
        }
        else {
            removeRulerElements(this);
        }
    };
    Diagram.prototype.intOffPageBackground = function () {
        var position = new Size();
        position = getRulerSize(this);
        var element = document.getElementById(this.element.id + 'content');
        var width = this.getSizeValue(this.width, position.width);
        var height = this.getSizeValue(this.height, position.height);
        var style = this.rulerSettings.showRulers ?
            'width:' + width + '; height:' + height + ';' +
                'top:' + position.height + 'px;left:' + position.width + 'px;' +
                'overflow: scroll;position:absolute;overflow:auto;' :
            'width:' + width + '; height:' + height + ';position:absolute;' +
                ' left:0px;  top:0px;overflow: auto;';
        var attr = {
            'id': this.element.id + 'content',
            'tabindex': '0',
            'style': style
        };
        if (!element) {
            this.diagramCanvas = createHtmlElement('div', attr);
            this.element.appendChild(this.diagramCanvas);
        }
        else {
            this.diagramCanvas = element;
            applyStyleAgainstCsp(this.diagramCanvas, style);
        }
        this.diagramCanvas.style.background = this.backgroundColor;
    };
    Diagram.prototype.initDiagram = function () {
        this.intOffPageBackground();
        setAttributeHtml(this.element, {
            style: 'width:' + this.getSizeValue(this.width) + '; height:'
                + this.getSizeValue(this.height) + ';position:relative;overflow:hidden;'
        });
    };
    ;
    Diagram.prototype.renderHiddenUserHandleTemplateLayer = function (bounds) {
        var element;
        var attributes = {
            'class': this.element.id + '_hiddenUserHandleTemplate',
            'style': 'width:' + bounds.width + 'px; height:' + bounds.height + 'px;' + 'visibility:hidden ;  overflow: hidden;'
        };
        element = createHtmlElement('div', attributes);
        this.element.appendChild(element);
    };
    Diagram.prototype.renderBackgroundLayer = function (bounds, commonStyle) {
        var bgLayer = this.createSvg(this.element.id + '_backgroundLayer_svg', bounds.width, bounds.height);
        applyStyleAgainstCsp(bgLayer, commonStyle);
        var backgroundImage = createSvgElement('g', {
            'id': this.element.id + '_backgroundImageLayer',
            'class': 'e-background-image-layer'
        });
        bgLayer.appendChild(backgroundImage);
        var attr = { 'id': this.element.id + '_backgroundLayer', 'class': 'e-background-layer' };
        var background = createSvgElement('g', attr);
        bgLayer.appendChild(background);
        this.diagramCanvas.appendChild(bgLayer);
    };
    Diagram.prototype.renderGridLayer = function (bounds, commonStyle) {
        var svgGridSvg = this.createSvg(this.element.id + '_gridline_svg', bounds.width, bounds.height);
        svgGridSvg.setAttribute('class', 'e-grid-layer');
        var svgGrid = createSvgElement('g', { 'id': this.element.id + '_gridline', 'width': '100%', 'height': '100%' });
        var rect = createSvgElement('rect', {
            'id': this.element.id + '_grid_rect', 'x': '0', 'y': '0', 'width': '100%', 'height': '100%'
        });
        if (checkBrowserInfo()) {
            rect.setAttribute('fill', 'url(' + location.protocol + '//' + location.host + location.pathname +
                '#' + this.element.id + '_pattern)');
        }
        else {
            rect.setAttribute('fill', 'url(#' + this.element.id + '_pattern)');
        }
        svgGrid.appendChild(rect);
        svgGridSvg.appendChild(svgGrid);
        this.diagramCanvas.appendChild(svgGridSvg);
        setAttributeSvg(svgGridSvg, { 'style': commonStyle });
    };
    Diagram.prototype.renderDiagramLayer = function (bounds, commonStyle) {
        var attributes = {
            'id': this.element.id + '_diagramLayer_div',
            'style': 'width:' + bounds.width + 'px; height:' + bounds.height + 'px;' + commonStyle
        };
        this.diagramLayerDiv = createHtmlElement('div', attributes);
        if (this.mode === 'SVG') {
            var diagramSvg = this.createSvg(this.element.id + '_diagramLayer_svg', bounds.width, bounds.height);
            diagramSvg.style['pointer-events'] = 'none';
            diagramSvg.setAttribute('class', 'e-diagram-layer');
            var diagramLayer = createSvgElement('g', { 'id': this.element.id + '_diagramLayer' });
            var transformationLayer = createSvgElement('g', {});
            this.diagramLayer = diagramLayer;
            diagramSvg.style['pointer-events'] = 'all';
            transformationLayer.appendChild(diagramLayer);
            diagramSvg.appendChild(transformationLayer);
            this.diagramLayerDiv.appendChild(diagramSvg);
        }
        else {
            this.diagramLayer = CanvasRenderer.createCanvas(this.element.id + '_diagram', bounds.width, bounds.height);
            applyStyleAgainstCsp(this.diagramLayer, 'position:absolute;left:0px;top:0px;');
            this.diagramLayerDiv.appendChild(this.diagramLayer);
        }
        this.diagramCanvas.appendChild(this.diagramLayerDiv);
    };
    Diagram.prototype.initLayers = function () {
        var commonStyle = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;';
        var container = document.getElementById(this.element.id);
        var bounds = container.getBoundingClientRect();
        var scrollerSize = getScrollerWidth();
        this.scroller.scrollerWidth = scrollerSize;
        this.scroller.setViewPortSize(bounds.width, bounds.height);
        this.renderRulers();
        var measureWindowElement = 'measureElement';
        if (window[measureWindowElement]) {
            window[measureWindowElement] = null;
            var measureElements = document.getElementById('measureElement');
            measureElements.remove();
        }
        createMeasureElements();
        // this.renderBackgroundImageLayer(bounds, commonStyle);
        this.renderBackgroundLayer(bounds, commonStyle);
        this.renderGridLayer(bounds, commonStyle);
        this.renderDiagramLayer(bounds, commonStyle);
        this.renderHTMLLayer(bounds, commonStyle);
        this.renderPortsExpandLayer(bounds, commonStyle);
        this.renderNativeLayer(bounds, commonStyle);
        this.renderAdornerLayer(bounds, commonStyle);
        this.renderHiddenUserHandleTemplateLayer(bounds);
    };
    Diagram.prototype.renderAdornerLayer = function (bounds, commonStyle) {
        var divElement = createHtmlElement('div', {
            'id': this.element.id + '_diagramAdornerLayer',
            'style': 'width:' + bounds.width + 'px;height:' + bounds.height + 'px;' + commonStyle
        });
        var element = createHtmlElement('div', {
            'id': this.element.id + '_diagramUserHandleLayer',
            'style': 'width:' + bounds.width + 'px;height:' + bounds.height + 'px;' + commonStyle
        });
        element.setAttribute('class', 'e-userHandle-layer');
        divElement.appendChild(element);
        var svgAdornerSvg = this.createSvg(this.element.id + '_diagramAdorner_svg', bounds.width, bounds.height);
        svgAdornerSvg.setAttribute('class', 'e-adorner-layer');
        svgAdornerSvg.style['pointer-events'] = 'none';
        this.adornerLayer = createSvgElement('g', { 'id': this.element.id + '_diagramAdorner' });
        this.adornerLayer.style[' pointer-events'] = 'all';
        svgAdornerSvg.appendChild(this.adornerLayer);
        divElement.appendChild(svgAdornerSvg);
        this.diagramCanvas.appendChild(divElement);
        var svgSelector = createSvgElement('g', { 'id': this.element.id + '_SelectorElement' });
        this.adornerLayer.appendChild(svgSelector);
        setAttributeSvg(svgAdornerSvg, { style: 'pointer-events:none;' });
    };
    Diagram.prototype.renderPortsExpandLayer = function (bounds, commonStyle) {
        var svgPortsSvg = this.createSvg(this.element.id + '_diagramPorts_svg', bounds.width, bounds.height);
        svgPortsSvg.setAttribute('class', 'e-ports-expand-layer');
        var svgPortsLayer = createSvgElement('g', {
            'id': this.element.id + '_diagramPorts',
            'class': 'e-ports-layer',
            'style': 'pointer-events: all;'
        });
        svgPortsSvg.appendChild(svgPortsLayer);
        var svgExpandLayer = createSvgElement('g', {
            'id': this.element.id + '_diagramExpander',
            'class': 'e-expand-layer',
            'style': 'pointer-events: all;'
        });
        svgPortsSvg.appendChild(svgExpandLayer);
        this.diagramCanvas.appendChild(svgPortsSvg);
        setAttributeSvg(svgPortsSvg, { 'style': commonStyle });
    };
    Diagram.prototype.renderHTMLLayer = function (bounds, commonStyle) {
        this.htmlLayer = createHtmlElement('div', {
            'id': this.element.id + '_htmlLayer',
            'style': 'width:' + bounds.width + 'px; height:' + bounds.height + 'px;position:absolute;top:0px;' +
                'left:0px;overflow:hidden;pointer-events:none;',
            'class': 'e-html-layer'
        });
        var htmlLayerDiv = createHtmlElement('div', {
            'id': this.element.id + '_htmlLayer_div',
            'style': 'position:absolute;top:0px;left:0px;pointer-events:all;'
        });
        this.htmlLayer.appendChild(htmlLayerDiv);
        this.diagramCanvas.appendChild(this.htmlLayer);
    };
    Diagram.prototype.renderNativeLayer = function (bounds, commonStyle) {
        var nativeLayerSvg = this.createSvg(this.element.id + '_nativeLayer_svg', bounds.width, bounds.height);
        var nativeLayer = createSvgElement('g', { 'id': this.element.id + '_nativeLayer', 'style': 'pointer-events:all;' });
        nativeLayerSvg.appendChild(nativeLayer);
        this.diagramLayerDiv.appendChild(nativeLayerSvg);
        setAttributeSvg(nativeLayerSvg, { 'class': 'e-native-layer', 'style': commonStyle });
    };
    /** @private */
    Diagram.prototype.createSvg = function (id, width, height) {
        var svgObj = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
        return svgObj;
    };
    Diagram.prototype.updateBazorShape = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            switch (node.shape.type) {
                case 'Bpmn':
                    node.shape.bpmnShape =
                        node.shape.shape ? node.shape.shape
                            : node.shape.bpmnShape;
                    break;
                case 'UmlActivity':
                    node.shape.umlActivityShape =
                        node.shape.shape ? node.shape.shape
                            : node.shape.umlActivityShape;
                    break;
                case 'Flow':
                    node.shape.flowShape =
                        node.shape.shape ? node.shape.shape
                            : node.shape.flowShape;
                    break;
                case 'Basic':
                    node.shape.basicShape =
                        node.shape.shape ? node.shape.shape
                            : node.shape.basicShape;
                    break;
                case 'Text':
                    node.shape.textContent =
                        node.shape.content ? node.shape.content
                            : node.shape.textContent;
                    break;
            }
        }
    };
    Diagram.prototype.initObjects = function (isLoad) {
        this.updateBazorShape();
        if (!this.isLoading) {
            this.initData();
        }
        this.initLayerObjects();
        this.updateBridging(isLoad);
    };
    /** @private */
    Diagram.prototype.initLayerObjects = function () {
        var hasLayers = this.layers.length > 1;
        var set = false;
        var connectors = [];
        var blazor = 'Blazor';
        var canCloneObject = window && window[blazor] && !this.dataSourceSettings.dataSource;
        var tempTabel = {};
        var bpmnTable = {};
        var tempNode = [];
        var groups = [];
        var i = 0;
        var previousNodeObject = [];
        var previousConnectorObject = [];
        var updateNodeObject = [];
        var updateConnectorObject = [];
        var changeNodes = [];
        var changeConnectors = [];
        if (isBlazor() && canCloneObject) {
            previousNodeObject = this.previousNodeCollection;
            previousConnectorObject = this.previousConnectorCollection;
        }
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.id = obj.id || randomId();
            this.addToLayer(obj, hasLayers);
            tempTabel[obj.id] = obj;
        }
        for (var _b = 0, _c = this.connectors; _b < _c.length; _b++) {
            var obj = _c[_b];
            obj.id = obj.id || randomId();
            this.addToLayer(obj, hasLayers);
            tempTabel[obj.id] = obj;
        }
        for (var _d = 0, _e = this.layers; _d < _e.length; _d++) {
            var layer = _e[_d];
            for (var _f = 0, _g = layer.objects; _f < _g.length; _f++) {
                var obj = _g[_f];
                if (tempTabel[obj]) {
                    if (!(tempTabel[obj] instanceof Connector)) {
                        if (tempTabel[obj].children) {
                            groups.push(obj);
                        }
                        else if ((tempTabel[obj].shape instanceof BpmnShape) &&
                            tempTabel[obj].shape.activity.subProcess.processes &&
                            tempTabel[obj].shape.activity.subProcess.processes.length > 0) {
                            bpmnTable[tempTabel[obj].id] = obj;
                        }
                        else {
                            this.initNodes(tempTabel[obj], layer);
                        }
                    }
                    else {
                        var connector = tempTabel[obj];
                        if (connector.sourceID && connector.targetID) {
                            var sourceNode = tempTabel[connector.sourceID];
                            var targetNode = tempTabel[connector.targetID];
                            if (sourceNode && sourceNode.wrapper && targetNode && targetNode.wrapper) {
                                this.initConnectors(tempTabel[obj], layer);
                            }
                            else {
                                connectors.push(tempTabel[obj]);
                            }
                        }
                        else {
                            this.initConnectors(tempTabel[obj], layer);
                        }
                    }
                }
            }
            if (this.bpmnModule) {
                for (var _h = 0, _j = this.bpmnModule.textAnnotationConnectors; _h < _j.length; _h++) {
                    var obj = _j[_h];
                    this.initConnectors(obj, layer, false);
                }
            }
        }
        for (var _k = 0, _l = Object.keys(bpmnTable); _k < _l.length; _k++) {
            var obj = _l[_k];
            this.initObject(tempTabel[obj]);
            this.bpmnModule.updateDocks(tempTabel[obj], this);
        }
        var alignedGroups = this.alignGroup(groups, tempTabel);
        for (var _m = 0, alignedGroups_1 = alignedGroups; _m < alignedGroups_1.length; _m++) {
            var obj = alignedGroups_1[_m];
            var layer = this.commandHandler.getObjectLayer(obj);
            this.initNodes(tempTabel[obj], layer);
        }
        for (var _o = 0, connectors_1 = connectors; _o < connectors_1.length; _o++) {
            var connector = connectors_1[_o];
            var layer = this.commandHandler.getObjectLayer(connector.id);
            this.initConnectors(connector, layer);
        }
        if (isBlazor() && canCloneObject) {
            for (var _p = 0, _q = this.nodes; _p < _q.length; _p++) {
                var obj = _q[_p];
                updateNodeObject.push(cloneObject(obj, undefined, undefined, true));
            }
            for (var _r = 0, _s = this.connectors; _r < _s.length; _r++) {
                var obj = _s[_r];
                updateConnectorObject.push(cloneObject(obj, undefined, undefined, true));
            }
            this.commandHandler.getObjectChanges(previousNodeObject, updateNodeObject, changeNodes);
            this.commandHandler.getObjectChanges(previousConnectorObject, updateConnectorObject, changeConnectors);
            if (!(this.blazorActions & BlazorAction.ClearObject)) {
                var blazorInterop = 'sfBlazor';
                var diagramObject = { nodes: changeNodes, connectors: changeConnectors };
                var obj = {
                    'methodName': 'UpdateBlazorProperties',
                    'diagramobj': diagramObject
                };
                window[blazorInterop].updateBlazorProperties(obj, this);
            }
        }
    };
    Diagram.prototype.alignGroup = function (parents, tempTabel) {
        var newList = [];
        var parentist = [];
        var child;
        var childNode;
        var i;
        var j;
        for (i = 0; i < parents.length; i++) {
            child = parents[i];
            childNode = tempTabel[child];
            var node = void 0;
            if (childNode && childNode.children.length) {
                for (j = 0; j < childNode.children.length; j++) {
                    node = childNode.children[j];
                    if (parents.indexOf(node) > -1 && (newList.indexOf(node) === -1) &&
                        (parentist.indexOf(node) === -1)) {
                        newList.splice(0, 0, node);
                    }
                }
            }
            if (newList.indexOf(child) === -1) {
                parentist.push(child);
            }
        }
        newList = newList.concat(parentist);
        return newList;
    };
    Diagram.prototype.addToLayer = function (obj, hasLayers) {
        var layer;
        if (hasLayers) {
            layer = this.commandHandler.getObjectLayer(obj.id);
        }
        if (!hasLayers || !layer) {
            if (this.activeLayer.objects.indexOf(obj.id) === -1) {
                this.activeLayer.objects.push(obj.id);
            }
        }
        this.setZIndex(layer || this.activeLayer, obj);
    };
    Diagram.prototype.updateLayer = function (newProp) {
        for (var _i = 0, _a = Object.keys(newProp.layers); _i < _a.length; _i++) {
            var key = _a[_i];
            var layerObject = this.layers[key].objects;
            for (var _b = 0, layerObject_1 = layerObject; _b < layerObject_1.length; _b++) {
                var obj = layerObject_1[_b];
                var node = this.nameTable[obj];
                if (newProp.layers[key].visible !== undefined) {
                    this.updateElementVisibility(node.wrapper, node, newProp.layers[key].visible);
                }
                else if (newProp.layers[key].lock === true) {
                    this.unSelect(node);
                }
            }
            if (newProp.layers[key].lock !== undefined) {
                this.layers[key].lock = newProp.layers[key].lock;
            }
        }
        if (this.mode !== 'SVG') {
            this.refreshDiagramLayer();
        }
    };
    Diagram.prototype.updateScrollSettings = function (newProp) {
        var hPan = (-this.scroller.horizontalOffset + newProp.scrollSettings.horizontalOffset || 0);
        var vPan = (this.scroller.verticalOffset - newProp.scrollSettings.verticalOffset || 0);
        var oldValue = {
            VerticalOffset: this.scrollSettings.verticalOffset, HorizontalOffset: this.scrollSettings.horizontalOffset,
            ViewportHeight: this.scrollSettings.viewPortHeight, ViewportWidth: this.scrollSettings.viewPortWidth,
            CurrentZoom: this.scroller.currentZoom
        };
        if (hPan !== 0 || vPan !== 0) {
            this.pan(hPan, vPan);
        }
        var newValue = {
            VerticalOffset: this.scrollSettings.verticalOffset, HorizontalOffset: this.scrollSettings.horizontalOffset,
            ViewportHeight: this.scrollSettings.viewPortHeight, ViewportWidth: this.scrollSettings.viewPortWidth,
            CurrentZoom: this.scroller.currentZoom
        };
        var panStatus = 'Start';
        if (this.realActions & RealAction.PanInProgress) {
            panStatus = 'Progress';
        }
        var arg = {
            oldValue: oldValue,
            newValue: newValue, source: this,
            panState: panStatus
        };
        if (isBlazor() && this.scrollChange) {
            arg = {
                oldValue: oldValue,
                newValue: newValue,
                sourceId: this.element.id,
                panState: panStatus
            };
        }
        this.triggerEvent(DiagramEvent.scrollChange, arg);
        this.commandHandler.updatePanState(true);
        if (this.mode === 'Canvas' && (this.constraints & DiagramConstraints.Virtualization)) {
            this.refreshDiagramLayer();
        }
    };
    Diagram.prototype.initData = function () {
        var dataSourceSettings = this.dataSourceSettings.dataManager || this.dataSourceSettings.dataSource;
        var adapter = 'adaptorName';
        if (this.dataBindingModule && !(this.realActions & RealAction.PreventDataInit)) {
            if (dataSourceSettings && this.dataSourceSettings.connectionDataSource.dataManager) {
                var dataManager = this.dataSourceSettings.dataManager || this.dataSourceSettings.dataSource;
                this.nodes = this.generateData(dataManager, true);
                this.connectors = this.generateData(this.dataSourceSettings.connectionDataSource.dataManager, false);
            }
            else if (dataSourceSettings && dataSourceSettings.dataSource &&
                (dataSourceSettings.dataSource.url || (dataSourceSettings[adapter] === 'BlazorAdaptor' &&
                    !dataSourceSettings.dataSource.url))) {
                this.dataBindingModule.initSource(this.dataSourceSettings, this);
            }
            else {
                this.dataBindingModule.initData(this.dataSourceSettings, this);
            }
        }
    };
    Diagram.prototype.generateData = function (dataSource, isNode) {
        var nodes = [];
        var i;
        for (i = 0; i < dataSource.length; i++) {
            var row = dataSource[i];
            var node = isNode ? this.makeData(row, true) : this.makeData(row, false);
            if (node && node.id && (!findNodeByName(nodes, node.id) || !findNodeByName(nodes, node.id))) {
                nodes.push(node);
            }
        }
        return (nodes);
    };
    Diagram.prototype.makeData = function (row, isNode) {
        var i;
        var fields = isNode ? this.dataSourceSettings : this.dataSourceSettings.connectionDataSource;
        var data = {};
        data.id = row[fields.id] ? row[fields.id] : randomId();
        if (fields.sourceID) {
            data.sourceID = row[fields.sourceID];
        }
        if (fields.targetID) {
            data.targetID = row[fields.targetID];
        }
        if (row[fields.sourcePointX] && row[fields.sourcePointY]) {
            data.sourcePoint = { 'x': Number(row[fields.sourcePointX]), 'y': Number(row[fields.sourcePointY]) };
        }
        if (row[fields.targetPointX] && row[fields.targetPointY]) {
            data.targetPoint = { 'x': Number(row[fields.targetPointX]), 'y': Number(row[fields.targetPointY]) };
        }
        if (fields.crudAction.customFields && fields.crudAction.customFields.length > 0) {
            for (i = 0; i < fields.crudAction.customFields.length; i++) {
                data[fields.crudAction.customFields[i]] = row[fields.crudAction.customFields[i]];
            }
        }
        return data;
    };
    Diagram.prototype.initNodes = function (obj, layer) {
        this.preventDiagramUpdate = true;
        this.initObject(obj, layer);
        this.preventDiagramUpdate = false;
    };
    Diagram.prototype.initConnectors = function (obj, layer, independentObj) {
        this.preventDiagramUpdate = true;
        this.initObject(obj, layer, independentObj);
        this.updateEdges(obj);
        this.preventDiagramUpdate = false;
    };
    Diagram.prototype.setZIndex = function (layer, obj) {
        //should be changed
        var currentLayer = layer;
        if ((obj).zIndex === -1) {
            while (currentLayer.zIndexTable[currentLayer.objectZIndex + 1]) {
                layer.objectZIndex++;
            }
            obj.zIndex = ++currentLayer.objectZIndex;
        }
        else {
            var index = obj.zIndex;
            if (currentLayer.zIndexTable[index]) {
                var tabelLength = Object.keys(currentLayer.zIndexTable).length;
                var j = 0;
                for (var i = 0; i < tabelLength; i++) {
                    if (i === index) {
                        for (var j_1 = tabelLength; j_1 > index; j_1--) {
                            currentLayer.zIndexTable[j_1] = currentLayer.zIndexTable[j_1 - 1];
                            if (this.nameTable[currentLayer.zIndexTable[j_1]]) {
                                this.nameTable[currentLayer.zIndexTable[j_1]].zIndex = j_1;
                            }
                        }
                        currentLayer.zIndexTable[i] = obj.id;
                    }
                    j++;
                }
            }
        }
    };
    Diagram.prototype.initializeDiagramLayers = function () {
        var tempLayers = this.layers;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].zIndex !== -1) {
                var temp = this.layers[i];
                this.layers[i] = this.layers[this.layers[i].zIndex];
                this.layers[temp.zIndex] = temp;
            }
        }
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            layer.zIndex = layer.zIndex !== -1 ? layer.zIndex : this.layers.indexOf(layer);
            this.layerZIndexTable[layer.zIndex] = layer.id;
        }
        for (var i = 0; i < this.layers.length; i++) {
            for (var j = i + 1; j < this.layers.length; j++) {
                if (this.layers[i].zIndex > this.layers[j].zIndex) {
                    var temp = this.layers[i];
                    this.layers[i] = this.layers[j];
                    this.layers[j] = temp;
                }
            }
        }
        if (this.layers.length === 0) {
            var defaultLayer = {
                id: 'default_layer', visible: true, lock: false, objects: [], zIndex: 0,
                objectZIndex: -1, zIndexTable: {}
            };
            this.commandHandler.addLayer(defaultLayer, null, true);
        }
        this.setActiveLayer(this.layers[this.layers.length - 1].id);
    };
    /** @private */
    Diagram.prototype.resetTool = function () {
        this.eventHandler.resetTool();
    };
    Diagram.prototype.initObjectExtend = function (obj, layer, independentObj) {
        if (independentObj) {
            var checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, obj.wrapper.bounds);
            layer.zIndexTable[obj.zIndex] = obj.id;
            if (!checkBoundaryConstraints) {
                var node = obj instanceof Node ? this.nodes : this.connectors;
                for (var i = 0; i <= node.length; i++) {
                    if (node[i] && obj.id === node[i].id) {
                        node.splice(i, 1);
                    }
                }
                delete layer.zIndexTable[obj.zIndex];
            }
        }
    };
    /* tslint:disable */
    /** @private */
    Diagram.prototype.initObject = function (obj, layer, independentObj, group) {
        if (independentObj === void 0) { independentObj = true; }
        if (obj !== undefined) {
            if (independentObj) {
                if (!layer) {
                    this.addToLayer(obj, false);
                    layer = this.activeLayer;
                }
                //Move the common properties like zindex and id to an abstract class
                if (obj instanceof Node || obj instanceof Connector) {
                    this.setZIndex(layer, obj);
                }
            }
            if (obj instanceof Node) {
                if (independentObj) {
                    if (obj.id !== 'helper') {
                        var getDefaults = getFunction(this.getNodeDefaults);
                        if (getDefaults) {
                            var defaults = getDefaults(obj, this);
                            if (defaults && defaults.ports) {
                                for (var i = 0; i < defaults.ports.length; i++) {
                                    defaults.ports[i].inEdges = [];
                                    defaults.ports[i].outEdges = [];
                                }
                            }
                            if (defaults && defaults !== obj) {
                                extendObject(defaults, obj);
                            }
                        }
                    }
                    this.initNode(obj, this.element.id);
                }
            }
            else if (obj instanceof Connector) {
                var getDefaults = getFunction(this.getConnectorDefaults);
                if (getDefaults) {
                    var defaults = getDefaults(obj, this);
                    if (defaults && defaults !== obj) {
                        extendObject(defaults, obj);
                    }
                    if (obj.segments.length) {
                        if (obj.type !== obj.segments[0].type) {
                            obj.segments = [];
                        }
                    }
                }
                var sourceNode = this.nameTable[obj.sourceID];
                var targetNode = this.nameTable[obj.targetID];
                var port = this.getConnectedPort(sourceNode, obj, true);
                var targetPort = this.getConnectedPort(targetNode, obj);
                var outPort = this.findInOutConnectPorts(sourceNode, false);
                var inPort = this.findInOutConnectPorts(targetNode, true);
                if ((sourceNode !== undefined && canOutConnect(sourceNode)) || (obj.sourcePortID !== ''
                    && canPortOutConnect(outPort))) {
                    obj.sourceWrapper = this.getEndNodeWrapper(sourceNode, obj, true);
                    if (obj.sourcePortID) {
                        if (port && port.constraints && !(port.constraints & PortConstraints.None) && (port.constraints & PortConstraints.OutConnect)) {
                            obj.sourcePortWrapper = this.getWrapper(sourceNode.wrapper, obj.sourcePortID);
                        }
                    }
                }
                if ((targetNode !== undefined && canInConnect(targetNode)) || (obj.targetPortID !== ''
                    && canPortInConnect(inPort))) {
                    obj.targetWrapper = this.getEndNodeWrapper(targetNode, obj, false);
                    if (obj.targetPortID) {
                        if (targetPort && targetPort.constraints && !(targetPort.constraints & PortConstraints.None) && (targetPort.constraints & PortConstraints.InConnect)) {
                            obj.targetPortWrapper = this.getWrapper(targetNode.wrapper, obj.targetPortID);
                        }
                    }
                }
                if (!independentObj) {
                    var points = obj.getConnectorPoints(obj.type);
                    updateConnector(obj, points);
                }
                if (independentObj) {
                    obj.init(this);
                }
                for (var k = 0; k < obj.wrapper.children.length; k++) {
                    if (this.pathTable[obj.wrapper.children[k].data]) {
                        obj.wrapper.children[k].absoluteBounds =
                            this.pathTable[obj.wrapper.children[k].data].absoluteBounds;
                    }
                }
                obj.wrapper.measure(new Size(undefined, undefined));
                obj.wrapper.arrange(obj.wrapper.desiredSize);
                if (obj instanceof Connector && obj.type === 'Bezier') {
                    this.updateConnectorAnnotation(obj);
                    this.updateConnectorfixedUserHandles(obj);
                }
                for (var j = 0; j < obj.wrapper.children.length; j++) {
                    this.pathTable[obj.wrapper.children[j].data] = {};
                    this.pathTable[obj.wrapper.children[j].data].absoluteBounds =
                        obj.wrapper.children[j].absoluteBounds;
                }
            }
            if (obj instanceof Node && obj.children && obj.container) {
                for (var i = 0; i < obj.children.length; i++) {
                    this.nameTable[obj.children[i]].offsetX = this.nameTable[obj.children[i]].wrapper.offsetX;
                    this.nameTable[obj.children[i]].offsetY = this.nameTable[obj.children[i]].wrapper.offsetY;
                }
            }
            if (this.bpmnModule && obj instanceof Node
                && obj.shape.type === 'Bpmn' && obj.shape.annotations.length > 0) {
                this.bpmnModule.updateQuad(obj, this);
            }
            this.initObjectExtend(obj, layer, independentObj);
            this.nameTable[obj.id] = obj;
            if (obj instanceof Node && obj.children) {
                this.preventNodesUpdate = true;
                this.preventConnectorsUpdate = true;
                if (!group && !obj.container) {
                    this.updateGroupOffset(obj, true);
                }
                this.groupTable[obj.id] = obj.children;
                for (var i = 0; i < obj.children.length; i++) {
                    var node = (this.nameTable[obj.children[i]]);
                    if (node) {
                        node.parentId = obj.id;
                    }
                }
                if (!this.isLoading && obj.rotateAngle && !obj.container) {
                    this.commandHandler.rotateObjects(obj, [obj], obj.rotateAngle, { x: obj.offsetX, y: obj.offsetY }, false);
                }
                this.preventNodesUpdate = false;
                this.preventConnectorsUpdate = false;
            }
            if (this['enterObject'] === undefined) {
                this.updateQuad(obj);
            }
        }
        if (obj.visible === false) {
            this.updateElementVisibility(obj.wrapper, obj, false);
        }
    };
    /* tslint:enable */
    Diagram.prototype.getConnectedPort = function (node, connector, isSource) {
        if (node && node.ports) {
            for (var _i = 0, _a = node.ports; _i < _a.length; _i++) {
                var port = _a[_i];
                if (port.id === connector.sourcePortID && isSource) {
                    return port;
                }
                else if (port.id === connector.targetPortID && !isSource) {
                    return port;
                }
            }
        }
        return null;
    };
    Diagram.prototype.scaleObject = function (obj, size, isWidth) {
        var actualSize = isWidth ? obj.wrapper.actualSize.width : obj.wrapper.actualSize.height;
        var sw = (isWidth) ? 1 + ((size - actualSize) / actualSize) : 1;
        var sh = (isWidth) ? 1 : 1 + ((size - actualSize) / actualSize);
        var groupOffsetX = obj.offsetX;
        var groupOffsetY = obj.offsetY;
        this.realActions |= RealAction.PreventDrag;
        this.scale(obj, sw, sh, { x: 0.5, y: 0.5 });
        this.realActions &= ~RealAction.PreventDrag;
    };
    Diagram.prototype.updateDefaultLayoutIcons = function (node) {
        if (this.layout.type === 'OrganizationalChart' || this.layout.type === 'HierarchicalTree' ||
            this.layout.type === 'ComplexHierarchicalTree') {
            {
                this.updateDefaultLayoutIcon(node, node.expandIcon);
                this.updateDefaultLayoutIcon(node, node.collapseIcon);
            }
        }
    };
    Diagram.prototype.updateDefaultLayoutIcon = function (node, icon) {
        if (icon.shape !== 'None') {
            if (icon.horizontalAlignment === 'Auto' && icon.verticalAlignment === 'Auto' &&
                icon.offset.x === .5 && icon.offset.y === 1) {
                var iconWrapper = this.getWrapper(node.wrapper, 'icon_content');
                var offsetX = void 0;
                var offsetY = void 0;
                if (this.layout.orientation === 'TopToBottom' || this.layout.orientation === 'BottomToTop') {
                    offsetX = .5;
                    offsetY = this.layout.orientation === 'TopToBottom' ? 1 : 0;
                }
                else if (this.layout.orientation === 'RightToLeft' || this.layout.orientation === 'LeftToRight') {
                    offsetX = this.layout.orientation === 'LeftToRight' ? 1 : 0;
                    offsetY = .5;
                }
                iconWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                iconWrapper.horizontalAlignment = 'Center';
                iconWrapper.verticalAlignment = 'Center';
                node.wrapper.measure(new Size(node.wrapper.width, node.wrapper.height));
                node.wrapper.arrange(node.wrapper.desiredSize);
            }
        }
    };
    /**
     * @private
     */
    Diagram.prototype.updateGroupOffset = function (node, isUpdateSize) {
        var isUpdateGroupToBlazor = false;
        if ((node.children && node.children.length > 0 && (!node.container)) || (node.processId)) {
            var node1 = this.nameTable[node.id];
            if (!(this.realActions & RealAction.PreventScale) && !(this.realActions & RealAction.PreventDrag)) {
                if (node1.offsetX && ((this.realActions & RealAction.EnableGroupAction) ||
                    ((!(this.diagramActions & DiagramAction.UndoRedo)) && (!(this.diagramActions & DiagramAction.ToolAction)
                        && !(this.diagramActions & DiagramAction.PublicMethod))))) {
                    this.realActions |= RealAction.PreventScale;
                    var diffX = (node1.offsetX - node.wrapper.offsetX);
                    node1.offsetX = node.wrapper.offsetX;
                    var diffY = (node1.offsetY - node.wrapper.offsetY);
                    node1.offsetY = node.wrapper.offsetY;
                    if (node.flip === 'None') {
                        this.drag(node1, diffX, diffY);
                    }
                    this.realActions &= ~RealAction.PreventScale;
                }
                else {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(node1), true);
                        isUpdateGroupToBlazor = true;
                    }
                    node1.offsetX = node.wrapper.offsetX;
                }
                if (node1.offsetY && ((this.realActions & RealAction.EnableGroupAction) ||
                    ((!(this.diagramActions & DiagramAction.UndoRedo)) && (!(this.diagramActions & DiagramAction.ToolAction)
                        && !(this.diagramActions & DiagramAction.PublicMethod))))) {
                    this.realActions |= RealAction.PreventScale;
                    var diffY = (node1.offsetY - node.wrapper.offsetY);
                    node1.offsetY = node.wrapper.offsetY;
                    if (node.flip === 'None') {
                        this.drag(node1, 0, diffY);
                    }
                    this.realActions &= ~RealAction.PreventScale;
                }
                else {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(node1), true);
                        isUpdateGroupToBlazor = true;
                    }
                    node1.offsetY = node.wrapper.offsetY;
                }
                if (this.diagramActions) {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(node1), true);
                        isUpdateGroupToBlazor = true;
                    }
                    node1.width = node.wrapper.actualSize.width;
                    node1.height = node.wrapper.actualSize.height;
                }
            }
        }
        if (isUpdateSize) {
            if ((node.children && node.children.length > 0)) {
                if (this.nameTable[node.id].width !== undefined) {
                    this.scaleObject(node, this.nameTable[node.id].width, true);
                }
                else {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(this.nameTable[node.id]), true);
                        isUpdateGroupToBlazor = true;
                    }
                    this.nameTable[node.id].width = node.wrapper.actualSize.width;
                }
                if (this.nameTable[node.id].height !== undefined) {
                    this.scaleObject(node, this.nameTable[node.id].height, false);
                }
                else {
                    if (isBlazor()) {
                        this.insertValue(cloneObject(this.nameTable[node.id]), true);
                        isUpdateGroupToBlazor = true;
                    }
                    this.nameTable[node.id].height = node.wrapper.actualSize.height;
                }
            }
        }
        if (isUpdateGroupToBlazor && !(this.diagramActions & DiagramAction.UndoRedo) &&
            !(this.diagramActions & DiagramAction.ToolAction) &&
            !(this.diagramActions & DiagramAction.PublicMethod)) {
            this.commandHandler.getBlazorOldValues();
        }
    };
    Diagram.prototype.initNode = function (obj, diagramId, group) {
        var canvas = obj.initContainer();
        var portContainer = new Canvas();
        var content;
        if (!this.diagramSettings.inversedAlignment) {
            canvas.inversedAlignment = false;
        }
        if (!canvas.children) {
            canvas.children = [];
        }
        if (obj.children) {
            canvas.measureChildren = false;
            if (obj.container && (obj.container.type === 'Grid')) {
                for (var i = 0; i < obj.children.length; i++) {
                    var childCollection = new Canvas();
                    var child = this.nameTable[obj.children[i]];
                    childCollection.children = [];
                    childCollection.children.push(child.wrapper);
                    if (child) {
                        canvas.addObject(child.wrapper, child.rowIndex, child.columnIndex, child.rowSpan, child.columnSpan);
                    }
                }
            }
            else {
                for (var i = 0; i < obj.children.length; i++) {
                    if (this.nameTable[obj.children[i]]) {
                        var child = this.nameTable[obj.children[i]];
                        this.updateStackProperty(obj, child, i);
                        canvas.children.push(child.wrapper);
                        canvas.elementActions = canvas.elementActions | ElementAction.ElementIsGroup;
                        child.wrapper.flip = child.wrapper.flip === 'None' ?
                            obj.wrapper.flip : child.wrapper.flip;
                    }
                }
            }
            portContainer.id = obj.id + 'group_container';
            portContainer.style.fill = 'none';
            portContainer.style.strokeColor = 'none';
            portContainer.horizontalAlignment = 'Stretch';
            portContainer.verticalAlignment = 'Stretch';
            canvas.style = obj.style;
            portContainer.children = [];
            portContainer.preventContainer = true;
            if (obj.container) {
                portContainer.relativeMode = 'Object';
            }
            if (!obj.container || (obj.container.type !== 'Grid')) {
                canvas.children.push(portContainer);
            }
        }
        else {
            var setNodeTemplate = getFunction(this.setNodeTemplate);
            if (setNodeTemplate && obj.id !== 'helper') {
                content = setNodeTemplate(obj, this);
            }
            if (!content) {
                content = obj.init(this);
            }
            canvas.children.push(content);
        }
        // tslint:disable-next-line:no-any
        var wrapperContent;
        wrapperContent = getFunction(this.getDescription);
        if (wrapperContent) {
            (obj.children ? canvas : content).description = wrapperContent;
        }
        else {
            (obj.children ? canvas : content).description = obj.annotations.length ? obj.annotations[0].content : obj.id;
        }
        var container = obj.children ? portContainer : canvas;
        obj.initAnnotations(this.getDescription, container, this.element.id, canVitualize(this) ? true : false, this.annotationTemplate);
        obj.initPorts(this.getDescription, container);
        obj.initIcons(this.getDescription, this.layout, container, diagramId);
        for (var i = 0; obj.fixedUserHandles !== undefined, i < obj.fixedUserHandles.length; i++) {
            var fixedUserHandles = obj.initfixedUserHandles(obj.fixedUserHandles[i]);
            container.children.push(fixedUserHandles);
        }
        if (obj.shape.type === 'SwimLane' && obj.wrapper && obj.wrapper.children.length > 0 &&
            obj.wrapper.children[0] instanceof GridPanel) {
            swimLaneMeasureAndArrange(obj);
            arrangeChildNodesInSwimLane(this, obj);
            this.updateDiagramElementQuad();
        }
        else {
            canvas.measure(new Size(obj.width, obj.height), obj.id, this.onLoadImageSize.bind(this));
            if (canvas instanceof GridPanel) {
                canvas.arrange(canvas.desiredSize, true);
            }
            else {
                canvas.arrange(canvas.desiredSize);
            }
        }
        if (obj.wrapper.flip !== 'None' && obj.wrapper.elementActions & ElementAction.ElementIsGroup) {
            alignElement(obj.wrapper, obj.wrapper.offsetX, obj.wrapper.offsetY, this, obj.wrapper.flip);
        }
        if (obj instanceof Node && obj.container && (obj.width < canvas.outerBounds.width || obj.height < canvas.outerBounds.height) &&
            canvas.bounds.x <= canvas.outerBounds.x && canvas.bounds.y <= canvas.outerBounds.y) {
            obj.width = canvas.width = canvas.outerBounds.width;
            obj.height = canvas.height = canvas.outerBounds.height;
            canvas.measure(new Size(obj.width, obj.height));
            canvas.arrange(canvas.desiredSize);
        }
        if (obj.container && obj.container.type === 'Grid' && obj.children && obj.children.length > 0) {
            this.updateChildPosition(obj);
        }
    };
    /** @private */
    Diagram.prototype.updateDiagramElementQuad = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].wrapper && (this.nodes[i].wrapper instanceof Container)) {
                this.updateQuad(this.nodes[i]);
            }
        }
    };
    Diagram.prototype.onLoadImageSize = function (id, size) {
        var obj = this.getObject(id);
        var image = document.getElementById(id + 'sf-imageNode');
        if (image) {
            image.parentNode.removeChild(image);
        }
        this.nodePropertyChange(obj, {}, { width: size.width, height: size.height });
        var args = { element: cloneObject(obj), size: size };
        this.triggerEvent(DiagramEvent.onImageLoad, args);
    };
    Diagram.prototype.updateChildPosition = function (obj) {
        for (var i = 0; i < obj.children.length; i++) {
            var child = this.getObject(obj.children[i]);
            child.offsetX = child.wrapper.offsetX;
            child.offsetY = child.wrapper.offsetY;
            if (child.children && child.children.length > 0) {
                this.updateChildPosition(child);
            }
        }
    };
    Diagram.prototype.canExecute = function () {
        return true;
    };
    Diagram.prototype.updateStackProperty = function (obj, child, index) {
        if (obj.container && obj.container.type === 'Stack') {
            if (!child.width) {
                child.wrapper.horizontalAlignment = 'Stretch';
                child.horizontalAlignment = 'Stretch';
            }
            if (!child.height) {
                child.verticalAlignment = 'Stretch';
                child.wrapper.verticalAlignment = 'Stretch';
            }
            if (index && obj.shape.type === 'UmlClassifier') {
                child.umlIndex = index;
            }
        }
    };
    Diagram.prototype.initViews = function () {
        if (!this.isLoading) {
            this.views.push(this.element.id);
            this.views[this.element.id] = this;
        }
    };
    Diagram.prototype.initCommands = function () {
        var i;
        var newCommands = this.commandManager.commands;
        var commands = {
            'copy': {
                execute: this.copyCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.C, keyModifiers: KeyModifiers.Control }
            },
            'paste': {
                execute: this.pasteCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.V, keyModifiers: KeyModifiers.Control }
            },
            'cut': {
                execute: this.cutCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.X, keyModifiers: KeyModifiers.Control }
            },
            'delete': {
                execute: this.removeCommand.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Delete }
            },
            'selectAll': {
                execute: this.selectAll.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.A, keyModifiers: KeyModifiers.Control }
            },
            'undo': {
                execute: this.undo.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Z, keyModifiers: KeyModifiers.Control }
            },
            'redo': {
                execute: this.redo.bind(this), canExecute: this.canExecute.bind(this),
                gesture: { key: Keys.Y, keyModifiers: KeyModifiers.Control }
            },
            'nudgeUp': {
                execute: this.nudgeCommand.bind(this, 'Up'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Up },
                parameter: 'up'
            },
            'nudgeRight': {
                execute: this.nudgeCommand.bind(this, 'Right'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Right },
                parameter: 'right'
            },
            'nudgeDown': {
                execute: this.nudgeCommand.bind(this, 'Down'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Down },
                parameter: 'down'
            },
            'nudgeLeft': {
                execute: this.nudgeCommand.bind(this, 'Left'),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Left },
                parameter: 'left'
            },
            'startEdit': {
                execute: this.startEditCommad.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.F2 }
            },
            'endEdit': {
                execute: this.endEditCommand.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Escape }
            },
            'focusToNextItem': {
                // execute: this.focusToItem.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Tab }
            },
            'focusToPreviousItem': {
                // execute: this.focusToItem.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Tab, keyModifiers: KeyModifiers.Control }
            },
            'selectFocusedItem': {
                execute: this.startEditCommad.bind(this),
                canExecute: this.canExecute.bind(this), gesture: { key: Keys.Enter }
            },
        };
        this.initCommandManager(newCommands, commands);
    };
    Diagram.prototype.overrideCommands = function (newCommand, commands) {
        var command;
        for (var _i = 0, _a = Object.keys(commands); _i < _a.length; _i++) {
            var key = _a[_i];
            command = commands[key];
            if (newCommand.gesture.key === command.gesture.key && newCommand.gesture.keyModifiers === command.gesture.keyModifiers) {
                delete commands[key];
                break;
            }
        }
    };
    Diagram.prototype.initCommandManager = function (newCommands, commands) {
        var i = 0;
        if (newCommands) {
            for (i = 0; i < newCommands.length; i++) {
                if (commands[newCommands[i].name] && newCommands[i]) {
                    if (newCommands[i].canExecute) {
                        commands[newCommands[i].name].canExecute = newCommands[i].canExecute;
                    }
                    if (newCommands[i].execute) {
                        commands[newCommands[i].name].execute = newCommands[i].execute;
                    }
                    if (newCommands[i].gesture.key || newCommands[i].gesture.keyModifiers) {
                        commands[newCommands[i].name].gesture = newCommands[i].gesture;
                    }
                    if (newCommands[i].parameter !== '') {
                        commands[newCommands[i].name].parameter = newCommands[i].parameter;
                    }
                }
                else {
                    this.overrideCommands(newCommands[i], commands);
                    commands[newCommands[i].name] = {
                        execute: newCommands[i].execute, canExecute: newCommands[i].canExecute, gesture: newCommands[i].gesture,
                        parameter: newCommands[i].parameter
                    };
                }
            }
        }
        this.commands = commands;
    };
    /** @private */
    Diagram.prototype.updateNodeEdges = function (node) {
        for (var _i = 0, _a = node.inEdges; _i < _a.length; _i++) {
            var edge = _a[_i];
            if (this.nameTable[edge]) {
                this.nameTable[edge].targetID = '';
            }
        }
        for (var _b = 0, _c = node.outEdges; _b < _c.length; _b++) {
            var edge = _c[_b];
            if (this.nameTable[edge]) {
                this.nameTable[edge].sourceID = '';
            }
        }
        node.inEdges = [];
        node.outEdges = [];
    };
    /** @private */
    Diagram.prototype.updateIconVisibility = function (node, visibility) {
        for (var i = 0; i < node.wrapper.children.length; i++) {
            var child = node.wrapper.children[i];
            if (child.id) {
                var id = child.id.split(node.id)[1];
                if (id && id.match('^_icon')) {
                    child.visible = visibility;
                    this.updateDiagramContainerVisibility(child, visibility);
                }
            }
        }
    };
    /** @private */
    Diagram.prototype.updateEdges = function (obj) {
        if (obj.sourceID !== undefined && obj.sourceID !== '') {
            var node = this.nameTable[obj.sourceID];
            if (node && node.outEdges && node.outEdges.length === 0) {
                node.outEdges = [];
            }
            if (node && node.outEdges && node.outEdges.indexOf(obj.id) === -1) {
                node.outEdges.push(obj.id);
            }
            this.updatePortEdges(node, obj, false);
        }
        if (obj.targetID !== undefined && obj.targetID !== '') {
            var node = this.nameTable[obj.targetID];
            if (node && node.inEdges && node.inEdges.length === 0) {
                node.inEdges = [];
            }
            if (node && node.inEdges && node.inEdges.indexOf(obj.id) === -1) {
                node.inEdges.push(obj.id);
            }
            this.updatePortEdges(node, obj, true);
            if (node && node.visible && node.outEdges) {
                var value = node.outEdges.length === 0 ? false : true;
                this.updateIconVisibility(node, value);
            }
        }
    };
    /** @private */
    Diagram.prototype.updatePortEdges = function (node, obj, isInEdges) {
        if (node) {
            for (var i = 0; i < node.ports.length; i++) {
                var port = node.ports[i];
                var portId = (isInEdges) ? obj.targetPortID : obj.sourcePortID;
                if (port.id === portId) {
                    var portEdges = (isInEdges) ? port.inEdges : port.outEdges;
                    if (portEdges.indexOf(obj.id) === -1) {
                        portEdges.push(obj.id);
                    }
                }
            }
        }
    };
    /** @private */
    Diagram.prototype.refreshDiagram = function () {
        this.initLayerObjects();
        this.doLayout();
        this.updateBridging();
        this.scroller.setSize();
        this.addBlazorDiagramObjects();
        if (isBlazor() && this.layout && this.layout.layoutInfo && this.layout.layoutInfo.isRootInverse && this.nodes.length > 2) {
            var rootNode = this.nodes[0];
            if (rootNode.outEdges.length > 1) {
                var isProtectedChange = this.isProtectedOnChange;
                for (var i = 1; i < rootNode.outEdges.length; i++) {
                    var connector = this.nameTable[rootNode.outEdges[i]];
                    var isAllowServerUpdate = this.allowServerDataBinding;
                    this.protectPropertyChange(false);
                    this.enableServerDataBinding(false);
                    this.preventDiagramUpdate = true;
                    var target = this.getObject(connector.targetID);
                    // tslint:disable-next-line:no-any
                    if (target.data.Branch === 'Left') {
                        connector.sourcePortID = rootNode.ports[1].id;
                    }
                    this.dataBind();
                    this.preventDiagramUpdate = false;
                    this.enableServerDataBinding(isAllowServerUpdate);
                    this.protectPropertyChange(isProtectedChange);
                }
            }
        }
        if (isBlazor()) {
            var view = void 0;
            for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
                var temp = _a[_i];
                view = this.views[temp];
                if (view.renderDocument) {
                    view.renderDocument(view);
                    view.diagramRenderer.setLayers();
                    view.updateView(view);
                    this.renderNodes(view);
                }
            }
        }
        this.updateFitToPage();
    };
    Diagram.prototype.updateCanupdateStyle = function (element, value) {
        for (var j = 0; j < element.length; j++) {
            if (element[j].children) {
                this.updateCanupdateStyle(element[j].children, value);
            }
            element[j].canApplyStyle = value;
        }
    };
    Diagram.prototype.getZindexPosition = function (obj, viewId) {
        var objects = [];
        var index = undefined;
        objects = objects.concat(this.nodes);
        objects = objects.concat(this.connectors);
        var type;
        if (obj.zIndex !== -1) {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].zIndex > obj.zIndex) {
                    if (obj.shape.type === 'HTML' || obj.shape.type === 'Native') {
                        type = obj.shape.type === 'HTML' ? 'html' : 'native';
                    }
                    index = getDomIndex(viewId, objects[i].id, type);
                    break;
                }
            }
        }
        return index;
    };
    /** @private */
    Diagram.prototype.updateDiagramObject = function (obj, canIgnoreIndex, isUpdateObject) {
        var view;
        var domTable = 'domTable';
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var temp = _a[_i];
            view = this.views[temp];
            if (this.diagramActions) {
                if (view.mode === 'SVG') {
                    var hasLayers = this.layers.length > 1;
                    var layer = void 0;
                    if (hasLayers) {
                        layer = this.commandHandler.getObjectLayer(obj.id);
                    }
                    if ((layer === undefined || (layer && layer.visible)) || isUpdateObject) {
                        var htmlLayer = getHTMLLayer(this.element.id);
                        if (!window[domTable][view.element.id + '_diagramLayer']) {
                            window[domTable][view.element.id + '_diagramLayer'] =
                                document.getElementById(view.element.id + '_diagramLayer');
                        }
                        var diagramElementsLayer = window[domTable][view.element.id + '_diagramLayer'];
                        if (this.diagramActions & DiagramAction.Interactions) {
                            this.updateCanupdateStyle(obj.wrapper.children, true);
                        }
                        this.diagramRenderer.updateNode(obj.wrapper, diagramElementsLayer, htmlLayer, undefined, canIgnoreIndex ? undefined : this.getZindexPosition(obj, view.element.id));
                        this.updateCanupdateStyle(obj.wrapper.children, true);
                    }
                }
            }
        }
    };
    /** @private  */
    Diagram.prototype.updateGridContainer = function (grid) {
        var view;
        var htmlLayer = getHTMLLayer(this.element.id);
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var temp = _a[_i];
            view = this.views[temp];
            if (view.mode === 'SVG' && this.diagramActions) {
                var diagramElementsLayer = document.getElementById(view.element.id + '_diagramLayer');
                this.diagramRenderer.updateNode(grid, diagramElementsLayer, htmlLayer, undefined);
            }
            else {
                this.refreshCanvasDiagramLayer(view);
            }
        }
    };
    /** @private  */
    Diagram.prototype.getObjectsOfLayer = function (objectArray) {
        var nodeArray = [];
        for (var _i = 0, objectArray_1 = objectArray; _i < objectArray_1.length; _i++) {
            var obj = objectArray_1[_i];
            if (this.nameTable[obj]) {
                nodeArray.push(this.nameTable[obj]);
            }
        }
        return nodeArray;
    };
    /** @private */
    Diagram.prototype.refreshDiagramLayer = function () {
        var view;
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var temp = _a[_i];
            view = this.views[temp];
            switch (view.mode) {
                case 'SVG':
                    this.refreshSvgDiagramLayer(view);
                    break;
                case 'Canvas':
                    this.refreshCanvasLayers(view);
                    break;
            }
        }
    };
    /** @private */
    Diagram.prototype.refreshCanvasLayers = function (view) {
        if (!view) {
            for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
                var temp = _a[_i];
                var view_1 = this.views[temp];
                this.refreshCanvasDiagramLayer(view_1);
            }
        }
        else {
            this.refreshCanvasDiagramLayer(view);
        }
    };
    Diagram.prototype.renderBasicElement = function (view) {
        var htmlLayer = getHTMLLayer(view.element.id);
        for (var i = 0; i < this.basicElements.length; i++) {
            var element = this.basicElements[i];
            if (element instanceof Container) {
                element.prevRotateAngle = 0;
            }
            element.measure(new Size(element.width, element.height));
            element.arrange(element.desiredSize);
            view.diagramRenderer.renderElement(element, view.diagramLayer, htmlLayer);
        }
    };
    Diagram.prototype.refreshElements = function (view) {
        if (!this.isDestroyed) {
            this.clearCanvas(view);
            if (view instanceof Diagram) {
                view.diagramLayer.getContext('2d').setTransform(view.scroller.currentZoom, 0, 0, view.scroller.currentZoom, 0, 0);
                view.diagramLayer.getContext('2d').scale(1.5, 1.5);
            }
            var htmlLayer = getHTMLLayer(view.element.id);
            var bounds = this.spatialSearch.getPageBounds();
            this.renderDiagramElements(view.diagramLayer, view.diagramRenderer, htmlLayer);
            for (var i = 0; i < this.basicElements.length; i++) {
                var element = this.basicElements[i];
                element.measure(new Size(element.width, element.height));
                element.arrange(element.desiredSize);
                view.diagramRenderer.renderElement(element, view.diagramLayer, htmlLayer);
            }
            if (view instanceof Diagram) {
                view.diagramLayer.style.transform = 'scale(' + (2 / 3) + ')';
                view.diagramLayer.style.transformOrigin = '0 0';
            }
            this.renderTimer = null;
        }
    };
    /** @private */
    Diagram.prototype.refreshCanvasDiagramLayer = function (view) {
        var _this = this;
        if (view.mode !== 'SVG' && !this.isDestroyed) {
            if (this.basicElements.length > 0) {
                this.renderBasicElement(view);
            }
            if ((!this.diagramActions || (this.diagramActions & DiagramAction.Render) === 0)
                || (DiagramAction.ToolAction & this.diagramActions) || canVitualize(this) || (this.scroller.currentZoom !== 1)) {
                this.refreshElements(view);
            }
            else if (!this.renderTimer) {
                this.renderTimer = setTimeout(function () {
                    _this.refreshElements(view);
                }, 40);
            }
        }
    };
    /** @private */
    Diagram.prototype.updatePortVisibility = function (node, portVisibility, inverse) {
        var portElement;
        var drawingObject = !(this.drawingObject && this.drawingObject.shape) ? true : false;
        if (node instanceof Node && drawingObject && canMove(node)) {
            var ports = node.ports;
            var changed = false;
            for (var i = 0; i < ports.length; i++) {
                portElement = this.getWrapper(node.wrapper, ports[i].id);
                if ((portVisibility & PortVisibility.Hover || portVisibility & PortVisibility.Connect)) {
                    if (checkPortRestriction(ports[i], portVisibility)) {
                        portElement.visible = !inverse;
                        changed = true;
                    }
                }
            }
            if (changed) {
                this.updateDiagramObject(node);
            }
        }
    };
    /** @private */
    Diagram.prototype.refreshSvgDiagramLayer = function (view) {
        var element;
        var diagramElementsLayer = document.getElementById(view.element.id + '_diagramLayer');
        var htmlLayer = getHTMLLayer(view.element.id);
        if (!canVitualize(this)) {
            for (var i = 0; i < this.basicElements.length; i++) {
                element = this.basicElements[i];
                element.measure(new Size(element.width, element.height));
                element.arrange(element.desiredSize, (!(this.diagramActions & DiagramAction.Render) ? true : false));
                this.diagramRenderer.renderElement(element, diagramElementsLayer, htmlLayer);
            }
            this.renderDiagramElements(diagramElementsLayer, this.diagramRenderer, htmlLayer);
        }
        else {
            this.scroller.virtualizeElements();
        }
    };
    /** @private */
    Diagram.prototype.removeVirtualObjects = function (clearIntervalVal) {
        if (this.deleteVirtualObject) {
            for (var i = 0; i < this.scroller.removeCollection.length; i++) {
                var obj = this.nameTable[this.scroller.removeCollection[i]];
                this.removeElements(obj);
            }
            this.deleteVirtualObject = false;
        }
        clearInterval(clearIntervalVal);
    };
    /** @private */
    Diagram.prototype.updateTextElementValue = function (object) {
        for (var j = 0; j < object.wrapper.children.length; j++) {
            var element = object.wrapper.children[j];
            if (element instanceof TextElement) {
                element.canMeasure = true;
                element.measure(new Size(object.width, object.height));
                element.arrange(element.desiredSize);
            }
        }
    };
    /** @private */
    Diagram.prototype.updateVirtualObjects = function (collection, remove, tCollection) {
        var diagramElementsLayer = document.getElementById(this.element.id + '_diagramLayer');
        var htmlLayer = getHTMLLayer(this.element.id);
        if (this.mode === 'SVG') {
            for (var i = 0; i < collection.length; i++) {
                var index = this.scroller.removeCollection.indexOf(collection[i]);
                if (index >= 0) {
                    this.scroller.removeCollection.splice(index, 1);
                }
                var object = this.nameTable[collection[i]];
                this.updateTextElementValue(object);
                this.diagramRenderer.renderElement(object.wrapper, diagramElementsLayer, htmlLayer, undefined, undefined, undefined, undefined, object.zIndex);
            }
            for (var k = 0; k < tCollection.length; k++) {
                this.scroller.removeCollection.push(tCollection[k]);
            }
            if (this.scroller.currentZoom !== 1) {
                this.eventHandler.updateVirtualization();
            }
        }
        else if (this.diagramActions) {
            this.refreshDiagramLayer();
        }
    };
    /** @private */
    Diagram.prototype.renderDiagramElements = function (canvas, renderer, htmlLayer, transform, fromExport, isOverView) {
        if (transform === void 0) { transform = true; }
        var pageBounds = this.scroller.getPageBounds();
        pageBounds.x *= this.scroller.currentZoom;
        pageBounds.y *= this.scroller.currentZoom;
        pageBounds.width *= this.scroller.currentZoom;
        pageBounds.height *= this.scroller.currentZoom;
        var difX = -this.scroller.horizontalOffset - pageBounds.x;
        var difY = -this.scroller.verticalOffset - pageBounds.y;
        for (var _i = 0, _a = Object.keys(this.layerZIndexTable); _i < _a.length; _i++) {
            var layerId = _a[_i];
            var layer = this.commandHandler.getLayer(this.layerZIndexTable[layerId]);
            var left = void 0;
            var top_1 = void 0;
            if (this.mode === 'Canvas' && canVitualize(this) && !this.diagramActions) {
                this.scroller.virtualizeElements();
            }
            var id = (this.mode === 'Canvas' && canVitualize(this) &&
                this.scroller.oldCollectionObjects.length > 0) ?
                this.scroller.oldCollectionObjects : undefined;
            for (var _b = 0, _c = Object.keys(id || layer.zIndexTable); _b < _c.length; _b++) {
                var node = _c[_b];
                var renderNode = id ? this.nameTable[id[node]] : this.nameTable[layer.zIndexTable[node]];
                if (renderNode && !(renderNode.parentId) && layer.visible &&
                    (!(renderNode.processId) || this.refreshing)) {
                    var transformValue = {
                        tx: this.scroller.transform.tx,
                        ty: this.scroller.transform.ty,
                        scale: this.scroller.transform.scale
                    };
                    if (canVitualize(this)) {
                        if (this.scroller.currentZoom < 1) {
                            if (pageBounds.x < 0 || this.scroller.horizontalOffset < 0) {
                                var verticalValue = this.scroller.verticalOffset < 0 ? this.scroller.verticalOffset : 0;
                                left = (difX > 0 ? difX : 0) + 'px';
                                top_1 = ((this.realActions & RealAction.vScrollbarMoved) ? 0 : -verticalValue) + 'px';
                            }
                            else {
                                left = 0 + 'px';
                                top_1 = 0 + 'px';
                            }
                            if (this.realActions & RealAction.hScrollbarMoved) {
                                this.realActions = this.realActions & ~RealAction.hScrollbarMoved;
                            }
                            if (this.realActions & RealAction.vScrollbarMoved) {
                                this.realActions = this.realActions & ~RealAction.vScrollbarMoved;
                            }
                        }
                        else {
                            left = (pageBounds.x < 0 ? difX : -this.scroller.horizontalOffset) + 'px';
                            top_1 = (pageBounds.y < 0 ? difY : -this.scroller.verticalOffset) + 'px';
                        }
                        this.diagramLayer.style.left = left;
                        this.diagramLayer.style.top = top_1;
                        transformValue.tx = this.scroller.horizontalOffset / transformValue.scale;
                        transformValue.ty = this.scroller.verticalOffset / transformValue.scale;
                    }
                    var status_1 = true;
                    if (fromExport) {
                        status_1 = false;
                    }
                    this.updateTextElementValue(renderNode);
                    if (this.refreshing) {
                        if (renderNode.shape.activity && renderNode.shape.activity.subProcess
                            && renderNode.shape.activity.subProcess.processes) {
                            for (var i = 0; i < renderNode.shape.activity.subProcess.processes.length; i++) {
                                var process = renderNode.shape.activity.subProcess.processes[i];
                                renderNode.wrapper.children.push(this.nameTable[process].wrapper);
                            }
                            renderNode.wrapper.measure(new Size(renderNode.wrapper.bounds.width, renderNode.wrapper.bounds.height));
                            renderNode.wrapper.arrange(renderNode.wrapper.desiredSize);
                        }
                    }
                    renderer.renderElement(renderNode.wrapper, canvas, htmlLayer, (!renderer.isSvgMode && transform) ? transformValue : undefined, undefined, undefined, status_1 && (!this.diagramActions || isOverView));
                }
            }
        }
    };
    /** @private */
    Diagram.prototype.updateBridging = function (isLoad) {
        if (this.bridgingModule) {
            for (var i = 0; i < this.connectors.length; i++) {
                var connector = this.connectors[i];
                this.bridgingModule.updateBridging(connector, this);
                var canvas = this.connectors[i].wrapper;
                if (canvas) {
                    var pathSegment = canvas.children[0];
                    var data = pathSegment.data;
                    connector.getSegmentElement(connector, pathSegment, this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree' ?
                        this.layout.orientation : undefined);
                    if (pathSegment.data !== data) {
                        canvas.measure(new Size());
                        canvas.arrange(canvas.desiredSize);
                        if (this.mode === 'SVG' && !isLoad) {
                            this.updateDiagramObject(connector);
                        }
                    }
                }
            }
        }
    };
    /** @private */
    Diagram.prototype.setCursor = function (cursor) {
        this.diagramRenderer.setCursor(this.diagramCanvas, cursor);
    };
    /** @private */
    Diagram.prototype.clearCanvas = function (view) {
        var width;
        var height;
        width = view.contentWidth || view.diagramLayer.width / this.scroller.currentZoom;
        height = view.contentHeight || view.diagramLayer.height / this.scroller.currentZoom;
        if (view.mode !== 'SVG') {
            var ctx = CanvasRenderer.getContext(view.diagramLayer);
            ctx.clearRect(0, 0, width, height);
        }
    };
    /** @private */
    Diagram.prototype.updateScrollOffset = function () {
        this.scroller.setScrollOffset(this.diagramCanvas.scrollLeft, this.diagramCanvas.scrollTop);
        updateRuler(this);
        if (canVitualize(this)) {
            this.scroller.virtualizeElements();
        }
    };
    /** @private */
    Diagram.prototype.setOffset = function (offsetX, offsetY) {
        var domTable = 'domTable';
        if (!window[domTable][this.element.id + 'content']) {
            window[domTable][this.element.id + 'content'] = document.getElementById(this.element.id + 'content');
        }
        var container = window[domTable][this.element.id + 'content'];
        if (container) {
            container.scrollLeft = offsetX;
            container.scrollTop = offsetY;
        }
    };
    /** @private */
    Diagram.prototype.setSize = function (width, height) {
        if (this.diagramLayer && !this.preventDiagramUpdate) {
            var position = getRulerSize(this);
            width -= position.width;
            height -= position.height;
            var bounds = this.spatialSearch.getPageBounds();
            bounds.x *= this.scroller.currentZoom;
            bounds.y *= this.scroller.currentZoom;
            bounds.width *= this.scroller.currentZoom;
            bounds.height *= this.scroller.currentZoom;
            var factor = this.mode === 'SVG' ? 1 : 1.5;
            var diagramLayer = this.mode === 'SVG' ?
                getDiagramLayerSvg(this.element.id) : this.diagramLayer;
            var w = (this.mode === 'Canvas' &&
                (this.constraints & DiagramConstraints.Virtualization)) ? this.scroller.viewPortWidth : width;
            var h = (this.mode === 'Canvas' &&
                (this.constraints & DiagramConstraints.Virtualization)) ? this.scroller.viewPortHeight : height;
            diagramLayer.setAttribute('width', (factor * w).toString());
            diagramLayer.setAttribute('height', (factor * h).toString());
            var hiddenUserHandleTemplate = document.getElementById(this.element.id + '_diagramUserHandleLayer');
            if (hiddenUserHandleTemplate) {
                hiddenUserHandleTemplate.style.width = width + 'px';
                hiddenUserHandleTemplate.style.height = height + 'px';
            }
            var attr = { 'width': width.toString(), 'height': height.toString() };
            this.diagramLayerDiv.style.width = width + 'px';
            this.diagramLayerDiv.style.height = height + 'px';
            setAttributeSvg(getNativeLayerSvg(this.element.id), attr);
            setAttributeSvg(getPortLayerSvg(this.element.id), attr);
            var adornerSVG = getAdornerLayerSvg(this.element.id);
            setAttributeSvg(adornerSVG, attr);
            adornerSVG.parentNode.style.width = width + 'px';
            adornerSVG.parentNode.style.height = height + 'px';
            var gridLayer = getGridLayerSvg(this.element.id);
            setAttributeSvg(gridLayer, attr);
            this.diagramRenderer.updateGrid(this.snapSettings, gridLayer, this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler);
            setAttributeSvg(getBackgroundLayerSvg(this.element.id), attr);
            this.htmlLayer.style.width = width + 'px';
            this.htmlLayer.style.height = height + 'px';
            if (this.mode !== 'SVG' && !(canVitualize(this))) {
                this.refreshDiagramLayer();
            }
            if (this.mode === 'SVG' && canVitualize(this)) {
                this.scroller.virtualizeElements();
            }
        }
    };
    /** @private */
    Diagram.prototype.transformLayers = function () {
        var bounds = this.spatialSearch.getPageBounds();
        bounds.x *= this.scroller.currentZoom;
        bounds.y *= this.scroller.currentZoom;
        bounds.width *= this.scroller.currentZoom;
        bounds.height *= this.scroller.currentZoom;
        this.diagramRenderer.updateGrid(this.snapSettings, getGridLayerSvg(this.element.id), this.scroller.transform, this.rulerSettings, this.hRuler, this.vRuler);
        this.diagramRenderer.transformLayers(this.scroller.transform, this.mode === 'SVG');
        if (!(this.diagramActions & DiagramAction.DragUsingMouse)) {
            this.updateSelector();
        }
        this.renderPageBreaks(bounds);
    };
    /**
     * Defines how to remove the Page breaks
     * @private
     */
    Diagram.prototype.removePageBreaks = function () {
        if (this.diagramLayer) {
            var line = getBackgroundLayer(this.element.id);
            if (line && line.childNodes) {
                var length_1 = line.childNodes.length;
                for (var i = 0; i < length_1; i++) {
                    line.removeChild(line.childNodes[0]);
                }
            }
        }
    };
    /**
     * Defines how the page breaks has been rendered
     * @private
     */
    Diagram.prototype.renderPageBreaks = function (bounds) {
        this.removePageBreaks();
        var backgroundLayer = getBackgroundLayer(this.element.id);
        if (backgroundLayer) {
            var i = 0;
            bounds = this.scroller.getPageBounds(true);
            var x = (this.scroller.transform.tx + bounds.x) * this.scroller.currentZoom;
            var y = (this.scroller.transform.ty + bounds.y) * this.scroller.currentZoom;
            var height = bounds.height * this.scroller.currentZoom;
            var width = bounds.width * this.scroller.currentZoom;
            DiagramRenderer.renderSvgBackGroundImage(this.pageSettings.background, this.element, x, y, width, height);
            var options = {
                id: backgroundLayer.id + 'rect', x: x,
                y: y,
                height: height,
                width: width, angle: 0, stroke: '', strokeWidth: 1,
                fill: this.pageSettings.background.color, opacity: 1,
                pivotX: 0, pivotY: 0, visible: true, dashArray: '0',
            };
            this.diagramRenderer.drawRect(backgroundLayer, options);
            if (this.pageSettings.showPageBreaks) {
                var collection = this.scroller.getPageBreak(bounds);
                for (i = 0; i < collection.length; i++) {
                    this.diagramRenderer.drawLine(backgroundLayer, {
                        class: 'e-diagram-page-break',
                        fill: 'none', stroke: '#aaaaaa', strokeWidth: 1, dashArray: '10 10',
                        opacity: 2, x: 0, y: 0, width: 0, height: 0, angle: 0, pivotX: 0, pivotY: 0, visible: true,
                        startPoint: {
                            x: (collection[i].x1 + this.scroller.transform.tx) * this.scroller.currentZoom,
                            y: (collection[i].y1 + this.scroller.transform.ty) * this.scroller.currentZoom
                        },
                        endPoint: {
                            x: (collection[i].x2 + this.scroller.transform.tx) * this.scroller.currentZoom,
                            y: (collection[i].y2 + this.scroller.transform.ty) * this.scroller.currentZoom
                        }, id: collection[i].y1 === collection[i].y2 ? 'HorizontalLines' : 'VerticalLines'
                    });
                }
            }
        }
    };
    Diagram.prototype.validatePageSize = function () {
        var temp = 0;
        if (this.pageSettings.orientation === 'Portrait') {
            if (this.pageSettings.width > this.pageSettings.height) {
                temp = this.pageSettings.height;
                this.pageSettings.height = this.pageSettings.width;
                this.pageSettings.width = temp;
            }
        }
        else {
            if (this.pageSettings.height > this.pageSettings.width) {
                temp = this.pageSettings.width;
                this.pageSettings.width = this.pageSettings.height;
                this.pageSettings.height = temp;
            }
        }
    };
    /**
     * @private
     */
    Diagram.prototype.setOverview = function (overview, id) {
        if (overview) {
            if (overview) {
                this.views.push(overview.id);
                this.views[overview.id] = overview;
                overview.renderDocument(overview);
                overview.diagramRenderer.setLayers();
                overview.updateView(overview);
                this.renderNodes(overview);
            }
        }
        else {
            for (var i = 0; i < this.views.length; i++) {
                if (this.views[i] === id) {
                    overview = (this.views[id]);
                }
            }
            this.views[id] = undefined;
            var index = this.views.indexOf(id);
            this.views.splice(index, 1);
        }
    };
    Diagram.prototype.renderNodes = function (overview) {
        if (overview) {
            var renderer = new DiagramRenderer(overview.id, new SvgRenderer(), false);
            var g = document.getElementById(overview.element.id + '_diagramLayer');
            var htmlLayer = getHTMLLayer(overview.element.id);
            this.renderDiagramElements(g, overview.diagramRenderer || renderer, htmlLayer, undefined, undefined, true);
        }
    };
    Diagram.prototype.updateThumbConstraints = function (node, selectorModel, canInitialize) {
        var state = 0;
        var length = node.length;
        for (var i = 0; i < length; i++) {
            var obj = node[i];
            var hideRotate = false;
            var hideResize = false;
            var thumbConstraints = selectorModel.thumbsConstraints;
            if (obj instanceof Node) {
                hideRotate = (obj.shape.type === 'Bpmn' && (obj.shape.shape === 'Activity' &&
                    (obj.shape.activity.subProcess.collapsed === false)) ||
                    obj.shape.shape === 'TextAnnotation');
                hideResize = (obj.shape.type === 'Bpmn' && obj.shape.shape === 'TextAnnotation');
                if (!canRotate(obj) || !(thumbConstraints & ThumbsConstraints.Rotate) || hideRotate) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.Rotate;
                }
                if (!canResize(obj, 'SouthEast') || !(thumbConstraints & ThumbsConstraints.ResizeSouthEast) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeSouthEast;
                }
                if (!canResize(obj, 'NorthWest') || !(thumbConstraints & ThumbsConstraints.ResizeNorthWest) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeNorthWest;
                }
                if (!canResize(obj, 'East') || !(thumbConstraints & ThumbsConstraints.ResizeEast) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeEast;
                }
                if (!canResize(obj, 'West') || !(thumbConstraints & ThumbsConstraints.ResizeWest) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeWest;
                }
                if (!canResize(obj, 'North') || !(thumbConstraints & ThumbsConstraints.ResizeNorth) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeNorth;
                }
                if (!canResize(obj, 'South') || !(thumbConstraints & ThumbsConstraints.ResizeSouth) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeSouth;
                }
                if (!canResize(obj, 'NorthEast') || !(thumbConstraints & ThumbsConstraints.ResizeNorthEast) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeNorthEast;
                }
                if (!canResize(obj, 'SouthWest') || !(thumbConstraints & ThumbsConstraints.ResizeSouthWest) || hideResize) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ResizeSouthWest;
                }
            }
            else if (obj instanceof Connector) {
                if (!canInitialize) {
                    thumbConstraints = thumbConstraints | ThumbsConstraints.Default;
                }
                if (canDragSourceEnd(obj)) {
                    thumbConstraints = thumbConstraints | ThumbsConstraints.ConnectorSource;
                }
                else {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ConnectorSource;
                }
                if (canDragTargetEnd(obj)) {
                    thumbConstraints = thumbConstraints | ThumbsConstraints.ConnectorTarget;
                }
                else {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.ConnectorTarget;
                }
            }
            else {
                if (!canInitialize) {
                    thumbConstraints = thumbConstraints | ThumbsConstraints.Default;
                }
                if (!canResize(obj)) {
                    thumbConstraints = thumbConstraints & ~(ThumbsConstraints.ResizeSouthEast | ThumbsConstraints.ResizeSouthWest |
                        ThumbsConstraints.ResizeSouth | ThumbsConstraints.ResizeEast | ThumbsConstraints.ResizeWest |
                        ThumbsConstraints.ResizeNorth | ThumbsConstraints.ResizeNorthEast | ThumbsConstraints.ResizeNorthWest);
                }
                if (!canRotate(obj)) {
                    thumbConstraints = thumbConstraints & ~ThumbsConstraints.Rotate;
                }
            }
            selectorModel.thumbsConstraints = thumbConstraints;
        }
    };
    /** @private */
    Diagram.prototype.renderSelector = function (multipleSelection, isSwimLane) {
        var isProtectedOnChangeValue = this.isProtectedOnChange;
        if (isBlazor()) {
            this.isProtectedOnChange = true;
        }
        var size = new Size();
        var selectorModel = this.selectedItems;
        var selectorConstraints = selectorModel.constraints;
        var rendererActions = this.diagramRenderer.rendererActions;
        var innertemplate = document.getElementsByClassName('blazor-inner-template');
        var i;
        var div;
        this.diagramRenderer.rendererActions = this.currentSymbol ?
            this.addConstraints(rendererActions, RendererAction.DrawSelectorBorder) :
            this.removeConstraints(rendererActions, RendererAction.DrawSelectorBorder);
        this.clearSelectorLayer();
        if (this.commandHandler.hasSelection()) {
            if (selectorModel.nodes.length === 1 && selectorModel.connectors.length === 0) {
                selectorModel.rotateAngle = selectorModel.nodes[0].rotateAngle;
                selectorModel.pivot = selectorModel.nodes[0].pivot;
            }
            selectorModel.wrapper.measure(size);
            selectorModel.wrapper.arrange(selectorModel.wrapper.desiredSize);
            selectorModel.width = selectorModel.wrapper.actualSize.width;
            selectorModel.height = selectorModel.wrapper.actualSize.height;
            selectorModel.offsetX = selectorModel.wrapper.offsetX;
            selectorModel.offsetY = selectorModel.wrapper.offsetY;
            if (selectorModel.rotateAngle !== 0) {
                for (var _i = 0, _a = selectorModel.nodes; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    obj.offsetX = obj.wrapper.offsetX;
                    obj.offsetY = obj.wrapper.offsetY;
                }
                for (var _b = 0, _c = selectorModel.connectors; _b < _c.length; _b++) {
                    var conn = _c[_b];
                    //update connections
                }
            }
            var bounds = this.spatialSearch.getPageBounds();
            var selectorElement = void 0;
            selectorElement = getSelectorElement(this.element.id);
            var diagramUserHandlelayer = void 0;
            diagramUserHandlelayer = getUserHandleLayer(this.element.id);
            selectorModel.thumbsConstraints = ThumbsConstraints.Default;
            if (selectorModel.annotation) {
                this.updateThumbConstraints([selectorModel.annotation], selectorModel);
            }
            else {
                this.updateThumbConstraints(selectorModel.nodes, selectorModel);
                this.updateThumbConstraints(selectorModel.connectors, selectorModel, true);
            }
            if (selectorModel.annotation) {
                this.renderSelectorForAnnotation(selectorModel, selectorElement);
            }
            else if (selectorModel.nodes.length + selectorModel.connectors.length === 1) {
                if (selectorModel.nodes[0] instanceof Node) {
                    var node = selectorModel.nodes[0];
                    if (checkParentAsContainer(this, node)) {
                        if (!isSwimLane && (node.shape.type !== 'UmlClassifier' && !(node.parentId &&
                            this.nameTable[node.parentId]
                            && this.nameTable[node.parentId].shape.type === 'UmlClassifier'))) {
                            if (!(node.container && (node.container.type === 'Canvas' || node.container.type === 'Grid'))) {
                                selectorModel.nodes[0].constraints &= ~(NodeConstraints.Rotate | NodeConstraints.HideThumbs);
                            }
                            selectorModel.thumbsConstraints &= ~ThumbsConstraints.Rotate;
                        }
                    }
                    var constraints = isSwimLane ? true : ((node.constraints & NodeConstraints.HideThumbs) ? true : false);
                    var swimlane = (node.shape.type === 'SwimLane' || node.isLane || node.isPhase || isSwimLane) ? true : false;
                    this.diagramRenderer.renderResizeHandle(selectorModel.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom, selectorModel.constraints, this.scroller.transform, undefined, canMove(node), constraints, swimlane);
                }
                else if (selectorModel.connectors[0] instanceof Connector && canDrawThumbs(this.diagramRenderer.rendererActions)) {
                    var connector = selectorModel.connectors[0];
                    this.diagramRenderer.renderEndPointHandle(connector, selectorElement, selectorModel.thumbsConstraints, selectorModel.constraints, this.scroller.transform, connector.sourceWrapper !== undefined, connector.targetWrapper !== undefined, (this.connectorEditingToolModule && canDragSegmentThumb(connector)) ? true : false);
                }
            }
            else {
                this.diagramRenderer.renderResizeHandle(selectorModel.wrapper, selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom, selectorModel.constraints, this.scroller.transform, undefined, canMove(selectorModel));
            }
            if (!(selectorModel.annotation) && !this.currentSymbol) {
                this.diagramRenderer.renderUserHandler(selectorModel, selectorElement, this.scroller.transform, diagramUserHandlelayer);
                if (isBlazor() && innertemplate.length > 0) {
                    for (i = 0; i < this.selectedItems.userHandles.length; i++) {
                        var userHandle = this.selectedItems.userHandles[i];
                        div = document.getElementById(userHandle.name + '_html_element');
                        div.style.display = 'block';
                    }
                }
            }
        }
        this.isProtectedOnChange = isProtectedOnChangeValue;
    };
    /** @private */
    Diagram.prototype.updateSelector = function () {
        var severDataBind = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        var size = new Size();
        var selector = this.selectedItems;
        var selectorConstraints = selector.constraints;
        var innertemplate = document.getElementsByClassName('blazor-inner-template');
        var i;
        var div;
        if (!(this.diagramActions & DiagramAction.ToolAction) && this.selectedItems.nodes.length === 1) {
            this.selectedItems.rotateAngle = this.selectedItems.nodes[0].rotateAngle;
            this.selectedItems.wrapper.rotateAngle = this.selectedItems.nodes[0].rotateAngle;
        }
        if (this.selectedItems !== undefined) {
            this.clearSelectorLayer();
            if (selector.wrapper !== null && selector.wrapper.children && selector.wrapper.children.length) {
                selector.wrapper.measure(size);
                selector.wrapper.arrange(selector.wrapper.desiredSize);
                if (selector.rotateAngle !== 0 || selector.rotateAngle !== selector.wrapper.prevRotateAngle) {
                    for (var _i = 0, _a = selector.nodes; _i < _a.length; _i++) {
                        var obj = _a[_i];
                        obj.offsetX = obj.wrapper.offsetX;
                        obj.offsetY = obj.wrapper.offsetY;
                    }
                }
                selector.width = selector.wrapper.actualSize.width;
                selector.height = selector.wrapper.actualSize.height;
                selector.offsetX = selector.wrapper.offsetX;
                selector.offsetY = selector.wrapper.offsetY;
                var selectorEle = void 0;
                selectorEle = getSelectorElement(this.element.id);
                var diagramUserHandlelayer = void 0;
                diagramUserHandlelayer = getUserHandleLayer(this.element.id);
                var canHideResizers = this.eventHandler.canHideResizers();
                selector.thumbsConstraints = ThumbsConstraints.Default;
                if (selector.annotation) {
                    this.updateThumbConstraints([selector.annotation], selector);
                }
                else {
                    this.updateThumbConstraints(selector.nodes, selector);
                    this.updateThumbConstraints(selector.connectors, selector, true);
                }
                if ((this.selectedItems.constraints & SelectorConstraints.UserHandle) && (!(selector.annotation)) && !this.currentSymbol) {
                    this.diagramRenderer.renderUserHandler(selector, selectorEle, this.scroller.transform, diagramUserHandlelayer);
                    if (isBlazor() && innertemplate.length > 0) {
                        for (i = 0; i < this.selectedItems.userHandles.length; i++) {
                            var userHandletemplate = this.selectedItems.userHandles[i];
                            div = document.getElementById(userHandletemplate.name + '_html_element');
                            div.style.display = 'block';
                        }
                    }
                }
                if (selector.annotation) {
                    this.renderSelectorForAnnotation(selector, selectorEle);
                }
                else if (selector.nodes.length + selector.connectors.length === 1) {
                    if (selector.connectors[0] instanceof Connector && canDrawThumbs(this.diagramRenderer.rendererActions)) {
                        var connector = selector.connectors[0];
                        this.diagramRenderer.renderEndPointHandle(connector, selectorEle, selector.thumbsConstraints, selectorConstraints, this.scroller.transform, connector.sourceWrapper !== undefined, connector.targetWrapper !== undefined, (this.connectorEditingToolModule && canDragSegmentThumb(connector)) ? true : false);
                    }
                    else if (selector.nodes[0] instanceof Node) {
                        var stackPanel = selector.nodes[0];
                        if (checkParentAsContainer(this, selector.nodes[0])) {
                            if (stackPanel.shape.type !== 'UmlClassifier' && !(stackPanel.parentId &&
                                this.nameTable[stackPanel.parentId]
                                && this.nameTable[stackPanel.parentId].shape.type === 'UmlClassifier')) {
                                if (!(stackPanel.container && (stackPanel.container.type === 'Canvas'
                                    || stackPanel.container.type === 'Grid'))) {
                                    selector.nodes[0].constraints &= ~(NodeConstraints.HideThumbs | NodeConstraints.Rotate);
                                }
                                selector.thumbsConstraints &= ~ThumbsConstraints.Rotate;
                            }
                        }
                        var swimlane = (stackPanel.shape.type === 'SwimLane' || stackPanel.isLane ||
                            stackPanel.isPhase) ? true : false;
                        this.diagramRenderer.renderResizeHandle(selector.wrapper.children[0], selectorEle, selector.thumbsConstraints, this.scroller.currentZoom, selector.constraints, this.scroller.transform, canHideResizers, canMove(selector.nodes[0]), (selector.nodes[0].constraints & NodeConstraints.HideThumbs) ? true : false, swimlane);
                    }
                }
                else {
                    if (this.diagramActions & DiagramAction.Interactions) {
                        this.diagramRenderer.rendererActions = this.diagramRenderer.rendererActions | RendererAction.PreventRenderSelector;
                    }
                    this.diagramRenderer.renderResizeHandle(selector.wrapper, selectorEle, selector.thumbsConstraints, this.scroller.currentZoom, selector.constraints, this.scroller.transform, canHideResizers, canMove(selector));
                    this.diagramRenderer.rendererActions = this.diagramRenderer.rendererActions & ~RendererAction.PreventRenderSelector;
                }
            }
        }
        this.enableServerDataBinding(severDataBind);
    };
    /** @private */
    Diagram.prototype.renderSelectorForAnnotation = function (selectorModel, selectorElement) {
        this.diagramRenderer.renderResizeHandle(selectorModel.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, this.scroller.currentZoom, selectorModel.constraints, this.scroller.transform, undefined, canMove(selectorModel.annotation));
    };
    /** @private */
    Diagram.prototype.drawSelectionRectangle = function (x, y, width, height) {
        this.clearSelectorLayer();
        this.diagramRenderer.drawSelectionRectangle(x, y, width, height, this.adornerLayer, this.scroller.transform);
    };
    /**
     * @private
     */
    Diagram.prototype.renderHighlighter = function (element) {
        var adornerSvg = getAdornerLayerSvg(this.element.id);
        this.diagramRenderer.renderHighlighter(element, adornerSvg, this.scroller.transform);
    };
    /**
     * @private
     */
    Diagram.prototype.clearHighlighter = function () {
        var adornerSvg = getAdornerLayerSvg(this.element.id);
        var highlighter = adornerSvg.getElementById(adornerSvg.id + '_highlighter');
        if (highlighter) {
            highlighter.parentNode.removeChild(highlighter);
        }
    };
    /** @private */
    Diagram.prototype.getNodesConnectors = function (selectedItems) {
        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            selectedItems.push(node);
        }
        for (var i = 0; i < this.connectors.length; i++) {
            var conn = this.connectors[i];
            selectedItems.push(conn);
        }
        return selectedItems;
    };
    /** @private */
    Diagram.prototype.clearSelectorLayer = function () {
        var adornerSvg = getAdornerLayerSvg(this.element.id);
        var innertemplate = document.getElementsByClassName('blazor-inner-template');
        var i;
        var div;
        var j;
        if (!this.currentSymbol) {
            var selectionRect = adornerSvg.getElementById(this.adornerLayer.id + '_selected_region');
            if (selectionRect) {
                selectionRect.parentNode.removeChild(selectionRect);
            }
            this.clearHighlighter();
            var childNodes = getSelectorElement(this.element.id).childNodes;
            var child = void 0;
            for (var i_3 = childNodes.length; i_3 > 0; i_3--) {
                child = childNodes[i_3 - 1];
                child.parentNode.removeChild(child);
            }
            if (isBlazor() && !(this.diagramActions & DiagramAction.DragUsingMouse) && innertemplate.length > 0) {
                for (i = 0; i < this.selectedItems.userHandles.length; i++) {
                    var template = this.selectedItems.userHandles[i];
                    div = document.getElementById(template.name + '_html_element');
                    div.style.display = 'none';
                }
            }
            else {
                if (!isBlazor()) {
                    var templates = getUserHandleLayer(this.element.id).childNodes;
                    for (i = templates.length; i > 0; i--) {
                        templates[i - 1].parentNode.removeChild(templates[i - 1]);
                    }
                }
            }
        }
        else {
            var symbolBorder = adornerSvg.getElementById('borderRect_symbol');
            if (symbolBorder) {
                symbolBorder.parentNode.removeChild(symbolBorder);
            }
        }
    };
    /** @private */
    Diagram.prototype.getWrapper = function (nodes, id) {
        var wrapper;
        id = nodes.id + '_' + id;
        var container = nodes instanceof Canvas ? nodes : this.getPortContainer(this.nameTable[nodes.id]);
        for (var i = 0; i < container.children.length; i++) {
            if (id === container.children[i].id) {
                wrapper = container.children[i];
            }
        }
        return wrapper;
    };
    /** @private */
    Diagram.prototype.getEndNodeWrapper = function (node, connector, source) {
        if (node.shape.type === 'Bpmn' && node.wrapper.children[0] instanceof Canvas) {
            if ((!isBlazor() && node.shape.shape === 'Activity') ||
                (isBlazor() && node.shadow.bpmnShape === 'Activity')) {
                if (source && node.shape.activity.subProcess.type === 'Transaction'
                    && connector.sourcePortID) {
                    var portId = connector.sourcePortID;
                    var parent_3 = node.wrapper.children[0].children[0].children[2];
                    if (parent_3.children) {
                        for (var _i = 0, _a = parent_3.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            if (child.visible && child.id === node.id + '_' + portId) {
                                return child.children[0];
                            }
                        }
                    }
                }
                return node.wrapper.children[0].children[0].children[0];
            }
            return node.wrapper.children[0].children[0];
        }
        if (!this.containsMargin(node.wrapper.children[0])) {
            if (!node.children) {
                return node.wrapper.children[0];
            }
        }
        return node.wrapper;
    };
    Diagram.prototype.containsMargin = function (node) {
        return node.margin && (node.margin.left !== 0 || node.margin.top !== 0 || node.margin.right !== 0 || node.margin.bottom !== 0);
    };
    Diagram.prototype.focusOutEdit = function () {
        this.endEdit();
    };
    Diagram.prototype.endEditCommand = function () {
        this.endEdit();
        this.textEditing = false;
    };
    /**
     * @private
     */
    /* tslint:disable */
    Diagram.prototype.endEdit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blazor, blazorInterop, oldValues, changedvalues, annotations, textArea, text, element, node, annotation, args, bpmnAnnotation, textWrapper, eventObj, annotation_1, index, deleteNode, eventObj, index, changesAnnotation, nodeIndex, oldnodes, newnodes, clonedObject, selectedNode, swimLaneNode, laneHeader, phaseHeader, collection, j;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.diagramActions & DiagramAction.TextEdit)) return [3 /*break*/, 11];
                        blazor = 'Blazor';
                        blazorInterop = 'sfBlazor';
                        oldValues = void 0;
                        changedvalues = void 0;
                        annotations = {};
                        this.enableServerDataBinding(false);
                        if (isBlazor()) {
                            this.canEnableBlazorObject = true;
                        }
                        textArea = document.getElementById(this.element.id + '_editBox');
                        if (!((isBlazor() && textArea) || !isBlazor())) return [3 /*break*/, 11];
                        text = textArea.value;
                        EventHandler.remove(textArea, 'input', this.eventHandler.inputChange);
                        EventHandler.remove(textArea, 'focusout', this.focusOutEdit);
                        element = document.getElementById(this.element.id + '_editTextBoxDiv');
                        node = void 0;
                        node = this.nameTable[this.activeLabel.parentId];
                        annotation = findAnnotation(node, this.activeLabel.id);
                        args = { oldValue: this.activeLabel.text, newValue: text, cancel: false, element: node, annotation: annotation };
                        if (isBlazor() && this.textEdit) {
                            args = this.getBlazorTextEditArgs(args);
                        }
                        bpmnAnnotation = false;
                        element.parentNode.removeChild(element);
                        textWrapper = void 0;
                        if (!this.bpmnModule) return [3 /*break*/, 5];
                        node = this.bpmnModule.isBpmnTextAnnotation(this.activeLabel, this);
                        textWrapper = this.bpmnModule.getTextAnnotationWrapper(node, this.activeLabel.id);
                        bpmnAnnotation = node ? true : false;
                        if (!bpmnAnnotation) return [3 /*break*/, 5];
                        if (!(element.textContent !== text || text !== this.activeLabel.text)) return [3 /*break*/, 5];
                        if (!isBlazor()) return [3 /*break*/, 3];
                        if (!(this.textEdit && window && window[blazor])) return [3 /*break*/, 2];
                        eventObj = { 'EventName': 'textEdit', args: JSON.stringify(args) };
                        return [4 /*yield*/, window[blazorInterop].updateBlazorDiagramEvents(eventObj, this)];
                    case 1:
                        args = (_a.sent()) || args;
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        this.triggerEvent(DiagramEvent.textEdit, args);
                        _a.label = 4;
                    case 4:
                        if (!args.cancel) {
                            this.bpmnModule.updateTextAnnotationContent(node, this.activeLabel, text, this);
                        }
                        _a.label = 5;
                    case 5:
                        if (!!bpmnAnnotation) return [3 /*break*/, 10];
                        node = this.nameTable[this.activeLabel.parentId];
                        annotation_1 = findAnnotation(node, this.activeLabel.id);
                        if (annotation_1 && !(annotation_1 instanceof Text)) {
                            index = findObjectIndex(node, annotation_1.id, true);
                            annotations[index] = { content: annotation_1.content };
                            oldValues = { annotations: annotations };
                        }
                        else {
                            if (isBlazor() && (node.shape).type === "Text") {
                                oldValues = { shape: { textContent: node.shape.content } };
                            }
                            else {
                                oldValues = { shape: { content: node.shape.content } };
                            }
                        }
                        deleteNode = this.eventHandler.isAddTextNode(node, true);
                        if (!(!deleteNode && (element.textContent !== text || text !== this.activeLabel.text))) return [3 /*break*/, 9];
                        if (!isBlazor()) return [3 /*break*/, 8];
                        if (!(window && window[blazor] && this.textEdit)) return [3 /*break*/, 7];
                        eventObj = { 'EventName': 'textEdit', args: JSON.stringify(args) };
                        return [4 /*yield*/, window[blazorInterop].updateBlazorDiagramEvents(eventObj, this)];
                    case 6:
                        args = (_a.sent()) || args;
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        this.triggerEvent(DiagramEvent.textEdit, args);
                        _a.label = 9;
                    case 9:
                        if (!textWrapper) {
                            textWrapper = this.getWrapper(node.wrapper, this.activeLabel.id);
                        }
                        if (annotation_1.content !== text && !args.cancel) {
                            if (node.parentId && this.nameTable[node.parentId].shape.type === 'UmlClassifier'
                                && text.indexOf('+') === -1 && text.indexOf('-') === -1 && text.indexOf('#') === -1
                                && text.indexOf('~') === -1 && node.id.indexOf('_umlClass_header') === -1) {
                                text = ' + ' + text;
                            }
                            if (node.isLane || node.isPhase) {
                                this.protectPropertyChange(true);
                            }
                            if (!(annotation_1 instanceof Text)) {
                                index = findObjectIndex(node, annotation_1.id, true);
                                changesAnnotation = {};
                                changesAnnotation[index] = { content: text };
                                changedvalues = { annotations: changesAnnotation };
                            }
                            else {
                                if (isBlazor() && (node.shape).type === "Text") {
                                    changedvalues = { shape: { textContent: text } };
                                }
                                else {
                                    changedvalues = { shape: { content: text } };
                                }
                            }
                            nodeIndex = this.getIndex(node, node.id);
                            if (nodeIndex) {
                                oldnodes = {};
                                oldnodes[nodeIndex] = oldValues;
                                newnodes = {};
                                newnodes[nodeIndex] = changedvalues;
                                if (getObjectType(node) === Node) {
                                    this.onPropertyChanged({ nodes: newnodes }, { nodes: oldnodes });
                                }
                                else {
                                    this.onPropertyChanged({ connectors: newnodes }, { connectors: oldnodes });
                                }
                            }
                            this.protectPropertyChange(true);
                            if (isBlazor() && (node.shape).type === "Text") {
                                node.shape.textContent = text;
                            }
                            else {
                                annotation_1.content = text;
                            }
                            this.protectPropertyChange(false);
                            this.updateSelector();
                            if (node.isLane || node.isPhase) {
                                this.protectPropertyChange(false);
                            }
                        }
                        if (deleteNode) {
                            this.removeObjectsFromLayer(node);
                            this.removeFromAQuad(node);
                            delete this.nameTable[this.activeLabel.parentId];
                            if (text !== '') {
                                this.clearSelection();
                                clonedObject = cloneObject(node);
                                node = this.add(clonedObject);
                                this.updateDiagramObject(node);
                                this.commandHandler.oldSelectedObjects = cloneSelectedObjects(this);
                                this.commandHandler.select(this.nameTable[node.id]);
                                this.commandHandler.updateBlazorSelector();
                            }
                        }
                        _a.label = 10;
                    case 10:
                        if (this.selectedItems.nodes.length) {
                            selectedNode = this.nameTable[this.activeLabel.parentId];
                            swimLaneNode = this.nameTable[selectedNode.parentId];
                            if ((swimLaneNode && swimLaneNode.shape.type === 'SwimLane') || (selectedNode.shape.type === 'SwimLane')) {
                                laneHeader = 'LaneHeaderParent';
                                phaseHeader = 'PhaseHeaderParent';
                                if ((selectedNode.shape.type === 'SwimLane')) {
                                    swimLaneNode = this.nameTable[this.activeLabel.parentId];
                                    selectedNode = node;
                                }
                                if ((selectedNode.isLane || selectedNode.isPhase)) {
                                    collection = selectedNode.isLane ?
                                        swimLaneNode.shape.lanes : swimLaneNode.shape.phases;
                                    for (j = 0; j < collection.length; j++) {
                                        if (collection[j].id === (selectedNode[laneHeader] || selectedNode[phaseHeader])) {
                                            collection[j].header.annotation.content = selectedNode.annotations[0].content;
                                        }
                                    }
                                }
                                else if (selectedNode.isHeader && swimLaneNode.shape.hasHeader) {
                                    swimLaneNode.shape.header.annotation.content = selectedNode.annotations[0].content;
                                }
                            }
                            this.dataBind();
                        }
                        textWrapper.visible = true;
                        this.updateDiagramObject(node);
                        this.diagramActions = this.diagramActions & ~DiagramAction.TextEdit;
                        if (this.activeLabel.isGroup) {
                            this.endGroupAction();
                        }
                        this.activeLabel = { id: '', parentId: '', isGroup: false, text: undefined };
                        this.commandHandler.getBlazorOldValues();
                        if (isBlazor()) {
                            this.canEnableBlazorObject = false;
                        }
                        this.enableServerDataBinding(true);
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /** @private */
    Diagram.prototype.getIndex = function (node, id) {
        var index;
        var collection = (getObjectType(node) === Node) ? this.nodes : this.connectors;
        for (var i = 0; i < collection.length; i++) {
            if (collection[i].id.toString() === id.toString()) {
                return i.toString();
            }
        }
        return null;
    };
    ;
    /* tslint:enable */
    Diagram.prototype.getBlazorTextEditArgs = function (args) {
        var element = getObjectType(args.element) === Connector ? { connectorId: args.element.id }
            : { nodeId: args.element.id };
        var annotation = {};
        if (getObjectType(args.element) === Node) {
            if (args.element.shape.type === 'Text') {
                annotation.textNode = args.element.shape;
            }
            else {
                annotation.annotationId = args.element.annotations[0].id;
            }
        }
        else {
            annotation.annotationId = args.element.annotations[0].id;
        }
        args = {
            oldValue: args.oldValue,
            newValue: args.newValue,
            cancel: args.cancel,
            element: element,
            annotation: annotation
        };
        return args;
    };
    /** @private */
    Diagram.prototype.canLogChange = function () {
        if ((this.diagramActions & DiagramAction.Render) && (!(this.diagramActions & DiagramAction.ToolAction)) &&
            (!(this.diagramActions & DiagramAction.UndoRedo)) && (!(this.diagramActions & DiagramAction.PublicMethod))) {
            return true;
        }
        else {
            return false;
        }
    };
    Diagram.prototype.modelChanged = function (newProp, oldProp) {
        if (newProp.connectors || oldProp.connectors || newProp.nodes || oldProp.connectors
            || newProp.pageSettings || oldProp.pageSettings || newProp.bridgeDirection || oldProp.bridgeDirection) {
            return true;
        }
        return false;
    };
    Diagram.prototype.resetDiagramActions = function (action) {
        var isAction = action ? true : false;
        if (this.diagramActions & DiagramAction.UndoRedo && (!isAction || (action === DiagramAction.UndoRedo))) {
            this.diagramActions = this.diagramActions & ~DiagramAction.UndoRedo;
        }
        if (this.diagramActions & DiagramAction.PublicMethod && (!isAction || action === DiagramAction.PublicMethod)) {
            this.diagramActions = this.diagramActions & ~DiagramAction.PublicMethod;
        }
    };
    /** @private */
    Diagram.prototype.removeNode = function (node, childernCollection) {
        this.removeObjectsFromLayer(node);
        this.removeFromAQuad(this.nameTable[node.id]);
        var groupElement = document.getElementById(node.id + '_groupElement');
        delete this.nameTable[node.id];
        if (node.children) {
            delete this.groupTable[node.id];
        }
        if (isBlazor()) {
            for (var i = 0; i < this.nodes.length; i++) {
                if (node.id === this.nodes[i].id) {
                    this.UpdateBlazorDiagramModel(node, 'Node', i);
                }
            }
        }
        this.nodes.splice(this.nodes.indexOf(node), 1);
        if (groupElement.children && groupElement.children.length > 0) {
            var beforeElement = undefined;
            for (var j = groupElement.children.length - 1; j >= 0; j--) {
                var childElement = groupElement.children[j];
                if (childernCollection.length > 0 && childernCollection.indexOf(childElement.id.split('_')[0]) !== -1) {
                    if (!beforeElement) {
                        groupElement.parentNode.insertBefore(childElement, groupElement);
                    }
                    else {
                        groupElement.parentNode.insertBefore(childElement, beforeElement);
                    }
                    beforeElement = childElement;
                }
            }
        }
        if (groupElement) {
            groupElement.parentNode.removeChild(groupElement);
        }
    };
    /** @private */
    Diagram.prototype.deleteGroup = function (node) {
        var elements = [];
        var tempNode = [];
        if (node.children) {
            tempNode = this.commandHandler.getChildren(node, elements);
        }
        this.UpdateBlazorDiagramModelCollection(node);
        for (var _i = 0, tempNode_1 = tempNode; _i < tempNode_1.length; _i++) {
            var nodes = tempNode_1[_i];
            if (this.nameTable[nodes.id]) {
                this.remove(nodes);
            }
        }
    };
    //helper methods - end region
    //property changes - start region
    /** @private */
    Diagram.prototype.updateObject = function (actualObject, oldObject, changedProp) {
        if (!(this.diagramActions & DiagramAction.ToolAction)) {
            var bound = actualObject.wrapper.children[0].bounds;
            var checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, bound);
            if (!checkBoundaryConstraints) {
                if (actualObject instanceof Node) {
                    var oldNode = oldObject;
                    for (var _i = 0, _a = Object.keys(changedProp); _i < _a.length; _i++) {
                        var key = _a[_i];
                        switch (key) {
                            case 'width':
                                actualObject.width = oldNode.width;
                                break;
                            case 'height':
                                actualObject.height = oldNode.height;
                                break;
                            case 'offsetX':
                                actualObject.offsetX = oldNode.offsetX;
                                break;
                            case 'offsetY':
                                actualObject.offsetY = oldNode.offsetY;
                                break;
                            case 'rotateAngle':
                                actualObject.rotateAngle = oldNode.rotateAngle;
                                break;
                        }
                    }
                    this.nodePropertyChange(actualObject, changedProp, oldObject);
                }
                else {
                    for (var _b = 0, _c = Object.keys(changedProp); _b < _c.length; _b++) {
                        var key = _c[_b];
                        var oldConnector = oldObject;
                        var actualSourcePoint = actualObject.sourcePoint;
                        var actualTargetPoint = actualObject.targetPoint;
                        switch (key) {
                            case 'sourcePoint':
                                actualSourcePoint.x = oldConnector.sourcePoint.x || actualSourcePoint.x;
                                actualSourcePoint.y = oldConnector.sourcePoint.y || actualSourcePoint.y;
                                break;
                            case 'targetPoint':
                                actualTargetPoint.x = oldConnector.targetPoint.x || actualTargetPoint.x;
                                actualTargetPoint.y = oldConnector.targetPoint.y || actualTargetPoint.y;
                        }
                    }
                    this.connectorPropertyChange(actualObject, changedProp, oldObject);
                }
            }
        }
    };
    Diagram.prototype.nodePropertyChangeExtend = function (actualObject, oldObject, node, update) {
        if (node.style !== undefined && actualObject.shape.type !== 'Bpmn') {
            updateStyle(node.style, actualObject.wrapper.children[0]);
            update = true;
        }
        if (node.shadow !== undefined) {
            this.updateShadow(actualObject.shadow, node.shadow);
            update = true;
        }
        if (node.constraints !== undefined) {
            if ((oldObject.constraints & NodeConstraints.Select) &&
                (!(node.constraints & NodeConstraints.Select)) && isSelected(this, actualObject)) {
                this.clearSelection();
            }
            else {
                this.updateThumbConstraints(this.selectedItems.nodes, this.selectedItems);
                this.updateSelector();
                update = true;
            }
        }
        this.swimLaneNodePropertyChange(actualObject, oldObject, node, update);
        return update;
    };
    /* tslint:disable */
    Diagram.prototype.swimLaneNodePropertyChange = function (actualObject, oldObject, node, update) {
        if (actualObject.shape.type === 'SwimLane' && !this.currentSymbol) {
            if (oldObject.shape) {
                var shape = node.shape;
                var actualShape = actualObject.shape;
                var orientation_1 = (actualShape.orientation === 'Horizontal') ? true : false;
                var padding = actualShape.padding;
                var oldShape = oldObject.shape;
                var grid = actualObject.wrapper.children[0];
                var oldObjects = void 0;
                var newObjects = void 0;
                var id = void 0;
                if (oldShape.lanes || oldShape.phases) {
                    if (oldShape.lanes) {
                        for (var _i = 0, _a = Object.keys(shape.lanes); _i < _a.length; _i++) {
                            var count = _a[_i];
                            var indexValue = Number(count);
                            var lane = oldShape.lanes[indexValue];
                            var laneIndex = void 0;
                            var newLane = shape.lanes[indexValue];
                            if (newLane && newLane.header) {
                                id = actualShape.lanes[indexValue].header.id;
                                oldObjects = lane.header;
                                newObjects = newLane.header;
                                this.nodePropertyChange(this.nameTable[id], oldObjects, newObjects);
                            }
                            if (lane.children) {
                                for (var _b = 0, _c = Object.keys(lane.children); _b < _c.length; _b++) {
                                    var childNodeIndex = _c[_b];
                                    id = actualShape.lanes[indexValue].children[Number(childNodeIndex)].id;
                                    var node_1 = this.nameTable[id];
                                    oldObjects = lane.children[Number(childNodeIndex)];
                                    newObjects = newLane.children[Number(childNodeIndex)];
                                    this.nodePropertyChange(node_1, oldObjects, newObjects);
                                }
                            }
                            if (lane.width && !orientation_1) {
                                laneIndex = (actualShape.phases && actualShape.phaseSize) ? indexValue + 1 : indexValue;
                                grid.updateColumnWidth(laneIndex, newLane.width, true, padding);
                                this.updateDiagramElementQuad();
                            }
                            if (lane.height && orientation_1) {
                                laneIndex = (actualShape.header && actualShape.hasHeader) ? indexValue + 1 : indexValue;
                                laneIndex += (actualShape.phases && actualShape.phaseSize) ? 1 : 0;
                                grid.updateRowHeight(laneIndex, newLane.height, true, padding);
                                this.updateDiagramElementQuad();
                            }
                        }
                    }
                    if (shape.phases) {
                        for (var _d = 0, _e = Object.keys(shape.phases); _d < _e.length; _d++) {
                            var key = _e[_d];
                            var indexValue = Number(key);
                            var phase = shape.phases[indexValue];
                            var size = void 0;
                            var rowIndex = (actualShape.header && actualShape.hasHeader) ? 1 : 0;
                            if (phase && phase.header) {
                                id = actualShape.phases[indexValue].header.id;
                                oldObjects = oldShape.phases[indexValue].header;
                                newObjects = phase.header;
                                this.nodePropertyChange(this.nameTable[id], oldObjects, newObjects);
                            }
                            if (phase.offset) {
                                if (indexValue === 0) {
                                    size = phase.offset;
                                }
                                else {
                                    var previousPhase = actualShape.phases[indexValue - 1];
                                    size = phase.offset - previousPhase.offset;
                                    if (size <= 0) {
                                        size = phase.offset;
                                    }
                                }
                                if (orientation_1) {
                                    grid.updateColumnWidth(indexValue, size, true, padding);
                                    updatePhaseMaxWidth(actualObject, this, grid.rows[rowIndex].cells[indexValue], indexValue);
                                }
                                else {
                                    grid.updateRowHeight(rowIndex + indexValue, size, true, padding);
                                }
                            }
                        }
                    }
                }
                if (shape.phaseSize !== undefined && actualShape.phases.length) {
                    if (shape.phaseSize === 0 || oldShape.phaseSize === 0) {
                        if (oldShape.phaseSize) {
                            if (orientation_1) {
                                grid.removeRow((actualShape.header && actualShape.hasHeader) ? 1 : 0);
                                actualObject.height = actualObject.wrapper.height = grid.height;
                            }
                            else {
                                if (actualShape.header && actualShape.hasHeader) {
                                    grid.rows[0].cells[1].children = grid.rows[0].cells[0].children;
                                    grid.rows[0].cells[1].columnSpan = grid.rows[0].cells[0].columnSpan - 1;
                                    grid.rows[0].cells[0].children = [];
                                }
                                grid.removeColumn(0);
                            }
                        }
                        else {
                            if (orientation_1) {
                                var rowDef = new RowDefinition();
                                rowDef.height = shape.phaseSize;
                                grid.addRow((actualShape.header && actualShape.hasHeader) ? 1 : 0, rowDef, true);
                                actualObject.height = actualObject.wrapper.height += shape.phaseSize;
                            }
                            else {
                                var colDef = new ColumnDefinition();
                                colDef.width = shape.phaseSize;
                                grid.addColumn(0, colDef, true);
                                if (actualShape.header && actualShape.hasHeader) {
                                    grid.rows[0].cells[0].children = grid.rows[0].cells[1].children;
                                    grid.rows[0].cells[1].children = [];
                                    grid.rows[0].cells[1].columnSpan = 1;
                                    grid.rows[0].cells[1].minWidth = undefined;
                                    grid.rows[0].cells[0].columnSpan = actualShape.lanes.length + 1;
                                }
                            }
                            for (var k = 0; k < actualShape.phases.length; k++) {
                                if (actualShape.phases[k].id === '') {
                                    actualShape.phases[k].id = randomId();
                                }
                                phaseDefine(grid, this, actualObject, (actualShape.header && actualShape.hasHeader) ? 1 : 0, orientation_1, k);
                            }
                        }
                    }
                    else {
                        if (orientation_1) {
                            grid.updateRowHeight((actualShape.header && actualShape.hasHeader) ? 1 : 0, shape.phaseSize, false);
                        }
                        else {
                            grid.updateColumnWidth(0, shape.phaseSize, false);
                        }
                    }
                }
                if (actualShape.header && actualShape.hasHeader && oldShape.header) {
                    var id_1 = grid.rows[0].cells[0].children[0].id;
                    var headerNode = this.nameTable[id_1];
                    this.nodePropertyChange(headerNode, (oldShape.header), shape.header);
                }
                actualObject.height = actualObject.wrapper.height = grid.height;
                actualObject.width = actualObject.wrapper.width = grid.width;
            }
            else if (oldObject.constraints) {
                var oldSelectConstraints = (oldObject.constraints & NodeConstraints.Select);
                var newSelectConstraints = (node.constraints & NodeConstraints.Select);
                if (oldSelectConstraints !== newSelectConstraints) {
                    var shape = actualObject.shape;
                    // Header - constraints
                    var headerNode = this.nameTable[actualObject.id + shape.header.id];
                    headerNode.constraints = (!newSelectConstraints) ? headerNode.constraints & ~NodeConstraints.Select :
                        headerNode.constraints | NodeConstraints.Select;
                    // Phase - Constraints
                    var phaseNode = void 0;
                    if (shape.phaseSize > 0) {
                        for (var i = 0; i < shape.phases.length; i++) {
                            phaseNode = this.nameTable[actualObject.id + shape.phases[i].id + '_header'];
                            phaseNode.constraints = (!newSelectConstraints) ? phaseNode.constraints & ~NodeConstraints.Select :
                                phaseNode.constraints | NodeConstraints.Select;
                        }
                    }
                    // Header - Constraints
                    var laneNode = void 0;
                    var laneHeader = void 0;
                    var value = shape.phases.length || 1;
                    for (var i = 0; i < shape.lanes.length; i++) {
                        for (var l = 0; l < value; l++) {
                            laneNode = this.nameTable[actualObject.id + shape.lanes[i].id + l];
                            laneNode.constraints = (!newSelectConstraints) ? laneNode.constraints & ~NodeConstraints.Select :
                                laneNode.constraints | NodeConstraints.Select;
                            if (l === 0) {
                                laneHeader = this.nameTable[actualObject.id + shape.lanes[i].id + '_' + l + '_header'];
                                laneHeader.constraints = (!newSelectConstraints) ? laneHeader.constraints & ~NodeConstraints.Select :
                                    laneHeader.constraints | NodeConstraints.Select;
                            }
                        }
                    }
                }
            }
            update = true;
        }
        return update;
    };
    /** @private */
    Diagram.prototype.insertValue = function (oldNodeObject, isNode) {
        if (!(this.blazorActions & BlazorAction.GroupClipboardInProcess)) {
            var value = void 0;
            var oldObjects = isNode ? this.oldNodeObjects : this.oldConnectorObjects;
            for (var i = 0; i < oldObjects.length; i++) {
                if (oldObjects[i].id === oldNodeObject.id) {
                    value = true;
                }
            }
            if (!value) {
                isNode ? (this.oldNodeObjects.push(oldNodeObject)) : this.oldConnectorObjects.push(oldNodeObject);
            }
        }
    };
    /* tslint:disable */
    /** @private */
    Diagram.prototype.nodePropertyChange = function (actualObject, oldObject, node, isLayout, rotate, propertyChange) {
        if (this.canEnableBlazorObject && actualObject.id != 'helper') {
            var node_2 = cloneObject(actualObject);
            this.insertValue(node_2, true);
        }
        var existingBounds = actualObject.wrapper.outerBounds;
        var existingInnerBounds = actualObject.wrapper.bounds;
        var updateConnector = false;
        var i;
        var j;
        var offsetX;
        var offsetY;
        var update;
        var tx;
        var ty;
        if (node.width !== undefined) {
            if (!actualObject.children) {
                actualObject.wrapper.children[0].width = node.width;
                update = true;
                updateConnector = true;
            }
            else if (!actualObject.container) {
                this.scaleObject(actualObject, node.width, true);
            }
            else {
                actualObject.wrapper.width = node.width;
            }
        }
        if (node.height !== undefined) {
            if (!actualObject.children) {
                actualObject.wrapper.children[0].height = node.height;
                update = true;
                updateConnector = true;
            }
            else if (!actualObject.container) {
                this.scaleObject(actualObject, node.height, false);
            }
            else {
                actualObject.wrapper.height = node.height;
            }
        }
        update = this.nodePropertyChangeExtend(actualObject, oldObject, node, update);
        if (node.constraints !== undefined && canShadow(oldObject) !== canShadow(node)) {
            actualObject.wrapper.children[0].shadow = canShadow(actualObject) ? actualObject.shadow : null;
        }
        if (node.offsetX !== undefined) {
            if (actualObject.wrapper.flip !== 'None') {
                if (actualObject.offsetX !== actualObject.wrapper.offsetX && oldObject.offsetX !== undefined) {
                    var offsetX_1 = node.offsetX - oldObject.offsetX;
                    actualObject.wrapper.offsetX = actualObject.wrapper.offsetX + offsetX_1;
                    this.updateFlipOffset(actualObject.wrapper, offsetX_1, 0, actualObject.wrapper.flip);
                }
            }
            else {
                actualObject.wrapper.offsetX = node.offsetX;
            }
            update = true;
            updateConnector = true;
        }
        if (node.offsetY !== undefined) {
            if (actualObject.wrapper.flip !== 'None') {
                if (actualObject.offsetY !== actualObject.wrapper.offsetY && oldObject.offsetY !== undefined) {
                    var offsetY_1 = node.offsetY - oldObject.offsetY;
                    actualObject.wrapper.offsetY = actualObject.wrapper.offsetY + offsetY_1;
                    this.updateFlipOffset(actualObject.wrapper, 0, offsetY_1, actualObject.wrapper.flip);
                }
            }
            else {
                actualObject.wrapper.offsetY = node.offsetY;
            }
            update = true;
            updateConnector = true;
        }
        if (node.pivot !== undefined) {
            actualObject.wrapper.pivot = node.pivot;
            update = true;
        }
        if (node.minWidth !== undefined) {
            actualObject.wrapper.minWidth = actualObject.wrapper.children[0].minWidth = node.minWidth;
            update = true;
            updateConnector = true;
        }
        if (node.minHeight !== undefined) {
            actualObject.wrapper.minHeight = actualObject.wrapper.children[0].minHeight = node.minHeight;
            update = true;
            updateConnector = true;
        }
        if (node.maxWidth !== undefined) {
            actualObject.wrapper.maxWidth = node.maxWidth;
            update = true;
            updateConnector = true;
        }
        if (node.maxHeight !== undefined) {
            actualObject.wrapper.maxHeight = node.maxHeight;
            update = true;
            updateConnector = true;
        }
        if (node.flip !== undefined) {
            actualObject.wrapper.flip = node.flip;
            update = true;
            updateConnector = true;
            if (actualObject.wrapper.elementActions & ElementAction.ElementIsGroup) {
                alignElement(actualObject.wrapper, actualObject.offsetX, actualObject.offsetY, this, node.flip);
                if (actualObject && actualObject.children) {
                    for (var _i = 0, _a = actualObject.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var updateNode = this.nameTable[child];
                        updateNode.wrapper.flip = node.flip;
                        this.updatePorts(updateNode, node.flip);
                    }
                }
            }
            else {
                actualObject.wrapper.children[0].flip = node.flip;
                this.updatePorts(actualObject, node.flip);
            }
        }
        if (node.rotateAngle !== undefined && (actualObject.constraints & NodeConstraints.Rotate)) {
            if (actualObject.children && rotate) {
                this.commandHandler.rotateObjects(actualObject, [actualObject], actualObject.rotateAngle - actualObject.wrapper.rotateAngle, { x: actualObject.offsetX, y: actualObject.offsetY }, false);
            }
            actualObject.wrapper.rotateAngle = node.rotateAngle;
            update = true;
            updateConnector = true;
        }
        if (node.backgroundColor !== undefined) {
            actualObject.wrapper.style.fill = node.backgroundColor;
        }
        if (node.visible !== undefined) {
            this.updateElementVisibility(actualObject.wrapper, actualObject, actualObject.visible);
        }
        if (node.shape !== undefined && actualObject.shape.type !== 'Bpmn') {
            update = true;
            updateShape(node, actualObject, oldObject, this);
            updateConnector = true;
        }
        if (node.margin) {
            update = true;
            this.updateMargin(actualObject, node);
            updateConnector = true;
        }
        if ((((node.shape !== undefined && (node.shape.type === undefined)) || node.width !== undefined
            || node.height !== undefined || node.style !== undefined) && actualObject.shape.type === 'Bpmn' && this.bpmnModule)
            || (isBlazor() && node && node.shape && node.shape.type === 'Bpmn')) {
            update = true;
            updateConnector = true;
            this.bpmnModule.updateBPMN(node, oldObject, actualObject, this);
        }
        if (actualObject.shape.type === 'UmlActivity' && ((!isBlazor() && actualObject.shape.shape === 'FinalNode') ||
            (isBlazor() && actualObject.shape.umlActivityShape === 'FinalNode'))) {
            update = true;
            updateConnector = true;
            this.updateUMLActivity(node, oldObject, actualObject, this);
        }
        if ((actualObject.shape && actualObject.shape.type === 'UmlClassifier') || (actualObject.parentId &&
            this.nameTable[actualObject.parentId] && this.nameTable[actualObject.parentId].shape.type === 'UmlClassifier')) {
            update = true;
            updateConnector = true;
        }
        if (node.ports !== undefined) {
            for (var _b = 0, _c = Object.keys(node.ports); _b < _c.length; _b++) {
                var key = _c[_b];
                var index = Number(key);
                update = true;
                var changedObject = node.ports[key];
                var actualPort = actualObject.ports[index];
                this.updatePort(changedObject, actualPort, actualObject.wrapper);
                updateConnector = true;
            }
        }
        if (node.annotation !== undefined || node.annotations !== undefined || node.width !== undefined) {
            for (var _d = 0, _e = Object.keys(node.annotations || actualObject.annotations); _d < _e.length; _d++) {
                var key = _e[_d];
                var index = Number(key);
                update = true;
                var changedObject = void 0;
                if (node.annotation) {
                    changedObject = node.annotation;
                }
                else {
                    changedObject = node.annotations ? node.annotations[key] : actualObject.annotations;
                }
                var actualAnnotation = actualObject.annotations[index];
                if (actualAnnotation) {
                    var updateSize = actualObject.width ? true : false;
                    this.updateAnnotation(changedObject, actualAnnotation, actualObject.wrapper, actualObject, updateSize);
                    var swimLaneNode = this.nameTable[actualObject.parentId];
                    if ((swimLaneNode && swimLaneNode.shape.type === 'SwimLane')) {
                        var laneHeader = 'LaneHeaderParent';
                        var phaseHeader = 'PhaseHeaderParent';
                        if ((actualObject.isLane || actualObject.isPhase)) {
                            var collection = actualObject.isLane ?
                                swimLaneNode.shape.lanes : swimLaneNode.shape.phases;
                            for (var j_2 = 0; j_2 < collection.length; j_2++) {
                                if (collection[j_2].id === (actualObject[laneHeader] || actualObject[phaseHeader])) {
                                    collection[j_2].header.annotation.content = actualObject.annotations[0].content;
                                    collection[j_2].header.annotation.style = actualObject.annotations[0].style;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (node.expandIcon !== undefined || node.collapseIcon !== undefined || node.isExpanded !== undefined) {
            this.updateIcon(actualObject);
            this.updateDefaultLayoutIcons(actualObject);
            if (node.isExpanded !== undefined) {
                this.commandHandler.expandNode(actualObject, this);
            }
            update = true;
        }
        if (node.fixedUserHandles !== undefined) {
            var index = void 0;
            var changedObject = void 0;
            var actualfixedUserHandle = void 0;
            for (var _f = 0, _g = Object.keys(node.fixedUserHandles); _f < _g.length; _f++) {
                var key = _g[_f];
                index = Number(key);
                update = true;
                if (node.fixedUserHandles[index]) {
                    changedObject = node.fixedUserHandles[index];
                }
                actualfixedUserHandle = actualObject.fixedUserHandles[index];
                if (actualfixedUserHandle) {
                    this.updateNodefixedUserHandle(changedObject, actualfixedUserHandle, actualObject.wrapper, actualObject);
                }
            }
        }
        if (node.tooltip !== undefined) {
            this.updateTooltip(actualObject, node);
        }
        if (update) {
            if (this.bpmnModule !== undefined) {
                this.bpmnModule.updateTextAnnotationProp(actualObject, { offsetX: (oldObject.offsetX || actualObject.offsetX), offsetY: (oldObject.offsetY || actualObject.offsetY) }, this);
            }
            if (this.checkSelectedItem(actualObject) && actualObject.wrapper.children[0] instanceof TextElement) {
                actualObject.wrapper.children[0].refreshTextElement();
            }
            actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height), actualObject.id, this.onLoadImageSize.bind(this));
            actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
            this.updateObject(actualObject, oldObject, node);
            if (actualObject.shape.type === 'SwimLane' && !this.currentSymbol && !(this.diagramActions & DiagramAction.ToolAction)) {
                updateHeaderMaxWidth(this, actualObject);
                var grid = actualObject.wrapper.children[0];
                var shape = actualObject.shape;
                var column = grid.columnDefinitions().length;
                if (shape.orientation === 'Horizontal') {
                    var index = (shape.header && shape.hasHeader) ? 1 : 0;
                    updatePhaseMaxWidth(actualObject, this, grid.rows[index].cells[column - 1], column - 1);
                }
                actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
                actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
            }
            if ((!(this.diagramActions & DiagramAction.ToolAction)) || (this.diagramActions & DiagramAction.UndoRedo)) {
                if (this.checkSelectedItem(actualObject)) {
                    this.updateSelector();
                }
            }
            if (existingBounds.equals(existingBounds, actualObject.wrapper.outerBounds) === false) {
                this.updateQuad(actualObject);
            }
            if (!isLayout) {
                this.commandHandler.connectorSegmentChange(actualObject, existingInnerBounds, (node.rotateAngle !== undefined) ? true : false);
                // if (updateConnector) {
                //     this.updateConnectorEdges(actualObject);
                // }
            }
            else {
                if (actualObject && actualObject.visible && actualObject.outEdges) {
                    this.updateIconVisibility(actualObject, (actualObject.outEdges.length === 0 ? false : true));
                }
            }
            if (this.bpmnModule !== undefined) {
                this.bpmnModule.updateDocks(actualObject, this);
            }
            if (!node.annotations || !actualObject.processId) {
                this.updateGroupOffset(actualObject);
            }
            // if (existingBounds.equals(existingBounds, actualObject.wrapper.outerBounds) === false) { this.updateQuad(actualObject); }
            // EJ2-42005 - The parent of the actualObject is not measured and arranged when a node or connector is selected.
            // The condition restricts the measure and arrange of the actualObject whenever a node or connector is selected.
            // Commented @Dheepshiva
            // let objects: (NodeModel | ConnectorModel)[] = [];
            // objects = objects.concat(this.selectedItems.nodes, this.selectedItems.connectors);
            // if (objects.length === 0) {
            if (actualObject.parentId && this.nameTable[actualObject.parentId]) {
                var parent_4 = this.nameTable[actualObject.parentId];
                parent_4.wrapper.measure(new Size(parent_4.wrapper.width, actualObject.wrapper.height));
                parent_4.wrapper.arrange(parent_4.wrapper.desiredSize);
                parent_4.offsetX = parent_4.wrapper.offsetX;
                parent_4.offsetY = parent_4.wrapper.offsetY;
            }
            // }
            if (existingInnerBounds.equals(existingInnerBounds, actualObject.wrapper.bounds) === false) {
                this.updateGroupSize(actualObject);
                if (actualObject.children) {
                    this.updateGroupOffset(actualObject);
                }
            }
            if (actualObject.shape.type === 'SwimLane' && !this.currentSymbol && (this.diagramActions & DiagramAction.Render)) {
                var connectors = getConnectors(this, actualObject.wrapper.children[0], undefined, true);
                updateConnectorsProperties(connectors, this);
            }
            if (!this.preventNodesUpdate) {
                if (!canVitualize(this) || (canVitualize(this) && this.scroller.oldCollectionObjects.indexOf(actualObject.id) > -1)) {
                    if (this.diagramActions & DiagramAction.PreventZIndexOnDragging) {
                        this.updateDiagramObject(actualObject, true);
                    }
                    else {
                        this.updateDiagramObject(actualObject);
                    }
                }
                if (!isLayout && updateConnector) {
                    if (this.lineRoutingModule && this.diagramActions && (this.constraints & DiagramConstraints.LineRouting) && actualObject.id !== 'helper') {
                        if (!(this.diagramActions & DiagramAction.ToolAction)) {
                            this.lineRoutingModule.renderVirtualRegion(this, true);
                        }
                    }
                    this.updateConnectorEdges(actualObject);
                    if (actualObject.id !== 'helper' && !(this.diagramActions & DiagramAction.ToolAction)) {
                        var objects = this.spatialSearch.findObjects(actualObject.wrapper.outerBounds);
                        for (var i_4 = 0; i_4 < objects.length; i_4++) {
                            var object = objects[i_4];
                            if (object instanceof Connector) {
                                this.connectorPropertyChange(objects[i_4], {}, {
                                    sourceID: object.sourceID,
                                    targetID: object.targetID,
                                    sourcePortID: object.sourcePortID,
                                    targetPortID: object.targetPortID,
                                    sourcePoint: object.sourcePoint,
                                    targetPoint: object.targetPoint
                                });
                            }
                        }
                    }
                }
            }
            if (actualObject.status !== 'New' && this.diagramActions) {
                actualObject.status = 'Update';
            }
        }
        if (!propertyChange) {
            var element = actualObject;
            var args = {
                element: element, cause: this.diagramActions,
                oldValue: oldObject, newValue: node
            };
            if (isBlazor() && this.propertyChange) {
                args.element = { node: cloneBlazorObject(element) };
                args.oldValue = { node: cloneBlazorObject(oldObject) };
                args.newValue = { node: cloneBlazorObject(node) };
            }
            this.triggerEvent(DiagramEvent.propertyChange, args);
        }
    };
    Diagram.prototype.updatePorts = function (actualObject, flip) {
        if (actualObject && actualObject.ports.length > 0) {
            for (var _i = 0, _a = Object.keys(actualObject.ports); _i < _a.length; _i++) {
                var key = _a[_i];
                var index = Number(key);
                var actualPort = actualObject.ports[index];
                var portWrapper = this.getWrapper(actualObject.wrapper, actualPort.id);
                portWrapper = updatePortEdges(portWrapper, flip, actualPort);
                portWrapper.relativeMode = 'Point';
                portWrapper.measure(new Size(portWrapper.width, portWrapper.height));
                portWrapper.arrange(portWrapper.desiredSize);
            }
        }
    };
    Diagram.prototype.updateFlipOffset = function (element, diffX, diffY, flip) {
        if (element.hasChildren()) {
            for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
                var child = _a[_i];
                if (flip === 'Horizontal' || flip === 'Both') {
                    child.flipOffset.x = child.flipOffset.x + diffX;
                }
                if (flip === 'Vertical' || flip === 'Both') {
                    child.flipOffset.y = child.flipOffset.y + diffY;
                }
                if (child instanceof Canvas || child instanceof Container) {
                    this.updateFlipOffset(child, diffX, diffY, flip);
                }
            }
        }
    };
    Diagram.prototype.updateUMLActivity = function (changedProp, oldObject, actualObject, diagram) {
        var sizeChanged = changedProp.width !== undefined || changedProp.height !== undefined;
        if (sizeChanged) {
            var innerFinalNode = actualObject.wrapper.children[0].children[0];
            innerFinalNode.width = changedProp.width;
            innerFinalNode.height = changedProp.height;
            var outerFinalNode = actualObject.wrapper.children[0].children[1];
            outerFinalNode.width = changedProp.width / 1.5;
            outerFinalNode.height = changedProp.height / 1.5;
        }
    };
    Diagram.prototype.updateConnectorProperties = function (connector) {
        if (this.preventConnectorsUpdate) {
            var index = this.selectionConnectorsList.indexOf(connector);
            if (index === -1) {
                this.selectionConnectorsList.push(connector);
            }
        }
        else {
            var conn = {
                sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint, sourceID: connector.sourceID,
                targetID: connector.targetID, sourcePortID: connector.sourcePortID, targetPortID: connector.targetPortID
            };
            this.connectorPropertyChange(connector, {}, conn, undefined, true);
        }
    };
    /** @private */
    Diagram.prototype.updateConnectorEdges = function (actualObject) {
        if (actualObject.inEdges.length > 0) {
            for (var j = 0; j < actualObject.inEdges.length; j++) {
                this.updateConnectorProperties(this.nameTable[actualObject.inEdges[j]]);
            }
        }
        if (actualObject.outEdges.length > 0) {
            for (var k = 0; k < actualObject.outEdges.length; k++) {
                this.updateConnectorProperties(this.nameTable[actualObject.outEdges[k]]);
            }
        }
        if (actualObject.parentId && this.nameTable[actualObject.parentId]) {
            this.updateConnectorEdges(this.nameTable[actualObject.parentId]);
        }
    };
    /* tslint:enable */
    Diagram.prototype.connectorProprtyChangeExtend = function (actualObject, oldProp, newProp, updateSelector) {
        if (newProp.type !== undefined && newProp.type !== oldProp.type) {
            if (actualObject.segments.length > 0 && newProp.segments === undefined) {
                actualObject.segments = [];
            }
        }
        if ((newProp.shape !== undefined) && actualObject.shape !== undefined &&
            actualObject.shape && actualObject.shape.type === 'Bpmn' && this.bpmnModule) {
            this.bpmnModule.updateBPMNConnector(actualObject, oldProp, newProp, this);
        }
        if (actualObject.constraints !== undefined) {
            this.updateThumbConstraints(this.selectedItems.connectors, this.selectedItems);
            return updateSelector = true;
        }
        return updateSelector;
    };
    /* tslint:disable */
    /** @private */
    Diagram.prototype.connectorPropertyChange = function (actualObject, oldProp, newProp, disableBridging, propertyChange) {
        if (this.canEnableBlazorObject) {
            var node = cloneObject(actualObject);
            this.insertValue(node, false);
        }
        var existingBounds = actualObject.wrapper.bounds;
        var updateSelector = false;
        var points = [];
        updateSelector = this.connectorProprtyChangeExtend(actualObject, oldProp, newProp, updateSelector);
        var inPort;
        var outPort;
        var source;
        var target;
        if (newProp.visible !== undefined) {
            this.updateElementVisibility(actualObject.wrapper, actualObject, actualObject.visible);
        }
        if (newProp.sourcePoint !== undefined || newProp.targetPoint !== undefined
            || newProp.sourceID !== undefined || newProp.targetID !== undefined || newProp.targetPadding !== undefined ||
            newProp.sourcePortID !== undefined || newProp.targetPortID !== undefined || newProp.sourcePadding !== undefined ||
            newProp.type !== undefined || newProp.segments !== undefined || newProp.flip !== undefined) {
            if ((newProp.sourceID !== undefined && newProp.sourceID !== oldProp.sourceID) || newProp.sourcePortID) {
                var sourceNode = this.nameTable[actualObject.sourceID];
                outPort = this.findInOutConnectPorts(sourceNode, false);
                if (!sourceNode || (canOutConnect(sourceNode) || (actualObject.sourcePortID !== '' && canPortOutConnect(outPort)))) {
                    actualObject.sourceWrapper = sourceNode ? this.getEndNodeWrapper(sourceNode, actualObject, true) : undefined;
                    if (actualObject.sourcePortID && newProp.sourcePortID === undefined) {
                        actualObject.sourcePortWrapper = sourceNode ? this.getWrapper(sourceNode.wrapper, actualObject.sourcePortID) : undefined;
                    }
                    this.removePortEdges(this.nameTable[oldProp.sourceID] || sourceNode, oldProp.sourcePortID || actualObject.sourcePortID, actualObject.id, false);
                }
                if (newProp.sourceID !== undefined && oldProp.sourceID !== undefined && oldProp.sourceID !== '') {
                    var oldSource = this.nameTable[oldProp.sourceID];
                    if (oldSource !== undefined && oldSource.outEdges && oldSource.outEdges.indexOf(actualObject.id) !== -1) {
                        removeItem(oldSource.outEdges, actualObject.id);
                    }
                }
                this.updateEdges(actualObject);
            }
            if (newProp.targetID !== undefined && newProp.targetID !== oldProp.targetID) {
                var targetNode = this.nameTable[newProp.targetID];
                inPort = this.findInOutConnectPorts(targetNode, true);
                if (!targetNode || (canInConnect(targetNode) || (actualObject.targetPortID !== '' && canPortInConnect(inPort)))) {
                    actualObject.targetWrapper = targetNode ? this.getEndNodeWrapper(targetNode, actualObject, false) : undefined;
                    if (actualObject.targetPortID && newProp.targetPortID === undefined) {
                        actualObject.targetPortWrapper = targetNode ? this.getWrapper(targetNode.wrapper, actualObject.targetPortID) : undefined;
                    }
                    this.removePortEdges(this.nameTable[oldProp.targetID] || targetNode, oldProp.targetPortID || actualObject.targetPortID, actualObject.id, true);
                }
                if (oldProp !== undefined && oldProp.targetID !== undefined && oldProp.targetID !== '') {
                    var oldTarget = this.nameTable[oldProp.targetID];
                    if (oldTarget !== undefined && oldTarget.inEdges && oldTarget.inEdges.indexOf(actualObject.id) !== -1) {
                        removeItem(oldTarget.inEdges, actualObject.id);
                    }
                }
                this.updateEdges(actualObject);
            }
            if (newProp.sourcePortID !== undefined && newProp.sourcePortID !== oldProp.sourcePortID) {
                if (actualObject.sourceID && this.nameTable[actualObject.sourceID]) {
                    source = this.nameTable[actualObject.sourceID].wrapper;
                }
                var sourceNode = this.nameTable[actualObject.sourceID];
                if (!sourceNode || (canOutConnect(sourceNode) || (actualObject.sourcePortID !== '' && canPortOutConnect(outPort)))) {
                    actualObject.sourcePortWrapper = source ? this.getWrapper(source, newProp.sourcePortID) : undefined;
                }
                else if (actualObject.sourcePortID === '' && !canOutConnect(sourceNode)) {
                    actualObject.sourcePortWrapper = undefined;
                }
            }
            if (newProp.targetPortID !== undefined && newProp.targetPortID !== oldProp.targetPortID) {
                var targetNode = this.nameTable[actualObject.targetID];
                if (actualObject.targetID && this.nameTable[actualObject.targetID]) {
                    target = this.nameTable[actualObject.targetID].wrapper;
                }
                if (!targetNode || (canInConnect(targetNode) || (actualObject.targetPortID !== '' && canPortInConnect(inPort)))) {
                    actualObject.targetPortWrapper = target ? this.getWrapper(target, newProp.targetPortID) : undefined;
                }
                else if (actualObject.targetPortID === '' && !canInConnect(targetNode)) {
                    actualObject.targetPortWrapper = undefined;
                }
            }
            if (newProp.flip !== undefined) {
                actualObject.flip = newProp.flip;
                flipConnector(actualObject);
            }
            if (actualObject.type === 'Orthogonal' && this.lineRoutingModule && this.diagramActions &&
                (this.constraints & DiagramConstraints.LineRouting) && !(this.diagramActions & DiagramAction.ToolAction)) {
                this.lineRoutingModule.renderVirtualRegion(this, true);
                this.lineRoutingModule.refreshConnectorSegments(this, actualObject, false);
            }
            points = this.getPoints(actualObject);
        } //Add prop change for zindex, alignments and margin
        if (newProp.style !== undefined) {
            updateStyle(newProp.style, actualObject.wrapper.children[0]);
        }
        if (points.length > 0 || newProp.sourceDecorator !== undefined || (newProp.targetDecorator !== undefined
            && (canMeasureDecoratorPath(Object.keys(newProp.targetDecorator)))) || newProp.cornerRadius !== undefined) {
            updateConnector(actualObject, points.length > 0 ? points : actualObject.intermediatePoints, this.diagramActions);
            if (newProp.type !== undefined) {
                updateSelector = true;
            }
            if (points.length > 0) {
                actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
                actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
                this.updateConnectorAnnotation(actualObject);
                this.updateConnectorfixedUserHandles(actualObject);
                this.updateObject(actualObject, oldProp, newProp);
            } //work-around to update intersected connector bridging
        }
        if ((newProp.sourcePoint || newProp.targetPoint || newProp.segments)
            && this.diagramActions === DiagramAction.Render) {
            updateSelector = true;
        }
        if (actualObject.shape.type === 'Bpmn' && actualObject.shape.sequence === 'Default') {
            this.commandHandler.updatePathElementOffset(actualObject);
        }
        if (!disableBridging) {
            this.updateBridging();
        }
        this.updateAnnotations(newProp, actualObject);
        this.updatefixedUserHandle(newProp, actualObject);
        actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
        actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        if (existingBounds.equals(existingBounds, actualObject.wrapper.bounds) === false) {
            this.updateQuad(actualObject);
            this.updateGroupSize(actualObject);
        }
        if (updateSelector === true && this.checkSelectedItem(actualObject) && (!(this.diagramActions & DiagramAction.ToolAction)
            || (this.diagramActions & DiagramAction.UndoRedo))) {
            this.updateSelector();
        }
        if (!this.preventConnectorsUpdate) {
            if (!canVitualize(this) || (canVitualize(this) && this.scroller.oldCollectionObjects.indexOf(actualObject.id) > -1)) {
                if (this.diagramActions & DiagramAction.PreventZIndexOnDragging) {
                    this.updateDiagramObject(actualObject, true);
                }
                else {
                    this.updateDiagramObject(actualObject);
                }
            }
        }
        if (this.diagramActions && actualObject.status !== 'New') {
            actualObject.status = 'Update';
        }
        this.triggerPropertyChange(propertyChange, actualObject, oldProp, newProp);
    };
    /* tslint:enable */
    /** @private */
    Diagram.prototype.removePortEdges = function (node, portId, item, isInEdges) {
        if (node) {
            for (var i = 0; i < node.ports.length; i++) {
                var port = node.ports[i];
                if (port.id === portId) {
                    var portEdge = (isInEdges) ? port.inEdges : port.outEdges;
                    removeItem(portEdge, item);
                }
            }
        }
    };
    Diagram.prototype.getpropertyChangeArgs = function (element, oldProp, newProp, args) {
        args.element = { connector: cloneBlazorObject(element) };
        args.oldValue = { connector: cloneBlazorObject(oldProp) };
        args.newValue = { connector: cloneBlazorObject(newProp) };
        return args;
    };
    Diagram.prototype.triggerPropertyChange = function (propertyChange, actualObject, oldProp, newProp) {
        if (!propertyChange) {
            var element = actualObject;
            var args = {
                element: cloneBlazorObject(element), cause: this.diagramActions,
                oldValue: cloneBlazorObject(oldProp), newValue: cloneBlazorObject(newProp)
            };
            if (isBlazor()) {
                args = this.getpropertyChangeArgs(element, oldProp, newProp, args);
            }
            this.triggerEvent(DiagramEvent.propertyChange, args);
        }
    };
    Diagram.prototype.findInOutConnectPorts = function (node, isInconnect) {
        var port = {};
        if (node) {
            port = getInOutConnectPorts(node, isInconnect);
        }
        return port;
    };
    Diagram.prototype.getPoints = function (actualObject, points) {
        var pts;
        var lineDistributionModule = this.lineDistributionModule ? true : false;
        pts = actualObject.getConnectorPoints(actualObject.type, points, this.layout.type === 'ComplexHierarchicalTree' || this.layout.type === 'HierarchicalTree' ?
            this.layout.orientation : undefined, lineDistributionModule);
        return pts;
    };
    /**
     * update the  opacity  and visibility for the node  once the layout animation starts
     */
    /** @private */
    Diagram.prototype.updateNodeProperty = function (element, visible, opacity) {
        if (visible === undefined) {
            this.updateElementVisibility(element, this.nameTable[element.id], visible);
        }
        else {
            element.style.opacity = opacity;
            for (var i = 0; i < element.children.length; i++) {
                if (element.children[i] instanceof Container) {
                    this.updateNodeProperty(element.children[i], undefined, opacity);
                }
                element.children[i].style.opacity = opacity;
            }
        }
    };
    /**
     * checkSelected Item for Connector
     * @private
     */
    Diagram.prototype.checkSelectedItem = function (actualObject) {
        var selectorModel = this.selectedItems;
        var isSelected = false;
        var selItems = [];
        selItems = selItems.concat(selectorModel.nodes, selectorModel.connectors);
        if (selItems.length > 0) {
            if (actualObject.id === selItems[selItems.length - 1].id) {
                isSelected = true;
            }
        }
        return isSelected;
    };
    /**
     * Updates the visibility of the diagram container
     * @private
     */
    Diagram.prototype.updateDiagramContainerVisibility = function (element, visible) {
        if (element instanceof Container) {
            for (var i = 0; i < element.children.length; i++) {
                this.updateDiagramContainerVisibility(element.children[i], visible);
            }
        }
        element.visible = visible;
    };
    /**
     * Updates the visibility of the node/connector
     * @private
     */
    Diagram.prototype.updateElementVisibility = function (element, obj, visible) {
        if (visible !== undefined) {
            element.visible = visible;
            if (obj instanceof Node) {
                //content
                if (!obj.children) {
                    element.children[0].visible = visible;
                    this.updateDiagramContainerVisibility(element.children[0], visible);
                    if (obj.shape.type === 'Bpmn' && this.bpmnModule) {
                        this.bpmnModule.updateElementVisibility(obj, visible, this);
                    }
                }
                else {
                    for (var _i = 0, _a = obj.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        this.updateElementVisibility(this.nameTable[child].wrapper, this.nameTable[child], visible);
                    }
                }
                //ports
                if (obj.ports) {
                    for (var _b = 0, _c = obj.ports; _b < _c.length; _b++) {
                        var port = _c[_b];
                        if (port.visibility & PortVisibility.Visible) {
                            var wrapper = this.getWrapper(element, port.id);
                            wrapper.visible = visible;
                        }
                    }
                }
                if (obj.annotations) {
                    for (var _d = 0, _e = obj.annotations; _d < _e.length; _d++) {
                        var annotation = _e[_d];
                        var wrapper = this.getWrapper(element, annotation.id);
                        wrapper.visible = visible;
                    }
                }
            }
            else {
                //path and decorators
                for (var i = 0; i < 3; i++) {
                    element.children[i].visible = visible;
                }
            }
            if (obj.annotations) {
                //annotations
                for (var _f = 0, _g = obj.annotations; _f < _g.length; _f++) {
                    var annotation = _g[_f];
                    var wrapper = this.getWrapper(element, annotation.id);
                    wrapper.visible = visible;
                }
            }
            if (obj.expandIcon || obj.collapseIcon) {
                var wrapper = this.getWrapper(element, 'icon_content');
                if (wrapper) {
                    for (var i = 0; i < wrapper.children.length; i++) {
                        wrapper.children[i].visible = visible;
                    }
                    wrapper.visible = visible;
                }
                if (obj && obj.visible && obj.outEdges) {
                    this.updateIconVisibility(obj, (obj.outEdges.length === 0 ? false : true));
                }
            }
            if (visible === false) {
                this.unSelect(this.nameTable[element.id]);
            }
            if ((obj instanceof Node && !this.preventNodesUpdate) || (obj instanceof Connector && !this.preventConnectorsUpdate)) {
                //Avoid calling updateDiagramObject method during rendering
                if (this.diagramActions) {
                    this.updateDiagramObject(this.nameTable[element.id], undefined, true);
                }
            }
        }
    };
    Diagram.prototype.updateAnnotations = function (newProp, actualObject) {
        if (newProp.annotations !== undefined) {
            for (var _i = 0, _a = Object.keys(newProp.annotations); _i < _a.length; _i++) {
                var key = _a[_i];
                var index = Number(key);
                var changedObject = newProp.annotations[key];
                var actualAnnotation = actualObject.annotations[index];
                this.updateAnnotation(changedObject, actualAnnotation, actualObject.wrapper, actualObject);
            }
        }
    };
    Diagram.prototype.updatefixedUserHandle = function (newProp, actualObject) {
        if (newProp.fixedUserHandles !== undefined) {
            var index = void 0;
            var changedObject = void 0;
            var actualAnnotation = void 0;
            for (var _i = 0, _a = Object.keys(newProp.fixedUserHandles); _i < _a.length; _i++) {
                var key = _a[_i];
                index = Number(key);
                changedObject = newProp.fixedUserHandles[key];
                actualAnnotation = actualObject.fixedUserHandles[index];
                this.updateConnectorfixedUserHandle(changedObject, actualAnnotation, actualObject.wrapper, actualObject);
            }
        }
    };
    /** @private */
    Diagram.prototype.updateConnectorfixedUserHandle = function (changedObject, actualfixedUserHandle, nodes, actualObject, canUpdateSize) {
        var fixedUserHandleWrapper;
        var isMeasure = false;
        fixedUserHandleWrapper = this.getWrapper(nodes, actualfixedUserHandle.id);
        if (fixedUserHandleWrapper !== undefined) {
            if (changedObject.width !== undefined) {
                fixedUserHandleWrapper.width = changedObject.width;
                isMeasure = true;
            }
            if (changedObject.height !== undefined) {
                fixedUserHandleWrapper.height = changedObject.height;
                isMeasure = true;
            }
            if (actualfixedUserHandle instanceof ConnectorFixedUserHandle &&
                (changedObject.offset !== undefined)) {
                actualObject.updateAnnotation(actualfixedUserHandle, actualObject.intermediatePoints, actualObject.wrapper.bounds, fixedUserHandleWrapper);
            }
            if ((actualfixedUserHandle instanceof ConnectorFixedUserHandle) && changedObject.displacement) {
                if (changedObject.displacement.x !== undefined ||
                    changedObject.displacement.y !== undefined) {
                    isMeasure = true;
                }
            }
            if (changedObject.fill !== undefined) {
                fixedUserHandleWrapper.style.fill = changedObject.fill;
            }
            if (changedObject.handleStrokeColor !== undefined) {
                fixedUserHandleWrapper.style.strokeColor = changedObject.handleStrokeColor;
            }
            if (changedObject.handleStrokeWidth !== undefined) {
                fixedUserHandleWrapper.style.strokeWidth = changedObject.handleStrokeWidth;
            }
            if (changedObject.visibility !== undefined) {
                fixedUserHandleWrapper.visible = changedObject.visibility;
            }
            if (changedObject.cornerRadius !== undefined) {
                fixedUserHandleWrapper.cornerRadius = changedObject.cornerRadius;
            }
            this.updatefixedUserHandleContent(changedObject, isMeasure, fixedUserHandleWrapper, actualObject, actualfixedUserHandle, nodes);
            if (isMeasure === true) {
                fixedUserHandleWrapper.measure(new Size(fixedUserHandleWrapper.width, fixedUserHandleWrapper.height));
                fixedUserHandleWrapper.arrange(fixedUserHandleWrapper.desiredSize);
            }
        }
    };
    /** @private */
    Diagram.prototype.updateAnnotation = function (changedObject, actualAnnotation, nodes, actualObject, canUpdateSize) {
        var annotationWrapper;
        var isMeasure = false;
        annotationWrapper = this.getWrapper(nodes, actualAnnotation.id);
        if (annotationWrapper !== undefined) {
            if (changedObject.width !== undefined && changedObject.height !== undefined) {
                annotationWrapper.width = changedObject.width;
                annotationWrapper.height = changedObject.height;
                isMeasure = true;
            }
            if (changedObject.rotateAngle !== undefined) {
                annotationWrapper.rotateAngle = changedObject.rotateAngle;
            }
            if (canUpdateSize && !(annotationWrapper instanceof DiagramHtmlElement)) {
                annotationWrapper.refreshTextElement();
            }
            if (actualAnnotation instanceof PathAnnotation && changedObject.segmentAngle !== undefined) {
                annotationWrapper.rotateAngle = actualAnnotation.rotateAngle;
            }
            if (actualAnnotation instanceof ShapeAnnotation &&
                changedObject.offset !== undefined) {
                var offset = changedObject.offset;
                isMeasure = true;
                var offsetX = offset.x !== undefined ? offset.x :
                    actualAnnotation.offset.x;
                var offsetY = offset.y !== undefined ? offset.y :
                    actualAnnotation.offset.y;
                annotationWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                annotationWrapper.relativeMode = 'Point';
            }
            else if (actualAnnotation instanceof PathAnnotation &&
                (changedObject.offset !== undefined ||
                    changedObject.segmentAngle !== undefined)) {
                actualObject.updateAnnotation(actualAnnotation, actualObject.intermediatePoints, actualObject.wrapper.bounds, annotationWrapper);
            }
            if ((actualAnnotation instanceof PathAnnotation) && changedObject.displacement) {
                if (changedObject.displacement.x !== undefined ||
                    changedObject.displacement.y !== undefined) {
                    isMeasure = true;
                }
            }
            if (changedObject.margin !== undefined) {
                isMeasure = true;
                if (changedObject.margin.bottom !== undefined) {
                    annotationWrapper.margin.bottom = changedObject.margin.bottom;
                }
                if (changedObject.margin.top !== undefined) {
                    annotationWrapper.margin.top = changedObject.margin.top;
                }
                if (changedObject.margin.left !== undefined) {
                    annotationWrapper.margin.left = changedObject.margin.left;
                }
                if (changedObject.margin.right !== undefined) {
                    annotationWrapper.margin.right = changedObject.margin.right;
                }
            }
            if (isMeasure || canUpdateSize) {
                annotationWrapper.width = (actualAnnotation.width || actualObject.width);
                if (actualAnnotation.template) {
                    annotationWrapper.width = (annotationWrapper.width || annotationWrapper.actualSize.width);
                    annotationWrapper.height = (actualAnnotation.height || actualObject.height ||
                        annotationWrapper.actualSize.height);
                }
            }
            if (changedObject.horizontalAlignment !== undefined) {
                annotationWrapper.horizontalAlignment = changedObject.horizontalAlignment;
                isMeasure = true;
            }
            if (changedObject.verticalAlignment !== undefined) {
                annotationWrapper.verticalAlignment = changedObject.verticalAlignment;
                isMeasure = true;
            }
            if (changedObject.visibility !== undefined) {
                annotationWrapper.visible = (nodes.visible && changedObject.visibility) ? true : false;
            }
            if (changedObject.constraints !== undefined) {
                var updateSelector = false;
                if ((annotationWrapper.constraints & AnnotationConstraints.Select) &&
                    (!(changedObject.constraints & AnnotationConstraints.Select)) &&
                    isSelected(this, actualObject, false, annotationWrapper)) {
                    //updateSelector = true;
                }
                annotationWrapper.constraints = changedObject.constraints;
                if (updateSelector) {
                    this.clearSelection();
                }
            }
            if (changedObject.style !== undefined) {
                updateStyle(changedObject.style, annotationWrapper);
            }
            if (changedObject.hyperlink !== undefined) {
                updateHyperlink(changedObject.hyperlink, annotationWrapper, actualAnnotation);
            }
            this.updateAnnotationContent(changedObject, isMeasure, annotationWrapper, actualObject, actualAnnotation, nodes);
            if (isMeasure === true) {
                annotationWrapper.measure(new Size(annotationWrapper.width, annotationWrapper.height));
                annotationWrapper.arrange(annotationWrapper.desiredSize);
            }
            if (!(annotationWrapper instanceof DiagramHtmlElement)) {
                annotationWrapper.refreshTextElement();
            }
            // this.refresh(); this.refreshDiagramLayer();
        }
    };
    Diagram.prototype.updatefixedUserHandleContent = function (changedObject, isMeasure, fixedUserHandleWrapper, actualObject, fixedUserHandleAnnotation, nodes) {
        if (changedObject !== undefined) {
            this.updateConnectorfixedUserHandleWrapper(fixedUserHandleWrapper, actualObject, fixedUserHandleAnnotation, nodes);
        }
    };
    Diagram.prototype.updateConnectorfixedUserHandleWrapper = function (fixedUserHandleWrapper, actualObject, actualAnnotation, nodes) {
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var elementId = _a[_i];
            removeElement(fixedUserHandleWrapper.id + '_groupElement', elementId);
            removeElement(fixedUserHandleWrapper.id + '_html_element', elementId);
        }
        if (actualObject instanceof Connector) {
            var canvas = actualObject.wrapper;
            var segment = canvas.children[0];
            var bounds = new Rect(segment.offsetX - segment.width / 2, segment.offsetY - segment.height / 2, segment.width, segment.height);
            fixedUserHandleWrapper =
                actualObject.getfixedUserHandle(actualObject.fixedUserHandles[actualObject.fixedUserHandles.length - 1], actualObject.intermediatePoints, bounds);
        }
        for (var i = 0; i < nodes.children.length; i++) {
            if (fixedUserHandleWrapper.id === nodes.children[i].id) {
                nodes.children.splice(i, 1, fixedUserHandleWrapper);
            }
        }
    };
    Diagram.prototype.updateAnnotationContent = function (changedObject, isMeasure, annotationWrapper, actualObject, actualAnnotation, nodes) {
        if (changedObject.content !== undefined) {
            if (annotationWrapper) {
                isMeasure = true;
                if (actualObject.shape.type === 'UmlActivity' &&
                    ((isBlazor() && actualObject.shape.umlActivityShape === 'StructuredNode') ||
                        (!isBlazor() && actualObject.shape.shape === 'StructuredNode'))) {
                    annotationWrapper.content = '<<' + changedObject.content + '>>';
                }
                else {
                    annotationWrapper.content = changedObject.content;
                }
            }
            if (annotationWrapper instanceof DiagramHtmlElement) {
                this.updateAnnotationWrapper(annotationWrapper, actualObject, actualAnnotation, nodes);
            }
        }
        if (changedObject.template !== undefined) {
            annotationWrapper.content = changedObject.template;
            this.updateAnnotationWrapper(annotationWrapper, actualObject, actualAnnotation, nodes);
        }
    };
    Diagram.prototype.updateAnnotationWrapper = function (annotationWrapper, actualObject, actualAnnotation, nodes) {
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var elementId = _a[_i];
            removeElement(annotationWrapper.id + '_groupElement', elementId);
            removeElement(annotationWrapper.id + '_html_element', elementId);
        }
        if (actualObject instanceof Node) {
            annotationWrapper =
                actualObject.initAnnotationWrapper(actualAnnotation, this.element.id);
        }
        else if (actualObject instanceof Connector) {
            var canvas = actualObject.wrapper;
            var segment = canvas.children[0];
            var bounds = new Rect(segment.offsetX - segment.width / 2, segment.offsetY - segment.height / 2, segment.width, segment.height);
            annotationWrapper =
                actualObject.getAnnotationElement(actualObject.annotations[actualObject.annotations.length - 1], actualObject.intermediatePoints, bounds, this.getDescription, this.element.id);
        }
        for (var i = 0; i < nodes.children.length; i++) {
            if (annotationWrapper.id === nodes.children[i].id) {
                nodes.children.splice(i, 1, annotationWrapper);
            }
        }
    };
    /** @private */
    Diagram.prototype.updateNodefixedUserHandle = function (changedObject, actualfixedUserHandle, nodes, actualObject) {
        var fixedUserHandleWrapper;
        var isMeasure = false;
        fixedUserHandleWrapper = this.getWrapper(nodes, actualfixedUserHandle.id);
        if (fixedUserHandleWrapper !== undefined) {
            if (changedObject.width !== undefined) {
                fixedUserHandleWrapper.actualSize.width = changedObject.width;
                isMeasure = true;
            }
            if (changedObject.height !== undefined) {
                fixedUserHandleWrapper.height = changedObject.height;
                isMeasure = true;
            }
            if (actualfixedUserHandle instanceof NodeFixedUserHandle &&
                changedObject.offset !== undefined) {
                var offset = changedObject.offset;
                isMeasure = true;
                var offsetX = offset.x !== undefined ? offset.x :
                    actualfixedUserHandle.offset.x;
                var offsetY = offset.y !== undefined ? offset.y :
                    actualfixedUserHandle.offset.y;
                fixedUserHandleWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                fixedUserHandleWrapper.relativeMode = 'Point';
            }
            if (changedObject.margin !== undefined) {
                isMeasure = true;
                if (changedObject.margin.bottom !== undefined) {
                    fixedUserHandleWrapper.margin.bottom = changedObject.margin.bottom;
                }
                if (changedObject.margin.top !== undefined) {
                    fixedUserHandleWrapper.margin.top = changedObject.margin.top;
                }
                if (changedObject.margin.left !== undefined) {
                    fixedUserHandleWrapper.margin.left = changedObject.margin.left;
                }
                if (changedObject.margin.right !== undefined) {
                    fixedUserHandleWrapper.margin.right = changedObject.margin.right;
                }
            }
            if (changedObject.visibility !== undefined) {
                fixedUserHandleWrapper.visible = changedObject.visibility;
            }
            if (changedObject.fill !== undefined) {
                fixedUserHandleWrapper.style.fill = changedObject.fill;
            }
            if (changedObject.handleStrokeColor !== undefined) {
                fixedUserHandleWrapper.style.strokeColor = changedObject.handleStrokeColor;
            }
            if (changedObject.handleStrokeWidth !== undefined) {
                fixedUserHandleWrapper.style.strokeWidth = changedObject.handleStrokeWidth;
            }
            if (changedObject.cornerRadius !== undefined) {
                fixedUserHandleWrapper.cornerRadius = changedObject.cornerRadius;
            }
            this.updatefixedUserHandleWrapper(fixedUserHandleWrapper, actualObject, actualfixedUserHandle, nodes);
            if (isMeasure === true) {
                fixedUserHandleWrapper.measure(new Size(fixedUserHandleWrapper.width, fixedUserHandleWrapper.height));
                fixedUserHandleWrapper.arrange(fixedUserHandleWrapper.desiredSize);
            }
        }
    };
    Diagram.prototype.updatefixedUserHandleWrapper = function (fixedUserHandleWrapper, actualObject, actualAnnotation, nodes) {
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var elementId = _a[_i];
            removeElement(fixedUserHandleWrapper.id + '_groupElement', elementId);
            removeElement(fixedUserHandleWrapper.id + '_html_element', elementId);
        }
        if (actualObject instanceof Node) {
            fixedUserHandleWrapper = actualObject.initfixedUserHandles(actualAnnotation);
        }
        for (var i = 0; i < nodes.children.length; i++) {
            if (fixedUserHandleWrapper.id === nodes.children[i].id) {
                nodes.children.splice(i, 1, fixedUserHandleWrapper);
            }
        }
    };
    /** @private */
    Diagram.prototype.updatePort = function (changedObject, actualPort, nodes) {
        var portWrapper;
        var isMeasure = false;
        portWrapper = this.getWrapper(nodes, actualPort.id);
        if (portWrapper !== undefined) {
            if (changedObject.offset !== undefined) {
                isMeasure = true;
                var offsetX = changedObject.offset.x !== undefined ? changedObject.offset.x :
                    actualPort.offset.x;
                var offsetY = changedObject.offset.y !== undefined ? changedObject.offset.y :
                    actualPort.offset.y;
                portWrapper.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
                portWrapper.relativeMode = 'Point';
            }
            if (changedObject.width !== undefined) {
                isMeasure = true;
                portWrapper.width = changedObject.width;
            }
            if (changedObject.height !== undefined) {
                isMeasure = true;
                portWrapper.height = changedObject.height;
            }
            if (changedObject.visibility !== undefined) {
                portWrapper.visible = (nodes.visible && checkPortRestriction(actualPort, PortVisibility.Visible)) ? true : false;
            }
            if (changedObject.margin !== undefined) {
                isMeasure = true;
                if (changedObject.margin.bottom !== undefined) {
                    portWrapper.margin.bottom = changedObject.margin.bottom;
                }
                if (changedObject.margin.top !== undefined) {
                    portWrapper.margin.top = changedObject.margin.top;
                }
                if (changedObject.margin.right !== undefined) {
                    portWrapper.margin.right = changedObject.margin.right;
                }
                if (changedObject.margin.left !== undefined) {
                    portWrapper.margin.left = changedObject.margin.left;
                }
            }
            if (changedObject.horizontalAlignment !== undefined) {
                isMeasure = true;
                portWrapper.horizontalAlignment = changedObject.horizontalAlignment;
            }
            if (changedObject.verticalAlignment !== undefined) {
                isMeasure = true;
                portWrapper.verticalAlignment = changedObject.verticalAlignment;
            }
            if (changedObject.style !== undefined) {
                if (changedObject.style.fill !== undefined) {
                    portWrapper.style.fill = changedObject.style.fill;
                }
                if (changedObject.style.opacity !== undefined) {
                    portWrapper.style.opacity = changedObject.style.opacity;
                }
                if (changedObject.style.strokeColor !== undefined) {
                    portWrapper.style.strokeColor = changedObject.style.strokeColor;
                }
                if (changedObject.style.strokeWidth !== undefined) {
                    portWrapper.style.strokeWidth = changedObject.style.strokeWidth;
                }
                if (changedObject.style.strokeDashArray !== undefined) {
                    portWrapper.style.strokeDashArray = changedObject.style.strokeDashArray;
                }
            }
            if (changedObject.shape !== undefined) {
                if (portWrapper) {
                    var pathdata = getPortShape(changedObject.shape);
                    portWrapper.data = pathdata;
                    portWrapper.canMeasurePath = true;
                }
            }
            if (changedObject.pathData !== undefined) {
                portWrapper.data = String(changedObject.pathData);
                isMeasure = true;
            }
            if (isMeasure === true) {
                portWrapper.measure(new Size(portWrapper.width, portWrapper.height));
                portWrapper.arrange(portWrapper.desiredSize);
            }
            //this.refresh(); this.refreshDiagramLayer();
        }
    };
    /** @private */
    Diagram.prototype.updateIcon = function (actualObject) {
        var iconContainer = this.getWrapper(actualObject.wrapper, 'icon_content');
        var diagramId = (this.diagramActions & DiagramAction.Render) ? this.element.id : undefined;
        if (iconContainer) {
            if (this.mode === 'SVG') {
                var icon = getDiagramElement(actualObject.wrapper.id + '_icon_content', diagramId);
                if (icon) {
                    var iconRect = getDiagramElement(icon.id + '_rect', diagramId);
                    var iconShape = getDiagramElement(icon.id + '_shape', diagramId);
                    var nativeContent = getDiagramElement(iconShape.id + '_native_element', diagramId);
                    if (nativeContent) {
                        nativeContent.parentNode.removeChild(nativeContent);
                    }
                    iconShape.parentNode.removeChild(iconShape);
                    iconRect.parentNode.removeChild(iconRect);
                    icon.parentNode.removeChild(icon);
                }
            }
            var index = actualObject.wrapper.children.indexOf(iconContainer);
            actualObject.wrapper.children.splice(index, 1);
        }
        var portContainer = this.getPortContainer(actualObject);
        actualObject.initIcons(this.getDescription, this.layout, portContainer, this.element.id);
    };
    Diagram.prototype.getPortContainer = function (actualObject) {
        if (actualObject.children) {
            for (var i = 0; i < actualObject.wrapper.children.length; i++) {
                if (actualObject.wrapper.children[i].id === actualObject.id + 'group_container') {
                    return actualObject.wrapper.children[i];
                }
            }
        }
        return actualObject.wrapper;
    };
    Diagram.prototype.updateTooltip = function (actualObject, node) {
        if (node.tooltip.content !== undefined) {
            actualObject.tooltip.content = node.tooltip.content;
        }
        if (node.tooltip.position !== undefined) {
            actualObject.tooltip.position = node.tooltip.position;
        }
        if (node.tooltip.height !== undefined) {
            actualObject.tooltip.height = node.tooltip.height;
        }
        if (node.tooltip.width !== undefined) {
            actualObject.tooltip.width = node.tooltip.width;
        }
        if (node.tooltip.showTipPointer !== undefined) {
            actualObject.tooltip.showTipPointer = node.tooltip.showTipPointer;
        }
        if (node.tooltip.relativeMode !== undefined) {
            actualObject.tooltip.relativeMode = node.tooltip.relativeMode;
        }
    };
    /** @private */
    Diagram.prototype.updateQuad = function (obj) {
        var modified = this.spatialSearch.updateQuad(obj.wrapper);
        if (modified && !this.preventDiagramUpdate) {
            this.updatePage();
        }
    };
    /** @private */
    Diagram.prototype.removeFromAQuad = function (obj) {
        if (obj.children) {
            var child = void 0;
            var children = obj.children;
            for (var i = 0; i < children.length; i++) {
                child = this.nameTable[children[i]];
                if (child) {
                    this.removeFromAQuad(child);
                }
            }
        }
        this.spatialSearch.removeFromAQuad(obj.wrapper);
        var modified = this.spatialSearch.updateBounds(obj.wrapper);
        if (modified && !this.preventDiagramUpdate) {
            this.updatePage();
        }
    };
    /** @private */
    Diagram.prototype.updateGroupSize = function (node) {
        var tempNode;
        if (node.parentId) {
            tempNode = this.nameTable[node.parentId];
            if (tempNode) {
                if (tempNode.parentId) {
                    this.updateGroupSize(tempNode);
                }
                else {
                    tempNode.wrapper.measure(new Size());
                    tempNode.wrapper.arrange(tempNode.wrapper.desiredSize);
                    this.updateGroupOffset(tempNode);
                    this.updateDiagramObject(tempNode);
                }
            }
        }
    };
    Diagram.prototype.updatePage = function () {
        if ((this.diagramActions & DiagramAction.Render) &&
            !(this.diagramActions & DiagramAction.DragUsingMouse)) {
            this.scroller.updateScrollOffsets();
            this.scroller.setSize();
            //updating overview
            for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
                var temp = _a[_i];
                var view = this.views[temp];
                if (!(view instanceof Diagram)) {
                    view.updateView(view);
                }
            }
        }
        if (this.diagramActions & DiagramAction.DragUsingMouse) {
            this.renderPageBreaks();
        }
    };
    /** @private */
    Diagram.prototype.protectPropertyChange = function (enable) {
        this.isProtectedOnChange = enable;
    };
    /** @private */
    Diagram.prototype.getProtectPropertyChangeValue = function () {
        return this.isProtectedOnChange;
    };
    /** @private */
    Diagram.prototype.enableServerDataBinding = function (enable) {
        if (isBlazor()) {
            this.allowServerDataBinding = enable;
            if (enable) {
                this.bulkChanges = {};
            }
        }
    };
    /** @private */
    Diagram.prototype.updateShadow = function (nodeShadow, changedShadow) {
        if (changedShadow.angle !== undefined) {
            nodeShadow.angle = changedShadow.angle;
        }
        if (changedShadow.color !== undefined) {
            nodeShadow.color = changedShadow.color;
        }
        if (changedShadow.distance !== undefined) {
            nodeShadow.distance = changedShadow.distance;
        }
        if (changedShadow.opacity !== undefined) {
            nodeShadow.opacity = changedShadow.opacity;
        }
    };
    /** @private */
    Diagram.prototype.updateMargin = function (node, changes) {
        if (changes.margin.top !== undefined) {
            node.margin.top = changes.margin.top;
        }
        if (changes.margin.bottom !== undefined) {
            node.margin.bottom = changes.margin.bottom;
        }
        if (changes.margin.left !== undefined) {
            node.margin.left = changes.margin.left;
        }
        if (changes.margin.right !== undefined) {
            node.margin.right = changes.margin.right;
        }
    };
    //property changes - end region
    /* tslint:disable */
    Diagram.prototype.initDroppables = function () {
        var _this = this;
        // initiates droppable event
        var childTable = {};
        var entryTable = {};
        var header;
        var lane;
        this.droppable = new Droppable(this.element);
        // this.droppable.accept = '.e-dragclone';
        // tslint:disable-next-line:no-any
        this.droppable.over = function (args) {
            if (!_this.currentSymbol) {
                var dragDataHelper = null;
                if (!args.dragData && args.name === 'drag') {
                    var helper = document.getElementsByClassName('e-dragclone')[0];
                    if (helper) {
                        dragDataHelper = helper;
                    }
                }
                if (args.dragData || dragDataHelper) {
                    var newObj = void 0;
                    var isHorizontal = void 0;
                    document.getElementById(_this.element.id + 'content').focus();
                    var position = _this.eventHandler.getMousePosition(args.event);
                    var clonedObject = void 0;
                    var selectedSymbol = dragDataHelper || args.dragData.helper;
                    var paletteId = selectedSymbol.getAttribute('paletteId');
                    var nodeDragSize = void 0;
                    var nodePreviewSize = void 0;
                    var paletteDragSize = void 0;
                    var preview = void 0;
                    if (paletteId) {
                        // tslint:disable-next-line:no-any
                        var sourceElement = document.getElementById(paletteId).ej2_instances[0];
                        var source = 'sourceElement';
                        _this.droppable[source] = sourceElement;
                        var selectedSymbols = 'selectedSymbols';
                        var childtable = 'childTable';
                        if (sourceElement) {
                            var obj = sourceElement[selectedSymbols];
                            _this.allowServerDataBinding = false;
                            clonedObject = cloneObject(sourceElement[selectedSymbols]);
                            childTable = sourceElement[childtable];
                            var wrapper = obj.wrapper.children[0].children[0];
                            preview = getPreviewSize(sourceElement, clonedObject, wrapper);
                            if (sourceElement[selectedSymbols] instanceof Node) {
                                if (obj.shape.shape === 'TextAnnotation') {
                                    clonedObject.offsetX = position.x + 11 + (preview.width) * clonedObject.pivot.x;
                                    clonedObject.offsetY = position.y + 11 + (preview.height) * clonedObject.pivot.y;
                                }
                                else {
                                    clonedObject.offsetX = position.x + 5 + (preview.width) * clonedObject.pivot.x;
                                    clonedObject.offsetY = position.y + (preview.height) * clonedObject.pivot.y;
                                }
                                var newNode = new Node(_this, 'nodes', clonedObject, true);
                                if (newNode.shape.type === 'Bpmn' && newNode.shape.activity.subProcess.processes
                                    && newNode.shape.activity.subProcess.processes.length) {
                                    newNode.shape.activity.subProcess.processes = [];
                                }
                                nodeDragSize = newNode.dragSize;
                                nodePreviewSize = newNode.previewSize;
                                paletteDragSize = sourceElement['symbolDragSize'];
                                var palettePreview = sourceElement['symbolPreview'];
                                newNode.width = nodeDragSize.width || paletteDragSize.width || nodePreviewSize.width || palettePreview.width || newNode.width;
                                newNode.height = nodeDragSize.height || paletteDragSize.height || nodePreviewSize.height || palettePreview.height || newNode.height;
                                if (newNode.shape.type === 'SwimLane') {
                                    _this.diagramActions |= DiagramAction.PreventHistory;
                                    if (newNode.shape.isLane) {
                                        newNode.children = [];
                                        header = {
                                            id: 'header' + randomId(),
                                        };
                                        if (newNode.shape.orientation === 'Horizontal') {
                                            header.width = newNode.shape.lanes[0].header.width;
                                            header.height = newNode.shape.lanes[0].height;
                                        }
                                        else {
                                            header.width = newNode.shape.lanes[0].width;
                                            header.height = newNode.shape.lanes[0].header.height;
                                        }
                                        header.style = newNode.shape.lanes[0].header.style;
                                        header.offsetX = position.x + 5 + header.width / 2;
                                        header.offsetY = position.y + header.height / 2;
                                        _this.diagramActions |= DiagramAction.PreventCollectionChangeOnDragOver;
                                        header = _this.add(header);
                                        lane = {
                                            id: 'body' + randomId(),
                                        };
                                        if (newNode.shape.orientation === 'Horizontal') {
                                            lane.width = newNode.shape.lanes[0].width - header.width;
                                            lane.height = newNode.shape.lanes[0].height;
                                            lane.offsetX = position.x + 5 + (newNode.shape.lanes[0].header.width + (lane.width / 2));
                                            lane.offsetY = position.y + lane.height / 2;
                                        }
                                        else {
                                            lane.width = newNode.shape.lanes[0].width;
                                            lane.height = newNode.shape.lanes[0].height - header.height;
                                            lane.offsetX = position.x + 5 + lane.width / 2;
                                            lane.offsetY = position.y + (newNode.shape.lanes[0].header.height + (lane.height / 2));
                                        }
                                        lane.style = newNode.shape.lanes[0].style;
                                        lane = _this.add(lane);
                                        var group = {
                                            id: 'group' + randomId(),
                                            children: [header.id, lane.id],
                                        };
                                        group.shape = newNode.shape;
                                        group.width = newNode.shape.lanes[0].width;
                                        group.height = newNode.shape.lanes[0].height;
                                        group.previewSize = newNode.previewSize;
                                        group.dragSize = newNode.dragSize;
                                        group.addInfo = newNode.addInfo;
                                        newNode = _this.add(group);
                                        _this.diagramActions &= ~DiagramAction.PreventCollectionChangeOnDragOver;
                                    }
                                    _this.diagramActions &= ~DiagramAction.PreventHistory;
                                }
                                if (newNode.shape.isPhase) {
                                    isHorizontal = (newNode.shape.orientation === 'Horizontal') ? true : false;
                                    if (isHorizontal) {
                                        newNode.offsetX = position.x + 5 + (newNode.width || wrapper.actualSize.width) / 2;
                                        newNode.offsetY = position.y;
                                        newNode.shape.data =
                                            'M' + 20 + ',' + (newNode.height / 2) + ' L' + (newNode.width - 20) + ',' +
                                                (newNode.height / 2) + 'z';
                                        newNode.height = 1;
                                    }
                                    else {
                                        newNode.offsetX = position.x + 5;
                                        newNode.offsetY = position.y + (newNode.height || wrapper.actualSize.height) / 2;
                                        newNode.shape.data =
                                            'M' + (newNode.width / 2) + ',' + 20 + ' L' + (newNode.width / 2) +
                                                ',' + (newNode.height - 20) + 'z';
                                        newNode.width = 1;
                                    }
                                }
                                newObj = newNode;
                                if (clonedObject.children) {
                                    var parentNode = clonedObject;
                                    var tempTable = {};
                                    entryTable = _this.getChildren(parentNode, tempTable, childTable);
                                    arrangeChild(parentNode, -parentNode.offsetX, -parentNode.offsetY, entryTable, true, _this);
                                }
                            }
                            else if (sourceElement[selectedSymbols] instanceof Connector) {
                                newObj = new Connector(_this, 'connectors', clonedObject, true);
                                var bounds = Rect.toBounds([newObj.sourcePoint, newObj.targetPoint]);
                                var tx = position.x - bounds.left;
                                var ty = position.y - bounds.top;
                                newObj.sourcePoint.x += tx;
                                newObj.sourcePoint.y += ty;
                                newObj.targetPoint.x += tx;
                                newObj.targetPoint.y += ty;
                            }
                            if (!newObj.shape.isLane) {
                                newObj.id += randomId();
                            }
                            var arg = {
                                source: sourceElement, element: newObj, cancel: false,
                                diagram: _this
                            };
                            if (isBlazor()) {
                                arg = _this.getBlazorDragEventArgs(arg);
                            }
                            _this['enterObject'] = newObj;
                            _this['enterTable'] = entryTable;
                            _this.triggerEvent(DiagramEvent.dragEnter, arg);
                            if ((newObj instanceof Node) && newObj.shape.type === 'SwimLane' && newObj.shape.isLane) {
                                var swimLaneObj = arg.element;
                                var laneObj = swimLaneObj.shape.lanes[0];
                                var child1 = void 0;
                                var child2 = void 0;
                                isHorizontal = (swimLaneObj.shape.orientation === 'Horizontal') ? true : false;
                                child1 = _this.nameTable[newObj.children[0]];
                                child2 = _this.nameTable[newObj.children[1]];
                                nodeDragSize = newObj.dragSize;
                                nodePreviewSize = newObj.previewSize;
                                paletteDragSize = sourceElement['symbolDragSize'];
                                laneObj.width = nodeDragSize.width || paletteDragSize.width || nodePreviewSize.width || laneObj.width;
                                laneObj.height = nodeDragSize.height || paletteDragSize.height || nodePreviewSize.height || laneObj.height;
                                if (isHorizontal) {
                                    header.width = laneObj.header.width;
                                    header.height = laneObj.height;
                                    lane.width = laneObj.width - header.width;
                                    lane.height = laneObj.height;
                                    lane.offsetX = position.x + 5 + (laneObj.header.width + (child2.width / 2));
                                    lane.offsetY = position.y + child2.height / 2;
                                }
                                else {
                                    header.width = laneObj.width;
                                    header.height = laneObj.header.height;
                                    lane.width = laneObj.width;
                                    lane.height = laneObj.height - header.height;
                                    lane.offsetX = position.x + 5 + child2.width / 2;
                                    lane.offsetY = position.y + (laneObj.header.height + (child2.height / 2));
                                }
                                header.offsetX = position.x + 5 + child1.width / 2;
                                header.offsetY = position.y + child1.height / 2;
                                newObj.width = laneObj.width;
                                newObj.height = laneObj.height;
                            }
                            if ((newObj instanceof Node) && newObj.shape.isPhase) {
                                if (isHorizontal) {
                                    newObj.height = 1;
                                }
                                else {
                                    newObj.width = 1;
                                }
                            }
                            if (!_this.activeLayer.lock && !arg.cancel) {
                                _this.preventDiagramUpdate = true;
                                if (newObj.children) {
                                    _this.findChild(newObj, entryTable);
                                }
                                _this.preventDiagramUpdate = true;
                                if (newObj.zIndex !== -1) {
                                    newObj.zIndex = -1;
                                }
                                _this.initObject(newObj, undefined, undefined, true);
                                _this.currentSymbol = newObj;
                                if (_this.mode !== 'SVG') {
                                    _this.refreshDiagramLayer();
                                }
                                _this.commandHandler.oldSelectedObjects = cloneSelectedObjects(_this);
                                _this.commandHandler.select(newObj);
                                _this.commandHandler.updateBlazorSelector();
                                _this.eventHandler.mouseDown(args.event);
                                _this.eventHandler.mouseMove(args.event, args);
                                _this.preventDiagramUpdate = false;
                                _this.updatePage();
                                selectedSymbol.style.opacity = '0';
                            }
                            delete _this['enterObject'];
                            delete _this['enterTable'];
                        }
                        _this.droppable[selectedSymbols] = selectedSymbol;
                        _this.allowServerDataBinding = true;
                    }
                }
            }
            else {
                if (args.event.touches && args.event.touches.length) {
                    _this.eventHandler.mouseMove(args.event, args.event.touches);
                }
            }
        };
        // tslint:disable-next-line:no-any
        this.droppable.drop = function (args) { return __awaiter(_this, void 0, void 0, function () {
            var source, value, isPhase, orientation_2, isConnector, newObj, node, conn, arg, clonedObject, id, nodeId, arg, clonedObject, id, selectedSymbols;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.allowServerDataBinding = false;
                        source = 'sourceElement';
                        if (!this.currentSymbol) return [3 /*break*/, 4];
                        isPhase = false;
                        isConnector = void 0;
                        isConnector = (this.currentSymbol instanceof Connector) ? true : false;
                        if (args.event.touches) {
                            this.eventHandler.mouseUp(args.event);
                        }
                        newObj = void 0;
                        node = void 0;
                        conn = void 0;
                        arg = void 0;
                        arg = {
                            source: this.droppable[source],
                            element: this.currentSymbol,
                            target: this.eventHandler['hoverNode'] || this.eventHandler['lastObjectUnderMouse'] || this, cancel: false,
                            position: { x: this.currentSymbol.wrapper.offsetX, y: this.currentSymbol.wrapper.offsetY }
                        };
                        if (!isBlazor()) return [3 /*break*/, 2];
                        arg = {
                            source: cloneBlazorObject(this.droppable[source]),
                            element: getObjectType(this.currentSymbol) === Connector ? { connector: cloneBlazorObject(this.currentSymbol) } : { node: cloneBlazorObject(this.currentSymbol) },
                            cancel: false, target: {},
                            position: { x: this.currentSymbol.wrapper.offsetX, y: this.currentSymbol.wrapper.offsetY }
                        };
                        this.getDropEventArgs(arg);
                        return [4 /*yield*/, this.triggerEvent(DiagramEvent.drop, arg)];
                    case 1:
                        arg = (_a.sent()) || arg;
                        return [3 /*break*/, 3];
                    case 2:
                        this.triggerEvent(DiagramEvent.drop, arg);
                        _a.label = 3;
                    case 3:
                        clonedObject = void 0;
                        id = 'id';
                        clonedObject = cloneObject(this.currentSymbol);
                        clonedObject['hasTarget'] = this.currentSymbol['hasTarget'];
                        this.removeFromAQuad(this.currentSymbol);
                        this.removeObjectsFromLayer(this.nameTable[this.currentSymbol.id]);
                        this.removeElements(this.currentSymbol);
                        if (this.currentSymbol.shape.isLane ||
                            this.currentSymbol.shape.isPhase) {
                            this.removeChildInNodes(this.currentSymbol);
                        }
                        if (arg.cancel) {
                            removeChildNodes(this.currentSymbol, this);
                        }
                        if (this.currentSymbol.shape.isPhase) {
                            isPhase = true;
                            orientation_2 = this.currentSymbol.shape.orientation;
                        }
                        delete this.nameTable[this.currentSymbol.id];
                        this.currentSymbol = null;
                        this.protectPropertyChange(true);
                        if (!arg.cancel) {
                            this.startGroupAction();
                            if (clonedObject && (clonedObject.shape.isLane || isPhase)) {
                                if (isPhase) {
                                    clonedObject.shape.isPhase = isPhase;
                                    clonedObject.shape.orientation = orientation_2;
                                }
                                this.eventHandler.addSwimLaneObject(clonedObject);
                            }
                            if (clonedObject.shape.type === 'Bpmn' && clonedObject.shape.annotation
                                && clonedObject['hasTarget']) {
                                nodeId = clonedObject.shape.annotation.nodeId;
                                clonedObject.shape.annotation.id = clonedObject.id;
                                this.addTextAnnotation(clonedObject.shape.annotation, this.nameTable[nodeId]);
                                clonedObject.nodeId = '';
                            }
                            if (!clonedObject.shape.isLane && !isPhase) {
                                if (clonedObject.children) {
                                    this.addChildNodes(clonedObject);
                                }
                                if (arg.target && (arg.target instanceof Node) && !isConnector && checkParentAsContainer(this, arg.target)
                                    && canAllowDrop(arg.target)) {
                                    addChildToContainer(this, arg.target, clonedObject);
                                }
                                else {
                                    value = this.add(clonedObject, true);
                                }
                                if ((clonedObject || value) && canSingleSelect(this)) {
                                    this.select([this.nameTable[clonedObject[id]]]);
                                }
                            }
                        }
                        else {
                            this.clearSelectorLayer();
                        }
                        this.protectPropertyChange(false);
                        newObj = this.nameTable[clonedObject[id]];
                        if (clonedObject['hasTarget']) {
                            clonedObject.nodeId = clonedObject['hasTarget'];
                            this.remove(clonedObject);
                        }
                        if (this.bpmnModule && newObj instanceof Node && clonedObject.processId) {
                            newObj.processId = clonedObject.processId;
                            this.bpmnModule.dropBPMNchild(this.nameTable[newObj.processId], newObj, this);
                        }
                        this.endGroupAction();
                        if (this.mode !== 'SVG') {
                            this.refreshDiagramLayer();
                        }
                        delete this.droppable[source];
                        return [3 /*break*/, 5];
                    case 4:
                        arg = {
                            source: cloneBlazorObject(args.droppedElement),
                            element: undefined,
                            target: cloneBlazorObject(this.eventHandler['hoverNode'] || (this.eventHandler['lastObjectUnderMouse']) || this), cancel: false,
                            position: undefined
                        };
                        if (isBlazor()) {
                            arg = {
                                source: cloneBlazorObject(args.droppedElement),
                                element: undefined,
                                cancel: false,
                                position: undefined,
                                target: {}
                            };
                            this.getDropEventArgs(arg);
                        }
                        this.triggerEvent(DiagramEvent.drop, arg);
                        clonedObject = void 0;
                        id = 'id';
                        _a.label = 5;
                    case 5:
                        selectedSymbols = 'selectedSymbols';
                        if (this.droppable[selectedSymbols]) {
                            remove(this.droppable[selectedSymbols]);
                        }
                        this.allowServerDataBinding = true;
                        return [2 /*return*/];
                }
            });
        }); };
        this.droppable.out = function (args) {
            if (_this.currentSymbol && !_this.eventHandler.focus) {
                _this.unSelect(_this.currentSymbol);
                _this.removeFromAQuad(_this.currentSymbol);
                if (_this.mode !== 'SVG' && _this.currentSymbol.shape.type === 'Native') {
                    _this.removeElements(_this.currentSymbol);
                }
                _this.removeObjectsFromLayer(_this.nameTable[_this.currentSymbol.id]);
                delete _this.nameTable[_this.currentSymbol.id];
                var args_1 = {
                    element: cloneBlazorObject(_this.currentSymbol),
                    diagram: _this
                };
                if (isBlazor()) {
                    args_1 = _this.getBlazorDragLeaveEventArgs(args_1);
                }
                _this.triggerEvent(DiagramEvent.dragLeave, args_1);
                if (_this.mode !== 'SVG') {
                    _this.refreshDiagramLayer();
                }
                else {
                    _this.removeElements(_this.currentSymbol);
                }
                _this.currentSymbol = null;
                var selectedSymbols = 'selectedSymbols';
                _this.droppable[selectedSymbols].style.opacity = '1';
                var source = 'sourceElement';
                delete _this.droppable[source];
                _this.diagramRenderer.rendererActions =
                    _this.removeConstraints(_this.diagramRenderer.rendererActions, RendererAction.DrawSelectorBorder);
                if (_this.previousSelectedObject) {
                    _this.select(_this.previousSelectedObject, _this.previousSelectedObject.length > 1 ? true : false);
                }
                _this.previousSelectedObject = null;
            }
        };
    };
    Diagram.prototype.getBlazorDragLeaveEventArgs = function (args) {
        args = {
            diagramId: this.element.id,
            element: getObjectType(args.element) === Connector ? { connector: cloneBlazorObject(args.element) }
                : { node: cloneBlazorObject(args.element) }
        };
        return args;
    };
    Diagram.prototype.getDropEventArgs = function (arg) {
        if ((this.eventHandler['lastObjectUnderMouse'] || this.eventHandler['hoverNode'])) {
            var object = this.eventHandler['lastObjectUnderMouse'] || this.eventHandler['hoverNode'];
            arg.target = getObjectType(object) === Connector ? { connector: cloneBlazorObject(object) } : { node: cloneBlazorObject(object) };
        }
        else {
            arg.target.diagramId = this.element.id;
        }
    };
    Diagram.prototype.removeChildInNodes = function (node) {
        if (node) {
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    this.removeChildInNodes(this.nameTable[node.children[i]]);
                }
            }
            var index = this.nodes.indexOf(node);
            if (index !== -1) {
                this.nodes.splice(index, 1);
            }
        }
    };
    Diagram.prototype.getBlazorDragEventArgs = function (args) {
        args = {
            source: cloneBlazorObject(args.source), element: getObjectType(args.element) === Connector ? { connector: cloneBlazorObject(args.element) }
                : { node: cloneBlazorObject(args.element) },
            cancel: args.cancel, diagramId: this.element.id
        };
        return args;
    };
    Diagram.prototype.findChild = function (node, childTable) {
        var group;
        var newNode;
        for (var i = 0; i < node.children.length; i++) {
            group = childTable[node.children[i]];
            if (group) {
                if (group.children) {
                    this.findChild(group, childTable);
                }
                group.id = group.id + randomId();
                childTable[group.id] = group;
                node.children[i] = group.id;
                newNode = new Node(this, 'nodes', group, true);
                this.initObject(newNode, undefined, undefined, true);
                //this.add(group, true);
            }
        }
    };
    Diagram.prototype.getChildren = function (node, entryTable, childTable) {
        var temp;
        for (var i = 0; i < node.children.length; i++) {
            temp = (childTable[node.children[i]]);
            if (temp) {
                if (temp.children) {
                    entryTable = this.getChildren(temp, entryTable, childTable);
                }
                entryTable[temp.id] = cloneObject(temp);
            }
        }
        return entryTable;
    };
    Diagram.prototype.addChildNodes = function (node) {
        var temp;
        for (var i = 0; i < node.children.length; i++) {
            temp = (this.nameTable[node.children[i]]);
            if (temp) {
                if (temp.children) {
                    this.addChildNodes(temp);
                }
                this.add(temp, true);
            }
        }
    };
    Diagram.prototype.moveNode = function (node) {
        var currentLayer = this.commandHandler.getObjectLayer(node.id);
        var index = currentLayer.zIndex;
        var length = currentLayer.objects.length;
        var targetLayer;
        for (var i = 0; i < this.layers.length; i++) {
            if (index === this.layers[i].zIndex) {
                targetLayer = this.layers[i + 1];
            }
        }
        if (length > 1) {
            this.commandHandler.moveSvgNode(node.id, currentLayer.objects[length - 2]);
            this.commandHandler.moveSvgNode(currentLayer.objects[length - 2], node.id);
        }
        else {
            if (targetLayer) {
                var targetObject = this.commandHandler.getLayer(this.layerZIndexTable[targetLayer.zIndex]).objects[0];
                if (targetObject) {
                    this.commandHandler.moveSvgNode(node.id, targetObject);
                    this.commandHandler.updateNativeNodeIndex(node.id, targetObject);
                }
                else {
                    this.moveObjectsUp(node, currentLayer);
                }
            }
            else {
                this.moveObjectsUp(node, currentLayer);
            }
        }
    };
    /**
     * moves the node or connector forward within given layer
     */
    Diagram.prototype.moveObjectsUp = function (node, currentLayer) {
        var targetLayer;
        for (var i = this.layers.length - 1; i >= 0; i--) {
            targetLayer = this.layers[i];
            if (currentLayer.id !== targetLayer.id) {
                var targetObject = this.commandHandler.getLayer(this.layerZIndexTable[targetLayer.zIndex]).objects[targetLayer.objects.length - 1];
                if (targetObject) {
                    this.commandHandler.moveSvgNode(node.id, targetObject);
                    this.commandHandler.moveSvgNode(targetObject, node.id);
                    break;
                }
            }
        }
    };
    /**
     * Inserts newly added element into the database
     */
    Diagram.prototype.insertData = function (node) {
        return this.crudOperation(node, 'create', this.getNewUpdateNodes('New'));
    };
    /**
     * updates the user defined element properties into the existing database
     */
    Diagram.prototype.updateData = function (node) {
        return this.crudOperation(node, 'update', this.getNewUpdateNodes('Update'));
    };
    /**
     * Removes the user deleted element from the existing database
     */
    Diagram.prototype.removeData = function (node) {
        return this.crudOperation(node, 'destroy', this.getDeletedNodes());
    };
    Diagram.prototype.crudOperation = function (node, crud, getNodesCollection) {
        if (node) {
            var data = this.parameterMap(node, node instanceof Connector ? false : true);
            if (data) {
                var url = node instanceof Connector ? this.dataSourceSettings.connectionDataSource.crudAction[crud] : this.dataSourceSettings.crudAction[crud];
                this.raiseAjaxPost(JSON.stringify(data), url);
            }
            return data;
        }
        else {
            var newObjects = getNodesCollection;
            this.processCrudCollection(newObjects, this.dataSourceSettings.crudAction[crud], this.dataSourceSettings.connectionDataSource.crudAction[crud]);
            return newObjects;
        }
    };
    Diagram.prototype.processCrudCollection = function (newObjects, nodeCrudAction, connectorCrudAction) {
        if (newObjects.nodes) {
            var data = [];
            var i = void 0;
            for (i = 0; i < newObjects.nodes.length; i++) {
                data.push(this.parameterMap(newObjects.nodes[i], true));
            }
            if (data && data.length > 0)
                this.raiseAjaxPost(JSON.stringify(data), nodeCrudAction);
        }
        if (newObjects.connectors) {
            var data = [];
            var i = void 0;
            for (i = 0; i < newObjects.connectors.length; i++) {
                data.push(this.parameterMap(newObjects.connectors[i], false));
            }
            if (data && data.length > 0)
                this.raiseAjaxPost(JSON.stringify(data), connectorCrudAction);
        }
    };
    Diagram.prototype.parameterMap = function (object, isNode) {
        var mappingObj = {};
        var i;
        var fields = isNode ? this.dataSourceSettings : this.dataSourceSettings.connectionDataSource;
        if (fields.id)
            mappingObj[fields.id] = object.id;
        if (fields.sourcePointX && fields.sourcePointY) {
            mappingObj[fields.sourcePointX] = object.sourcePoint.x;
            mappingObj[fields.sourcePointY] = object.sourcePoint.y;
        }
        if (fields.targetPointX && fields.targetPointY) {
            mappingObj[fields.targetPointX] = object.targetPoint.x;
            mappingObj[fields.targetPointY] = object.targetPoint.y;
        }
        if (fields.sourceID)
            mappingObj[fields.sourceID] = object.sourceID;
        if (fields.targetID)
            mappingObj[fields.targetID] = object.targetID;
        if (fields.crudAction && fields.crudAction.customFields && fields.crudAction.customFields.length > 0) {
            for (i = 0; i < fields.crudAction.customFields.length; i++)
                mappingObj[fields.crudAction.customFields[i]] = object[fields.crudAction.customFields[i]];
        }
        return mappingObj;
    };
    Diagram.prototype.getNewUpdateNodes = function (status) {
        var nodes = [];
        var connectors = [];
        for (var name_1 in this.nameTable) {
            var node = this.nameTable[name_1];
            if (node.status == status) {
                if (node && node instanceof Connector) {
                    node.status = 'None';
                    connectors.push(node);
                }
                else {
                    node.status = 'None';
                    nodes.push(node);
                }
            }
        }
        return { nodes: nodes, connectors: connectors };
    };
    Diagram.prototype.getDeletedNodes = function () {
        var nodes = [];
        var connectors = [];
        var i;
        for (i = 0; i < this.crudDeleteNodes.length; i++) {
            var node = this.crudDeleteNodes[i];
            if (node && node.segments)
                connectors.push(node);
            else if (node) {
                nodes.push(node);
            }
        }
        this.crudDeleteNodes = [];
        return { nodes: nodes, connectors: connectors };
    };
    Diagram.prototype.raiseAjaxPost = function (value, url) {
        var callback = new Ajax(url, 'POST', true, 'application/json');
        var data = JSON.stringify(JSON.parse(value));
        callback.send(data).then();
        callback.onSuccess = function (data) {
        };
    };
    Diagram.prototype.getHiddenItems = function (args) {
        var hiddenItems = [];
        if (this.contextMenuModule) {
            this.contextMenuModule.hiddenItems = [];
            for (var _i = 0, _a = args.items; _i < _a.length; _i++) {
                var item = _a[_i];
                this.contextMenuModule.ensureItems(item, args.event);
                if (item.items && item.items.length) {
                    for (var _b = 0, _c = item.items; _b < _c.length; _b++) {
                        var newItem = _c[_b];
                        this.contextMenuModule.ensureItems(newItem, args.event);
                    }
                }
            }
            return this.contextMenuModule.hiddenItems;
        }
        return hiddenItems;
    };
    __decorate([
        Property('100%')
    ], Diagram.prototype, "width", void 0);
    __decorate([
        Property('SVG')
    ], Diagram.prototype, "mode", void 0);
    __decorate([
        Property('100%')
    ], Diagram.prototype, "height", void 0);
    __decorate([
        Complex({}, ContextMenuSettings)
    ], Diagram.prototype, "contextMenuSettings", void 0);
    __decorate([
        Property(DiagramConstraints.Default)
    ], Diagram.prototype, "constraints", void 0);
    __decorate([
        Property(DiagramTools.Default)
    ], Diagram.prototype, "tool", void 0);
    __decorate([
        Property('Top')
    ], Diagram.prototype, "bridgeDirection", void 0);
    __decorate([
        Property('transparent')
    ], Diagram.prototype, "backgroundColor", void 0);
    __decorate([
        Complex({}, SnapSettings)
    ], Diagram.prototype, "snapSettings", void 0);
    __decorate([
        Complex({}, RulerSettings)
    ], Diagram.prototype, "rulerSettings", void 0);
    __decorate([
        Complex({}, PageSettings)
    ], Diagram.prototype, "pageSettings", void 0);
    __decorate([
        Complex({}, SerializationSettings)
    ], Diagram.prototype, "serializationSettings", void 0);
    __decorate([
        Collection([], Node)
    ], Diagram.prototype, "nodes", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "drawingObject", void 0);
    __decorate([
        Collection([], Connector)
    ], Diagram.prototype, "connectors", void 0);
    __decorate([
        Property([])
    ], Diagram.prototype, "basicElements", void 0);
    __decorate([
        Complex({}, DiagramTooltip)
    ], Diagram.prototype, "tooltip", void 0);
    __decorate([
        Complex({}, DataSource)
    ], Diagram.prototype, "dataSourceSettings", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "addInfo", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "historyManager", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "nodeTemplate", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "annotationTemplate", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "userHandleTemplate", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "getNodeDefaults", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "nodeDefaults", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "getConnectorDefaults", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "connectorDefaults", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "setNodeTemplate", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "getDescription", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "getCustomProperty", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "getCustomTool", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "getCustomCursor", void 0);
    __decorate([
        Collection([], CustomCursorAction)
    ], Diagram.prototype, "customCursor", void 0);
    __decorate([
        Property()
    ], Diagram.prototype, "updateSelection", void 0);
    __decorate([
        Complex({}, DiagramSettings)
    ], Diagram.prototype, "diagramSettings", void 0);
    __decorate([
        Complex({}, Selector)
    ], Diagram.prototype, "selectedItems", void 0);
    __decorate([
        Complex({}, ScrollSettings)
    ], Diagram.prototype, "scrollSettings", void 0);
    __decorate([
        Complex({}, Layout)
    ], Diagram.prototype, "layout", void 0);
    __decorate([
        Complex({}, CommandManager)
    ], Diagram.prototype, "commandManager", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "dataLoaded", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "dragEnter", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "dragLeave", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "dragOver", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "click", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "historyChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "historyStateChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "doubleClick", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "textEdit", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "scrollChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "selectionChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "sizeChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "connectionChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "sourcePointChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "targetPointChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "propertyChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "positionChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "keyUp", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "keyDown", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "rotateChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "collectionChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "fixedUserHandleClick", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "onUserHandleMouseDown", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "onUserHandleMouseUp", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "onUserHandleMouseEnter", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "onUserHandleMouseLeave", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "segmentCollectionChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "onImageLoad", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "expandStateChange", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "created", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "mouseEnter", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "mouseLeave", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "mouseOver", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "contextMenuOpen", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "contextMenuBeforeItemRender", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "contextMenuClick", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "commandExecute", void 0);
    __decorate([
        Collection([], Layer)
    ], Diagram.prototype, "layers", void 0);
    __decorate([
        Event()
    ], Diagram.prototype, "drop", void 0);
    return Diagram;
}(Component));
export { Diagram };
