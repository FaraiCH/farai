import { createElement, isNullOrUndefined, Browser, isBlazor } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
/**
 * TextLayer module is used to handle the text content on the control.
 * @hidden
 */
var TextLayer = /** @class */ (function () {
    /**
     * @private
     */
    function TextLayer(pdfViewer, pdfViewerBase) {
        var _this = this;
        // tslint:disable-next-line
        this.textBoundsArray = [];
        /**
         * @private
         */
        // tslint:disable-next-line
        this.characterBound = [];
        this.closeNotification = function () {
            _this.notifyDialog.hide();
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    TextLayer.prototype.addTextLayer = function (pageNumber, pageWidth, pageHeight, pageDiv) {
        var textDiv = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        var textLayer;
        if (!textDiv) {
            textLayer = createElement('div', { id: this.pdfViewer.element.id + '_textLayer_' + pageNumber, className: 'e-pv-text-layer' });
            textLayer.style.width = pageWidth + 'px';
            textLayer.style.height = pageHeight + 'px';
            pageDiv.appendChild(textLayer);
        }
        this.pdfViewerBase.applyElementStyles(textLayer, pageNumber);
        return textLayer;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextLayer.prototype.renderTextContents = function (pageNumber, textContents, textBounds, rotation) {
        var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        var canvasElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
        if (canvasElement && textLayer.childNodes.length === 0) {
            for (var i = 0; i < textContents.length; i++) {
                // tslint:disable-next-line
                var bounds = textBounds[i];
                // tslint:disable-next-line:max-line-length
                var textDiv = createElement('div', { id: this.pdfViewer.element.id + '_text_' + pageNumber + '_' + i, className: 'e-pv-text', attrs: { 'tabindex': '0' } });
                var textContent = textContents[i];
                textDiv.textContent = textContent.replace(/&nbsp;/g, ' ');
                // tslint:disable-next-line
                var newLine = textContents[i].replace(/  +/g, ' ');
                if (newLine !== ' ') {
                    textDiv.style.whiteSpace = 'pre';
                }
                if (bounds) {
                    this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height);
                }
                this.setTextElementProperties(textDiv);
                var context = canvasElement.getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                var contextWidth = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                if (bounds) {
                    var scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                    this.applyTextRotation(scale, textDiv, rotation, bounds.Rotation);
                }
                textLayer.appendChild(textDiv);
                this.resizeExcessDiv(textLayer, textDiv);
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.pdfViewerBase.isTextSelectionDisabled && textDiv.className !== 'e-pdfviewer-formFields'
                    && textDiv.className !== 'e-pdfviewer-signatureformFields' && textDiv.className !== 'e-pdfviewer-signatureformFields signature') {
                    textDiv.classList.add('e-pv-cursor');
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextLayer.prototype.resizeTextContents = function (pageNumber, textContents, textBounds, rotation, isTextSearch) {
        var textLayer = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
        var canvasElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
        if (canvasElement) {
            for (var i = 0; i < textLayer.childNodes.length; i++) {
                // tslint:disable-next-line
                var bounds = void 0;
                var textDiv = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + i);
                if (isNullOrUndefined(textDiv)) {
                    break;
                }
                if (textBounds) {
                    bounds = textBounds[i];
                    if (bounds) {
                        this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height);
                    }
                }
                this.setTextElementProperties(textDiv);
                var context = canvasElement.getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                var contextWidth = void 0;
                if (textContents) {
                    var textContent = textContents[i];
                    if (textContent) {
                        contextWidth = context.measureText(textContent.replace(/(\r\n|\n|\r)/gm, '')).width;
                    }
                }
                else {
                    contextWidth = context.measureText(textDiv.textContent.replace(/(\r\n|\n|\r)/gm, '')).width;
                }
                if (bounds) {
                    var scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                    this.applyTextRotation(scale, textDiv, rotation, bounds.Rotation);
                }
                this.resizeExcessDiv(textLayer, textDiv);
            }
        }
        else {
            textLayer.parentElement.removeChild(textLayer);
        }
        if (this.pdfViewer.textSearch) {
            if (!isTextSearch) {
                this.pdfViewer.textSearch.resizeSearchElements(pageNumber);
            }
        }
    };
    TextLayer.prototype.applyTextRotation = function (scale, textDiv, rotation, textRotation) {
        var scaleString = 'scaleX(' + scale + ')';
        if (rotation === 0) {
            if (textRotation === 0) {
                textDiv.style.transform = scaleString;
            }
            else {
                textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
            }
        }
        else if (rotation === 1) {
            if (textRotation === 0) {
                textDiv.style.transform = 'rotate(90deg) ' + scaleString;
            }
            else if (textRotation === -90) {
                textDiv.style.transform = scaleString;
            }
            else {
                textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
            }
        }
        else if (rotation === 2) {
            if (textRotation === 0) {
                textDiv.style.transform = 'rotate(180deg) ' + scaleString;
            }
            else if (textRotation === 180) {
                textDiv.style.transform = scaleString;
            }
            else {
                textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
            }
        }
        else if (rotation === 3) {
            if (textRotation === 0) {
                textDiv.style.transform = 'rotate(-90deg) ' + scaleString;
            }
            else if (textRotation === 90) {
                textDiv.style.transform = scaleString;
            }
            else {
                textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
            }
        }
    };
    TextLayer.prototype.setTextElementProperties = function (textDiv) {
        textDiv.style.fontFamily = 'serif';
        textDiv.style.transformOrigin = '0%';
    };
    /**
     * @private
     */
    TextLayer.prototype.resizeTextContentsOnZoom = function (pageNumber) {
        // tslint:disable-next-line:max-line-length
        var renderObject = window.sessionStorage.getItem(this.pdfViewerBase.getDocumentId() + '_' + pageNumber + '_' + this.getPreviousZoomFactor());
        // tslint:disable-next-line
        var textBounds = [];
        var textContents = [];
        // tslint:disable-next-line
        var rotation;
        if (renderObject) {
            // tslint:disable-next-line
            var data = JSON.parse(renderObject);
            // tslint:disable-next-line
            textBounds = data['textBounds'];
            // tslint:disable-next-line
            textContents = data['textContent'];
            // tslint:disable-next-line
            rotation = data['rotation'];
        }
        if (textBounds.length !== 0) {
            this.textBoundsArray.push({ pageNumber: pageNumber, textBounds: textBounds });
            this.resizeTextContents(pageNumber, textContents, textBounds, rotation);
        }
        else {
            // tslint:disable-next-line
            var textElements = this.textBoundsArray.filter(function (obj) {
                return obj.pageNumber === pageNumber;
            });
            if (textElements) {
                if (textElements.length !== 0) {
                    // tslint:disable-next-line
                    textBounds = textElements[0]['textBounds'];
                    this.resizeTextContents(pageNumber, null, textBounds, rotation);
                }
            }
        }
    };
    TextLayer.prototype.resizeExcessDiv = function (textLayer, textDiv) {
        var textLayerPosition = textLayer.getBoundingClientRect();
        var textDivPosition = textDiv.getBoundingClientRect();
        // tslint:disable-next-line:max-line-length
        if ((textDivPosition.width + textDivPosition.left) >= (textLayerPosition.width + textLayerPosition.left) || (textDivPosition.width > textLayerPosition.width)) {
            // 'auto' width is set to reset the size of the div to its contents.
            textDiv.style.width = 'auto';
            // Client width gets reset by 'auto' width property which has the width of the content.
            textDiv.style.width = textDiv.clientWidth + 'px';
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.clearTextLayers = function () {
        var lowerPageValue = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        var higherPageValue = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        var textLayers = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
        for (var i = 0; i < textLayers.length; i++) {
            textLayers[i].style.display = 'block';
            if (this.pdfViewerBase.getMagnified() && (this.getTextSelectionStatus() || this.getTextSearchStatus())) {
                // tslint:disable-next-line:radix
                var pageNumber = parseInt(textLayers[i].id.split('_textLayer_')[1]);
                if (!(((lowerPageValue + 1) <= pageNumber) && (pageNumber <= (higherPageValue - 1)))) {
                    this.removeElement(textLayers[i]);
                }
            }
            else if (this.pdfViewerBase.getPinchZoomed()) {
                this.removeElement(textLayers[i]);
            }
            else {
                this.removeElement(textLayers[i]);
            }
        }
    };
    TextLayer.prototype.removeElement = function (element) {
        if (Browser.isIE) {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
            else if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
        else {
            element.remove();
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    TextLayer.prototype.convertToSpan = function (pageNumber, divId, fromOffset, toOffset, textString, className) {
        var textDiv = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + divId);
        var textContent = textString.substring(fromOffset, toOffset);
        var node = document.createTextNode(textContent);
        if (className) {
            var spanElement = createElement('span');
            spanElement.className = className + ' e-pv-text';
            spanElement.appendChild(node);
            textDiv.appendChild(spanElement);
        }
        else {
            textDiv.appendChild(node);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    TextLayer.prototype.applySpanForSelection = function (startPage, endPage, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset) {
        if (this.pdfViewer.textSelectionModule) {
            for (var i = startPage; i <= endPage; i++) {
                var startId = void 0;
                var endId = void 0;
                // tslint:disable-next-line
                var textDivs = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
                if (i === startPage) {
                    startId = anchorOffsetDiv;
                    endId = textDivs.length - 1;
                }
                else if (i === endPage) {
                    startId = 0;
                    endId = focusOffsetDiv;
                }
                else {
                    startId = 0;
                    endId = textDivs.length - 1;
                }
                if (startPage === endPage) {
                    startId = anchorOffsetDiv;
                    endId = focusOffsetDiv;
                }
                for (var j = startId; j <= endId; j++) {
                    var textDiv = this.pdfViewerBase.getElement('_text_' + i + '_' + j);
                    var initId = void 0;
                    var lastId = void 0;
                    var length_1 = void 0;
                    if (textDiv && textDiv.textContent) {
                        length_1 = textDiv.textContent.length;
                        var textContent = textDiv.textContent;
                        textDiv.textContent = '';
                        if (j === startId) {
                            if (i === startPage) {
                                initId = anchorOffset;
                            }
                            else {
                                initId = 0;
                            }
                            lastId = length_1;
                            this.convertToSpan(i, j, 0, initId, textContent, null);
                        }
                        else if (j === endId && i === endPage) {
                            initId = 0;
                            lastId = focusOffset;
                        }
                        else {
                            initId = 0;
                            lastId = length_1;
                        }
                        if (startId === endId && startPage === endPage) {
                            initId = anchorOffset;
                            lastId = focusOffset;
                        }
                        this.convertToSpan(i, j, initId, lastId, textContent, 'e-pv-maintaincontent');
                        if (j === endId && i === endPage) {
                            this.convertToSpan(i, j, lastId, textContent.length, textContent, null);
                        }
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.clearDivSelection = function () {
        var textLayers = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
        for (var i = 0; i < textLayers.length; i++) {
            var childNodes = textLayers[i].childNodes;
            for (var j = 0; j < childNodes.length; j++) {
                var textDiv = childNodes[j];
                // tslint:disable-next-line:max-line-length
                if (textDiv.className !== 'e-pdfviewer-formFields' && textDiv.className !== 'e-pdfviewer-signatureformFields' && textDiv.className !== 'e-pdfviewer-signatureformFields signature') {
                    var textContent = textDiv.textContent;
                    // tslint:disable-next-line:max-line-length
                    if (textDiv.childNodes.length > 1 || textDiv.childNodes.length === 1 && (textDiv.childNodes[0].tagName === 'SPAN')) {
                        textDiv.textContent = '';
                        textDiv.textContent = textContent;
                    }
                }
            }
        }
    };
    // tslint:disable-next-line
    TextLayer.prototype.setStyleToTextDiv = function (textDiv, left, top, bottom, width, height) {
        textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
        var textHeight = height * this.pdfViewerBase.getZoomFactor();
        textDiv.style.height = textHeight + 'px';
        textDiv.style.fontSize = height * this.pdfViewerBase.getZoomFactor() + 'px';
    };
    TextLayer.prototype.getTextSelectionStatus = function () {
        if (this.pdfViewer.textSelectionModule) {
            return this.pdfViewer.textSelectionModule.isTextSelection;
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.modifyTextCursor = function (isAdd) {
        var textLayerList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
        for (var i = 0; i < textLayerList.length; i++) {
            var childNodes = textLayerList[i].childNodes;
            for (var j = 0; j < childNodes.length; j++) {
                var textElement = childNodes[j];
                // tslint:disable-next-line:max-line-length
                if (isAdd && textElement.className !== 'e-pdfviewer-formFields' && textElement.className !== 'e-pdfviewer-signatureformFields' && textElement.className !== 'e-pdfviewer-signatureformFields signature') {
                    textElement.classList.add('e-pv-cursor');
                }
                else {
                    textElement.classList.remove('e-pv-cursor');
                }
            }
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.isBackWardSelection = function (selection) {
        var position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
        var backward = false;
        if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
            backward = true;
        }
        return backward;
    };
    /**
     * @private
     */
    TextLayer.prototype.getPageIndex = function (element) {
        var pageId;
        // tslint:disable-next-line
        var parentElement = element.parentElement;
        if (!parentElement) {
            parentElement = element.parentNode;
        }
        if (parentElement.className === 'e-pv-text-layer') {
            // tslint:disable-next-line:radix
            pageId = parseInt(element.id.split('_text_')[1]);
        }
        else {
            // tslint:disable-next-line:radix
            pageId = parseInt(parentElement.id.split('_text_')[1]);
        }
        return pageId;
    };
    /**
     * @private
     */
    TextLayer.prototype.getTextIndex = function (element, pageIndex) {
        var textIndex;
        // tslint:disable-next-line
        var parentElement = element.parentElement;
        if (!parentElement) {
            parentElement = element.parentNode;
        }
        if (parentElement.className === 'e-pv-text-layer') {
            // tslint:disable-next-line:radix
            textIndex = parseInt(element.id.split('_text_' + pageIndex + '_')[1]);
        }
        else {
            // tslint:disable-next-line:radix
            textIndex = parseInt(parentElement.id.split('_text_' + pageIndex + '_')[1]);
        }
        return textIndex;
    };
    TextLayer.prototype.getPreviousZoomFactor = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.previousZoomFactor;
        }
        else {
            return 1;
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.getTextSearchStatus = function () {
        if (this.pdfViewer.textSearchModule) {
            return this.pdfViewer.textSearchModule.isTextSearch;
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.createNotificationPopup = function (text) {
        var _this = this;
        if (!this.isMessageBoxOpen) {
            if (!isBlazor()) {
                // tslint:disable-next-line:max-line-length
                var popupElement_1 = createElement('div', { id: this.pdfViewer.element.id + '_notify', className: 'e-pv-notification-popup' });
                this.pdfViewerBase.viewerContainer.appendChild(popupElement_1);
                this.notifyDialog = new Dialog({
                    showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('PdfViewer'),
                    buttons: [{
                            buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                            click: this.closeNotification.bind(this)
                        }],
                    // tslint:disable-next-line:max-line-length
                    content: '<div class="e-pv-notification-popup-content" tabindex = "0">' + text + '</div>', target: this.pdfViewer.element,
                    beforeClose: function () {
                        _this.notifyDialog.destroy();
                        if (_this.pdfViewer.element) {
                            try {
                                _this.pdfViewer.element.removeChild(popupElement_1);
                            }
                            catch (error) {
                                popupElement_1.parentElement.removeChild(popupElement_1);
                            }
                        }
                        if (_this.pdfViewer.textSearchModule) {
                            _this.pdfViewer.textSearch.isMessagePopupOpened = false;
                        }
                        _this.isMessageBoxOpen = false;
                    }
                });
                if (this.pdfViewer.enableRtl) {
                    this.notifyDialog.enableRtl = true;
                }
                this.notifyDialog.appendTo(popupElement_1);
                this.isMessageBoxOpen = true;
            }
            else {
                // tslint:disable-next-line
                var notificationElement = document.getElementById(this.pdfViewer.element.id + '_notification_popup_content');
                if (notificationElement) {
                    notificationElement.textContent = text;
                    notificationElement.innerHTML = text;
                }
                this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenNotificationPopup');
            }
        }
    };
    return TextLayer;
}());
export { TextLayer };
