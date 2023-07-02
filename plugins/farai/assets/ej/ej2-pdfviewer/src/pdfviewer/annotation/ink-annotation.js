import { splitArrayCollection, processPathData, getPathString } from '@syncfusion/ej2-drawings';
var InkAnnotation = /** @class */ (function () {
    function InkAnnotation(pdfViewer, pdfViewerBase) {
        // tslint:disable-next-line
        this.newObject = [];
        /**
         * @private
         */
        this.outputString = '';
        /**
         * @private
         */
        // tslint:disable-next-line
        this.inkAnnotationindex = [];
        /**
         * @private
         */
        this.currentPageNumber = '';
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    InkAnnotation.prototype.drawInk = function () {
        this.pdfViewerBase.disableTextSelectionMode();
        this.pdfViewer.tool = 'Ink';
    };
    InkAnnotation.prototype.drawInkAnnotation = function (pageNumber) {
        if (this.pdfViewerBase.isToolbarInkClicked) {
            this.pdfViewerBase.isInkAdded = true;
            var pageIndex = !isNaN(pageNumber) ? pageNumber : this.pdfViewerBase.currentPageNumber - 1;
            if (this.outputString && this.outputString !== '') {
                var currentAnnot = this.addInk(pageIndex);
                this.pdfViewer.renderDrawing(undefined, pageIndex);
                this.pdfViewer.clearSelection(pageIndex);
                this.pdfViewer.select([currentAnnot.id], currentAnnot.annotationSelectorSettings);
                if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableSignaturePropertiesTools(true);
                }
            }
            else {
                this.outputString = '';
                this.newObject = [];
                this.pdfViewerBase.isToolbarInkClicked = false;
                this.pdfViewer.tool = '';
            }
            this.pdfViewerBase.isInkAdded = false;
        }
    };
    /**
     * @private
     */
    InkAnnotation.prototype.storePathData = function () {
        this.convertToPath(this.newObject);
        this.newObject = [];
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    InkAnnotation.prototype.drawInkInCanvas = function (position, pageIndex) {
        // tslint:disable-next-line
        if (this.currentPageNumber !== '' && parseInt(this.currentPageNumber) !== pageIndex) {
            // tslint:disable-next-line
            this.drawInkAnnotation(parseInt(this.currentPageNumber));
            this.pdfViewerBase.isToolbarInkClicked = true;
            this.pdfViewer.tool = 'Ink';
        }
        // tslint:disable-next-line
        var canvas = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        // tslint:disable-next-line
        var context = canvas.getContext('2d');
        var thickness = this.pdfViewer.inkAnnotationSettings.thickness ? this.pdfViewer.inkAnnotationSettings.thickness : 1;
        // tslint:disable-next-line:max-line-length
        var opacity = this.pdfViewer.inkAnnotationSettings.opacity ? this.pdfViewer.inkAnnotationSettings.opacity : 1;
        // tslint:disable-next-line:max-line-length
        var strokeColor = this.pdfViewer.inkAnnotationSettings.strokeColor ? this.pdfViewer.inkAnnotationSettings.strokeColor : '#ff0000';
        context.beginPath();
        context.moveTo(position.prevPosition.x, position.prevPosition.y);
        context.lineTo(position.currentPosition.x, position.currentPosition.y);
        context.lineWidth = thickness;
        context.strokeStyle = strokeColor;
        context.globalAlpha = opacity;
        context.stroke();
        // context.lineWidth = 2;
        context.arc(position.prevPosition.x, position.prevPosition.y, 2 / 2, 0, Math.PI * 2, true);
        context.closePath();
        this.pdfViewerBase.prevPosition = position.currentPosition;
        this.newObject.push(position.currentPosition.x, position.currentPosition.y);
        this.currentPageNumber = pageIndex.toString();
    };
    // tslint:disable-next-line
    InkAnnotation.prototype.convertToPath = function (newObject) {
        this.movePath(newObject[0], newObject[1]);
        this.linePath(newObject[0], newObject[1]);
        for (var n = 2; n < newObject.length; n = n + 2) {
            this.linePath(newObject[n], newObject[n + 1]);
        }
    };
    InkAnnotation.prototype.linePath = function (x, y) {
        this.outputString += 'L' + x + ',' + y + ' ';
    };
    InkAnnotation.prototype.movePath = function (x, y) {
        this.outputString += 'M' + x + ',' + y + ' ';
    };
    /**
     * @private
     */
    //tslint:disable-next-line
    InkAnnotation.prototype.addInk = function (pageNumber) {
        //tslint:disable-next-line
        var currentBounds = this.calculateInkSize();
        var zoomvalue = this.pdfViewerBase.getZoomFactor();
        // tslint:disable-next-line
        var annot;
        if (this.pdfViewerBase.isToolbarInkClicked) {
            var annotationName = this.pdfViewer.annotation.createGUID();
            var modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            var pageIndex = !isNaN(pageNumber) ? pageNumber : this.pdfViewerBase.currentPageNumber - 1;
            var thickness = this.pdfViewer.inkAnnotationSettings.thickness ? this.pdfViewer.inkAnnotationSettings.thickness : 1;
            // tslint:disable-next-line:max-line-length
            var opacity = this.pdfViewer.inkAnnotationSettings.opacity ? this.pdfViewer.inkAnnotationSettings.opacity : 1;
            // tslint:disable-next-line:max-line-length
            var strokeColor = this.pdfViewer.inkAnnotationSettings.strokeColor ? this.pdfViewer.inkAnnotationSettings.strokeColor : '#ff0000';
            // tslint:disable-next-line
            var isLock = this.pdfViewer.inkAnnotationSettings.isLock ? this.pdfViewer.inkAnnotationSettings.isLock : this.pdfViewer.annotationSettings.isLock;
            var author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.inkAnnotationSettings.author ? this.pdfViewer.inkAnnotationSettings.author : 'Guest';
            var customData = this.pdfViewer.inkAnnotationSettings.customData;
            var isPrint = this.pdfViewer.inkAnnotationSettings.isPrint;
            // tslint:disable-next-line
            var allowedInteractions = this.pdfViewer.inkAnnotationSettings.allowedInteractions ? this.pdfViewer.inkAnnotationSettings.allowedInteractions : this.pdfViewer.annotationSettings.allowedInteractions;
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'ink' + this.pdfViewerBase.inkCount, bounds: { x: currentBounds.x, y: currentBounds.y, width: currentBounds.width, height: currentBounds.height }, pageIndex: pageIndex, data: this.outputString, customData: customData,
                shapeAnnotationType: 'Ink', opacity: opacity, strokeColor: strokeColor, thickness: thickness, annotName: annotationName, comments: [],
                author: author, subject: 'Ink', notes: '',
                review: { state: '', stateModel: '', modifiedDate: modifiedDate, author: author },
                annotationSelectorSettings: this.getSelector('Ink', ''), modifiedDate: modifiedDate, annotationSettings: { isLock: isLock },
                isPrint: isPrint, allowedInteractions: allowedInteractions, isCommentLock: false
            };
            var annotation = this.pdfViewer.add(annot);
            // tslint:disable-next-line
            var bounds = { left: annot.bounds.x, top: annot.bounds.y, width: annot.bounds.width, height: annot.bounds.height };
            // tslint:disable-next-line
            var settings = {
                opacity: annot.opacity, strokeColor: annot.strokeColor, thickness: annot.thickness, modifiedDate: annot.modifiedDate,
                width: annot.bounds.width, height: annot.bounds.height, data: this.outputString
            };
            this.pdfViewerBase.inkCount++;
            //tslint:disable-next-line:max-line-length
            var commentsDivid = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('ink', (annot.pageIndex + 1), annot.shapeAnnotationType);
            if (commentsDivid) {
                document.getElementById(commentsDivid).id = annotationName;
            }
            annot.annotName = annotationName;
            this.pdfViewer.annotationModule.storeAnnotations(pageIndex, annot, '_annotations_ink');
            this.pdfViewer.fireAnnotationAdd(annot.pageIndex, annot.annotName, 'Ink', bounds, settings);
            //tslint:disable-next-line:max-line-length
            this.pdfViewer.annotation.addAction(pageIndex, null, annotation, 'Addition', '', annotation, annotation);
            if (this.pdfViewerBase.isInkAdded) {
                this.outputString = '';
                this.newObject = [];
            }
            this.pdfViewerBase.isToolbarInkClicked = false;
            this.pdfViewer.tool = '';
        }
        return annot;
    };
    /**
     * @private
     */
    InkAnnotation.prototype.setAnnotationMode = function () {
        this.pdfViewerBase.isToolbarInkClicked = true;
        this.drawInk();
    };
    InkAnnotation.prototype.saveInkSignature = function () {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        // tslint:disable-next-line
        var annotations = new Array();
        for (var j = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            var annotationCollection = JSON.parse(storeObject);
            for (var i = 0; i < annotationCollection.length; i++) {
                // tslint:disable-next-line
                var newArray = [];
                var pageAnnotationObject = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (var z = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z]);
                        // tslint:disable-next-line:max-line-length
                        var strokeColorString = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.pdfViewerBase.signatureModule.getRgbCode(strokeColorString));
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(pageAnnotationObject.annotations[z].bounds);
                        // tslint:disable-next-line
                        var collectionData = processPathData(pageAnnotationObject.annotations[z].data);
                        // tslint:disable-next-line
                        var csData = splitArrayCollection(collectionData);
                        pageAnnotationObject.annotations[z].data = JSON.stringify(csData);
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    };
    /**
     * @private
     */
    //tslint:disable-next-line
    InkAnnotation.prototype.addInCollection = function (pageNumber, annotationBase) {
        if (annotationBase) {
            //tslint:disable-next-line
            var pageAnnotations = this.getAnnotations(pageNumber, null);
            if (pageAnnotations) {
                pageAnnotations.push(annotationBase);
            }
            this.manageInkAnnotations(pageAnnotations, pageNumber);
        }
    };
    //tslint:disable-next-line
    InkAnnotation.prototype.calculateInkSize = function () {
        var minimumX = -1;
        var minimumY = -1;
        var maximumX = -1;
        var maximumY = -1;
        //tslint:disable-next-line
        var collectionData = processPathData(this.outputString);
        var zoomvalue = this.pdfViewerBase.getZoomFactor();
        // tslint:disable-next-line
        for (var k = 0; k < collectionData.length; k++) {
            //tslint:disable-next-line
            var val = collectionData[k];
            if (minimumX === -1) {
                // tslint:disable-next-line
                minimumX = (val['x']);
                // tslint:disable-next-line
                maximumX = (val['x']);
                // tslint:disable-next-line
                minimumY = (val['y']);
                // tslint:disable-next-line
                maximumY = (val['y']);
            }
            else {
                // tslint:disable-next-line
                var point1 = (val['x']);
                // tslint:disable-next-line
                var point2 = (val['y']);
                if (minimumX >= point1) {
                    minimumX = point1;
                }
                if (minimumY >= point2) {
                    minimumY = point2;
                }
                if (maximumX <= point1) {
                    maximumX = point1;
                }
                if (maximumY <= point2) {
                    maximumY = point2;
                }
            }
        }
        var newdifferenceX = maximumX - minimumX;
        var newdifferenceY = maximumY - minimumY;
        // tslint:disable-next-line:max-line-length
        return { x: (minimumX / zoomvalue), y: (minimumY / zoomvalue), width: (newdifferenceX / zoomvalue), height: (newdifferenceY / zoomvalue) };
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    InkAnnotation.prototype.renderExistingInkSignature = function (annotationCollection, pageIndex, isImport) {
        var annot;
        var isinkAnnotationAdded = false;
        if (!isImport) {
            for (var p = 0; p < this.inkAnnotationindex.length; p++) {
                if (this.inkAnnotationindex[p] === pageIndex) {
                    isinkAnnotationAdded = true;
                    break;
                }
            }
        }
        if (annotationCollection && !isinkAnnotationAdded) {
            if (annotationCollection.length > 0 && this.inkAnnotationindex.indexOf(pageIndex) === -1) {
                this.inkAnnotationindex.push(pageIndex);
            }
            for (var n = 0; n < annotationCollection.length; n++) {
                // tslint:disable-next-line
                var currentAnnotation = annotationCollection[n];
                //tslint:disable-next-line
                if (currentAnnotation) {
                    // tslint:disable-next-line
                    var bounds = currentAnnotation.Bounds;
                    var currentLeft = (bounds.X);
                    var currentTop = (bounds.Y);
                    var currentWidth = (bounds.Width);
                    var currentHeight = (bounds.Height);
                    // tslint:disable-next-line
                    var data = currentAnnotation.PathData;
                    if (isImport) {
                        if (currentAnnotation.IsPathData || currentAnnotation.PathData.split('command').length <= 1) {
                            data = currentAnnotation.PathData;
                        }
                        else {
                            data = getPathString(JSON.parse(currentAnnotation.PathData));
                        }
                    }
                    var isLock = currentAnnotation.AnnotationSettings ? currentAnnotation.AnnotationSettings.isLock : false;
                    // tslint:disable-next-line
                    var selectorSettings = currentAnnotation.AnnotationSelectorSettings ? currentAnnotation.AnnotationSelectorSettings : this.getSelector(currentAnnotation, 'Ink');
                    var customData = currentAnnotation.CustomData ? currentAnnotation.CustomData : this.pdfViewer.inkAnnotationSettings.customData;
                    var isPrint = currentAnnotation.IsPrint;
                    // tslint:disable-next-line:max-line-length
                    currentAnnotation.allowedInteractions = currentAnnotation.AllowedInteractions ? currentAnnotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(currentAnnotation);
                    annot = {
                        // tslint:disable-next-line:max-line-length
                        id: 'ink' + this.pdfViewerBase.inkCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                        shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotName: currentAnnotation.AnnotName,
                        // tslint:disable-next-line:max-line-length
                        comments: this.pdfViewer.annotationModule.getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author), author: currentAnnotation.Author, allowedInteractions: currentAnnotation.allowedInteractions, subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,
                        // tslint:disable-next-line:max-line-length
                        review: { state: '', stateModel: '', modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes: currentAnnotation.Note, annotationSettings: { isLock: isLock },
                        annotationSelectorSettings: selectorSettings, customData: customData, isPrint: isPrint, isCommentLock: currentAnnotation.IsCommentLock
                    };
                    this.pdfViewer.add(annot);
                    // tslint:disable-next-line
                    var canvass = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
                    // tslint:disable-next-line
                    this.pdfViewer.renderDrawing(canvass, annot.pageIndex);
                    this.pdfViewer.annotationModule.storeAnnotations(annot.pageIndex, annot, '_annotations_ink');
                    this.pdfViewerBase.currentSignatureAnnot = null;
                    this.pdfViewerBase.signatureCount++;
                    this.pdfViewerBase.inkCount++;
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    InkAnnotation.prototype.storeInkSignatureData = function (pageNumber, annotations) {
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(annotations.pageIndex, null, annotations, 'Addition', '', annotations, annotations);
        // tslint:disable-next-line
        var annotation = null;
        var left = annotations.bounds.left ? annotations.bounds.left : annotations.bounds.x;
        var top = annotations.bounds.top ? annotations.bounds.top : annotations.bounds.y;
        if (annotations.wrapper && annotations.wrapper.bounds) {
            left = annotations.wrapper.bounds.left;
            top = annotations.wrapper.bounds.top;
        }
        annotation = {
            // tslint:disable-next-line:max-line-length
            id: annotations.id, bounds: { x: left, y: top, width: annotations.bounds.width, height: annotations.bounds.height },
            // tslint:disable-next-line:max-line-length
            shapeAnnotationType: 'Ink', opacity: annotations.opacity, thickness: annotations.thickness, strokeColor: annotations.strokeColor, pageIndex: annotations.pageIndex, data: annotations.data,
            annotName: annotations.annotName,
            // tslint:disable-next-line:max-line-length
            comments: annotations.comments, author: annotations.author, subject: annotations.subject, modifiedDate: annotations.modifiedDate,
            // tslint:disable-next-line:max-line-length
            review: { state: '', stateModel: '', modifiedDate: annotations.modifiedDate, author: annotations.author }, notes: annotations.notes,
            annotationSelectorSettings: this.getSelector(annotations, 'Ink'), isCommentLock: annotations.isCommentLock
        };
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        var index = 0;
        if (!storeObject) {
            var shapeAnnotation = { pageIndex: pageNumber, annotations: [] };
            shapeAnnotation.annotations.push(annotation);
            index = shapeAnnotation.annotations.indexOf(annotation);
            var annotationCollection = [];
            annotationCollection.push(shapeAnnotation);
            var annotationStringified = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_ink', annotationStringified);
        }
        else {
            var annotObject = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_ink');
            var pageIndex = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                annotObject[pageIndex].annotations.push(annotation);
                index = annotObject[pageIndex].annotations.indexOf(annotation);
            }
            else {
                var markupAnnotation = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            var annotationStringified = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_ink', annotationStringified);
        }
    };
    InkAnnotation.prototype.getSelector = function (type, subject) {
        var selector = this.pdfViewer.annotationSelectorSettings;
        if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings;
        }
        return selector;
    };
    // tslint:disable-next-line
    InkAnnotation.prototype.getAnnotations = function (pageIndex, shapeAnnotations) {
        // tslint:disable-next-line
        var annotationCollection;
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
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
    /**
     * @private
     */
    // tslint:disable-next-line
    InkAnnotation.prototype.modifySignatureInkCollection = function (property, pageNumber, annotationBase) {
        this.pdfViewer.isDocumentEdited = true;
        // tslint:disable-next-line
        var currentAnnotObject = null;
        // tslint:disable-next-line
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (var i = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].bounds = { x: annotationBase.wrapper.bounds.left, y: annotationBase.wrapper.bounds.top, width: annotationBase.bounds.width, height: annotationBase.bounds.height };
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
                        pageAnnotations[i].notes = annotationBase.notes;
                    }
                    else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    pageAnnotations[i].modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], pageNumber);
                }
            }
            this.manageInkAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    };
    // tslint:disable-next-line
    InkAnnotation.prototype.manageInkAnnotations = function (pageAnnotations, pageNumber) {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_ink');
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_ink');
            var index = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            var annotationStringified = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_ink', annotationStringified);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    InkAnnotation.prototype.updateInkCollections = function (currentAnnotation, pageIndex, isImport) {
        //tslint:disable-next-line
        var annot;
        //tslint:disable-next-line
        if (currentAnnotation) {
            // tslint:disable-next-line
            var bounds = currentAnnotation.Bounds;
            var currentLeft = (bounds.X);
            var currentTop = (bounds.Y);
            var currentWidth = (bounds.Width);
            var currentHeight = (bounds.Height);
            var customData = currentAnnotation.customData;
            var isPrint = currentAnnotation.isPrint;
            // tslint:disable-next-line
            var allowedInteractions = currentAnnotation.AllowedInteractions ? currentAnnotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(currentAnnotation);
            // tslint:disable-next-line
            var data = currentAnnotation.PathData;
            if (isImport) {
                data = getPathString(JSON.parse(currentAnnotation.PathData));
            }
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'ink' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                // tslint:disable-next-line:max-line-length
                shapeAnnotationType: 'Ink', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, annotationId: currentAnnotation.AnnotName,
                // tslint:disable-next-line:max-line-length
                customData: customData, comments: this.pdfViewer.annotationModule.getAnnotationComments(currentAnnotation.Comments, currentAnnotation, currentAnnotation.Author), author: currentAnnotation.Author, allowedInteractions: allowedInteractions, subject: currentAnnotation.Subject, modifiedDate: currentAnnotation.ModifiedDate,
                review: { state: '', stateModel: '', modifiedDate: currentAnnotation.ModifiedDate, author: currentAnnotation.Author }, notes: currentAnnotation.Note, isPrint: isPrint, isCommentLock: currentAnnotation.IsCommentLock
            };
            return annot;
        }
    };
    return InkAnnotation;
}());
export { InkAnnotation };
