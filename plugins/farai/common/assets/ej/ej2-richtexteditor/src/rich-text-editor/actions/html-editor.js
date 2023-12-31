import * as events from '../base/constant';
import { isNullOrUndefined, closest, attributes, removeClass, addClass } from '@syncfusion/ej2-base';
import { HTMLFormatter } from '../formatter/html-formatter';
import { RenderType } from '../base/enum';
import * as classes from '../base/classes';
import { HtmlToolbarStatus } from './html-toolbar-status';
import { IframeContentRender } from '../renderer/iframe-content-renderer';
import { ContentRender } from '../renderer/content-renderer';
import { ColorPickerInput } from './color-picker';
import { NodeSelection } from '../../selection/selection';
import { InsertHtml } from '../../editor-manager/plugin/inserthtml';
import { getTextNodesUnder, sanitizeHelper } from '../base/util';
import { isIDevice } from '../../common/util';
import { XhtmlValidation } from './xhtml-validation';
/**
 * `HtmlEditor` module is used to HTML editor
 */
var HtmlEditor = /** @class */ (function () {
    function HtmlEditor(parent, serviceLocator) {
        this.rangeCollection = [];
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.xhtmlValidation = new XhtmlValidation(parent);
        this.addEventListener();
    }
    /**
     * Destroys the Markdown.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    HtmlEditor.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     * @deprecated
     */
    HtmlEditor.prototype.sanitizeHelper = function (value) {
        value = sanitizeHelper(value, this.parent);
        return value;
    };
    HtmlEditor.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.nodeSelectionObj = new NodeSelection();
        this.colorPickerModule = new ColorPickerInput(this.parent, this.locator);
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.htmlToolbarClick, this.onToolbarClick, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.renderColorPicker, this.renderColorPicker, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.selectAll, this.selectAll, this);
        this.parent.on(events.selectRange, this.selectRange, this);
        this.parent.on(events.getSelectedHtml, this.getSelectedHtml, this);
        this.parent.on(events.selectionSave, this.onSelectionSave, this);
        this.parent.on(events.selectionRestore, this.onSelectionRestore, this);
        this.parent.on(events.readOnlyMode, this.updateReadOnly, this);
        this.parent.on(events.paste, this.onPaste, this);
    };
    HtmlEditor.prototype.updateReadOnly = function () {
        if (this.parent.readonly) {
            attributes(this.parent.contentModule.getEditPanel(), { contenteditable: 'false' });
            addClass([this.parent.element], classes.CLS_RTE_READONLY);
        }
        else {
            attributes(this.parent.contentModule.getEditPanel(), { contenteditable: 'true' });
            removeClass([this.parent.element], classes.CLS_RTE_READONLY);
        }
    };
    HtmlEditor.prototype.onSelectionSave = function () {
        var currentDocument = this.contentRenderer.getDocument();
        var range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
    };
    HtmlEditor.prototype.onSelectionRestore = function (e) {
        this.parent.isBlur = false;
        this.contentRenderer.getEditPanel().focus();
        if (isNullOrUndefined(e.items) || e.items) {
            this.saveSelection.restore();
        }
    };
    HtmlEditor.prototype.onKeyDown = function (e) {
        if (e.args.keyCode === 9 && this.parent.enableTabKey) {
            var range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
            var parentNode = this.nodeSelectionObj.getParentNodeCollection(range);
            if (!((parentNode[0].nodeName === 'LI' || closest(parentNode[0], 'li') ||
                closest(parentNode[0], 'table')) && range.startOffset === 0)) {
                e.args.preventDefault();
                if (!e.args.shiftKey) {
                    InsertHtml.Insert(this.contentRenderer.getDocument(), '&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.rangeCollection.push(this.nodeSelectionObj.getRange(this.contentRenderer.getDocument()));
                }
                else if (this.rangeCollection.length > 0 &&
                    this.rangeCollection[this.rangeCollection.length - 1].startContainer.textContent.length === 4) {
                    var textCont = this.rangeCollection[this.rangeCollection.length - 1].startContainer;
                    this.nodeSelectionObj.setSelectionText(this.contentRenderer.getDocument(), textCont, textCont, 0, textCont.textContent.length);
                    InsertHtml.Insert(this.contentRenderer.getDocument(), document.createTextNode(''));
                    this.rangeCollection.pop();
                }
            }
        }
        if (e.args.action === 'space' ||
            e.args.action === 'enter') {
            this.spaceLink(e.args);
        }
    };
    HtmlEditor.prototype.onPaste = function (e) {
        var regex = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (e.text.match(regex)) {
            e.args.preventDefault();
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            var saveSelection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            var httpRegex = new RegExp(/([^\S]|^)(((https?\:\/\/)))/gi);
            var wwwRegex = new RegExp(/([^\S]|^)(((www\.))(\S+))/gi);
            var enterSplitText = e.text.split('\n');
            var contentInnerElem = '';
            for (var i = 0; i < enterSplitText.length; i++) {
                if (enterSplitText[i].trim() === '') {
                    contentInnerElem += '<p><br></p>';
                }
                else {
                    var contentWithSpace = '';
                    var spaceBetweenContent = true;
                    var spaceSplit = enterSplitText[i].split(' ');
                    for (var j = 0; j < spaceSplit.length; j++) {
                        if (spaceSplit[j].trim() === '') {
                            contentWithSpace += spaceBetweenContent ? '&nbsp;' : ' ';
                        }
                        else {
                            spaceBetweenContent = false;
                            contentWithSpace += spaceSplit[j] + ' ';
                        }
                    }
                    if (i === 0) {
                        contentInnerElem += '<span>' + contentWithSpace.trim() + '</span>';
                    }
                    else {
                        contentInnerElem += '<p>' + contentWithSpace.trim() + '</p>';
                    }
                }
            }
            var divElement = this.parent.createElement('div');
            divElement.setAttribute('class', 'pasteContent');
            divElement.style.display = 'inline';
            divElement.innerHTML = contentInnerElem;
            var paraElem = divElement.querySelectorAll('span, p');
            for (var i = 0; i < paraElem.length; i++) {
                var splitTextContent = paraElem[i].innerHTML.split(' ');
                var resultSplitContent = '';
                for (var j = 0; j < splitTextContent.length; j++) {
                    if (splitTextContent[j].match(httpRegex) || splitTextContent[j].match(wwwRegex)) {
                        resultSplitContent += '<a className="e-rte-anchor" href="' + splitTextContent[j] +
                            '" title="' + splitTextContent[j] + '">' + splitTextContent[j] + ' </a>';
                    }
                    else {
                        resultSplitContent += splitTextContent[j] + ' ';
                    }
                }
                paraElem[i].innerHTML = resultSplitContent.trim();
            }
            if (!isNullOrUndefined(this.parent.pasteCleanupModule)) {
                e.callBack(divElement.innerHTML);
            }
            else {
                this.parent.formatter.editorManager.execCommand('insertHTML', null, null, null, divElement);
            }
        }
    };
    HtmlEditor.prototype.spaceLink = function (e) {
        var range = this.nodeSelectionObj.getRange(this.contentRenderer.getDocument());
        var selectNodeEle = this.nodeSelectionObj.getParentNodeCollection(range);
        var text = range.startContainer.textContent.substr(0, range.endOffset);
        var splitText = text.split(' ');
        var urlText = splitText[splitText.length - 1];
        var urlTextRange = range.startOffset - (text.length - splitText[splitText.length - 1].length);
        urlText = urlText.slice(0, urlTextRange);
        var regex = new RegExp(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi);
        if (selectNodeEle[0].nodeName !== 'A' && urlText.match(regex)) {
            var selection = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
            var url = urlText.indexOf('http') > -1 ? urlText : 'http://' + urlText;
            var selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            var value = {
                url: url,
                selection: selection, selectParent: selectParent,
                text: urlText,
                title: '',
                target: '_blank'
            };
            this.parent.formatter.process(this.parent, {
                item: {
                    'command': 'Links',
                    'subCommand': 'CreateLink'
                }
            }, e, value);
        }
    };
    HtmlEditor.prototype.onToolbarClick = function (args) {
        var save;
        var selectNodeEle;
        var selectParentEle;
        var item = args.item;
        var closestElement = closest(args.originalEvent.target, '.e-rte-quick-popup');
        if (closestElement && !closestElement.classList.contains('e-rte-inline-popup')) {
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                if (isIDevice() && item.command === 'Images') {
                    this.nodeSelectionObj.restore();
                }
                var range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
                save = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
                selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
            }
            if (item.command === 'Images') {
                this.parent.notify(events.imageToolbarAction, {
                    member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
            if (item.command === 'Links') {
                this.parent.notify(events.linkToolbarAction, {
                    member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
            if (item.command === 'Table') {
                this.parent.notify(events.tableToolbarAction, {
                    member: 'table', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                });
            }
        }
        else {
            var linkDialog = this.parent.element.querySelector('#' + this.parent.getID() + '_rtelink');
            var imageDialog = this.parent.element.querySelector('#' + this.parent.getID() + '_image');
            if (!(item.subCommand === 'SourceCode' || item.subCommand === 'Preview' ||
                item.subCommand === 'FontColor' || item.subCommand === 'BackgroundColor')) {
                var range = this.nodeSelectionObj.getRange(this.parent.contentModule.getDocument());
                if (isNullOrUndefined(linkDialog) && isNullOrUndefined(imageDialog)) {
                    save = this.nodeSelectionObj.save(range, this.parent.contentModule.getDocument());
                }
                selectNodeEle = this.nodeSelectionObj.getNodeCollection(range);
                selectParentEle = this.nodeSelectionObj.getParentNodeCollection(range);
            }
            switch (item.subCommand) {
                case 'Maximize':
                    this.parent.notify(events.enableFullScreen, { args: args });
                    break;
                case 'Minimize':
                    this.parent.notify(events.disableFullScreen, { args: args });
                    break;
                case 'CreateLink':
                    this.parent.notify(events.insertLink, {
                        member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'RemoveLink':
                    this.parent.notify(events.unLink, {
                        member: 'link', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'Print':
                    this.parent.print();
                    break;
                case 'Image':
                    this.parent.notify(events.insertImage, {
                        member: 'image', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                case 'CreateTable':
                    this.parent.notify(events.createTable, {
                        member: 'table', args: args, selection: save
                    });
                    break;
                case 'SourceCode':
                    this.parent.notify(events.sourceCode, { member: 'viewSource', args: args });
                    break;
                case 'Preview':
                    this.parent.notify(events.updateSource, { member: 'updateSource', args: args });
                    break;
                case 'FontColor':
                case 'BackgroundColor':
                    break;
                case 'File':
                    this.parent.notify(events.renderFileManager, {
                        member: 'fileManager', args: args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    });
                    break;
                default:
                    this.parent.formatter.process(this.parent, args, args.originalEvent, null);
                    break;
            }
        }
    };
    HtmlEditor.prototype.renderColorPicker = function (args) {
        this.colorPickerModule.renderColorPickerInput(args);
    };
    HtmlEditor.prototype.instantiateRenderer = function () {
        if (this.parent.iframeSettings.enable) {
            this.renderFactory.addRenderer(RenderType.Content, new IframeContentRender(this.parent, this.locator));
        }
        else {
            this.renderFactory.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));
        }
    };
    HtmlEditor.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.htmlToolbarClick, this.onToolbarClick);
        this.parent.off(events.renderColorPicker, this.renderColorPicker);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.initialLoad, this.instantiateRenderer);
        this.parent.off(events.selectAll, this.selectAll);
        this.parent.off(events.selectRange, this.selectRange);
        this.parent.off(events.getSelectedHtml, this.getSelectedHtml);
        this.parent.off(events.selectionSave, this.onSelectionSave);
        this.parent.off(events.selectionRestore, this.onSelectionRestore);
        this.parent.off(events.readOnlyMode, this.updateReadOnly);
        this.parent.off(events.paste, this.onPaste);
    };
    HtmlEditor.prototype.render = function () {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        var editElement = this.contentRenderer.getEditPanel();
        var option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        if (isNullOrUndefined(this.parent.formatter)) {
            var formatterClass = new HTMLFormatter({
                currentDocument: this.contentRenderer.getDocument(),
                element: editElement,
                options: option
            });
            this.parent.setProperties({ formatter: formatterClass }, true);
        }
        else {
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
        if (this.parent.enableXhtml) {
            this.parent.notify(events.xhtmlValidation, {});
        }
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new HtmlToolbarStatus(this.parent);
        }
        this.parent.notify(events.bindOnEnd, {});
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     * @deprecated
     */
    HtmlEditor.prototype.onPropertyChanged = function (e) {
        // On property code change here
        if (!isNullOrUndefined(e.newProp.formatter)) {
            var editElement = this.contentRenderer.getEditPanel();
            var option = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
    };
    /**
     * For internal use only - Get the module name.
     */
    HtmlEditor.prototype.getModuleName = function () {
        return 'htmlEditor';
    };
    /**
     * For selecting all content in RTE
     * @private
     */
    HtmlEditor.prototype.selectAll = function () {
        var nodes = getTextNodesUnder(this.parent.contentModule.getDocument(), this.parent.contentModule.getEditPanel());
        if (nodes.length > 0) {
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.parent.contentModule.getDocument(), nodes[0], nodes[nodes.length - 1], 0, nodes[nodes.length - 1].textContent.length);
        }
    };
    /**
     * For selecting all content in RTE
     * @private
     */
    HtmlEditor.prototype.selectRange = function (e) {
        this.parent.formatter.editorManager.nodeSelection.setRange(this.parent.contentModule.getDocument(), e.range);
    };
    /**
     * For get a selected text in RTE
     * @private
     */
    HtmlEditor.prototype.getSelectedHtml = function (e) {
        e.callBack(this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument()).toString());
    };
    return HtmlEditor;
}());
export { HtmlEditor };
