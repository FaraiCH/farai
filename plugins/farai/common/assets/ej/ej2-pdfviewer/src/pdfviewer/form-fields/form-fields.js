import { Browser } from '@syncfusion/ej2-base';
import { splitArrayCollection, processPathData } from '@syncfusion/ej2-drawings';
/**
 * The `FormFields` module is to render formfields in the PDF document.
 * @hidden
 */
var FormFields = /** @class */ (function () {
    /**
     * @private
     */
    function FormFields(viewer, base) {
        // tslint:disable-next-line
        this.maintainTabIndex = {};
        // tslint:disable-next-line
        this.maintanMinTabindex = {};
        this.isSignatureField = false;
        /**
         * @private
         */
        // tslint:disable-next-line
        this.readOnlyCollection = [];
        /**
         * @private
         */
        // tslint:disable-next-line
        this.nonFillableFields = {};
        this.isSignatureRendered = false;
        // tslint:disable-next-line
        this.signatureFieldCollection = [];
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    FormFields.prototype.renderFormFields = function (pageIndex) {
        this.maxTabIndex = 0;
        this.minTabIndex = -1;
        // tslint:disable-next-line
        var data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        if (data !== null) {
            // tslint:disable-next-line
            var formFieldsData = JSON.parse(data);
            var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
            var canvasElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageIndex);
            if (formFieldsData !== null && canvasElement !== null && textLayer !== null) {
                for (var i = 0; i < formFieldsData.length; i++) {
                    // tslint:disable-next-line
                    var currentData = formFieldsData[i];
                    // tslint:disable-next-line
                    if (parseFloat(currentData['PageIndex']) == pageIndex) {
                        // tslint:disable-next-line
                        var inputField = this.createFormFields(currentData, pageIndex, i);
                        if (inputField) {
                            // tslint:disable-next-line
                            var bounds = currentData['LineBounds'];
                            // tslint:disable-next-line
                            var font = currentData['Font'];
                            // tslint:disable-next-line
                            var divElement = document.createElement('div');
                            if (currentData.Name === 'Textbox') {
                                divElement.style.background = 'white';
                            }
                            this.applyPosition(divElement, bounds, font);
                            this.applyPosition(inputField, bounds, font);
                            // tslint:disable-next-line
                            currentData['uniqueID'] = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + i;
                            this.applyCommonProperties(inputField, pageIndex, i, currentData);
                            this.checkIsReadonly(currentData, inputField);
                            this.applyTabIndex(currentData, inputField, pageIndex);
                            this.checkIsRequiredField(currentData, inputField);
                            this.applyDefaultColor(inputField);
                            divElement.appendChild(inputField);
                            textLayer.appendChild(divElement);
                            inputField.addEventListener('focus', this.focusFormFields.bind(this));
                            inputField.addEventListener('blur', this.blurFormFields.bind(this));
                            inputField.addEventListener('click', this.updateFormFields.bind(this));
                            inputField.addEventListener('change', this.changeFormFields.bind(this));
                            inputField.addEventListener('keydown', this.updateFormFieldsValue.bind(this));
                        }
                    }
                }
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_formfields');
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_formfields', JSON.stringify(formFieldsData));
            }
        }
    };
    FormFields.prototype.nextField = function () {
        this.signatureFieldNavigate(true);
    };
    FormFields.prototype.previousField = function () {
        this.signatureFieldNavigate(false);
    };
    FormFields.prototype.signatureFieldNavigate = function (nextSign) {
        var isNextSignField = nextSign;
        // tslint:disable-next-line
        var signatureFields = this.signatureFieldCollection;
        if (signatureFields.length === 0) {
            signatureFields = this.getSignField();
        }
        // tslint:disable-next-line
        var currentField;
        if (this.currentTarget) {
            for (var i = 0; i < signatureFields.length; i++) {
                currentField = signatureFields[i];
                if (this.currentTarget.id === currentField.uniqueID) {
                    this.currentTarget = document.getElementById(currentField.uniqueID);
                    this.getSignatureIndex(i, signatureFields.length, isNextSignField);
                    break;
                }
            }
        }
    };
    FormFields.prototype.getSignatureIndex = function (currentSignatureIndex, signatureCount, isNextSign) {
        var signatureIndex = currentSignatureIndex;
        if (isNextSign) {
            signatureIndex++;
        }
        else {
            signatureIndex--;
        }
        if (signatureIndex < signatureCount && signatureIndex >= 0) {
            this.renderSignatureField(signatureIndex);
        }
    };
    FormFields.prototype.renderSignatureField = function (currentSignIndex) {
        var curSignIndex = currentSignIndex;
        // tslint:disable-next-line
        var signatureFields = this.signatureFieldCollection;
        // tslint:disable-next-line
        var currentField;
        if (curSignIndex < signatureFields.length) {
            for (var i = 0; i < signatureFields.length; i++) {
                if (signatureFields[curSignIndex].uniqueID === signatureFields[i].uniqueID) {
                    var isRender = this.pdfViewer.annotationModule.findRenderPageList(signatureFields[i].PageIndex);
                    if (!isRender) {
                        this.pdfViewer.navigation.goToPage(signatureFields[i].PageIndex);
                    }
                    this.currentTarget = document.getElementById(signatureFields[i].uniqueID);
                    currentField = signatureFields[i];
                    break;
                }
            }
            if (this.currentTarget === null) {
                this.pdfViewer.navigation.goToPage(currentField.PageIndex);
                this.currentTarget = document.getElementById(currentField.uniqueID);
            }
            if (this.currentTarget) {
                if (this.currentTarget.className === 'e-pdfviewer-signatureformFields signature') {
                    document.getElementById(this.currentTarget.id).focus();
                    this.pdfViewer.select([this.currentTarget.id], null);
                }
                else if (this.currentTarget.className === 'e-pdfviewer-signatureformFields') {
                    document.getElementById(this.currentTarget.id).focus();
                    this.pdfViewerBase.signatureModule.showSignatureDialog(true);
                }
            }
        }
    };
    // tslint:disable-next-line
    FormFields.prototype.getSignField = function () {
        // tslint:disable-next-line
        var data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        var currentData;
        if (data !== null) {
            // tslint:disable-next-line
            var formFieldsData = JSON.parse(data);
            if (this.currentTarget) {
                for (var i = 0; i < formFieldsData.length; i++) {
                    currentData = formFieldsData[i];
                    if (currentData.Name === 'SignatureField') {
                        // tslint:disable-next-line
                        currentData['uniqueID'] = this.pdfViewer.element.id + 'input_' + currentData.PageIndex + '_' + i;
                        this.signatureFieldCollection.push(formFieldsData[i]);
                    }
                }
            }
        }
        return this.signatureFieldCollection;
    };
    /**
     * @private
     */
    FormFields.prototype.formFieldCollections = function () {
        // tslint:disable-next-line
        var data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        if (data !== null) {
            // tslint:disable-next-line
            var formFieldsData = JSON.parse(data);
            for (var i = 0; i < formFieldsData.length; i++) {
                // tslint:disable-next-line
                var currentData = formFieldsData[i];
                // tslint:disable-next-line
                var type = currentData['Name'];
                if (currentData.Name !== 'ink') {
                    // tslint:disable-next-line
                    var formFieldCollection = { name: this.retriveFieldName(currentData), id: this.pdfViewer.element.id + 'input_' + parseFloat(currentData['PageIndex']) + '_' + i, isReadOnly: false, type: type, value: this.retriveCurrentValue(currentData), signatureType: [], fontName: '' };
                    this.pdfViewer.formFieldCollections.push(formFieldCollection);
                }
            }
        }
    };
    // tslint:disable-next-line
    FormFields.prototype.updateFormFieldValues = function (formFields) {
        this.readOnlyCollection.push(formFields.id);
        if (formFields) {
            // tslint:disable-next-line
            var currentElement = document.getElementById(formFields.id);
            if (currentElement) {
                if (formFields.isReadOnly) {
                    currentElement.disabled = true;
                    currentElement.style.backgroundColor = '';
                    currentElement.style.cursor = 'default';
                }
                else {
                    if (currentElement.style.backgroundColor === '') {
                        currentElement.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
                    }
                    currentElement.disabled = false;
                    currentElement.style.cursor = '';
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FormFields.prototype.retriveFieldName = function (currentData) {
        // tslint:disable-next-line
        var currentField;
        // tslint:disable-next-line
        switch (currentData['Name']) {
            case 'Textbox':
            case 'Password':
            case 'SignatureField':
                currentField = currentData.FieldName;
                break;
            case 'RadioButton':
            case 'CheckBox':
                currentField = currentData.GroupName;
                break;
            case 'DropDown':
            case 'ListBox':
                currentField = currentData.Text;
                break;
        }
        return currentField;
    };
    // tslint:disable-next-line
    FormFields.prototype.retriveCurrentValue = function (currentData) {
        // tslint:disable-next-line
        var currentField;
        // tslint:disable-next-line
        switch (currentData['Name']) {
            case 'Textbox':
            case 'Password':
                currentField = currentData.Text;
                break;
            case 'SignatureField':
                currentField = currentData.Value;
                break;
            case 'RadioButton':
            case 'CheckBox':
                currentField = currentData.Selected;
                break;
            case 'DropDown':
                currentField = currentData.SelectedValue;
                break;
            case 'ListBox':
                currentField = currentData.SelectedList;
                break;
        }
        return currentField;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FormFields.prototype.downloadFormFieldsData = function () {
        // tslint:disable-next-line
        var data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        var formFieldsData = JSON.parse(data);
        // tslint:disable-next-line
        var datas = {};
        if (formFieldsData) {
            for (var m = 0; m < formFieldsData.length; m++) {
                // tslint:disable-next-line
                var currentData = formFieldsData[m];
                if (currentData.Name === 'Textbox' || currentData.Name === 'Password' || currentData.Multiline) {
                    if (currentData.Text === '' || currentData.Text === null) {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.FieldName] = currentData.Text;
                    }
                    else {
                        delete (this.nonFillableFields[currentData.FieldName]);
                    }
                    datas[currentData.FieldName] = currentData.Text;
                }
                else if (currentData.Name === 'RadioButton' && currentData.Selected) {
                    if (currentData.Selected === false) {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.GroupName] = currentData.Value;
                    }
                    else {
                        delete (this.nonFillableFields[currentData.GroupName]);
                    }
                    datas[currentData.GroupName] = currentData.Value;
                }
                else if (currentData.Name === 'CheckBox') {
                    if (currentData.Selected === false) {
                        this.pdfViewerBase.validateForm = true;
                    }
                    datas[currentData.GroupName] = currentData.Selected;
                }
                else if (currentData.Name === 'DropDown') {
                    if (currentData.SelectedValue === '') {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.Text] = currentData.SelectedValue;
                    }
                    else {
                        delete (this.nonFillableFields[currentData.Text]);
                    }
                    datas[currentData.Text] = currentData.SelectedValue;
                }
                else if (currentData.Name === 'ListBox') {
                    // tslint:disable-next-line
                    var childItems = currentData['TextList'];
                    var childItemsText = [];
                    for (var m_1 = 0; m_1 < currentData.SelectedList.length; m_1++) {
                        // tslint:disable-next-line
                        var currentElement = currentData.SelectedList[m_1];
                        childItemsText.push(childItems[currentElement]);
                    }
                    datas[currentData.Text] = JSON.stringify(childItemsText);
                }
                else if (currentData.Name === 'SignatureField') {
                    // tslint:disable-next-line
                    var collectionData = processPathData(currentData.Value);
                    // tslint:disable-next-line
                    var csData = void 0;
                    if (currentData.Value && currentData.Value !== '' && (currentData.Value.split('base64,')[1] || collectionData.length === 0)) {
                        csData = currentData.Value;
                        if (currentData.fontFamily) {
                            datas[currentData.FieldName + 'fontName'] = currentData.fontFamily;
                        }
                        else if (currentData.Value.split('base64,')[1]) {
                            datas[currentData.FieldName + 'ImageData'] = true;
                        }
                    }
                    else {
                        csData = splitArrayCollection(collectionData);
                    }
                    if (currentData.Value === null || currentData.Value === '') {
                        this.pdfViewerBase.validateForm = true;
                        this.nonFillableFields[currentData.FieldName] = JSON.stringify(csData);
                    }
                    else {
                        delete (this.nonFillableFields[currentData.FieldName]);
                    }
                    datas[currentData.FieldName] = JSON.stringify(csData);
                    if (currentData.Bounds) {
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(currentData.Bounds);
                    }
                    else {
                        // tslint:disable-next-line
                        var lineBounds = currentData.LineBounds;
                        // tslint:disable-next-line
                        var bounds = { x: this.ConvertPointToPixel(lineBounds.X), y: this.ConvertPointToPixel(lineBounds.Y), width: this.ConvertPointToPixel(lineBounds.Width), height: this.ConvertPointToPixel(lineBounds.Height) };
                        datas[currentData.FieldName + 'bounds'] = JSON.stringify(bounds);
                    }
                }
            }
        }
        return (JSON.stringify(datas));
    };
    FormFields.prototype.focusFormFields = function (event) {
        // tslint:disable-next-line
        var currentTarget = event.target;
        if (currentTarget && currentTarget.className !== 'e-pdfviewer-signatureformFields') {
            // tslint:disable-next-line
            var backgroundcolor = currentTarget.style.backgroundColor;
            // tslint:disable-next-line
            var currentIndex = backgroundcolor.lastIndexOf(',');
            // tslint:disable-next-line
            var currentColor = backgroundcolor.slice(0, currentIndex + 1) + 0 + ')';
            if (currentTarget.type === 'checkbox') {
                currentTarget.style.webkitAppearance = '';
            }
            currentTarget.style.backgroundColor = currentColor;
        }
        else if (currentTarget) {
            currentTarget.blur();
        }
    };
    FormFields.prototype.blurFormFields = function (event) {
        // tslint:disable-next-line
        var currentTarget = event.target;
        if (currentTarget.type === 'checkbox') {
            this.pdfViewer.fireFocusOutFormField(currentTarget.name, currentTarget.checked);
        }
        else {
            this.pdfViewer.fireFocusOutFormField(currentTarget.name, currentTarget.value);
        }
        // tslint:disable-next-line
        var backgroundcolor = currentTarget.style.backgroundColor;
        // tslint:disable-next-line
        var currentIndex = backgroundcolor.lastIndexOf(',');
        // tslint:disable-next-line
        var currentColor = backgroundcolor.slice(0, currentIndex + 1) + 0.2 + ')';
        if ((currentTarget.type === 'checkbox') && !currentTarget.checked) {
            currentTarget.style.webkitAppearance = 'none';
        }
        else {
            currentTarget.style.webkitAppearance = '';
        }
        currentTarget.style.backgroundColor = currentColor;
    };
    FormFields.prototype.updateFormFields = function (event) {
        // tslint:disable-next-line
        var currentTarget = event.target;
        if (currentTarget.className === 'e-pdfviewer-ListBox') {
            currentTarget = currentTarget.parentElement;
            this.updateDataInSession(currentTarget);
        }
        else if (currentTarget.className === 'e-pdfviewer-signatureformFields') {
            this.currentTarget = currentTarget;
            this.pdfViewerBase.signatureModule.showSignatureDialog(true);
        }
        else if (currentTarget.className === 'e-pv-buttonItem' || currentTarget.type === 'button') {
            this.pdfViewer.fireButtonFieldClickEvent(currentTarget.value, currentTarget.name, currentTarget.id);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FormFields.prototype.drawSignature = function (signatureType, value, target, fontname) {
        var annot;
        // tslint:disable-next-line
        var bounds;
        // tslint:disable-next-line
        var currentField = this.currentTarget ? this.currentTarget : target;
        var currentValue = value ? value : this.pdfViewerBase.signatureModule.outputString;
        var currentFont = fontname ? fontname : this.pdfViewerBase.signatureModule.fontName;
        var zoomvalue = this.pdfViewerBase.getZoomFactor();
        var currentWidth = parseFloat(currentField.style.width) / zoomvalue;
        var currentHeight = parseFloat(currentField.style.height) / zoomvalue;
        var currentLeft = parseFloat(currentField.style.left) / zoomvalue;
        var currentTop = parseFloat(currentField.style.top) / zoomvalue;
        var currentPage = parseFloat(currentField.id.split('_')[1]);
        var signatureFontFamily;
        var signatureFontSize;
        if (signatureType === 'Type') {
            if (!currentFont) {
                currentFont = 'Helvetica';
            }
            bounds = { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight };
            annot = {
                // tslint:disable-next-line:max-line-length
                id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                shapeAnnotationType: 'SignatureText', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }, fontFamily: currentFont, fontSize: (bounds.height / 2)
            };
            signatureFontFamily = annot.fontFamily;
            signatureFontSize = annot.fontSize;
        }
        else if (signatureType === 'Image') {
            bounds = { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight };
            annot = {
                // tslint:disable-next-line:max-line-length
                id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
            };
        }
        else {
            // tslint:disable-next-line
            if (this.pdfViewer.signatureFitMode === 'Default') {
                // tslint:disable-next-line
                var signatureBounds = this.updateSignatureAspectRatio(currentValue, false, currentField);
                bounds = { x: currentLeft + signatureBounds.left, y: currentTop + signatureBounds.top, width: signatureBounds.width, height: signatureBounds.height };
            }
            else {
                bounds = { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight };
            }
            annot = {
                // tslint:disable-next-line:max-line-length
                id: currentField.id, bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, pageIndex: currentPage, data: currentValue, modifiedDate: '',
                shapeAnnotationType: 'Path', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
            };
        }
        this.pdfViewer.add(annot);
        // tslint:disable-next-line
        var canvass = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
        // tslint:disable-next-line
        this.pdfViewer.renderDrawing(canvass, currentPage);
        this.pdfViewerBase.signatureModule.showSignatureDialog(false);
        currentField.className = 'e-pdfviewer-signatureformFields signature';
        this.updateDataInSession(currentField, annot.data, annot.bounds, signatureFontFamily, signatureFontSize);
        currentField.style.pointerEvents = 'none';
        currentField.parentElement.style.pointerEvents = 'none';
        this.pdfViewerBase.signatureModule.hideSignaturePanel();
        this.pdfViewer.fireSignatureAdd(annot.pageIndex, annot.id, annot.shapeAnnotationType, annot.bounds, annot.opacity);
        this.pdfViewer.fireFocusOutFormField(currentField.name, currentValue);
    };
    FormFields.prototype.updateFormFieldsValue = function (event) {
        // tslint:disable-next-line
        var currentTarget = event.target;
        if (event.which === 9 && currentTarget && currentTarget.className === 'e-pdfviewer-formFields') {
            // tslint:disable-next-line
            var id = currentTarget.id.split('input_')[1].split('_')[0];
            if (this.maintainTabIndex[id] === currentTarget.tabIndex) {
                // tslint:disable-next-line
                var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (parseInt(id) + 1));
                if (textLayer) {
                    // tslint:disable-next-line
                    var currentFields = textLayer.getElementsByClassName('e-pdfviewer-formFields');
                    if (currentFields && currentFields.length > 0) {
                        currentFields[0].focus();
                        event.preventDefault();
                    }
                }
                else {
                    var textLayer_1 = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + 0);
                    // tslint:disable-next-line
                    var currentFields = textLayer_1.getElementsByClassName('e-pdfviewer-formFields');
                    for (var m = 0; m < currentFields.length; m++) {
                        if (currentFields[m].tabIndex === this.maintanMinTabindex['0']) {
                            currentFields[m].focus();
                            event.preventDefault();
                            break;
                        }
                    }
                }
            }
            else {
                // tslint:disable-next-line
                var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + parseInt(id));
                // tslint:disable-next-line
                var currentFields = textLayer.getElementsByClassName('e-pdfviewer-formFields');
                var istabindexed = true;
                for (var m = 0; m < currentFields.length; m++) {
                    istabindexed = false;
                    if (currentFields[m].tabIndex === (currentTarget.tabIndex + 1)) {
                        currentFields[m].focus();
                        istabindexed = true;
                        event.preventDefault();
                        break;
                    }
                }
                var tabindex = currentTarget.tabIndex + 1;
                while (!istabindexed) {
                    for (var l = 0; l < currentFields.length; l++) {
                        istabindexed = false;
                        if (currentFields[l].tabIndex === (tabindex)) {
                            currentFields[l].focus();
                            istabindexed = true;
                            event.preventDefault();
                            break;
                        }
                    }
                    if (this.maintainTabIndex[id] === tabindex) {
                        istabindexed = true;
                    }
                    tabindex = tabindex + 1;
                }
            }
        }
    };
    FormFields.prototype.changeFormFields = function (event) {
        // tslint:disable-next-line
        var currentTarget = event.target;
        this.updateDataInSession(currentTarget);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FormFields.prototype.updateSignatureAspectRatio = function (data, isSignature, currentField) {
        // tslint:disable-next-line
        var collectionData = processPathData(data);
        // tslint:disable-next-line
        var csData = splitArrayCollection(collectionData);
        var minimumX = -1;
        var minimumY = -1;
        var maximumX = -1;
        var maximumY = -1;
        var signatureCanvas = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        var signatureCavasWidth = 0;
        var signatureCavasHeight = 0;
        for (var m = 0; m < csData.length; m++) {
            // tslint:disable-next-line
            var val = csData[m];
            if (minimumX === -1) {
                // tslint:disable-next-line
                minimumX = parseFloat(val['x'].toString());
                // tslint:disable-next-line
                maximumX = parseFloat(val['x'].toString());
                // tslint:disable-next-line
                minimumY = parseFloat(val['y'].toString());
                // tslint:disable-next-line
                maximumY = parseFloat(val['y'].toString());
            }
            else {
                // tslint:disable-next-line
                var point1 = parseFloat(val['x'].toString());
                // tslint:disable-next-line
                var point2 = parseFloat(val['y'].toString());
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
        signatureCavasWidth = signatureCanvas ? signatureCanvas.clientWidth : 650;
        signatureCavasHeight = signatureCanvas ? signatureCanvas.clientHeight : 300;
        var newdifferenceX = maximumX - minimumX;
        var newdifferenceY = maximumY - minimumY;
        var ratioX = newdifferenceX / signatureCavasWidth;
        var ratioY = newdifferenceY / signatureCavasHeight;
        var zoomvalue = this.pdfViewerBase.getZoomFactor();
        var currentWidth = 0;
        var currentHeight = 0;
        if (isSignature) {
            currentWidth = this.pdfViewer.handWrittenSignatureSettings.width ? this.pdfViewer.handWrittenSignatureSettings.width : 150;
            currentHeight = this.pdfViewer.handWrittenSignatureSettings.height ? this.pdfViewer.handWrittenSignatureSettings.height : 100;
        }
        else {
            // tslint:disable-next-line
            currentWidth = parseFloat(currentField.style.width) / zoomvalue;
            // tslint:disable-next-line
            currentHeight = parseFloat(currentField.style.height) / zoomvalue;
        }
        var currentLeftDiff = (signatureCavasWidth - newdifferenceX) / 2;
        var currentTopDiff = (signatureCavasHeight - newdifferenceY) / 2;
        currentLeftDiff = (currentLeftDiff / signatureCavasWidth) * currentWidth;
        currentTopDiff = (currentTopDiff / signatureCavasHeight) * currentHeight;
        currentWidth = currentWidth * ratioX;
        currentHeight = currentHeight * ratioY;
        if (isSignature) {
            var pageIndex = this.pdfViewerBase.currentPageNumber - 1;
            var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            var currentLeft = ((parseFloat(pageDiv.style.width) / 2) - (currentWidth / 2)) / zoomvalue;
            // tslint:disable-next-line:max-line-length
            var currentTop = ((parseFloat(pageDiv.style.height) / 2) - (currentHeight / 2)) / zoomvalue;
            return { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight };
        }
        else {
            return { left: currentLeftDiff, top: currentTopDiff, width: currentWidth, height: currentHeight };
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FormFields.prototype.updateDataInSession = function (target, signaturePath, signatureBounds, signatureFontFamily, signatureFontSize) {
        this.pdfViewer.isDocumentEdited = true;
        // tslint:disable-next-line
        var data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        var FormFieldsData = JSON.parse(data);
        for (var m = 0; m < FormFieldsData.length; m++) {
            // tslint:disable-next-line
            var currentData = FormFieldsData[m];
            if (currentData.uniqueID === target.id) {
                if (target.type === 'text' || target.type === 'password' || target.type === 'textarea') {
                    var signField = target;
                    if (signField.classList.contains('e-pdfviewer-signatureformFields')) {
                        currentData.Value = signaturePath;
                        if (signatureBounds) {
                            currentData.Bounds = signatureBounds;
                        }
                        if (signatureFontFamily) {
                            currentData.fontFamily = signatureFontFamily;
                            currentData.fontSize = signatureFontSize;
                        }
                        else {
                            currentData.fontFamily = null;
                        }
                    }
                    else {
                        currentData.Text = target.value;
                    }
                }
                else if (target.type === 'radio') {
                    for (var l = 0; l < FormFieldsData.length; l++) {
                        // tslint:disable-next-line
                        var currentType = FormFieldsData[l];
                        if (FormFieldsData[l].GroupName === target.name) {
                            FormFieldsData[l].Selected = false;
                        }
                    }
                    currentData.Selected = true;
                }
                else if (target.type === 'checkbox') {
                    if (target.checked) {
                        currentData.Selected = true;
                    }
                    else {
                        currentData.Selected = false;
                    }
                }
                else if (target.type === 'select-one') {
                    // tslint:disable-next-line
                    var currentValue = target.options[target.selectedIndex].text;
                    // tslint:disable-next-line
                    var childrens = target.children;
                    var isChildElements = false;
                    for (var k = 0; k < childrens.length; k++) {
                        if (childrens[k].text === currentValue) {
                            currentData.SelectedValue = currentValue;
                        }
                    }
                }
                else if (target.type === 'select-multiple') {
                    // tslint:disable-next-line
                    var currentValue = target.selectedOptions;
                    currentData.SelectedList = [];
                    for (var z = 0; z < currentValue.length; z++) {
                        // tslint:disable-next-line
                        var childrens = target.children;
                        for (var k = 0; k < childrens.length; k++) {
                            if (childrens[k] === currentValue[z]) {
                                currentData.SelectedList.push(k);
                            }
                        }
                    }
                }
                break;
            }
            else if (target && target.getAttribute('list') != null && target.type === 'text' && currentData.uniqueID === target.list.id) {
                currentData.SelectedValue = target.value;
            }
        }
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_formfields');
        window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_formfields', JSON.stringify(FormFieldsData));
    };
    // tslint:disable-next-line
    FormFields.prototype.applyCommonProperties = function (inputdiv, pageIndex, index, currentData) {
        // tslint:disable-next-line
        var inputField = document.getElementById(this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
        if (inputField) {
            inputField.remove();
        }
        if (currentData.IsSignatureField && this.isSignatureField) {
            inputdiv.className = 'e-pdfviewer-signatureformFields signature';
            inputdiv.style.pointerEvents = 'none';
        }
        else if (currentData.IsSignatureField) {
            inputdiv.className = 'e-pdfviewer-signatureformFields';
        }
        else if (currentData.Name !== 'Button') {
            inputdiv.className = 'e-pdfviewer-formFields';
        }
        inputdiv.id = this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index;
        inputdiv.style.zIndex = 1000;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FormFields.prototype.createFormFields = function (currentData, pageIndex, index, printContainer) {
        // tslint:disable-next-line
        var currentField;
        // tslint:disable-next-line
        switch (currentData['Name']) {
            case 'Textbox':
                currentField = this.createTextBoxField(currentData, pageIndex, 'text');
                break;
            case 'Password':
                currentField = this.createTextBoxField(currentData, pageIndex, 'password');
                break;
            case 'RadioButton':
                currentField = this.createRadioBoxField(currentData, pageIndex, 'radio');
                break;
            case 'CheckBox':
                currentField = this.createRadioBoxField(currentData, pageIndex, 'checkbox', printContainer);
                break;
            case 'DropDown':
                currentField = this.createDropDownField(currentData, pageIndex, index, printContainer);
                break;
            case 'ListBox':
                currentField = this.createListBoxField(currentData, pageIndex);
                break;
            case 'SignatureField':
                currentField = this.createSignatureField(currentData, pageIndex, index, printContainer);
                if (currentData.Value && currentData.Value !== '') {
                    this.renderExistingAnnnot(currentData, index, printContainer);
                    this.isSignatureRendered = true;
                }
                break;
            case 'Button':
                currentField = this.createButtonField(currentData, pageIndex);
                break;
            case 'ink':
                if (currentData.Value && currentData.Value !== '' && !this.isSignatureRendered) {
                    this.renderExistingAnnnot(currentData, index, printContainer);
                }
                break;
        }
        return currentField;
    };
    // tslint:disable-next-line
    FormFields.prototype.createButtonField = function (data, pageIndex) {
        // tslint:disable-next-line
        var inputField = document.createElement('input');
        inputField.type = 'button';
        inputField.classNme = 'e-pv-buttonItem';
        if (data.Text !== '') {
            inputField.value = data.Text;
        }
        else {
            inputField.value = '';
        }
        inputField.name = data.FieldName;
        return inputField;
    };
    // tslint:disable-next-line
    FormFields.prototype.createTextBoxField = function (data, pageIndex, type) {
        // tslint:disable-next-line
        var inputField;
        if (data.Visible === 1) {
            return;
        }
        if (data.Multiline) {
            inputField = document.createElement('textarea');
            inputField.style.resize = 'none';
        }
        else {
            inputField = document.createElement('input');
            inputField.type = type;
        }
        if (data.MaxLength > 0) {
            inputField.maxLength = data.MaxLength;
        }
        this.addAlignmentPropety(data, inputField);
        if (data.Text !== '') {
            inputField.value = data.Text;
        }
        else {
            inputField.value = '';
        }
        if (!this.pdfViewer.enableAutoComplete) {
            inputField.autocomplete = 'off';
        }
        inputField.name = data.FieldName;
        return inputField;
    };
    // tslint:disable-next-line
    FormFields.prototype.checkIsReadonly = function (data, inputField) {
        var isReadonly = false;
        for (var n = 0; n < this.readOnlyCollection.length; n++) {
            if (inputField.id === this.readOnlyCollection[n]) {
                isReadonly = true;
                break;
            }
        }
        if (data.IsReadonly || (!this.pdfViewer.enableFormFields) || isReadonly) {
            inputField.disabled = true;
            inputField.style.cursor = 'default';
            inputField.style.backgroundColor = 'transparent';
        }
        else {
            // tslint:disable-next-line
            var borderColor = data.BackColor;
            inputField.style.backgroundColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 0.2 + ')';
            // tslint:disable-next-line
            var fontColor = data.FontColor;
            inputField.style.color = 'rgba(' + fontColor.R + ',' + fontColor.G + ',' + fontColor.B + ',' + 1 + ')';
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    FormFields.prototype.formFieldsReadOnly = function (isReadonly) {
        // tslint:disable-next-line
        var formFields = document.getElementsByClassName('e-pdfviewer-formFields');
        this.makeformFieldsReadonly(formFields, isReadonly);
        // tslint:disable-next-line
        var signatureFields = document.getElementsByClassName('e-pdfviewer-signatureformFields');
        this.makeformFieldsReadonly(signatureFields, isReadonly);
    };
    // tslint:disable-next-line
    FormFields.prototype.makeformFieldsReadonly = function (formFields, isReadonly) {
        for (var i = 0; i < formFields.length; i++) {
            if (formFields[i]) {
                // tslint:disable-next-line
                var inputField = formFields[i];
                if (!isReadonly) {
                    inputField.disabled = true;
                    inputField.style.cursor = 'default';
                }
                else {
                    // tslint:disable-next-line
                    inputField.disabled = false;
                }
            }
        }
    };
    // tslint:disable-next-line
    FormFields.prototype.applyTabIndex = function (data, inputField, pageIndex) {
        inputField.tabIndex = data.TabIndex;
        this.maxTabIndex = Math.max(this.maxTabIndex, inputField.tabIndex);
        if (this.minTabIndex === -1) {
            this.minTabIndex = inputField.tabIndex;
        }
        this.minTabIndex = Math.min(this.minTabIndex, inputField.tabIndex);
        this.maintainTabIndex[pageIndex.toString()] = this.maxTabIndex;
        this.maintanMinTabindex[pageIndex.toString()] = this.minTabIndex;
    };
    // tslint:disable-next-line
    FormFields.prototype.checkIsRequiredField = function (data, inputField) {
        if (data.IsRequired) {
            inputField.required = true;
            inputField.style.border = '1px solid red';
        }
        else {
            // tslint:disable-next-line
            var borderColor = data.BorderColor;
            inputField.style.border = data.BorderWidth;
            inputField.style.borderColor = 'rgba(' + borderColor.R + ',' + borderColor.G + ',' + borderColor.B + ',' + 1 + ')';
        }
        if (inputField.type !== 'checkbox' && inputField.type !== 'radio') {
            var borderStyle = data.BorderStyle;
            this.addBorderStylePropety(borderStyle, inputField);
        }
    };
    // tslint:disable-next-line
    FormFields.prototype.applyDefaultColor = function (inputField) {
        // tslint:disable-next-line:max-line-length
        if (inputField.type !== 'button' && (inputField.style.backgroundColor === 'rgba(255, 255, 255, 0.2)' || inputField.style.backgroundColor === 'rgba(0, 0, 0, 0.2)')) {
            inputField.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
        }
        if (inputField.style.color === 'rgba(255, 255, 255, 0.2)') {
            inputField.style.color = 'black';
        }
    };
    // tslint:disable-next-line
    FormFields.prototype.addAlignmentPropety = function (data, inputField) {
        // tslint:disable-next-line
        var alignment = data.Alignment;
        switch (alignment) {
            case 0:
                inputField.style.textAlign = 'left';
                break;
            case 1:
                inputField.style.textAlign = 'center';
                break;
            case 2:
                inputField.style.textAlign = 'right';
                break;
            case 3:
                inputField.style.textAlign = 'justify';
                break;
        }
    };
    // tslint:disable-next-line
    FormFields.prototype.addBorderStylePropety = function (borderStyle, inputField) {
        // tslint:disable-next-line
        switch (borderStyle) {
            case 0:
                inputField.style.borderStyle = 'solid';
                break;
            case 1:
                inputField.style.borderStyle = 'dashed';
                break;
            case 2:
                inputField.style.borderStyle = 'outset';
                break;
            case 3:
                inputField.style.borderStyle = 'inset';
                break;
            case 4:
                inputField.style.borderStyle = 'outset';
                break;
            case 5:
                inputField.style.borderStyle = 'dotted';
                break;
            case 6:
                inputField.style.borderStyle = 'inset';
                break;
        }
    };
    // tslint:disable-next-line
    FormFields.prototype.createRadioBoxField = function (data, pageIndex, type, printContainer) {
        // tslint:disable-next-line
        var inputField = document.createElement('input');
        inputField.type = type;
        if (data.Selected) {
            inputField.checked = true;
        }
        else if (type === 'checkbox' && !printContainer) {
            inputField.style.webkitAppearance = 'none';
        }
        inputField.name = data.GroupName;
        inputField.value = data.Value;
        return inputField;
    };
    // tslint:disable-next-line
    FormFields.prototype.createDropDownField = function (data, pageIndex, index, printContainer) {
        // tslint:disable-next-line
        var inputField = document.createElement('select');
        // tslint:disable-next-line
        var childItems = data['TextList'];
        if (data.Selected && !printContainer) {
            // tslint:disable-next-line
            var previousField = document.getElementById('editableDropdown' + pageIndex + '_' + index);
            if (previousField) {
                previousField.remove();
            }
            // tslint:disable-next-line
            var inputFields = document.createElement('input');
            inputFields.id = 'editableDropdown' + pageIndex + '_' + index;
            inputFields.setAttribute('list', this.pdfViewer.element.id + 'input_' + pageIndex + '_' + index);
            // tslint:disable-next-line
            var bounds = data['LineBounds'];
            // tslint:disable-next-line
            var font = data['Font'];
            this.applyPosition(inputFields, bounds, font);
            inputFields.style.backgroundColor = 'rgba(0, 20, 200, 0.2)';
            inputFields.className = 'e-pdfviewer-formFields';
            if (data.selectedIndex === -1) {
                inputFields.value = data.SelectedValue;
            }
            if (printContainer) {
                printContainer.appendChild(inputFields);
            }
            else {
                var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
                textLayer.appendChild(inputFields);
            }
            inputFields.addEventListener('focus', this.focusFormFields.bind(this));
            inputFields.addEventListener('blur', this.blurFormFields.bind(this));
            inputFields.addEventListener('click', this.updateFormFields.bind(this));
            inputFields.addEventListener('change', this.changeFormFields.bind(this));
            inputFields.addEventListener('keydown', this.updateFormFieldsValue.bind(this));
            inputField = document.createElement('DATALIST');
        }
        for (var j = 0; j < childItems.length; j++) {
            // tslint:disable-next-line
            var option = document.createElement('option');
            option.className = 'e-dropdownSelect';
            if (data.SelectedValue === childItems[j] || data.selectedIndex === j) {
                option.selected = true;
            }
            else {
                option.selected = false;
            }
            option.innerHTML = childItems[j];
            inputField.appendChild(option);
        }
        inputField.name = data.Text;
        return inputField;
    };
    // tslint:disable-next-line
    FormFields.prototype.createListBoxField = function (data, pageIndex) {
        // tslint:disable-next-line
        var inputField = document.createElement('select');
        inputField.multiple = true;
        // tslint:disable-next-line
        var childItems = data['TextList'];
        for (var j = 0; j < childItems.length; j++) {
            // tslint:disable-next-line
            var option = document.createElement('option');
            option.className = 'e-pdfviewer-ListBox';
            for (var k = 0; k < data.SelectedList.length; k++) {
                if (data.SelectedList[k] === j) {
                    option.selected = true;
                }
            }
            option.innerHTML = childItems[j];
            inputField.appendChild(option);
        }
        inputField.name = data.Text;
        return inputField;
    };
    // tslint:disable-next-line
    FormFields.prototype.createSignatureField = function (data, pageIndex, index, printContainer) {
        // tslint:disable-next-line
        var inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.name = data.FieldName;
        // tslint:disable-next-line
        var previousField = document.getElementById('signIcon' + pageIndex + '_' + index);
        if (previousField && !printContainer) {
            previousField.remove();
        }
        // tslint:disable-next-line
        var span = document.createElement('span');
        var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageIndex);
        // tslint:disable-next-line
        var bounds = data['LineBounds'];
        // tslint:disable-next-line
        var font = data['Font'];
        var left = this.ConvertPointToPixel(bounds.X);
        var top = this.ConvertPointToPixel(bounds.Y);
        // tslint:disable-next-line:max-line-length
        var height = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height > bounds.Height / 2 ? bounds.Height / 2 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.height;
        // tslint:disable-next-line:max-line-length
        var width = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width > bounds.Width / 2 ? bounds.Width / 2 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.width;
        // tslint:disable-next-line:max-line-length
        var fontSize = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize > height / 2 ? 10 : this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.fontSize;
        span.style.position = 'absolute';
        span.id = 'signIcon' + pageIndex + '_' + index;
        var zoomvalue = this.pdfViewerBase.getZoomFactor();
        span.style.left = left * zoomvalue + 'px';
        span.style.top = top * zoomvalue + 'px';
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            span.style.height = 5 + 'px';
            span.style.width = 10 + 'px';
            span.style.fontSize = '3px';
        }
        else {
            span.style.height = height + 'px';
            span.style.width = width + 'px';
            span.style.fontSize = fontSize;
        }
        span.style.padding = '2px';
        span.style.textAlign = 'center';
        span.style.boxSizing = 'content-box';
        // tslint:disable-next-line
        span.innerHTML = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.text : 'Sign';
        span.style.color = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.color : 'black';
        // tslint:disable-next-line
        span.style.backgroundColor = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.backgroundColor : 'orange';
        span.style.opacity = this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity ? this.pdfViewer.signatureFieldSettings.signatureIndicatorSettings.opacity : 1;
        textLayer.appendChild(span);
        this.addSignaturePath(data);
        return inputField;
    };
    // tslint:disable-next-line
    FormFields.prototype.addSignaturePath = function (signData) {
        this.isSignatureField = false;
        // tslint:disable-next-line
        var data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        var formFieldsData = JSON.parse(data);
        for (var m = 0; m < formFieldsData.length; m++) {
            // tslint:disable-next-line
            var currentData = formFieldsData[m];
            // tslint:disable-next-line:max-line-length
            if ((currentData.Name === 'ink' || currentData.Name === 'SignatureField' || currentData.Name === 'SignatureImage' || currentData.Name === 'SignatureText') && currentData.FieldName === signData.FieldName && currentData.Value && currentData.Value !== '') {
                signData.Value = currentData.Value;
                signData.Bounds = currentData.LineBounds;
                signData.FontFamily = currentData.FontFamily;
                signData.FontSize = currentData.FontSize;
                this.isSignatureField = true;
                break;
            }
        }
        return this.isSignatureField;
    };
    // tslint:disable-next-line
    FormFields.prototype.applyPosition = function (inputField, bounds, font) {
        if (bounds) {
            var left = this.ConvertPointToPixel(bounds.X);
            var top_1 = this.ConvertPointToPixel(bounds.Y);
            var width = this.ConvertPointToPixel(bounds.Width);
            var height = this.ConvertPointToPixel(bounds.Height);
            var fontHeight = 0;
            if (font !== null && font.Height) {
                inputField.style.fontfamily = font.Name;
                if (font.Italic) {
                    inputField.style.fontStyle = 'italic';
                }
                if (font.Bold) {
                    inputField.style.fontWeight = 'Bold';
                }
                fontHeight = this.ConvertPointToPixel(font.Size);
            }
            this.setStyleToTextDiv(inputField, left, top_1, fontHeight, width, height, false);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    FormFields.prototype.setStyleToTextDiv = function (textDiv, left, top, fontHeight, width, height, isPrint) {
        if (textDiv && (textDiv.tagName.toLowerCase() === 'div')) {
            textDiv.style.position = 'absolute';
        }
        var zoomvalue = this.pdfViewerBase.getZoomFactor();
        if (isPrint) {
            zoomvalue = 1;
        }
        textDiv.style.left = left * zoomvalue + 'px';
        textDiv.style.top = top * zoomvalue + 'px';
        textDiv.style.height = height * zoomvalue + 'px';
        textDiv.style.width = width * zoomvalue + 'px';
        textDiv.style.margin = '0px';
        if (fontHeight > 0) {
            textDiv.style.fontSize = fontHeight * zoomvalue + 'px';
        }
    };
    // tslint:disable-next-line
    FormFields.prototype.renderExistingAnnnot = function (data, index, printContainer) {
        if (!printContainer) {
            // tslint:disable-next-line
            var bounds = void 0;
            if (data.Bounds && data.Name !== 'ink') {
                bounds = data.Bounds;
            }
            else {
                bounds = data.LineBounds;
            }
            var currentLeft = this.ConvertPointToPixel(bounds.X);
            var currentTop = this.ConvertPointToPixel(bounds.Y);
            var currentWidth = this.ConvertPointToPixel(bounds.Width);
            var currentHeight = this.ConvertPointToPixel(bounds.Height);
            // tslint:disable-next-line
            var currentPage = parseFloat(data['PageIndex']);
            var annot = void 0;
            // tslint:disable-next-line
            var collectionData = processPathData(data.Value);
            // tslint:disable-next-line
            if ((data.Value.split('base64,')[1])) {
                annot = {
                    // tslint:disable-next-line:max-line-length
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureImage', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            }
            else if (collectionData.length === 0) {
                annot = {
                    // tslint:disable-next-line:max-line-length
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'SignatureText', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }, fontFamily: data.FontFamily, fontSize: data.FontSize
                };
                annot.fontFamily = data.FontFamily ? data.FontFamily : data.fontFamily;
                annot.fontSize = data.FontSize ? data.FontSize : data.fontSize;
            }
            else {
                annot = {
                    // tslint:disable-next-line:max-line-length
                    id: this.pdfViewer.element.id + 'input_' + currentPage + '_' + index, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: currentPage, data: data.Value, modifiedDate: '',
                    shapeAnnotationType: 'Path', opacity: 1, rotateAngle: 0, annotName: '', comments: [], review: { state: '', stateModel: '', modifiedDate: '', author: '' }
                };
            }
            this.pdfViewer.add(annot);
            data.Bounds = annot.bounds;
            // tslint:disable-next-line
            var canvass = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentPage);
            // tslint:disable-next-line
            this.pdfViewer.renderDrawing(canvass, currentPage);
        }
    };
    FormFields.prototype.resetFormFields = function () {
        var formFieldData = this.pdfViewer.formFieldCollections;
        for (var i = 0; i < formFieldData.length; i++) {
            var currentData = formFieldData[i];
            this.currentTarget = document.getElementById(currentData.id);
            if (currentData.type === 'Textbox') {
                this.currentTarget.value = currentData.value;
            }
            else if (currentData.type === 'RadioButton') {
                this.currentTarget.checked = currentData.value;
                if (currentData.value) {
                    this.updateDataInSession(this.currentTarget);
                }
            }
            else if (currentData.type === 'DropDown') {
                this.currentTarget.value = currentData.value;
            }
            else if (currentData.type === 'CheckBox') {
                this.currentTarget.checked = currentData.value;
            }
            else if (currentData.type === 'SignatureField') {
                // tslint:disable-next-line
                var annotation = this.pdfViewer.nameTable[currentData.id];
                if (annotation) {
                    if (this.currentTarget && this.currentTarget.className === 'e-pdfviewer-signatureformFields signature') {
                        this.currentTarget.className = 'e-pdfviewer-signatureformFields';
                        this.currentTarget.style.pointerEvents = '';
                        this.updateDataInSession(this.currentTarget, '');
                    }
                    this.pdfViewer.remove(annotation);
                    this.pdfViewer.renderDrawing();
                }
            }
            if (currentData.type !== 'RadioButton' && currentData.type !== 'SignatureField') {
                this.updateDataInSession(this.currentTarget);
            }
        }
    };
    FormFields.prototype.clearFormFields = function () {
        // tslint:disable-next-line
        var data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        var formFieldsData = JSON.parse(data);
        var isFirstRadio = true;
        for (var m = 0; m < formFieldsData.length; m++) {
            // tslint:disable-next-line
            var currentData = formFieldsData[m];
            // tslint:disable-next-line
            this.currentTarget = document.getElementById(currentData.uniqueID);
            if (currentData.Name === 'Textbox') {
                this.currentTarget.value = '';
            }
            else if (currentData.Name === 'RadioButton') {
                if (isFirstRadio) {
                    this.currentTarget.checked = true;
                    this.updateDataInSession(this.currentTarget);
                    isFirstRadio = false;
                }
            }
            else if (currentData.Name === 'DropDown') {
                this.currentTarget.value = currentData.TextList[0];
            }
            else if (currentData.Name === 'CheckBox') {
                this.currentTarget.checked = false;
            }
            else if (currentData.Name === 'SignatureField') {
                // tslint:disable-next-line
                var annotation = this.pdfViewer.nameTable[currentData.uniqueID];
                if (annotation) {
                    if (this.currentTarget && this.currentTarget.className === 'e-pdfviewer-signatureformFields signature') {
                        this.currentTarget.className = 'e-pdfviewer-signatureformFields';
                        this.currentTarget.style.pointerEvents = '';
                        this.updateDataInSession(this.currentTarget, '');
                    }
                    this.pdfViewer.remove(annotation);
                    this.pdfViewer.renderDrawing();
                }
            }
            if (currentData.Name !== 'SignatureField' && currentData.Name !== 'ink' && currentData.Name !== 'RadioButton') {
                this.updateDataInSession(this.currentTarget);
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    FormFields.prototype.ConvertPointToPixel = function (number) {
        return (number * (96 / 72));
    };
    /**
     * @private
     */
    FormFields.prototype.destroy = function () {
        this.currentTarget = null;
        this.readOnlyCollection = [];
    };
    /**
     * @private
     */
    FormFields.prototype.getModuleName = function () {
        return 'FormFields';
    };
    return FormFields;
}());
export { FormFields };
