import { removeClass, selectAll, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { CLS_EXPAND_OPEN, CLS_TB_ITEM, CLS_ACTIVE } from '../base/classes';
import * as CONSTANT from '../../common/constant';
import { RenderType } from '../base/enum';
import { KeyboardEvents } from '../actions/keyboard';
/**
 * Content module is used to render Rich Text Editor content
 * @hidden
 * @deprecated
 */
var ViewSource = /** @class */ (function () {
    /**
     * Constructor for view source module
     */
    function ViewSource(parent, locator) {
        this.parent = parent;
        var serviceLocator = locator;
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.addEventListener();
    }
    ViewSource.prototype.addEventListener = function () {
        this.parent.on(events.sourceCode, this.sourceCode, this);
        this.parent.on(events.initialEnd, this.onInitialEnd, this);
        this.parent.on(events.updateSource, this.updateSourceCode, this);
        this.parent.on(events.destroy, this.destroy, this);
    };
    ViewSource.prototype.onInitialEnd = function () {
        this.parent.formatter.editorManager.observer.on(CONSTANT.KEY_DOWN_HANDLER, this.onKeyDown, this);
    };
    ViewSource.prototype.removeEventListener = function () {
        this.unWireEvent();
        this.parent.off(events.sourceCode, this.sourceCode);
        this.parent.off(events.updateSource, this.updateSourceCode);
        this.parent.off(events.initialEnd, this.onInitialEnd);
        this.parent.off(events.destroy, this.destroy);
        this.parent.formatter.editorManager.observer.off(CONSTANT.KEY_DOWN_HANDLER, this.onKeyDown);
    };
    ViewSource.prototype.getSourceCode = function () {
        return this.parent.createElement('textarea', { className: 'e-rte-srctextarea' });
    };
    ViewSource.prototype.wireEvent = function (element) {
        this.keyboardModule = new KeyboardEvents(element, {
            keyAction: this.previewKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
        });
        EventHandler.add(this.previewElement, 'mousedown', this.mouseDownHandler, this);
    };
    ViewSource.prototype.unWireEvent = function () {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        if (this.previewElement) {
            EventHandler.remove(this.previewElement, 'mousedown', this.mouseDownHandler);
        }
    };
    ViewSource.prototype.wireBaseKeyDown = function () {
        this.parent.keyboardModule = new KeyboardEvents(this.contentModule.getEditPanel(), {
            keyAction: this.parent.keyDown.bind(this.parent), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
        });
    };
    ViewSource.prototype.unWireBaseKeyDown = function () {
        this.parent.keyboardModule.destroy();
    };
    ViewSource.prototype.mouseDownHandler = function (e) {
        this.parent.notify(events.sourceCodeMouseDown, { args: e });
    };
    ViewSource.prototype.previewKeyDown = function (event) {
        switch (event.action) {
            case 'html-source':
                this.updateSourceCode(event);
                event.preventDefault();
                break;
            case 'toolbar-focus':
                if (this.parent.toolbarSettings.enable) {
                    var selector = '.e-toolbar-item[aria-disabled="false"][title] [tabindex]';
                    this.parent.toolbarModule.baseToolbar.toolbarObj.element.querySelector(selector).focus();
                }
                break;
        }
    };
    ViewSource.prototype.onKeyDown = function (e) {
        switch (e.event.action) {
            case 'html-source':
                e.event.preventDefault();
                this.sourceCode(e);
                e.callBack({
                    requestType: 'SourceCode',
                    editorMode: 'HTML',
                    event: e.event
                });
                break;
        }
    };
    /**
     * sourceCode method
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.sourceCode = function (args) {
        this.parent.isBlur = false;
        this.parent.trigger(events.actionBegin, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
        var tbItems = selectAll('.' + CLS_TB_ITEM, this.parent.element);
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        this.parent.notify(events.updateToolbarItem, {
            targetItem: 'SourceCode', updateItem: 'Preview',
            baseToolbar: this.parent.getBaseToolbarObject()
        });
        if (isNullOrUndefined(this.previewElement)) {
            this.previewElement = this.getSourceCode();
        }
        this.parent.updateValueData();
        if (this.parent.iframeSettings.enable) {
            var rteContent = void 0;
            if (isNullOrUndefined(this.parent.element.querySelector('#' + this.parent.element.id + '_source-view'))) {
                rteContent = this.parent.createElement('div', {
                    className: 'e-source-content', id: this.parent.element.id + '_source-view'
                });
            }
            else {
                rteContent = this.parent.element.querySelector('#' + this.parent.element.id + '_source-view');
            }
            rteContent.appendChild(this.previewElement);
            this.parent.element.appendChild(rteContent);
            rteContent.style.height = this.contentModule.getPanel().style.height;
            rteContent.style.marginTop = this.contentModule.getPanel().style.marginTop;
            this.getPanel().value = this.getTextAreaValue();
            this.contentModule.getPanel().style.display = 'none';
            rteContent.style.display = 'block';
        }
        else {
            this.contentModule.getPanel().appendChild(this.previewElement);
            this.getPanel().value = this.getTextAreaValue();
            this.contentModule.getEditPanel().style.display = 'none';
            this.previewElement.style.display = 'block';
        }
        this.parent.isBlur = false;
        this.parent.disableToolbarItem(this.parent.toolbarSettings.items);
        this.parent.enableToolbarItem('SourceCode');
        if (this.parent.getToolbar()) {
            removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]);
        }
        removeClass(tbItems, [CLS_ACTIVE]);
        this.parent.setContentHeight('sourceCode', true);
        this.wireEvent(this.previewElement);
        this.unWireBaseKeyDown();
        this.previewElement.focus();
        this.parent.updateValue();
        if (!isNullOrUndefined(this.parent.placeholder) && !this.parent.iframeSettings.enable) {
            var placeHolderWrapper = this.parent.element.querySelector('.rte-placeholder.e-rte-placeholder');
            placeHolderWrapper.style.display = 'none';
        }
        this.parent.trigger(events.actionComplete, { requestType: 'SourceCode', targetItem: 'SourceCode', args: args });
        this.parent.invokeChangeEvent();
    };
    /**
     * updateSourceCode method
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.updateSourceCode = function (args) {
        this.parent.isBlur = false;
        this.parent.trigger(events.actionBegin, { requestType: 'Preview', targetItem: 'Preview', args: args });
        var editHTML = this.getPanel();
        this.parent.notify(events.updateToolbarItem, {
            targetItem: 'Preview', updateItem: 'SourceCode',
            baseToolbar: this.parent.getBaseToolbarObject()
        });
        var serializeValue = this.parent.serializeValue(editHTML.value);
        var value = (serializeValue === null || serializeValue === '') ? '<p><br/></p>' : serializeValue;
        if (this.parent.iframeSettings.enable) {
            editHTML.parentElement.style.display = 'none';
            this.contentModule.getPanel().style.display = 'block';
            this.contentModule.getEditPanel().innerHTML = value;
        }
        else {
            editHTML.style.display = 'none';
            this.contentModule.getEditPanel().style.display = 'block';
            this.contentModule.getEditPanel().innerHTML = value;
        }
        this.parent.isBlur = false;
        this.parent.enableToolbarItem(this.parent.toolbarSettings.items);
        if (this.parent.getToolbar()) {
            removeClass([this.parent.getToolbar()], [CLS_EXPAND_OPEN]);
        }
        this.parent.setContentHeight('preview', true);
        this.unWireEvent();
        this.wireBaseKeyDown();
        this.contentModule.getEditPanel().focus();
        this.parent.updateValue();
        if (!isNullOrUndefined(this.parent.placeholder) && this.contentModule.getEditPanel().innerText.length === 0) {
            var placeHolderWrapper = this.parent.element.querySelector('.rte-placeholder.e-rte-placeholder');
            placeHolderWrapper.style.display = 'block';
        }
        this.parent.trigger(events.actionComplete, { requestType: 'Preview', targetItem: 'Preview', args: args });
        this.parent.formatter.enableUndo(this.parent);
        this.parent.invokeChangeEvent();
    };
    ViewSource.prototype.getTextAreaValue = function () {
        return (this.contentModule.getEditPanel().innerHTML === '<p><br></p>') ||
            (this.contentModule.getEditPanel().childNodes.length === 1 &&
                this.contentModule.getEditPanel().childNodes[0].tagName === 'P' &&
                this.contentModule.getEditPanel().innerHTML.length === 7) ? '' : this.parent.value;
    };
    /**
     * getPanel method
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.getPanel = function () {
        return this.parent.element.querySelector('.e-rte-srctextarea');
    };
    /**
     * getViewPanel method
     * @param  {Element} panel
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.getViewPanel = function () {
        return (this.parent.iframeSettings.enable && this.getPanel()) ? this.getPanel().parentElement : this.getPanel();
    };
    /**
     * Destroy the entire RichTextEditor.
     * @return {void}
     * @hidden
     * @deprecated
     */
    ViewSource.prototype.destroy = function () {
        this.removeEventListener();
    };
    return ViewSource;
}());
export { ViewSource };
