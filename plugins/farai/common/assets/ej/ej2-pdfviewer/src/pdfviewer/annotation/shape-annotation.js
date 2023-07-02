import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * @hidden
 */
var ShapeAnnotation = /** @class */ (function () {
    function ShapeAnnotation(pdfviewer, pdfViewerBase) {
        /**
         * @private
         */
        this.shapeCount = 0;
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    ShapeAnnotation.prototype.renderShapeAnnotations = function (shapeAnnotations, pageNumber, isImportAcion) {
        if (shapeAnnotations) {
            if (shapeAnnotations.length >= 1) {
                // tslint:disable-next-line
                var shapeAnnots = this.pdfViewer.annotation.getStoredAnnotations(pageNumber, shapeAnnotations, '_annotations_shape');
                if (!shapeAnnots || isImportAcion) {
                    for (var i = 0; i < shapeAnnotations.length; i++) {
                        // tslint:disable-next-line
                        var annotation = shapeAnnotations[i];
                        annotation.annotationAddMode = this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        var annotationObject = null;
                        this.shapeCount = this.shapeCount + 1;
                        if (annotation.ShapeAnnotationType) {
                            var vertexPoints = null;
                            if (annotation.VertexPoints) {
                                vertexPoints = [];
                                for (var j = 0; j < annotation.VertexPoints.length; j++) {
                                    var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                                    vertexPoints.push(point);
                                }
                            }
                            // tslint:disable-next-line
                            var borderDashArray = void 0;
                            if (annotationObject && annotationObject.borderDashArray) {
                                borderDashArray = annotationObject.borderDashArray.toString();
                            }
                            if (annotation.Bounds && annotation.EnableShapeLabel === true) {
                                // tslint:disable-next-line:max-line-length
                                annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
                                // tslint:disable-next-line:max-line-length
                                annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
                                annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
                                annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
                                annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
                                // tslint:disable-next-line:max-line-length
                                annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
                            }
                            // tslint:disable-next-line:max-line-length
                            annotation.AnnotationSelectorSettings = annotation.AnnotationSelectorSettings ? annotation.AnnotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                            // tslint:disable-next-line:max-line-length
                            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
                            // tslint:disable-next-line:max-line-length
                            annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                            var isPrint = void 0;
                            if (annotation.annotationAddMode === 'Imported Annotation') {
                                isPrint = annotation.IsPrint;
                            }
                            else {
                                isPrint = annotation.AnnotationSettings.isPrint;
                            }
                            // tslint:disable-next-line:max-line-length
                            annotationObject = {
                                id: 'shape' + this.shapeCount, shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
                                // tslint:disable-next-line:max-line-length
                                note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
                                borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
                                // tslint:disable-next-line:max-line-length
                                cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, annotName: annotation.AnnotName,
                                bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
                                // tslint:disable-next-line:max-line-length
                                labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
                                fontColor: annotation.FontColor, labelBorderColor: annotation.LabelBorderColor, fontSize: annotation.FontSize,
                                // tslint:disable-next-line:max-line-length
                                labelBounds: annotation.LabelBounds, annotationSelectorSettings: this.getSettings(annotation), labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
                                customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: isPrint, isCommentLock: annotation.IsCommentLock
                            };
                            var annot = void 0;
                            // tslint:disable-next-line
                            var vPoints = annotationObject.vertexPoints;
                            if (vertexPoints == null) {
                                vPoints = [];
                            }
                            // tslint:disable-next-line:max-line-length
                            annotation.AnnotationSelectorSettings = annotation.AnnotationSelectorSettings ? annotation.AnnotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                            annot = {
                                // tslint:disable-next-line:max-line-length
                                id: 'shape' + this.shapeCount, shapeAnnotationType: this.getShapeType(annotationObject), author: annotationObject.author, allowedInteractions: annotationObject.allowedInteractions, modifiedDate: annotationObject.modifiedDate, annotName: annotationObject.annotName,
                                subject: annotationObject.subject, notes: annotationObject.note, fillColor: annotationObject.fillColor, strokeColor: annotationObject.strokeColor, opacity: annotationObject.opacity,
                                // tslint:disable-next-line:max-line-length
                                thickness: annotationObject.thickness, borderStyle: annotationObject.borderStyle, borderDashArray: borderDashArray, rotateAngle: parseFloat(annotationObject.rotateAngle.split('Angle')[1]), comments: annotationObject.comments, review: annotationObject.review, isCloudShape: annotationObject.isCloudShape, cloudIntensity: annotationObject.cloudIntensity, taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadEnd),
                                // tslint:disable-next-line:max-line-length
                                sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadStart), vertexPoints: vPoints, bounds: { x: annotationObject.bounds.left, y: annotationObject.bounds.top, width: annotationObject.bounds.width, height: annotationObject.bounds.height },
                                pageIndex: pageNumber,
                                // tslint:disable-next-line:max-line-length
                                labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
                                fontColor: annotation.FontColor, labelBorderColor: annotation.LabelBorderColor, fontSize: annotation.FontSize,
                                labelBounds: annotation.LabelBounds, annotationSelectorSettings: annotation.AnnotationSelectorSettings,
                                annotationSettings: annotationObject.annotationSettings, annotationAddMode: annotation.annotationAddMode,
                                isPrint: annotation.IsPrint, isCommentLock: annotationObject.isCommentLock
                            };
                            var addedAnnot = this.pdfViewer.add(annot);
                            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape');
                        }
                    }
                }
            }
            else if (shapeAnnotations.shapeAnnotationType) {
                var annotationObject = this.createAnnotationObject(shapeAnnotations);
                this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape');
                this.pdfViewer.annotationModule.triggerAnnotationAdd(shapeAnnotations);
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    ShapeAnnotation.prototype.getSettings = function (annotation) {
        var selector = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        }
        else {
            selector = this.getSelector(annotation.ShapeAnnotationType, annotation.Subject);
        }
        return selector;
    };
    /**
     * @private
     */
    ShapeAnnotation.prototype.setAnnotationType = function (type) {
        this.updateShapeProperties();
        this.pdfViewerBase.disableTextSelectionMode();
        var author = 'Guest';
        switch (type) {
            case 'Line':
                this.currentAnnotationMode = 'Line';
                // tslint:disable-next-line:max-line-length
                var modifiedDateLine = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.lineSettings.author ? this.pdfViewer.lineSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: this.setShapeType('Line'), fillColor: this.lineFillColor, notes: '', strokeColor: this.lineStrokeColor, opacity: this.lineOpacity,
                    thickness: this.lineThickness, modifiedDate: modifiedDateLine, borderDashArray: this.lineDashArray.toString(),
                    // tslint:disable-next-line:max-line-length
                    sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.lineStartHead.toString()), taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.lineEndHead.toString()),
                    author: author, subject: 'Line', lineHeadStart: this.lineStartHead, lineHeadEnd: this.lineEndHead, isCommentLock: false
                };
                this.pdfViewer.tool = 'Line';
                break;
            case 'Arrow':
                this.currentAnnotationMode = 'Arrow';
                // tslint:disable-next-line:max-line-length
                var modifiedDateArrow = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.arrowSettings.author ? this.pdfViewer.arrowSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    shapeAnnotationType: this.setShapeType('Arrow'), opacity: this.arrowOpacity,
                    // tslint:disable-next-line:max-line-length
                    sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.arrowStartHead.toString()),
                    taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.arrowEndHead.toString()),
                    // tslint:disable-next-line:max-line-length
                    fillColor: this.arrowFillColor, strokeColor: this.arrowStrokeColor, notes: '', thickness: this.arrowThickness,
                    borderDashArray: this.arrowDashArray.toString(), author: author, subject: 'Arrow',
                    // tslint:disable-next-line:max-line-length
                    modifiedDate: modifiedDateArrow, lineHeadStart: this.arrowStartHead, lineHeadEnd: this.arrowEndHead, isCommentLock: false
                };
                this.pdfViewer.tool = 'Line';
                break;
            case 'Rectangle':
                this.currentAnnotationMode = 'Rectangle';
                // tslint:disable-next-line:max-line-length
                var modifiedDateRect = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.rectangleSettings.author ? this.pdfViewer.rectangleSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    shapeAnnotationType: this.setShapeType('Rectangle'), strokeColor: this.rectangleStrokeColor,
                    fillColor: this.rectangleFillColor, opacity: this.rectangleOpacity, notes: '',
                    thickness: this.rectangleThickness, borderDashArray: '0', modifiedDate: modifiedDateRect,
                    author: author, subject: 'Rectangle', isCommentLock: false
                };
                this.pdfViewer.tool = 'DrawTool';
                break;
            case 'Circle':
                this.currentAnnotationMode = 'Circle';
                // tslint:disable-next-line:max-line-length
                var modifiedDateCir = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.circleSettings.author ? this.pdfViewer.circleSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    shapeAnnotationType: this.setShapeType('Circle'), strokeColor: this.circleStrokeColor,
                    fillColor: this.circleFillColor, opacity: this.circleOpacity, notes: '',
                    thickness: this.circleThickness, borderDashArray: '0', modifiedDate: modifiedDateCir,
                    author: author, subject: 'Circle', isCommentLock: false
                };
                this.pdfViewer.tool = 'DrawTool';
                break;
            case 'Polygon':
                this.currentAnnotationMode = 'Polygon';
                // tslint:disable-next-line:max-line-length
                var modifiedDatePolygon = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.polygonSettings.author ? this.pdfViewer.polygonSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    strokeColor: this.polygonStrokeColor, fillColor: this.polygonFillColor,
                    opacity: this.polygonOpacity, thickness: this.polygonThickness, borderDashArray: '0',
                    notes: '', author: author, subject: 'Polygon',
                    modifiedDate: modifiedDatePolygon, borderStyle: '', isCommentLock: false
                };
                this.pdfViewer.tool = 'Polygon';
                break;
        }
    };
    ShapeAnnotation.prototype.updateShapeProperties = function () {
        this.lineFillColor = this.pdfViewer.lineSettings.fillColor ? this.pdfViewer.lineSettings.fillColor : '#ffffff00';
        this.lineStrokeColor = this.pdfViewer.lineSettings.strokeColor ? this.pdfViewer.lineSettings.strokeColor : '#ff0000';
        this.lineThickness = this.pdfViewer.lineSettings.thickness ? this.pdfViewer.lineSettings.thickness : 1;
        this.lineOpacity = this.pdfViewer.lineSettings.opacity ? this.pdfViewer.lineSettings.opacity : 1;
        this.lineDashArray = this.pdfViewer.lineSettings.borderDashArray ? this.pdfViewer.lineSettings.borderDashArray : 0;
        this.lineStartHead = this.pdfViewer.lineSettings.lineHeadStartStyle ? this.pdfViewer.lineSettings.lineHeadStartStyle : 'None';
        this.lineEndHead = this.pdfViewer.lineSettings.lineHeadEndStyle ? this.pdfViewer.lineSettings.lineHeadEndStyle : 'None';
        this.arrowFillColor = this.pdfViewer.arrowSettings.fillColor ? this.pdfViewer.arrowSettings.fillColor : '#ffffff00';
        this.arrowStrokeColor = this.pdfViewer.arrowSettings.strokeColor ? this.pdfViewer.arrowSettings.strokeColor : '#ff0000';
        this.arrowThickness = this.pdfViewer.arrowSettings.thickness ? this.pdfViewer.arrowSettings.thickness : 1;
        this.arrowOpacity = this.pdfViewer.arrowSettings.opacity ? this.pdfViewer.arrowSettings.opacity : 1;
        this.arrowDashArray = this.pdfViewer.arrowSettings.borderDashArray ? this.pdfViewer.arrowSettings.borderDashArray : 0;
        this.arrowStartHead = this.pdfViewer.arrowSettings.lineHeadStartStyle ? this.pdfViewer.arrowSettings.lineHeadStartStyle : 'Closed';
        this.arrowEndHead = this.pdfViewer.arrowSettings.lineHeadEndStyle ? this.pdfViewer.arrowSettings.lineHeadEndStyle : 'Closed';
        this.rectangleFillColor = this.pdfViewer.rectangleSettings.fillColor ? this.pdfViewer.rectangleSettings.fillColor : '#ffffff00';
        this.rectangleStrokeColor = this.pdfViewer.rectangleSettings.strokeColor ? this.pdfViewer.rectangleSettings.strokeColor : '#ff0000';
        this.rectangleThickness = this.pdfViewer.rectangleSettings.thickness ? this.pdfViewer.rectangleSettings.thickness : 1;
        this.rectangleOpacity = this.pdfViewer.rectangleSettings.opacity ? this.pdfViewer.rectangleSettings.opacity : 1;
        this.circleFillColor = this.pdfViewer.circleSettings.fillColor ? this.pdfViewer.circleSettings.fillColor : '#ffffff00';
        this.circleStrokeColor = this.pdfViewer.circleSettings.strokeColor ? this.pdfViewer.circleSettings.strokeColor : '#ff0000';
        this.circleThickness = this.pdfViewer.circleSettings.thickness ? this.pdfViewer.circleSettings.thickness : 1;
        this.circleOpacity = this.pdfViewer.circleSettings.opacity ? this.pdfViewer.circleSettings.opacity : 1;
        this.polygonFillColor = this.pdfViewer.polygonSettings.fillColor ? this.pdfViewer.polygonSettings.fillColor : '#ffffff00';
        this.polygonStrokeColor = this.pdfViewer.polygonSettings.strokeColor ? this.pdfViewer.polygonSettings.strokeColor : '#ff0000';
        this.polygonThickness = this.pdfViewer.polygonSettings.thickness ? this.pdfViewer.polygonSettings.thickness : 1;
        this.polygonOpacity = this.pdfViewer.polygonSettings.opacity ? this.pdfViewer.polygonSettings.opacity : 1;
    };
    ShapeAnnotation.prototype.setShapeType = function (shape) {
        var shapeType;
        switch (shape) {
            case 'Line':
                shapeType = 'Line';
                break;
            case 'Circle':
                shapeType = 'Ellipse';
                break;
            case 'Square':
                shapeType = 'Rectangle';
                break;
            case 'Polyline':
                shapeType = 'Line';
                break;
            case 'Arrow':
                shapeType = 'LineWidthArrowHead';
                break;
        }
        return shapeType;
    };
    ShapeAnnotation.prototype.getShapeType = function (shape) {
        var shapeType;
        switch (shape.shapeAnnotationType) {
            case 'Line':
                shapeType = 'Line';
                break;
            case 'Circle':
                shapeType = 'Ellipse';
                break;
            case 'Square':
                shapeType = 'Rectangle';
                break;
            case 'Polyline':
                shapeType = 'Line';
                break;
            case 'Polygon':
                shapeType = 'Polygon';
                break;
        }
        // tslint:disable-next-line:max-line-length
        if ((shape.shapeAnnotationType === 'Line' || shape.shapeAnnotationType === 'Polyline') && (shape.lineHeadStart !== 'None' || shape.lineHeadEnd !== 'None')) {
            shapeType = 'LineWidthArrowHead';
        }
        return shapeType;
    };
    ShapeAnnotation.prototype.getShapeAnnotType = function (shape) {
        var shapeType;
        switch (shape) {
            case 'Line':
            case 'LineWidthArrowHead':
                shapeType = 'Line';
                break;
            case 'Rectangle':
                shapeType = 'Square';
                break;
            case 'Ellipse':
                shapeType = 'Circle';
                break;
            case 'Polygon':
                shapeType = 'Polygon';
                break;
        }
        return shapeType;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    ShapeAnnotation.prototype.modifyInCollection = function (property, pageNumber, annotationBase) {
        this.pdfViewer.isDocumentEdited = true;
        var currentAnnotObject = null;
        if (annotationBase) {
            if (property === 'bounds') {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, true);
            }
        }
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (var i = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        if (pageAnnotations[i].shapeAnnotationType === 'Line') {
                            pageAnnotations[i].vertexPoints = annotationBase.vertexPoints;
                        }
                        else if (pageAnnotations[i].shapeAnnotationType === 'Polygon') {
                            pageAnnotations[i].vertexPoints = annotationBase.vertexPoints;
                            // tslint:disable-next-line:max-line-length
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        }
                        if (pageAnnotations[i].enableShapeLabel === true && annotationBase.wrapper) {
                            var labelTop = 0;
                            var labelLeft = 0;
                            var labelWidth = 0;
                            var labelHeight = 24.6;
                            var labelMaxWidth = 151;
                            if (annotationBase.wrapper.bounds.width) {
                                // tslint:disable-next-line:max-line-length
                                labelWidth = (annotationBase.wrapper.bounds.width / 2);
                                labelWidth = (labelWidth > 0 && labelWidth < labelMaxWidth) ? labelWidth : labelMaxWidth;
                            }
                            if (annotationBase.wrapper.bounds.left) {
                                // tslint:disable-next-line:max-line-length
                                labelLeft = (annotationBase.wrapper.bounds.left + (annotationBase.wrapper.bounds.width / 2) - (labelWidth / 2));
                            }
                            if (annotationBase.wrapper.bounds.top) {
                                // tslint:disable-next-line:max-line-length
                                labelTop = (annotationBase.wrapper.bounds.top + (annotationBase.wrapper.bounds.height / 2) - 12.3);
                            }
                            // tslint:disable-next-line:max-line-length
                            pageAnnotations[i].labelBounds = { left: labelLeft, top: labelTop, width: labelWidth, height: labelHeight, right: 0, bottom: 0 };
                        }
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
                    else if (property === 'dashArray') {
                        pageAnnotations[i].borderDashArray = annotationBase.wrapper.children[0].style.strokeDashArray;
                        pageAnnotations[i].borderStyle = annotationBase.borderStyle;
                    }
                    else if (property === 'startArrow') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].lineHeadStart = this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.sourceDecoraterShapes);
                    }
                    else if (property === 'endArrow') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].lineHeadEnd = this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.taregetDecoraterShapes);
                    }
                    else if (property === 'notes') {
                        pageAnnotations[i].note = annotationBase.notes;
                    }
                    else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    else if (property === 'labelContent') {
                        pageAnnotations[i].note = annotationBase.labelContent;
                        pageAnnotations[i].labelContent = annotationBase.labelContent;
                        break;
                    }
                    else if (property === 'fontColor') {
                        pageAnnotations[i].fontColor = annotationBase.fontColor;
                    }
                    else if (property === 'fontSize') {
                        pageAnnotations[i].fontSize = annotationBase.fontSize;
                    }
                    pageAnnotations[i].modifiedDate = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], pageNumber);
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    };
    /**
     * @private
     */
    ShapeAnnotation.prototype.addInCollection = function (pageNumber, annotationBase) {
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
    };
    /**
     * @private
     */
    ShapeAnnotation.prototype.saveShapeAnnotations = function () {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape'];
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
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].vertexPoints = JSON.stringify(this.pdfViewer.annotation.getVertexPoints(pageAnnotationObject.annotations[z].vertexPoints, pageAnnotationObject.pageIndex));
                        if (pageAnnotationObject.annotations[z].rectangleDifference !== null) {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotationObject.annotations[z].rectangleDifference = JSON.stringify(pageAnnotationObject.annotations[z].rectangleDifference);
                        }
                        if (pageAnnotationObject.annotations[z].enableShapeLabel === true) {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotationObject.annotations[z].labelBounds = JSON.stringify(this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(JSON.parse(pageAnnotationObject.annotations[z].bounds)));
                            var labelFillColorString = pageAnnotationObject.annotations[z].labelFillColor;
                            pageAnnotationObject.annotations[z].labelFillColor = JSON.stringify(this.getRgbCode(labelFillColorString));
                            var labelBorderColorString = pageAnnotationObject.annotations[z].labelBorderColor;
                            pageAnnotationObject.annotations[z].labelBorderColor = JSON.stringify(this.getRgbCode(labelBorderColorString));
                            var fontColorString = pageAnnotationObject.annotations[z].fontColor;
                            pageAnnotationObject.annotations[z].fontColor = JSON.stringify(this.getRgbCode(fontColorString));
                        }
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    };
    ShapeAnnotation.prototype.manageAnnotations = function (pageAnnotations, pageNumber) {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape'];
        }
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape');
            }
            var index = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            var annotationStringified = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape'] = annotationStringified;
            }
            else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_shape', annotationStringified);
            }
        }
    };
    ShapeAnnotation.prototype.createAnnotationObject = function (annotationModel) {
        var bound;
        var labelBound;
        var annotationName = this.pdfViewer.annotation.createGUID();
        // tslint:disable-next-line:max-line-length
        var commentsDivid = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('shape', (annotationModel.pageIndex + 1), annotationModel.shapeAnnotationType);
        if (commentsDivid) {
            document.getElementById(commentsDivid).id = annotationName;
        }
        annotationModel.annotName = annotationName;
        if (annotationModel.wrapper.bounds) {
            bound = {
                // tslint:disable-next-line:max-line-length
                left: annotationModel.wrapper.bounds.x, top: annotationModel.wrapper.bounds.y, height: annotationModel.wrapper.bounds.height, width: annotationModel.wrapper.bounds.width,
                right: annotationModel.wrapper.bounds.right, bottom: annotationModel.wrapper.bounds.bottom
            };
            labelBound = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(annotationModel.wrapper.bounds);
        }
        else {
            bound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
            labelBound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
        }
        if (annotationModel.subject === 'Line' && annotationModel.shapeAnnotationType === 'Polygon') {
            annotationModel.author = this.pdfViewer.annotationModule.updateAnnotationAuthor('shape', 'Polygon');
        }
        else {
            annotationModel.author = this.pdfViewer.annotationModule.updateAnnotationAuthor('shape', annotationModel.subject);
        }
        this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(annotationName, annotationModel.notes);
        // tslint:disable-next-line:radix
        var borderDashArray = parseInt(annotationModel.borderDashArray);
        borderDashArray = isNaN(borderDashArray) ? 0 : borderDashArray;
        // tslint:disable-next-line
        var annotationSettings = this.pdfViewer.annotationModule.findAnnotationSettings(annotationModel, true);
        annotationModel.isPrint = annotationSettings.isPrint;
        return {
            // tslint:disable-next-line:max-line-length
            id: annotationModel.id, shapeAnnotationType: this.getShapeAnnotType(annotationModel.shapeAnnotationType), author: annotationModel.author, allowedInteractions: this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotationModel), subject: annotationModel.subject, note: annotationModel.notes,
            strokeColor: annotationModel.strokeColor, annotName: annotationName, comments: [], review: { state: '', stateModel: '', modifiedDate: this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime(), author: annotationModel.author },
            fillColor: annotationModel.fillColor, opacity: annotationModel.opacity, thickness: annotationModel.thickness,
            // tslint:disable-next-line:max-line-length
            borderStyle: annotationModel.borderStyle, borderDashArray: borderDashArray, bounds: bound, modifiedDate: this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime(),
            rotateAngle: 'RotateAngle' + annotationModel.rotateAngle, isCloudShape: annotationModel.isCloudShape, cloudIntensity: annotationModel.cloudIntensity,
            // tslint:disable-next-line:max-line-length
            vertexPoints: annotationModel.vertexPoints, lineHeadStart: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.sourceDecoraterShapes),
            lineHeadEnd: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.taregetDecoraterShapes), rectangleDifference: [], isLocked: annotationSettings.isLock,
            // tslint:disable-next-line:max-line-length
            labelContent: annotationModel.labelContent, enableShapeLabel: annotationModel.enableShapeLabel, labelFillColor: annotationModel.labelFillColor,
            fontColor: annotationModel.fontColor, labelBorderColor: annotationModel.labelBorderColor, fontSize: annotationModel.fontSize,
            // tslint:disable-next-line:max-line-length
            labelBounds: labelBound, annotationSelectorSettings: this.getSelector(annotationModel.shapeAnnotationType, annotationModel.subject), labelSettings: this.pdfViewer.shapeLabelSettings, annotationSettings: annotationSettings,
            customData: this.pdfViewer.annotation.getShapeData(annotationModel.shapeAnnotationType, annotationModel.subject), isPrint: annotationModel.isPrint, isCommentLock: annotationModel.isCommentLock
        };
    };
    ShapeAnnotation.prototype.getSelector = function (type, subject) {
        var selector = this.pdfViewer.annotationSelectorSettings;
        if (type === 'Line' && subject !== 'Arrow' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.lineSettings.annotationSelectorSettings;
        }
        else if ((type === 'LineWidthArrowHead' || subject === 'Arrow') && this.pdfViewer.lineSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.arrowSettings.annotationSelectorSettings;
        }
        else if ((type === 'Rectangle' || type === 'Square') && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.rectangleSettings.annotationSelectorSettings;
        }
        else if ((type === 'Ellipse' || type === 'Circle') && this.pdfViewer.circleSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.circleSettings.annotationSelectorSettings;
        }
        else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.polygonSettings.annotationSelectorSettings;
        }
        return selector;
    };
    // tslint:disable-next-line
    ShapeAnnotation.prototype.getAnnotations = function (pageIndex, shapeAnnotations) {
        // tslint:disable-next-line
        var annotationCollection;
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape'];
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
    ShapeAnnotation.prototype.getRgbCode = function (colorString) {
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
    ShapeAnnotation.prototype.saveImportedShapeAnnotations = function (annotation, pageNumber) {
        var annotationObject = null;
        var vertexPoints = null;
        annotation.Author = this.pdfViewer.annotationModule.updateAnnotationAuthor('shape', annotation.Subject);
        if (annotation.VertexPoints) {
            vertexPoints = [];
            for (var j = 0; j < annotation.VertexPoints.length; j++) {
                var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                vertexPoints.push(point);
            }
        }
        if (annotation.Bounds && annotation.EnableShapeLabel === true) {
            // tslint:disable-next-line:max-line-length
            annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
            // tslint:disable-next-line:max-line-length
            annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
            annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
            annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
            annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
            annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
        }
        // tslint:disable-next-line:max-line-length
        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        // tslint:disable-next-line:max-line-length
        annotation.allowedInteractions = this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        // tslint:disable-next-line:max-line-length
        annotationObject = {
            id: 'shape', shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
            // tslint:disable-next-line:max-line-length
            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
            // tslint:disable-next-line:max-line-length
            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, annotName: annotation.AnnotName,
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
            labelBorderColor: annotation.LabelBorderColor, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
            // tslint:disable-next-line:max-line-length
            labelBounds: annotation.LabelBounds, annotationSelectorSettings: this.getSettings(annotation), labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
            customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape');
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    ShapeAnnotation.prototype.updateShapeAnnotationCollections = function (annotation, pageNumber) {
        // tslint:disable-next-line
        var annotationObject = null;
        var vertexPoints = null;
        if (annotation.VertexPoints) {
            vertexPoints = [];
            for (var j = 0; j < annotation.VertexPoints.length; j++) {
                var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                vertexPoints.push(point);
            }
        }
        if (annotation.Bounds && annotation.EnableShapeLabel === true) {
            // tslint:disable-next-line:max-line-length
            annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
            // tslint:disable-next-line:max-line-length
            annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
            annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
            annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
            annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
            annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
        }
        // tslint:disable-next-line:max-line-length
        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        // tslint:disable-next-line:max-line-length
        annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions : this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
        // tslint:disable-next-line:max-line-length
        annotationObject = {
            id: 'shape', shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, allowedInteractions: annotation.allowedInteractions, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
            // tslint:disable-next-line:max-line-length
            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
            // tslint:disable-next-line:max-line-length
            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author), review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author }, annotationId: annotation.AnnotName,
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
            labelBorderColor: annotation.LabelBorderColor, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
            // tslint:disable-next-line:max-line-length
            labelBounds: annotation.LabelBounds, pageNumber: pageNumber, labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
            customData: this.pdfViewer.annotation.getCustomData(annotation), isPrint: annotation.IsPrint
        };
        return annotationObject;
    };
    return ShapeAnnotation;
}());
export { ShapeAnnotation };
