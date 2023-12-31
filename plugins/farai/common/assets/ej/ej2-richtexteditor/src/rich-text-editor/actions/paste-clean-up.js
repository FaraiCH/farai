import * as events from '../base/constant';
import { Popup } from '@syncfusion/ej2-popups';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { isNullOrUndefined as isNOU, isNullOrUndefined, detach, isBlazor, extend, addClass } from '@syncfusion/ej2-base';
import { getUniqueID, Browser } from '@syncfusion/ej2-base';
import { CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_REMOVE_FORMAT, CLS_RTE_PASTE_PLAIN_FORMAT } from '../base/classes';
import { CLS_RTE_PASTE_OK, CLS_RTE_PASTE_CANCEL, CLS_RTE_DIALOG_MIN_HEIGHT } from '../base/classes';
import { pasteCleanupGroupingTags } from '../../common/config';
import { NodeSelection } from '../../selection/selection';
import * as EVENTS from './../../common/constant';
import { RenderType } from '../base/enum';
import { Uploader } from '@syncfusion/ej2-inputs';
import * as classes from '../base/classes';
import { sanitizeHelper, convertToBlob } from '../base/util';
/**
 * PasteCleanup module called when pasting content in RichTextEditor
 */
var PasteCleanup = /** @class */ (function () {
    function PasteCleanup(parent, serviceLocator) {
        this.inlineNode = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
            'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
            'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
            'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
            'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
        this.blockNode = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
            'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
            'object', 'ol', 'pre', 'td', 'tr', 'th', 'tbody', 'tfoot', 'thead', 'table', 'ul',
            'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
        this.isNotFromHtml = false;
        this.containsHtml = false;
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.i10n = serviceLocator.getService('rteLocale');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
        this.addEventListener();
    }
    PasteCleanup.prototype.addEventListener = function () {
        this.nodeSelectionObj = new NodeSelection();
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.pasteClean, this.pasteClean, this);
        this.parent.on(events.destroy, this.destroy, this);
    };
    PasteCleanup.prototype.destroy = function () {
        this.removeEventListener();
    };
    PasteCleanup.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.pasteClean, this.pasteClean);
        this.parent.off(events.destroy, this.destroy);
    };
    PasteCleanup.prototype.pasteClean = function (e) {
        var _this = this;
        var args = {
            requestType: 'Paste',
            editorMode: this.parent.editorMode,
            event: e
        };
        var value = null;
        var imageproperties;
        if (e.args && !isNOU(e.args.clipboardData)) {
            value = e.args.clipboardData.getData('text/html');
        }
        if (e.args && value !== null && this.parent.editorMode === 'HTML') {
            if (value.length === 0) {
                var htmlRegex = new RegExp(/<\/[a-z][\s\S]*>/i);
                value = e.args.clipboardData.getData('text/plain');
                this.isNotFromHtml = value !== '' ? true : false;
                value = value.replace(/</g, '&lt;');
                value = value.replace(/>/g, '&gt;');
                this.containsHtml = htmlRegex.test(value);
                var file = e && e.args.clipboardData &&
                    e.args.clipboardData.items.length > 0 ?
                    e.args.clipboardData.items[0].getAsFile() : null;
                this.parent.notify(events.paste, {
                    file: file,
                    args: e.args,
                    text: value,
                    callBack: function (b) {
                        imageproperties = b;
                        if (typeof (imageproperties) === 'object') {
                            _this.parent.formatter.editorManager.execCommand('Images', 'Image', e.args, _this.imageFormatting.bind(_this, args), 'pasteCleanup', imageproperties, 'pasteCleanupModule');
                        }
                        else {
                            value = imageproperties;
                        }
                    }
                });
                if (!htmlRegex.test(value)) {
                    var divElement = this.parent.createElement('div');
                    divElement.innerHTML = this.splitBreakLine(value);
                    value = divElement.innerHTML;
                }
            }
            else if (value.length > 0) {
                this.parent.formatter.editorManager.observer.notify(EVENTS.MS_WORD_CLEANUP, {
                    args: e.args,
                    text: e.text,
                    allowedStylePropertiesArray: this.parent.pasteCleanupSettings.allowedStyleProps,
                    callBack: function (a) {
                        value = a;
                    }
                });
            }
            this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
            var currentDocument = this.contentRenderer.getDocument();
            var range = this.nodeSelectionObj.getRange(currentDocument);
            this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
            if (this.parent.pasteCleanupSettings.prompt) {
                e.args.preventDefault();
                var tempDivElem = this.parent.createElement('div');
                tempDivElem.innerHTML = value;
                if (tempDivElem.textContent !== '' || !isNOU(tempDivElem.querySelector('img')) ||
                    !isNOU(tempDivElem.querySelector('table'))) {
                    this.pasteDialog(value, args);
                }
            }
            else if (this.parent.pasteCleanupSettings.plainText) {
                e.args.preventDefault();
                this.plainFormatting(value, args);
            }
            else if (this.parent.pasteCleanupSettings.keepFormat) {
                e.args.preventDefault();
                this.formatting(value, false, args);
            }
            else {
                e.args.preventDefault();
                this.formatting(value, true, args);
            }
        }
    };
    PasteCleanup.prototype.splitBreakLine = function (value) {
        var enterSplitText = value.split('\n');
        var contentInnerElem = '';
        for (var i = 0; i < enterSplitText.length; i++) {
            if (enterSplitText[i].trim() === '') {
                contentInnerElem += '<p><br></p>';
            }
            else {
                var contentWithSpace = this.makeSpace(enterSplitText[i]);
                contentInnerElem += '<p>' + contentWithSpace.trim() + '</p>';
            }
        }
        return contentInnerElem;
    };
    PasteCleanup.prototype.makeSpace = function (enterSplitText) {
        var contentWithSpace = '';
        var spaceBetweenContent = true;
        var spaceSplit = enterSplitText.split(' ');
        for (var j = 0; j < spaceSplit.length; j++) {
            if (spaceSplit[j].trim() === '') {
                contentWithSpace += spaceBetweenContent ? '&nbsp;' : ' ';
            }
            else {
                spaceBetweenContent = false;
                contentWithSpace += spaceSplit[j] + ' ';
            }
        }
        return contentWithSpace;
    };
    PasteCleanup.prototype.imgUploading = function (elm) {
        var allImgElm = elm.querySelectorAll('.pasteContent_Img');
        if (this.parent.insertImageSettings.saveUrl && allImgElm.length > 0) {
            var base64Src = [];
            var imgName = [];
            var uploadImg = [];
            for (var i = 0; i < allImgElm.length; i++) {
                if (allImgElm[i].getAttribute('src').split(',')[0].indexOf('base64') >= 0) {
                    base64Src.push(allImgElm[i].getAttribute('src'));
                    imgName.push(getUniqueID('rte_image'));
                    uploadImg.push(allImgElm[i]);
                }
            }
            var fileList = [];
            for (var i = 0; i < base64Src.length; i++) {
                fileList.push(this.base64ToFile(base64Src[i], imgName[i]));
            }
            for (var i = 0; i < fileList.length; i++) {
                this.uploadMethod(fileList[i], uploadImg[i]);
            }
            if (isNOU(this.parent.insertImageSettings.path) &&
                this.parent.insertImageSettings.saveFormat === 'Blob') {
                this.getBlob(allImgElm);
            }
        }
        else if (this.parent.insertImageSettings.saveFormat === 'Blob') {
            this.getBlob(allImgElm);
        }
        var allImgElmId = elm.querySelectorAll('.pasteContent_Img');
        for (var i = 0; i < allImgElmId.length; i++) {
            allImgElmId[i].classList.remove('pasteContent_Img');
            if (allImgElmId[i].getAttribute('class').trim() === '') {
                allImgElm[i].removeAttribute('class');
            }
        }
    };
    PasteCleanup.prototype.getBlob = function (allImgElm) {
        for (var i = 0; i < allImgElm.length; i++) {
            if (!isNOU(allImgElm[i].getAttribute('src')) &&
                allImgElm[i].getAttribute('src').split(',')[0].indexOf('base64') >= 0) {
                var blopUrl = URL.createObjectURL(convertToBlob(allImgElm[i].getAttribute('src')));
                allImgElm[i].setAttribute('src', blopUrl);
            }
        }
    };
    PasteCleanup.prototype.uploadMethod = function (fileList, imgElem) {
        var _this = this;
        var uploadEle = document.createElement('div');
        document.body.appendChild(uploadEle);
        uploadEle.setAttribute('display', 'none');
        imgElem.style.opacity = '0.5';
        var popupEle = this.parent.createElement('div');
        this.parent.element.appendChild(popupEle);
        var contentEle = this.parent.createElement('input', {
            id: this.parent.element.id + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        var offsetY = this.parent.iframeSettings.enable ? -50 : -90;
        var popupObj = new Popup(popupEle, {
            relateTo: imgElem,
            height: '85px',
            width: '300px',
            offsetY: offsetY,
            content: contentEle,
            viewPortElement: this.parent.element,
            position: { X: 'center', Y: 'top' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            close: function (event) {
                _this.parent.isBlur = false;
                popupObj.destroy();
                detach(popupObj.element);
            }
        });
        popupObj.element.style.display = 'none';
        addClass([popupObj.element], [classes.CLS_POPUP_OPEN, classes.CLS_RTE_UPLOAD_POPUP]);
        var timeOut = fileList.size > 1000000 ? 300 : 100;
        setTimeout(function () { _this.refreshPopup(imgElem, popupObj); }, timeOut);
        var rawFile;
        var beforeUploadArgs;
        var uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl,
                removeUrl: this.parent.insertImageSettings.removeUrl
            },
            cssClass: classes.CLS_RTE_DIALOG_UPLOAD,
            dropArea: this.parent.inputElement,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            success: function (e) {
                setTimeout(function () { _this.popupClose(popupObj, uploadObj, imgElem, e); }, 900);
            },
            uploading: function (e) {
                if (!_this.parent.isServerRendered) {
                    _this.parent.trigger(events.imageUploading, e);
                    _this.parent.inputElement.contentEditable = 'false';
                }
            },
            beforeUpload: function (args) {
                if (_this.parent.isServerRendered) {
                    beforeUploadArgs = JSON.parse(JSON.stringify(args));
                    beforeUploadArgs.filesData = rawFile;
                    args.cancel = true;
                    _this.parent.trigger(events.imageUploading, beforeUploadArgs, function (beforeUploadArgs) {
                        if (beforeUploadArgs.cancel) {
                            return;
                        }
                        /* tslint:disable */
                        uploadObj.currentRequestHeader = beforeUploadArgs.currentRequest ?
                            beforeUploadArgs.currentRequest : uploadObj.currentRequestHeader;
                        uploadObj.customFormDatas = beforeUploadArgs.customFormData && beforeUploadArgs.customFormData.length > 0 ?
                            beforeUploadArgs.customFormData : uploadObj.customFormDatas;
                        uploadObj.uploadFiles(rawFile, null);
                        /* tslint:enable */
                    });
                }
                else {
                    _this.parent.trigger(events.beforeImageUpload, args);
                }
            },
            failure: function (e) {
                setTimeout(function () { _this.uploadFailure(imgElem, uploadObj, popupObj, e); }, 900);
            },
            canceling: function () {
                _this.parent.inputElement.contentEditable = 'true';
                if (imgElem.nextSibling.textContent === ' ') {
                    detach(imgElem.nextSibling);
                }
                detach(imgElem);
                popupObj.close();
            },
            selected: function (e) {
                e.cancel = true;
                if (_this.parent.isServerRendered) {
                    rawFile = e.filesData;
                }
            },
            removing: function () {
                _this.parent.inputElement.contentEditable = 'true';
                if (imgElem.nextSibling.textContent === ' ') {
                    detach(imgElem.nextSibling);
                }
                detach(imgElem);
                popupObj.close();
            }
        });
        uploadObj.appendTo(popupObj.element.childNodes[0]);
        /* tslint:disable */
        var fileData = [{
                name: fileList.name,
                rawFile: fileList,
                size: fileList.size,
                type: fileList.type,
                validationMessages: { minSize: "", maxSize: "" },
                statusCode: '1'
            }];
        uploadObj.createFileList(fileData);
        uploadObj.filesData.push(fileData[0]);
        /* tslint:enable */
        rawFile = fileData;
        uploadObj.upload(fileData);
        popupObj.element.getElementsByClassName('e-file-select-wrap')[0].style.display = 'none';
        detach(popupObj.element.querySelector('.e-rte-dialog-upload .e-file-select-wrap'));
    };
    PasteCleanup.prototype.uploadFailure = function (imgElem, uploadObj, popupObj, e) {
        this.parent.inputElement.contentEditable = 'true';
        detach(imgElem);
        if (popupObj) {
            popupObj.close();
        }
        this.parent.trigger(events.imageUploadFailed, e);
        uploadObj.destroy();
    };
    PasteCleanup.prototype.popupClose = function (popupObj, uploadObj, imgElem, e) {
        var _this = this;
        this.parent.inputElement.contentEditable = 'true';
        e.element = imgElem;
        this.parent.trigger(events.imageUploadSuccess, e, function (e) {
            if (!isNullOrUndefined(_this.parent.insertImageSettings.path)) {
                var url = _this.parent.insertImageSettings.path + e.file.name;
                imgElem.src = url;
                imgElem.setAttribute('alt', e.file.name);
            }
        });
        popupObj.close();
        imgElem.style.opacity = '1';
        uploadObj.destroy();
    };
    PasteCleanup.prototype.refreshPopup = function (imageElement, popupObj) {
        var imgPosition = this.parent.iframeSettings.enable ? this.parent.element.offsetTop +
            imageElement.offsetTop : imageElement.offsetTop;
        var rtePosition = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (imgPosition > rtePosition) {
            popupObj.relateTo = this.parent.inputElement;
            popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
            popupObj.element.style.display = 'block';
        }
        else {
            if (popupObj) {
                popupObj.refreshPosition(imageElement);
                popupObj.element.style.display = 'block';
            }
        }
    };
    PasteCleanup.prototype.base64ToFile = function (base64, filename) {
        var baseStr = base64.split(',');
        var typeStr = baseStr[0].match(/:(.*?);/)[1];
        var extension = typeStr.split('/')[1];
        var decodeStr = atob(baseStr[1]);
        var strLen = decodeStr.length;
        var decodeArr = new Uint8Array(strLen);
        while (strLen--) {
            decodeArr[strLen] = decodeStr.charCodeAt(strLen);
        }
        if (Browser.isIE || navigator.appVersion.indexOf('Edge') > -1) {
            var blob = new Blob([decodeArr], { type: extension });
            extend(blob, { name: filename + '.' + (!isNOU(extension) ? extension : '') });
            return blob;
        }
        else {
            return new File([decodeArr], filename + '.' + (!isNOU(extension) ? extension : ''), { type: extension });
        }
    };
    /**
     * Method for image formatting when pasting
     * @hidden
     * @deprecated
     */
    PasteCleanup.prototype.imageFormatting = function (pasteArgs, imgElement) {
        var imageElement = this.parent.createElement('span');
        imageElement.appendChild(imgElement.elements[0]);
        var imageValue = imageElement.innerHTML;
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        var currentDocument = this.contentRenderer.getDocument();
        var range = this.nodeSelectionObj.getRange(currentDocument);
        this.saveSelection = this.nodeSelectionObj.save(range, currentDocument);
        if (this.parent.pasteCleanupSettings.prompt) {
            this.pasteDialog(imageValue, pasteArgs);
        }
        else if (this.parent.pasteCleanupSettings.plainText) {
            this.plainFormatting(imageValue, pasteArgs);
        }
        else if (this.parent.pasteCleanupSettings.keepFormat) {
            this.formatting(imageValue, false, pasteArgs);
        }
        else {
            this.formatting(imageValue, true, pasteArgs);
        }
    };
    PasteCleanup.prototype.radioRender = function () {
        var keepRadioButton = new RadioButton({ label: this.i10n.getConstant('keepFormat'), name: 'pasteOption', checked: true });
        keepRadioButton.isStringTemplate = true;
        var keepFormatElement = this.parent.element.querySelector('#keepFormating');
        keepRadioButton.appendTo(keepFormatElement);
        var cleanRadioButton = new RadioButton({ label: this.i10n.getConstant('cleanFormat'), name: 'pasteOption' });
        cleanRadioButton.isStringTemplate = true;
        var cleanFormatElement = this.parent.element.querySelector('#cleanFormat');
        cleanRadioButton.appendTo(cleanFormatElement);
        var plainTextRadioButton = new RadioButton({ label: this.i10n.getConstant('plainText'), name: 'pasteOption' });
        plainTextRadioButton.isStringTemplate = true;
        var plainTextElement = this.parent.element.querySelector('#plainTextFormat');
        plainTextRadioButton.appendTo(plainTextElement);
    };
    PasteCleanup.prototype.selectFormatting = function (value, args, keepChecked, cleanChecked) {
        if (keepChecked) {
            this.formatting(value, false, args);
        }
        else if (cleanChecked) {
            this.formatting(value, true, args);
        }
        else {
            this.plainFormatting(value, args);
        }
    };
    PasteCleanup.prototype.pasteDialog = function (value, args) {
        var _this = this;
        var isHeight = false;
        var preRTEHeight = this.parent.height;
        var dialogModel = {
            buttons: [
                {
                    click: function () {
                        if (!dialog.isDestroyed) {
                            var keepChecked = _this.parent.element.querySelector('#keepFormating').checked;
                            var cleanChecked = _this.parent.element.querySelector('#cleanFormat').checked;
                            dialog.hide();
                            _this.parent.height = isHeight ? preRTEHeight : _this.parent.height;
                            isHeight = false;
                            var argument = isBlazor() ? null : dialog;
                            _this.dialogRenderObj.close(argument);
                            dialog.destroy();
                            _this.selectFormatting(value, args, keepChecked, cleanChecked);
                        }
                    },
                    buttonModel: {
                        isPrimary: true,
                        cssClass: 'e-flat ' + CLS_RTE_PASTE_OK,
                        content: this.i10n.getConstant('pasteDialogOk')
                    }
                },
                {
                    click: function () {
                        if (!dialog.isDestroyed) {
                            dialog.hide();
                            _this.parent.height = isHeight ? preRTEHeight : _this.parent.height;
                            isHeight = false;
                            var args_1 = isBlazor() ? null : dialog;
                            _this.dialogRenderObj.close(args_1);
                            dialog.destroy();
                        }
                    },
                    buttonModel: {
                        cssClass: 'e-flat ' + CLS_RTE_PASTE_CANCEL,
                        content: this.i10n.getConstant('pasteDialogCancel')
                    }
                }
            ],
            header: this.i10n.getConstant('pasteFormat'),
            content: this.i10n.getConstant('pasteFormatContent') + '<br/><div><div style="padding-top:24px;">' +
                '<input type="radio" class="' + CLS_RTE_PASTE_KEEP_FORMAT + '" id="keepFormating"/>' +
                '</div><div style="padding-top:20px;"><input type="radio" class="' + CLS_RTE_PASTE_REMOVE_FORMAT + '" id="cleanFormat"/></div>' +
                '<div style="padding-top:20px;"><input type="radio" class="' + CLS_RTE_PASTE_PLAIN_FORMAT + '" id="plainTextFormat"/></div></div>',
            target: this.parent.element,
            width: '300px',
            height: '265px',
            cssClass: CLS_RTE_DIALOG_MIN_HEIGHT,
            isModal: true,
            visible: false
        };
        var dialog = this.dialogRenderObj.render(dialogModel);
        var rteDialogWrapper = this.parent.element.querySelector('#' + this.parent.getID()
            + '_pasteCleanupDialog');
        if (rteDialogWrapper !== null && rteDialogWrapper.innerHTML !== '') {
            this.destroyDialog(rteDialogWrapper);
        }
        if (rteDialogWrapper === null) {
            rteDialogWrapper = this.parent.createElement('div', {
                id: this.parent.getID() + '_pasteCleanupDialog'
            });
            this.parent.element.appendChild(rteDialogWrapper);
        }
        dialog.appendTo(rteDialogWrapper);
        this.radioRender();
        if (this.parent.element.offsetHeight < parseInt(dialog.height.split('px')[0], null)) {
            this.parent.height = parseInt(dialog.height.split('px')[0], null) + 40;
            isHeight = true;
        }
        dialog.show();
    };
    PasteCleanup.prototype.destroyDialog = function (rteDialogWrapper) {
        var rteDialogContainer = this.parent.element.querySelector('.e-dlg-container');
        detach(rteDialogContainer);
        var rteDialogWrapperChildLength = rteDialogWrapper.children.length;
        for (var i = 0; i < rteDialogWrapperChildLength; i++) {
            detach(rteDialogWrapper.children[0]);
        }
    };
    PasteCleanup.prototype.formatting = function (value, clean, args) {
        var _this = this;
        var clipBoardElem = this.parent.createElement('div', { className: 'pasteContent', styles: 'display:inline;' });
        if (this.isNotFromHtml && this.containsHtml) {
            value = this.splitBreakLine(value);
        }
        clipBoardElem.innerHTML = value;
        if (this.parent.pasteCleanupSettings.deniedTags !== null) {
            clipBoardElem = this.deniedTags(clipBoardElem);
        }
        if (clean) {
            clipBoardElem = this.deniedAttributes(clipBoardElem, clean);
        }
        else if (this.parent.pasteCleanupSettings.deniedAttrs !== null) {
            clipBoardElem = this.deniedAttributes(clipBoardElem, clean);
        }
        if (this.parent.pasteCleanupSettings.allowedStyleProps !== null) {
            clipBoardElem = this.allowedStyle(clipBoardElem);
        }
        this.saveSelection.restore();
        clipBoardElem.innerHTML = this.sanitizeHelper(clipBoardElem.innerHTML);
        var allImg = clipBoardElem.querySelectorAll('img');
        for (var i = 0; i < allImg.length; i++) {
            allImg[i].classList.add('pasteContent_Img');
        }
        this.addTempClass(clipBoardElem);
        if (clipBoardElem.textContent !== '' || !isNOU(clipBoardElem.querySelector('img')) ||
            !isNOU(clipBoardElem.querySelector('table'))) {
            this.parent.formatter.editorManager.execCommand('inserthtml', 'pasteCleanup', args, function (returnArgs) {
                extend(args, { elements: returnArgs.elements, imageElements: returnArgs.imgElem }, true);
                _this.parent.formatter.onSuccess(_this.parent, args);
            }, clipBoardElem);
            this.removeTempClass();
            this.parent.notify(events.toolbarRefresh, {});
            this.imgUploading(this.parent.inputElement);
            if (this.parent.iframeSettings.enable) {
                this.parent.updateValue();
            }
        }
    };
    PasteCleanup.prototype.addTempClass = function (clipBoardElem) {
        var allChild = clipBoardElem.children;
        for (var i = 0; i < allChild.length; i++) {
            allChild[i].classList.add('pasteContent_RTE');
        }
    };
    PasteCleanup.prototype.removeTempClass = function () {
        var classElm = this.parent.inputElement.querySelectorAll('.pasteContent_RTE');
        for (var i = 0; i < classElm.length; i++) {
            classElm[i].classList.remove('pasteContent_RTE');
            if (classElm[i].getAttribute('class') === '') {
                classElm[i].removeAttribute('class');
            }
        }
    };
    PasteCleanup.prototype.sanitizeHelper = function (value) {
        value = sanitizeHelper(value, this.parent);
        return value;
    };
    //Plain Formatting
    PasteCleanup.prototype.plainFormatting = function (value, args) {
        var _this = this;
        var clipBoardElem = this.parent.createElement('div', { className: 'pasteContent', styles: 'display:inline;' });
        clipBoardElem.innerHTML = value;
        this.detachInlineElements(clipBoardElem);
        this.getTextContent(clipBoardElem);
        if (clipBoardElem.textContent.trim() !== '') {
            if (!isNOU(clipBoardElem.firstElementChild) && clipBoardElem.firstElementChild.tagName !== 'BR') {
                var firstElm = clipBoardElem.firstElementChild;
                if (!isNOU(clipBoardElem.firstElementChild)) {
                    var spanElm = this.parent.createElement('span');
                    for (var i = 0, j = 0; i < firstElm.childNodes.length; i++, j++) {
                        if (firstElm.childNodes[i].nodeName === '#text') {
                            spanElm.appendChild(firstElm.childNodes[i]);
                            clipBoardElem.insertBefore(spanElm, clipBoardElem.firstElementChild);
                            i--;
                        }
                        else if (firstElm.childNodes[i].nodeName !== '#text' && j === 0) {
                            for (var k = 0; k < firstElm.childNodes[i].childNodes.length; k++) {
                                spanElm.appendChild(firstElm.childNodes[i].childNodes[k]);
                                clipBoardElem.insertBefore(spanElm, clipBoardElem.firstElementChild);
                                k--;
                            }
                            i--;
                        }
                        else {
                            break;
                        }
                    }
                    if (!firstElm.hasChildNodes()) {
                        detach(firstElm);
                    }
                }
            }
            this.removeEmptyElements(clipBoardElem);
            this.saveSelection.restore();
            clipBoardElem.innerHTML = this.sanitizeHelper(clipBoardElem.innerHTML);
            this.addTempClass(clipBoardElem);
            this.parent.formatter.editorManager.execCommand('inserthtml', 'pasteCleanup', args, function (returnArgs) {
                extend(args, { elements: returnArgs.elements, imageElements: returnArgs.imgElem }, true);
                _this.parent.formatter.onSuccess(_this.parent, args);
            }, clipBoardElem);
            this.removeTempClass();
        }
        else {
            this.saveSelection.restore();
            extend(args, { elements: [] }, true);
            this.parent.formatter.onSuccess(this.parent, args);
        }
    };
    PasteCleanup.prototype.getTextContent = function (clipBoardElem) {
        for (var i = 0; i < this.blockNode.length; i++) {
            var inElem = clipBoardElem.querySelectorAll(this.blockNode[i]);
            for (var j = 0; j < inElem.length; j++) {
                var parElem = void 0;
                for (var k = 0, l = 0, preNode = void 0; k < inElem[j].childNodes.length; k++, l++) {
                    if (inElem[j].childNodes[k].nodeName === 'DIV' || inElem[j].childNodes[k].nodeName === 'P' ||
                        (inElem[j].childNodes[k].nodeName === '#text' &&
                            (inElem[j].childNodes[k].nodeValue.replace(/\u00a0/g, '&nbsp;') !== '&nbsp;') &&
                            inElem[j].childNodes[k].textContent.trim() === '')) {
                        parElem = inElem[j].childNodes[k].parentElement;
                        inElem[j].childNodes[k].parentElement.parentElement.insertBefore(inElem[j].childNodes[k], inElem[j].childNodes[k].parentElement);
                        k--;
                    }
                    else {
                        parElem = inElem[j].childNodes[k].parentElement;
                        if (preNode === 'text') {
                            var previousElem = parElem.previousElementSibling;
                            previousElem.appendChild(inElem[j].childNodes[k]);
                        }
                        else {
                            var divElement = this.parent.createElement('div', { id: 'newDiv' });
                            divElement.appendChild(inElem[j].childNodes[k]);
                            parElem.parentElement.insertBefore(divElement, parElem);
                        }
                        k--;
                        preNode = 'text';
                    }
                }
                if (!isNOU(parElem)) {
                    detach(parElem);
                }
            }
        }
        var allElems = clipBoardElem.querySelectorAll('*');
        for (var i = 0; i < allElems.length; i++) {
            var allAtr = allElems[i].attributes;
            for (var j = 0; j < allAtr.length; j++) {
                allElems[i].removeAttribute(allAtr[j].name);
                j--;
            }
        }
    };
    PasteCleanup.prototype.detachInlineElements = function (clipBoardElem) {
        for (var i = 0; i < this.inlineNode.length; i++) {
            var inElem = clipBoardElem.querySelectorAll(this.inlineNode[i]);
            for (var j = 0; j < inElem.length; j++) {
                var parElem = void 0;
                for (var k = 0; k < inElem[j].childNodes.length; k++) {
                    parElem = inElem[j].childNodes[k].parentElement;
                    inElem[j].childNodes[k].parentElement.parentElement.insertBefore(inElem[j].childNodes[k], inElem[j].childNodes[k].parentElement);
                    k--;
                }
                if (!isNOU(parElem)) {
                    detach(parElem);
                }
            }
        }
    };
    PasteCleanup.prototype.findDetachEmptyElem = function (element) {
        var removableElement;
        if (!isNOU(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' &&
                element.parentElement.getAttribute('class') !== 'pasteContent') {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            }
            else {
                removableElement = element;
            }
        }
        else {
            removableElement = null;
        }
        return removableElement;
    };
    PasteCleanup.prototype.removeEmptyElements = function (element) {
        var emptyElements = element.querySelectorAll(':empty');
        for (var i = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'BR') {
                var detachableElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    };
    //GroupingTags
    PasteCleanup.prototype.tagGrouping = function (deniedTags) {
        var groupingTags = deniedTags.slice();
        var keys = Object.keys(pasteCleanupGroupingTags);
        var values = keys.map(function (key) { return pasteCleanupGroupingTags[key]; });
        var addTags = [];
        for (var i = 0; i < groupingTags.length; i++) {
            //The value split using '[' because to reterive the tag name from the user given format which may contain tag with attributes
            if (groupingTags[i].split('[').length > 1) {
                groupingTags[i] = groupingTags[i].split('[')[0].trim();
            }
            if (keys.indexOf(groupingTags[i]) > -1) {
                for (var j = 0; j < values[keys.indexOf(groupingTags[i])].length; j++) {
                    if (groupingTags.indexOf(values[keys.indexOf(groupingTags[i])][j]) < 0 &&
                        addTags.indexOf(values[keys.indexOf(groupingTags[i])][j]) < 0) {
                        addTags.push(values[keys.indexOf(groupingTags[i])][j]);
                    }
                }
            }
        }
        return deniedTags = deniedTags.concat(addTags);
    };
    //Filter Attributes in Denied Tags
    PasteCleanup.prototype.attributesfilter = function (deniedTags) {
        for (var i = 0; i < deniedTags.length; i++) {
            if (deniedTags[i].split('[').length > 1) {
                var userAttributes = deniedTags[i].split('[')[1].split(']')[0].split(',');
                var allowedAttributeArray = [];
                var deniedAttributeArray = [];
                for (var j = 0; j < userAttributes.length; j++) {
                    userAttributes[j].indexOf('!') < 0 ? allowedAttributeArray.push(userAttributes[j].trim())
                        : deniedAttributeArray.push(userAttributes[j].split('!')[1].trim());
                }
                var allowedAttribute = allowedAttributeArray.length > 1 ?
                    (allowedAttributeArray.join('][')) : (allowedAttributeArray.join());
                var deniedAttribute = deniedAttributeArray.length > 1 ? deniedAttributeArray.join('][') : (deniedAttributeArray.join());
                if (deniedAttribute.length > 0) {
                    var select = allowedAttribute !== '' ? deniedTags[i].split('[')[0] +
                        '[' + allowedAttribute + ']' : deniedTags[i].split('[')[0];
                    deniedTags[i] = select + ':not([' + deniedAttribute + '])';
                }
                else {
                    deniedTags[i] = deniedTags[i].split('[')[0] + '[' + allowedAttribute + ']';
                }
            }
        }
        return deniedTags;
    };
    //Denied Tags
    PasteCleanup.prototype.deniedTags = function (clipBoardElem) {
        var deniedTags = isNullOrUndefined(this.parent.pasteCleanupSettings.deniedTags) ? [] : this.parent.pasteCleanupSettings.deniedTags.slice();
        deniedTags = this.attributesfilter(deniedTags);
        deniedTags = this.tagGrouping(deniedTags);
        for (var i = 0; i < deniedTags.length; i++) {
            var removableElement = clipBoardElem.querySelectorAll(deniedTags[i]);
            for (var j = removableElement.length - 1; j >= 0; j--) {
                var parentElem = removableElement[j].parentNode;
                while (removableElement[j].firstChild) {
                    parentElem.insertBefore(removableElement[j].firstChild, removableElement[j]);
                }
                parentElem.removeChild(removableElement[j]);
            }
        }
        return clipBoardElem;
    };
    //Denied Attributes
    PasteCleanup.prototype.deniedAttributes = function (clipBoardElem, clean) {
        var deniedAttrs = isNullOrUndefined(this.parent.pasteCleanupSettings.deniedAttrs) ? [] : this.parent.pasteCleanupSettings.deniedAttrs.slice();
        if (clean) {
            deniedAttrs.push('style');
        }
        for (var i = 0; i < deniedAttrs.length; i++) {
            var removableAttrElement = clipBoardElem.
                querySelectorAll('[' + deniedAttrs[i] + ']');
            for (var j = 0; j < removableAttrElement.length; j++) {
                removableAttrElement[j].removeAttribute(deniedAttrs[i]);
            }
        }
        return clipBoardElem;
    };
    //Allowed Style Properties
    PasteCleanup.prototype.allowedStyle = function (clipBoardElem) {
        var allowedStyleProps = isNullOrUndefined(this.parent.pasteCleanupSettings.allowedStyleProps) ? [] : this.parent.pasteCleanupSettings.allowedStyleProps.slice();
        allowedStyleProps.push('list-style-type', 'list-style');
        var styleElement = clipBoardElem.querySelectorAll('[style]');
        for (var i = 0; i < styleElement.length; i++) {
            var allowedStyleValue = '';
            var allowedStyleValueArray = [];
            var styleValue = styleElement[i].getAttribute('style').split(';');
            for (var k = 0; k < styleValue.length; k++) {
                if (allowedStyleProps.indexOf(styleValue[k].split(':')[0].trim()) >= 0) {
                    allowedStyleValueArray.push(styleValue[k]);
                }
            }
            styleElement[i].removeAttribute('style');
            allowedStyleValue = allowedStyleValueArray.join(';').trim() === '' ?
                allowedStyleValueArray.join(';') : allowedStyleValueArray.join(';') + ';';
            if (allowedStyleValue) {
                styleElement[i].setAttribute('style', allowedStyleValue);
            }
        }
        return clipBoardElem;
    };
    /**
     * For internal use only - Get the module name.
     */
    PasteCleanup.prototype.getModuleName = function () {
        return 'pasteCleanup';
    };
    return PasteCleanup;
}());
export { PasteCleanup };
