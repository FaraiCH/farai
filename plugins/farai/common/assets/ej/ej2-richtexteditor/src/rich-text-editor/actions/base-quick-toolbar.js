import { detach, getUniqueID, append, closest, selectAll, select, isNullOrUndefined as isNOU, isBlazor } from '@syncfusion/ej2-base';
import { addClass, removeClass, Browser, isNullOrUndefined, setStyleAttribute } from '@syncfusion/ej2-base';
import { isCollide } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { RenderType } from '../base/enum';
import { setToolbarStatus, updateUndoRedoStatus, isIDevice } from '../base/util';
import { BaseToolbar } from './base-toolbar';
import { DropDownButtons } from './dropdown-buttons';
import { ColorPickerInput } from './color-picker';
/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
var BaseQuickToolbar = /** @class */ (function () {
    function BaseQuickToolbar(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.isDOMElement = false;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.popupRenderer = this.renderFactory.getRenderer(RenderType.Popup);
        this.dropDownButtons = new DropDownButtons(this.parent, this.locator);
        this.colorPickerObj = new ColorPickerInput(this.parent, this.locator);
    }
    BaseQuickToolbar.prototype.appendPopupContent = function () {
        this.toolbarElement = this.parent.createElement('div', { className: classes.CLS_QUICK_TB });
        this.element.appendChild(this.toolbarElement);
    };
    /**
     * render method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.render = function (args) {
        var className;
        if (args.popupType === 'Image') {
            className = classes.CLS_IMAGE_POP;
        }
        else if (args.popupType === 'Inline') {
            className = classes.CLS_INLINE_POP;
        }
        else {
            className = '';
        }
        var popupId = getUniqueID(args.popupType + '_Quick_Popup');
        this.stringItems = args.toolbarItems;
        this.element = this.parent.createElement('div', { id: popupId, className: className + ' ' + classes.CLS_RTE_ELEMENTS });
        this.element.setAttribute('aria-owns', this.parent.getID());
        this.appendPopupContent();
        this.createToolbar(args.toolbarItems, args.mode);
        this.popupRenderer.renderPopup(this);
        this.addEventListener();
    };
    BaseQuickToolbar.prototype.createToolbar = function (items, mode) {
        this.quickTBarObj = new BaseToolbar(this.parent, this.locator);
        this.quickTBarObj.render({
            container: 'quick',
            target: this.toolbarElement,
            items: items,
            mode: mode
        });
        this.quickTBarObj.toolbarObj.refresh();
    };
    BaseQuickToolbar.prototype.setPosition = function (e) {
        var x;
        var y;
        var imgWrapper = closest(e.target, '.e-img-caption');
        var target = !isNOU(imgWrapper) ? imgWrapper : e.target;
        addClass([this.toolbarElement], [classes.CLS_RM_WHITE_SPACE]);
        var targetOffsetTop = target.offsetTop;
        var parentOffsetTop = window.pageYOffset + e.parentData.top;
        if ((targetOffsetTop - e.editTop) > e.popHeight) {
            y = parentOffsetTop + e.tBarElementHeight + (targetOffsetTop - e.editTop) - e.popHeight - 5;
        }
        else if (((e.editTop + e.editHeight) - (targetOffsetTop + target.offsetHeight)) > e.popHeight) {
            y = parentOffsetTop + e.tBarElementHeight + (targetOffsetTop - e.editTop) + target.offsetHeight + 5;
        }
        else {
            y = e.y;
        }
        if (target.offsetWidth > e.popWidth) {
            x = (target.offsetWidth / 2) - (e.popWidth / 2) + e.parentData.left + target.offsetLeft;
        }
        else {
            x = e.parentData.left + target.offsetLeft;
        }
        this.popupObj.position.X = ((x + e.popWidth) > e.parentData.right) ? e.parentData.right - e.popWidth : x;
        this.popupObj.position.Y = (y >= 0) ? y : e.y + 5;
        this.popupObj.dataBind();
        removeClass([this.toolbarElement], [classes.CLS_RM_WHITE_SPACE]);
    };
    BaseQuickToolbar.prototype.checkCollision = function (e, viewPort, type) {
        var x;
        var y;
        var parentTop = e.parentData.top;
        var contentTop = e.windowY + parentTop + e.tBarElementHeight;
        var collision = [];
        if (viewPort === 'document') {
            collision = isCollide(e.popup);
        }
        else {
            collision = isCollide(e.popup, e.parentElement);
        }
        for (var i = 0; i < collision.length; i++) {
            switch (collision[i]) {
                case 'top':
                    if (viewPort === 'document') {
                        y = e.windowY;
                    }
                    else {
                        y = (window.pageYOffset + parentTop) + e.tBarElementHeight;
                    }
                    break;
                case 'bottom':
                    var posY = void 0;
                    if (viewPort === 'document') {
                        if (type === 'inline') {
                            posY = (e.y - e.popHeight - 10);
                        }
                        else {
                            if ((e.windowHeight - (parentTop + e.tBarElementHeight)) > e.popHeight) {
                                if ((contentTop - e.windowHeight) > e.popHeight) {
                                    posY = (contentTop + (e.windowHeight - parentTop)) - e.popHeight;
                                }
                                else {
                                    posY = contentTop;
                                }
                            }
                            else {
                                posY = e.windowY + (parentTop + e.tBarElementHeight);
                            }
                        }
                    }
                    else {
                        if (e.target.tagName !== 'IMG') {
                            posY = (e.parentData.bottom + window.pageYOffset) - e.popHeight - 10;
                        }
                        else {
                            posY = (e.parentData.bottom + window.pageYOffset) - e.popHeight - 5;
                        }
                    }
                    y = posY;
                    break;
                case 'right':
                    if (type === 'inline') {
                        x = e.windowWidth - (e.popWidth + e.bodyRightSpace + 10);
                    }
                    else {
                        x = e.x - e.popWidth;
                    }
                    break;
                case 'left':
                    if (type === 'inline') {
                        x = 0;
                    }
                    else {
                        x = e.parentData.left;
                    }
                    break;
            }
        }
        this.popupObj.position.X = (x) ? x : this.popupObj.position.X;
        this.popupObj.position.Y = (y) ? y : this.popupObj.position.Y;
        this.popupObj.dataBind();
    };
    /**
     * showPopup method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.showPopup = function (x, y, target) {
        var _this = this;
        var eventArgs = isBlazor() ? { cancel: false, targetElement: target } :
            { popup: this.popupObj, cancel: false, targetElement: target };
        this.parent.trigger(events.beforeQuickToolbarOpen, eventArgs, function (beforeQuickToolbarArgs) {
            if (!beforeQuickToolbarArgs.cancel) {
                var editPanelTop = void 0;
                var editPanelHeight = void 0;
                var bodyStyle = window.getComputedStyle(document.body);
                var bodyRight = parseFloat(bodyStyle.marginRight.split('px')[0]) + parseFloat(bodyStyle.paddingRight.split('px')[0]);
                var windowHeight = window.innerHeight;
                var windowWidth = window.innerWidth;
                var parent_1 = _this.parent.element;
                var toolbarAvail = !isNullOrUndefined(_this.parent.getToolbar());
                var tbHeight = toolbarAvail && _this.parent.toolbarModule.getToolbarHeight();
                var expTBHeight = toolbarAvail && _this.parent.toolbarModule.getExpandTBarPopHeight();
                var tBarHeight = (toolbarAvail) ? (tbHeight + expTBHeight) : 0;
                addClass([_this.element], [classes.CLS_HIDE]);
                if (Browser.isDevice && !isIDevice()) {
                    addClass([_this.parent.getToolbar()], [classes.CLS_HIDE]);
                }
                if (_this.parent.iframeSettings.enable) {
                    var cntEle = _this.contentRenderer.getPanel().contentWindow;
                    editPanelTop = cntEle.pageYOffset;
                    editPanelHeight = cntEle.innerHeight;
                }
                else {
                    var cntEle = closest(target, '.' + classes.CLS_RTE_CONTENT);
                    editPanelTop = (cntEle) ? cntEle.scrollTop : 0;
                    editPanelHeight = (cntEle) ? cntEle.offsetHeight : 0;
                }
                if (!_this.parent.inlineMode.enable && !closest(target, 'table')) {
                    _this.parent.disableToolbarItem(_this.parent.toolbarSettings.items);
                    _this.parent.enableToolbarItem(['Undo', 'Redo']);
                }
                append([_this.element], document.body);
                _this.popupObj.position.X = x + 20;
                _this.popupObj.position.Y = y + ((_this.parent.iframeSettings.enable) ? 35 : 20);
                _this.popupObj.dataBind();
                _this.popupObj.element.classList.add('e-popup-open');
                _this.dropDownButtons.renderDropDowns({
                    container: _this.toolbarElement,
                    containerType: 'quick',
                    items: _this.stringItems
                });
                _this.colorPickerObj.renderColorPickerInput({
                    container: _this.toolbarElement,
                    containerType: 'quick',
                    items: _this.stringItems
                });
                var showPopupData = {
                    x: x, y: y,
                    target: target,
                    editTop: editPanelTop,
                    editHeight: editPanelHeight,
                    popup: _this.popupObj.element,
                    popHeight: _this.popupObj.element.offsetHeight,
                    popWidth: _this.popupObj.element.offsetWidth,
                    parentElement: parent_1,
                    bodyRightSpace: bodyRight,
                    windowY: window.pageYOffset,
                    windowHeight: windowHeight,
                    windowWidth: windowWidth,
                    parentData: parent_1.getBoundingClientRect(),
                    tBarElementHeight: tBarHeight
                };
                if (target.tagName === 'IMG') {
                    _this.setPosition(showPopupData);
                }
                if (!_this.parent.inlineMode.enable) {
                    _this.checkCollision(showPopupData, 'parent', '');
                }
                _this.checkCollision(showPopupData, 'document', ((_this.parent.inlineMode.enable) ? 'inline' : ''));
                _this.popupObj.element.classList.remove('e-popup-open');
                removeClass([_this.element], [classes.CLS_HIDE]);
                _this.popupObj.show({ name: 'ZoomIn', duration: (Browser.isIE ? 250 : 400) });
                setStyleAttribute(_this.element, {
                    maxWidth: _this.parent.element.offsetWidth + 'px'
                });
                addClass([_this.element], [classes.CLS_POP]);
                _this.isDOMElement = true;
            }
        });
    };
    /**
     * hidePopup method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.hidePopup = function () {
        var viewSourcePanel = this.parent.sourceCodeModule.getViewPanel();
        if (Browser.isDevice && !isIDevice()) {
            removeClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
        }
        if (!isNullOrUndefined(this.parent.getToolbar()) && !this.parent.inlineMode.enable) {
            if (isNullOrUndefined(viewSourcePanel) || viewSourcePanel.style.display === 'none') {
                this.parent.enableToolbarItem(this.parent.toolbarSettings.items);
            }
        }
        this.removeEleFromDOM();
        this.isDOMElement = false;
    };
    /**
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.addQTBarItem = function (item, index) {
        this.quickTBarObj.toolbarObj.addItems(this.quickTBarObj.getItems(item, 'toolbar'), index);
    };
    /**
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.removeQTBarItem = function (index) {
        this.quickTBarObj.toolbarObj.removeItems(index);
    };
    BaseQuickToolbar.prototype.removeEleFromDOM = function () {
        var element = this.popupObj.element;
        if (this.isDOMElement) {
            this.dropDownButtons.destroyDropDowns();
            this.colorPickerObj.destroyColorPicker();
            removeClass([this.element], [classes.CLS_POP]);
            detach(element);
            var args = isBlazor() ? { element: this.popupObj.element } : this.popupObj;
            this.parent.trigger(events.quickToolbarClose, args);
        }
    };
    BaseQuickToolbar.prototype.updateStatus = function (args) {
        var options = {
            args: args,
            dropDownModule: this.dropDownButtons,
            parent: this.parent,
            tbElements: selectAll('.' + classes.CLS_TB_ITEM, this.element),
            tbItems: this.quickTBarObj.toolbarObj.items
        };
        setToolbarStatus(options, true);
        if (!select('.e-rte-srctextarea', this.parent.element)) {
            updateUndoRedoStatus(this.parent.getBaseToolbarObject(), this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
    };
    /**
     * Destroys the Quick toolbar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.destroy = function () {
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.popupObj.destroy();
            this.removeEleFromDOM();
        }
        this.removeEventListener();
    };
    /**
     * addEventListener method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        if (this.parent.inlineMode.enable) {
            this.parent.on(events.toolbarUpdated, this.updateStatus, this);
        }
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.onPropertyChanged = function (e) {
        if (!isNullOrUndefined(e.newProp.inlineMode)) {
            for (var _i = 0, _a = Object.keys(e.newProp.inlineMode); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'enable':
                        if (e.newProp.inlineMode.enable) {
                            this.parent.on(events.toolbarUpdated, this.updateStatus, this);
                        }
                        else {
                            this.parent.off(events.toolbarUpdated, this.updateStatus);
                        }
                        break;
                }
            }
        }
    };
    /**
     * removeEventListener method
     * @hidden
     * @deprecated
     */
    BaseQuickToolbar.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        if (this.parent.inlineMode.enable) {
            this.parent.off(events.toolbarUpdated, this.updateStatus);
        }
    };
    return BaseQuickToolbar;
}());
export { BaseQuickToolbar };
