import * as CLS from '../base/classes';
import * as events from '../base/constant';
import { read, paste, Search, filter, Download, Delete } from '../common/operations';
import { getValue, setValue, isNullOrUndefined as isNOU, matches, select, createElement } from '@syncfusion/ej2-base';
import { closest, detach, isBlazor } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { createDialog } from '../pop-up/dialog';
/**
 * Utility file for common actions
 * @private
 */
export function updatePath(node, data, instance) {
    var text = getValue('name', data);
    var id = node.getAttribute('data-id');
    var newText = isNOU(id) ? text : id;
    instance.setProperties({ path: getPath(node, newText, instance.hasId) }, true);
    instance.pathId = getPathId(node);
    instance.pathNames = getPathNames(node, text);
}
export function getPath(element, text, hasId) {
    var matched = getParents(element, text, false, hasId);
    var path = hasId ? '' : '/';
    var len = matched.length - (hasId ? 1 : 2);
    for (var i = len; i >= 0; i--) {
        path += matched[i] + '/';
    }
    return path;
}
export function getPathId(node) {
    var matched = getParents(node, node.getAttribute('data-uid'), true);
    var ids = [];
    for (var i = matched.length - 1; i >= 0; i--) {
        ids.push(matched[i]);
    }
    return ids;
}
export function getPathNames(element, text) {
    var matched = getParents(element, text, false);
    var names = [];
    for (var i = matched.length - 1; i >= 0; i--) {
        names.push(matched[i]);
    }
    return names;
}
export function getParents(element, text, isId, hasId) {
    var matched = [text];
    var el = element.parentNode;
    while (!isNOU(el)) {
        if (matches(el, '.' + CLS.LIST_ITEM)) {
            var parentText = isId ? el.getAttribute('data-uid') : (hasId ? el.getAttribute('data-id') :
                select('.' + CLS.LIST_TEXT, el).textContent);
            matched.push(parentText);
        }
        el = el.parentNode;
        if (el.classList.contains(CLS.TREE_VIEW)) {
            break;
        }
    }
    return matched;
}
export function generatePath(parent) {
    var key = parent.hasId ? 'id' : 'name';
    var newPath = parent.hasId ? '' : '/';
    var i = parent.hasId ? 0 : 1;
    for (i; i < parent.pathId.length; i++) {
        var data = getValue(parent.pathId[i], parent.feParent);
        newPath += getValue(key, data) + '/';
    }
    parent.setProperties({ path: newPath }, true);
}
export function removeActive(parent) {
    if (parent.isCut) {
        removeBlur(parent);
        parent.selectedNodes = [];
        parent.actionRecords = [];
        parent.enablePaste = false;
        parent.notify(events.hidePaste, {});
    }
}
// Selects active element in File Manager
export function activeElement(action, parent) {
    parent.isSearchCut = false;
    parent.actionRecords = [];
    parent.activeElements = [];
    parent.notify(events.cutCopyInit, {});
    if (parent.activeElements.length === 0) {
        return false;
    }
    removeBlur(parent);
    var blurEle = parent.activeElements;
    if (parent.activeModule !== 'navigationpane') {
        parent.targetPath = parent.path;
    }
    else {
        parent.targetPath = getParentPath(parent.path);
    }
    var i = 0;
    if (blurEle) {
        getModule(parent, blurEle[0]);
        if (action === 'cut') {
            while (i < blurEle.length) {
                addBlur(blurEle[i]);
                i++;
            }
        }
    }
    i = 0;
    parent.selectedNodes = [];
    parent.enablePaste = true;
    parent.notify(events.showPaste, {});
    while (i < parent.activeRecords.length) {
        parent.actionRecords.push(parent.activeRecords[i]);
        parent.selectedNodes.push(getValue('name', parent.activeRecords[i]));
        i++;
    }
    if ((parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) &&
        parent.activeModule !== 'navigationpane') {
        parent.selectedNodes = [];
        parent.isSearchCut = true;
        var i_1 = 0;
        while (i_1 < parent.selectedItems.length) {
            parent.selectedNodes.push(parent.selectedItems[i_1]);
            i_1++;
        }
    }
    return true;
}
export function addBlur(nodes) {
    nodes.classList.add(CLS.BLUR);
}
// Removes blur from elements
export function removeBlur(parent, hover) {
    var blurEle = (!hover) ? parent.element.querySelectorAll('.' + CLS.BLUR) :
        parent.element.querySelectorAll('.' + CLS.HOVER);
    var i = 0;
    while (i < blurEle.length) {
        (!hover) ? blurEle[i].classList.remove(CLS.BLUR) : blurEle[i].classList.remove(CLS.HOVER);
        i++;
    }
}
// Gets module name
export function getModule(parent, element) {
    if (element) {
        if (element.classList.contains(CLS.ROW)) {
            parent.activeModule = 'detailsview';
        }
        else if (closest(element, '.' + CLS.LARGE_ICON)) {
            parent.activeModule = 'largeiconsview';
        }
        else {
            parent.activeModule = 'navigationpane';
        }
    }
}
export function searchWordHandler(parent, value, isLayoutChange) {
    var searchWord;
    if (value.length === 0 && !parent.isFiltered) {
        parent.notify(events.pathColumn, { args: parent });
    }
    if (parent.searchSettings.filterType === 'startsWith') {
        searchWord = value + '*';
    }
    else if (parent.searchSettings.filterType === 'endsWith') {
        searchWord = '*' + value;
    }
    else {
        searchWord = '*' + value + '*';
    }
    parent.searchWord = searchWord;
    parent.itemData = [getPathObject(parent)];
    if (value.length > 0) {
        var caseSensitive = parent.searchSettings.ignoreCase;
        var hiddenItems = parent.showHiddenItems;
        Search(parent, isLayoutChange ? events.layoutChange : events.search, parent.path, searchWord, hiddenItems, !caseSensitive);
    }
    else {
        if (!parent.isFiltered) {
            read(parent, isLayoutChange ? events.layoutChange : events.search, parent.path);
        }
        else {
            filter(parent, events.layoutChange);
        }
    }
}
export function updateLayout(parent, view) {
    parent.setProperties({ view: view }, true);
    if (parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) {
        parent.layoutSelectedItems = parent.selectedItems;
    }
    var searchWord = '';
    if (parent.breadcrumbbarModule.searchObj.element.value) {
        searchWord = parent.breadcrumbbarModule.searchObj.element.value;
    }
    parent.isLayoutChange = true;
    searchWordHandler(parent, searchWord, true);
}
/* istanbul ignore next */
export function getTargetModule(parent, element) {
    var tartgetModule = '';
    if (element) {
        if (closest(element, '.e-gridcontent')) {
            tartgetModule = 'detailsview';
        }
        else if (closest(element, '.' + CLS.LARGE_ICONS)) {
            tartgetModule = 'largeiconsview';
        }
        else if (element.classList.contains('e-fullrow') ||
            element.classList.contains('e-icon-expandable')) {
            tartgetModule = 'navigationpane';
        }
        else if (closest(element, '.e-address-list-item')) {
            tartgetModule = 'breadcrumbbar';
        }
        else {
            tartgetModule = '';
        }
    }
    parent.targetModule = tartgetModule;
}
/* istanbul ignore next */
export function refresh(parent) {
    parent.itemData = [getPathObject(parent)];
    if (!hasReadAccess(parent.itemData[0])) {
        createDeniedDialog(parent, parent.itemData[0], events.permissionRead);
    }
    else {
        read(parent, events.refreshEnd, parent.path);
    }
}
export function openAction(parent) {
    read(parent, events.openEnd, parent.path);
}
export function getPathObject(parent) {
    return getValue(parent.pathId[parent.pathId.length - 1], parent.feParent);
}
// Copy files
export function copyFiles(parent) {
    if (!activeElement('copy', parent)) {
        return;
    }
    else {
        parent.fileAction = 'copy';
    }
}
// Cut files
export function cutFiles(parent) {
    if (!activeElement('cut', parent)) {
        return;
    }
    else {
        parent.isCut = true;
        parent.fileAction = 'move';
    }
}
// To add class for fileType
export function fileType(file) {
    var isFile = getValue('isFile', file);
    if (!isFile) {
        return CLS.FOLDER;
    }
    var imageFormat = ['bmp', 'dib', 'jpg', 'jpeg', 'jpe', 'jfif', 'gif', 'tif', 'tiff', 'png', 'ico'];
    var audioFormat = ['mp3', 'wav', 'aac', 'ogg', 'wma', 'aif', 'fla', 'm4a'];
    var videoFormat = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'avi', 'wmv', 'mp4', '3gp'];
    var knownFormat = ['css', 'exe', 'html', 'js', 'msi', 'pdf', 'pptx', 'ppt', 'rar', 'zip', 'txt', 'docx', 'doc',
        'xlsx', 'xls', 'xml', 'rtf', 'php'];
    var filetype = getValue('type', file);
    filetype = filetype.toLowerCase();
    if (filetype.indexOf('.') !== -1) {
        filetype = filetype.split('.').join('');
    }
    var iconType;
    if (imageFormat.indexOf(filetype) !== -1) {
        iconType = CLS.ICON_IMAGE;
    }
    else if (audioFormat.indexOf(filetype) !== -1) {
        iconType = CLS.ICON_MUSIC;
    }
    else if (videoFormat.indexOf(filetype) !== -1) {
        iconType = CLS.ICON_VIDEO;
    }
    else if (knownFormat.indexOf(filetype) !== -1) {
        iconType = 'e-fe-' + filetype;
    }
    else {
        iconType = 'e-fe-unknown e-fe-' + filetype;
    }
    return iconType;
}
/* istanbul ignore next */
export function getImageUrl(parent, item) {
    var baseUrl = parent.ajaxSettings.getImageUrl ? parent.ajaxSettings.getImageUrl : parent.ajaxSettings.url;
    var imgUrl;
    var fileName = getValue('name', item);
    var fPath = getValue('filterPath', item);
    if (parent.hasId) {
        var imgId = getValue('id', item);
        imgUrl = baseUrl + '?path=' + parent.path + '&id=' + imgId;
    }
    else if (!isNOU(fPath)) {
        imgUrl = baseUrl + '?path=' + fPath.replace(/\\/g, '/') + fileName;
    }
    else {
        imgUrl = baseUrl + '?path=' + parent.path + fileName;
    }
    imgUrl = imgUrl + '&time=' + (new Date().getTime()).toString();
    var eventArgs = {
        fileDetails: [item],
        imageUrl: imgUrl
    };
    parent.trigger('beforeImageLoad', eventArgs);
    return eventArgs.imageUrl;
}
/* istanbul ignore next */
export function getFullPath(parent, data, path) {
    var filePath = getValue(parent.hasId ? 'id' : 'name', data) + '/';
    var fPath = getValue(parent.hasId ? 'filterId' : 'filterPath', data);
    if (!isNOU(fPath)) {
        return fPath.replace(/\\/g, '/') + filePath;
    }
    else {
        return path + filePath;
    }
}
export function getName(parent, data) {
    var name = getValue('name', data);
    var fPath = getValue('filterPath', data);
    if ((parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) && !isNOU(fPath)) {
        fPath = fPath.replace(/\\/g, '/');
        name = fPath.replace(parent.path, '') + name;
    }
    return name;
}
export function getSortedData(parent, items) {
    if (items.length === 0) {
        return items;
    }
    var query;
    if (parent.sortOrder !== 'None') {
        query = new Query().sortBy(parent.sortBy, parent.sortOrder.toLowerCase(), true).group('isFile');
    }
    else {
        query = new Query().group('isFile');
    }
    var lists = new DataManager(items).executeLocal(query);
    return getValue('records', lists);
}
export function getObject(parent, key, value) {
    var currFiles = getValue(parent.pathId[parent.pathId.length - 1], parent.feFiles);
    var query = new Query().where(key, 'equal', value);
    var lists = new DataManager(currFiles).executeLocal(query);
    return lists[0];
}
export function createEmptyElement(parent, element, args) {
    var top;
    var layoutElement = select('#' + parent.element.id + CLS.LAYOUT_ID, parent.element);
    var addressBarHeight = select('#' + parent.element.id + CLS.BREADCRUMBBAR_ID, layoutElement).offsetHeight;
    top = layoutElement.offsetHeight - addressBarHeight;
    if (parent.view === 'Details') {
        top = top - select('.' + CLS.GRID_HEADER, layoutElement).offsetHeight;
    }
    if (isNOU(element.querySelector('.' + CLS.EMPTY))) {
        var emptyDiv = createElement('div', { className: CLS.EMPTY });
        var emptyFolder = createElement('div', { className: CLS.LARGE_EMPTY_FOLDER });
        var emptyEle = createElement('div', { className: CLS.EMPTY_CONTENT });
        var dragFile = createElement('div', { className: CLS.EMPTY_INNER_CONTENT });
        if (parent.view === 'Details') {
            element.querySelector('.' + CLS.GRID_VIEW).appendChild(emptyDiv);
        }
        else {
            element.appendChild(emptyDiv);
        }
        emptyDiv.appendChild(emptyFolder);
        emptyDiv.appendChild(emptyEle);
        emptyDiv.appendChild(dragFile);
    }
    if (element.querySelector('.' + CLS.EMPTY)) {
        if (!isNOU(args.error)) {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Access-Denied');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Access-Details');
        }
        else if (parent.isFiltered) {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Filter-Empty');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Filter-Key');
        }
        else if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Search-Empty');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Search-Key');
        }
        else {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Folder-Empty');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'File-Upload');
        }
    }
    var eDiv = select('.' + CLS.EMPTY, element);
    top = (top - eDiv.offsetHeight) / 2;
    eDiv.style.marginTop = top + 'px';
}
export function getDirectories(files) {
    return new DataManager(files).executeLocal(new Query().where(events.isFile, 'equal', false, false));
}
export function setNodeId(result, rootId) {
    var dirs = getDirectories(result.files);
    for (var i = 0, len = dirs.length; i < len; i++) {
        setValue('_fm_id', rootId + '_' + i, dirs[i]);
    }
}
export function setDateObject(args) {
    for (var i = 0; i < args.length; i++) {
        setValue('_fm_created', new Date(getValue('dateCreated', args[i])), args[i]);
        setValue('_fm_modified', new Date(getValue('dateModified', args[i])), args[i]);
    }
}
export function getLocaleText(parent, text) {
    var locale = parent.localeObj.getConstant(text);
    return (locale === '') ? text : locale;
}
export function getCssClass(parent, css) {
    var cssClass = parent.cssClass;
    cssClass = (isNOU(cssClass) || cssClass === '') ? css : (cssClass + ' ' + css);
    return cssClass;
}
export function sortbyClickHandler(parent, args) {
    var tick;
    if (args.item.id.indexOf('ascending') !== -1 || args.item.id.indexOf('descending') !== -1 || args.item.id.indexOf('none') !== -1) {
        tick = true;
    }
    else {
        tick = false;
    }
    if (!tick) {
        parent.sortBy = getSortField(args.item.id);
    }
    else {
        parent.sortOrder = getSortField(args.item.id);
    }
    parent.itemData = [getPathObject(parent)];
    if (parent.view === 'Details') {
        if (parent.isMobile) {
            updateLayout(parent, 'Details');
        }
        else {
            parent.notify(events.sortColumn, { module: 'detailsview' });
        }
    }
    if (parent.view === 'LargeIcons') {
        updateLayout(parent, 'LargeIcons');
    }
    parent.notify(events.sortByChange, {});
}
export function getSortField(id) {
    var text = id.substring(id.lastIndexOf('_') + 1);
    var field = text;
    switch (text) {
        case 'date':
            field = '_fm_modified';
            break;
        case 'ascending':
            field = 'Ascending';
            break;
        case 'descending':
            field = 'Descending';
            break;
        case 'none':
            field = 'None';
            break;
    }
    return field;
}
export function setNextPath(parent, path) {
    var currfolders = path.split('/');
    var folders = parent.originalPath.split('/');
    var root = getValue(parent.pathId[0], parent.feParent);
    var key = isNOU(getValue('id', root)) ? 'name' : 'id';
    for (var i = currfolders.length - 1, len = folders.length - 1; i < len; i++) {
        var eventName = (folders[i + 1] === '') ? events.finalizeEnd : events.initialEnd;
        var newPath = (folders[i] === '') ? '/' : (parent.path + folders[i] + '/');
        var data = getObject(parent, key, folders[i]);
        var id = getValue('_fm_id', data);
        parent.setProperties({ path: newPath }, true);
        parent.pathId.push(id);
        parent.itemData = [data];
        parent.pathNames.push(getValue('name', data));
        read(parent, eventName, parent.path);
        break;
    }
}
export function openSearchFolder(parent, data) {
    parent.notify(events.clearPathInit, { selectedNode: parent.pathId[parent.pathId.length - 1] });
    parent.originalPath = getFullPath(parent, data, parent.path);
    read(parent, (parent.path !== parent.originalPath) ? events.initialEnd : events.finalizeEnd, parent.path);
}
export function pasteHandler(parent) {
    parent.isDragDrop = false;
    if (parent.selectedNodes.length !== 0 && parent.enablePaste) {
        var path = (parent.folderPath === '') ? parent.path : parent.folderPath;
        var subFolder = validateSubFolder(parent, parent.actionRecords, path, parent.path);
        if (!subFolder) {
            if ((parent.fileAction === 'move' && parent.targetPath !== path) || parent.fileAction === 'copy') {
                parent.notify(events.pasteInit, {});
                paste(parent, parent.targetPath, parent.selectedNodes, path, parent.fileAction, [], parent.actionRecords);
            }
            else {
                parent.enablePaste = false;
                parent.notify(events.hidePaste, {});
                removeBlur(parent);
            }
        }
    }
}
export function validateSubFolder(parent, data, dropPath, dragPath) {
    var subFolder = false;
    for (var i = 0; i < data.length; i++) {
        if (!getValue('isFile', data[i])) {
            var tempTarget = getFullPath(parent, data[i], dragPath);
            if (dropPath.indexOf(tempTarget) === 0) {
                var result = {
                    files: null,
                    error: {
                        code: '402',
                        message: getLocaleText(parent, 'Sub-Folder-Error'),
                        fileExists: null
                    },
                };
                createDialog(parent, 'Error', result);
                subFolder = true;
                break;
            }
        }
    }
    return subFolder;
}
export function dropHandler(parent) {
    parent.isDragDrop = true;
    if (parent.dragData.length !== 0) {
        parent.dragPath = parent.dragPath.replace(/\\/g, '/');
        parent.dropPath = parent.dropPath.replace(/\\/g, '/');
        var subFolder = validateSubFolder(parent, parent.dragData, parent.dropPath, parent.dragPath);
        if (!subFolder && (parent.dragPath !== parent.dropPath)) {
            parent.itemData = [parent.dropData];
            paste(parent, parent.dragPath, parent.dragNodes, parent.dropPath, 'move', [], parent.dragData);
            parent.notify(events.pasteInit, {});
        }
    }
}
export function getParentPath(oldPath) {
    var path = oldPath.split('/');
    var newPath = path[0] + '/';
    for (var i = 1; i < path.length - 2; i++) {
        newPath += path[i] + '/';
    }
    return newPath;
}
export function getDirectoryPath(parent, args) {
    var filePath = getValue(parent.hasId ? 'id' : 'name', args.cwd) + '/';
    var fPath = getValue(parent.hasId ? 'filterId' : 'filterPath', args.cwd);
    if (!isNOU(fPath)) {
        if (fPath === '') {
            return parent.hasId ? filePath : '/';
        }
        return fPath.replace(/\\/g, '/') + filePath;
    }
    else {
        return parent.path + filePath;
    }
}
export function doPasteUpdate(parent, operation, result) {
    if (operation === 'move') {
        if (!parent.isDragDrop) {
            parent.enablePaste = false;
            parent.notify(events.hidePaste, {});
            parent.notify(events.cutEnd, result);
        }
        else {
            parent.notify(events.dragEnd, result);
        }
    }
    if (parent.duplicateItems.length === 0) {
        parent.pasteNodes = [];
    }
    var flag = false;
    for (var count = 0; (count < result.files.length) && !flag; count++) {
        parent.pasteNodes.push(result.files[count][parent.hasId ? 'id' : 'name']);
        if (parent.isDragDrop) {
            parent.droppedObjects.push(result.files[count]);
        }
    }
    parent.duplicateItems = [];
    parent.duplicateRecords = [];
    if (parent.isDragDrop && !parent.isPasteError) {
        parent.isDropEnd = true;
    }
    else {
        parent.isDropEnd = false;
    }
    if (!parent.isDragDrop || (parent.path === parent.dragPath) || (parent.path === parent.dropPath)
        || parent.isSearchDrag) {
        parent.isPathDrag = false;
        read(parent, events.pasteEnd, parent.path);
    }
    else {
        readDropPath(parent);
    }
    parent.trigger('success', { action: operation, result: result });
}
export function readDropPath(parent) {
    var pathId = getValue('_fm_id', parent.dropData);
    parent.expandedId = pathId;
    parent.itemData = [parent.dropData];
    if (parent.isPathDrag) {
        parent.notify(events.pathDrag, parent.itemData);
    }
    else {
        if (parent.navigationpaneModule) {
            var node = select('[data-uid="' + pathId + '"]', parent.navigationpaneModule.treeObj.element);
            updatePath(node, parent.dropData, parent);
        }
        read(parent, events.dropPath, parent.dropPath);
    }
}
export function getDuplicateData(parent, name) {
    var data = null;
    var records = parent.isDragDrop ? parent.dragData : parent.actionRecords;
    for (var i = 0; i < records.length; i++) {
        if (getValue('name', records[i]) === name) {
            data = records[i];
            break;
        }
    }
    return data;
}
export function createVirtualDragElement(parent) {
    parent.isSearchDrag = false;
    if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
        parent.isSearchDrag = true;
    }
    if (parent.activeModule !== 'navigationpane') {
        parent.dragNodes = [];
        var i = 0;
        while (i < parent.selectedItems.length) {
            parent.dragNodes.push(parent.selectedItems[i]);
            i++;
        }
    }
    var cloneIcon = parent.createElement('div', {
        className: 'e-fe-icon ' + fileType(parent.dragData[0])
    });
    var cloneName = parent.createElement('div', {
        className: 'e-fe-name',
        innerHTML: parent.dragData[0].name
    });
    var virtualEle = parent.createElement('div', {
        className: 'e-fe-content'
    });
    virtualEle.appendChild(cloneIcon);
    virtualEle.appendChild(cloneName);
    var ele = parent.createElement('div', {
        className: CLS.CLONE
    });
    ele.appendChild(virtualEle);
    if (parent.dragNodes.length > 1) {
        var badge = parent.createElement('span', {
            className: 'e-fe-count',
            innerHTML: (parent.dragNodes.length).toString(10)
        });
        ele.appendChild(badge);
    }
    parent.virtualDragElement = ele;
    parent.element.appendChild(parent.virtualDragElement);
}
export function dragStopHandler(parent, args) {
    var dragArgs = args;
    dragArgs.cancel = false;
    if (parent.treeExpandTimer != null) {
        window.clearTimeout(parent.treeExpandTimer);
        parent.treeExpandTimer = null;
    }
    removeDropTarget(parent);
    parent.element.classList.remove('e-fe-drop', 'e-no-drop');
    removeBlur(parent);
    parent.uploadObj.dropArea = select('#' + parent.element.id + CLS.CONTENT_ID, parent.element);
    var virtualEle = select('.' + CLS.CLONE, parent.element);
    if (virtualEle) {
        detach(virtualEle);
    }
    getTargetModule(parent, args.target);
    parent.notify(events.dropInit, args);
    removeBlur(parent, 'hover');
    dragArgs.fileDetails = parent.dragData;
    parent.trigger('fileDragStop', dragArgs, function (dragArgs) {
        if (!dragArgs.cancel && !isNOU(parent.targetModule) && parent.targetModule !== '') {
            dropHandler(parent);
        }
    });
}
export function dragStartHandler(parent, args, dragObj) {
    var dragArgs = args;
    dragArgs.cancel = false;
    dragArgs.fileDetails = parent.dragData;
    parent.droppedObjects = [];
    if (!parent.allowDragAndDrop || ((parent.activeModule === 'navigationpane') &&
        (closest(args.element, 'li').getAttribute('data-uid') === parent.pathId[0]))) {
        dragArgs.cancel = true;
    }
    if ((parent.activeModule === 'navigationpane') &&
        (parent.pathId.indexOf(closest(args.element, 'li').getAttribute('data-uid')) !== -1)) {
        parent.isPathDrag = true;
    }
    else {
        parent.isPathDrag = false;
    }
    removeBlur(parent);
    if (dragArgs.cancel) {
        dragObj.intDestroy(args.event);
        dragCancel(parent);
    }
    else if (!dragArgs.cancel) {
        var i = 0;
        while (i < parent.activeElements.length) {
            addBlur(parent.activeElements[i]);
            i++;
        }
        parent.trigger('fileDragStart', dragArgs, function (dragArgs) {
            if (dragArgs.cancel) {
                dragObj.intDestroy(args.event);
                dragCancel(parent);
            }
            else {
                parent.uploadObj.dropArea = null;
                if (isBlazor()) {
                    dragArgs.bindEvents(dragArgs.dragElement);
                }
            }
        });
    }
}
export function dragCancel(parent) {
    removeBlur(parent);
    var virtualEle = select('.' + CLS.CLONE, parent.element);
    if (virtualEle) {
        detach(virtualEle);
    }
}
export function removeDropTarget(parent) {
    removeItemClass(parent, CLS.DROP_FOLDER);
    removeItemClass(parent, CLS.DROP_FILE);
}
export function removeItemClass(parent, value) {
    var ele = parent.element.querySelectorAll('.' + value);
    for (var i = 0; i < ele.length; i++) {
        ele[i].classList.remove(value);
    }
}
export function draggingHandler(parent, args) {
    var dragArgs = args;
    dragArgs.fileDetails = parent.dragData;
    var canDrop = false;
    getTargetModule(parent, args.target);
    removeDropTarget(parent);
    if (parent.treeExpandTimer != null) {
        window.clearTimeout(parent.treeExpandTimer);
        parent.treeExpandTimer = null;
    }
    removeBlur(parent, 'hover');
    var node = null;
    if (parent.targetModule === 'navigationpane') {
        node = closest(args.target, 'li');
        node.classList.add(CLS.HOVER, CLS.DROP_FOLDER);
        canDrop = true;
        /* istanbul ignore next */
        parent.treeExpandTimer = window.setTimeout(function () { parent.notify(events.dragging, args); }, 800);
    }
    else if (parent.targetModule === 'detailsview') {
        node = closest(args.target, 'tr');
        if (node && node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
            node.classList.add(CLS.DROP_FOLDER);
        }
        else if (node && !node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
            node.classList.add(CLS.DROP_FILE);
        }
        canDrop = true;
    }
    else if (parent.targetModule === 'largeiconsview') {
        node = closest(args.target, 'li');
        if (node && node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
            node.classList.add(CLS.HOVER, CLS.DROP_FOLDER);
        }
        canDrop = true;
        /* istanbul ignore next */
    }
    else if (parent.targetModule === 'breadcrumbbar') {
        canDrop = true;
    }
    parent.element.classList.remove('e-fe-drop', 'e-no-drop');
    parent.element.classList.add(canDrop ? 'e-fe-drop' : 'e-no-drop');
    parent.trigger('fileDragging', dragArgs);
}
// Ignored the message key value in permission object
export function objectToString(data) {
    var str = '';
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== 'message') {
            str += (i === 0 ? '' : ', ') + keys[i] + ': ' + getValue(keys[i], data);
        }
    }
    return str;
}
export function getItemName(parent, data) {
    if (parent.hasId) {
        return getValue('id', data);
    }
    return getName(parent, data);
}
export function updateRenamingData(parent, data) {
    parent.itemData = [data];
    parent.currentItemText = getValue('name', data);
    parent.isFile = getValue('isFile', data);
    parent.filterPath = getValue('filterPath', data);
}
export function doRename(parent) {
    if (!hasEditAccess(parent.itemData[0])) {
        createDeniedDialog(parent, parent.itemData[0], events.permissionEdit);
    }
    else {
        createDialog(parent, 'Rename');
    }
}
/* istanbul ignore next */
export function doDownload(parent) {
    var items = parent.itemData;
    for (var i = 0; i < items.length; i++) {
        if (!hasDownloadAccess(items[i])) {
            createDeniedDialog(parent, items[i], events.permissionDownload);
            return;
        }
    }
    if (parent.selectedItems.length > 0) {
        Download(parent, parent.path, parent.selectedItems);
    }
}
export function doDeleteFiles(parent, data, newIds) {
    for (var i = 0; i < data.length; i++) {
        if (!hasEditAccess(data[i])) {
            createDeniedDialog(parent, data[i], events.permissionEdit);
            return;
        }
    }
    parent.itemData = data;
    Delete(parent, newIds, parent.path, 'delete');
}
/* istanbul ignore next */
export function doDownloadFiles(parent, data, newIds) {
    for (var i = 0; i < data.length; i++) {
        if (!hasDownloadAccess(data[i])) {
            createDeniedDialog(parent, data[i], events.permissionDownload);
            return;
        }
    }
    parent.itemData = data;
    if (newIds.length > 0) {
        Download(parent, parent.path, newIds);
    }
}
export function createDeniedDialog(parent, data, action) {
    var message = getValue('message', getValue('permission', data));
    if (message === '') {
        message = getLocaleText(parent, 'Access-Message').replace('{0}', getValue('name', data)).replace('{1}', action);
    }
    var response = {
        error: {
            code: '401',
            fileExists: null,
            message: message
        }
    };
    createDialog(parent, 'Error', response);
}
export function getAccessClass(data) {
    return !hasReadAccess(data) ? 'e-fe-locked e-fe-hidden' : 'e-fe-locked';
}
export function hasReadAccess(data) {
    var permission = getValue('permission', data);
    return (permission && !getValue('read', permission)) ? false : true;
}
export function hasEditAccess(data) {
    var permission = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('write', permission))) : true;
}
export function hasContentAccess(data) {
    var permission = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('writeContents', permission))) : true;
}
export function hasUploadAccess(data) {
    var permission = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('upload', permission))) : true;
}
export function hasDownloadAccess(data) {
    var permission = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('download', permission))) : true;
}
export function createNewFolder(parent) {
    var details = parent.itemData[0];
    if (!hasContentAccess(details)) {
        createDeniedDialog(parent, details, events.permissionEditContents);
    }
    else {
        createDialog(parent, 'NewFolder');
    }
}
export function uploadItem(parent) {
    var details = parent.itemData[0];
    if (!hasUploadAccess(details)) {
        createDeniedDialog(parent, details, events.permissionUpload);
    }
    else {
        var eleId = '#' + parent.element.id + CLS.UPLOAD_ID;
        var uploadEle = document.querySelector(eleId);
        uploadEle.click();
    }
}
