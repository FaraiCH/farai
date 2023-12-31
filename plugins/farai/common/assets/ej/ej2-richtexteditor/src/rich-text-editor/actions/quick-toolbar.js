import { select, isNullOrUndefined, Browser, addClass, removeClass, EventHandler, closest } from '@syncfusion/ej2-base';
import { RenderType } from '../base/enum';
import * as events from '../base/constant';
import { pageYOffset, hasClass, isIDevice } from '../base/util';
import { BaseQuickToolbar } from './base-quick-toolbar';
import { PopupRenderer } from '../renderer/popup-renderer';
import { CLS_INLINE_POP, CLS_INLINE } from '../base/classes';
/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
var QuickToolbar = /** @class */ (function () {
    function QuickToolbar(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.renderFactory.addRenderer(RenderType.Popup, new PopupRenderer(this.parent));
        this.addEventListener();
    }
    QuickToolbar.prototype.formatItems = function (items) {
        var formattedItems = [];
        items.forEach(function (item) {
            if (typeof item === 'string') {
                switch (item.toLocaleLowerCase()) {
                    case 'open':
                        formattedItems.push('openLink');
                        break;
                    case 'edit':
                        formattedItems.push('editLink');
                        break;
                    case 'unlink':
                        formattedItems.push('removeLink');
                        break;
                    default:
                        formattedItems.push(item);
                        break;
                }
            }
            else {
                formattedItems.push(item);
            }
        });
        return formattedItems;
    };
    QuickToolbar.prototype.getQTBarOptions = function (popType, mode, items, type) {
        return {
            popupType: popType,
            toolbarItems: items,
            mode: mode,
            renderType: type
        };
    };
    /**
     * createQTBar method
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.createQTBar = function (popupType, mode, items, type) {
        if (items.length < 1) {
            return null;
        }
        var qTBar = new BaseQuickToolbar(this.parent, this.locator);
        qTBar.render(this.getQTBarOptions(popupType, mode, this.formatItems(items), type));
        return qTBar;
    };
    QuickToolbar.prototype.initializeQuickToolbars = function () {
        this.parent.quickToolbarModule = this;
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        if (this.parent.inlineMode.enable && this.parent.inlineMode.onSelection && isIDevice()) {
            EventHandler.add(this.contentRenderer.getDocument(), 'selectionchange', this.selectionChangeHandler, this);
        }
    };
    QuickToolbar.prototype.onMouseDown = function (e) {
        this.parent.isBlur = false;
        this.parent.isRTE = true;
    };
    QuickToolbar.prototype.renderQuickToolbars = function () {
        if (this.linkQTBar || this.imageQTBar || this.textQTBar || this.tableQTBar) {
            return;
        }
        this.linkQTBar = this.createQTBar('Link', 'Scrollable', this.parent.quickToolbarSettings.link, RenderType.LinkToolbar);
        this.renderFactory.addRenderer(RenderType.LinkToolbar, this.linkQTBar);
        this.textQTBar = this.createQTBar('Text', 'Scrollable', this.parent.quickToolbarSettings.text, RenderType.TextToolbar);
        this.renderFactory.addRenderer(RenderType.TextToolbar, this.textQTBar);
        this.imageQTBar = this.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
        this.renderFactory.addRenderer(RenderType.ImageToolbar, this.imageQTBar);
        this.tableQTBar = this.createQTBar('Table', 'MultiRow', this.parent.quickToolbarSettings.table, RenderType.TableToolbar);
        this.renderFactory.addRenderer(RenderType.TableToolbar, this.tableQTBar);
        if (this.linkQTBar) {
            EventHandler.add(this.linkQTBar.element, 'mousedown', this.onMouseDown, this);
        }
        if (this.imageQTBar) {
            EventHandler.add(this.imageQTBar.element, 'mousedown', this.onMouseDown, this);
        }
        if (this.textQTBar) {
            EventHandler.add(this.textQTBar.element, 'mousedown', this.onMouseDown, this);
        }
        if (this.tableQTBar) {
            EventHandler.add(this.tableQTBar.element, 'mousedown', this.onMouseDown, this);
        }
    };
    QuickToolbar.prototype.renderInlineQuickToolbar = function () {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            addClass([this.parent.element], [CLS_INLINE]);
            this.inlineQTBar = this.createQTBar('Inline', 'MultiRow', this.parent.toolbarSettings.items, RenderType.InlineToolbar);
            this.renderFactory.addRenderer(RenderType.InlineToolbar, this.inlineQTBar);
            EventHandler.add(this.inlineQTBar.element, 'mousedown', this.onMouseDown, this);
        }
    };
    /**
     * Method for showing the inline quick toolbar
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.showInlineQTBar = function (x, y, target) {
        if (this.parent.readonly) {
            return;
        }
        this.inlineQTBar.showPopup(x, y, target);
    };
    /**
     * Method for hidding the inline quick toolbar
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.hideInlineQTBar = function () {
        if (this.inlineQTBar && !hasClass(this.inlineQTBar.element, 'e-popup-close')) {
            this.inlineQTBar.hidePopup();
        }
    };
    /**
     * Method for hidding the quick toolbar
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.hideQuickToolbars = function () {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close') && document.body.contains(this.linkQTBar.element)) {
            this.linkQTBar.hidePopup();
        }
        if (this.textQTBar && !hasClass(this.textQTBar.element, 'e-popup-close') && document.body.contains(this.textQTBar.element)) {
            this.textQTBar.hidePopup();
        }
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close') && document.body.contains(this.imageQTBar.element)) {
            this.imageQTBar.hidePopup();
        }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close') && document.body.contains(this.tableQTBar.element)) {
            this.tableQTBar.hidePopup();
        }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            this.hideInlineQTBar();
        }
    };
    QuickToolbar.prototype.deBounce = function (x, y, target) {
        var _this = this;
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(function () { _this.showInlineQTBar(x, y, target); }, 1000);
    };
    QuickToolbar.prototype.mouseUpHandler = function (e) {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            var coordinates = void 0;
            coordinates = e.args.touches ? e.args.changedTouches[0] : e.args;
            var range = this.parent.getRange();
            var target = e.args.target;
            if (isNullOrUndefined(select('.' + CLS_INLINE_POP, document.body))) {
                if (isIDevice() && e.touchData && e.touchData.prevClientX !== e.touchData.clientX
                    && e.touchData.prevClientY !== e.touchData.clientY) {
                    return;
                }
                this.hideInlineQTBar();
                this.offsetX = coordinates.pageX;
                this.offsetY = pageYOffset(coordinates, this.parent.element, this.parent.iframeSettings.enable);
                if (target.nodeName === 'TEXTAREA') {
                    this.showInlineQTBar(this.offsetX, this.offsetY, target);
                }
                else {
                    var closestAnchor = closest(target, 'a');
                    target = closestAnchor ? closestAnchor : target;
                    if (target.tagName !== 'IMG' && target.tagName !== 'A' && (!closest(target, 'td,th') || !range.collapsed)) {
                        if (this.parent.inlineMode.onSelection && range.collapsed) {
                            return;
                        }
                        this.target = target;
                        this.showInlineQTBar(this.offsetX, this.offsetY, target);
                    }
                }
            }
        }
    };
    QuickToolbar.prototype.keyDownHandler = function () {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    };
    QuickToolbar.prototype.inlineQTBarMouseDownHandler = function () {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    };
    QuickToolbar.prototype.keyUpHandler = function (e) {
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            if (this.parent.inlineMode.onSelection) {
                return;
            }
            var args = e.args;
            this.deBounce(this.offsetX, this.offsetY, args.target);
        }
    };
    QuickToolbar.prototype.selectionChangeHandler = function (e) {
        var _this = this;
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(function () { _this.onSelectionChange(e); }, 1000);
    };
    QuickToolbar.prototype.onSelectionChange = function (e) {
        if (!isNullOrUndefined(select('.' + CLS_INLINE_POP, document.body))) {
            return;
        }
        var selection = this.contentRenderer.getDocument().getSelection();
        if (!selection.isCollapsed) {
            this.mouseUpHandler({ args: e });
        }
    };
    /**
     * getInlineBaseToolbar method
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.getInlineBaseToolbar = function () {
        return this.inlineQTBar && this.inlineQTBar.quickTBarObj;
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.destroy = function () {
        if (this.linkQTBar) {
            EventHandler.remove(this.linkQTBar.element, 'mousedown', this.onMouseDown);
            this.linkQTBar.destroy();
        }
        if (this.textQTBar) {
            EventHandler.remove(this.textQTBar.element, 'mousedown', this.onMouseDown);
            this.textQTBar.destroy();
        }
        if (this.imageQTBar) {
            EventHandler.remove(this.imageQTBar.element, 'mousedown', this.onMouseDown);
            this.imageQTBar.destroy();
        }
        if (this.tableQTBar) {
            EventHandler.remove(this.tableQTBar.element, 'mousedown', this.onMouseDown);
            this.tableQTBar.destroy();
        }
        if (this.inlineQTBar) {
            EventHandler.remove(this.inlineQTBar.element, 'mousedown', this.onMouseDown);
            if (isIDevice()) {
                EventHandler.remove(document, 'selectionchange', this.selectionChangeHandler);
            }
            this.inlineQTBar.destroy();
        }
        this.removeEventListener();
    };
    QuickToolbar.prototype.wireInlineQTBarEvents = function () {
        this.parent.on(events.mouseUp, this.mouseUpHandler, this);
        this.parent.on(events.mouseDown, this.inlineQTBarMouseDownHandler, this);
        this.parent.on(events.keyDown, this.keyDownHandler, this);
        this.parent.on(events.keyUp, this.keyUpHandler, this);
        this.parent.on(events.sourceCodeMouseDown, this.mouseUpHandler, this);
        this.parent.on(events.renderInlineToolbar, this.renderInlineQuickToolbar, this);
    };
    QuickToolbar.prototype.unWireInlineQTBarEvents = function () {
        this.parent.off(events.mouseUp, this.mouseUpHandler);
        this.parent.off(events.mouseDown, this.inlineQTBarMouseDownHandler);
        this.parent.off(events.keyDown, this.keyDownHandler);
        this.parent.off(events.keyUp, this.keyUpHandler);
        this.parent.off(events.sourceCodeMouseDown, this.mouseUpHandler);
        this.parent.off(events.renderInlineToolbar, this.renderInlineQuickToolbar);
    };
    QuickToolbar.prototype.toolbarUpdated = function (args) {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close')) {
            this.linkQTBar.hidePopup();
        }
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
            this.imageQTBar.hidePopup();
        }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close')) {
            this.tableQTBar.hidePopup();
        }
    };
    /**
     * addEventListener
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialEnd, this.initializeQuickToolbars, this);
        this.parent.on(events.mouseDown, this.renderQuickToolbars, this);
        this.parent.on(events.toolbarUpdated, this.toolbarUpdated, this);
        this.parent.on(events.drop, this.renderQuickToolbars, this);
        this.wireInlineQTBarEvents();
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.on(events.scroll, this.hideQuickToolbars, this);
            this.parent.on(events.contentscroll, this.hideQuickToolbars, this);
        }
        this.parent.on(events.focusChange, this.hideQuickToolbars, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
    };
    QuickToolbar.prototype.onKeyDown = function (e) {
        var args = e.args;
        if (args.which === 8 || args.which === 46) {
            if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
                this.imageQTBar.hidePopup();
            }
        }
    };
    QuickToolbar.prototype.onIframeMouseDown = function () {
        this.hideQuickToolbars();
        this.hideInlineQTBar();
    };
    QuickToolbar.prototype.setRtl = function (args) {
        if (this.inlineQTBar) {
            this.inlineQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.imageQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.linkQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    };
    /**
     * removeEventListener
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.initializeQuickToolbars);
        this.parent.off(events.mouseDown, this.renderQuickToolbars);
        this.parent.off(events.toolbarUpdated, this.toolbarUpdated);
        this.parent.off(events.drop, this.renderQuickToolbars);
        this.unWireInlineQTBarEvents();
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.off(events.scroll, this.hideQuickToolbars);
            this.parent.off(events.contentscroll, this.hideQuickToolbars);
        }
        this.parent.off(events.focusChange, this.hideQuickToolbars);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.rtlMode, this.setRtl);
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    QuickToolbar.prototype.onPropertyChanged = function (e) {
        if (!isNullOrUndefined(e.newProp.quickToolbarSettings)) {
            for (var _i = 0, _a = Object.keys(e.newProp.quickToolbarSettings); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'actionOnScroll':
                        if (e.newProp.quickToolbarSettings.actionOnScroll === 'none') {
                            this.parent.off(events.scroll, this.hideQuickToolbars);
                            this.parent.off(events.contentscroll, this.hideQuickToolbars);
                        }
                        else {
                            this.parent.on(events.scroll, this.hideQuickToolbars, this);
                            this.parent.on(events.contentscroll, this.hideQuickToolbars, this);
                        }
                        break;
                }
            }
        }
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (this.inlineQTBar) {
            removeClass([this.parent.element], [CLS_INLINE]);
            this.unWireInlineQTBarEvents();
            this.hideInlineQTBar();
        }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            addClass([this.parent.element], [CLS_INLINE]);
            this.wireInlineQTBarEvents();
        }
    };
    /**
     * For internal use only - Get the module name.
     */
    QuickToolbar.prototype.getModuleName = function () {
        return 'quickToolbar';
    };
    return QuickToolbar;
}());
export { QuickToolbar };
