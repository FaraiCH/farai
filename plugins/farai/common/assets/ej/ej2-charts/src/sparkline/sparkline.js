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
import { Component, NotifyPropertyChanges, Property, Complex, isBlazor } from '@syncfusion/ej2-base';
import { remove, L10n, Internationalization, Event, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Browser, EventHandler, Touch, Collection } from '@syncfusion/ej2-base';
import { SparklineBorder, SparklineTooltipSettings, ContainerArea, AxisSettings, Padding, SparklineMarkerSettings } from './model/base';
import { SparklineDataLabelSettings, RangeBandSettings } from './model/base';
import { Size, createSvg, RectOption, Rect, drawRectangle, getIdElement, withInBounds, removeElement } from './utils/helper';
import { SparklineRenderer } from './rendering/sparkline-renderer';
import { getThemeColor } from './utils/helper';
//tslint:disable: no-duplicate-lines
/**
 * Represents the Sparkline control.
 * ```html
 * <div id="sparkline"/>
 * <script>
 *   var sparkline = new Sparkline();
 *   sparkline.appendTo("#sparkline");
 * </script>
 * ```
 */
var Sparkline = /** @class */ (function (_super) {
    __extends(Sparkline, _super);
    // Sparkline rendering starts from here.
    /**
     * Constructor for creating the Sparkline widget
     */
    function Sparkline(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.isDevice = Browser.isDevice;
        /** @private */
        _this.intervalDivs = [10, 5, 2, 1];
        return _this;
    }
    /**
     * Initializing pre-required values for sparkline.
     */
    Sparkline.prototype.preRender = function () {
        this.isBlazor = isBlazor();
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.trigger('load', { sparkline: !this.isBlazor ? this : null });
        this.sparkTheme = getThemeColor(this.theme);
        this.sparklineRenderer = new SparklineRenderer(this);
        this.createSVG();
        this.wireEvents();
        this.setCulture();
    };
    /**
     * Sparkline Elements rendering starting.
     */
    Sparkline.prototype.render = function () {
        // Sparkline rendering splitted into rendering and calculations
        this.sparklineRenderer.processDataManager();
        this.renderComplete();
        this.allowServerDataBinding = true;
    };
    /**
     * @private
     */
    Sparkline.prototype.processSparklineData = function () {
        this.sparklineRenderer.processData();
        this.renderSparkline();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
        this.trigger('loaded', { sparkline: !this.isBlazor ? this : null });
    };
    /**
     * To render sparkline elements
     */
    Sparkline.prototype.renderSparkline = function () {
        // To render the sparkline elements
        this.renderBorder();
        this.createDiv();
        this.sparklineRenderer.renderSeries();
    };
    /**
     * Create secondary element for the tooltip
     */
    Sparkline.prototype.createDiv = function () {
        var tooltipDiv = document.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        tooltipDiv.setAttribute('style', 'position: relative');
        this.element.appendChild(tooltipDiv);
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
    };
    /**
     * To set the left and top position for data label template for sparkline
     */
    Sparkline.prototype.setSecondaryElementPosition = function () {
        var element = getIdElement(this.element.id + '_Secondary_Element');
        if (!element) {
            return;
        }
        var rect = this.element.getBoundingClientRect();
        var svgRect = getIdElement(this.element.id + '_svg').getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    };
    /**
     * @private
     * Render the sparkline border
     */
    Sparkline.prototype.renderBorder = function () {
        var width = this.containerArea.border.width;
        var borderRect;
        if (width > 0 || this.containerArea.background !== 'transparent') {
            borderRect = new RectOption(this.element.id + '_SparklineBorder', this.sparkTheme.background, this.containerArea.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(drawRectangle(this, borderRect));
        }
        // Used to create clip path sparkline
        var padding = this.padding;
        if (this.markerSettings.visible.length) {
            padding.left = 0;
            padding.right = 0;
            padding.bottom = 0;
            padding.top = 0;
        }
        borderRect = new RectOption(this.element.id + '_sparkline_clip_rect', 'transparent', { color: 'transparent', width: 0 }, 1, new Rect(padding.left, padding.top, this.availableSize.width - (padding.left + padding.right), this.availableSize.height - (padding.top + padding.bottom)));
        var clipPath = this.renderer.createClipPath({ id: this.element.id + '_sparkline_clip_path' });
        drawRectangle(this, borderRect, clipPath);
        this.svgObject.appendChild(clipPath);
    };
    /**
     * To create svg element for sparkline
     */
    Sparkline.prototype.createSVG = function () {
        this.removeSvg();
        createSvg(this);
    };
    /**
     * To Remove the Sparkline SVG object
     */
    Sparkline.prototype.removeSvg = function () {
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (this.sparklineTooltipModule) {
            this.sparklineTooltipModule.removeTooltipElements();
        }
    };
    /**
     * Method to set culture for sparkline
     */
    Sparkline.prototype.setCulture = function () {
        this.intl = new Internationalization();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    };
    /**
     * To provide the array of modules needed for sparkline rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    Sparkline.prototype.requiredModules = function () {
        var modules = [];
        if (this.tooltipSettings.visible || this.tooltipSettings.trackLineSettings.visible) {
            modules.push({
                member: 'SparklineTooltip',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * Method to unbind events for sparkline chart
     */
    Sparkline.prototype.unWireEvents = function () {
        var move = Browser.touchMoveEvent;
        var cancel = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.sparklineMove);
        EventHandler.remove(this.element, cancel, this.sparklineMouseLeave);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.sparklineMouseEnd);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.sparklineResize);
    };
    /**
     * Method to bind events for the sparkline
     */
    Sparkline.prototype.wireEvents = function () {
        var cancel = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchMoveEvent, this.sparklineMove, this);
        EventHandler.add(this.element, 'click', this.sparklineClick, this);
        EventHandler.add(this.element, cancel, this.sparklineMouseLeave, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.sparklineMouseEnd, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.sparklineResize.bind(this));
        new Touch(this.element);
    };
    /**
     * Sparkline resize event.
     * @private
     */
    Sparkline.prototype.sparklineResize = function (e) {
        var _this = this;
        var args = {
            name: 'resize',
            previousSize: this.availableSize,
            sparkline: !this.isBlazor ? this : null,
            currentSize: new Size(0, 0)
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            if (_this.isDestroyed) {
                clearTimeout(_this.resizeTo);
                return;
            }
            _this.unWireEvents();
            _this.createSVG();
            _this.refreshing = true;
            _this.wireEvents();
            args.currentSize = _this.availableSize;
            _this.trigger('resize', args);
            _this.render();
        }, 500);
        return false;
    };
    /**
     * Handles the mouse move on sparkline.
     * @return {boolean}
     * @private
     */
    Sparkline.prototype.sparklineMove = function (e) {
        this.setSparklineMouseXY(e);
        this.notify(Browser.touchMoveEvent, e);
        var args = {
            name: 'sparklineMouseMove', cancel: false,
            sparkline: !this.isBlazor ? this : null, event: e
        };
        this.trigger(args.name, args);
        var pointClick = this.isPointRegion(e);
        if (pointClick.isPointRegion) {
            var pointArgs = {
                name: 'pointRegionMouseMove', cancel: false,
                event: e, sparkline: !this.isBlazor ? this : null,
                pointIndex: pointClick.pointIndex
            };
            this.trigger(pointArgs.name, pointArgs);
        }
        return false;
    };
    /**
     * Handles the mouse click on sparkline.
     * @return {boolean}
     * @private
     */
    Sparkline.prototype.sparklineClick = function (e) {
        this.setSparklineMouseXY(e);
        var args = {
            name: 'sparklineMouseClick', cancel: false,
            sparkline: !this.isBlazor ? this : null, event: e
        };
        this.trigger(args.name, args);
        var pointClick = this.isPointRegion(e);
        if (pointClick.isPointRegion) {
            var pointArgs = {
                name: 'pointRegionMouseClick', cancel: false,
                event: e, sparkline: !this.isBlazor ? this : null,
                pointIndex: pointClick.pointIndex
            };
            this.trigger(pointArgs.name, pointArgs);
        }
        return false;
    };
    /**
     * To check mouse event target is point region or not.
     */
    Sparkline.prototype.isPointRegion = function (e) {
        var _this = this;
        var startId = this.element.id + '_';
        var id = e.target.id.replace(startId, '').split('_');
        if (id[1] === this.type.toLowerCase()) {
            var index_1 = parseInt(id[2], 10);
            if ((isNullOrUndefined(index_1) || isNaN(index_1)) && (this.type === 'Line' || this.type === 'Area')) {
                this.sparklineRenderer.visiblePoints.forEach(function (point, i) {
                    if (withInBounds(_this.mouseX, _this.mouseY, new Rect(point.x - 5, point.y - 5, 10, 10))) {
                        index_1 = i;
                        return;
                    }
                });
            }
            return { isPointRegion: true, pointIndex: index_1 };
        }
        return { isPointRegion: false, pointIndex: null };
    };
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    Sparkline.prototype.sparklineMouseEnd = function (e) {
        this.setSparklineMouseXY(e);
        this.notify(Browser.touchEndEvent, e);
        return false;
    };
    /**
     * Handles the mouse leave on sparkline.
     * @return {boolean}
     * @private
     */
    Sparkline.prototype.sparklineMouseLeave = function (e) {
        this.setSparklineMouseXY(e);
        this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        return false;
    };
    /**
     * Method to set mouse x, y from events
     */
    Sparkline.prototype.setSparklineMouseXY = function (e) {
        var pageY;
        var pageX;
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            var touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageY = e.clientY;
            pageX = e.clientX;
        }
        var rect = this.element.getBoundingClientRect();
        var svgRect = getIdElement(this.element.id + '_svg').getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    };
    /**
     * To change rendering while property value modified.
     * @private
     */
    Sparkline.prototype.onPropertyChanged = function (newProp, oldProp) {
        var render = false;
        var refresh = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'xName':
                case 'yName':
                case 'axisSettings':
                case 'rangeBandSettings':
                case 'type':
                case 'valueType':
                case 'enableRtl':
                    refresh = true;
                    break;
                case 'dataSource':
                    if (this.isBlazor) {
                        this.sparklineRenderer.processDataManager();
                        this.createSVG();
                        break;
                    }
                    refresh = true;
                    break;
                case 'border':
                case 'markerSettings':
                case 'dataLabelSettings':
                case 'tooltipSettings':
                case 'startPointColor':
                case 'highPointColor':
                case 'lowPointColor':
                case 'endPointColor':
                case 'negativePointColor':
                case 'theme':
                    render = true;
                    break;
            }
        }
        if (refresh) {
            this.createSVG();
            this.sparklineRenderer.processData();
            this.refreshSparkline();
        }
        else if (render) {
            this.createSVG();
            this.refreshSparkline();
        }
    };
    /**
     * To render sparkline series and appending.
     */
    Sparkline.prototype.refreshSparkline = function () {
        // Issue fix. React had native render method. So OnProperty change used render method won't wrok. 
        this.renderSparkline();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
    };
    /**
     * Get component name
     */
    Sparkline.prototype.getModuleName = function () {
        return 'sparkline';
    };
    /**
     * Destroy the component
     */
    Sparkline.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Sparkline.prototype.getPersistData = function () {
        return '';
    };
    __decorate([
        Property(null)
    ], Sparkline.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], Sparkline.prototype, "height", void 0);
    __decorate([
        Complex({}, SparklineBorder)
    ], Sparkline.prototype, "border", void 0);
    __decorate([
        Property('Line')
    ], Sparkline.prototype, "type", void 0);
    __decorate([
        Property('None')
    ], Sparkline.prototype, "rangePadding", void 0);
    __decorate([
        Property(null)
    ], Sparkline.prototype, "dataSource", void 0);
    __decorate([
        Property(null)
    ], Sparkline.prototype, "query", void 0);
    __decorate([
        Property('Numeric')
    ], Sparkline.prototype, "valueType", void 0);
    __decorate([
        Property(null)
    ], Sparkline.prototype, "xName", void 0);
    __decorate([
        Property(null)
    ], Sparkline.prototype, "yName", void 0);
    __decorate([
        Property('#00bdae')
    ], Sparkline.prototype, "fill", void 0);
    __decorate([
        Property('')
    ], Sparkline.prototype, "highPointColor", void 0);
    __decorate([
        Property('')
    ], Sparkline.prototype, "lowPointColor", void 0);
    __decorate([
        Property('')
    ], Sparkline.prototype, "startPointColor", void 0);
    __decorate([
        Property('')
    ], Sparkline.prototype, "endPointColor", void 0);
    __decorate([
        Property('')
    ], Sparkline.prototype, "negativePointColor", void 0);
    __decorate([
        Property('')
    ], Sparkline.prototype, "tiePointColor", void 0);
    __decorate([
        Property([])
    ], Sparkline.prototype, "palette", void 0);
    __decorate([
        Property(1)
    ], Sparkline.prototype, "lineWidth", void 0);
    __decorate([
        Property(1)
    ], Sparkline.prototype, "opacity", void 0);
    __decorate([
        Property(null)
    ], Sparkline.prototype, "format", void 0);
    __decorate([
        Property(false)
    ], Sparkline.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Complex({}, SparklineTooltipSettings)
    ], Sparkline.prototype, "tooltipSettings", void 0);
    __decorate([
        Complex({}, ContainerArea)
    ], Sparkline.prototype, "containerArea", void 0);
    __decorate([
        Collection([], RangeBandSettings)
    ], Sparkline.prototype, "rangeBandSettings", void 0);
    __decorate([
        Complex({}, AxisSettings)
    ], Sparkline.prototype, "axisSettings", void 0);
    __decorate([
        Complex({}, SparklineMarkerSettings)
    ], Sparkline.prototype, "markerSettings", void 0);
    __decorate([
        Complex({}, SparklineDataLabelSettings)
    ], Sparkline.prototype, "dataLabelSettings", void 0);
    __decorate([
        Complex({}, Padding)
    ], Sparkline.prototype, "padding", void 0);
    __decorate([
        Property('Material')
    ], Sparkline.prototype, "theme", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "load", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "tooltipInitialize", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "seriesRendering", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "axisRendering", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "pointRendering", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "pointRegionMouseMove", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "pointRegionMouseClick", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "sparklineMouseMove", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "sparklineMouseClick", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "dataLabelRendering", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "markerRendering", void 0);
    __decorate([
        Event()
    ], Sparkline.prototype, "resize", void 0);
    Sparkline = __decorate([
        NotifyPropertyChanges
    ], Sparkline);
    return Sparkline;
}(Component));
export { Sparkline };
