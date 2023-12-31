import { Dialog } from '@syncfusion/ej2-popups';
import { select, isNullOrUndefined as isNOU, createElement, Internationalization } from '@syncfusion/ej2-base';
import { getValue, remove, selectAll, isBlazor } from '@syncfusion/ej2-base';
import { createFolder } from '../common/operations';
import * as CLS from '../base/classes';
import * as events from '../base/constant';
import { paste, rename } from '../common/operations';
import { getLocaleText, getDuplicateData, getParentPath, objectToString, getCssClass } from '../common/utility';
import { Input } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
// tslint:disable-next-line
export function createDialog(parent, text, e, details, replaceItems) {
    var options = getOptions(parent, text, e, details, replaceItems);
    if (isNOU(parent.dialogObj)) {
        parent.dialogObj = new Dialog({
            beforeOpen: keydownAction.bind(this, parent, options.dialogName),
            beforeClose: function (args) {
                triggerPopupBeforeClose(parent, parent.dialogObj, args, options.dialogName);
            },
            header: options.header,
            content: options.content,
            buttons: options.buttons,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: true,
            allowDragging: true,
            isModal: true,
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? CLS.MOB_POPUP : CLS.ROOT_POPUP),
            width: '350px',
            open: options.open,
            close: options.close,
            enableRtl: parent.enableRtl,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
            locale: parent.locale
        });
        parent.dialogObj.isStringTemplate = true;
        parent.dialogObj.appendTo('#' + parent.element.id + CLS.DIALOG_ID);
    }
    else {
        changeOptions(parent, options);
    }
}
export function createExtDialog(parent, text, replaceItems, newPath) {
    var extOptions = getExtOptions(parent, text, replaceItems, newPath);
    parent.isApplySame = false;
    if (isNOU(parent.extDialogObj)) {
        parent.extDialogObj = new Dialog({
            beforeOpen: beforeExtOpen.bind(this, parent, extOptions.dialogName),
            beforeClose: function (args) {
                triggerPopupBeforeClose(parent, parent.extDialogObj, args, extOptions.dialogName);
            },
            content: extOptions.content,
            header: extOptions.header,
            closeOnEscape: true,
            allowDragging: true,
            animationSettings: { effect: 'None' },
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? CLS.MOB_POPUP : CLS.ROOT_POPUP),
            enableRtl: parent.enableRtl,
            showCloseIcon: true,
            isModal: true,
            width: 350,
            buttons: extOptions.buttons,
            open: extOptions.open,
            close: extOptions.close,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
            locale: parent.locale
        });
        parent.extDialogObj.isStringTemplate = true;
        parent.extDialogObj.appendTo('#' + parent.element.id + CLS.EXTN_DIALOG_ID);
    }
    else {
        parent.extDialogObj.header = extOptions.header;
        parent.extDialogObj.close = extOptions.close;
        parent.extDialogObj.open = extOptions.open;
        parent.extDialogObj.close = extOptions.close;
        parent.extDialogObj.content = extOptions.content;
        parent.extDialogObj.buttons = extOptions.buttons;
        parent.extDialogObj.enableRtl = parent.enableRtl;
        parent.extDialogObj.locale = parent.locale;
        parent.extDialogObj.beforeOpen = beforeExtOpen.bind(this, parent, extOptions.dialogName);
        parent.extDialogObj.beforeClose = function (args) {
            triggerPopupBeforeClose(parent, parent.extDialogObj, args, extOptions.dialogName);
        };
        parent.extDialogObj.dataBind();
        parent.extDialogObj.show();
    }
}
function triggerPopupBeforeOpen(parent, dlgModule, args, dialogName) {
    var eventArgs = {
        cancel: args.cancel, popupName: dialogName, popupModule: dlgModule
    };
    /* istanbul ignore next */
    if (isBlazor()) {
        delete eventArgs.popupModule;
    }
    parent.trigger('beforePopupOpen', eventArgs, function (eventargs) {
        args.cancel = eventargs.cancel;
    });
}
function triggerPopupBeforeClose(parent, dlgModule, args, dialogName) {
    var eventArgs = {
        cancel: args.cancel, popupModule: dlgModule, popupName: dialogName
    };
    /* istanbul ignore next */
    if (isBlazor()) {
        delete eventArgs.popupModule;
    }
    parent.trigger('beforePopupClose', eventArgs, function (eventargs) {
        args.cancel = eventargs.cancel;
        if (!args.cancel && args.isInteracted && ((dialogName === 'Rename') || (dialogName === 'Create Folder'))) {
            parent.trigger(events.actionFailure, {});
        }
    });
}
function triggerPopupOpen(parent, dlgModule, dialogName) {
    var args = { popupModule: dlgModule, element: dlgModule.element, popupName: dialogName };
    /* istanbul ignore next */
    if (isBlazor()) {
        delete args.popupModule;
    }
    parent.trigger('popupOpen', args);
}
function triggerPopupClose(parent, dlgModule, dialogName) {
    var args = { popupModule: dlgModule, element: dlgModule.element, popupName: dialogName };
    /* istanbul ignore next */
    if (isBlazor()) {
        delete args.popupModule;
    }
    parent.trigger('popupClose', args);
}
// tslint:disable-next-line:max-func-body-length
function getExtOptions(parent, text, replaceItems, newPath) {
    var options = {
        header: '', content: '', buttons: [], dialogName: ''
    };
    options.open = function () { triggerPopupOpen(parent, parent.extDialogObj, options.dialogName); };
    options.close = function () { triggerPopupClose(parent, parent.extDialogObj, options.dialogName); };
    switch (text) {
        case 'Extension':
            options.header = getLocaleText(parent, 'Header-Rename-Confirmation');
            options.content = '<div>' + getLocaleText(parent, 'Content-Rename-Confirmation') + '</div>';
            options.buttons = [{
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: function () {
                        parent.extDialogObj.hide();
                        rename(parent, newPath, parent.renameText);
                    }
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: function () {
                        parent.extDialogObj.hide();
                        parent.dialogObj.hide();
                    }
                }];
            options.dialogName = 'Extension Change';
            break;
        case 'DuplicateItems':
            options.dialogName = 'Duplicate Items';
            parent.replaceItems = replaceItems;
            var item = parent.replaceItems[parent.fileLength];
            var index = item.lastIndexOf('/');
            item = index === -1 ? item : item.substring(index);
            options.header = getLocaleText(parent, 'Header-Duplicate');
            var duplicateContent_1 = '<div>' + getLocaleText(parent, 'Content-Duplicate') + '</div>';
            options.content = (duplicateContent_1).replace('{0}', item);
            options.close = function () {
                if (!parent.isDropEnd && parent.duplicateItems.length === 0) {
                    var args = { fileDetails: parent.droppedObjects };
                    parent.trigger('fileDropped', args);
                    parent.isDropEnd = parent.isDragDrop = false;
                }
                triggerPopupClose(parent, parent.extDialogObj, options.dialogName);
            };
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: function () {
                        parent.duplicateItems.push(parent.replaceItems[parent.fileLength]);
                        parent.duplicateRecords.push(getDuplicateData(parent, parent.replaceItems[parent.fileLength]));
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            var item_1 = parent.replaceItems[parent.fileLength];
                            var indexval = item_1.lastIndexOf('/');
                            item_1 = indexval === -1 ? item_1 : item_1.substring(indexval);
                            parent.extDialogObj.content = (duplicateContent_1).replace('{0}', item_1);
                            parent.extDialogObj.show();
                        }
                        else {
                            parent.extDialogObj.hide();
                            var targetPath = parent.isDragDrop ? parent.dragPath : parent.targetPath;
                            var path = parent.isDragDrop ? parent.dropPath : ((parent.folderPath === '') ? parent.path :
                                parent.folderPath);
                            var action = parent.isDragDrop ? 'move' : parent.fileAction;
                            paste(parent, targetPath, parent.duplicateItems, path, action, parent.duplicateItems, parent.duplicateRecords);
                        }
                    }
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: function () {
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            var item_2 = parent.replaceItems[parent.fileLength];
                            var ind = item_2.lastIndexOf('/');
                            item_2 = ind === -1 ? item_2 : item_2.substring(ind);
                            parent.extDialogObj.content = (duplicateContent_1).replace('{0}', item_2);
                            parent.extDialogObj.show();
                        }
                        else {
                            parent.extDialogObj.hide();
                            if (parent.duplicateItems.length !== 0) {
                                var action = parent.isDragDrop ? 'move' : parent.fileAction;
                                var targetPath = parent.isDragDrop ? parent.dragPath : parent.targetPath;
                                var path = parent.isDragDrop ? parent.dropPath : ((parent.folderPath === '') ? parent.path :
                                    parent.folderPath);
                                paste(parent, targetPath, parent.duplicateItems, path, action, parent.duplicateItems, parent.duplicateRecords);
                            }
                        }
                    },
                }
            ];
            break;
        case 'UploadRetry':
            options.dialogName = 'Retry Upload';
            options.header = getLocaleText(parent, 'Header-Retry');
            options.content = parent.retryFiles[0].name + '<div class="e-fe-retrycontent">' +
                (getLocaleText(parent, 'Content-Retry')) + '</div>';
            options.open = onRetryOpen.bind(this, parent);
            options.close = function () {
                parent.isRetryOpened = false;
                retryDlgClose(parent);
                triggerPopupClose(parent, parent.extDialogObj, options.dialogName);
            };
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Keep-Both') },
                    click: function () {
                        retryDlgUpdate(parent, true);
                    }
                },
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Replace') },
                    click: function () {
                        retryDlgUpdate(parent, false);
                    }
                },
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Skip') },
                    click: function () {
                        var count = 0;
                        if (parent.isApplySame) {
                            count = parent.retryFiles.length;
                            parent.retryFiles = [];
                            retryDlgClose(parent);
                        }
                        else {
                            count = 1;
                            parent.retryFiles.splice(0, 1);
                            (parent.retryFiles.length !== 0) ? createExtDialog(parent, 'UploadRetry') : retryDlgClose(parent);
                        }
                        parent.notify(events.skipUpload, { count: count });
                    }
                }
            ];
            break;
    }
    return options;
}
function retryDlgUpdate(parent, isKeepBoth) {
    if (parent.isApplySame) {
        isKeepBoth ? onKeepBothAll(parent) : onReplaceAll(parent);
        retryDlgClose(parent);
    }
    else {
        parent.retryArgs.push({
            action: isKeepBoth ? 'keepboth' : 'replace',
            file: parent.retryFiles[0]
        });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
        (parent.retryFiles.length !== 0) ? createExtDialog(parent, 'UploadRetry') : retryDlgClose(parent);
    }
}
function retryDlgClose(parent) {
    var flag = true;
    if (parent.isRetryOpened) {
        parent.isRetryOpened = false;
    }
    else {
        flag = false;
    }
    var ele = select('.e-dlg-checkbox', parent.extDialogObj.element);
    if (ele) {
        remove(ele);
    }
    if (flag) {
        parent.extDialogObj.hide();
    }
    else {
        parent.retryFiles = [];
    }
}
function onRetryOpen(parent, args) {
    parent.isRetryOpened = true;
    var dialogEle = getValue('element', args);
    var container = select('.e-dlg-content', dialogEle);
    var checkContainer = parent.createElement('div', {
        className: 'e-dlg-checkbox'
    });
    var checkbox = parent.createElement('input', {
        id: parent.element.id + '_applyall'
    });
    checkContainer.appendChild(checkbox);
    container.appendChild(checkContainer);
    var checkBoxObj = new CheckBox({
        label: getLocaleText(parent, 'ApplyAll-Label'),
        change: function (args) {
            parent.isApplySame = args.checked;
        }
    });
    checkBoxObj.appendTo('#' + parent.element.id + '_applyall');
    triggerPopupOpen(parent, parent.extDialogObj, 'Retry Upload');
}
function onKeepBothAll(parent) {
    while (parent.retryFiles.length !== 0) {
        parent.retryArgs.push({ action: 'keepboth', file: parent.retryFiles[0] });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
    }
}
function onReplaceAll(parent) {
    while (parent.retryFiles.length !== 0) {
        parent.retryArgs.push({ action: 'replace', file: parent.retryFiles[0] });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
    }
}
function focusInput(parent) {
    var ele = select('#newname', parent.dialogObj.element);
    ele.focus();
    ele.value = '';
    var len = ele.value.length;
    ele.setSelectionRange(0, len);
}
function onFolderDialogOpen(parent) {
    var ele = select('#newname', parent.dialogObj.element);
    if (!ele.parentElement.classList.contains('e-control-wrapper')) {
        createInput(ele, getLocaleText(parent, 'Content-NewFolder'));
    }
    ele.parentElement.nextElementSibling.innerHTML = '';
    ele.oninput = function () {
        onValidate(parent, ele);
    };
    ele.onkeyup = function (e) {
        var code = getKeyCode(e);
        if (code === 13) {
            onSubmit(parent);
        }
    };
    focusInput(parent);
    triggerPopupOpen(parent, parent.dialogObj, 'Create Folder');
}
function onRenameDialogOpen(parent) {
    var inputEle = select('#rename', parent.dialogObj.element);
    if (!inputEle.parentElement.classList.contains('e-control-wrapper')) {
        createInput(inputEle, getLocaleText(parent, 'Content-Rename'));
    }
    inputEle.parentElement.nextElementSibling.innerHTML = '';
    inputEle.oninput = function () {
        onValidate(parent, inputEle);
    };
    inputEle.onkeyup = function (e) {
        var code = getKeyCode(e);
        if (code === 13) {
            onReSubmit(parent);
        }
    };
    onFocusRenameInput(parent, inputEle);
    triggerPopupOpen(parent, parent.dialogObj, 'Rename');
}
function onFocusRenameInput(parent, inputEle) {
    inputEle.focus();
    var txt = '';
    if (parent.isFile && !parent.showFileExtension) {
        var index = parent.currentItemText.lastIndexOf('.');
        txt = (index === -1) ? parent.currentItemText : parent.currentItemText.substring(0, index);
    }
    else {
        txt = parent.currentItemText;
    }
    inputEle.value = txt;
    if (parent.isFile && parent.showFileExtension && (inputEle.value.indexOf('.') !== -1)) {
        inputEle.setSelectionRange(0, inputEle.value.lastIndexOf('.'));
    }
    else {
        inputEle.setSelectionRange(0, inputEle.value.length);
    }
}
function createInput(ele, placeholder) {
    Input.createInput({
        element: ele,
        properties: {
            placeholder: placeholder
        }
    });
}
// tslint:disable-next-line
/* istanbul ignore next */
function getOptions(parent, text, e, details, replaceItems) {
    var options = {
        header: '', content: '', buttons: [], dialogName: ''
    };
    options.open = function () { triggerPopupOpen(parent, parent.dialogObj, options.dialogName); };
    options.close = function () { triggerPopupClose(parent, parent.dialogObj, options.dialogName); };
    text = (details && details.multipleFiles === true) ? 'MultipleFileDetails' : text;
    switch (text) {
        case 'NewFolder':
            options.dialogName = 'Create Folder';
            options.header = getLocaleText(parent, 'Header-NewFolder');
            options.content = '<input type="text" value="New folder" id="newname"><div class="e-fe-error"></div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Create') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        onSubmit(parent);
                    },
                }
            ];
            options.open = onFolderDialogOpen.bind(this, parent);
            break;
        case 'Delete':
            options.dialogName = 'Delete';
            if (parent.selectedItems.length > 1) {
                options.content = ('<div>' + getLocaleText(parent, 'Content-Multiple-Delete') + '</div>')
                    .replace('{0}', parent.selectedItems.length.toString());
                options.header = getLocaleText(parent, 'Header-Multiple-Delete');
            }
            else {
                options.content = '<div>' + getLocaleText(parent, parent.isFile ? 'Content-Delete' : 'Content-Folder-Delete') + '</div>';
                options.header = getLocaleText(parent, parent.isFile ? 'Header-Delete' : 'Header-Folder-Delete');
            }
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: function (e) {
                        onDeleteSubmit(parent);
                    },
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: function () {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'Rename':
            options.dialogName = 'Rename';
            options.header = getLocaleText(parent, 'Header-Rename');
            options.content = '<input type="text" class="e-input" id="rename"><div class="e-fe-error"></div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Save') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        onReSubmit(parent);
                    },
                }
            ];
            options.open = onRenameDialogOpen.bind(this, parent);
            break;
        case 'details':
            options.dialogName = 'File Details';
            var intl = new Internationalization(parent.locale);
            var formattedString = intl.formatDate(new Date(details.modified), { format: 'MMMM dd, yyyy HH:mm:ss' });
            var permission = '';
            if (!isNOU(details.permission)) {
                permission = '<tr><td>' + getLocaleText(parent, 'Permission') + '</td><td class="' + CLS.VALUE + '" >'
                    + objectToString(details.permission) + '</td></tr>';
            }
            options.header = details.name;
            options.content = '<table>' +
                '<tr><td>' + getLocaleText(parent, 'Type') + '</td><td class="' + CLS.VALUE + '" title="' +
                (details.isFile ? 'File' : 'Folder') + '">' + (details.isFile ? 'File' : 'Folder') + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Size') + '</td><td><span class="' + CLS.VALUE + '" title ="' +
                details.size + '">' + details.size + '</span></td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Location') + '</td><td class="' + CLS.VALUE + '" title="' +
                details.location + '">' + details.location + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Modified') + '</td><td class="' + CLS.VALUE + '" >'
                + formattedString + '</td></tr>'
                + permission + '</table>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: function (e) {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'MultipleFileDetails':
            options.dialogName = 'File Details';
            var strArr = details.name.split(',').map(function (val) {
                var index = val.indexOf('.') + 1;
                return (index === 0) ? 'Folder' : val.substr(index).replace(' ', '');
            });
            var fileType = strArr.every(function (val, i, arr) { return val === arr[0]; }) ?
                ((strArr[0] === 'Folder') ? 'Folder' : strArr[0].toLocaleUpperCase() + ' Type') : 'Multiple Types';
            var location_1 = details.location;
            options.header = details.name;
            options.content = '<table><tr><td>' + getLocaleText(parent, 'Type')
                + ':</td><td class="' + CLS.VALUE + '">' + fileType + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Size') + ':</td><td>' +
                details.size + '<span class="' + CLS.VALUE + '" title ="' + details.size
                + '"></span></td></tr>' + '<tr><td>' + getLocaleText(parent, 'Location') +
                ':</td><td class="' + CLS.VALUE + '" title="' + location_1 + '">'
                + location_1 + '</td></tr>' + '</table>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'Error':
            parent.notify(events.actionFailure, {});
            options.dialogName = 'Error';
            var event_1 = e;
            if (event_1.error.code === '401') {
                options.header = '<span class="e-fe-icon e-fe-access-error"></span><div class="e-fe-access-header">' +
                    getLocaleText(parent, 'Access-Denied') + '</div>';
            }
            else {
                options.header = getLocaleText(parent, 'Error');
            }
            options.content = '<div class="' + CLS.ERROR_CONTENT + '">' + event_1.error.message + '</div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: function (e) {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
    }
    return options;
}
function keydownAction(parent, dialogName, args) {
    var btnElement = selectAll('.e-btn', parent.dialogObj.element);
    preventKeydown(btnElement);
    triggerPopupBeforeOpen(parent, parent.dialogObj, args, dialogName);
}
function beforeExtOpen(parent, dlgName, args) {
    var btnElement = selectAll('.e-btn', parent.extDialogObj.element);
    preventKeydown(btnElement);
    triggerPopupBeforeOpen(parent, parent.extDialogObj, args, dlgName);
}
function preventKeydown(btnElement) {
    var _loop_1 = function (btnCount) {
        btnElement[btnCount].onkeydown = function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        };
        btnElement[btnCount].onkeyup = function (e) {
            if (e.keyCode === 13) {
                btnElement[btnCount].click();
            }
        };
    };
    for (var btnCount = 0; btnCount < btnElement.length; btnCount++) {
        _loop_1(btnCount);
    }
}
/* istanbul ignore next */
function getFilesName(data) {
    var parent = createElement('div', { id: 'uploadDialog' });
    var ulElement = createElement('ul');
    var filesData = data.isModified ? data.modifiedFilesData : data.filesData;
    for (var fileCount = 0; fileCount < filesData.length; fileCount++) {
        var liElement = createElement('li', { className: 'dialogFiles' });
        liElement.innerHTML = filesData[fileCount].name;
        ulElement.appendChild(liElement);
    }
    parent.appendChild(ulElement);
    var errorTag = createElement('div', { className: 'e-fe-error' });
    parent.appendChild(errorTag);
    return parent;
}
function changeOptions(parent, options) {
    parent.dialogObj.header = options.header;
    parent.dialogObj.content = options.content;
    parent.dialogObj.buttons = options.buttons;
    parent.dialogObj.enableRtl = parent.enableRtl;
    parent.dialogObj.open = options.open;
    parent.dialogObj.close = options.close;
    parent.dialogObj.beforeOpen = keydownAction.bind(this, parent, options.dialogName);
    parent.dialogObj.beforeClose = function (args) {
        triggerPopupBeforeClose(parent, parent.dialogObj, args, options.dialogName);
    };
    parent.dialogObj.dataBind();
    parent.dialogObj.show();
}
function onSubmit(parent) {
    var ele = select('#newname', parent.dialogObj.element);
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    createFolder(parent, ele.value);
}
/* istanbul ignore next */
function onReSubmit(parent) {
    var ele = select('#rename', parent.dialogObj.element);
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    var text = ele.value;
    var oIndex = parent.currentItemText.lastIndexOf('.');
    if (parent.isFile && !parent.showFileExtension) {
        var extn = (oIndex === -1) ? '' : parent.currentItemText.substr(oIndex);
        text += extn;
    }
    parent.renameText = text;
    if (parent.currentItemText === text) {
        parent.dialogObj.hide();
        return;
    }
    var newPath = (parent.activeModule === 'navigationpane') ? getParentPath(parent.path) : parent.path;
    parent.renamedId = getValue('id', parent.itemData[0]);
    if (parent.isFile) {
        var oldExtension = (oIndex === -1) ? '' : parent.currentItemText.substr(oIndex);
        var nIndex = text.lastIndexOf('.');
        var newExtension = (nIndex === -1) ? '' : text.substr(nIndex);
        if (parent.showFileExtension && oldExtension !== newExtension) {
            createExtDialog(parent, 'Extension', null, newPath);
        }
        else {
            rename(parent, newPath, text);
        }
    }
    else {
        rename(parent, newPath, text);
    }
}
function onDeleteSubmit(parent) {
    parent.dialogObj.hide();
    parent.notify(events.deleteInit, {});
}
function onValidate(parent, ele) {
    if (/[/\\|*?"<>:]/.test(ele.value)) {
        addInvalid(parent, ele);
    }
    else if (ele.value === '') {
        ele.parentElement.nextElementSibling.innerHTML = getLocaleText(parent, 'Validation-Empty');
    }
    else {
        ele.parentElement.nextElementSibling.innerHTML = '';
    }
}
function onSubmitValidate(parent, ele) {
    onValidate(parent, ele);
    var len = ele.value.length - 1;
    if (ele.value !== '' && ((ele.value.lastIndexOf('.') === len) || (ele.value.lastIndexOf(' ') === len)) &&
        (parent.showFileExtension || (parent.currentItemText.lastIndexOf('.') === -1))) {
        addInvalid(parent, ele);
    }
}
function addInvalid(parent, ele) {
    var error = getLocaleText(parent, 'Validation-Invalid').replace('{0}', '"' + ele.value + '"');
    ele.parentElement.nextElementSibling.innerHTML = error;
}
function getKeyCode(e) {
    var code;
    if (e.keyCode) {
        code = e.keyCode;
    }
    else if (e.which) {
        code = e.which;
    }
    else {
        code = e.charCode;
    }
    return code;
}
export function createImageDialog(parent, header, imageUrl) {
    var content = createElement('div', { className: 'e-image-wrap' });
    var image = createElement('img', { className: 'e-image', attrs: { src: imageUrl, alt: header } });
    content.appendChild(image);
    if (isNOU(parent.viewerObj)) {
        parent.viewerObj = new Dialog({
            header: header,
            content: content,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: true,
            isModal: true,
            width: '350px',
            height: '350px',
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? CLS.MOB_POPUP : CLS.ROOT_POPUP),
            locale: parent.locale,
            enableResize: true,
            allowDragging: true,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
            position: { X: 'center', Y: 'center' },
            enableRtl: parent.enableRtl,
            open: openImage.bind(this, parent),
            close: function () { triggerPopupClose(parent, parent.viewerObj, 'Image Preview'); },
            beforeOpen: function (args) {
                triggerPopupBeforeOpen(parent, parent.viewerObj, args, 'Image Preview');
            },
            beforeClose: function (args) {
                triggerPopupBeforeClose(parent, parent.viewerObj, args, 'Image Preview');
            },
            resizing: updateImage.bind(this, parent),
            resizeStop: updateImage.bind(this, parent)
        });
        parent.viewerObj.isStringTemplate = true;
        parent.viewerObj.appendTo('#' + parent.element.id + CLS.IMG_DIALOG_ID);
    }
    else {
        parent.viewerObj.refresh();
        parent.viewerObj.header = header;
        parent.viewerObj.content = content;
        parent.viewerObj.enableRtl = parent.enableRtl;
        parent.viewerObj.dataBind();
        parent.viewerObj.show();
    }
}
function openImage(parent) {
    setTimeout(function () {
        if (parent.viewerObj) {
            parent.viewerObj.element.focus();
        }
    });
    updateImage(parent);
    triggerPopupOpen(parent, parent.viewerObj, 'Image Preview');
}
function updateImage(parent) {
    var content = select('.e-dlg-content', parent.viewerObj.element);
    var imgWrap = select('.e-image-wrap', parent.viewerObj.element);
    var cssObj = window.getComputedStyle(content, null);
    var paddingWidth = cssObj ? (2 * parseFloat(cssObj.paddingRight)) : 36;
    var paddingHeight = cssObj ? (2 * parseFloat(cssObj.paddingBottom)) : 20;
    imgWrap.style.width = (content.offsetWidth - paddingWidth) + 'px';
    imgWrap.style.height = (content.offsetHeight - paddingHeight) + 'px';
}
