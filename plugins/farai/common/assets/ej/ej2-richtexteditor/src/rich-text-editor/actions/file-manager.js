import { Browser, detach, closest, isNullOrUndefined as isNOU, EventHandler } from '@syncfusion/ej2-base';
import { ContextMenu, DetailsView, FileManager as EJ2FileManager } from '@syncfusion/ej2-filemanager';
import { NavigationPane, Toolbar } from '@syncfusion/ej2-filemanager';
import { RenderType } from '../base/enum';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { dispatchEvent } from '../base/util';
/**
 * `FileManager` module is used to display the directories and images inside the editor.
 */
var FileManager = /** @class */ (function () {
    function FileManager(parent, locator) {
        EJ2FileManager.Inject(ContextMenu, DetailsView, NavigationPane, Toolbar);
        this.parent = parent;
        this.i10n = locator.getService('rteLocale');
        this.dialogRenderObj = locator.getService('dialogRenderObject');
        this.rendererFactory = locator.getService('rendererFactory');
        this.addEventListener();
    }
    FileManager.prototype.initialize = function () {
        this.parent.fileManagerModule = this;
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
    };
    FileManager.prototype.render = function (e) {
        var _this = this;
        var dlgInsert;
        if (e.selectNode && e.selectNode[0].nodeName === 'IMG') {
            dlgInsert = this.parent.localeObj.getConstant('dialogUpdate');
        }
        else {
            dlgInsert = this.i10n.getConstant('dialogInsert');
        }
        var dlgHeader = this.parent.localeObj.getConstant('fileDialogHeader');
        var dlgCancel = this.i10n.getConstant('dialogCancel');
        this.dlgButtons = [{
                click: this.insertImageUrl.bind(this),
                buttonModel: { content: dlgInsert, cssClass: 'e-flat e-insertImage', isPrimary: true }
            },
            {
                click: function (e) { _this.cancelDialog(); },
                buttonModel: { cssClass: 'e-flat e-cancel', content: dlgCancel }
            }];
        this.dlgButtons[0].buttonModel.disabled = true;
        this.selectObj = { selection: e.selection, args: e.args, selectParent: e.selectParent };
        var dlgTarget = this.parent.createElement('div', {
            className: 'e-rte-file-manager-dialog', id: this.parent.getID() + '_file-manager-dialog',
            attrs: { 'aria-owns': this.parent.getID() }
        });
        document.body.appendChild(dlgTarget);
        this.fileWrap = this.parent.createElement('div', {
            id: this.parent.getID() + '_rte-file-manager', className: 'e-img-file-wrap'
        });
        dlgTarget.appendChild(this.fileWrap);
        dlgTarget.appendChild(this.getInputUrlElement());
        var dialogModel = {
            visible: false,
            isModal: true, header: dlgHeader,
            target: document.body, locale: this.parent.locale,
            enableRtl: this.parent.enableRtl, cssClass: classes.CLS_RTE_ELEMENTS,
            animationSettings: { effect: 'None' },
            showCloseIcon: true, closeOnEscape: true, width: '720px', height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: this.dlgButtons,
            created: this.renderFileManager.bind(this),
            close: function (e) {
                _this.parent.isBlur = false;
                if (e && e.event.returnValue) {
                    _this.selectObj.selection.restore();
                }
                _this.destroyComponents();
                _this.dialogRenderObj.close(e);
            },
        };
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(dlgTarget);
        this.dialogObj.show(Browser.isDevice ? true : false);
    };
    FileManager.prototype.renderFileManager = function () {
        var _this = this;
        var proxy = this;
        this.fileObj = new EJ2FileManager({
            allowMultiSelection: false,
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            path: this.parent.fileManagerSettings.path,
            view: this.parent.fileManagerSettings.view,
            enablePersistence: this.parent.enablePersistence,
            cssClass: this.parent.fileManagerSettings.cssClass,
            sortOrder: this.parent.fileManagerSettings.sortOrder,
            ajaxSettings: this.parent.fileManagerSettings.ajaxSettings,
            showThumbnail: this.parent.fileManagerSettings.showThumbnail,
            rootAliasName: this.parent.fileManagerSettings.rootAliasName,
            uploadSettings: this.parent.fileManagerSettings.uploadSettings,
            searchSettings: this.parent.fileManagerSettings.searchSettings,
            toolbarSettings: this.parent.fileManagerSettings.toolbarSettings,
            showHiddenItems: this.parent.fileManagerSettings.showHiddenItems,
            allowDragAndDrop: this.parent.fileManagerSettings.allowDragAndDrop,
            showFileExtension: this.parent.fileManagerSettings.showFileExtension,
            detailsViewSettings: this.parent.fileManagerSettings.detailsViewSettings,
            contextMenuSettings: this.parent.fileManagerSettings.contextMenuSettings,
            navigationPaneSettings: this.parent.fileManagerSettings.navigationPaneSettings,
            fileSelect: function (e) {
                var selectedFile = e.fileDetails;
                if (selectedFile.isFile && proxy.parent.insertImageSettings.allowedTypes.indexOf(selectedFile.type) > -1) {
                    proxy.inputUrl.value = proxy.parent.fileManagerSettings.ajaxSettings.getImageUrl + '?path=' +
                        (selectedFile.filterPath && selectedFile.filterPath.replace(/\\/g, '/')) + selectedFile.name;
                    _this.dlgButtons[0].buttonModel.disabled = false;
                }
                else {
                    proxy.inputUrl.value = '';
                    _this.dlgButtons[0].buttonModel.disabled = true;
                }
                _this.dialogObj.buttons = _this.dlgButtons;
            },
            created: function () {
                _this.inputUrl.removeAttribute('disabled');
            },
            success: function () {
                _this.fileObj.refreshLayout();
            }
        });
        if (Browser.isDevice) {
            this.fileObj.height = '85%';
        }
        this.fileObj.appendTo(this.fileWrap);
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
    };
    FileManager.prototype.getInputUrlElement = function () {
        var imgUrl = this.parent.createElement('div', { className: 'imgUrl' });
        var urlLabel = this.parent.createElement('div', { className: 'e-rte-label' });
        urlLabel.innerHTML = '<label for="rteSample_img_url">' + this.i10n.getConstant('linkWebUrl') + '</label>';
        imgUrl.appendChild(urlLabel);
        var placeUrl = this.i10n.getConstant('imageUrl');
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-img-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false', disabled: 'true' }
        });
        imgUrl.appendChild(this.inputUrl);
        return imgUrl;
    };
    FileManager.prototype.insertImageUrl = function (e) {
        var url = this.inputUrl.value;
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        if (url !== '') {
            if (this.parent.editorMode === 'HTML' &&
                isNOU(closest(this.selectObj.selection.range.startContainer.parentNode, '#' + this.contentModule.getPanel().id))) {
                this.contentModule.getEditPanel().focus();
                var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
                this.selectObj.selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
                this.selectObj.selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            var regex = /[\w-]+.(jpg|png|jpeg|gif)/g;
            var matchUrl = (!isNOU(url.match(regex)) && this.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            var value = {
                cssClass: (this.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                url: url, selection: this.selectObj.selection, altText: matchUrl, selectParent: this.selectObj.selectParent,
                width: {
                    width: this.parent.insertImageSettings.width, minWidth: this.parent.insertImageSettings.minWidth,
                    maxWidth: this.parent.getInsertImgMaxWidth()
                },
                height: {
                    height: this.parent.insertImageSettings.height, minHeight: this.parent.insertImageSettings.minHeight,
                    maxHeight: this.parent.insertImageSettings.maxHeight
                }
            };
            this.parent.formatter.process(this.parent, this.selectObj.args, this.selectObj.args.originalEvent, value);
            this.dialogObj.hide({ returnValue: false });
        }
    };
    FileManager.prototype.cancelDialog = function () {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true });
    };
    FileManager.prototype.onDocumentClick = function (e) {
        var target = e.target;
        var prevEle = target.nodeName !== '#document' && !isNOU(target.previousElementSibling) && target.previousElementSibling;
        if (!isNOU(this.dialogObj) &&
            (!closest(target, '#' + this.parent.getID() + '_file-manager-dialog') &&
                !closest(target, '#' + this.parent.getID() + '_rte-file-manager_tb_sortby-popup') &&
                !closest(target, '#' + this.parent.getID() + '_rte-file-manager_tb_view-popup') &&
                !closest(target, '#' + this.parent.getID() + '_rte-file-manager_contextmenu') &&
                (!(!isNOU(closest(target, '.e-contextmenu-wrapper')) &&
                    closest(target, '.e-contextmenu-wrapper').querySelector('#' + this.parent.getID() + '_rte-file-manager_contextmenu'))) &&
                (!isNOU(prevEle) && !prevEle.classList.contains('e-rte-file-manager-dialog')) &&
                (!isNOU(prevEle) && prevEle.id !== this.parent.getID() + '_rte-file-manager_contextmenu'))) {
            this.dialogObj.hide({ returnValue: true });
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
        else {
            this.parent.isRTE = true;
        }
    };
    FileManager.prototype.addEventListener = function () {
        this.parent.on(events.initialEnd, this.initialize, this);
        this.parent.on(events.renderFileManager, this.render, this);
        this.parent.on(events.destroy, this.destroy, this);
    };
    FileManager.prototype.removeEventListener = function () {
        EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
        this.parent.off(events.initialEnd, this.initialize);
        this.parent.off(events.renderFileManager, this.render);
        this.parent.off(events.destroy, this.destroy);
    };
    FileManager.prototype.destroyComponents = function () {
        if (this.fileObj) {
            this.fileObj.destroy();
            this.fileObj = null;
        }
        if (this.dialogObj) {
            this.dialogObj.destroy();
            detach(this.dialogObj.element);
            this.dialogObj = null;
        }
    };
    FileManager.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.destroyComponents();
        this.removeEventListener();
    };
    /**
     * For internal use only - Get the module name.
     */
    FileManager.prototype.getModuleName = function () {
        return 'fileManager';
    };
    return FileManager;
}());
export { FileManager };
