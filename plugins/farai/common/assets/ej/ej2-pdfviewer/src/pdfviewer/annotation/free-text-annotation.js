import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * @hidden
 */
var FreeTextAnnotation = /** @class */ (function () {
    function FreeTextAnnotation(pdfviewer, pdfViewerBase) {
        /**
         * @private
         */
        this.inputBoxCount = 0;
        /**
         * @private
         */
        this.isFreeTextValueChange = false;
        /**
         * @private
         */
        this.isInuptBoxInFocus = false;
        /**
         * @private
         */
        // tslint:disable-next-line
        this.freeTextPageNumbers = [];
        /**
         * @private
         */
        this.selectedText = '';
        /**
         * @private
         */
        this.isTextSelected = false;
        this.selectionStart = 0;
        this.selectionEnd = 0;
        /**
         * @private
         */
        this.isBold = false;
        /**
         * @private
         */
        this.isItalic = false;
        /**
         * @private
         */
        this.isUnderline = false;
        /**
         * @private
         */
        this.isStrikethrough = false;
        this.isReadonly = false;
        /**
         * @private
         */
        this.previousText = 'Type Here';
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
        this.updateTextProperties();
        this.inputBoxElement = document.createElement('textarea');
        this.inputBoxElement.style.position = 'absolute';
        this.inputBoxElement.style.Width = this.defautWidth;
        this.inputBoxElement.style.Height = this.defaultHeight;
        this.inputBoxElement.style.zIndex = '5';
        this.inputBoxElement.style.fontSize = this.fontSize + 'px';
        this.inputBoxElement.className = 'free-text-input';
        this.inputBoxElement.style.resize = 'none';
        this.inputBoxElement.style.borderColor = this.borderColor;
        this.inputBoxElement.style.background = this.fillColor;
        this.inputBoxElement.style.borderStyle = this.borderStyle;
        this.inputBoxElement.style.borderWidth = this.borderWidth + 'px';
        this.inputBoxElement.style.padding = '2px';
        this.inputBoxElement.style.borderRadius = '2px';
        this.inputBoxElement.style.fontFamily = this.fontFamily;
        this.inputBoxElement.style.color = this.pdfViewer.freeTextSettings.fontColor ?
            this.pdfViewer.freeTextSettings.fontColor : '#000';
        this.inputBoxElement.style.overflow = 'hidden';
        this.inputBoxElement.style.wordBreak = 'break-all';
        this.inputBoxElement.readOnly = this.isReadonly;
        this.inputBoxElement.addEventListener('focusout', this.onFocusOutInputBox.bind(this));
        this.inputBoxElement.addEventListener('keydown', this.onKeyDownInputBox.bind(this));
        this.inputBoxElement.addEventListener('mouseup', this.onMouseUpInputBox.bind(this));
        this.freeTextPageNumbers = [];
    }
    /**
     * @private
     */
    FreeTextAnnotation.prototype.updateTextProperties = function () {
        this.defautWidth = this.pdfViewer.freeTextSettings.width ? this.pdfViewer.freeTextSettings.width : 151;
        this.defaultHeight = this.pdfViewer.freeTextSettings.height ? this.pdfViewer.freeTextSettings.height : 24.6;
        this.borderColor = this.pdfViewer.freeTextSettings.borderColor ? this.pdfViewer.freeTextSettings.borderColor : '#ffffff00';
        this.fillColor = this.pdfViewer.freeTextSettings.fillColor ? this.pdfViewer.freeTextSettings.fillColor : '#fff';
        this.borderStyle = this.pdfViewer.freeTextSettings.borderStyle ? this.pdfViewer.freeTextSettings.borderStyle : 'solid';
        this.borderWidth = this.pdfViewer.freeTextSettings.borderWidth ? this.pdfViewer.freeTextSettings.borderWidth : 1;
        this.fontSize = this.pdfViewer.freeTextSettings.fontSize ? this.pdfViewer.freeTextSettings.fontSize : 16;
        this.opacity = this.pdfViewer.freeTextSettings.opacity ? this.pdfViewer.freeTextSettings.opacity : 1;
        this.fontColor = this.pdfViewer.freeTextSettings.fontColor ? this.pdfViewer.freeTextSettings.fontColor : '#000';
        // tslint:disable-next-line:max-line-length
        this.author = (this.pdfViewer.freeTextSettings.author !== 'Guest') ? this.pdfViewer.freeTextSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
        this.fontFamily = this.pdfViewer.freeTextSettings.fontFamily ? this.pdfViewer.freeTextSettings.fontFamily : 'Helvetica';
        this.textAlign = this.pdfViewer.freeTextSettings.textAlignment ? this.pdfViewer.freeTextSettings.textAlignment : 'Left';
        this.defaultText = this.pdfViewer.freeTextSettings.defaultText ? this.pdfViewer.freeTextSettings.defaultText : 'Type here';
        // tslint:disable-next-line:max-line-length
        this.isReadonly = this.pdfViewer.freeTextSettings.isLock ? this.pdfViewer.freeTextSettings.isLock : this.pdfViewer.annotationSettings.isLock ? this.pdfViewer.annotationSettings.isLock : false;
        if (this.pdfViewer.freeTextSettings.fontStyle === 1) {
            this.isBold = true;
        }
        else if (this.pdfViewer.freeTextSettings.fontStyle === 2) {
            this.isItalic = true;
        }
        else if (this.pdfViewer.freeTextSettings.fontStyle === 4) {
            this.isUnderline = true;
        }
        else if (this.pdfViewer.freeTextSettings.fontStyle === 8) {
            this.isStrikethrough = true;
        }
        else if (3 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isItalic = true;
        }
        else if (5 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isUnderline = true;
        }
        else if (9 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isStrikethrough = true;
        }
        else if (7 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isItalic = true;
            this.isUnderline = true;
        }
        else if (11 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isItalic = true;
            this.isStrikethrough = true;
        }
        else if (14 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isBold = true;
            this.isUnderline = true;
            this.isStrikethrough = true;
        }
        else if (6 === this.pdfViewer.freeTextSettings.fontStyle) {
            this.isUnderline = true;
            this.isItalic = true;
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.renderFreeTextAnnotations = function (shapeAnnotations, pageNumber, isImportAction) {
        var isFreeTextAdded = false;
        if (!isImportAction) {
            for (var p = 0; p < this.freeTextPageNumbers.length; p++) {
                if (this.freeTextPageNumbers[p] === pageNumber) {
                    isFreeTextAdded = true;
                    break;
                }
            }
        }
        if (shapeAnnotations && !isFreeTextAdded) {
            if (shapeAnnotations.length >= 1) {
                this.freeTextPageNumbers.push(pageNumber);
                for (var i = 0; i < shapeAnnotations.length; i++) {
                    // tslint:disable-next-line
                    var annotation = shapeAnnotations[i];
                    annotation.annotationAddMode = this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                    if (annotation.AnnotType) {
                        var vertexPoints = null;
                        if (annotation.VertexPoints) {
                            vertexPoints = [];
                            for (var j = 0; j < annotation.VertexPoints.length; j++) {
                                var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                                vertexPoints.push(point);
                            }
                        }
                        // tslint:disable-next-line:max-line-length
                        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
                        var annot = void 0;
                        // tslint:disable-next-line
                        annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                        // tslint:disable-next-line
                        annot = {
                            author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext' + this.inputBoxCount,
                            rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                            thickness: annotation.Thickness, fillColor: annotation.FillColor,
                            bounds: {
                                x: annotation.Bounds.X, y: annotation.Bounds.Y, left: annotation.Bounds.X, top: annotation.Bounds.Y,
                                width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right,
                                bottom: annotation.Bounds.Bottom
                            }, annotName: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                            // tslint:disable-next-line
                            pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
                            fontFamily: annotation.FontFamily, notes: annotation.MarkupText, textAlign: annotation.TextAlign,
                            // tslint:disable-next-line
                            comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
                            review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                            // tslint:disable-next-line:max-line-length
                            font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic, isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline },
                            annotationSelectorSettings: this.getSettings(annotation), annotationSettings: annotation.AnnotationSettings,
                            // tslint:disable-next-line
                            customData: this.pdfViewer.annotation.getCustomData(annotation), annotationAddMode: annotation.annotationAddMode, allowedInteractions: annotation.allowedInteractions,
                            isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock
                        };
                        if (isImportAction) {
                            annot.id = annotation.AnnotName;
                        }
                        var addedAnnot = this.pdfViewer.add(annot);
                        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annot, '_annotations_freetext');
                        this.inputBoxCount += 1;
                        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = true;
                        this.pdfViewer.nodePropertyChange(addedAnnot, {});
                        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.getSettings = function (annotation) {
        var selector = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        }
        else if (this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.freeTextSettings.annotationSelectorSettings;
        }
        return selector;
    };
    /**
     * @private
     */
    FreeTextAnnotation.prototype.setAnnotationType = function (type) {
        this.pdfViewerBase.disableTextSelectionMode();
        switch (type) {
            case 'FreeText':
                this.currentAnnotationMode = 'FreeText';
                this.updateTextProperties();
                // tslint:disable-next-line:max-line-length
                var modifiedDateRect = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                this.pdfViewer.drawingObject = {
                    shapeAnnotationType: 'FreeText', strokeColor: this.borderColor,
                    fillColor: this.fillColor, opacity: this.opacity, notes: '', isCommentLock: false,
                    thickness: this.borderWidth, borderDashArray: '0', modifiedDate: modifiedDateRect,
                    // tslint:disable-next-line:max-line-length
                    author: this.pdfViewer.freeTextSettings.author, subject: 'Text Box', font: { isBold: this.isBold, isItalic: this.isItalic, isStrikeout: this.isStrikethrough, isUnderline: this.isUnderline }, textAlign: this.textAlign
                };
                this.pdfViewer.tool = 'Select';
                break;
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.modifyInCollection = function (property, pageNumber, annotationBase, isNewAdded) {
        if (!isNewAdded) {
            this.pdfViewer.isDocumentEdited = true;
        }
        var currentAnnotObject = null;
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (var i = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                    }
                    else if (property === 'fill') {
                        pageAnnotations[i].fillColor = annotationBase.wrapper.children[0].style.fill;
                    }
                    else if (property === 'stroke') {
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                    }
                    else if (property === 'opacity') {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                    }
                    else if (property === 'thickness') {
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                    }
                    else if (property === 'notes') {
                        pageAnnotations[i].note = annotationBase.notes;
                    }
                    else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    else if (property === 'dynamicText') {
                        pageAnnotations[i].dynamicText = annotationBase.dynamicText;
                    }
                    else if (property === 'fontColor') {
                        pageAnnotations[i].fontColor = annotationBase.fontColor;
                    }
                    else if (property === 'fontSize') {
                        pageAnnotations[i].fontSize = annotationBase.fontSize;
                    }
                    else if (property === 'fontFamily') {
                        pageAnnotations[i].fontFamily = annotationBase.fontFamily;
                    }
                    else if (property === 'textPropertiesChange') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].font = { isBold: annotationBase.font.isBold, isItalic: annotationBase.font.isItalic, isStrikeout: annotationBase.font.isStrikeout, isUnderline: annotationBase.font.isUnderline };
                    }
                    else if (property === 'textAlign') {
                        pageAnnotations[i].textAlign = annotationBase.textAlign;
                    }
                    // tslint:disable-next-line:max-line-length
                    pageAnnotations[i].modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    };
    /**
     * @private
     */
    FreeTextAnnotation.prototype.addInCollection = function (pageNumber, annotationBase) {
        if (annotationBase) {
            var pageAnnotations = this.getAnnotations(pageNumber, null);
            if (pageAnnotations) {
                pageAnnotations.push(annotationBase);
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
    };
    /**
     * @private
     */
    FreeTextAnnotation.prototype.saveFreeTextAnnotations = function () {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_freetext'];
        }
        // tslint:disable-next-line
        var annotations = new Array();
        for (var j = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            var annotationCollection = JSON.parse(storeObject);
            for (var i = 0; i < annotationCollection.length; i++) {
                var newArray = [];
                var pageAnnotationObject = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (var z = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z]);
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        var strokeColorString = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        var fillColorString = pageAnnotationObject.annotations[z].fillColor;
                        pageAnnotationObject.annotations[z].fillColor = JSON.stringify(this.getRgbCode(fillColorString));
                        var fontColorString = pageAnnotationObject.annotations[z].fontColor;
                        pageAnnotationObject.annotations[z].fontColor = JSON.stringify(this.getRgbCode(fontColorString));
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].vertexPoints = JSON.stringify(pageAnnotationObject.annotations[z].vertexPoints);
                        if (pageAnnotationObject.annotations[z].rectangleDifference !== null) {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotationObject.annotations[z].rectangleDifference = JSON.stringify(pageAnnotationObject.annotations[z].rectangleDifference);
                        }
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    };
    FreeTextAnnotation.prototype.manageAnnotations = function (pageAnnotations, pageNumber) {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_freetext'];
        }
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_freetext');
            }
            var index = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            var annotationStringified = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_freetext'] = annotationStringified;
            }
            else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_freetext', annotationStringified);
            }
        }
    };
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.getAnnotations = function (pageIndex, shapeAnnotations) {
        // tslint:disable-next-line
        var annotationCollection;
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_freetext');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_freetext'];
        }
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            var index = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
            }
            else {
                annotationCollection = shapeAnnotations;
            }
        }
        else {
            annotationCollection = shapeAnnotations;
        }
        return annotationCollection;
    };
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.getRgbCode = function (colorString) {
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        var stringArray = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        // tslint:disable-next-line:radix
        var r = parseInt(stringArray[0].split('(')[1]);
        // tslint:disable-next-line:radix
        var g = parseInt(stringArray[1]);
        // tslint:disable-next-line:radix
        var b = parseInt(stringArray[2]);
        // tslint:disable-next-line:radix
        var a = parseInt(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.onFocusOutInputBox = function () {
        if (!this.pdfViewerBase.isFreeTextContextMenu) {
            this.pdfViewer.fireBeforeAddFreeTextAnnotation(this.inputBoxElement.value);
            var pageIndex = this.pdfViewerBase.currentPageNumber - 1;
            var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (pageIndex));
            var inputEleHeight = parseFloat(this.inputBoxElement.style.height);
            var inputEleWidth = parseFloat(this.inputBoxElement.style.width);
            var inputEleLeft = parseFloat(this.inputBoxElement.style.left);
            if (this.pdfViewerBase.isMixedSizeDocument) {
                var canvas = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                this.inputBoxElement.style.left = inputEleLeft - canvas.offsetLeft;
            }
            var inputEleTop = parseFloat(this.inputBoxElement.style.top);
            var zoomFactor = this.pdfViewerBase.getZoomFactor();
            if (this.pdfViewer.isValidFreeText) {
                this.inputBoxElement.value = 'Type Here';
                this.pdfViewer.isValidFreeText = false;
            }
            var inputValue = this.inputBoxElement.value;
            var isNewlyAdded = false;
            if (this.isNewFreeTextAnnot === true) {
                // tslint:disable-next-line:max-line-length
                var currentDateString = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                var annotationName = this.pdfViewer.annotation.createGUID();
                this.isNewFreeTextAnnot = false;
                isNewlyAdded = true;
                var annot = void 0;
                var commentsDivid = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('freeText', pageIndex + 1);
                if (commentsDivid) {
                    document.getElementById(commentsDivid).id = annotationName;
                }
                // tslint:disable-next-line
                var annotationSelectorSettings = this.pdfViewer.freeTextSettings.annotationSelectorSettings ? this.pdfViewer.freeTextSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                // tslint:disable-next-line
                var annotationSettings = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
                // tslint:disable-next-line
                this.author = this.author ? this.author : this.pdfViewer.freeTextSettings.author ? this.pdfViewer.freeTextSettings.author : 'Guest';
                // tslint:disable-next-line
                var allowedInteractions = this.pdfViewer.freeTextSettings.allowedInteractions ? this.pdfViewer.freeTextSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
                // tslint:disable-next-line
                annot = {
                    author: this.author, modifiedDate: currentDateString, subject: 'Text Box', id: 'free_text' + this.inputBoxCount,
                    // tslint:disable-next-line:max-line-length
                    rotateAngle: 0, dynamicText: inputValue, strokeColor: this.borderColor, thickness: this.borderWidth, fillColor: this.fillColor,
                    bounds: {
                        left: inputEleLeft / zoomFactor, top: inputEleTop / zoomFactor, x: inputEleLeft / zoomFactor,
                        y: inputEleTop / zoomFactor, width: inputEleWidth, height: inputEleHeight,
                    }, annotName: annotationName,
                    shapeAnnotationType: 'FreeText', pageIndex: pageIndex, fontColor: this.fontColor, fontSize: this.fontSize,
                    fontFamily: this.fontFamily, opacity: this.opacity, comments: [], textAlign: this.textAlign,
                    // tslint:disable-next-line:max-line-length
                    font: { isBold: this.isBold, isItalic: this.isItalic, isStrikeout: this.isStrikethrough, isUnderline: this.isUnderline },
                    review: { state: 'Unmarked', stateModel: 'None', modifiedDate: currentDateString, author: this.author },
                    // tslint:disable-next-line:max-line-length
                    annotationSelectorSettings: annotationSelectorSettings, annotationSettings: annotationSettings,
                    customData: this.pdfViewer.annotationModule.getData('FreeText'), isPrint: this.pdfViewer.freeTextSettings.isPrint,
                    allowedInteractions: allowedInteractions
                };
                if (this.pdfViewer.enableRtl) {
                    annot.textAlign = 'Right';
                }
                var annotation = this.pdfViewer.add(annot);
                // tslint:disable-next-line
                var bounds = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width, height: annot.bounds.height };
                // tslint:disable-next-line
                var settings = {
                    opacity: annot.opacity, borderColor: annot.strokeColor, borderWidth: annot.thickness, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate,
                    // tslint:disable-next-line
                    fillColor: annot.fillColor, fontSize: annot.fontSize, width: annot.bounds.width, height: annot.bounds.height, fontColor: annot.fontColor, fontFamily: annot.fontFamily, defaultText: annot.dynamicText, fontStyle: annot.font, textAlignment: annot.textAlign
                };
                this.pdfViewer.annotation.storeAnnotations(pageIndex, annot, '_annotations_freetext');
                this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'FreeText', bounds, settings);
                // tslint:disable-next-line
                this.pdfViewer.annotation.addAction(pageIndex, null, annot, 'Addition', '', annot, annot);
                this.pdfViewer.renderSelector(annot.pageIndex);
                this.pdfViewer.clearSelection(annot.pageIndex);
                this.pdfViewer.isDocumentEdited = true;
                this.selectedAnnotation = annotation;
            }
            this.isInuptBoxInFocus = false;
            if (!isNewlyAdded && this.previousText !== inputValue) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.triggerAnnotationPropChange(this.selectedAnnotation, false, false, false, false, false, false, false, true, this.previousText, inputValue);
            }
            // tslint:disable-next-line
            if (this.selectedAnnotation && this.pdfViewer.selectedItems.annotations) {
                inputEleWidth = ((inputEleWidth - 1) / zoomFactor);
                inputEleHeight = ((inputEleHeight - 1) / zoomFactor);
                var heightDiff = (inputEleHeight - this.selectedAnnotation.bounds.height);
                var y = undefined;
                if (heightDiff > 0) {
                    y = this.selectedAnnotation.wrapper.offsetY + (heightDiff / 2);
                    y = y > 0 ? y : undefined;
                }
                this.selectedAnnotation.bounds.width = inputEleWidth;
                this.selectedAnnotation.bounds.height = inputEleHeight;
                this.pdfViewer.annotation.modifyDynamicTextValue(inputValue, this.selectedAnnotation.annotName);
                this.selectedAnnotation.dynamicText = inputValue;
                this.modifyInCollection('dynamicText', pageIndex, this.selectedAnnotation, isNewlyAdded);
                // tslint:disable-next-line
                this.pdfViewer.nodePropertyChange(this.selectedAnnotation, { bounds: { width: this.selectedAnnotation.bounds.width, height: this.selectedAnnotation.bounds.height, y: y } });
                // tslint:disable-next-line
                var commentsDiv = document.getElementById(this.selectedAnnotation.annotName);
                if (commentsDiv && commentsDiv.childNodes) {
                    if (commentsDiv.childNodes[0].ej2_instances) {
                        commentsDiv.childNodes[0].ej2_instances[0].value = inputValue;
                    }
                    else if (commentsDiv.childNodes[0].childNodes && commentsDiv.childNodes[0].childNodes[1].ej2_instances) {
                        commentsDiv.childNodes[0].childNodes[1].ej2_instances[0].value = inputValue;
                    }
                }
                this.pdfViewer.renderSelector(this.selectedAnnotation.pageIndex, this.selectedAnnotation.annotationSelectorSettings);
            }
            this.isNewFreeTextAnnot = false;
            if (this.inputBoxElement.parentElement) {
                if (pageDiv && (pageDiv.id === this.inputBoxElement.parentElement.id)) {
                    pageDiv.removeChild(this.inputBoxElement);
                }
                else {
                    this.inputBoxElement.parentElement.removeChild(this.inputBoxElement);
                }
            }
            var canvass = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
            // tslint:disable-next-line
            this.pdfViewer.renderDrawing(canvass, pageIndex);
            this.inputBoxCount += 1;
        }
        else {
            this.inputBoxElement.focus();
            if (!this.isTextSelected) {
                window.getSelection().removeAllRanges();
            }
        }
    };
    /**
     * @private
     */
    FreeTextAnnotation.prototype.onKeyDownInputBox = function (event) {
        this.selectedAnnotation = this.pdfViewer.selectedItems.annotations ? this.pdfViewer.selectedItems.annotations[0]
            : this.selectedAnnotation;
        var inuptEleObj = this;
        if (event.which === 9) {
            event.preventDefault();
        }
        setTimeout(function () {
            if (inuptEleObj.defaultHeight < inuptEleObj.inputBoxElement.scrollHeight
                // tslint:disable-next-line:radix
                && parseInt(inuptEleObj.inputBoxElement.style.height) < inuptEleObj.inputBoxElement.scrollHeight) {
                inuptEleObj.updateFreeTextAnnotationSize(true);
            }
            else {
                inuptEleObj.updateFreeTextAnnotationSize(false);
            }
            // tslint:disable-next-line
        }, 0);
    };
    FreeTextAnnotation.prototype.updateFreeTextAnnotationSize = function (isSize) {
        var inuptEleObj = this;
        if (!isSize && !inuptEleObj.inputBoxElement.readOnly) {
            inuptEleObj.inputBoxElement.style.height = 'auto';
        }
        // tslint:disable-next-line:max-line-length
        inuptEleObj.inputBoxElement.style.height = inuptEleObj.inputBoxElement.readOnly ? inuptEleObj.inputBoxElement.style.height : inuptEleObj.inputBoxElement.scrollHeight + 5 + 'px';
        var inputEleHeight = parseFloat(this.inputBoxElement.style.height);
        var inputEleWidth = parseFloat(this.inputBoxElement.style.width);
        inputEleHeight = ((inputEleHeight - 1) / inuptEleObj.pdfViewerBase.getZoomFactor());
        inputEleWidth = ((inputEleWidth - 1) / inuptEleObj.pdfViewerBase.getZoomFactor());
        if (this.selectedAnnotation) {
            var heightDiff = (inputEleHeight - inuptEleObj.selectedAnnotation.bounds.height);
            var y = 0;
            if (heightDiff > 0) {
                y = inuptEleObj.selectedAnnotation.wrapper.offsetY + (heightDiff / 2);
            }
            else {
                heightDiff = Math.abs(heightDiff);
                y = inuptEleObj.selectedAnnotation.wrapper.offsetY - (heightDiff / 2);
            }
            inuptEleObj.selectedAnnotation.bounds.width = inputEleWidth;
            inuptEleObj.selectedAnnotation.bounds.height = inputEleHeight;
            // tslint:disable-next-line
            inuptEleObj.pdfViewer.nodePropertyChange(inuptEleObj.selectedAnnotation, { bounds: { width: inuptEleObj.selectedAnnotation.bounds.width, height: inuptEleObj.selectedAnnotation.bounds.height, y: y } });
            inuptEleObj.pdfViewer.renderSelector(inuptEleObj.selectedAnnotation.pageIndex, this.selectedAnnotation.annotationSelectorSettings);
        }
    };
    /**
     * @private
     */
    FreeTextAnnotation.prototype.onMouseUpInputBox = function (event) {
        // tslint:disable-next-line
        var target = event.target;
        this.selectionStart = 0;
        this.selectionEnd = 0;
        if (event.which === 3 && target) {
            this.selectionStart = target.selectionStart;
            this.selectionEnd = target.selectionEnd;
        }
        if (event.which === 3 && window.getSelection() != null && window.getSelection().toString() !== '') {
            this.isTextSelected = true;
        }
        else {
            this.isTextSelected = false;
        }
    };
    /**
     * @private
     */
    FreeTextAnnotation.prototype.addInuptElemet = function (currentPosition, annotation) {
        if (annotation === void 0) { annotation = null; }
        var pageIndex = this.pdfViewerBase.currentPageNumber - 1;
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (pageIndex));
        var canvass = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        var zoomFactor = this.pdfViewerBase.getZoomFactor();
        this.inputBoxElement.value = (annotation && annotation.dynamicText) ? annotation.dynamicText : this.defaultText;
        this.inputBoxElement.style.boxSizing = 'border-box';
        this.inputBoxElement.style.left = ((currentPosition.x)) + 'px';
        this.inputBoxElement.style.top = ((currentPosition.y)) + 'px';
        this.applyFreetextStyles(zoomFactor);
        if (this.isBold) {
            this.inputBoxElement.style.fontWeight = 'bold';
        }
        else {
            this.inputBoxElement.style.fontWeight = 'normal';
        }
        if (this.isItalic) {
            this.inputBoxElement.style.fontStyle = 'italic';
        }
        else {
            this.inputBoxElement.style.fontStyle = 'normal';
        }
        this.inputBoxElement.style.textDecoration = 'none';
        if (this.isUnderline) {
            this.inputBoxElement.style.textDecoration = 'underline';
        }
        if (this.isStrikethrough) {
            this.inputBoxElement.style.textDecoration = 'line-through';
        }
        if (this.pdfViewer.enableRtl) {
            this.inputBoxElement.style.textAlign = 'right';
            this.inputBoxElement.style.direction = 'rtl';
            this.inputBoxElement.style.left = ((currentPosition.x)) - ((this.defautWidth * zoomFactor / 2));
        }
        else {
            this.inputBoxElement.style.textAlign = this.textAlign.toLowerCase();
        }
        this.inputBoxElement.style.borderColor = this.borderColor;
        this.inputBoxElement.style.color = this.fontColor;
        this.inputBoxElement.style.background = this.fillColor;
        if (annotation && annotation.wrapper && annotation.wrapper.children[0]) {
            this.inputBoxElement.style.opacity = annotation.wrapper.children[0].style.opacity;
        }
        if (this.isNewFreeTextAnnot === true) {
            this.pdfViewer.clearSelection(pageIndex);
        }
        if (annotation && annotation.wrapper && annotation.wrapper.bounds) {
            if (annotation.wrapper.bounds.left) {
                this.inputBoxElement.style.left = ((annotation.wrapper.bounds.left) * zoomFactor) + 'px';
            }
            if (annotation.wrapper.bounds.top) {
                this.inputBoxElement.style.top = ((annotation.wrapper.bounds.top) * zoomFactor) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            this.inputBoxElement.style.height = annotation.wrapper.bounds.height ? (annotation.wrapper.bounds.height * zoomFactor) + 1 + 'px' : (this.defaultHeight * zoomFactor) + 'px';
            // tslint:disable-next-line:max-line-length
            this.inputBoxElement.style.width = annotation.wrapper.bounds.width ? (annotation.wrapper.bounds.width * zoomFactor) + 1 + 'px' : (this.defautWidth * zoomFactor) + 'px';
            this.selectedAnnotation = annotation;
            this.previousText = this.selectedAnnotation.dynamicText;
            this.selectedAnnotation.dynamicText = '';
            this.inputBoxElement.style.borderColor = this.selectedAnnotation.strokeColor;
            this.inputBoxElement.style.color = this.selectedAnnotation.fontColor;
            this.inputBoxElement.style.background = this.selectedAnnotation.fillColor;
            if (this.selectedAnnotation.font.isBold === true) {
                this.inputBoxElement.style.fontWeight = 'bold';
            }
            if (this.selectedAnnotation.font.isItalic === true) {
                this.inputBoxElement.style.fontStyle = 'italic';
            }
            if (this.selectedAnnotation.font.isUnderline === true) {
                this.inputBoxElement.style.textDecoration = 'underline';
            }
            if (this.selectedAnnotation.font.isStrikeout === true) {
                this.inputBoxElement.style.textDecoration = 'line-through';
            }
            if (this.pdfViewer.enableRtl) {
                this.inputBoxElement.style.textAlign = 'right';
                this.inputBoxElement.style.direction = 'rtl';
            }
            else if (this.selectedAnnotation.textAlign) {
                this.inputBoxElement.style.textAlign = this.selectedAnnotation.textAlign;
            }
            this.inputBoxElement.style.fontSize = (this.selectedAnnotation.fontSize * zoomFactor) + 'px';
            this.inputBoxElement.style.fontFamily = this.selectedAnnotation.fontFamily;
            this.pdfViewer.nodePropertyChange(this.selectedAnnotation, {});
        }
        if (this.pdfViewerBase.isMixedSizeDocument) {
            this.inputBoxElement.style.left = (currentPosition.x) + canvass.offsetLeft + 'px';
        }
        this.pdfViewer.annotation.freeTextAnnotationModule.isFreeTextValueChange = false;
        pageDiv.appendChild(this.inputBoxElement);
        if (this.defaultHeight < this.inputBoxElement.scrollHeight
            // tslint:disable-next-line:radix
            && parseInt(this.inputBoxElement.style.height) < this.inputBoxElement.scrollHeight) {
            this.inputBoxElement.style.height = this.inputBoxElement.scrollHeight + 5 + 'px';
        }
        this.isInuptBoxInFocus = true;
        this.inputBoxElement.focus();
        if (this.isNewFreeTextAnnot === true || this.inputBoxElement.value === this.defaultText) {
            this.inputBoxElement.select();
        }
    };
    FreeTextAnnotation.prototype.applyFreetextStyles = function (zoomFactor) {
        this.inputBoxElement.style.height = (this.defaultHeight * zoomFactor) + 'px';
        this.inputBoxElement.style.width = (this.defautWidth * zoomFactor) + 'px';
        this.inputBoxElement.style.borderWidth = (this.borderWidth * zoomFactor) + 'px';
        this.inputBoxElement.style.fontSize = (this.fontSize * zoomFactor) + 'px';
        this.inputBoxElement.readOnly = this.isReadonly;
    };
    /**
     * @private
     */
    FreeTextAnnotation.prototype.copySelectedText = function () {
        if (window.getSelection() !== null) {
            this.selectedText = window.getSelection().toString();
            var textArea = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = this.selectedText;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
            }
            catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
            }
            finally {
                if (textArea) {
                    document.body.removeChild(textArea);
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.pasteSelectedText = function (target) {
        if (this.selectedText !== '' && target) {
            // tslint:disable-next-line
            var text = target.value;
            target.value = text.slice(0, this.selectionStart) + this.selectedText + text.slice(this.selectionEnd, text.length);
        }
        // tslint:disable-next-line
        var events = event;
        this.onKeyDownInputBox(events);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.cutSelectedText = function (target) {
        if (window.getSelection() !== null) {
            // tslint:disable-next-line
            var text = target.value;
            this.selectedText = window.getSelection().toString();
            target.value = text.slice(0, target.selectionStart) + text.slice(target.selectionEnd);
            var textArea = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = this.selectedText;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('cut');
            }
            catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
            }
            finally {
                if (textArea) {
                    document.body.removeChild(textArea);
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.saveImportedFreeTextAnnotations = function (shapeAnnotations, pageNumber) {
        // tslint:disable-next-line
        var annotation = shapeAnnotations;
        if (annotation.AnnotType) {
            var vertexPoints = null;
            if (annotation.VertexPoints) {
                vertexPoints = [];
                for (var j = 0; j < annotation.VertexPoints.length; j++) {
                    var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                    vertexPoints.push(point);
                }
            }
            // tslint:disable-next-line:max-line-length
            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
            var annot = void 0;
            // tslint:disable-next-line:max-line-length
            annotation.allowedInteractions = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
            // tslint:disable-next-line
            annot = {
                author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext',
                rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                thickness: annotation.Thickness, fillColor: annotation.FillColor,
                bounds: {
                    x: annotation.Bounds.X, y: annotation.Bounds.Y, left: annotation.Bounds.X, top: annotation.Bounds.Y,
                    width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right,
                    bottom: annotation.Bounds.Bottom
                }, annotName: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                // tslint:disable-next-line
                pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
                fontFamily: annotation.FontFamily, notes: annotation.MarkupText, textAlign: annotation.TextAlign,
                // tslint:disable-next-line
                comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic, isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline },
                annotationSelectorSettings: this.getSettings(annotation), annotationSettings: annotation.AnnotationSettings,
                // tslint:disable-next-line:max-line-length
                customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock
            };
            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annot, '_annotations_freetext');
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FreeTextAnnotation.prototype.updateFreeTextAnnotationCollections = function (shapeAnnotations, pageNumber) {
        // tslint:disable-next-line
        var annotation = shapeAnnotations;
        if (annotation.AnnotType) {
            var vertexPoints = null;
            if (annotation.VertexPoints) {
                vertexPoints = [];
                for (var j = 0; j < annotation.VertexPoints.length; j++) {
                    var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                    vertexPoints.push(point);
                }
            }
            // tslint:disable-next-line:max-line-length
            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.freeTextSettings);
            // tslint:disable-next-line:max-line-length
            annotation.allowedInteractions = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
            // tslint:disable-next-line
            var annot = void 0;
            // tslint:disable-next-line
            annot = {
                author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject, id: 'freetext',
                rotateAngle: annotation.Rotate, dynamicText: annotation.MarkupText, strokeColor: annotation.StrokeColor,
                thickness: annotation.Thickness, fillColor: annotation.FillColor,
                bounds: {
                    x: annotation.Bounds.X, y: annotation.Bounds.Y, left: annotation.Bounds.X, top: annotation.Bounds.Y,
                    width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right,
                    bottom: annotation.Bounds.Bottom
                }, annotationId: annotation.AnnotName, shapeAnnotationType: 'FreeText',
                // tslint:disable-next-line
                pageIndex: pageNumber, opacity: annotation.Opacity, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
                fontFamily: annotation.FontFamily, notes: annotation.MarkupText,
                // tslint:disable-next-line
                comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                font: { isBold: annotation.Font.Bold, isItalic: annotation.Font.Italic, isStrikeout: annotation.Font.Strikeout, isUnderline: annotation.Font.Underline }, pageNumber: pageNumber, annotationSettings: annotation.AnnotationSettings, isCommentLock: annotation.IsCommentLock
            };
            return annot;
        }
    };
    return FreeTextAnnotation;
}());
export { FreeTextAnnotation };
