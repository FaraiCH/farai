import { createElement, Browser, isBlazor } from '@syncfusion/ej2-base';
import { Toolbar as Tool, Menu } from '@syncfusion/ej2-navigations';
// tslint:disable-next-line:max-line-length
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, Slider } from '@syncfusion/ej2-inputs';
import { cloneObject } from '../drawing/drawing-util';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DynamicStampItem, SignStampItem, StandardBusinessStampItem } from '../base/types';
/**
 * @hidden
 */
var AnnotationToolbar = /** @class */ (function () {
    function AnnotationToolbar(viewer, viewerBase, toolbar) {
        var _this = this;
        this.toolbarBorderHeight = 1;
        /**
         * @private
         */
        this.isToolbarHidden = false;
        /**
         * @private
         */
        this.isMobileAnnotEnabled = false;
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        this.isHighlightBtnVisible = true;
        this.isUnderlineBtnVisible = true;
        this.isStrikethroughBtnVisible = true;
        this.isColorToolVisible = true;
        this.isOpacityToolVisible = true;
        this.isDeleteAnnotationToolVisible = true;
        this.isCurrentAnnotationOpacitySet = false;
        this.isStampBtnVisible = false;
        this.isShapeBtnVisible = false;
        this.isSignatureBtnVisible = false;
        this.isInkBtnVisible = false;
        this.isFontFamilyToolVisible = false;
        this.isFontSizeToolVisible = false;
        this.isFontAlignToolVisible = false;
        this.isFontColorToolVisible = false;
        this.isFontStylesToolVisible = false;
        this.isCommentPanelBtnVisible = false;
        this.isFreeTextBtnVisible = false;
        this.isCalibrateBtnVisible = false;
        this.isStrokeColorToolVisible = false;
        this.isThicknessToolVisible = false;
        this.stampMenu = [];
        this.stampParentID = '';
        /**
         * @private
         */
        this.inkAnnotationSelected = false;
        /**
         * @private
         */
        this.openSignaturePopup = false;
        // tslint:disable-next-line
        this.addStampImage = function (args) {
            // tslint:disable-next-line
            var proxy = _this;
            // tslint:disable-next-line
            var upoadedFiles = args.target.files;
            if (args.target.files[0] !== null) {
                var uploadedFile = upoadedFiles[0];
                if (uploadedFile.type.split('/')[0] === 'image') {
                    var reader = new FileReader();
                    // tslint:disable-next-line
                    reader.onload = function (e) {
                        var uploadedFileUrl = e.currentTarget.result;
                        proxy.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                        proxy.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                        proxy.pdfViewerBase.stampAdded = true;
                        _this.pdfViewer.annotationModule.stampAnnotationModule.createCustomStampAnnotation(uploadedFileUrl);
                        proxy.pdfViewerBase.stampAdded = false;
                    };
                    reader.readAsDataURL(uploadedFile);
                }
            }
        };
        this.onShapeToolbarClicked = function (args) {
            var elementId = _this.pdfViewer.element.id;
            var shapeAnnotationModule = _this.pdfViewer.annotation.shapeAnnotationModule;
            _this.deselectAllItems();
            _this.resetFreeTextAnnot();
            switch (args.originalEvent.target.id) {
                case elementId + '_shape_line':
                case elementId + '_shape_lineIcon':
                    shapeAnnotationModule.setAnnotationType('Line');
                    _this.onShapeDrawSelection(true);
                    _this.updateColorInIcon(_this.colorDropDownElement, shapeAnnotationModule.lineFillColor);
                    _this.updateColorInIcon(_this.strokeDropDownElement, shapeAnnotationModule.lineStrokeColor);
                    break;
                case elementId + '_shape_arrow':
                case elementId + '_shape_arrowIcon':
                    shapeAnnotationModule.setAnnotationType('Arrow');
                    _this.onShapeDrawSelection(true);
                    _this.updateColorInIcon(_this.colorDropDownElement, shapeAnnotationModule.arrowFillColor);
                    _this.updateColorInIcon(_this.strokeDropDownElement, shapeAnnotationModule.arrowStrokeColor);
                    break;
                case elementId + '_shape_rectangle':
                case elementId + '_shape_rectangleIcon':
                    shapeAnnotationModule.setAnnotationType('Rectangle');
                    _this.onShapeDrawSelection(true);
                    _this.updateColorInIcon(_this.colorDropDownElement, shapeAnnotationModule.rectangleFillColor);
                    _this.updateColorInIcon(_this.strokeDropDownElement, shapeAnnotationModule.rectangleStrokeColor);
                    break;
                case elementId + '_shape_circle':
                case elementId + '_shape_circleIcon':
                    shapeAnnotationModule.setAnnotationType('Circle');
                    _this.onShapeDrawSelection(true);
                    _this.updateColorInIcon(_this.colorDropDownElement, shapeAnnotationModule.circleFillColor);
                    _this.updateColorInIcon(_this.strokeDropDownElement, shapeAnnotationModule.circleStrokeColor);
                    break;
                case elementId + '_shape_pentagon':
                case elementId + '_shape_pentagonIcon':
                    shapeAnnotationModule.setAnnotationType('Polygon');
                    _this.onShapeDrawSelection(true);
                    _this.updateColorInIcon(_this.colorDropDownElement, shapeAnnotationModule.polygonFillColor);
                    _this.updateColorInIcon(_this.strokeDropDownElement, shapeAnnotationModule.polygonStrokeColor);
                    break;
            }
            // this.pdfViewer.clearSelection();
        };
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
        this.primaryToolbar = toolbar;
    }
    /**
     * @private
     */
    AnnotationToolbar.prototype.initializeAnnotationToolbar = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        this.toolbar = new Tool({
            width: '', height: '', overflowMode: 'Popup',
            items: this.createToolbarItems(), clicked: this.onToolbarClicked.bind(this),
            created: function () {
                _this.createDropDowns();
            }
        });
        this.toolbar.isStringTemplate = true;
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.appendTo(this.toolbarElement);
        this.afterToolbarCreation();
        this.createStampContainer();
        this.createSignContainer();
        this.showAnnotationToolbar(null);
        this.applyAnnotationToolbarSettings();
        this.updateToolbarItems();
    };
    AnnotationToolbar.prototype.createMobileAnnotationToolbar = function (isEnable, isPath) {
        var _this = this;
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            if (this.toolbarElement == null && isEnable) {
                this.isMobileAnnotEnabled = true;
                // tslint:disable-next-line:max-line-length
                this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
                this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
                this.toolbar = new Tool({
                    width: '', height: '', overflowMode: 'Popup',
                    items: this.createMobileToolbarItems(isPath), clicked: this.onToolbarClicked.bind(this),
                    created: function () {
                        _this.createDropDowns(isPath);
                    }
                });
                this.toolbar.isStringTemplate = true;
                if (this.pdfViewer.enableRtl) {
                    this.toolbar.enableRtl = true;
                }
                this.pdfViewerBase.navigationPane.goBackToToolbar();
                this.pdfViewer.toolbarModule.showToolbar(false);
                this.toolbar.appendTo(this.toolbarElement);
                this.deleteItem = this.pdfViewerBase.getElement('_annotation_delete');
                this.deleteItem.firstElementChild.id = this.pdfViewer.element.id + '_annotation_delete';
            }
            else if (this.toolbarElement != null) {
                if (isEnable) {
                    this.isMobileAnnotEnabled = true;
                    this.pdfViewerBase.navigationPane.goBackToToolbar();
                    this.pdfViewer.toolbarModule.showToolbar(false);
                    this.toolbarElement.style.display = 'block';
                }
                else if (!isEnable) {
                    this.isMobileAnnotEnabled = false;
                    this.pdfViewer.toolbarModule.showToolbar(true);
                    this.hideMobileAnnotationToolbar();
                }
            }
        }
        else {
            this.isMobileAnnotEnabled = true;
        }
    };
    AnnotationToolbar.prototype.hideMobileAnnotationToolbar = function () {
        if (this.toolbarElement != null) {
            this.toolbarElement.style.display = 'none';
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.createMobileToolbarItems = function (isPath) {
        var colorTemplate = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        var opacityTemplate = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        // tslint:disable-next-line
        var items = [];
        items.push({ prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) });
        // tslint:disable-next-line:max-line-length
        if (!isPath) {
            items.push({ template: colorTemplate, align: 'right' });
            items.push({ template: opacityTemplate, align: 'right' });
            items.push({ type: 'Separator', align: 'right' });
        }
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'right' });
        return items;
    };
    AnnotationToolbar.prototype.goBackToToolbar = function () {
        this.isMobileAnnotEnabled = false;
        this.hideMobileAnnotationToolbar();
        this.pdfViewer.toolbarModule.showToolbar(true);
        var page = this.pdfViewerBase.getSelectTextMarkupCurrentPage();
        if (page) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(page);
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.createToolbarItems = function () {
        var colorTemplate = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        var strokeTemplate = this.getTemplate('span', '_annotation_stroke', 'e-pv-annotation-stroke-container');
        var thicknessTemplate = this.getTemplate('span', '_annotation_thickness', 'e-pv-annotation-thickness-container');
        var opacityTemplate = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        var shapesTemplate = this.getTemplate('span', '_annotation_shapes', 'e-pv-annotation-shapes-container');
        var calibrateTemplate = this.getTemplate('span', '_annotation_calibrate', 'e-pv-annotation-calibrate-container');
        var stampTemplate = this.getTemplate('span', '_annotation_stamp', 'e-pv-annotation-stamp-container');
        var fontFamilyTemplate = this.getTemplate('input', '_annotation_fontname', 'e-pv-annotation-fontname-container');
        var fontSizeTemplate = this.getTemplate('input', '_annotation_fontsize', 'e-pv-annotation-fontsize-container');
        var textColorTemplate = this.getTemplate('span', '_annotation_textcolor', 'e-pv-annotation-textcolor-container');
        var alignmentTemplate = this.getTemplate('span', '_annotation_textalign', 'e-pv-annotation-textalign-container');
        var textPropertiesTemplate = this.getTemplate('span', '_annotation_textproperties', 'e-pv-annotation-textprop-container');
        var signTemplate = this.getTemplate('span', '_annotation_signature', 'e-pv-annotation-handwritten-container');
        // tslint:disable-next-line
        var items = [];
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-highlight-icon e-pv-icon', className: 'e-pv-highlight-container', id: this.pdfViewer.element.id + '_highlight', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-underline-icon e-pv-icon', className: 'e-pv-underline-container', id: this.pdfViewer.element.id + '_underline', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-strikethrough-icon e-pv-icon', className: 'e-pv-strikethrough-container', id: this.pdfViewer.element.id + '_strikethrough', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: shapesTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: calibrateTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-freetext-icon e-pv-icon', className: 'e-pv-annotation-freetextedit-container', id: this.pdfViewer.element.id + '_annotation_freeTextEdit', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: stampTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ template: signTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-inkannotation-icon e-pv-icon', className: 'e-pv-annotation-ink-container', id: this.pdfViewer.element.id + '_annotation_ink', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: fontFamilyTemplate, align: 'Left', cssClass: 'e-pv-fontfamily-container' });
        items.push({ template: fontSizeTemplate, align: 'Left', cssClass: 'e-pv-fontsize-container' });
        items.push({ template: textColorTemplate, align: 'Left' });
        items.push({ template: alignmentTemplate, align: 'Left' });
        items.push({ template: textPropertiesTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: colorTemplate, align: 'Left' });
        items.push({ template: strokeTemplate, align: 'Left' });
        items.push({ template: thicknessTemplate, align: 'Left' });
        items.push({ template: opacityTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-comment-panel-icon e-pv-icon', className: 'e-pv-comment-panel-icon-container', id: this.pdfViewer.element.id + '_annotation_commentPanel', align: 'Right' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-annotation-tools-close-icon e-pv-icon', className: 'e-pv-annotation-tools-close-container', id: this.pdfViewer.element.id + '_annotation_close', align: 'Right' });
        return items;
    };
    AnnotationToolbar.prototype.createSignContainer = function () {
        var _this = this;
        this.handWrittenSignatureItem = this.pdfViewerBase.getElement('_annotation_signature');
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.createTooltip(this.pdfViewerBase.getElement('_annotation_signature'), this.pdfViewer.localeObj.getConstant('Draw Signature'));
        // tslint:disable-next-line
        var proxy = this;
        var items = [
            {
                separator: true
            },
            {
                text: 'ADD SIGNATURE'
            }
        ];
        var saveOptions = {
            items: items,
            iconCss: 'e-pv-handwritten-icon e-pv-icon',
            cssClass: 'e-pv-handwritten-popup',
            beforeOpen: function (args) {
                proxy.updateSignatureCount();
                if (_this.openSignaturePopup) {
                    args.cancel = true;
                }
            },
            open: function (args) {
                proxy.openSignature();
            },
            beforeItemRender: function (args) {
                if (args.item.text === '') {
                    // tslint:disable-next-line:max-line-length
                    for (var collection = 0; collection < _this.pdfViewerBase.signatureModule.signaturecollection.length; collection++) {
                        args.element.style.display = 'block';
                        // tslint:disable-next-line
                        var signatureCollection = _this.pdfViewerBase.signatureModule.signaturecollection[collection];
                        // tslint:disable-next-line
                        var collectionKey = signatureCollection["sign_" + collection];
                        if (collectionKey !== '') {
                            // tslint:disable-next-line:max-line-length
                            args.element.innerHTML += '<div id="s' + collection + '"><span class="e-pv-align-border" id="sign_border' + collection + '"><img id="sign_' + collection + '" src="' + collectionKey + '" width="50" height="50" style="display: block;margin-left: auto;margin-right: auto;"/></span><span class="e-pv-delete e-pv-align" id="delete' + collection + '"> </span><br></br></div>';
                            args.element.style.pointerEvents = 'auto';
                            args.element.style.background = 'none';
                            _this.pdfViewerBase.getElement('_annotation_signature-popup').style.width = '240px';
                        }
                    }
                }
                if (args.item.text === 'ADD SIGNATURE') {
                    args.element.innerHTML = '<span class="e-pv-add-signature">ADD SIGNATURE</span>';
                    args.element.style.width = '240';
                    var span = args.element.children[0];
                    span.setAttribute('class', 'e-pv-align-sign');
                }
            },
            select: function (args) {
                if (args.item.text === 'ADD SIGNATURE') {
                    _this.addSignature();
                }
            }
        };
        var drpDownBtn = new DropDownButton(saveOptions);
        drpDownBtn.appendTo(this.handWrittenSignatureItem);
    };
    AnnotationToolbar.prototype.updateSignatureCount = function () {
        var count = 0;
        this.openSignaturePopup = false;
        // tslint:disable-next-line
        var signatureCollection = this.pdfViewerBase.signatureModule.signaturecollection;
        for (var collection = 0; collection < signatureCollection.length; collection++) {
            // tslint:disable-next-line
            var colletionList = signatureCollection[collection];
            if (colletionList['sign_' + collection] === '') {
                count++;
            }
        }
        if (count === signatureCollection.length || signatureCollection.length === 0) {
            this.openSignaturePopup = true;
            this.addSignature();
        }
    };
    AnnotationToolbar.prototype.openSignature = function () {
        for (var collection = 0; collection < this.pdfViewerBase.signatureModule.signaturecollection.length; collection++) {
            // tslint:disable-next-line
            var signatureCollection = this.pdfViewerBase.signatureModule.signaturecollection[collection];
            if (signatureCollection['sign_' + collection] !== '') {
                // tslint:disable-next-line
                var addedSignature = document.getElementById('sign_border' + collection + '');
                // tslint:disable-next-line
                var deleteSignature = document.getElementById('delete' + collection + '');
                deleteSignature.style.backgroundClip = 'content-box';
                addedSignature.addEventListener('click', this.renderAddedSignature.bind(this));
                deleteSignature.addEventListener('click', this.deleteSavedSign.bind(this));
                deleteSignature.addEventListener('mouseover', this.hoverSignatureDelete.bind(this));
                deleteSignature.addEventListener('mouseleave', this.leaveSignatureDelete.bind(this));
                addedSignature.addEventListener('mouseover', this.hoverSignatureDelete.bind(this));
                addedSignature.addEventListener('mouseleave', this.leaveSignatureDelete.bind(this));
            }
        }
    };
    AnnotationToolbar.prototype.hoverSignatureDelete = function () {
        var eventTarget = event.target;
        eventTarget.classList.add('e-pv-signaturehover');
    };
    AnnotationToolbar.prototype.leaveSignatureDelete = function () {
        var eventTarget = event.target;
        eventTarget.classList.remove('e-pv-signaturehover');
        if (eventTarget.children[0] && eventTarget.children[0].tagName === 'IMG') {
            eventTarget.children[0].classList.remove('e-pv-signaturehover');
        }
    };
    AnnotationToolbar.prototype.addSignature = function () {
        this.deselectAllItems();
        this.showSignaturepanel();
    };
    AnnotationToolbar.prototype.renderAddedSignature = function () {
        this.pdfViewerBase.isAddedSignClicked = true;
        this.pdfViewerBase.signatureModule.RenderSavedSignature();
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.deleteSavedSign = function (event) {
        event.stopPropagation();
        // tslint:disable-next-line
        var signaturecollection = this.pdfViewerBase.signatureModule.signaturecollection;
        for (var collection = 0; collection < signaturecollection.length; collection++) {
            if (event.target.parentElement.children[0].children[0].id === 'sign_' + collection) {
                // tslint:disable-next-line
                var RemoveSignature = signaturecollection[collection];
                RemoveSignature['sign_' + collection] = '';
                break;
            }
        }
        event.target.parentElement.remove();
    };
    AnnotationToolbar.prototype.getTemplate = function (elementName, id, className) {
        var element = createElement(elementName, { id: this.pdfViewer.element.id + id });
        if (className) {
            element.className = className;
        }
        return element.outerHTML;
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.createStampContainer = function () {
        var _this = this;
        this.stampElement = this.pdfViewerBase.getElement('_annotation_stamp');
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.createTooltip(this.pdfViewerBase.getElement('_annotation_stamp'), this.pdfViewer.localeObj.getConstant('Add Stamp'));
        var contextMenuElement = createElement('ul', { id: 'contextMenuElement' });
        this.pdfViewerBase.getElement('_annotation_stamp').appendChild(contextMenuElement);
        var items = [];
        if (this.pdfViewer.stampSettings.dynamicStamps && this.pdfViewer.stampSettings.dynamicStamps.length > 0) {
            var dynamicStamps_1 = [];
            items.push({ text: this.pdfViewer.localeObj.getConstant('Dynamic'), items: dynamicStamps_1 });
            this.pdfViewer.stampSettings.dynamicStamps.forEach(function (stampItem, index) {
                var name = DynamicStampItem[stampItem];
                switch (name) {
                    case 'NotApproved':
                        name = 'Not Approved';
                        break;
                }
                dynamicStamps_1.push({ text: name });
            });
        }
        if (this.pdfViewer.stampSettings.signStamps && this.pdfViewer.stampSettings.signStamps.length > 0) {
            var signStamps_1 = [];
            items.push({ text: this.pdfViewer.localeObj.getConstant('Sign Here'), items: signStamps_1 });
            this.pdfViewer.stampSettings.signStamps.forEach(function (stampItem, index) {
                var name = SignStampItem[stampItem];
                switch (name) {
                    case 'InitialHere':
                        name = 'Initial Here';
                        break;
                    case 'SignHere':
                        name = 'Sign Here';
                        break;
                }
                signStamps_1.push({ text: name });
            });
        }
        if (this.pdfViewer.stampSettings.standardBusinessStamps && this.pdfViewer.stampSettings.standardBusinessStamps.length > 0) {
            var standardsBusinessStamps_1 = [];
            items.push({ text: this.pdfViewer.localeObj.getConstant('Standard Business'), items: standardsBusinessStamps_1 });
            this.pdfViewer.stampSettings.standardBusinessStamps.forEach(function (stampItem, index) {
                var name = StandardBusinessStampItem[stampItem];
                switch (name) {
                    case 'NotApproved':
                        name = 'Not Approved';
                        break;
                    case 'ForPublicRelease':
                        name = 'For Public Release';
                        break;
                    case 'NotForPublicRelease':
                        name = 'Not For Public Release';
                        break;
                    case 'ForComment':
                        name = 'For Comment';
                        break;
                    case 'PreliminaryResults':
                        name = 'Preliminary Results';
                        break;
                    case 'InformationOnly':
                        name = 'Information Only';
                        break;
                }
                standardsBusinessStamps_1.push({ text: name });
            });
        }
        if (this.pdfViewer.customStampSettings.enableCustomStamp) {
            if (items.length > 0) {
                items.push({ separator: true });
            }
            items.push({ text: this.pdfViewer.localeObj.getConstant('Custom Stamp'), items: [] });
        }
        this.stampMenu = [
            {
                iconCss: 'e-pv-stamp-icon e-pv-icon',
                items: items,
            },
        ];
        var menuOptions = {
            items: this.stampMenu,
            cssClass: 'e-custom-scroll',
            showItemOnClick: true,
            enableScrolling: true,
            beforeOpen: function (args) {
                _this.resetFreeTextAnnot();
                if (args.parentItem.text === '' && _this.pdfViewer.customStampSettings.isAddToMenu && args.items.length > 0) {
                    // tslint:disable-next-line
                    var currentElements = null;
                    for (var i = 0; i < args.items.length; i++) {
                        if (args.items[i].text === _this.pdfViewer.localeObj.getConstant('Custom Stamp')) {
                            args.items[i].items = [];
                            currentElements = args.items[i];
                            break;
                        }
                    }
                    // tslint:disable-next-line
                    var elements = _this.pdfViewerBase.customStampCollection;
                    // tslint:disable-next-line
                    var stampElements = _this.pdfViewer.customStampSettings.customStamps;
                    if (elements.length === 0 && stampElements && stampElements.length > 0) {
                        for (var n = 0; n < stampElements.length; n++) {
                            // tslint:disable-next-line:max-line-length
                            elements.push({ customStampName: stampElements[n].customStampName, customStampImageSource: stampElements[n].customStampImageSource });
                        }
                    }
                    for (var m = 0; m < elements.length; m++) {
                        if (currentElements != null) {
                            currentElements.items.push({ text: elements[m].customStampName });
                        }
                    }
                }
                _this.stampParentID = args.parentItem.text;
                _this.menuItems.showItemOnClick = false;
            },
            beforeClose: function (args) {
                // tslint:disable-next-line:max-line-length
                if ((args.parentItem && args.parentItem.text !== _this.pdfViewer.localeObj.getConstant('Custom Stamp') && args.parentItem.text !== 'Standard Business' && args.parentItem.text !== 'Dynamic' && args.parentItem.text !== 'Sign Here') || !args.parentItem) {
                    _this.menuItems.showItemOnClick = true;
                }
            },
            select: function (args) {
                _this.pdfViewerBase.isAlreadyAdded = false;
                if (args.item.text === _this.pdfViewer.localeObj.getConstant('Custom Stamp')) {
                    _this.updateInteractionTools();
                    _this.checkStampAnnotations();
                    _this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                    // tslint:disable-next-line
                    var stampImage = createElement('input', { id: _this.pdfViewer.element.id + '_stampElement', attrs: { 'type': 'file' } });
                    stampImage.setAttribute('accept', '.jpg,.jpeg');
                    stampImage.style.position = 'absolute';
                    stampImage.style.left = '0px';
                    stampImage.style.top = '0px';
                    stampImage.style.visibility = 'hidden';
                    document.body.appendChild(stampImage);
                    stampImage.click();
                    stampImage.addEventListener('change', _this.addStampImage);
                    document.body.removeChild(stampImage);
                    // tslint:disable-next-line:max-line-length
                }
                else if (_this.stampParentID === _this.pdfViewer.localeObj.getConstant('Custom Stamp') && args.item.text !== '') {
                    // tslint:disable-next-line
                    var elements = _this.pdfViewerBase.customStampCollection;
                    for (var n = 0; n < elements.length; n++) {
                        if (elements[n].customStampName === args.item.text) {
                            _this.checkStampAnnotations();
                            _this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                            _this.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                            _this.pdfViewerBase.stampAdded = true;
                            _this.pdfViewerBase.isAlreadyAdded = true;
                            // tslint:disable-next-line:max-line-length
                            _this.pdfViewer.annotationModule.stampAnnotationModule.createCustomStampAnnotation(elements[n].customStampImageSource);
                            _this.pdfViewerBase.stampAdded = false;
                        }
                    }
                    // tslint:disable-next-line:max-line-length
                }
                else if (args.item.text !== _this.pdfViewer.localeObj.getConstant('Dynamic') && args.item.text !== '' && args.item.text !== 'Standard Business' && (_this.stampParentID === 'Sign Here' || args.item.text !== 'Sign Here')) {
                    _this.updateInteractionTools();
                    _this.checkStampAnnotations();
                    _this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                    _this.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                    _this.pdfViewerBase.stampAdded = true;
                    if (_this.stampParentID === _this.pdfViewer.localeObj.getConstant('Dynamic')) {
                        _this.pdfViewerBase.isDynamicStamp = true;
                        _this.pdfViewer.annotationModule.stampAnnotationModule.retrieveDynamicStampAnnotation(args.item.text);
                    }
                    else {
                        _this.pdfViewerBase.isDynamicStamp = false;
                        _this.pdfViewer.annotationModule.stampAnnotationModule.retrievestampAnnotation(args.item.text);
                    }
                }
            },
        };
        this.menuItems = new Menu(menuOptions, '#contextMenuElement');
        contextMenuElement.parentElement.classList.add('e-pv-stamp');
        return contextMenuElement;
    };
    AnnotationToolbar.prototype.checkStampAnnotations = function () {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode && this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.annotations) {
            for (var i = 0; i < this.pdfViewer.selectedItems.annotations.length; i++) {
                // tslint:disable-next-line
                var annotation = this.pdfViewer.selectedItems.annotations[i];
                // tslint:disable-next-line
                if (annotation && !annotation.annotName && !annotation.author && (annotation.shapeAnnotationType !== 'Shape' || annotation.shapeAnnotationType !== 'Image')) {
                    this.pdfViewer.remove(annotation);
                    this.pdfViewer.annotation.renderAnnotations(annotation.pageIndex, null, null, null);
                    this.pdfViewer.clearSelection(annotation.pageIndex);
                }
            }
        }
    };
    AnnotationToolbar.prototype.createDropDowns = function (isPath) {
        var _this = this;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.shapeElement = this.pdfViewerBase.getElement('_annotation_shapes');
            var shapeToolbar = this.createShapeOptions(this.shapeElement.id, true);
            // tslint:disable-next-line:max-line-length
            this.shapeDropDown = this.createDropDownButton(this.shapeElement, 'e-pv-annotation-shape-icon', shapeToolbar.element, this.pdfViewer.localeObj.getConstant('Add Shapes'));
            this.calibrateElement = this.pdfViewerBase.getElement('_annotation_calibrate');
            var calibrateToolbar = this.createShapeOptions(this.calibrateElement.id, false);
            // tslint:disable-next-line:max-line-length
            this.calibrateDropDown = this.createDropDownButton(this.calibrateElement, 'e-pv-annotation-calibrate-icon', calibrateToolbar.element, this.pdfViewer.localeObj.getConstant('Calibrate'));
        }
        if (!isPath) {
            this.colorDropDownElement = this.pdfViewerBase.getElement('_annotation_color');
            this.colorPalette = this.createColorPicker(this.colorDropDownElement.id);
            this.colorPalette.change = this.onColorPickerChange.bind(this);
            // tslint:disable-next-line:max-line-length
            this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Color edit'));
            this.colorDropDown.beforeOpen = this.colorDropDownBeforeOpen.bind(this);
            this.colorDropDown.open = this.colorDropDownOpen.bind(this);
            this.pdfViewerBase.getElement('_annotation_color-popup').addEventListener('click', this.onColorPickerCancelClick.bind(this));
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.strokeDropDownElement = this.pdfViewerBase.getElement('_annotation_stroke');
            this.strokeColorPicker = this.createColorPicker(this.strokeDropDownElement.id);
            this.strokeColorPicker.change = this.onStrokePickerChange.bind(this);
            // tslint:disable-next-line:max-line-length
            this.strokeDropDown = this.createDropDownButton(this.strokeDropDownElement, 'e-pv-annotation-stroke-icon', this.strokeColorPicker.element.parentElement, this.pdfViewer.localeObj.getConstant('Stroke edit'));
            this.strokeDropDown.beforeOpen = this.strokeDropDownBeforeOpen.bind(this);
            this.strokeDropDown.open = this.strokeDropDownOpen.bind(this);
            this.pdfViewerBase.getElement('_annotation_stroke-popup').addEventListener('click', this.onStrokePickerCancelClick.bind(this));
            this.thicknessElement = this.pdfViewerBase.getElement('_annotation_thickness');
            var thicknessContainer = this.createThicknessSlider(this.thicknessElement.id);
            // tslint:disable-next-line:max-line-length
            this.thicknessDropDown = this.createDropDownButton(this.thicknessElement, 'e-pv-annotation-thickness-icon', thicknessContainer, this.pdfViewer.localeObj.getConstant('Change thickness'));
            this.thicknessDropDown.beforeOpen = this.thicknessDropDownBeforeOpen.bind(this);
            this.thicknessSlider.change = this.thicknessChange.bind(this);
            this.thicknessSlider.changed = this.thicknessChange.bind(this);
            this.thicknessDropDown.open = this.thicknessDropDownOpen.bind(this);
        }
        if (!isPath) {
            this.opacityDropDownElement = this.pdfViewerBase.getElement('_annotation_opacity');
            var sliderContainer = this.createSlider(this.opacityDropDownElement.id);
            // tslint:disable-next-line:max-line-length
            this.opacityDropDown = this.createDropDownButton(this.opacityDropDownElement, 'e-pv-annotation-opacity-icon', sliderContainer, this.pdfViewer.localeObj.getConstant('Opacity edit'));
            this.opacityDropDown.beforeOpen = this.opacityDropDownBeforeOpen.bind(this);
            this.opacitySlider.change = this.opacityChange.bind(this);
            this.opacitySlider.changed = this.opacityChange.bind(this);
            this.opacityDropDown.open = this.opacityDropDownOpen.bind(this);
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.fontFamilyElement = this.pdfViewerBase.getElement('_annotation_fontname');
            this.createDropDownListForFamily(this.fontFamilyElement);
            this.fontFamilyElement.style.textAlign = 'left';
            this.fontFamilyElement.addEventListener('change', function () { _this.onFontFamilyChange.bind(_this); });
            this.fontSizeElement = this.pdfViewerBase.getElement('_annotation_fontsize');
            this.createDropDownListForSize(this.fontSizeElement);
            this.fontColorElement = this.pdfViewerBase.getElement('_annotation_textcolor');
            this.fontColorPalette = this.createColorPicker(this.fontColorElement.id);
            this.fontColorPalette.change = this.onFontColorChange.bind(this);
            // tslint:disable-next-line:max-line-length
            this.fontColorDropDown = this.createDropDownButton(this.fontColorElement, 'e-pv-annotation-textcolor-icon', this.fontColorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Font color'));
            this.textAlignElement = this.pdfViewerBase.getElement('_annotation_textalign');
            this.alignmentToolbar = this.createShapeOptions(this.textAlignElement.id, undefined, true);
            // tslint:disable-next-line:max-line-length
            this.textAlignDropDown = this.createDropDownButton(this.textAlignElement, 'e-pv-annotation-textalign-icon', this.alignmentToolbar.element, this.pdfViewer.localeObj.getConstant('Text Align'));
            this.textAlignDropDown.beforeOpen = this.textAlignDropDownBeforeOpen.bind(this);
            this.textPropElement = this.pdfViewerBase.getElement('_annotation_textproperties');
            this.propertiesToolbar = this.createShapeOptions(this.textPropElement.id, undefined, false, true);
            // tslint:disable-next-line:max-line-length
            this.textPropertiesDropDown = this.createPropDropDownButton(this.textPropElement, 'e-pv-annotation-textprop-icon', this.propertiesToolbar.element, this.pdfViewer.localeObj.getConstant('Text Properties'));
            this.textPropertiesDropDown.beforeOpen = this.textPropertiesDropDownBeforeOpen.bind(this);
        }
    };
    AnnotationToolbar.prototype.opacityDropDownOpen = function (args) {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            // tslint:disable-next-line:max-line-length
            var opacityElement = this.pdfViewerBase.getElement('_annotation_opacity-popup');
            opacityElement.style.left = '0px';
        }
        else {
            this.calculateToolbarPosition(args);
        }
    };
    AnnotationToolbar.prototype.onColorPickerCancelClick = function (event) {
        if (event.target.classList.contains('e-cancel')) {
            this.colorDropDown.toggle();
        }
    };
    AnnotationToolbar.prototype.onStrokePickerCancelClick = function (event) {
        if (event.target.classList.contains('e-cancel')) {
            this.strokeDropDown.toggle();
        }
    };
    AnnotationToolbar.prototype.colorDropDownBeforeOpen = function (args) {
        this.colorPalette.noColor = false;
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.colorPalette.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.color;
            }
            else {
                this.setCurrentColorInPicker();
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.colorPalette.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill;
            this.colorPalette.noColor = true;
        }
        else {
            this.setCurrentColorInPicker();
        }
        this.colorPalette.refresh();
        this.updateColorInIcon(this.colorDropDownElement, this.colorPalette.value);
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.setCurrentColorInPicker = function () {
        if (!isBlazor()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor);
                        break;
                    case 'Underline':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor);
                        break;
                    case 'Strikethrough':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor);
                        break;
                }
            }
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotationModule.shapeAnnotationModule.currentAnnotationMode) {
                    case 'Line':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.lineFillColor);
                        break;
                    case 'Arrow':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.arrowFillColor);
                        break;
                    case 'Rectangle':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.rectangleFillColor);
                        break;
                    case 'Circle':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.circleFillColor);
                        break;
                    case 'Polygon':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.colorPalette, this.pdfViewer.annotationModule.shapeAnnotationModule.polygonFillColor);
                        break;
                }
            }
            this.updateColorInIcon(this.colorDropDownElement, this.colorPalette.value);
        }
    };
    AnnotationToolbar.prototype.colorDropDownOpen = function () {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.getElement('_annotation_color-popup').style.left = '0px';
        }
        this.colorPalette.refresh();
    };
    AnnotationToolbar.prototype.strokeDropDownBeforeOpen = function (args) {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.strokeColorPicker.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor;
        }
        else {
            this.setCurrentStrokeColorInPicker();
        }
        this.strokeColorPicker.refresh();
        this.updateColorInIcon(this.strokeDropDownElement, this.strokeColorPicker.value);
        this.updateInkannotationItems();
    };
    AnnotationToolbar.prototype.setCurrentStrokeColorInPicker = function () {
        if (!isBlazor()) {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotationModule.shapeAnnotationModule.currentAnnotationMode) {
                    case 'Line':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.lineStrokeColor);
                        break;
                    case 'Arrow':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.arrowStrokeColor);
                        break;
                    case 'Rectangle':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.rectangleStrokeColor);
                        break;
                    case 'Circle':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.circleStrokeColor);
                        break;
                    case 'Polygon':
                        // tslint:disable-next-line:max-line-length
                        this.setColorInPicker(this.strokeColorPicker, this.pdfViewer.annotationModule.shapeAnnotationModule.polygonStrokeColor);
                        break;
                }
            }
        }
    };
    AnnotationToolbar.prototype.strokeDropDownOpen = function () {
        this.strokeColorPicker.refresh();
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.onFontColorChange = function (args) {
        // tslint:disable-next-line
        var currentColor;
        if (!isBlazor()) {
            currentColor = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        }
        else {
            currentColor = args[0];
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.pdfViewer.annotation.modifyFontColor(currentColor);
        }
        else {
            this.pdfViewer.freeTextSettings.fontColor = currentColor;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
        if (isBlazor()) {
            this.fontColorElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-textcolor-container');
            this.updateColorInIcon(this.fontColorElementInBlazor, currentColor);
        }
        else {
            this.updateColorInIcon(this.fontColorElement, currentColor);
            this.fontColorDropDown.toggle();
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.onFontFamilyChange = function (args) {
        var currentValue;
        if (!isBlazor()) {
            currentValue = (args && args.fontFamily && args.fontFamily.value) ? args.fontFamily.value : '';
        }
        else {
            currentValue = args;
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1 && currentValue) {
            this.pdfViewer.annotation.modifyFontFamily(currentValue);
        }
        else {
            this.pdfViewer.freeTextSettings.fontFamily = currentValue;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.onFontSizeChange = function (args) {
        var currentValue;
        if (!isBlazor()) {
            currentValue = (args && args.fontSize && args.fontSize.value) ? args.fontSize.value : '';
        }
        else {
            currentValue = args;
        }
        var fontSize = parseFloat(currentValue);
        if (this.pdfViewer.selectedItems.annotations.length === 1 && currentValue) {
            this.pdfViewer.annotation.modifyFontSize(fontSize);
        }
        else {
            this.pdfViewer.freeTextSettings.fontSize = fontSize;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
    };
    AnnotationToolbar.prototype.textAlignDropDownBeforeOpen = function (args) {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (args.element.getElementsByTagName('button') && args.element.getElementsByTagName('button').length > 0) {
                // tslint:disable-next-line
                var dropDownOptions = args.element.getElementsByTagName('button');
                // tslint:disable-next-line
                var selectedAnnotation = this.pdfViewer.selectedItems.annotations[0];
                for (var n = 0; n < dropDownOptions.length; n++) {
                    if (dropDownOptions[n]) {
                        dropDownOptions[n].classList.remove('textprop-option-active');
                        // tslint:disable-next-line:max-line-length
                        if (dropDownOptions[n].id === (this.pdfViewer.element.id + '_left_align') && selectedAnnotation.textAlign === 'Left') {
                            dropDownOptions[n].classList.add('textprop-option-active');
                        }
                        // tslint:disable-next-line:max-line-length
                        if (dropDownOptions[n].id === (this.pdfViewer.element.id + '_right_align') && selectedAnnotation.textAlign === 'Right') {
                            dropDownOptions[n].classList.add('textprop-option-active');
                        }
                        // tslint:disable-next-line:max-line-length
                        if (dropDownOptions[n].id === (this.pdfViewer.element.id + '_center_align') && selectedAnnotation.textAlign === 'Center') {
                            dropDownOptions[n].classList.add('textprop-option-active');
                        }
                        // tslint:disable-next-line:max-line-length
                        if (dropDownOptions[n].id === (this.pdfViewer.element.id + '_justify_align') && selectedAnnotation.textAlign === 'Justify') {
                            dropDownOptions[n].classList.add('textprop-option-active');
                        }
                    }
                }
            }
        }
    };
    AnnotationToolbar.prototype.textPropertiesDropDownBeforeOpen = function (args) {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (args.element.getElementsByTagName('button') && args.element.getElementsByTagName('button').length > 0) {
                // tslint:disable-next-line
                var dropDownOptions = args.element.getElementsByTagName('button');
                // tslint:disable-next-line
                var selectedAnnotation = this.pdfViewer.selectedItems.annotations[0];
                for (var n = 0; n < dropDownOptions.length; n++) {
                    if (dropDownOptions[n]) {
                        dropDownOptions[n].classList.remove('textprop-option-active');
                        if (dropDownOptions[n].id === (this.pdfViewer.element.id + '_bold') && selectedAnnotation.font.isBold) {
                            dropDownOptions[n].classList.add('textprop-option-active');
                        }
                        if (dropDownOptions[n].id === (this.pdfViewer.element.id + '_italic') && selectedAnnotation.font.isItalic) {
                            dropDownOptions[n].classList.add('textprop-option-active');
                        }
                        if (dropDownOptions[n].id === (this.pdfViewer.element.id + '_strikeout') && selectedAnnotation.font.isStrikeout) {
                            dropDownOptions[n].classList.add('textprop-option-active');
                        }
                        // tslint:disable-next-line:max-line-length
                        if (dropDownOptions[n].id === (this.pdfViewer.element.id + '_underline_textinput') && selectedAnnotation.font.isUnderline) {
                            dropDownOptions[n].classList.add('textprop-option-active');
                        }
                    }
                }
            }
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.onClickTextAlignment = function (args) {
        var currentValue;
        if (isBlazor()) {
            currentValue = args[0];
        }
        else {
            currentValue = (args && args.item && args.item.value) ? args.item.value : '';
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1 && currentValue) {
            this.pdfViewer.annotation.modifyTextAlignment(currentValue);
        }
        else {
            this.pdfViewer.freeTextSettings.textAlignment = args.item.value;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
        this.updateTextAlignInIcon(currentValue);
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.onClickTextProperties = function (args) {
        var currentValue;
        if (isBlazor()) {
            currentValue = args[0];
        }
        else {
            currentValue = (args && args.item && args.item.value) ? args.item.value : '';
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1 && currentValue) {
            var fontInfo = { isBold: undefined, isItalic: undefined, isStrikeout: undefined, isUnderline: undefined };
            if (currentValue === 'bold') {
                fontInfo.isBold = !(this.pdfViewer.selectedItems.annotations[0].font.isBold);
            }
            else if (currentValue === 'italic') {
                fontInfo.isItalic = !(this.pdfViewer.selectedItems.annotations[0].font.isItalic);
            }
            else if (currentValue === 'underline') {
                fontInfo.isUnderline = !(this.pdfViewer.selectedItems.annotations[0].font.isUnderline);
            }
            else if (currentValue === 'strikeout') {
                fontInfo.isStrikeout = !(this.pdfViewer.selectedItems.annotations[0].font.isStrikeout);
            }
            this.pdfViewer.annotation.modifyTextProperties(fontInfo, currentValue);
        }
        else {
            if (currentValue === 'bold') {
                if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isBold) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isBold = false;
                }
                else {
                    this.pdfViewer.freeTextSettings.fontStyle = 1;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            }
            else if (currentValue === 'italic') {
                if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isItalic) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isItalic = false;
                }
                else {
                    this.pdfViewer.freeTextSettings.fontStyle = 2;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            }
            else if (currentValue === 'underline') {
                if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isUnderline) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isUnderline = false;
                }
                else {
                    this.pdfViewer.freeTextSettings.fontStyle = 4;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isStrikethrough = false;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            }
            else if (currentValue === 'strikeout') {
                if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isStrikethrough) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isStrikethrough = false;
                }
                else {
                    this.pdfViewer.freeTextSettings.fontStyle = 8;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.isUnderline = false;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            }
        }
        this.updateTextPropertySelection(currentValue);
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.opacityChange = function (args) {
        var opacityValue = 1;
        if (args && args.length === 1) {
            opacityValue = args[0];
        }
        else {
            opacityValue = args.value;
        }
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                if (!isBlazor()) {
                    if (this.isCurrentAnnotationOpacitySet && args.name === 'changed') {
                        this.isCurrentAnnotationOpacitySet = false;
                    }
                    else {
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(args);
                    }
                }
                else {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(null, opacityValue);
                }
            }
            else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightOpacity = opacityValue / 100;
                        break;
                    case 'Underline':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineOpacity = opacityValue / 100;
                        break;
                    case 'Strikethrough':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughOpacity = opacityValue / 100;
                        break;
                }
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            // tslint:disable-next-line
            var currentAnnotations = this.pdfViewer.selectedItems.annotations[0];
            // tslint:disable-next-line:max-line-length
            if (currentAnnotations != null && (currentAnnotations.shapeAnnotationType === 'Stamp' || currentAnnotations.shapeAnnotationType === 'Image')) {
                var clonedObject = cloneObject(currentAnnotations);
                var redoClonedObject = cloneObject(currentAnnotations);
                redoClonedObject.opacity = opacityValue / 100;
                this.pdfViewer.nodePropertyChange(currentAnnotations, { opacity: opacityValue / 100 });
                this.pdfViewer.annotation.triggerAnnotationPropChange(currentAnnotations, false, false, false, true);
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.addAction(this.pdfViewer.selectedItems.annotations[0].pageIndex, null, this.pdfViewer.selectedItems.annotations[0], 'stampOpacity', '', clonedObject, redoClonedObject);
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotation.stampAnnotationModule.updateSessionStorage(this.pdfViewer.selectedItems.annotations[0], null, 'opacity');
            }
            else {
                if (isBlazor()) {
                    this.pdfViewer.annotation.modifyOpacity(opacityValue, true);
                }
                else {
                    if (args.name === 'changed') {
                        if (args.value !== args.previousValue) {
                            this.pdfViewer.annotation.modifyOpacity(args);
                        }
                    }
                }
            }
        }
        else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                    case 'Line':
                        this.pdfViewer.annotation.shapeAnnotationModule.lineOpacity = opacityValue / 100;
                        break;
                    case 'Arrow':
                        this.pdfViewer.annotation.shapeAnnotationModule.arrowOpacity = opacityValue / 100;
                        break;
                    case 'Rectangle':
                        this.pdfViewer.annotation.shapeAnnotationModule.rectangleOpacity = opacityValue / 100;
                        break;
                    case 'Circle':
                        this.pdfViewer.annotation.shapeAnnotationModule.circleOpacity = opacityValue / 100;
                        break;
                    case 'Polygon':
                        this.pdfViewer.annotation.shapeAnnotationModule.polygonOpacity = opacityValue / 100;
                        break;
                }
            }
            // tslint:disable-next-line
            var annotationModule = this.pdfViewer.annotation;
            if (annotationModule && annotationModule.inkAnnotationModule) {
                this.pdfViewer.inkAnnotationSettings.opacity = opacityValue / 100;
            }
            if (this.pdfViewer.drawingObject) {
                this.pdfViewer.drawingObject.opacity = opacityValue / 100;
                if (this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
                    this.pdfViewer.freeTextSettings.opacity = opacityValue / 100;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            }
        }
        if (!isBlazor) {
            this.updateOpacityIndicator();
        }
    };
    AnnotationToolbar.prototype.opacityDropDownBeforeOpen = function (args) {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.isCurrentAnnotationOpacitySet = true;
                // tslint:disable-next-line:max-line-length
                this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.opacity * 100;
            }
            else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightOpacity * 100;
                        break;
                    case 'Underline':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineOpacity * 100;
                        break;
                    case 'Strikethrough':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughOpacity * 100;
                        break;
                }
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.opacitySlider.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.opacity * 100;
        }
        else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                    case 'Line':
                        this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.lineOpacity * 100;
                        break;
                    case 'Arrow':
                        this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.arrowOpacity * 100;
                        break;
                    case 'Rectangle':
                        this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.rectangleOpacity * 100;
                        break;
                    case 'Circle':
                        this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.circleOpacity * 100;
                        break;
                    case 'Polygon':
                        this.opacitySlider.value = this.pdfViewer.annotation.shapeAnnotationModule.polygonOpacity * 100;
                        break;
                }
            }
        }
        this.updateOpacityIndicator();
        this.updateInkannotationItems();
    };
    AnnotationToolbar.prototype.thicknessDropDownBeforeOpen = function () {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.thicknessSlider.value = this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeWidth;
        }
        else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                    case 'Line':
                        this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.lineThickness;
                        break;
                    case 'Arrow':
                        this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.arrowThickness;
                        break;
                    case 'Rectangle':
                        this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.rectangleThickness;
                        break;
                    case 'Circle':
                        this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.circleThickness;
                        break;
                    case 'Polygon':
                        this.thicknessSlider.value = this.pdfViewer.annotation.shapeAnnotationModule.polygonThickness;
                        break;
                }
            }
        }
        this.updateThicknessIndicator();
        this.updateInkannotationItems();
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.thicknessDropDownOpen = function (args) {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.calculateToolbarPosition(args);
        }
    };
    AnnotationToolbar.prototype.calculateToolbarPosition = function (args) {
        if (args.element && args.element.parentElement) {
            var leftValue = parseFloat(args.element.parentElement.style.left);
            var width = args.element.parentElement.offsetWidth;
            if ((leftValue + width) < (this.pdfViewer.element.offsetWidth + 10)) {
                args.element.parentElement.style.left = (leftValue - width) + 'px';
            }
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.thicknessChangeInBlazor = function (args) {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.pdfViewer.annotation.modifyThickness(args[0]);
        }
        else {
            this.ShapeThickness(args[0]);
        }
    };
    AnnotationToolbar.prototype.thicknessChange = function (args) {
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (args.name === 'changed') {
                this.pdfViewer.annotation.modifyThickness(args.value);
            }
        }
        else {
            this.ShapeThickness(args.value);
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.ShapeThickness = function (args) {
        if (this.pdfViewer.annotation.shapeAnnotationModule) {
            switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                case 'Line':
                    this.pdfViewer.annotation.shapeAnnotationModule.lineThickness = args;
                    break;
                case 'Arrow':
                    this.pdfViewer.annotation.shapeAnnotationModule.arrowThickness = args;
                    break;
                case 'Rectangle':
                    this.pdfViewer.annotation.shapeAnnotationModule.rectangleThickness = args;
                    break;
                case 'Circle':
                    this.pdfViewer.annotation.shapeAnnotationModule.circleThickness = args;
                    break;
                case 'Polygon':
                    this.pdfViewer.annotation.shapeAnnotationModule.polygonThickness = args;
                    break;
            }
            // tslint:disable-next-line
            var annotationModule_1 = this.pdfViewer.annotation;
            if (annotationModule_1 && annotationModule_1.inkAnnotationModule) {
                this.pdfViewer.inkAnnotationSettings.thickness = args.value;
            }
            if (this.pdfViewer.drawingObject) {
                this.pdfViewer.drawingObject.thickness = args.value;
            }
            if (this.pdfViewer.drawingObject && this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
                this.pdfViewer.freeTextSettings.borderWidth = args.value;
                this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
            }
        }
        // tslint:disable-next-line
        var annotationModule = this.pdfViewer.annotation;
        if (annotationModule && annotationModule.inkAnnotationModule) {
            this.pdfViewer.inkAnnotationSettings.thickness = args;
        }
        if (this.pdfViewer.drawingObject) {
            this.pdfViewer.drawingObject.thickness = args;
        }
        if (this.pdfViewer.drawingObject && this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
            this.pdfViewer.freeTextSettings.borderWidth = args;
            this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
        }
        if (!isBlazor()) {
            this.updateThicknessIndicator();
        }
    };
    AnnotationToolbar.prototype.createDropDownButton = function (element, iconClass, target, tooltipText) {
        // tslint:disable-next-line:max-line-length
        var dropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        this.primaryToolbar.createTooltip(element, tooltipText);
        return dropDownButton;
    };
    AnnotationToolbar.prototype.createShapeOptions = function (idString, isShape, isAlign, isTextProp) {
        var toolbarElement = createElement('div', { id: idString + '_target', className: 'e-pv-shapes-toolbar' });
        document.body.appendChild(toolbarElement);
        var toolbar;
        if (isAlign) {
            toolbar = new Tool({ items: this.textAlignmentToolbarItems(), overflowMode: 'MultiRow' }, toolbarElement);
            toolbar.isStringTemplate = true;
            this.afterAlignmentToolbarCreation();
        }
        else if (isTextProp) {
            toolbar = new Tool({ items: this.textPropertiesToolbarItems(), overflowMode: 'MultiRow' }, toolbarElement);
            toolbar.isStringTemplate = true;
            this.afterPropertiesToolbarCreation();
        }
        else {
            if (isShape) {
                // tslint:disable-next-line:max-line-length
                toolbar = new Tool({ items: this.createShapeToolbarItems(), overflowMode: 'MultiRow', clicked: this.onShapeToolbarClicked.bind(this) }, toolbarElement);
                toolbar.isStringTemplate = true;
                this.afterShapeToolbarCreation();
            }
            else {
                // tslint:disable-next-line:max-line-length
                toolbar = new Tool({ items: this.createCalibrateToolbarItems(), overflowMode: 'MultiRow', clicked: this.onCalibrateToolbarClicked.bind(this) }, toolbarElement);
                toolbar.isStringTemplate = true;
                this.afterCalibrateToolbarCreation();
            }
        }
        return toolbar;
    };
    AnnotationToolbar.prototype.createPropDropDownButton = function (element, iconClass, target, tooltipText) {
        // tslint:disable-next-line:max-line-length
        var dropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target, cssClass: 'e-caret-hide' });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        this.primaryToolbar.createTooltip(element, tooltipText);
        return dropDownButton;
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.textAlignmentToolbarItems = function () {
        // tslint:disable-next-line
        var items = [];
        items.push({ prefixIcon: 'e-pv-left-align-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_left_align', align: 'Left', value: 'Left', click: this.onClickTextAlignment.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-right-align-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_right_align', align: 'Left', value: 'Right', click: this.onClickTextAlignment.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-center-align-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_center_align', align: 'Left', value: 'Center', click: this.onClickTextAlignment.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-justfiy-align-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_justify_align', align: 'Left', value: 'Justify', click: this.onClickTextAlignment.bind(this) });
        // tslint:disable-next-line:max-line-length
        return items;
    };
    AnnotationToolbar.prototype.afterAlignmentToolbarCreation = function () {
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_left_align', 'e-pv-left-align', this.pdfViewer.localeObj.getConstant('Align left'));
        this.primaryToolbar.addClassToolbarItem('_right_align', 'e-pv-right-align', this.pdfViewer.localeObj.getConstant('Align right'));
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_center_align', 'e-pv-center-align', this.pdfViewer.localeObj.getConstant('Center'));
        this.primaryToolbar.addClassToolbarItem('_justify_align', 'e-pv-justfiy-align', this.pdfViewer.localeObj.getConstant('Justify'));
    };
    AnnotationToolbar.prototype.afterPropertiesToolbarCreation = function () {
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_bold', 'e-pv-bold', this.pdfViewer.localeObj.getConstant('Bold'));
        this.primaryToolbar.addClassToolbarItem('_italic', 'e-pv-italic', this.pdfViewer.localeObj.getConstant('Italic'));
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_strikeout', 'e-pv-strikeout', this.pdfViewer.localeObj.getConstant('Strikethroughs'));
        this.primaryToolbar.addClassToolbarItem('_underline_textinput', 'e-pv-underlinetext', this.pdfViewer.localeObj.getConstant('Underlines'));
    };
    AnnotationToolbar.prototype.createDropDownListForSize = function (fontSelectElement) {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var fontSize = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px', '72px', '96px'];
        this.fontSize = new ComboBox({
            dataSource: fontSize,
            cssClass: 'e-pv-prop-dropdown',
            allowCustom: true,
            showClearButton: false,
            width: '80px',
        });
        this.fontSize.value = '16px';
        this.fontSize.appendTo(fontSelectElement);
        this.primaryToolbar.createTooltip(fontSelectElement, this.pdfViewer.localeObj.getConstant('Font size'));
        this.fontSize.addEventListener('change', function () { _this.onFontSizeChange(_this); });
    };
    AnnotationToolbar.prototype.createDropDownListForFamily = function (fontSelectElement) {
        var _this = this;
        var fontStyle = [{ FontName: 'Algerian' }, { FontName: 'Arial' },
            { FontName: 'Calibri' }, { FontName: 'Cambria' }, { FontName: 'Cambria Math' }, { FontName: 'Candara' },
            { FontName: 'Courier New' }, { FontName: 'Georgia' }, { FontName: 'Impact' }, { FontName: 'Segoe Print' },
            { FontName: 'Segoe Script' }, { FontName: 'Segoe UI' }, { FontName: 'Symbol' },
            { FontName: 'Times New Roman' }, { FontName: 'Verdana' }, { FontName: 'Windings' }, { FontName: 'Helvetica' }
        ];
        this.fontFamily = new ComboBox({
            dataSource: fontStyle,
            query: new Query().select(['FontName']),
            fields: { text: 'FontName', value: 'FontName' },
            cssClass: 'e-pv-prop-dropdown',
            itemTemplate: '<span style="font-family: ${FontName};">${FontName}</span>',
            allowCustom: true,
            showClearButton: false,
            width: '100px',
        });
        this.fontFamily.isStringTemplate = true;
        this.fontFamily.value = 'Helvetica';
        this.fontFamily.appendTo(fontSelectElement);
        this.primaryToolbar.createTooltip(fontSelectElement, this.pdfViewer.localeObj.getConstant('Font family'));
        this.fontFamily.addEventListener('change', function () { _this.onFontFamilyChange(_this); });
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.textPropertiesToolbarItems = function () {
        // tslint:disable-next-line
        var items = [];
        items.push({ prefixIcon: 'e-pv-bold-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_bold', align: 'Left', value: 'bold', click: this.onClickTextProperties.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-italic-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_italic', align: 'Left', value: 'italic', click: this.onClickTextProperties.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-strikeout-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_strikeout', align: 'Left', value: 'strikeout', click: this.onClickTextProperties.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-underlinetext-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_underline_textinput', align: 'Left', value: 'underline', click: this.onClickTextProperties.bind(this) });
        return items;
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.createShapeToolbarItems = function () {
        // tslint:disable-next-line
        var items = [];
        items.push({ prefixIcon: 'e-pv-shape-line-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_line', text: this.pdfViewer.localeObj.getConstant('Line Shape'), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-shape-arrow-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_arrow', text: this.pdfViewer.localeObj.getConstant('Arrow Shape'), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-shape-rectangle-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_rectangle', text: this.pdfViewer.localeObj.getConstant('Rectangle Shape'), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-shape-circle-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_circle', text: this.pdfViewer.localeObj.getConstant('Circle Shape'), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-shape-pentagon-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_shape_pentagon', text: this.pdfViewer.localeObj.getConstant('Pentagon Shape'), align: 'Left' });
        return items;
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.createCalibrateToolbarItems = function () {
        // tslint:disable-next-line
        var items = [];
        items.push({ prefixIcon: 'e-pv-calibrate-distance-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_distance', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-calibrate-perimeter-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_perimeter', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-calibrate-area-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_area', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-calibrate-radius-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_radius', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-calibrate-volume-icon e-pv-icon', cssClass: '', id: this.pdfViewer.element.id + '_calibrate_volume', text: this.pdfViewer.localeObj.getConstant(''), align: 'Left' });
        return items;
    };
    AnnotationToolbar.prototype.onCalibrateToolbarClicked = function (args) {
        var elementId = this.pdfViewer.element.id;
        var measureModule = this.pdfViewer.annotation.measureAnnotationModule;
        this.deselectAllItems();
        this.resetFreeTextAnnot();
        switch (args.originalEvent.target.id) {
            case elementId + '_calibrate_distance':
            case elementId + '_calibrate_distanceIcon':
                measureModule.setAnnotationType('Distance');
                this.onShapeDrawSelection(false);
                this.updateColorInIcon(this.colorDropDownElement, measureModule.distanceFillColor);
                this.updateColorInIcon(this.strokeDropDownElement, measureModule.distanceStrokeColor);
                break;
            case elementId + '_calibrate_perimeter':
            case elementId + '_calibrate_perimeterIcon':
                measureModule.setAnnotationType('Perimeter');
                this.onShapeDrawSelection(false);
                this.updateColorInIcon(this.colorDropDownElement, measureModule.perimeterFillColor);
                this.updateColorInIcon(this.strokeDropDownElement, measureModule.perimeterStrokeColor);
                break;
            case elementId + '_calibrate_area':
            case elementId + '_calibrate_areaIcon':
                measureModule.setAnnotationType('Area');
                this.onShapeDrawSelection(false);
                this.updateColorInIcon(this.colorDropDownElement, measureModule.areaFillColor);
                this.updateColorInIcon(this.strokeDropDownElement, measureModule.areaStrokeColor);
                break;
            case elementId + '_calibrate_radius':
            case elementId + '_calibrate_radiusIcon':
                measureModule.setAnnotationType('Radius');
                this.onShapeDrawSelection(false);
                this.updateColorInIcon(this.colorDropDownElement, measureModule.radiusFillColor);
                this.updateColorInIcon(this.strokeDropDownElement, measureModule.radiusStrokeColor);
                break;
            case elementId + '_calibrate_volume':
            case elementId + '_calibrate_volumeIcon':
                measureModule.setAnnotationType('Volume');
                this.onShapeDrawSelection(false);
                this.updateColorInIcon(this.colorDropDownElement, measureModule.volumeFillColor);
                this.updateColorInIcon(this.strokeDropDownElement, measureModule.volumeStrokeColor);
                break;
        }
    };
    AnnotationToolbar.prototype.onShapeDrawSelection = function (isShape) {
        // tslint:disable-next-line
        var annotation = this.pdfViewer.selectedItems.annotations[0];
        this.updateInteractionTools();
        this.enableAnnotationPropertiesTools(true);
        if (isShape) {
            this.shapeDropDown.toggle();
        }
        else {
            this.calibrateDropDown.toggle();
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            this.pdfViewer.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
            this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
        }
    };
    AnnotationToolbar.prototype.afterShapeToolbarCreation = function () {
        this.primaryToolbar.addClassToolbarItem('_shape_line', 'e-pv-shape-line', this.pdfViewer.localeObj.getConstant('Add line'));
        this.primaryToolbar.addClassToolbarItem('_shape_arrow', 'e-pv-shape-arrow', this.pdfViewer.localeObj.getConstant('Add arrow'));
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_shape_rectangle', 'e-pv-shape-rectangle', this.pdfViewer.localeObj.getConstant('Add rectangle'));
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_shape_circle', 'e-pv-shape-circle', this.pdfViewer.localeObj.getConstant('Add circle'));
        this.primaryToolbar.addClassToolbarItem('_shape_pentagon', 'e-pv-shape-pentagon', this.pdfViewer.localeObj.getConstant('Add polygon'));
    };
    AnnotationToolbar.prototype.afterCalibrateToolbarCreation = function () {
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_calibrate_distance', 'e-pv-calibrate-distance', this.pdfViewer.localeObj.getConstant('Calibrate Distance'));
        this.primaryToolbar.addClassToolbarItem('_calibrate_perimeter', 'e-pv-calibrate-perimeter', this.pdfViewer.localeObj.getConstant('Calibrate Perimeter'));
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_calibrate_area', 'e-pv-calibrate-area', this.pdfViewer.localeObj.getConstant('Calibrate Area'));
        this.primaryToolbar.addClassToolbarItem('_calibrate_radius', 'e-pv-calibrate-radius', this.pdfViewer.localeObj.getConstant('Calibrate Radius'));
        // tslint:disable-next-line:max-line-length
        this.primaryToolbar.addClassToolbarItem('_calibrate_volume', 'e-pv-calibrate-volume', this.pdfViewer.localeObj.getConstant('Calibrate Volume'));
    };
    AnnotationToolbar.prototype.createColorPicker = function (idString) {
        var inputElement = createElement('input', { id: idString + '_target' });
        document.body.appendChild(inputElement);
        var colorPicker = new ColorPicker({
            inline: true, mode: 'Palette', cssClass: 'e-show-value', enableOpacity: false,
            value: '#000000', showButtons: false, modeSwitcher: false
        });
        if (this.pdfViewer.enableRtl) {
            colorPicker.enableRtl = true;
        }
        colorPicker.appendTo(inputElement);
        return colorPicker;
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.onColorPickerChange = function (args) {
        // tslint:disable-next-line
        var currentColor;
        if (!isBlazor()) {
            currentColor = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        }
        else {
            currentColor = args[0];
        }
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyColorProperty(currentColor);
            }
            else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor = currentColor;
                        break;
                    case 'Underline':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor = currentColor;
                        break;
                    case 'Strikethrough':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor = currentColor;
                        break;
                }
            }
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (isBlazor()) {
                if (args[0] !== args[1]) {
                    this.pdfViewer.annotation.modifyFillColor(currentColor);
                }
            }
            else {
                if (args.currentValue.hex !== args.previousValue.hex) {
                    this.pdfViewer.annotation.modifyFillColor(currentColor);
                }
            }
        }
        else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                    case 'Line':
                        this.pdfViewer.annotation.shapeAnnotationModule.lineFillColor = currentColor;
                        break;
                    case 'Arrow':
                        this.pdfViewer.annotation.shapeAnnotationModule.arrowFillColor = currentColor;
                        break;
                    case 'Rectangle':
                        this.pdfViewer.annotation.shapeAnnotationModule.rectangleFillColor = currentColor;
                        break;
                    case 'Circle':
                        this.pdfViewer.annotation.shapeAnnotationModule.circleFillColor = currentColor;
                        break;
                    case 'Polygon':
                        this.pdfViewer.annotation.shapeAnnotationModule.polygonFillColor = currentColor;
                        break;
                }
            }
            if (this.pdfViewer.drawingObject) {
                this.pdfViewer.drawingObject.fillColor = currentColor;
                if (this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
                    this.pdfViewer.freeTextSettings.fillColor = currentColor;
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
                }
            }
        }
        if (isBlazor()) {
            this.colorDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-color-container');
            this.updateColorInIcon(this.colorDropDownElementInBlazor, currentColor);
        }
        else {
            this.updateColorInIcon(this.colorDropDownElement, currentColor);
            this.colorDropDown.toggle();
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.onStrokePickerChange = function (args) {
        // tslint:disable-next-line
        var currentColor;
        if (!isBlazor()) {
            currentColor = (args.currentValue.hex === '') ? '#ffffff00' : args.currentValue.hex;
        }
        else {
            currentColor = args[0];
        }
        if (this.pdfViewer.selectedItems.annotations.length === 1) {
            if (isBlazor()) {
                if (args[0] !== args[1]) {
                    this.pdfViewer.annotation.modifyStrokeColor(currentColor);
                }
            }
            else {
                if (args.currentValue.hex !== args.previousValue.hex) {
                    this.pdfViewer.annotation.modifyStrokeColor(currentColor);
                }
            }
        }
        else {
            if (this.pdfViewer.annotation.shapeAnnotationModule) {
                switch (this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode) {
                    case 'Line':
                        this.pdfViewer.annotation.shapeAnnotationModule.lineStrokeColor = currentColor;
                        break;
                    case 'Arrow':
                        this.pdfViewer.annotation.shapeAnnotationModule.arrowStrokeColor = currentColor;
                        break;
                    case 'Rectangle':
                        this.pdfViewer.annotation.shapeAnnotationModule.rectangleStrokeColor = currentColor;
                        break;
                    case 'Circle':
                        this.pdfViewer.annotation.shapeAnnotationModule.circleStrokeColor = currentColor;
                        break;
                    case 'Polygon':
                        this.pdfViewer.annotation.shapeAnnotationModule.polygonStrokeColor = currentColor;
                        break;
                }
            }
            // tslint:disable-next-line
            var annotationModule = this.pdfViewer.annotation;
            if (annotationModule && annotationModule.inkAnnotationModule) {
                this.pdfViewer.inkAnnotationSettings.strokeColor = currentColor;
            }
            if (this.pdfViewer.drawingObject) {
                this.pdfViewer.drawingObject.strokeColor = currentColor;
            }
            if (this.pdfViewer.drawingObject && this.pdfViewer.drawingObject.shapeAnnotationType === 'FreeText') {
                this.pdfViewer.freeTextSettings.borderColor = currentColor;
                this.pdfViewer.annotationModule.freeTextAnnotationModule.updateTextProperties();
            }
        }
        if (isBlazor()) {
            this.strokeDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-stroke-container');
            this.updateColorInIcon(this.strokeDropDownElementInBlazor, currentColor);
        }
        else {
            this.updateColorInIcon(this.strokeDropDownElement, currentColor);
            this.strokeDropDown.toggle();
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.updateColorInIcon = function (element, color) {
        if (isBlazor()) {
            if (element) {
                element.children[0].style.borderBottomColor = color;
            }
        }
        else {
            element.childNodes[0].style.borderBottomColor = color;
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.updateTextPropertySelection = function (currentOption) {
        if (currentOption === 'bold') {
            document.getElementById(this.pdfViewer.element.id + '_bold').classList.toggle('textprop-option-active');
        }
        else if (currentOption === 'italic') {
            document.getElementById(this.pdfViewer.element.id + '_italic').classList.toggle('textprop-option-active');
        }
        else if (currentOption === 'underline') {
            document.getElementById(this.pdfViewer.element.id + '_underline_textinput').classList.toggle('textprop-option-active');
            document.getElementById(this.pdfViewer.element.id + '_strikeout').classList.remove('textprop-option-active');
        }
        else if (currentOption === 'strikeout') {
            document.getElementById(this.pdfViewer.element.id + '_strikeout').classList.toggle('textprop-option-active');
            document.getElementById(this.pdfViewer.element.id + '_underline_textinput').classList.remove('textprop-option-active');
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.updateFontFamilyInIcon = function (family) {
        this.fontFamily.value = family;
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.updateTextAlignInIcon = function (align) {
        var className = 'e-btn-icon e-pv-left-align-icon e-pv-icon';
        var leftAlign = document.getElementById(this.pdfViewer.element.id + '_left_align');
        var rightAlign = document.getElementById(this.pdfViewer.element.id + '_right_align');
        var centerAlign = document.getElementById(this.pdfViewer.element.id + '_center_align');
        var justifyAlign = document.getElementById(this.pdfViewer.element.id + '_justify_align');
        if (!isBlazor) {
            leftAlign.classList.remove('textprop-option-active');
            rightAlign.classList.remove('textprop-option-active');
            centerAlign.classList.remove('textprop-option-active');
            justifyAlign.classList.remove('textprop-option-active');
        }
        if (align === 'Left') {
            leftAlign.classList.add('textprop-option-active');
        }
        else if (align === 'Right') {
            className = 'e-btn-icon e-pv-right-align-icon e-pv-icon';
            rightAlign.classList.add('textprop-option-active');
        }
        else if (align === 'Center') {
            className = 'e-btn-icon e-pv-center-align-icon e-pv-icon';
            centerAlign.classList.add('textprop-option-active');
        }
        else if (align === 'Justify') {
            className = 'e-btn-icon e-pv-justfiy-align-icon e-pv-icon';
            justifyAlign.classList.add('textprop-option-active');
        }
        document.getElementById(this.pdfViewer.element.id + '_annotation_textalign').children[0].className = className;
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.updateFontSizeInIcon = function (size) {
        this.fontSize.value = size + 'px';
    };
    AnnotationToolbar.prototype.updateOpacityIndicator = function () {
        // tslint:disable-next-line
        this.opacityIndicator.textContent = parseInt(Math.round(this.opacitySlider.value).toString()) + '%';
    };
    AnnotationToolbar.prototype.updateThicknessIndicator = function () {
        this.thicknessIndicator.textContent = this.thicknessSlider.value + ' pt';
    };
    AnnotationToolbar.prototype.createSlider = function (idString) {
        var outerContainer = createElement('div', { className: 'e-pv-annotation-opacity-popup-container' });
        document.body.appendChild(outerContainer);
        var label = createElement('span', { id: idString + '_label', className: 'e-pv-annotation-opacity-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Opacity');
        var sliderElement = createElement('div', { id: idString + '_slider' });
        this.opacitySlider = new Slider({ type: 'MinRange', cssClass: 'e-pv-annotation-opacity-slider', max: 100, min: 0 });
        // tslint:disable-next-line:max-line-length
        this.opacityIndicator = createElement('div', { id: idString + '_opacity_indicator', className: 'e-pv-annotation-opacity-indicator' });
        this.opacityIndicator.textContent = '100%';
        if (!this.pdfViewer.enableRtl) {
            outerContainer.appendChild(label);
            outerContainer.appendChild(sliderElement);
            this.opacitySlider.appendTo(sliderElement);
            this.opacitySlider.element.parentElement.classList.add('e-pv-annotation-opacity-slider-container');
            outerContainer.appendChild(this.opacityIndicator);
        }
        else {
            outerContainer.appendChild(this.opacityIndicator);
            outerContainer.appendChild(sliderElement);
            this.opacitySlider.enableRtl = true;
            this.opacitySlider.appendTo(sliderElement);
            this.opacitySlider.element.parentElement.classList.add('e-pv-annotation-opacity-slider-container');
            outerContainer.appendChild(label);
        }
        return outerContainer;
    };
    AnnotationToolbar.prototype.createThicknessSlider = function (idString) {
        var outerContainer = createElement('div', { className: 'e-pv-annotation-thickness-popup-container' });
        document.body.appendChild(outerContainer);
        var label = createElement('span', { id: idString + '_label', className: 'e-pv-annotation-thickness-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Line Thickness');
        var sliderElement = createElement('div', { id: idString + '_slider' });
        this.thicknessSlider = new Slider({ type: 'MinRange', cssClass: 'e-pv-annotation-thickness-slider', max: 12, min: 0 });
        // tslint:disable-next-line:max-line-length
        this.thicknessIndicator = createElement('div', { id: idString + '_thickness_indicator', className: 'e-pv-annotation-thickness-indicator' });
        this.thicknessIndicator.textContent = '0 pt';
        if (!this.pdfViewer.enableRtl) {
            outerContainer.appendChild(label);
            outerContainer.appendChild(sliderElement);
            this.thicknessSlider.appendTo(sliderElement);
            outerContainer.appendChild(this.thicknessIndicator);
        }
        else {
            outerContainer.appendChild(this.thicknessIndicator);
            outerContainer.appendChild(sliderElement);
            this.thicknessSlider.enableRtl = true;
            this.thicknessSlider.appendTo(sliderElement);
            outerContainer.appendChild(label);
        }
        this.thicknessSlider.element.parentElement.classList.add('e-pv-annotation-thickness-slider-container');
        return outerContainer;
    };
    AnnotationToolbar.prototype.afterToolbarCreation = function () {
        // tslint:disable-next-line:max-line-length
        this.highlightItem = this.primaryToolbar.addClassToolbarItem('_highlight', 'e-pv-highlight', this.pdfViewer.localeObj.getConstant('Highlight'));
        this.underlineItem = this.primaryToolbar.addClassToolbarItem('_underline', 'e-pv-underline', this.pdfViewer.localeObj.getConstant('Underline'));
        // tslint:disable-next-line:max-line-length
        this.strikethroughItem = this.primaryToolbar.addClassToolbarItem('_strikethrough', 'e-pv-strikethrough', this.pdfViewer.localeObj.getConstant('Strikethrough'));
        this.deleteItem = this.primaryToolbar.addClassToolbarItem('_annotation_delete', 'e-pv-annotation-delete', this.pdfViewer.localeObj.getConstant('Delete'));
        // tslint:disable-next-line:max-line-length
        this.freeTextEditItem = this.primaryToolbar.addClassToolbarItem('_annotation_freeTextEdit', 'e-pv-annotation-freeTextEdit', this.pdfViewer.localeObj.getConstant('Free Text'));
        // tslint:disable-next-line:max-line-length
        this.inkAnnotationItem = this.primaryToolbar.addClassToolbarItem('_annotation_ink', 'e-pv-annotation-ink', this.pdfViewer.localeObj.getConstant('Draw Ink'));
        // tslint:disable-next-line:max-line-length
        this.commentItem = this.primaryToolbar.addClassToolbarItem('_annotation_commentPanel', 'e-pv-annotation-comment-panel', this.pdfViewer.localeObj.getConstant('Comment Panel'));
        this.closeItem = this.primaryToolbar.addClassToolbarItem('_annotation_close', 'e-pv-annotation-tools-close', null);
        this.selectAnnotationDeleteItem(false);
        this.enableTextMarkupAnnotationPropertiesTools(false);
        this.enableCommentPanelTool(this.pdfViewer.enableCommentPanel);
    };
    AnnotationToolbar.prototype.onToolbarClicked = function (args) {
        // tslint:disable-next-line
        var annotation = this.pdfViewer.selectedItems.annotations[0];
        switch (args.originalEvent.target.id) {
            case this.pdfViewer.element.id + '_highlight':
            case this.pdfViewer.element.id + '_highlightIcon':
                this.pdfViewer.tool = '';
                this.resetFreeTextAnnot();
                this.handleHighlight();
                break;
            case this.pdfViewer.element.id + '_underline':
            case this.pdfViewer.element.id + '_underlineIcon':
                this.pdfViewer.tool = '';
                this.resetFreeTextAnnot();
                this.handleUnderline();
                break;
            case this.pdfViewer.element.id + '_strikethrough':
            case this.pdfViewer.element.id + '_strikethroughIcon':
                this.pdfViewer.tool = '';
                this.resetFreeTextAnnot();
                this.handleStrikethrough();
                break;
            case this.pdfViewer.element.id + '_annotation_delete':
            case this.pdfViewer.element.id + '_annotation_deleteIcon':
                this.pdfViewer.annotationModule.deleteAnnotation();
                this.resetFreeTextAnnot();
                break;
            case this.pdfViewer.element.id + '_annotation_commentPanel':
            case this.pdfViewer.element.id + '_annotation_commentPanelIcon':
                this.inkAnnotationSelected = false;
                var commentPanel = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
                }
                if (commentPanel.style.display === 'block') {
                    this.pdfViewerBase.navigationPane.closeCommentPanelContainer();
                }
                else {
                    this.pdfViewer.annotationModule.showCommentsPanel();
                }
                break;
            case this.pdfViewer.element.id + '_annotation_close':
            case this.pdfViewer.element.id + '_annotation_closeIcon':
                this.inkAnnotationSelected = false;
                var commentsPanel = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                if (commentsPanel.style.display === 'block') {
                    this.pdfViewerBase.navigationPane.closeCommentPanelContainer();
                }
                this.showAnnotationToolbar(this.primaryToolbar.annotationItem);
                break;
            case this.pdfViewer.element.id + '_annotation_freeTextEdit':
            case this.pdfViewer.element.id + '_annotation_freeTextEditIcon':
                this.resetFreeTextAnnot();
                this.handleFreeTextEditor();
                break;
            case this.pdfViewer.element.id + '_annotation_signature':
            case this.pdfViewer.element.id + '_annotation_signatureIcon':
                this.inkAnnotationSelected = false;
                this.updateSignatureCount();
                break;
            case this.pdfViewer.element.id + '_annotation_ink':
            case this.pdfViewer.element.id + '_annotation_inkIcon':
                if (annotation) {
                    this.pdfViewer.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
                }
                this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
                if (this.pdfViewer.annotationModule.inkAnnotationModule) {
                    // tslint:disable-next-line
                    var currentPageNumber = this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber;
                    if (currentPageNumber && currentPageNumber !== '') {
                        // tslint:disable-next-line
                        this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(parseInt(currentPageNumber));
                        this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                    }
                }
                if (!this.inkAnnotationSelected) {
                    this.deselectAllItems();
                    this.drawInkAnnotation();
                }
                else {
                    this.inkAnnotationSelected = false;
                }
                break;
        }
    };
    AnnotationToolbar.prototype.addInkAnnotation = function () {
        this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
        if (this.pdfViewer.annotationModule.inkAnnotationModule) {
            // tslint:disable-next-line
            var currentPageNumber = this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber;
            if (currentPageNumber && currentPageNumber !== '') {
                // tslint:disable-next-line
                this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(parseInt(currentPageNumber));
                if (!isBlazor()) {
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                }
            }
        }
        if (!this.inkAnnotationSelected) {
            if (!isBlazor()) {
                this.deselectAllItems();
            }
            this.drawInkAnnotation();
        }
        else {
            this.inkAnnotationSelected = false;
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.deselectInkAnnotation = function () {
        this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
    };
    AnnotationToolbar.prototype.drawInkAnnotation = function () {
        this.inkAnnotationSelected = true;
        if (!isBlazor()) {
            this.primaryToolbar.selectItem(this.inkAnnotationItem);
            this.enableSignaturePropertiesTools(true);
        }
        this.pdfViewerBase.isToolbarInkClicked = true;
        this.pdfViewer.annotationModule.inkAnnotationModule.drawInk();
    };
    AnnotationToolbar.prototype.resetFreeTextAnnot = function () {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule) {
            this.pdfViewer.annotation.freeTextAnnotationModule.isNewFreeTextAnnot = false;
            this.pdfViewer.annotation.freeTextAnnotationModule.isNewAddedAnnot = false;
            if (this.freeTextEditItem && !isBlazor()) {
                this.primaryToolbar.deSelectItem(this.freeTextEditItem);
                this.enableFreeTextAnnotationPropertiesTools(false);
            }
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) { // tslint:disable-next-line
            var currentPageNumber = this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber;
            if (currentPageNumber && currentPageNumber !== '') {
                // tslint:disable-next-line
                this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(parseInt(currentPageNumber));
                if (!isBlazor()) {
                    this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
                }
            }
        }
        this.inkAnnotationSelected = false;
    };
    AnnotationToolbar.prototype.updateInkannotationItems = function () {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule && this.inkAnnotationSelected) {
            // tslint:disable-next-line
            var currentPageNumber = this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber;
            if (currentPageNumber && currentPageNumber !== '') {
                // tslint:disable-next-line
                this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(parseInt(currentPageNumber));
                this.pdfViewerBase.isToolbarInkClicked = true;
                this.pdfViewer.tool = 'Ink';
                this.pdfViewer.clearSelection(currentPageNumber);
            }
        }
    };
    AnnotationToolbar.prototype.showSignaturepanel = function () {
        this.pdfViewerBase.isToolbarSignClicked = true;
        this.pdfViewerBase.signatureModule.showSignatureDialog(true);
    };
    AnnotationToolbar.prototype.handleFreeTextEditor = function () {
        // tslint:disable-next-line
        var annotation = this.pdfViewer.selectedItems.annotations[0];
        this.enableFreeTextAnnotationPropertiesTools(true);
        if (annotation) {
            this.pdfViewer.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
        }
        this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
        this.isStrikethroughEnabled = false;
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        var freeTextAnnotationModule = this.pdfViewer.annotation.freeTextAnnotationModule;
        freeTextAnnotationModule.setAnnotationType('FreeText');
        freeTextAnnotationModule.isNewFreeTextAnnot = true;
        freeTextAnnotationModule.isNewAddedAnnot = true;
        this.updateInteractionTools();
        this.primaryToolbar.deSelectItem(this.highlightItem);
        this.primaryToolbar.deSelectItem(this.underlineItem);
        this.primaryToolbar.deSelectItem(this.strikethroughItem);
        this.primaryToolbar.selectItem(this.freeTextEditItem);
        this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.freeTextAnnotationModule.fillColor);
        this.updateColorInIcon(this.strokeDropDownElement, this.pdfViewer.annotationModule.freeTextAnnotationModule.borderColor);
        this.updateColorInIcon(this.fontColorElement, this.pdfViewer.annotationModule.freeTextAnnotationModule.fontColor);
        this.updateFontFamilyInIcon(this.pdfViewer.annotationModule.freeTextAnnotationModule.fontFamily);
        this.updateFontSizeInIcon(this.pdfViewer.annotationModule.freeTextAnnotationModule.fontSize);
        this.updateTextAlignInIcon(this.pdfViewer.annotationModule.freeTextAnnotationModule.textAlign);
        this.updateFontFamily();
    };
    AnnotationToolbar.prototype.updateFontFamily = function () {
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotationModule.freeTextAnnotationModule.isBold ? this.updateFontFamilyIcon('_bold', true) : this.updateFontFamilyIcon('_bold', false);
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotationModule.freeTextAnnotationModule.isItalic ? this.updateFontFamilyIcon('_italic', true) : this.updateFontFamilyIcon('_italic', false);
        if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isUnderline) {
            this.updateFontFamilyIcon('_underline_textinput', true);
            this.updateFontFamilyIcon('_strikeout', false);
        }
        else {
            this.updateFontFamilyIcon('_underline_textinput', false);
        }
        if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isStrikethrough) {
            this.updateFontFamilyIcon('_strikeout', true);
            this.updateFontFamilyIcon('_underline_textinput', false);
        }
        else {
            this.updateFontFamilyIcon('_strikeout', false);
        }
    };
    AnnotationToolbar.prototype.updateFontFamilyIcon = function (fontFamily, isActive) {
        var fontFamilyElement = document.getElementById(this.pdfViewer.element.id + fontFamily);
        isActive ? fontFamilyElement.classList.add('textprop-option-active') : fontFamilyElement.classList.remove('textprop-option-active');
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.showAnnotationToolbar = function (element) {
        if (!this.isToolbarHidden) {
            // tslint:disable-next-line
            var annotationModule = this.pdfViewer.annotationModule;
            if (element) {
                this.primaryToolbar.deSelectItem(element);
            }
            else {
                if (this.pdfViewer.enableToolbar) {
                    this.primaryToolbar.deSelectItem(this.primaryToolbar.annotationItem);
                }
            }
            this.adjustViewer(false);
            // tslint:disable-next-line:max-line-length
            if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.enablePropertiesTool(annotationModule);
            }
            else {
                this.deselectAllItems();
            }
            this.toolbarElement.style.display = 'none';
            if (this.pdfViewerBase.isPanMode) {
                this.primaryToolbar.updateInteractionTools(false);
            }
            else {
                this.primaryToolbar.updateInteractionTools(true);
            }
        }
        else {
            var toolBarInitialStatus = this.toolbarElement.style.display;
            this.toolbarElement.style.display = 'block';
            if (element) {
                this.primaryToolbar.selectItem(element);
            }
            else {
                if (this.pdfViewer.enableToolbar) {
                    this.primaryToolbar.selectItem(this.primaryToolbar.annotationItem);
                }
            }
            if (toolBarInitialStatus === 'none') {
                this.adjustViewer(true);
            }
        }
        // tslint:disable-next-line:max-line-length           
        if (this.pdfViewer.magnification && this.pdfViewer.magnification.fitType === 'fitToPage') {
            this.pdfViewer.magnification.fitToPage();
        }
        this.enableAnnotationAddTools(true);
        this.isToolbarHidden = !this.isToolbarHidden;
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.enablePropertiesTool = function (annotationModule) {
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
        this.primaryToolbar.deSelectItem(this.highlightItem);
        this.primaryToolbar.deSelectItem(this.underlineItem);
        this.primaryToolbar.deSelectItem(this.strikethroughItem);
        this.enableTextMarkupAnnotationPropertiesTools(true);
        // tslint:disable-next-line:max-line-length  
        this.updateColorInIcon(this.colorDropDownElement, annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.color);
        this.selectAnnotationDeleteItem(true);
    };
    AnnotationToolbar.prototype.applyAnnotationToolbarSettings = function () {
        if (this.pdfViewer.toolbarSettings.annotationToolbarItems) {
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('HighlightTool') !== -1) {
                this.showHighlightTool(true);
            }
            else {
                this.showHighlightTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('UnderlineTool') !== -1) {
                this.showUnderlineTool(true);
            }
            else {
                this.showUnderlineTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('StrikethroughTool') !== -1) {
                this.showStrikethroughTool(true);
            }
            else {
                this.showStrikethroughTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('ShapeTool') !== -1) {
                this.showShapeAnnotationTool(true);
            }
            else {
                this.showShapeAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('CalibrateTool') !== -1) {
                this.showCalibrateAnnotationTool(true);
            }
            else {
                this.showCalibrateAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('ColorEditTool') !== -1) {
                this.showColorEditTool(true);
            }
            else {
                this.showColorEditTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('StrokeColorEditTool') !== -1) {
                this.showStrokeColorEditTool(true);
            }
            else {
                this.showStrokeColorEditTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('ThicknessEditTool') !== -1) {
                this.showThicknessEditTool(true);
            }
            else {
                this.showThicknessEditTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('OpacityEditTool') !== -1) {
                this.showOpacityEditTool(true);
            }
            else {
                this.showOpacityEditTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('AnnotationDeleteTool') !== -1) {
                this.showAnnotationDeleteTool(true);
            }
            else {
                this.showAnnotationDeleteTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('StampAnnotationTool') !== -1) {
                this.showStampAnnotationTool(true);
            }
            else {
                this.showStampAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('HandWrittenSignatureTool') !== -1) {
                this.showSignatureTool(true);
            }
            else {
                this.showSignatureTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('FreeTextAnnotationTool') !== -1) {
                this.showFreeTextAnnotationTool(true);
            }
            else {
                this.showFreeTextAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('FontFamilyAnnotationTool') !== -1) {
                this.showFontFamilyAnnotationTool(true);
            }
            else {
                this.showFontFamilyAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('FontSizeAnnotationTool') !== -1) {
                this.showFontSizeAnnotationTool(true);
            }
            else {
                this.showFontSizeAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('FontStylesAnnotationTool') !== -1) {
                this.showFontStylesAnnotationTool(true);
            }
            else {
                this.showFontStylesAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('FontAlignAnnotationTool') !== -1) {
                this.showFontAlignAnnotationTool(true);
            }
            else {
                this.showFontAlignAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('FontColorAnnotationTool') !== -1) {
                this.showFontColorAnnotationTool(true);
            }
            else {
                this.showFontColorAnnotationTool(false);
            }
            if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('CommentPanelTool') !== -1) {
                this.showCommentPanelTool(true);
            }
            else {
                this.showCommentPanelTool(false);
            }
            this.showInkAnnotationTool();
            this.showSeparator();
        }
    };
    AnnotationToolbar.prototype.showInkAnnotationTool = function () {
        if (this.pdfViewer.toolbarSettings.annotationToolbarItems.indexOf('InkAnnotationTool') !== -1) {
            this.showInkTool(true);
        }
        else {
            this.showInkTool(false);
        }
    };
    AnnotationToolbar.prototype.showSeparator = function () {
        if ((!this.isHighlightBtnVisible && !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible)) {
            this.applyHideToToolbar(false, 3, 3);
        }
        if (!this.isShapeBtnVisible) {
            this.applyHideToToolbar(false, 5, 5);
        }
        if (!this.isCalibrateBtnVisible) {
            this.applyHideToToolbar(false, 7, 7);
        }
        if (!this.isFreeTextBtnVisible) {
            this.applyHideToToolbar(false, 9, 9);
        }
        if (!this.isStampBtnVisible) {
            this.applyHideToToolbar(false, 11, 11);
        }
        if (!this.isSignatureBtnVisible) {
            this.applyHideToToolbar(false, 13, 13);
        }
        if (!this.isInkBtnVisible) {
            this.applyHideToToolbar(false, 15, 15);
        }
        // tslint:disable-next-line:max-line-length
        if (!this.isFontFamilyToolVisible && !this.isFontSizeToolVisible && !this.isFontColorToolVisible && !this.isFontAlignToolVisible && !this.isFontStylesToolVisible) {
            this.applyHideToToolbar(false, 21, 21);
        }
        // tslint:disable-next-line:max-line-length
        if ((!this.isColorToolVisible && !this.isStrokeColorToolVisible && !this.isThicknessToolVisible && !this.isOpacityToolVisible) || !this.isDeleteAnnotationToolVisible) {
            this.applyHideToToolbar(false, 26, 26);
        }
    };
    AnnotationToolbar.prototype.showHighlightTool = function (isShow) {
        this.isHighlightBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 0, 0);
    };
    AnnotationToolbar.prototype.showUnderlineTool = function (isShow) {
        this.isUnderlineBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 1, 1);
    };
    AnnotationToolbar.prototype.showStrikethroughTool = function (isShow) {
        this.isStrikethroughBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 2, 2);
    };
    AnnotationToolbar.prototype.showShapeAnnotationTool = function (isShow) {
        this.isShapeBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 4, 4);
    };
    AnnotationToolbar.prototype.showCalibrateAnnotationTool = function (isShow) {
        this.isCalibrateBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 6, 6);
    };
    AnnotationToolbar.prototype.showFreeTextAnnotationTool = function (isShow) {
        this.isFreeTextBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 8, 8);
    };
    AnnotationToolbar.prototype.showStampAnnotationTool = function (isShow) {
        this.isStampBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 10, 10);
    };
    AnnotationToolbar.prototype.showSignatureTool = function (isShow) {
        this.isSignatureBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 12, 12);
    };
    AnnotationToolbar.prototype.showInkTool = function (isShow) {
        this.isInkBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 14, 14);
    };
    AnnotationToolbar.prototype.showFontFamilyAnnotationTool = function (isShow) {
        this.isFontFamilyToolVisible = isShow;
        this.applyHideToToolbar(isShow, 16, 16);
    };
    AnnotationToolbar.prototype.showFontSizeAnnotationTool = function (isShow) {
        this.isFontSizeToolVisible = isShow;
        this.applyHideToToolbar(isShow, 17, 17);
    };
    AnnotationToolbar.prototype.showFontAlignAnnotationTool = function (isShow) {
        this.isFontAlignToolVisible = isShow;
        this.applyHideToToolbar(isShow, 18, 18);
    };
    AnnotationToolbar.prototype.showFontColorAnnotationTool = function (isShow) {
        this.isFontColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, 19, 19);
    };
    AnnotationToolbar.prototype.showFontStylesAnnotationTool = function (isShow) {
        this.isFontStylesToolVisible = isShow;
        this.applyHideToToolbar(isShow, 20, 20);
    };
    AnnotationToolbar.prototype.showColorEditTool = function (isShow) {
        this.isColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, 22, 22);
    };
    AnnotationToolbar.prototype.showStrokeColorEditTool = function (isShow) {
        this.isStrokeColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, 23, 23);
    };
    AnnotationToolbar.prototype.showThicknessEditTool = function (isShow) {
        this.isThicknessToolVisible = isShow;
        this.applyHideToToolbar(isShow, 24, 24);
    };
    AnnotationToolbar.prototype.showOpacityEditTool = function (isShow) {
        this.isOpacityToolVisible = isShow;
        this.applyHideToToolbar(isShow, 25, 25);
    };
    AnnotationToolbar.prototype.showAnnotationDeleteTool = function (isShow) {
        this.isDeleteAnnotationToolVisible = isShow;
        this.applyHideToToolbar(isShow, 27, 27);
    };
    AnnotationToolbar.prototype.showCommentPanelTool = function (isShow) {
        this.isCommentPanelBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 28, 28);
    };
    AnnotationToolbar.prototype.applyHideToToolbar = function (show, startIndex, endIndex) {
        var isHide = !show;
        for (var index = startIndex; index <= endIndex; index++) {
            this.toolbar.hideItem(index, isHide);
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.adjustViewer = function (isAdjust) {
        var splitterElement;
        var toolbarContainer;
        var annotationToolbarHeight;
        if (isBlazor()) {
            splitterElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
            toolbarContainer = this.pdfViewer.element.querySelector('.e-pv-toolbar');
            var annotationToolbarContainer = this.pdfViewer.element.querySelector('.e-pv-annotation-toolbar');
            annotationToolbarHeight = this.getToolbarHeight(annotationToolbarContainer);
        }
        else {
            splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
            toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
            annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        }
        var toolbarHeight = this.getToolbarHeight(toolbarContainer);
        var sideBarToolbar = this.pdfViewerBase.navigationPane.sideBarToolbar;
        var sideBarContentContainer = this.pdfViewerBase.navigationPane.sideBarContentContainer;
        var commentsContainer = this.pdfViewerBase.navigationPane.commentPanelContainer;
        var commentPanelResizer = this.pdfViewerBase.navigationPane.commentPanelResizer;
        if (isAdjust) {
            if (this.pdfViewer.enableToolbar) {
                sideBarToolbar.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                sideBarContentContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                splitterElement.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                commentsContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                commentPanelResizer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            }
            else {
                sideBarToolbar.style.top = (annotationToolbarHeight) + 'px';
                sideBarContentContainer.style.top = (annotationToolbarHeight) + 'px';
                splitterElement.style.top = (annotationToolbarHeight) + 'px';
                commentsContainer.style.top = (annotationToolbarHeight) + 'px';
                commentPanelResizer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            }
            if (!this.pdfViewer.enableToolbar) {
                toolbarHeight = 0;
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (annotationToolbarHeight + toolbarHeight)) + 'px';
            sideBarToolbar.style.height = this.getNavigationToolbarHeight(annotationToolbarHeight + toolbarHeight) + 'px';
            splitterElement.style.height = this.getNavigationToolbarHeight(annotationToolbarHeight + toolbarHeight) + 'px';
        }
        else {
            if (this.pdfViewer.enableToolbar) {
                // tslint:disable-next-line:max-line-length
                sideBarToolbar.style.top = toolbarHeight + 'px';
                sideBarContentContainer.style.top = toolbarHeight + 'px';
                splitterElement.style.top = toolbarHeight + 'px';
                commentsContainer.style.top = toolbarHeight + 'px';
                commentPanelResizer.style.top = toolbarHeight + 'px';
            }
            else {
                sideBarToolbar.style.top = 1 + 'px';
                sideBarToolbar.style.height = '100%';
                sideBarContentContainer.style.top = 1 + 'px';
                sideBarContentContainer.style.height = '100%';
                splitterElement.style.top = 1 + 'px';
                splitterElement.style.height = '100%';
                commentsContainer.style.top = 1 + 'px';
                commentsContainer.style.height = '100%';
                commentPanelResizer.style.top = 1 + 'px';
                commentPanelResizer.style.height = '100%';
            }
            if (!this.pdfViewer.enableToolbar) {
                toolbarHeight = 0;
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), annotationToolbarHeight) + 'px';
            sideBarToolbar.style.height = this.getNavigationToolbarHeight(toolbarHeight);
            splitterElement.style.height = this.getNavigationToolbarHeight(toolbarHeight);
            if (this.pdfViewerBase.viewerContainer.style.height === '0px') {
                // tslint:disable-next-line
                this.pdfViewerBase.viewerContainer.style.height = (parseInt(this.pdfViewer.element.style.height) - parseInt(sideBarToolbar.style.top)) + 'px';
            }
        }
        if (isBlazor()) {
            this.updateContentContainerHeight(isAdjust, true);
        }
        else {
            this.updateContentContainerHeight(isAdjust);
        }
    };
    AnnotationToolbar.prototype.updateContentContainerHeight = function (isAdjust, isBlazor) {
        var annotationToolbarHeight;
        if (isBlazor) {
            var annotationToolbarContainer = this.pdfViewer.element.querySelector('.e-pv-annotation-toolbar');
            annotationToolbarHeight = this.getToolbarHeight(annotationToolbarContainer);
        }
        else {
            annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        }
        var sideBarClientRect = this.pdfViewerBase.navigationPane.sideBarContentContainer.getBoundingClientRect();
        if (sideBarClientRect.height !== 0) {
            if (isAdjust) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height - annotationToolbarHeight + 'px';
            }
            else {
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height + annotationToolbarHeight + 'px';
            }
        }
    };
    AnnotationToolbar.prototype.getToolbarHeight = function (element) {
        var toolbarHeight = element.getBoundingClientRect().height;
        if (toolbarHeight === 0 && element === this.pdfViewerBase.getElement('_toolbarContainer')) {
            // getComputedStyle gets the value from style and toolbar border height is added to it.
            // tslint:disable-next-line
            toolbarHeight = parseFloat(window.getComputedStyle(element)['height']) + this.toolbarBorderHeight;
        }
        return toolbarHeight;
    };
    AnnotationToolbar.prototype.getNavigationToolbarHeight = function (toolbarHeight) {
        var height = this.pdfViewer.element.getBoundingClientRect().height;
        return (height !== 0) ? height - toolbarHeight + 'px' : '';
    };
    AnnotationToolbar.prototype.handleHighlight = function () {
        if (!this.isHighlightEnabled) {
            this.updateInteractionTools();
            this.clearShapeMode();
            this.clearMeasureMode();
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
            this.primaryToolbar.selectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.freeTextEditItem);
            this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            this.enableTextMarkupAnnotationPropertiesTools(true);
            this.setCurrentColorInPicker();
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor);
            this.isHighlightEnabled = true;
            this.isUnderlineEnabled = false;
            this.isStrikethroughEnabled = false;
        }
        else {
            this.deselectAllItems();
        }
    };
    AnnotationToolbar.prototype.handleUnderline = function () {
        if (!this.isUnderlineEnabled) {
            this.updateInteractionTools();
            this.clearShapeMode();
            this.clearMeasureMode();
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
            this.primaryToolbar.selectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.freeTextEditItem);
            this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            this.enableTextMarkupAnnotationPropertiesTools(true);
            this.setCurrentColorInPicker();
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor);
            this.isUnderlineEnabled = true;
            this.isHighlightEnabled = false;
            this.isStrikethroughEnabled = false;
        }
        else {
            this.deselectAllItems();
        }
    };
    AnnotationToolbar.prototype.handleStrikethrough = function () {
        if (!this.isStrikethroughEnabled) {
            this.updateInteractionTools();
            this.clearShapeMode();
            this.clearMeasureMode();
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
            this.primaryToolbar.selectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.freeTextEditItem);
            this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
            this.enableTextMarkupAnnotationPropertiesTools(true);
            this.setCurrentColorInPicker();
            // tslint:disable-next-line:max-line-length
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor);
            this.isStrikethroughEnabled = true;
            this.isHighlightEnabled = false;
            this.isUnderlineEnabled = false;
        }
        else {
            this.deselectAllItems();
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.deselectAllItems = function () {
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.showHideDropletDiv(true);
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.freeTextEditItem);
            this.primaryToolbar.deSelectItem(this.inkAnnotationItem);
        }
        this.resetFreeTextAnnot();
        this.clearTextMarkupMode();
        this.clearShapeMode();
        this.clearMeasureMode();
        this.pdfViewer.tool = '';
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.enableTextMarkupAnnotationPropertiesTools(false);
            this.enableFreeTextAnnotationPropertiesTools(false);
            this.updateColorInIcon(this.colorDropDownElement, '#000000');
            this.updateColorInIcon(this.strokeDropDownElement, '#000000');
            this.updateColorInIcon(this.fontColorElement, '#000000');
            this.selectAnnotationDeleteItem(false);
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.freeTextAnnotationModule.isNewFreeTextAnnot = false;
        }
    };
    AnnotationToolbar.prototype.updateInteractionTools = function () {
        this.pdfViewerBase.initiateTextSelectMode();
        this.pdfViewer.toolbar.updateInteractionTools(true);
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.selectAnnotationDeleteItem = function (isEnable) {
        if (!isBlazor()) {
            if (this.toolbar) {
                if (isEnable) {
                    // tslint:disable-next-line
                    var annotation = this.pdfViewer.annotationModule.findCurrentAnnotation();
                    if (annotation) {
                        // tslint:disable-next-line
                        if (annotation.annotationSettings && annotation.annotationSettings.isLock) {
                            if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', annotation)) {
                                this.toolbar.enableItems(this.deleteItem.parentElement, isEnable);
                            }
                            else {
                                this.toolbar.enableItems(this.deleteItem.parentElement, false);
                            }
                        }
                        else {
                            this.toolbar.enableItems(this.deleteItem.parentElement, isEnable);
                        }
                    }
                }
                else {
                    this.toolbar.enableItems(this.deleteItem.parentElement, isEnable);
                }
            }
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableTextMarkupAnnotationPropertiesTools = function (isEnable) {
        if (!isBlazor()) {
            this.toolbar.enableItems(this.colorDropDownElement.parentElement, isEnable);
            this.toolbar.enableItems(this.opacityDropDownElement.parentElement, isEnable);
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.toolbar.enableItems(this.strokeDropDownElement.parentElement, false);
                this.toolbar.enableItems(this.thicknessElement.parentElement, false);
                this.toolbar.enableItems(this.fontFamilyElement.parentElement, false);
                this.toolbar.enableItems(this.fontSizeElement.parentElement, false);
                this.toolbar.enableItems(this.fontColorElement.parentElement, false);
                this.toolbar.enableItems(this.textAlignElement.parentElement, false);
                this.toolbar.enableItems(this.textPropElement.parentElement, false);
            }
        }
        else {
            // this.pdfViewer._dotnetInstance.invokeMethodAsync('AnnotationSelect', 'TextMarkup');
            this.pdfViewerBase.blazorUIAdaptor.annotationSelect('TextMarkup');
        }
    };
    AnnotationToolbar.prototype.checkAnnotationPropertiesChange = function () {
        // tslint:disable-next-line
        var annotation = this.pdfViewer.selectedItems.annotations[0];
        if (annotation && annotation.annotationSettings) {
            // tslint:disable-next-line
            var isLock = annotation.annotationSettings.isLock;
            if (isLock) {
                if (this.pdfViewer.annotationModule.checkAllowedInteractions('PropertyChange', annotation)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableAnnotationPropertiesTools = function (isEnable) {
        var isPropertiesChanges = this.checkAnnotationPropertiesChange();
        if (!isEnable) {
            isPropertiesChanges = true;
        }
        if (!isBlazor()) {
            if (isPropertiesChanges) {
                this.toolbar.enableItems(this.colorDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.strokeDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.thicknessElement.parentElement, isEnable);
                if (this.pdfViewer.enableShapeLabel) {
                    this.toolbar.enableItems(this.fontFamilyElement.parentElement, isEnable);
                    this.toolbar.enableItems(this.fontSizeElement.parentElement, isEnable);
                    this.toolbar.enableItems(this.fontColorElement.parentElement, isEnable);
                }
                this.toolbar.enableItems(this.textAlignElement.parentElement, false);
                this.toolbar.enableItems(this.textPropElement.parentElement, false);
            }
        }
        else {
            // this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableAnnotationPropertiesTools', isEnable, isPropertiesChanges);
            this.pdfViewerBase.blazorUIAdaptor.enableAnnotationPropertiesTool(isEnable, isPropertiesChanges);
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableSignaturePropertiesTools = function (isEnable) {
        var isPropertiesChanges = this.checkAnnotationPropertiesChange();
        if (!isEnable) {
            isPropertiesChanges = true;
        }
        if (!isBlazor()) {
            if (isPropertiesChanges) {
                this.toolbar.enableItems(this.colorDropDownElement.parentElement, false);
                this.toolbar.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.strokeDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.thicknessElement.parentElement, isEnable);
                this.toolbar.enableItems(this.textAlignElement.parentElement, false);
                this.toolbar.enableItems(this.textPropElement.parentElement, false);
                this.toolbar.enableItems(this.fontFamilyElement.parentElement, false);
                this.toolbar.enableItems(this.fontSizeElement.parentElement, false);
                this.toolbar.enableItems(this.fontColorElement.parentElement, false);
                this.toolbar.enableItems(this.textAlignElement.parentElement, false);
            }
        }
        else {
            //this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableSignaturePropertiesTools', isEnable, isPropertiesChanges);
            this.pdfViewerBase.blazorUIAdaptor.enableSignaturePropertiesTools(isEnable, isPropertiesChanges);
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableStampAnnotationPropertiesTools = function (isEnable) {
        var isPropertiesChanges = this.checkAnnotationPropertiesChange();
        if (!isEnable) {
            isPropertiesChanges = true;
        }
        if (!isBlazor()) {
            if (isPropertiesChanges) {
                this.toolbar.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.colorDropDownElement.parentElement, false);
                this.toolbar.enableItems(this.strokeDropDownElement.parentElement, false);
                this.toolbar.enableItems(this.thicknessElement.parentElement, false);
                this.toolbar.enableItems(this.fontFamilyElement.parentElement, false);
                this.toolbar.enableItems(this.fontSizeElement.parentElement, false);
                this.toolbar.enableItems(this.fontColorElement.parentElement, false);
                this.toolbar.enableItems(this.textAlignElement.parentElement, false);
                this.toolbar.enableItems(this.textPropElement.parentElement, false);
            }
        }
        else {
            // this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableStampAnnotationPropertiesTools', isEnable, isPropertiesChanges);
            this.pdfViewerBase.blazorUIAdaptor.enableStampAnnotationPropertiesTools(isEnable, isPropertiesChanges);
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableFreeTextAnnotationPropertiesTools = function (isEnable) {
        var isPropertiesChanges = this.checkAnnotationPropertiesChange();
        if (!isEnable) {
            isPropertiesChanges = true;
        }
        if (!isBlazor()) {
            if (isPropertiesChanges) {
                this.toolbar.enableItems(this.opacityDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.colorDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.strokeDropDownElement.parentElement, isEnable);
                this.toolbar.enableItems(this.thicknessElement.parentElement, isEnable);
                this.toolbar.enableItems(this.fontFamilyElement.parentElement, isEnable);
                this.toolbar.enableItems(this.fontSizeElement.parentElement, isEnable);
                this.toolbar.enableItems(this.fontColorElement.parentElement, isEnable);
                this.toolbar.enableItems(this.textAlignElement.parentElement, isEnable);
                this.toolbar.enableItems(this.textPropElement.parentElement, isEnable);
            }
        }
        else {
            //this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableFreeTextAnnotationPropertiesTools', isEnable, isPropertiesChanges);
            this.pdfViewerBase.blazorUIAdaptor.enableFreeTextAnnotationPropertiesTools(isEnable, isPropertiesChanges);
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableAnnotationAddTools = function (isEnable) {
        if (this.toolbar) {
            if (this.pdfViewer.enableTextMarkupAnnotation) {
                this.toolbar.enableItems(this.highlightItem.parentElement, isEnable);
                this.toolbar.enableItems(this.underlineItem.parentElement, isEnable);
                this.toolbar.enableItems(this.strikethroughItem.parentElement, isEnable);
            }
            if (this.pdfViewer.enableShapeAnnotation) {
                this.toolbar.enableItems(this.shapeElement.parentElement, isEnable);
            }
            if (this.pdfViewer.enableStampAnnotations) {
                this.toolbar.enableItems(this.stampElement.parentElement, isEnable);
            }
            if (this.pdfViewer.enableMeasureAnnotation && this.pdfViewerBase.isCalibrateAnnotationModule()) {
                this.toolbar.enableItems(this.calibrateElement.parentElement, isEnable);
            }
            if (this.pdfViewer.enableFreeText) {
                this.toolbar.enableItems(this.freeTextEditItem.parentElement, isEnable);
            }
            if (this.pdfViewer.enableHandwrittenSignature) {
                this.toolbar.enableItems(this.handWrittenSignatureItem.parentElement, isEnable);
            }
            if (this.pdfViewer.enableInkAnnotation) {
                this.toolbar.enableItems(this.inkAnnotationItem.parentElement, isEnable);
            }
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.isAnnotationButtonsEnabled = function () {
        var isButtonsEnabled = false;
        if (this.isHighlightEnabled || this.isUnderlineEnabled || this.isStrikethroughEnabled) {
            isButtonsEnabled = true;
        }
        return isButtonsEnabled;
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableCommentPanelTool = function (isEnable) {
        this.toolbar.enableItems(this.commentItem.parentElement, isEnable);
    };
    AnnotationToolbar.prototype.updateToolbarItems = function () {
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.enableTextMarkupAddTools(true);
        }
        else {
            this.enableTextMarkupAddTools(false);
        }
        this.toolbar.enableItems(this.shapeElement.parentElement, this.pdfViewer.enableShapeAnnotation);
        this.toolbar.enableItems(this.stampElement.parentElement, this.pdfViewer.enableStampAnnotations);
        this.toolbar.enableItems(this.calibrateElement.parentElement, this.pdfViewer.enableMeasureAnnotation);
        this.toolbar.enableItems(this.freeTextEditItem.parentElement, this.pdfViewer.enableFreeText);
        this.toolbar.enableItems(this.handWrittenSignatureItem.parentElement, this.pdfViewer.enableHandwrittenSignature);
        this.toolbar.enableItems(this.inkAnnotationItem.parentElement, this.pdfViewer.enableInkAnnotation);
    };
    AnnotationToolbar.prototype.enableTextMarkupAddTools = function (isEnable) {
        this.toolbar.enableItems(this.highlightItem.parentElement, isEnable);
        this.toolbar.enableItems(this.underlineItem.parentElement, isEnable);
        this.toolbar.enableItems(this.strikethroughItem.parentElement, isEnable);
    };
    /**
     * @private
     */
    // for shapes added by drawing package
    AnnotationToolbar.prototype.updateAnnnotationPropertyItems = function () {
        if (!isBlazor()) {
            if (this.pdfViewer.selectedItems.annotations.length === 1) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.colorDropDownElement, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill, 'fillColor'));
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.strokeDropDownElement, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor, 'strokeColor'));
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    // tslint:disable-next-line
                    this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.fontColorElement, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].fontColor, 'fontColor'));
                    this.pdfViewer.toolbar.annotationToolbarModule.updateFontFamilyInIcon(this.pdfViewer.selectedItems.annotations[0].fontFamily);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.toolbar.annotationToolbarModule.updateFontSizeInIcon(this.pdfViewer.selectedItems.annotations[0].fontSize);
                    this.pdfViewer.toolbar.annotationToolbarModule.updateTextAlignInIcon(this.pdfViewer.selectedItems.annotations[0].textAlign);
                }
            }
            else {
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.colorDropDownElement, '#000000');
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.strokeDropDownElement, '#000000');
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.fontColorElement, '#000000');
            }
        }
        else {
            this.colorDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-color-container');
            this.strokeDropDownElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-stroke-container');
            this.fontColorElementInBlazor = this.pdfViewer.element.querySelector('.e-pv-annotation-textcolor-container');
            if (this.pdfViewer.selectedItems.annotations.length === 1) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.colorDropDownElementInBlazor, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.fill, 'fillColor'));
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.strokeDropDownElementInBlazor, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].wrapper.children[0].style.strokeColor, 'strokeColor'));
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                    // tslint:disable-next-line
                    this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.fontColorElementInBlazor, this.getColorHexValue(this.pdfViewer.selectedItems.annotations[0].fontColor, 'fontColor'));
                    //this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateFontFamilyInIcon', this.pdfViewer.selectedItems.annotations[0].fontFamily);
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewerBase.blazorUIAdaptor.updateFontFamilyInIcon(this.pdfViewer.selectedItems.annotations[0].fontFamily);
                    // this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateFontSizeInIcon', this.pdfViewer.selectedItems.annotations[0].fontSize);
                    this.pdfViewerBase.blazorUIAdaptor.updateFontSizeInIcon(this.pdfViewer.selectedItems.annotations[0].fontSize);
                    //this.pdfViewer.toolbar.annotationtoolbar.updateTextAlignInIcon(this.pdfViewer.selectedItems.annotations[0].textAlign);
                }
            }
            else {
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.colorDropDownElementInBlazor, '#000000');
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.strokeDropDownElementInBlazor, '#000000');
                this.pdfViewer.toolbar.annotationToolbarModule.updateColorInIcon(this.fontColorElementInBlazor, '#000000');
            }
        }
    };
    AnnotationToolbar.prototype.getColorHexValue = function (colorString, type) {
        if (colorString === '#ffffff00') {
            colorString = '#ffffff';
        }
        if (colorString.toLowerCase() === 'red') {
            colorString = '#FF0000';
        }
        if (colorString !== 'transparent') {
            if (!isBlazor()) {
                return this.colorPalette.getValue(colorString, 'hex');
            }
            else {
                return colorString;
            }
        }
        else {
            if (type === 'fontColor' || type === 'strokeColor') {
                return '#000000';
            }
            else {
                return '#ffffff';
            }
        }
    };
    AnnotationToolbar.prototype.setColorInPicker = function (colorpick, colorString) {
        colorpick.setProperties({ 'value': colorString }, true);
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.resetToolbar = function () {
        this.adjustViewer(false);
        this.updateToolbarItems();
        if (this.pdfViewer.isAnnotationToolbarOpen && this.pdfViewer.enableAnnotationToolbar) {
            this.toolbarElement.style.display = '';
            this.isToolbarHidden = false;
            this.adjustViewer(true);
            this.enableAnnotationAddTools(false);
        }
        else {
            this.toolbarElement.style.display = 'none';
            this.isToolbarHidden = true;
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.clearTextMarkupMode = function () {
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.clearShapeMode = function () {
        if (this.pdfViewerBase.isShapeAnnotationModule()) {
            this.pdfViewer.annotation.shapeAnnotationModule.currentAnnotationMode = '';
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.clearMeasureMode = function () {
        if (this.pdfViewerBase.isCalibrateAnnotationModule()) {
            this.pdfViewer.annotation.measureAnnotationModule.currentAnnotationMode = '';
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.clear = function () {
        this.deselectAllItems();
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.destroy = function () {
        this.colorDropDown.destroy();
        this.opacityDropDown.destroy();
        this.strokeDropDown.destroy();
        this.thicknessDropDown.destroy();
        this.shapeDropDown.destroy();
        this.calibrateDropDown.destroy();
        this.toolbar.destroy();
        this.fontColorDropDown.destroy();
        this.textAlignDropDown.destroy();
        this.textPropertiesDropDown.destroy();
    };
    AnnotationToolbar.prototype.getElementHeight = function (element) {
        try {
            return element.getBoundingClientRect().height;
        }
        catch (error) {
            return 0;
        }
    };
    AnnotationToolbar.prototype.updateViewerHeight = function (viewerHeight, toolbarHeight) {
        return this.getElementHeight(this.pdfViewer.element) - toolbarHeight;
    };
    AnnotationToolbar.prototype.resetViewerHeight = function (viewerHeight, toolbarHeight) {
        return viewerHeight + toolbarHeight;
    };
    AnnotationToolbar.prototype.afterAnnotationToolbarCreationInBlazor = function () {
        this.HighlightElement = document.getElementById(this.pdfViewer.element.id + '_highLight').children[0];
        this.UnderlineElement = document.getElementById(this.pdfViewer.element.id + '_underline').children[0];
        this.StrikethroughElement = document.getElementById(this.pdfViewer.element.id + '_strikethrough').children[0];
        this.HighlightElement = this.addClassToToolbarInBlazor(this.HighlightElement, 'e-pv-highlight', '_highLight');
        this.UnderlineElement = this.addClassToToolbarInBlazor(this.UnderlineElement, 'e-pv-underline', '_underline');
        this.StrikethroughElement = this.addClassToToolbarInBlazor(this.StrikethroughElement, 'e-pv-strikethrough', '_strikethrough');
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.addClassToToolbarInBlazor = function (element, className, idString) {
        element.classList.add(className);
        element.classList.add('e-pv-tbar-btn');
        if (element.childNodes.length > 0) {
            var spanElement = element.childNodes[0];
            spanElement.id = this.pdfViewer.element.id + idString + 'Icon';
            spanElement.classList.remove('e-icons');
            spanElement.classList.remove('e-btn-icon');
            if (this.pdfViewer.enableRtl) {
                spanElement.classList.add('e-right');
            }
        }
        return element;
    };
    AnnotationToolbar.prototype.handleHighlightInBlazor = function () {
        if (this.HighlightElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.HighlightElement);
        }
        else if (!this.HighlightElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.selectItem(this.HighlightElement);
        }
        if (this.StrikethroughElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.StrikethroughElement);
        }
        if (this.UnderlineElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.UnderlineElement);
        }
    };
    AnnotationToolbar.prototype.handleUnderlineInBlazor = function () {
        if (this.UnderlineElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.UnderlineElement);
        }
        else if (!this.UnderlineElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.selectItem(this.UnderlineElement);
        }
        if (this.StrikethroughElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.StrikethroughElement);
        }
        if (this.HighlightElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.HighlightElement);
        }
    };
    AnnotationToolbar.prototype.handleStrikethroughInBlazor = function () {
        if (this.StrikethroughElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.StrikethroughElement);
        }
        else if (!this.StrikethroughElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.selectItem(this.StrikethroughElement);
        }
        if (this.HighlightElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.HighlightElement);
        }
        if (this.UnderlineElement.classList.contains('e-pv-select')) {
            this.primaryToolbar.deSelectItem(this.UnderlineElement);
        }
    };
    return AnnotationToolbar;
}());
export { AnnotationToolbar };
