var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Dictionary } from '../../base/dictionary';
import { WAbstractList } from '../list/abstract-list';
import { WLevelOverride } from '../list/level-override';
import { WCharacterFormat, WParagraphFormat, WStyles } from '../format/index';
import { Layout } from './layout';
import { Renderer } from './render';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { Page, Rect, Widget, ListTextElementBox, ParagraphWidget, HeaderFooterWidget, Padding, DropDownFormField, TextFormField, CheckBoxFormField, ShapeElementBox, TextFrame, Footnote, FootnoteElementBox, FootNoteWidget, TextElementBox } from './page';
import { LineWidget, TableWidget } from './page';
import { HelperMethods, Point } from '../editor/editor-helper';
import { TextHelper } from './text-helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CommentReviewPane, } from '../index';
import { Zoom } from './zooming';
import { Dialog, createSpinner } from '@syncfusion/ej2-popups';
import { RestrictEditing } from '../restrict-editing/restrict-editing-pane';
import { FormFieldPopUp } from '../dialogs/form-field-popup';
import { TrackChangesPane } from '../track-changes/track-changes-pane';
/**
 * @private
 */
var DocumentHelper = /** @class */ (function () {
    //#endregion
    function DocumentHelper(owner) {
        var _this = this;
        /**
         * @private
         */
        this.scrollbarWidth = 0;
        /**
         * @private
         */
        this.isWebPrinting = false;
        /**
         * @private
         */
        this.isHeaderFooter = false;
        /**
         * @private
         */
        this.currentPage = undefined;
        this.selectionStartPageIn = undefined;
        this.selectionEndPageIn = undefined;
        /**
         * @private
         */
        this.fieldStacks = [];
        /**
         * @private
         */
        this.showRevision = false;
        /**
         * @private
         */
        this.splittedCellWidgets = [];
        /**
         * @private
         */
        this.tableLefts = [];
        /**
         * @private
         */
        this.tapCount = 0;
        this.timer = -1;
        this.isTimerStarted = false;
        /**
         * @private
         */
        this.isFirstLineFitInShiftWidgets = false;
        /**
         * @private
         */
        this.preZoomFactor = 0;
        /**
         * @private
         */
        this.preDifference = -1;
        /**
         * @private
         */
        this.fieldEndParagraph = undefined;
        /**
         * @private
         */
        this.fieldToLayout = undefined;
        /**
         * @private
         */
        this.backgroundColor = '#FFFFFF';
        // Event 
        /**
         * @private
         */
        this.isMouseDown = false;
        this.isMouseEntered = false;
        // tslint:disable-next-line
        this.scrollMoveTimer = 0;
        /**
         * @private
         */
        this.isSelectionChangedOnMouseMoved = false;
        /**
         * @private
         */
        this.isControlPressed = false;
        /**
         * @private
         */
        this.isTouchInput = false;
        /**
         * @private
         */
        this.isTouchMoved = false;
        /**
         * @private
         */
        this.useTouchSelectionMark = false;
        /**
         * @private
         */
        this.touchDownOnSelectionMark = 0;
        /**
         * @private
         */
        this.isComposingIME = false;
        /**
         * @private
         */
        this.lastComposedText = '';
        /**
         * @private
         */
        this.isCompositionStart = false;
        /**
         * @private
         */
        this.isCompositionUpdated = false;
        /**
         * @private
         */
        this.isCompositionCanceled = false;
        /**
         * @private
         */
        this.isCompositionEnd = false;
        /**
         * @private
         */
        this.prefix = '';
        /**
         * @private
         */
        this.suffix = '';
        /**
         * @private
         */
        this.fields = [];
        /**
         * @private
         */
        this.heightInfoCollection = {};
        /**
         * @private
         */
        this.defaultTabWidth = 36;
        /**
         * @private
         */
        this.dontUseHtmlParagraphAutoSpacing = false;
        /**
         * @private
         */
        this.alignTablesRowByRow = false;
        /**
         * @private
         */
        this.lists = [];
        /**
         * @private
         */
        this.comments = [];
        /**
         * @private
         */
        this.authors = new Dictionary();
        /**
         * @private
         */
        this.revisionsInternal = new Dictionary();
        /**
         * @private
         */
        this.commentUserOptionId = 1;
        /**
         * @private
         */
        this.abstractLists = [];
        /**
         * @private
         */
        this.styles = new WStyles();
        /**
         * @private
         */
        this.preDefinedStyles = undefined;
        /**
         * @private
         */
        this.isRowOrCellResizing = false;
        /**
         * @private
         */
        this.formFields = [];
        this.isMouseDownInFooterRegion = false;
        this.pageFitTypeIn = 'None';
        /**
         * @private
         */
        this.fieldCollection = [];
        /**
         * @private
         */
        this.isPageField = false;
        /**
         * @private
         */
        this.mouseDownOffset = new Point(0, 0);
        this.zoomFactorInternal = 1;
        /**
         * If movecaretposition is 1, Home key is pressed
         * If moveCaretPosition is 2, End key is pressed
         * @private
         */
        this.moveCaretPosition = 0;
        /**
         * @private
         */
        this.isTextInput = false;
        /**
         * @private
         */
        this.isScrollHandler = false;
        /**
         * @private
         */
        this.triggerElementsOnLoading = false;
        /**
         * @private
         */
        this.triggerSpellCheck = false;
        //Document Protection Properties Starts
        /**
         * preserve the format
         * @private
         */
        this.restrictFormatting = false;
        /**
         * preserve the document protection type either readonly or no protection
         * @private
         */
        this.protectionType = 'NoProtection';
        /**
         * Preserve the password protection is enforced or not
         * @private
         */
        this.isDocumentProtected = false;
        /**
         * preserve the hash value of password
         * @private
         */
        this.hashValue = '';
        /**
         * @private
         */
        this.saltValue = '';
        /**
         * @private
         */
        this.userCollection = [];
        /**
         * @private
         */
        this.cachedPages = [];
        /**
         * @private
         */
        this.skipScrollToPosition = false;
        /**
         * @private
         */
        this.isIosDevice = false;
        /**
         * @private
         */
        this.isMobileDevice = false;
        /**
         * @private
         */
        this.isFormFilling = false;
        /**
         * @private
         */
        this.footnotes = new Footnote();
        /**
         * @private
         */
        this.endnotes = new Footnote();
        /**
         * @private
         */
        this.isFootnoteWidget = false;
        this.onIframeLoad = function () {
            if (!isNullOrUndefined(_this.iframe) && _this.iframe.contentDocument.body.children.length === 0) {
                _this.initIframeContent();
                _this.wireInputEvents();
            }
        };
        /**
         * @private
         */
        this.onTextInput = function (event) {
            if (!_this.isComposingIME) {
                event.preventDefault();
                var text = event.data;
                _this.owner.editor.handleTextInput(text);
            }
        };
        //#region Composition Event
        /**
         * Fires when composition starts.
         * @private
         */
        this.compositionStart = function (event) {
            if (!Browser.isDevice && !_this.owner.isReadOnlyMode) {
                _this.isComposingIME = true;
                _this.positionEditableTarget();
                if (_this.owner.editorHistory) {
                    _this.owner.editor.initComplexHistory('IMEInput');
                }
            }
            _this.isCompositionStart = true;
        };
        /**
         * Fires on every input during composition.
         * @private
         */
        this.compositionUpdated = function (event) {
            if (_this.isComposingIME && !_this.owner.isReadOnlyMode) {
                /* tslint:disable:align */
                setTimeout(function () {
                    _this.owner.editor.insertIMEText(_this.getEditableDivTextContent(), true);
                }, 0);
            }
            _this.isCompositionUpdated = true;
        };
        /**
         * Fires when user selects a character/word and finalizes the input.
         * @private
         */
        this.compositionEnd = function (event) {
            if (_this.isComposingIME && !_this.owner.isReadOnlyMode) {
                var text = _this.getEditableDivTextContent();
                if (text !== '') {
                    _this.owner.editor.insertIMEText(text, false);
                }
                _this.isComposingIME = false;
                _this.lastComposedText = '';
                // tslint:disable-next-line:max-line-length
                _this.iframe.setAttribute('style', 'pointer-events:none;position:absolute;left:' + _this.owner.viewer.containerLeft + 'px;top:' + _this.owner.viewer.containerTop + 'px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden');
                _this.editableDiv.innerHTML = '';
                if (_this.owner.editorHistory) {
                    _this.owner.editorHistory.updateComplexHistory();
                    if (text === '') {
                        // tslint:disable-next-line:max-line-length
                        //When the composition in live. The Undo operation will terminate the composition and empty text will be return from text box.
                        //At that time the the history should be updated. Undo the operation and clear the redo stack. This undo operation will not be saved for redo operation.
                        _this.owner.editorHistory.undo();
                        _this.owner.editorHistory.redoStack.pop();
                    }
                }
            }
            event.preventDefault();
            _this.isCompositionUpdated = false;
            _this.isCompositionEnd = true;
        };
        // tslint:disable:no-any 
        this.onImageResizer = function (args) {
            if (!isNullOrUndefined(_this.owner.imageResizerModule) && _this.owner.imageResizerModule.isImageResizerVisible
                && _this.owner.imageResizerModule.isImageResizing) {
                if (args instanceof MouseEvent) {
                    _this.onMouseUpInternal(args);
                }
                else if (args instanceof TouchEvent) {
                    _this.onTouchUpInternal(args);
                }
            }
            if (_this.scrollMoveTimer) {
                _this.isMouseEntered = true;
                clearInterval(_this.scrollMoveTimer);
            }
        };
        /**
         * @private
         */
        // tslint:enable:no-any 
        this.onKeyPressInternal = function (event) {
            var key = event.which || event.keyCode;
            _this.triggerElementsOnLoading = false;
            var ctrl = (event.ctrlKey || event.metaKey) ? true : ((key === 17) ? true : false); // ctrl detection
            var alt = event.altKey ? event.altKey : ((key === 18) ? true : false); // alt key detection
            if (Browser.isIE && alt && ctrl) {
                ctrl = false;
            }
            if (ctrl && event.key === 'v' || ctrl && event.key === 'a') {
                return;
            }
            if (!_this.owner.isReadOnlyMode) {
                var key_1 = event.keyCode || event.charCode;
                var char = '';
                if (key_1) {
                    char = String.fromCharCode(key_1);
                }
                else if (event.key) {
                    char = event.key;
                }
                // tslint:disable-next-line:max-line-length
                if (char !== ' ' && char !== '\r' && char !== '\b' && char !== '\u001B' && !_this.owner.isReadOnlyMode && !ctrl) {
                    _this.owner.editorModule.handleTextInput(char);
                }
                else if (char === ' ') {
                    _this.triggerSpellCheck = true;
                    _this.owner.editorModule.handleTextInput(' ');
                    _this.triggerSpellCheck = false;
                }
                event.preventDefault();
            }
        };
        this.onTextInputInternal = function (event) {
            if (!_this.owner.isReadOnlyMode) {
                _this.owner.editorModule.onTextInputInternal(event);
            }
            else {
                _this.editableDiv.innerText = '';
            }
        };
        /**
         * Fired on paste.
         * @param {ClipboardEvent} event
         * @private
         */
        this.onPaste = function (event) {
            if ((!_this.owner.isReadOnlyMode && _this.owner.editor.canEditContentControl) || _this.selection.isInlineFormFillMode()) {
                _this.owner.editorModule.pasteInternal(event);
            }
            _this.editableDiv.innerText = '';
            event.preventDefault();
        };
        /**
         * Fires when editable div loses focus.
         * @private
         */
        this.onFocusOut = function () {
            if (!isNullOrUndefined(_this.selection)) {
                if (_this.owner.contextMenuModule && _this.owner.contextMenuModule.contextMenuInstance &&
                    _this.owner.contextMenuModule.contextMenuInstance.element.style.display === 'block') {
                    return;
                }
                _this.selection.hideCaret();
            }
        };
        /**
         * Updates focus to editor area.
         * @private
         */
        this.updateFocus = function () {
            if (_this.selection && !(_this.isMobileDevice && _this.owner.isReadOnly)) {
                if (!Browser.isDevice && !Browser.isIE && !navigator.userAgent.match('Edge')) {
                    _this.iframe.focus();
                }
                _this.editableDiv.focus();
                _this.selection.showCaret();
            }
        };
        /**
         * Fires on scrolling.
         */
        this.scrollHandler = function () {
            if (_this.scrollTimer) {
                clearTimeout(_this.scrollTimer);
            }
            _this.clearContent();
            _this.isScrollHandler = true;
            if (!Browser.isDevice && !_this.isComposingIME) {
                _this.iframe.style.top = _this.owner.viewer.containerTop + 'px';
                _this.iframe.style.left = _this.owner.viewer.containerLeft + 'px';
            }
            _this.owner.viewer.updateScrollBars();
            var vtHeight = _this.owner.viewer.containerTop + _this.visibleBounds.height;
            if (vtHeight > _this.pageContainer.offsetHeight) {
                _this.viewerContainer.scrollTop = _this.owner.viewer.containerTop - (vtHeight - _this.pageContainer.offsetHeight);
            }
            if (_this.owner.viewer instanceof PageLayoutViewer && !isNullOrUndefined(_this.owner)) {
                _this.owner.fireViewChange();
            }
            _this.isScrollHandler = false;
            _this.scrollTimer = setTimeout(function () {
                if (!_this.isScrollHandler && !isNullOrUndefined(_this.owner) && _this.owner.isSpellCheck) {
                    _this.isScrollToSpellCheck = true;
                    _this.owner.viewer.updateScrollBars();
                }
            }, 200);
        };
        /**
         * Fires when the window gets resized.
         * @private
         */
        this.onWindowResize = function () {
            if (_this.resizeTimer) {
                clearTimeout(_this.resizeTimer);
            }
            /* tslint:disable:align */
            _this.resizeTimer = setTimeout(function () {
                if (!isNullOrUndefined(_this.owner) && !isNullOrUndefined(_this.owner.element)) {
                    _this.updateViewerSize();
                    _this.clearContent();
                    _this.owner.viewer.updateScrollBars();
                    if (!isNullOrUndefined(_this.selection)) {
                        _this.selection.updateCaretPosition();
                    }
                    _this.updateTouchMarkPosition();
                    if (_this.owner.contextMenuModule && _this.owner.contextMenuModule.contextMenuInstance) {
                        _this.owner.contextMenuModule.contextMenuInstance.close();
                    }
                    if (_this.resizeTimer) {
                        clearTimeout(_this.resizeTimer);
                    }
                }
            }, 200);
        };
        /**
         * @private
         */
        this.onContextMenu = function (event) {
            if (_this.owner.contextMenuModule) {
                if (_this.isMouseDown) {
                    _this.isMouseDown = false;
                }
                _this.owner.contextMenuModule.onContextMenuInternal(event);
            }
        };
        /**
         * Called on mouse down.
         * @param {MouseEvent} event
         * @private
         */
        this.onMouseDownInternal = function (event) {
            var target = event.target;
            if ((!isNullOrUndefined(target) && target !== _this.viewerContainer) || _this.isTouchInput ||
                event.offsetX > (_this.visibleBounds.width - (_this.visibleBounds.width - _this.viewerContainer.clientWidth))
                || event.offsetY > (_this.visibleBounds.height - (_this.visibleBounds.height - _this.viewerContainer.clientHeight))) {
                return;
            }
            _this.isFootnoteWidget = false;
            if (!isNullOrUndefined(_this.selection)) {
                _this.updateCursor(event);
                if (_this.formFillPopup) {
                    _this.formFillPopup.hidePopup();
                }
                // tslint:disable-next-line:max-line-length
                if (_this.isLeftButtonPressed(event) && !_this.owner.isReadOnlyMode && _this.owner.enableImageResizerMode && !isNullOrUndefined(_this.owner.imageResizerModule.selectedResizeElement)) {
                    if (_this.selection.isInShape) {
                        var textFram = _this.owner.selection.getCurrentTextFrame();
                        var shape = textFram.containerShape;
                        _this.selection.selectShape(shape);
                    }
                    _this.owner.imageResizerModule.isImageResizing = true;
                }
                event.preventDefault();
                if (!_this.isTouchInput) {
                    _this.selection.hideCaret();
                }
                var cursorPoint = new Point(event.offsetX, event.offsetY);
                var touchPoint = _this.owner.viewer.findFocusedPage(cursorPoint, true);
                _this.mouseDownOffset.x = touchPoint.x;
                _this.mouseDownOffset.y = touchPoint.y;
                // tslint:disable-next-line:max-line-length
                _this.isMouseDownInFooterRegion = _this.selection.isCursorInsidePageRect(cursorPoint, _this.currentPage) && _this.selection.isCursorInFooterRegion(cursorPoint, _this.currentPage);
                _this.isSelectionChangedOnMouseMoved = false;
                if (!_this.owner.isReadOnlyMode && (_this.owner.editorModule.tableResize.isInCellResizerArea(touchPoint) ||
                    _this.owner.editorModule.tableResize.isInRowResizerArea(touchPoint))) {
                    _this.selection.hideCaret();
                    _this.isMouseDown = true;
                    _this.isSelectionChangedOnMouseMoved = false;
                    if (_this.isLeftButtonPressed(event)) {
                        _this.owner.editorModule.tableResize.startingPoint.x = touchPoint.x;
                        _this.owner.editorModule.tableResize.startingPoint.y = touchPoint.y;
                        _this.owner.editorModule.tableResize.handleResize(touchPoint);
                    }
                    return;
                }
                if (event.ctrlKey) {
                    _this.isControlPressed = true;
                }
                if (_this.owner.selection.isEmpty) {
                    _this.useTouchSelectionMark = false;
                }
                if (event.which === 3 && !_this.owner.selection.isEmpty
                    && _this.selection.checkCursorIsInSelection(_this.getLineWidget(touchPoint), touchPoint)) {
                    event.preventDefault();
                    return;
                }
                _this.isTouchInput = false;
                _this.isMouseDown = true;
                _this.updateFocus();
                /* tslint:disable:align */
                _this.timer = setTimeout(function () {
                    _this.tapCount++;
                    if (_this.tapCount === 4) {
                        _this.tapCount = 1;
                    }
                }, 200);
            }
        };
        /**
         * Called on mouse move.
         * @param {MouseEvent} event
         * @private
         */
        this.onMouseMoveInternal = function (event) {
            if (!isNullOrUndefined(event.target) && event.target !== _this.viewerContainer) {
                return;
            }
            event.preventDefault();
            if (!isNullOrUndefined(_this.selection)) {
                //For image Resizing
                if (!_this.owner.isReadOnlyMode && _this.owner.enableImageResizerMode
                    && _this.owner.imageResizerModule.isImageResizing) {
                    if (!_this.owner.imageResizerModule.isImageMoveToNextPage) {
                        _this.owner.imageResizerModule.handleImageResizingOnMouse(event);
                    }
                    return;
                }
                var cursorPoint = new Point(event.offsetX, event.offsetY);
                var touchPoint = _this.owner.viewer.findFocusedPage(cursorPoint, !_this.owner.enableHeaderAndFooter);
                if (_this.isMouseDown) {
                    if (!isNullOrUndefined(_this.currentPage)) {
                        var xPosition = touchPoint.x;
                        var yPosition = touchPoint.y;
                        if (!_this.owner.isReadOnlyMode && _this.isRowOrCellResizing) {
                            var table = _this.owner.editorModule.tableResize.currentResizingTable;
                            var startPosition = _this.selection.setPositionForBlock(table, true);
                            var endPosition = _this.selection.setPositionForBlock(table, false);
                            // tslint:disable-next-line:max-line-length
                            if (!(_this.owner.documentHelper.isDocumentProtected) || _this.selection.checkSelectionIsAtEditRegion(startPosition, endPosition)) {
                                _this.owner.editorModule.tableResize.handleResizing(touchPoint);
                            }
                        }
                        else {
                            if (!(_this.isTouchInput || _this.isSelectionChangedOnMouseMoved || _this.touchDownOnSelectionMark > 0)) {
                                _this.updateTextPositionForSelection(touchPoint, 1);
                            }
                            if (_this.isLeftButtonPressed(event)) {
                                event.preventDefault();
                                var touchY = yPosition;
                                var textPosition = _this.owner.selection.end;
                                var touchPoint_1 = new Point(xPosition, touchY);
                                if (!_this.owner.enableImageResizerMode || !_this.owner.imageResizerModule.isImageResizerVisible
                                    || _this.owner.imageResizerModule.isShapeResize) {
                                    _this.owner.selection.moveTextPosition(touchPoint_1, textPosition);
                                }
                                _this.isSelectionChangedOnMouseMoved = true;
                            }
                        }
                    }
                    _this.selection.checkForCursorVisibility();
                }
                if (!_this.isRowOrCellResizing && !_this.isSelectionChangedOnMouseMoved) {
                    _this.updateCursor(event);
                }
                if (_this.isRowOrCellResizing) {
                    _this.selection.hideCaret();
                }
            }
        };
        /**
         * @private
         */
        this.onMouseLeaveInternal = function (event) {
            event.preventDefault();
            if (_this.isMouseDown) {
                var viewerTop = _this.viewerContainer.scrollTop;
                if (event.offsetY + viewerTop > viewerTop) {
                    _this.scrollMoveTimer = setInterval(function () { _this.scrollForwardOnSelection(); }, 500);
                }
                else {
                    _this.scrollMoveTimer = setInterval(function () { _this.scrollBackwardOnSelection(); }, 500);
                }
                if (_this.isMouseEntered) {
                    _this.isMouseEntered = false;
                }
            }
        };
        /**
         * @private
         */
        this.onMouseEnterInternal = function () {
            if (!_this.isMouseEntered) {
                _this.owner.viewer.updateScrollBars();
            }
            _this.isMouseEntered = true;
            if (_this.scrollMoveTimer) {
                clearInterval(_this.scrollMoveTimer);
            }
        };
        /**
         * Fired on double tap.
         * @param {MouseEvent} event
         * @private
         */
        this.onDoubleTap = function (event) {
            if (!isNullOrUndefined(event.target) && event.target !== _this.viewerContainer) {
                return;
            }
            if (!isNullOrUndefined(_this.selection)) {
                _this.isTouchInput = false;
                var cursorPoint = new Point(event.offsetX, event.offsetY);
                var touchPoint = _this.owner.viewer.findFocusedPage(cursorPoint, true);
                if (_this.selection.checkAndEnableHeaderFooter(cursorPoint, _this.owner.viewer.findFocusedPage(cursorPoint, true))) {
                    return;
                }
                var widget = _this.getLineWidget(touchPoint);
                var formField = _this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint, true);
                if (isNullOrUndefined(formField)) {
                    formField = _this.selection.getCurrentFormField();
                }
                if (!_this.isDocumentProtected && _this.owner.enableFormField) {
                    var formatType = _this.selection.getFormFieldType(formField);
                    if (formatType) {
                        if (formatType.toString() !== '') {
                            _this.selection.selectField(formField);
                        }
                        switch (formatType) {
                            case 'Text':
                                _this.owner.textFormFieldDialogModule.show();
                                break;
                            case 'CheckBox':
                                _this.owner.checkBoxFormFieldDialogModule.show();
                                break;
                            case 'DropDown':
                                _this.owner.dropDownFormFieldDialogModule.show();
                                break;
                        }
                    }
                }
                else if (_this.isDocumentProtected && formField && formField.formFieldData instanceof TextFormField
                    && formField.formFieldData.type === 'Text') {
                    _this.selection.selectField();
                }
                else {
                    _this.tapCount = 2;
                    return;
                }
                var startPosition = _this.selection.start.clone();
                var endPosition = _this.selection.end.clone();
                var inlineObj = startPosition.currentWidget.getInline(startPosition.offset, 0);
                var inline = inlineObj.element;
                if (inline instanceof FootnoteElementBox) {
                    if (inline.footnoteType === 'Footnote') {
                        var footnotes = _this.currentPage.footnoteWidget;
                        var i = void 0;
                        for (i = 1; i <= footnotes.childWidgets.length; i++) {
                            var footnoteText = footnotes.childWidgets[i].footNoteReference;
                            if (inline.text === footnoteText.text) {
                                break;
                            }
                        }
                        startPosition.setPositionParagraph(footnotes.childWidgets[i].childWidgets[0], 0);
                        endPosition.setPositionParagraph(footnotes.childWidgets[i].childWidgets[0], 0);
                        _this.selection.selectRange(startPosition, endPosition);
                    }
                    else {
                        var endnotes = _this.pages[_this.pages.length - 1].endnoteWidget;
                        var i = void 0;
                        if (!isNullOrUndefined(endnotes)) {
                            for (i = 1; i <= endnotes.childWidgets.length; i++) {
                                var endnoteText = endnotes.childWidgets[i].footNoteReference;
                                if (inline.text === endnoteText.text) {
                                    break;
                                }
                            }
                        }
                        startPosition.setPositionParagraph(endnotes.childWidgets[i].childWidgets[0], 0);
                        endPosition.setPositionParagraph(endnotes.childWidgets[i].childWidgets[0], 0);
                        _this.selection.selectRange(startPosition, endPosition);
                    }
                }
                else {
                    if (inline instanceof TextElementBox && (_this.selection.isinEndnote || _this.selection.isinFootnote)) {
                        _this.selection.footnoteReferenceElement(startPosition, endPosition, inline);
                    }
                }
                // tslint:disable-next-line:max-line-length
                if (_this.selection.isEmpty && !isNullOrUndefined(_this.currentPage) && !isNullOrUndefined(_this.owner.selection.start)) {
                    _this.owner.selection.selectCurrentWord();
                    _this.selection.checkForCursorVisibility();
                    _this.tapCount = 2;
                }
            }
        };
        /**
         * Called on mouse up.
         * @param {MouseEvent} event
         * @private
         */
        // tslint:disable:max-func-body-length
        this.onMouseUpInternal = function (event) {
            if (!isNullOrUndefined(event.target) && event.target !== _this.viewerContainer) {
                return;
            }
            event.preventDefault();
            _this.isListTextSelected = false;
            var cursorPoint = new Point(event.offsetX, event.offsetY);
            var touchPoint = _this.owner.viewer.findFocusedPage(cursorPoint, true);
            if (!isNullOrUndefined(_this.selection)) {
                var tapCount = 1;
                if (!Browser.isIE) {
                    if (event.detail > 2) {
                        tapCount = event.detail;
                    }
                }
                else {
                    tapCount = _this.tapCount;
                }
                if (_this.isRowOrCellResizing) {
                    _this.owner.editorModule.tableResize.updateResizingHistory(touchPoint);
                }
                if (_this.isMouseDown && !_this.isSelectionChangedOnMouseMoved
                    && !isNullOrUndefined(_this.currentPage) && !isNullOrUndefined(_this.owner.selection.start)
                    && (!_this.owner.enableImageResizerMode || !_this.owner.imageResizerModule.isImageResizing)) {
                    if (_this.touchDownOnSelectionMark === 0 && !_this.isRowOrCellResizing) {
                        _this.updateTextPositionForSelection(touchPoint, tapCount);
                        if (Browser.isIE && tapCount === 2) {
                            _this.selection.checkAndEnableHeaderFooter(cursorPoint, touchPoint);
                        }
                    }
                    _this.selection.checkForCursorVisibility();
                    if (!isNullOrUndefined(_this.currentSelectedComment) && _this.owner.commentReviewPane
                        && !_this.owner.commentReviewPane.commentPane.isEditMode) {
                        _this.currentSelectedComment = undefined;
                    }
                }
                var isCtrlkeyPressed = _this.isIosDevice ? event.metaKey : event.ctrlKey;
                if (!isNullOrUndefined(_this.currentPage) && !isNullOrUndefined(_this.owner.selection.start)
                    && (_this.owner.selection.isEmpty || _this.owner.selection.isImageSelected) &&
                    (((isCtrlkeyPressed && _this.owner.useCtrlClickToFollowHyperlink ||
                        !_this.owner.useCtrlClickToFollowHyperlink) && _this.isLeftButtonPressed(event) === true))) {
                    _this.selection.navigateHyperLinkOnEvent(touchPoint, false);
                }
                if (_this.isMouseDown && _this.isLeftButtonPressed(event) && _this.isDocumentProtected
                    && _this.protectionType === 'FormFieldsOnly' && _this.selection) {
                    var widget = _this.getLineWidget(touchPoint);
                    var formField = _this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint, true);
                    if (isNullOrUndefined(formField)) {
                        formField = _this.selection.getCurrentFormField(true);
                    }
                    // tslint:disable-next-line:max-line-length
                    if (formField && formField.formFieldData && formField.formFieldData.enabled && !_this.selection.isInlineFormFillMode(formField)) {
                        var data = { 'fieldName': formField.formFieldData.name };
                        if (formField.formFieldData instanceof TextFormField) {
                            data.value = formField.resultText;
                        }
                        else if (formField.formFieldData instanceof CheckBoxFormField) {
                            data.value = formField.formFieldData.checked;
                        }
                        else {
                            data.value = formField.formFieldData.selectedIndex;
                        }
                        _this.owner.trigger('beforeFormFieldFill', data);
                        // tslint:disable-next-line:max-line-length
                        if (_this.owner.documentEditorSettings.formFieldSettings.formFillingMode === 'Popup' && !(formField.formFieldData instanceof CheckBoxFormField)
                            || (formField.formFieldData instanceof TextFormField && !(formField.formFieldData.type === 'Text'))
                            || formField.formFieldData instanceof DropDownFormField) {
                            _this.formFillPopup.showPopUp(formField, touchPoint);
                        }
                        else {
                            _this.owner.editor.toggleCheckBoxFormField(formField);
                            data.value = formField.formFieldData.checked;
                            data.isCanceled = false;
                            _this.owner.trigger('afterFormFieldFill', data);
                        }
                    }
                    if (!formField && _this.isFormFillProtectedMode) {
                        _this.selection.navigateToNextFormField();
                    }
                }
                else if (_this.isMouseDown) {
                    if (_this.formFields.length > 0) {
                        var formField = _this.selection.getCurrentFormField(true);
                        if (formField && formField.formFieldData instanceof TextFormField) {
                            _this.selection.selectField();
                            // tslint:disable-next-line:max-line-length
                        }
                        else if (_this.isLeftButtonPressed(event) && formField && formField.formFieldData instanceof DropDownFormField) {
                            var offset = formField.line.getOffset(formField, 0);
                            var point = _this.selection.getPhysicalPositionInternal(formField.line, offset, false);
                            _this.selection.selectInternal(formField.line, formField, 0, point);
                        }
                    }
                }
                if (!_this.owner.isReadOnlyMode && _this.isSelectionInListText(touchPoint)) {
                    _this.selection.selectListText();
                }
                // tslint:disable-next-line:max-line-length
                if (!_this.owner.isReadOnlyMode && _this.owner.enableImageResizerMode && _this.owner.imageResizerModule.isImageResizing) {
                    _this.owner.imageResizerModule.mouseUpInternal();
                    _this.scrollToPosition(_this.owner.selection.start, _this.owner.selection.end);
                    _this.owner.imageResizerModule.isImageResizing = false;
                }
                // tslint:disable-next-line:max-line-length
                if (_this.owner.enableImageResizerMode && _this.owner.imageResizerModule.isImageResizerVisible && !isNullOrUndefined(_this.selection.caret)) {
                    _this.selection.caret.style.display = 'none';
                }
                _this.isMouseDown = false;
                _this.isFootnoteWidget = false;
                _this.isSelectionChangedOnMouseMoved = false;
                _this.isTouchInput = false;
                _this.useTouchSelectionMark = true;
                _this.isControlPressed = false;
                _this.updateFocus();
                if (_this.isListTextSelected) {
                    _this.selection.hideCaret();
                }
                if (_this.owner.enableImageResizerMode) {
                    var imageResizer = _this.owner.imageResizerModule;
                    imageResizer.isImageResizing = false;
                    imageResizer.isImageMoveToNextPage = false;
                    imageResizer.leftValue = undefined;
                    imageResizer.topValue = undefined;
                }
                _this.isMouseDownInFooterRegion = false;
            }
        };
        /**
         * Fired on touch start.
         * @param {TouchEvent} event
         * @private
         */
        this.onTouchStartInternal = function (event) {
            if (_this.selection) {
                _this.isTouchMoved = false;
                _this.isCompositionStart = false;
                _this.isCompositionEnd = false;
                _this.isCompositionUpdated = false;
                _this.isCompositionCanceled = true;
                _this.isTouchInput = true;
                if (_this.isTimerStarted) {
                    if (_this.tapCount === 1) {
                        _this.tapCount = 2;
                    }
                    else {
                        _this.tapCount = 3;
                        _this.isTimerStarted = false;
                    }
                }
                else {
                    _this.isTimerStarted = true;
                    _this.tapCount = 1;
                }
                if (event.touches.length === 1) {
                    _this.zoomX = event.touches[0].clientX;
                    _this.zoomY = event.touches[0].clientY;
                    if (_this.owner.selection.isEmpty) {
                        _this.useTouchSelectionMark = false;
                    }
                    _this.isMouseDown = true;
                    _this.isSelectionChangedOnMouseMoved = false;
                    var point = void 0;
                    if (_this.isMouseDown) {
                        point = _this.getTouchOffsetValue(event);
                    }
                    point = _this.owner.viewer.findFocusedPage(point, true);
                    if (_this.owner.enableImageResizerMode) {
                        var resizeObj = _this.owner.imageResizerModule.getImagePointOnTouch(point);
                        _this.owner.imageResizerModule.selectedResizeElement = resizeObj.selectedElement;
                    }
                    // tslint:disable-next-line:max-line-length
                    if (_this.owner.enableImageResizerMode && !isNullOrUndefined(_this.owner.imageResizerModule.selectedResizeElement)) {
                        _this.owner.imageResizerModule.isImageResizing = true;
                    }
                    var x = _this.owner.selection.end.location.x;
                    var y = _this.selection.getCaretBottom(_this.owner.selection.end, _this.owner.selection.isEmpty) + 9;
                    //TouchDownOnSelectionMark will be 2 when touch end is pressed
                    _this.touchDownOnSelectionMark = ((point.y <= y && point.y >= y - 20 || point.y >= y && point.y <= y + 20)
                        && (point.x <= x && point.x >= x - 20 || point.x >= x && point.x <= x + 20)) ? 1 : 0;
                    if (!_this.owner.selection.isEmpty && _this.touchDownOnSelectionMark === 0) {
                        x = _this.owner.selection.start.location.x;
                        y = _this.selection.getCaretBottom(_this.owner.selection.start, false) + 9;
                        //TouchDownOnSelectionMark will be 1 when touch start is pressed
                        _this.touchDownOnSelectionMark = ((point.y <= y && point.y >= y - 20 || point.y >= y && point.y <= y + 20)
                            && (point.x <= x && point.x >= x - 20 || point.x >= x && point.x <= x + 20)) ? 2 : 0;
                    }
                }
                if (!isNullOrUndefined(_this.owner.contextMenuModule) && _this.owner.contextMenuModule.contextMenuInstance) {
                    _this.owner.contextMenuModule.contextMenuInstance.close();
                }
                if (_this.touchDownOnSelectionMark || event.touches.length > 1) {
                    event.preventDefault();
                }
                _this.longTouchTimer = setTimeout(_this.onLongTouch, 500, event);
                _this.timer = setTimeout(function () {
                    _this.isTimerStarted = false;
                }, 200);
            }
        };
        /**
         * Fired on long touch
         * @param {TouchEvent} event
         * @private
         */
        this.onLongTouch = function (event) {
            if (isNullOrUndefined(_this.owner) || isNullOrUndefined(_this.viewerContainer) || _this.isTouchMoved || event.touches.length !== 1) {
                return;
            }
            var point = _this.getTouchOffsetValue(event);
            var pointRelToPage = _this.owner.viewer.findFocusedPage(point, true);
            var selStart = _this.selection.start;
            var selEnd = _this.selection.end;
            var updateSel = false;
            if (!_this.selection.isForward) {
                selStart = _this.selection.end;
                selEnd = _this.selection.start;
            }
            var selStartPt = selStart.location;
            var selEndPt = selEnd.location;
            if (selStart.currentWidget !== selEnd.currentWidget) {
                updateSel = !(pointRelToPage.x >= selStartPt.x && pointRelToPage.x <= selEndPt.x)
                    && !(pointRelToPage.y >= selStartPt.y && pointRelToPage.y <= selEndPt.y);
            }
            else {
                updateSel = !(pointRelToPage.x >= selStartPt.x && pointRelToPage.x <= selEndPt.x)
                    || !(pointRelToPage.y >= selStartPt.y && pointRelToPage.y <= selEndPt.y);
            }
            if (event.changedTouches.length === 1 && updateSel) {
                _this.updateSelectionOnTouch(point, pointRelToPage);
                _this.isMouseDown = false;
                _this.touchDownOnSelectionMark = 0;
                _this.useTouchSelectionMark = true;
                _this.isSelectionChangedOnMouseMoved = false;
            }
            if (_this.selection.isEmpty) {
                _this.selection.selectCurrentWord();
            }
            if (!isNullOrUndefined(_this.owner.contextMenuModule) && _this.owner.contextMenuModule.contextMenuInstance) {
                _this.owner.contextMenuModule.onContextMenuInternal(event);
            }
        };
        /**
         * Fired on touch move.
         * @param {TouchEvent} event
         * @private
         */
        this.onTouchMoveInternal = function (event) {
            _this.isTouchMoved = true;
            var touch = event.touches;
            var cursorPoint;
            if (!isNullOrUndefined(_this.selection)) {
                // tslint:disable-next-line:max-line-length
                if (_this.owner.editorModule && _this.owner.enableImageResizerMode && _this.owner.imageResizerModule.isImageResizing) {
                    event.preventDefault();
                    if (!_this.owner.imageResizerModule.isImageMoveToNextPage) {
                        _this.owner.imageResizerModule.handleImageResizingOnTouch(event);
                        _this.selection.caret.style.display = 'none';
                    }
                    return;
                }
                if (_this.isMouseDown) {
                    cursorPoint = _this.getTouchOffsetValue(event);
                    var touchPoint = _this.owner.viewer.findFocusedPage(cursorPoint, true);
                    if (_this.touchDownOnSelectionMark > 0 /*|| !this.useTouchSelectionMark*/) {
                        event.preventDefault();
                        var touchY = touchPoint.y;
                        var textPosition = _this.owner.selection.end;
                        var touchPointer = void 0;
                        if (touchPoint.y <= 26) {
                            touchY -= touchPoint.y < 0 ? 0 : touchPoint.y + 0.5;
                        }
                        else {
                            touchY -= 36.5;
                        }
                        textPosition = _this.touchDownOnSelectionMark === 2 ? _this.selection.start : _this.selection.end;
                        touchPoint = new Point(touchPoint.x, touchY);
                        _this.owner.selection.moveTextPosition(touchPoint, textPosition);
                        _this.isSelectionChangedOnMouseMoved = true;
                    }
                    _this.selection.checkForCursorVisibility();
                    _this.updateTouchMarkPosition();
                }
            }
            if (touch.length > 1) {
                event.preventDefault();
                _this.isMouseDown = false;
                _this.zoomX = (touch[0].clientX + touch[1].clientX) / 2;
                _this.zoomY = (touch[0].clientY + touch[1].clientY) / 2;
                // tslint:disable-next-line:max-line-length
                var currentDiff = Math.sqrt(Math.pow((touch[0].clientX - touch[1].clientX), 2) + Math.pow((touch[0].clientY - touch[1].clientY), 2));
                if (_this.preDifference > -1) {
                    if (currentDiff > _this.preDifference) {
                        _this.onPinchOutInternal(event);
                    }
                    else if (currentDiff < _this.preDifference) {
                        _this.onPinchInInternal(event);
                    }
                }
                else if (_this.zoomFactor < 2) {
                    if (_this.preDifference !== -1) {
                        if (currentDiff > _this.preDifference) {
                            _this.onPinchInInternal(event);
                        }
                    }
                }
                else if (_this.preDifference === -1) {
                    if (_this.zoomFactor > 2) {
                        if (currentDiff > _this.preDifference) {
                            _this.onPinchInInternal(event);
                        }
                    }
                }
                _this.preDifference = currentDiff;
            }
            if (_this.longTouchTimer) {
                clearTimeout(_this.longTouchTimer);
                _this.longTouchTimer = undefined;
            }
        };
        /**
         * Fired on touch up.
         * @param {TouchEvent} event
         * @private
         */
        this.onTouchUpInternal = function (event) {
            if (!isNullOrUndefined(_this.selection)) {
                var point = _this.getTouchOffsetValue(event);
                var touchPoint = _this.owner.viewer.findFocusedPage(point, true);
                if (event.changedTouches.length === 1) {
                    if (!_this.isTouchMoved || (_this.owner.enableImageResizerMode && _this.owner.imageResizerModule.isImageResizing)) {
                        _this.updateSelectionOnTouch(point, touchPoint);
                        if (!isNullOrUndefined(_this.currentPage) && !isNullOrUndefined(_this.selection.start)
                            && !_this.isSelectionChangedOnMouseMoved && (_this.selection.isEmpty ||
                            _this.selection.isImageField() && (!_this.owner.enableImageResizerMode ||
                                _this.owner.enableImageResizerMode && !_this.owner.imageResizerModule.isImageResizing))) {
                            _this.selection.navigateHyperLinkOnEvent(touchPoint, true);
                        }
                    }
                    _this.isMouseDown = false;
                    _this.touchDownOnSelectionMark = 0;
                    _this.useTouchSelectionMark = true;
                    _this.isSelectionChangedOnMouseMoved = false;
                }
                if (_this.owner.enableImageResizerMode && _this.owner.imageResizerModule.isImageResizing) {
                    _this.owner.imageResizerModule.mouseUpInternal();
                    _this.owner.imageResizerModule.isImageResizing = false;
                    _this.owner.imageResizerModule.isImageMoveToNextPage = false;
                    _this.scrollToPosition(_this.owner.selection.start, _this.owner.selection.end);
                }
                // tslint:disable-next-line:max-line-length
                if (_this.owner.enableImageResizerMode && _this.owner.imageResizerModule.isImageResizerVisible && _this.isTouchInput) {
                    _this.touchStart.style.display = 'none';
                    _this.touchEnd.style.display = 'none';
                }
                // if (!this.owner.isReadOnlyMode && this.isSelectionInListText(touchPoint)) {
                //     this.selection.selectListText();
                // }
                event.preventDefault();
            }
            _this.preDifference = -1;
            _this.isTouchInput = false;
            if (_this.longTouchTimer) {
                clearTimeout(_this.longTouchTimer);
                _this.longTouchTimer = undefined;
            }
            if (!_this.isTimerStarted) {
                _this.tapCount = 1;
            }
            if (_this.isListTextSelected) {
                _this.selection.hideCaret();
            }
        };
        /**
         * Fired on keyup event.
         * @private
         */
        this.onKeyUpInternal = function (event) {
            if (Browser.isDevice && event.target === _this.editableDiv) {
                if (window.getSelection().anchorOffset !== _this.prefix.length) {
                    _this.selection.setEditableDivCaretPosition(_this.editableDiv.innerText.length);
                }
            }
            if (event.ctrlKey || (event.keyCode === 17 || event.which === 17)) {
                _this.isControlPressed = false;
            }
        };
        /**
         * Fired on keydown.
         * @private
         */
        this.onKeyDownInternal = function (event) {
            if (!isNullOrUndefined(event.target) && event.target !== _this.editableDiv) {
                return;
            }
            var isHandled = false;
            var keyEventArgs = { 'event': event, 'isHandled': false, source: _this.owner };
            _this.owner.trigger('keyDown', keyEventArgs);
            if (keyEventArgs.isHandled) {
                return;
            }
            var key = event.which || event.keyCode;
            var ctrl = (event.ctrlKey || event.metaKey) ? true : ((key === 17) ? true : false); // ctrl detection       
            var shift = event.shiftKey ? event.shiftKey : ((key === 16) ? true : false); // Shift Key detection        
            var alt = event.altKey ? event.altKey : ((key === 18) ? true : false); // alt key detection
            if (ctrl && !shift && !alt) {
                switch (key) {
                    case 80:
                        event.preventDefault();
                        _this.owner.print();
                        isHandled = true;
                        break;
                    case 83:
                        event.preventDefault();
                        _this.owner.save(_this.owner.documentName === '' ? 'sample' : _this.owner.documentName, 'Sfdt');
                        isHandled = true;
                        break;
                }
            }
            if (!isHandled && !isNullOrUndefined(_this.selection)) {
                _this.selection.onKeyDownInternal(event, ctrl, shift, alt);
            }
            if (isHandled) {
                event.preventDefault();
            }
        };
        this.owner = owner;
        this.pages = [];
        this.lists = [];
        this.abstractLists = [];
        this.render = new Renderer(this);
        this.characterFormat = new WCharacterFormat(this);
        this.paragraphFormat = new WParagraphFormat(this);
        this.renderedLists = new Dictionary();
        this.renderedLevelOverrides = [];
        this.headersFooters = [];
        this.styles = new WStyles();
        this.preDefinedStyles = new Dictionary();
        this.initalizeStyles();
        this.bookmarks = new Dictionary();
        this.editRanges = new Dictionary();
        this.isIosDevice = /Mac|iPad|iPod/i.test(navigator.userAgent);
        this.isMobileDevice = /Android|Windows Phone|webOS/i.test(navigator.userAgent);
        this.formFillPopup = new FormFieldPopUp(this.owner);
        this.customXmlData = new Dictionary();
        this.contentControlCollection = [];
        this.footnoteCollection = [];
        this.endnoteCollection = [];
    }
    Object.defineProperty(DocumentHelper.prototype, "visibleBounds", {
        /**
         * Gets visible bounds.
         * @private
         */
        get: function () {
            return this.visibleBoundsIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "containerCanvas", {
        //Document Protection Properties Ends
        //#region Properties
        /**
         * Gets container canvas.
         * @private
         */
        get: function () {
            if (isNullOrUndefined(this.containerCanvasIn)) {
                this.containerCanvasIn = document.createElement('canvas');
                this.containerCanvasIn.getContext('2d').save();
            }
            if (!isNullOrUndefined(this.pageContainer)
                && this.containerCanvasIn.parentElement !== this.pageContainer) {
                this.pageContainer.appendChild(this.containerCanvasIn);
            }
            return this.containerCanvasIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "selectionCanvas", {
        /**
         * Gets selection canvas.
         * @private
         */
        get: function () {
            if (isNullOrUndefined(this.selectionCanvasIn)) {
                this.selectionCanvasIn = document.createElement('canvas');
                this.selectionCanvas.getContext('2d').save();
            }
            if (!isNullOrUndefined(this.pageContainer)
                && this.selectionCanvasIn.parentElement !== this.pageContainer) {
                this.pageContainer.appendChild(this.selectionCanvasIn);
            }
            return this.selectionCanvasIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "containerContext", {
        /**
         * Gets container context.
         * @private
         */
        get: function () {
            return this.containerCanvas.getContext('2d');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "selectionContext", {
        /**
         * Gets selection context.
         * @private
         */
        get: function () {
            return this.selectionCanvas.getContext('2d');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "currentRenderingPage", {
        /**
         * Gets the current rendering page.
         */
        get: function () {
            if (this.pages.length === 0) {
                return undefined;
            }
            return this.pages[this.pages.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "zoomFactor", {
        /**
         * Gets or sets zoom factor.
         * @private
         */
        get: function () {
            return this.zoomFactorInternal;
        },
        set: function (value) {
            if (this.zoomFactorInternal !== value) {
                this.preZoomFactor = this.zoomFactor;
                this.zoomFactorInternal = value;
                this.zoomModule.setZoomFactor(value);
                this.owner.zoomFactor = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "selection", {
        /**
         * Gets the selection.
         * @private
         */
        get: function () {
            return this.owner.selection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "selectionStartPage", {
        /**
         * Gets or sets selection start page.
         * @private
         */
        get: function () {
            return this.selectionStartPageIn;
        },
        set: function (value) {
            this.selectionStartPageIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "selectionEndPage", {
        /**
         * Gets or sets selection end page.
         * @private
         */
        get: function () {
            return this.selectionEndPageIn;
        },
        set: function (value) {
            this.selectionEndPageIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "dialog", {
        /**
         * Gets the initialized default dialog.
         * @private
         */
        get: function () {
            if (!this.dialogInternal) {
                this.initDialog(this.owner.enableRtl);
            }
            return this.dialogInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "dialog2", {
        /**
         * Gets the initialized default dialog.
         * @private
         */
        get: function () {
            if (!this.dialogInternal2) {
                this.initDialog2(this.owner.enableRtl);
            }
            return this.dialogInternal2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "dialog3", {
        /**
         * Gets the initialized default dialog.
         * @private
         */
        get: function () {
            if (!this.dialogInternal3) {
                this.initDialog3(this.owner.enableRtl);
            }
            return this.dialogInternal3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "currentSelectedComment", {
        /**
         * @private
         */
        get: function () {
            return this.currentSelectedCommentInternal;
        },
        /**
         * @private
         */
        set: function (value) {
            if (this.owner && this.owner.commentReviewPane) {
                this.owner.commentReviewPane.previousSelectedComment = this.currentSelectedCommentInternal;
            }
            this.currentSelectedCommentInternal = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "currentSelectedRevision", {
        /**
         * @private
         */
        get: function () {
            return this.currentSelectedRevisionInternal;
        },
        /**
         * @private
         */
        set: function (value) {
            // if (this.owner && this.owner.commentReviewPane) {
            //     this.owner.commentReviewPane.previousSelectedComment = this.currentSelectedCommentInternal;
            // }
            this.currentSelectedRevisionInternal = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "isInlineFormFillProtectedMode", {
        /**
         * @private
         */
        get: function () {
            return this.isFormFillProtectedMode && this.owner.documentEditorSettings.formFieldSettings.formFillingMode === 'Inline';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentHelper.prototype, "isFormFillProtectedMode", {
        /**
         * @private
         */
        get: function () {
            return this.isDocumentProtected && this.protectionType === 'FormFieldsOnly';
        },
        enumerable: true,
        configurable: true
    });
    DocumentHelper.prototype.initalizeStyles = function () {
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Normal', '{"type":"Paragraph","name":"Normal","next":"Normal"}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 1', '{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","link":"Heading 1 Char","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":12.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level1"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 2', '{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","link":"Heading 2 Char","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level2"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 3', '{"type":"Paragraph","name":"Heading 3","basedOn":"Normal","next":"Normal","link":"Heading 3 Char","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level3"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 4', '{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","next":"Normal","link":"Heading 4 Char","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level4"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 5', '{"type":"Paragraph","name":"Heading 5","basedOn":"Normal","next":"Normal","link":"Heading 5 Char","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level5"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 6', '{"type":"Paragraph","name":"Heading 6","basedOn":"Normal","next":"Normal","link":"Heading 6 Char","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level6"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Default Paragraph Font', '{"type":"Character","name":"Default Paragraph Font"}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 1 Char', '{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 2 Char', '{"type":"Character","name":"Heading 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 3 Char', '{"type":"Character","name":"Heading 3 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri Light","fontColor": "#1F3763"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 4 Char', '{"type":"Character","name":"Heading 4 Char","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 5 Char', '{"type":"Character","name":"Heading 5 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 6 Char', '{"type":"Character","name":"Heading 6 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Hyperlink', '{"type":"Character","name":"Hyperlink","basedOn":"Default Paragraph Font","next":"Normal","characterFormat":{"fontColor":"#0563C1","underline": "Single"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc1', '{"type":"Paragraph","name":"Toc1","basedOn":"Normal","next":"Normal","paragraphFormat":{"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc2', '{"type":"Paragraph","name":"Toc2","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :11.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc3', '{"type":"Paragraph","name":"Toc3","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :22.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc4', '{"type":"Paragraph","name":"Toc4","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :33.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc5', '{"type":"Paragraph","name":"Toc5","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :44.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc6', '{"type":"Paragraph","name":"Toc6","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :55.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc7', '{"type":"Paragraph","name":"Toc7","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :66.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc8', '{"type":"Paragraph","name":"Toc8","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :77.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc9', '{"type":"Paragraph","name":"Toc9","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :88.0,"afterSpacing":5.0}}');
    };
    /**
     * @private
     */
    DocumentHelper.prototype.clearDocumentItems = function () {
        this.editRanges.clear();
        this.headersFooters = [];
        this.fields = [];
        this.formFields = [];
        this.currentSelectedComment = undefined;
        this.currentSelectedRevision = undefined;
        for (var i = 0; i < this.comments.length; i++) {
            var commentStart = this.comments[i].commentStart;
            if (commentStart) {
                commentStart.destroy();
            }
        }
        this.comments = [];
        this.bookmarks.clear();
        this.styles.clear();
        this.authors.clear();
        this.revisionsInternal.clear();
        this.owner.revisions.destroy();
        this.characterFormat.clearFormat();
        this.paragraphFormat.clearFormat();
        if (this.owner.trackChangesPane) {
            this.owner.trackChangesPane.clear();
        }
        this.setDefaultCharacterValue(this.characterFormat);
        this.setDefaultParagraphValue(this.paragraphFormat);
        if (this.owner.commentReviewPane) {
            this.owner.commentReviewPane.clear();
        }
        this.isHeaderFooter = false;
        this.defaultTabWidth = 36;
        this.isDocumentProtected = false;
        this.protectionType = 'NoProtection';
        this.restrictFormatting = false;
        this.hashValue = '';
        this.saltValue = '';
        this.userCollection = [];
        if (this.formFillPopup) {
            this.formFillPopup.hidePopup();
        }
        this.customXmlData.clear();
        this.contentControlCollection = [];
        this.endnotes.clear();
        this.footnotes.clear();
        this.footnoteCollection = [];
        this.endnoteCollection = [];
    };
    /**
     * @private
     */
    DocumentHelper.prototype.setDefaultDocumentFormat = function () {
        this.owner.parser.parseCharacterFormat(this.owner.characterFormat, this.characterFormat);
        this.owner.parser.parseParagraphFormat(this.owner.paragraphFormat, this.paragraphFormat);
    };
    DocumentHelper.prototype.setDefaultCharacterValue = function (characterFormat) {
        characterFormat.bold = false;
        characterFormat.italic = false;
        characterFormat.fontFamily = 'Calibri';
        characterFormat.fontSize = 11;
        characterFormat.underline = 'None';
        characterFormat.strikethrough = 'None';
        characterFormat.fontSizeBidi = 11;
        characterFormat.fontFamilyBidi = 'Calibri';
        characterFormat.baselineAlignment = 'Normal';
        characterFormat.highlightColor = 'NoColor';
        characterFormat.fontColor = 'empty';
        characterFormat.allCaps = false;
    };
    DocumentHelper.prototype.setDefaultParagraphValue = function (paragraphFormat) {
        paragraphFormat.leftIndent = 0;
        paragraphFormat.rightIndent = 0;
        paragraphFormat.firstLineIndent = 0;
        paragraphFormat.textAlignment = 'Left';
        paragraphFormat.beforeSpacing = 0;
        paragraphFormat.afterSpacing = 0;
        paragraphFormat.lineSpacing = 1;
        paragraphFormat.lineSpacingType = 'Multiple';
        paragraphFormat.bidi = false;
    };
    /**
     * @private
     */
    DocumentHelper.prototype.getAbstractListById = function (id) {
        if (isNullOrUndefined(this.abstractLists)) {
            return undefined;
        }
        for (var i = 0; i < this.abstractLists.length; i++) {
            var abstractList = this.abstractLists[i];
            if (abstractList instanceof WAbstractList && abstractList.abstractListId === id) {
                return abstractList;
            }
        }
        return undefined;
    };
    /**
     * @private
     */
    DocumentHelper.prototype.getListById = function (id) {
        if (isNullOrUndefined(this.lists)) {
            return undefined;
        }
        for (var i = 0; i < this.lists.length; i++) {
            if (!isNullOrUndefined(this.lists[i]) && this.lists[i].listId === id) {
                return this.lists[i];
            }
        }
        return undefined;
    };
    /**
     * @private
     */
    DocumentHelper.getListLevelNumber = function (listLevel) {
        if (listLevel.ownerBase instanceof WLevelOverride) {
            return listLevel.ownerBase.levelNumber;
        }
        else if (listLevel.ownerBase instanceof WAbstractList && !isNullOrUndefined(listLevel.ownerBase.levels)) {
            return listLevel.ownerBase.levels.indexOf(listLevel);
        }
        else {
            return -1;
        }
    };
    /**
     * Gets the bookmarks.
     * @private
     */
    DocumentHelper.prototype.getBookmarks = function (includeHidden) {
        var bookmarks = [];
        for (var i = 0; i < this.bookmarks.keys.length; i++) {
            var bookmark = this.bookmarks.keys[i];
            if (includeHidden || bookmark.indexOf('_') !== 0) {
                bookmarks.push(bookmark);
            }
        }
        return bookmarks;
    };
    /**
     * @private
     */
    DocumentHelper.prototype.selectComment = function (comment) {
        var _this = this;
        if (this.owner.selection && this.owner.commentReviewPane) {
            this.owner.showComments = true;
            setTimeout(function () {
                if (_this.owner && _this.owner.selection) {
                    _this.owner.selection.selectComment(comment);
                }
            });
        }
    };
    /**
     * @private
     */
    DocumentHelper.prototype.showComments = function (show) {
        if (this.owner && show && this.owner.enableComment) {
            var eventArgs = { type: 'Comment' };
            this.owner.trigger('beforePaneSwitch', eventArgs);
        }
        this.owner.commentReviewPane.reviewTab.hideTab(0, false);
        this.owner.commentReviewPane.showHidePane(show && this.owner.enableComment, 'Comments');
    };
    /**
     * @private
     */
    DocumentHelper.prototype.showRevisions = function (show) {
        if (this.owner && show) {
            var eventArgs = { type: 'comment' };
            this.owner.trigger('beforePaneSwitch', eventArgs);
        }
        if (!show && this.owner.showComments) {
            this.owner.commentReviewPane.reviewTab.hideTab(0, false);
            this.owner.commentReviewPane.showHidePane(true, 'Comments');
        }
        else if (!this.showRevision && !this.owner.enableTrackChanges && this.owner.showRevisions) {
            this.owner.commentReviewPane.showHidePane(!show, 'Changes');
            this.owner.showRevisions = false;
        }
        else {
            this.owner.commentReviewPane.showHidePane(show, 'Changes');
            this.owner.commentReviewPane.reviewTab.hideTab(0, true);
            this.showRevision = false;
        }
    };
    /**
     * Initializes components.
     * @private
     */
    DocumentHelper.prototype.initializeComponents = function () {
        var element = this.owner.element;
        if (isNullOrUndefined(element)) {
            return;
        }
        //let viewer: LayoutViewer = this;
        this.optionsPaneContainer = createElement('div', {
            className: 'e-documenteditor-optionspane'
        });
        element.appendChild(this.optionsPaneContainer);
        var isRtl = this.owner.enableRtl;
        var viewerContainerStyle;
        if (isRtl) {
            viewerContainerStyle = 'direction:ltr;';
        }
        this.viewerContainer = createElement('div', { id: this.owner.containerId + '_viewerContainer' });
        this.viewerContainer.style.cssText = 'position:relative;backgroundColor:#FBFBFB;overflow:auto;' + viewerContainerStyle;
        this.optionsPaneContainer.appendChild(this.viewerContainer);
        this.viewerContainer.tabIndex = 0;
        this.viewerContainer.style.outline = 'none';
        this.pageContainer = createElement('div', { id: this.owner.containerId + '_pageContainer', className: 'e-de-background' });
        this.viewerContainer.appendChild(this.pageContainer);
        this.pageContainer.style.top = '0px';
        this.pageContainer.style.left = '0px';
        this.pageContainer.style.position = 'relative';
        this.pageContainer.style.pointerEvents = 'none';
        if (Browser.isDevice) {
            this.createEditableDiv(element);
        }
        else {
            this.createEditableIFrame();
        }
        if (this.owner.enableImageResizerMode) {
            this.owner.imageResizerModule.initializeImageResizer();
        }
        this.updateViewerSizeInternal(element);
        this.layout = new Layout(this);
        this.textHelper = new TextHelper(this);
        this.zoomModule = new Zoom(this);
        this.initTouchEllipse();
        this.wireEvent();
        this.restrictEditingPane = new RestrictEditing(this);
        this.owner.commentReviewPane = new CommentReviewPane(this.owner);
        this.owner.trackChangesPane = new TrackChangesPane(this.owner, this.owner.commentReviewPane);
        createSpinner({ target: this.owner.element, cssClass: 'e-spin-overlay' });
    };
    DocumentHelper.prototype.measureScrollbarWidth = function (element) {
        var parentDiv = document.createElement('div');
        parentDiv.setAttribute('style', 'visibility:hidden;overflow:scroll');
        element.appendChild(parentDiv);
        var childDiv = document.createElement('div');
        parentDiv.appendChild(childDiv);
        this.scrollbarWidth = (parentDiv.getBoundingClientRect().width - childDiv.getBoundingClientRect().width);
        parentDiv.parentNode.removeChild(parentDiv);
    };
    /**
     * @private
     */
    DocumentHelper.prototype.createEditableDiv = function (element) {
        this.editableDiv = document.createElement('div');
        this.editableDiv.contentEditable = 'true';
        this.editableDiv.style.position = 'fixed';
        this.editableDiv.style.left = '-150em';
        this.editableDiv.style.width = '100%';
        this.editableDiv.style.height = '100%';
        this.editableDiv.id = element.id + '_editableDiv';
        document.body.appendChild(this.editableDiv);
    };
    /**
     * @private
     */
    DocumentHelper.prototype.createEditableIFrame = function () {
        this.iframe = createElement('iframe', {
            attrs: {
                'scrolling': 'no',
                // tslint:disable-next-line:max-line-length
                'style': 'pointer-events:none;position:absolute;left:0px;top:0px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden'
            },
            className: 'e-de-text-target'
        });
        this.viewerContainer.appendChild(this.iframe);
        this.initIframeContent();
    };
    DocumentHelper.prototype.initIframeContent = function () {
        var style = 'background-color:transparent;width:100%;height:100%;padding: 0px; margin: 0px;';
        var innerHtml = '<!DOCTYPE html>'
            + '<html><head></head>'
            + '<body spellcheck="false" style=' + style + ' >'
            + '<div contenteditable="true" style=' + style + '></div>'
            + '</body>'
            + '</html>';
        this.iframe.contentDocument.open();
        this.iframe.contentDocument.write(innerHtml);
        this.iframe.contentDocument.close();
        this.editableDiv = this.iframe.contentDocument.body.children[0];
    };
    /**
     * Wires events and methods.
     */
    DocumentHelper.prototype.wireEvent = function () {
        if (!isNullOrUndefined(this.selection)) {
            this.selection.initCaret();
        }
        this.wireInputEvents();
        if (!isNullOrUndefined(this.iframe)) {
            this.iframe.addEventListener('load', this.onIframeLoad);
        }
        this.viewerContainer.addEventListener('scroll', this.scrollHandler);
        this.viewerContainer.addEventListener('mousedown', this.onMouseDownInternal);
        this.viewerContainer.addEventListener('keydown', this.onKeyDownInternal);
        this.viewerContainer.addEventListener('mousemove', this.onMouseMoveInternal);
        this.viewerContainer.addEventListener('mouseleave', this.onMouseLeaveInternal);
        this.viewerContainer.addEventListener('mouseenter', this.onMouseEnterInternal);
        this.viewerContainer.addEventListener('contextmenu', this.onContextMenu);
        this.viewerContainer.addEventListener('dblclick', this.onDoubleTap);
        this.viewerContainer.addEventListener('mouseup', this.onMouseUpInternal);
        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('keyup', this.onKeyUpInternal);
        window.addEventListener('mouseup', this.onImageResizer);
        window.addEventListener('touchend', this.onImageResizer);
        this.viewerContainer.addEventListener('touchstart', this.onTouchStartInternal);
        this.viewerContainer.addEventListener('touchmove', this.onTouchMoveInternal);
        this.viewerContainer.addEventListener('touchend', this.onTouchUpInternal);
        if (navigator.userAgent.match('Firefox')) {
            this.viewerContainer.addEventListener('DOMMouseScroll', this.zoomModule.onMouseWheelInternal);
        }
        this.viewerContainer.addEventListener('mousewheel', this.zoomModule.onMouseWheelInternal);
    };
    DocumentHelper.prototype.wireInputEvents = function () {
        if (isNullOrUndefined(this.editableDiv)) {
            return;
        }
        this.editableDiv.addEventListener('paste', this.onPaste);
        if (!Browser.isDevice) {
            this.editableDiv.addEventListener('keypress', this.onKeyPressInternal);
            if (Browser.info.name === 'chrome') {
                this.editableDiv.addEventListener('textInput', this.onTextInput);
            }
        }
        else {
            this.editableDiv.addEventListener('input', this.onTextInputInternal);
        }
        this.editableDiv.addEventListener('blur', this.onFocusOut);
        this.editableDiv.addEventListener('keydown', this.onKeyDownInternal);
        this.editableDiv.addEventListener('compositionstart', this.compositionStart);
        this.editableDiv.addEventListener('compositionupdate', this.compositionUpdated);
        this.editableDiv.addEventListener('compositionend', this.compositionEnd);
    };
    DocumentHelper.prototype.getEditableDivTextContent = function () {
        return this.editableDiv.textContent;
    };
    /**
     * @private
     */
    DocumentHelper.prototype.updateAuthorIdentity = function () {
        var revisions = this.owner.revisions.changes;
        for (var i = 0; i < revisions.length; i++) {
            this.getAuthorColor(revisions[i].author);
        }
    };
    /**
     * @private
     */
    DocumentHelper.prototype.getAvatar = function (userInfo, userName, comment, revision) {
        var author;
        var userinitial;
        if (!isNullOrUndefined(comment)) {
            author = comment.author;
            userinitial = comment.initial;
        }
        else {
            author = revision.author;
        }
        if (!isNullOrUndefined(author)) {
            var avatarDiv = createElement('div', { className: 'e-de-cmt-avatar' });
            var avatar = createElement('div', { className: 'e-de-ff-cmt-avatar' });
            avatar.style.backgroundColor = this.owner.documentHelper.getAuthorColor(author);
            if (userinitial === '' || isNullOrUndefined(userinitial)) {
                var authorName = author.split(' ');
                var initial = authorName[0].charAt(0);
                if (authorName.length > 1) {
                    initial += authorName[authorName.length - 1][0];
                }
                avatar.innerText = initial.toUpperCase();
            }
            else {
                if (userinitial.length > 2) {
                    avatar.innerText = userinitial.substring(0, 2);
                }
                else {
                    avatar.innerText = userinitial;
                }
            }
            avatarDiv.appendChild(avatar);
            avatarDiv.appendChild(userName);
            userInfo.appendChild(avatarDiv);
        }
    };
    /**
     * @private
     */
    DocumentHelper.prototype.getAuthorColor = function (author) {
        if (this.authors.containsKey(author)) {
            return this.authors.get(author);
        }
        var color = this.owner.userColor;
        if (author !== this.owner.currentUser) {
            if (this.authors.length === 0 && color !== '#b5082e') {
                color = '#b5082e'; //dark red
            }
            else {
                color = this.generateRandomColor();
            }
        }
        this.authors.add(author, color);
        return color;
    };
    /**
     * @private
     */
    DocumentHelper.prototype.generateRandomColor = function () {
        var userColors = ['#b5082e',
            '#2e97d3',
            '#bb00ff',
            '#f37e43',
            '#03a60b',
            '#881824',
            '#e09a2b',
            '#50565e']; //dark grey
        return userColors[(this.authors.length % 8)];
    };
    /**
     * @private
     */
    DocumentHelper.prototype.positionEditableTarget = function () {
        var point = this.selection.getRect(this.selection.start);
        var page = this.selection.getSelectionPage(this.selection.start);
        var caretInfo = this.selection.updateCaretSize(this.owner.selection.start);
        var sectionFormat = page.bodyWidgets[0].sectionFormat;
        var left = page.boundingRectangle.x + (HelperMethods.convertPointToPixel(sectionFormat.leftMargin) * this.zoomFactor);
        var top = point.y;
        var pageWidth = sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin;
        var iframeStyle = 'left:' + left + 'px;';
        iframeStyle += 'top:' + top + 'px;';
        iframeStyle += 'width:' + (HelperMethods.convertPointToPixel(pageWidth) * this.zoomFactor) + 'px;';
        iframeStyle += 'height:250px;outline-style:none;position:absolute';
        this.iframe.setAttribute('style', iframeStyle);
        var style = 'background-color:transparent;width:100%;height:250px;padding: 0px; margin: 0px;';
        style += 'text-indent:' + (point.x - left) + 'px;';
        style += 'color:transparent;pointer-events:none;outline-style:none;';
        style += 'font-size:' + (HelperMethods.convertPointToPixel(this.selection.characterFormat.fontSize) * this.zoomFactor) + 'px;';
        style += 'font-family' + this.selection.characterFormat.fontFamily + ';';
        style += 'overflow:hidden;text-decoration:none;white-space:normal;';
        this.editableDiv.setAttribute('style', style);
    };
    /**
     * Initializes dialog template.
     */
    DocumentHelper.prototype.initDialog = function (isRtl) {
        if (!this.dialogInternal) {
            this.dialogTarget1 = createElement('div', { className: 'e-de-dlg-target' });
            document.body.appendChild(this.dialogTarget1);
            if (isRtl) {
                this.dialogTarget1.classList.add('e-de-rtl');
            }
            this.dialogInternal = new Dialog({
                target: document.body, showCloseIcon: true,
                allowDragging: true, enableRtl: isRtl, visible: false,
                width: '1px', isModal: true, position: { X: 'center', Y: 'center' }, zIndex: this.owner.zIndex + 20,
                animationSettings: { effect: 'None' }
            });
            this.dialogInternal.isStringTemplate = true;
            this.dialogInternal.open = this.selection.hideCaret;
            this.dialogInternal.beforeClose = this.updateFocus;
            this.dialogInternal.appendTo(this.dialogTarget1);
        }
    };
    /**
     * Initializes dialog template.
     */
    DocumentHelper.prototype.initDialog3 = function (isRtl) {
        if (!this.dialogInternal3) {
            this.dialogTarget3 = createElement('div', { className: 'e-de-dlg-target' });
            document.body.appendChild(this.dialogTarget3);
            if (isRtl) {
                this.dialogTarget3.classList.add('e-de-rtl');
            }
            this.dialogInternal3 = new Dialog({
                target: document.body, showCloseIcon: true,
                allowDragging: true, enableRtl: isRtl, visible: false,
                width: '1px', isModal: true, position: { X: 'center', Y: 'center' }, zIndex: this.owner.zIndex,
                animationSettings: { effect: 'None' }
            });
            this.dialogInternal3.isStringTemplate = true;
            this.dialogInternal3.open = this.selection.hideCaret;
            this.dialogInternal3.beforeClose = this.updateFocus;
            this.dialogInternal3.appendTo(this.dialogTarget3);
        }
    };
    /**
     * @private
     */
    DocumentHelper.prototype.hideDialog = function () {
        this.dialog.hide();
        this.updateFocus();
    };
    /**
     * Initializes dialog template.
     */
    DocumentHelper.prototype.initDialog2 = function (isRtl) {
        if (!this.dialogInternal2) {
            this.dialogTarget2 = createElement('div', { className: 'e-de-dlg-target' });
            document.body.appendChild(this.dialogTarget2);
            if (isRtl) {
                this.dialogTarget2.classList.add('e-de-rtl');
            }
            this.dialogInternal2 = new Dialog({
                target: document.body, showCloseIcon: true,
                allowDragging: true, enableRtl: isRtl, visible: false,
                width: '1px', isModal: true, position: { X: 'center', Y: 'Top' }, zIndex: this.owner.zIndex + 10
            });
            this.dialogInternal2.isStringTemplate = true;
            this.dialogInternal2.appendTo(this.dialogTarget2);
        }
    };
    /**
     * Clears the context.
     * @private
     */
    DocumentHelper.prototype.clearContent = function () {
        this.containerContext.clearRect(0, 0, this.containerCanvas.width, this.containerCanvas.height);
        this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        // Hide comment mark
        if (this.pageContainer) {
            var commentMarkElement = this.pageContainer.getElementsByClassName('e-de-cmt-mark');
            for (var i = 0; i < commentMarkElement.length; i++) {
                commentMarkElement[i].style.display = 'none';
            }
        }
        if (this.pageContainer) {
            var editRangeStart = this.pageContainer.getElementsByClassName('e-de-lock-mark');
            for (var i = 0; i < editRangeStart.length; i++) {
                editRangeStart[i].style.display = 'none';
            }
        }
    };
    /**
     * Fired when the document gets changed.
     * @param {WordDocument} document
     */
    DocumentHelper.prototype.onDocumentChanged = function (sections) {
        this.clearContent();
        if (this.owner.editorModule) {
            this.owner.editorModule.tocStyles = {};
            this.owner.editorModule.tocBookmarkId = 0;
        }
        this.heightInfoCollection = {};
        this.owner.isDocumentLoaded = false;
        this.updateAuthorIdentity();
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].bodyWidgets[0].destroy();
        }
        this.pages = [];
        if (!isNullOrUndefined(this.renderedLists)) {
            this.renderedLists.clear();
        }
        if (!isNullOrUndefined(this.renderedLevelOverrides)) {
            this.renderedLevelOverrides = [];
        }
        if (!isNullOrUndefined(this.owner.editorHistory)) {
            this.owner.editorHistory.destroy();
        }
        this.owner.isDocumentLoaded = true;
        this.layout.isInitialLoad = true;
        this.layout.layoutItems(sections, false);
        if (this.owner.selection) {
            this.selection.previousSelectedFormField = undefined;
            if (this.formFields.length > 0) {
                this.owner.selection.highlightFormFields();
            }
            this.owner.selection.editRangeCollection = [];
            this.owner.selection.selectRange(this.owner.documentStart, this.owner.documentStart);
            if (this.isDocumentProtected) {
                this.restrictEditingPane.showHideRestrictPane(true);
            }
        }
        if (this.owner.optionsPaneModule) {
            this.owner.optionsPaneModule.showHideOptionsPane(false);
        }
        if (this.restrictEditingPane.restrictPane && !this.isDocumentProtected) {
            this.restrictEditingPane.showHideRestrictPane(false);
        }
        if (!isNullOrUndefined(this.owner.selection) && this.owner.selection.isViewPasteOptions) {
            this.owner.selection.isViewPasteOptions = false;
            this.owner.selection.showHidePasteOptions(undefined, undefined);
        }
        this.owner.fireDocumentChange();
    };
    /**
     * Initialize touch ellipse.
     */
    DocumentHelper.prototype.initTouchEllipse = function () {
        var style = 'height: 30px;width: 30px;position: absolute;background-color: transparent;margin: 0px;padding: 0px;z-index:5';
        // tslint:disable-next-line:max-line-length
        var ellipse = ' height: 12px;width: 12px;border-radius: 50%;background-color: white;position: absolute;margin: 0px 6px 0px 6px;border-width: 2px;border-style: solid;border-color: #000000;box-sizing: unset;';
        this.touchStart = createElement('div', { className: 'e-touch-ellipse', styles: style });
        var start = createElement('div', { styles: ellipse });
        this.touchEnd = createElement('div', { className: 'e-touch-ellipse', styles: style });
        this.touchStart.style.display = 'none';
        var end = createElement('div', { styles: ellipse });
        this.touchStart.appendChild(start);
        this.touchEnd.appendChild(end);
        this.touchEnd.style.display = 'none';
        this.viewerContainer.appendChild(this.touchStart);
        this.viewerContainer.appendChild(this.touchEnd);
    };
    /**
     * Updates touch mark position.
     * @private
     */
    DocumentHelper.prototype.updateTouchMarkPosition = function () {
        if (this.touchStart.style.display !== 'none' && !isNullOrUndefined(this.selection)) {
            if (!this.selection.isEmpty) {
                this.viewer = this.owner.viewer;
                var y = this.selection.getCaretBottom(this.selection.start, false);
                var page = this.selection.getPage(this.selection.start.paragraph);
                // tslint:disable-next-line:max-line-length
                var pageTop = (page.boundingRectangle.y - (this.owner.viewer.pageGap * (this.pages.indexOf(page) + 1)) * this.zoomFactor + this.owner.viewer.pageGap * (this.pages.indexOf(page) + 1));
                // tslint:disable-next-line:max-line-length
                this.touchStart.style.left = page.boundingRectangle.x + (Math.round(this.selection.start.location.x) * this.zoomFactor - 14) + 'px';
                this.touchStart.style.top = pageTop + ((y) * this.zoomFactor) + 'px';
                if (!this.selection.isEmpty) {
                    y = this.selection.getCaretBottom(this.selection.end, false);
                    page = this.selection.getPage(this.selection.end.paragraph);
                }
                // tslint:disable-next-line:max-line-length
                this.touchEnd.style.left = page.boundingRectangle.x + (Math.round(this.selection.end.location.x) * this.zoomFactor - 14) + 'px';
                this.touchEnd.style.top = pageTop + (y * this.zoomFactor) + 'px';
            }
            else {
                this.selection.updateCaretPosition();
            }
        }
    };
    DocumentHelper.prototype.scrollForwardOnSelection = function () {
        this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + 200;
    };
    DocumentHelper.prototype.scrollBackwardOnSelection = function () {
        this.viewerContainer.scrollTop = this.viewerContainer.scrollTop - 200;
    };
    DocumentHelper.prototype.isSelectionInListText = function (cursorPoint) {
        var widget = this.getLineWidget(cursorPoint);
        if (!isNullOrUndefined(widget) && widget.children[0] instanceof ListTextElementBox) {
            var left = this.getLeftValue(widget);
            var width = widget.children[0].width;
            var height = widget.children[0].height;
            if (this.isInsideRect(left, widget.paragraph.y, width, height, cursorPoint)) {
                this.selectionLineWidget = widget;
                return true;
            }
        }
        return false;
    };
    /**
     * @private
     */
    DocumentHelper.prototype.isInShapeBorder = function (floatElement, cursorPoint) {
        if (!isNullOrUndefined(floatElement) && floatElement instanceof ShapeElementBox) {
            var width = floatElement.width;
            var height = floatElement.height;
            var lineWidth = floatElement.lineFormat.weight;
            // tslint:disable-next-line:max-line-length
            if (this.isInsideRect(floatElement.x - floatElement.margin.left, floatElement.y - floatElement.margin.top, width, height, cursorPoint)) {
                // this.selectionLineWidget = this.getLineWidget(cursorPoint);
                if (!(this.isInsideRect(floatElement.x + lineWidth, floatElement.y + lineWidth + floatElement.textFrame.marginTop, 
                // tslint:disable-next-line:max-line-length
                width - (lineWidth * 2), height - ((lineWidth * 2) + floatElement.textFrame.marginTop + floatElement.textFrame.marginBottom), cursorPoint))) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Check whether touch point is inside the rectangle or not.
     * @param x
     * @param y
     * @param width
     * @param height
     * @param touchPoint
     * @private
     */
    DocumentHelper.prototype.isInsideRect = function (x, y, width, height, touchPoint) {
        if ((touchPoint.x > x && touchPoint.x <= x + width) && (touchPoint.y > y && touchPoint.y <= y + height)) {
            return true;
        }
        return false;
    };
    /**
     * @private
     */
    DocumentHelper.prototype.getLeftValue = function (widget) {
        var left = widget.paragraph.x;
        var paragraphFormat = widget.paragraph.paragraphFormat;
        if (this.selection.isParagraphFirstLine(widget)) {
            if (paragraphFormat.textAlignment === 'Right') {
                left -= HelperMethods.convertPointToPixel(paragraphFormat.firstLineIndent);
                left -= HelperMethods.convertPointToPixel(paragraphFormat.leftIndent);
            }
            else {
                left += HelperMethods.convertPointToPixel(paragraphFormat.firstLineIndent);
            }
        }
        var element = widget.children[0];
        if (element instanceof ListTextElementBox) {
            left += element.margin.left;
        }
        return left;
    };
    /**
     * Checks whether left mouse button is pressed or not.
     */
    DocumentHelper.prototype.isLeftButtonPressed = function (event) {
        this.isTouchInput = false;
        var button = event.which || event.button;
        return button === 1;
    };
    /**
     * Updates selection for touch position.
     * @param point
     * @param touchPoint
     */
    DocumentHelper.prototype.updateSelectionOnTouch = function (point, touchPoint) {
        this.zoomX = undefined;
        this.zoomY = undefined;
        // tslint:disable-next-line:max-line-length
        if (this.isMouseDown && !this.isSelectionChangedOnMouseMoved && !isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)) {
            if (this.touchDownOnSelectionMark === 0) {
                this.updateTextPositionForSelection(new Point(touchPoint.x, touchPoint.y), this.tapCount);
                if (this.tapCount === 2) {
                    this.selection.checkAndEnableHeaderFooter(point, touchPoint);
                }
            }
            if (this.owner.selection.isEmpty) {
                this.selection.updateCaretPosition();
            }
            this.selection.checkForCursorVisibility();
            if (!isNullOrUndefined(this.currentSelectedComment) && this.owner.commentReviewPane
                && !this.owner.commentReviewPane.commentPane.isEditMode) {
                this.currentSelectedComment = undefined;
            }
        }
    };
    /**
     * Gets touch offset value.
     * @private
     */
    DocumentHelper.prototype.getTouchOffsetValue = function (event) {
        var targetElement = this.viewerContainer;
        var offset = targetElement.getBoundingClientRect();
        var touchOffsetValues = event.touches[0];
        if (isNullOrUndefined(touchOffsetValues)) {
            touchOffsetValues = event.changedTouches[0];
        }
        var offsetX = touchOffsetValues.pageX - offset.left;
        var offsetY = touchOffsetValues.pageY - offset.top;
        return new Point(offsetX, offsetY);
    };
    /**
     * Fired on pinch zoom in.
     * @param {TouchEvent} event
     * @private
     */
    DocumentHelper.prototype.onPinchInInternal = function (event) {
        this.preZoomFactor = this.zoomFactor;
        var updatedZoomFactor = this.zoomFactor - 0.01;
        if (updatedZoomFactor < 5 && updatedZoomFactor > 2) {
            updatedZoomFactor = updatedZoomFactor - 0.01;
        }
        if (updatedZoomFactor < 0.1) {
            updatedZoomFactor = 0.1;
        }
        this.zoomFactor = updatedZoomFactor;
    };
    /**
     * Fired on pinch zoom out.
     * @param {TouchEvent} event
     */
    DocumentHelper.prototype.onPinchOutInternal = function (event) {
        this.preZoomFactor = this.zoomFactor;
        var updatedZoomFactor = this.zoomFactor + 0.01;
        if (updatedZoomFactor > 2) {
            updatedZoomFactor = updatedZoomFactor + 0.01;
        }
        if (updatedZoomFactor > 5) {
            updatedZoomFactor = 5;
        }
        this.zoomFactor = updatedZoomFactor;
    };
    /**
     * Gets page width.
     * @private
     */
    DocumentHelper.prototype.getPageWidth = function (page) {
        var width = page.boundingRectangle.width;
        return width;
    };
    /**
     * Removes specified page.
     * @private
     */
    DocumentHelper.prototype.removePage = function (page) {
        if (this.currentPage === page) {
            this.currentPage = undefined;
        }
        var index = this.pages.indexOf(page);
        // if (index > -1) {
        this.pages.splice(index, 1);
        // }        
        //this.removeRenderedPages();
        if (!isNullOrUndefined(this.owner.viewer.visiblePages)) {
            if ((this.owner.viewer.visiblePages).indexOf(page) > -1) {
                var pageIndex = (this.owner.viewer.visiblePages).indexOf(page);
                (this.owner.viewer.visiblePages).splice(pageIndex, 1);
            }
        }
        //(viewer as PageLayoutViewer).visiblePages.remove(page);
        var height = 0;
        for (var i = 0; i < this.pages.length; i++) {
            height = height + this.pages[i].boundingRectangle.height;
        }
        //Updates the vertical height.
        height -= page.boundingRectangle.height + 20;
        //ToDo:Update horizontal width, if removed page has max width.
        var top = 20;
        if (index > 0) {
            top += this.pages[index - 1].boundingRectangle.bottom;
        }
        if (index !== -1) {
            for (var i = index; i < this.pages.length; i++) {
                //Update bounding rectangle of next pages in collection.
                page = this.pages[i];
                // tslint:disable-next-line:max-line-length
                page.boundingRectangle = new Rect(page.boundingRectangle.x, top, page.boundingRectangle.width, page.boundingRectangle.height);
                top = page.boundingRectangle.bottom + 20;
                page.repeatHeaderRowTableWidget = false;
            }
        }
    };
    // private removeRenderedPages(): void {
    //     for (let i: number = 0; i < this.pages.length; i++) {
    //         this.clearContainer(this.pages[i]);
    //     }
    // }
    /**
     * Updates viewer size on window resize.
     * @private
     */
    DocumentHelper.prototype.updateViewerSize = function () {
        var _this = this;
        var element = this.owner.getDocumentEditorElement();
        this.updateViewerSizeInternal(element);
        this.owner.viewer.updateScrollBars();
        if (this.owner.viewer instanceof WebLayoutViewer && (!isNullOrUndefined(this.owner)) && (!isNullOrUndefined(element))) {
            if (this.resizerTimer) {
                clearTimeout(this.resizerTimer);
            }
            /* tslint:disable:align */
            this.resizerTimer = setTimeout(function () {
                var currentVisibleWidth;
                if (!isNullOrUndefined(_this.visibleBounds)) {
                    currentVisibleWidth = _this.visibleBounds.width;
                }
                else {
                    currentVisibleWidth = 0;
                }
                if (isNullOrUndefined(_this.owner.viewer.preVisibleWidth)) {
                    _this.owner.viewer.preVisibleWidth = 0;
                }
                if ((!isNullOrUndefined(_this.visibleBounds) && (currentVisibleWidth !== _this.owner.viewer.preVisibleWidth))) {
                    _this.owner.editorModule.layoutWholeDocument();
                    _this.owner.viewer.preVisibleWidth = currentVisibleWidth;
                }
                if (_this.resizerTimer) {
                    clearTimeout(_this.resizerTimer);
                }
            }, 50);
        }
        if (!isNullOrUndefined(this.selection)) {
            this.selection.updateCaretPosition();
        }
    };
    /**
     * Updates viewer size.
     */
    DocumentHelper.prototype.updateViewerSizeInternal = function (element) {
        if (!isNullOrUndefined(element)) {
            var rect = element.getBoundingClientRect();
            var width = 0;
            var height = 0;
            height = rect.height > 0 ? rect.height : 200;
            var restrictPaneRect = this.restrictEditingPane && this.restrictEditingPane.isShowRestrictPane ?
                this.restrictEditingPane.restrictPane.getBoundingClientRect() : undefined;
            var optionsRect = this.owner.optionsPaneModule && this.owner.optionsPaneModule.isOptionsPaneShow ?
                this.owner.optionsPaneModule.optionsPane.getBoundingClientRect() : undefined;
            var commentPane = this.owner.commentReviewPane && this.owner.commentReviewPane.parentPaneElement ?
                this.owner.commentReviewPane.parentPaneElement.getBoundingClientRect() : undefined;
            if (restrictPaneRect || optionsRect || commentPane) {
                var paneWidth = restrictPaneRect ? restrictPaneRect.width : 0;
                paneWidth += optionsRect ? optionsRect.width : 0;
                paneWidth += commentPane ? commentPane.width : 0;
                width = (rect.width - paneWidth) > 0 ? (rect.width - paneWidth) : 200;
            }
            else {
                width = rect.width > 0 ? rect.width : 200;
            }
            this.viewerContainer.style.height = height.toString() + 'px';
            this.viewerContainer.style.width = Math.ceil(width) + 'px';
            this.visibleBoundsIn = new Rect(0, 0, width, height);
            this.containerCanvas.width = width;
            this.containerCanvas.height = height;
            this.selectionCanvas.width = width;
            this.selectionCanvas.height = height;
            this.measureScrollbarWidth(element);
        }
    };
    /**
     * Inserts page in specified index.
     * @private
     */
    DocumentHelper.prototype.insertPage = function (index, page) {
        if (this.pages.indexOf(page) > -1) {
            this.pages.splice(this.pages.indexOf(page), 1);
        }
        this.pages.splice(index, 0, page);
        var top = 20;
        if (index > 0) {
            top += this.pages[index - 1].boundingRectangle.bottom;
        }
        for (var i = index; i < this.pages.length; i++) {
            //Update bounding rectangle of next pages in collection.
            page = this.pages[i];
            page.boundingRectangle = new Rect(page.boundingRectangle.x, top, page.boundingRectangle.width, page.boundingRectangle.height);
            top = page.boundingRectangle.bottom + 20;
        }
    };
    /**
     * Updates text position for selection.
     * @param cursorPoint
     * @param tapCount
     * @param clearMultiSelection
     * @private
     */
    DocumentHelper.prototype.updateTextPositionForSelection = function (cursorPoint, tapCount) {
        var widget = this.getLineWidget(cursorPoint);
        if (!isNullOrUndefined(widget)) {
            this.selection.updateTextPosition(widget, cursorPoint);
        }
        if (tapCount > 1) {
            this.isMouseDown = false;
            this.useTouchSelectionMark = false;
            if (this.pages.length === 0) {
                return;
            }
            //Double tap/triple tap selection
            if (!isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)) {
                if (tapCount % 2 === 0) {
                    this.owner.selection.selectCurrentWord();
                }
                else {
                    this.owner.selection.selectParagraph();
                }
            }
        }
    };
    /**
     * Scrolls to specified position.
     * @param startPosition
     * @param endPosition
     * @private
     */
    DocumentHelper.prototype.scrollToPosition = function (startPosition, endPosition, skipCursorUpdate) {
        if (this.skipScrollToPosition || this.isWebPrinting) {
            this.skipScrollToPosition = false;
            return;
        }
        if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizing
            || this.isMouseDownInFooterRegion || this.isRowOrCellResizing) {
            return;
        }
        var lineWidget = this.selection.getLineWidgetInternal(endPosition.currentWidget, endPosition.offset, true);
        if (isNullOrUndefined(lineWidget)) {
            return;
        }
        var top = this.selection.getTop(lineWidget);
        if (this.isMouseDown) {
            var prevLineWidget = this.selection.getLineWidgetInternal(endPosition.currentWidget, endPosition.offset, false);
            var prevTop = this.selection.getTop(prevLineWidget);
            if (prevLineWidget !== lineWidget && endPosition.location.y >= prevTop) {
                lineWidget = prevLineWidget;
            }
        }
        var height = lineWidget.height;
        //Gets current page.
        var endPage = this.selection.getPage(lineWidget.paragraph);
        this.currentPage = endPage;
        var x = 0;
        var y = 0;
        var horizontalWidth = 0;
        var isPageLayout = this.owner.viewer instanceof PageLayoutViewer;
        var pageLayout = this.owner.viewer;
        if (isNullOrUndefined(endPage)) {
            return;
        }
        var pageWidth = endPage.boundingRectangle.width;
        x = (this.visibleBounds.width - pageWidth * this.zoomFactor) / 2;
        if (x < 30) {
            x = 30;
        }
        // tslint:disable-next-line:max-line-length
        y = endPage.boundingRectangle.y * this.zoomFactor + (this.pages.indexOf(endPage) + 1) * this.owner.viewer.pageGap * (1 - this.zoomFactor);
        var scrollTop = this.owner.viewer.containerTop;
        var scrollLeft = this.owner.viewer.containerLeft;
        var pageHeight = this.visibleBounds.height;
        var caretInfo = this.selection.updateCaretSize(this.owner.selection.end, true);
        var topMargin = caretInfo.topMargin;
        var caretHeight = caretInfo.height;
        x += (endPosition.location.x) * this.zoomFactor;
        y += (endPosition.location.y + topMargin) * this.zoomFactor;
        //vertical scroll bar update
        if ((scrollTop + 20) > y) {
            this.viewerContainer.scrollTop = (y - 10);
        }
        else if (scrollTop + pageHeight < y + caretHeight) {
            this.viewerContainer.scrollTop = y + caretHeight - pageHeight + 10;
        }
        if (!skipCursorUpdate) {
            this.selection.updateCaretToPage(startPosition, endPage);
        }
        var scrollBarWidth = this.viewerContainer.offsetWidth - this.viewerContainer.clientWidth;
        if (scrollLeft > x) {
            this.viewerContainer.scrollLeft = x - (this.pageContainer.offsetWidth / 100) * 20;
        }
        else if (scrollLeft + this.visibleBounds.width < x + scrollBarWidth) {
            this.viewerContainer.scrollLeft = scrollLeft + (this.pageContainer.offsetWidth / 100) * 15 + scrollBarWidth;
        }
    };
    /**
     * Gets line widget using cursor point.
     * @private
     */
    DocumentHelper.prototype.getLineWidget = function (cursorPoint) {
        return this.getLineWidgetInternal(cursorPoint, false);
    };
    /**
     * Gets line widget.
     * @private
     */
    DocumentHelper.prototype.getLineWidgetInternal = function (cursorPoint, isMouseDragged) {
        var widget = undefined;
        if (!isNullOrUndefined(this.currentPage)) {
            var childWidgets = void 0;
            if (this.owner.enableHeaderAndFooter) {
                var page = this.currentPage;
                var pageBottom = page.boundingRectangle.height;
                var headerHeight = Math.max((page.headerWidget.y + page.headerWidget.height), HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin)) * this.zoomFactor;
                var footerDistance = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
                var footerHeight = (page.boundingRectangle.height -
                    Math.max(page.footerWidget.height + footerDistance, footerDistance * 2));
                if (isMouseDragged) {
                    if (this.isBlockInHeader(this.selection.start.paragraph)) {
                        childWidgets = this.currentPage.headerWidget;
                    }
                    else {
                        childWidgets = this.currentPage.footerWidget;
                    }
                }
                else {
                    if (cursorPoint.y <= pageBottom && cursorPoint.y >= footerHeight) {
                        childWidgets = this.currentPage.footerWidget;
                    }
                    else if ((cursorPoint.y) >= 0 && (cursorPoint.y) <= headerHeight) {
                        childWidgets = this.currentPage.headerWidget;
                    }
                }
                if (isNullOrUndefined(childWidgets)) {
                    return undefined;
                }
                var shapeElementInfo = this.checkFloatingItems(childWidgets, cursorPoint, isMouseDragged);
                if (shapeElementInfo.isShapeSelected) {
                    if (shapeElementInfo.isInShapeBorder) {
                        return shapeElementInfo.element.line;
                    }
                    return this.selection.getLineWidgetBodyWidget(shapeElementInfo.element.textFrame, cursorPoint);
                }
                else {
                    return this.selection.getLineWidgetBodyWidget(childWidgets, cursorPoint);
                }
            }
            else {
                var shapeInfo = this.checkFloatingItems(this.currentPage.bodyWidgets[0], cursorPoint, isMouseDragged);
                if (shapeInfo.isShapeSelected) {
                    if (shapeInfo.isInShapeBorder) {
                        return shapeInfo.element.line;
                    }
                    widget = this.selection.getLineWidgetBodyWidget(shapeInfo.element.textFrame, cursorPoint);
                }
                else if (isMouseDragged && this.isFootnoteWidget) {
                    // tslint:disable-next-line:max-line-length
                    if (this.selection.start.paragraph.footNoteReference !== undefined && this.selection.start.paragraph.containerWidget instanceof FootNoteWidget && this.selection.start.paragraph.containerWidget.footNoteType === 'Footnote') {
                        return this.selection.getLineWidgetBodyWidget(this.currentPage.footnoteWidget, cursorPoint);
                    }
                    else if (this.selection.start.paragraph.footNoteReference !== undefined &&
                        this.selection.start.paragraph.containerWidget instanceof FootNoteWidget
                        && this.selection.start.paragraph.containerWidget.footNoteType === 'Endnote') {
                        return this.selection.getLineWidgetBodyWidget(this.currentPage.endnoteWidget, cursorPoint);
                    }
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    if (!isMouseDragged && this.currentPage.footnoteWidget && this.isInFootnoteWidget(this.currentPage.footnoteWidget, cursorPoint)) {
                        widget = this.selection.getLineWidgetBodyWidget(this.currentPage.footnoteWidget, cursorPoint);
                        if (widget) {
                            this.isFootnoteWidget = true;
                        }
                    }
                    else if (!isMouseDragged && this.currentPage.endnoteWidget &&
                        this.isInFootnoteWidget(this.currentPage.endnoteWidget, cursorPoint)) {
                        widget = this.selection.getLineWidgetBodyWidget(this.currentPage.endnoteWidget, cursorPoint);
                        if (widget) {
                            this.isFootnoteWidget = true;
                        }
                    }
                    else {
                        for (var i = 0; i < this.currentPage.bodyWidgets.length; i++) {
                            var bodyWidgets = this.currentPage.bodyWidgets[i];
                            widget = this.selection.getLineWidgetBodyWidget(bodyWidgets, cursorPoint);
                            if (!isNullOrUndefined(widget)) {
                                this.isFootnoteWidget = false;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return widget;
    };
    DocumentHelper.prototype.isInFootnoteWidget = function (footnoteWidget, point) {
        for (var i = 0; i < footnoteWidget.childWidgets.length; i++) {
            var childWidget = footnoteWidget.childWidgets[i];
            if (childWidget instanceof Widget && childWidget.y <= point.y
                && (childWidget.y + childWidget.height) >= point.y) {
                return true;
            }
        }
        return false;
    };
    /**
     * @private
     */
    DocumentHelper.prototype.checkFloatingItems = function (blockContainer, cursorPoint, isMouseDragged) {
        var isInShape = false;
        var isInShapeBorder = false;
        var floatElement;
        var selectionInShape = this.selection.isInShape;
        var isMouseDraggedInShape = isMouseDragged && selectionInShape;
        if (blockContainer.floatingElements.length > 0) {
            var page = this.currentPage;
            /* tslint:disable */
            blockContainer.floatingElements.sort(function (a, b) { return b.zOrderPosition - a.zOrderPosition; });
            if (isMouseDraggedInShape) {
                var textFrame = this.owner.selection.getCurrentTextFrame();
                if (textFrame) {
                    floatElement = textFrame.containerShape;
                    isInShape = true;
                }
            }
            else {
                for (var i = 0; i < blockContainer.floatingElements.length; i++) {
                    floatElement = blockContainer.floatingElements[i];
                    if (cursorPoint.x < floatElement.x + floatElement.margin.left + floatElement.width &&
                        cursorPoint.x > floatElement.x && cursorPoint.y < floatElement.y + floatElement.margin.top +
                        floatElement.height && cursorPoint.y > floatElement.y) {
                        isInShape = true;
                        if (this.isInShapeBorder(floatElement, cursorPoint)) {
                            isInShapeBorder = true;
                        }
                        break;
                    }
                }
                if (isMouseDragged && !selectionInShape) {
                    isInShape = false;
                }
            }
        }
        return {
            'element': floatElement,
            'caretPosition': cursorPoint,
            'isShapeSelected': isInShape,
            'isInShapeBorder': isInShapeBorder
        };
    };
    /**
     * @private
     */
    DocumentHelper.prototype.isBlockInHeader = function (block) {
        while (!(block.containerWidget instanceof HeaderFooterWidget)) {
            if (!block.containerWidget) {
                return false;
            }
            block = block.containerWidget;
            if (block instanceof TextFrame) {
                block = block.containerShape.paragraph;
            }
        }
        return block.containerWidget.headerFooterType.indexOf('Header') !== -1;
    };
    /**
     * Clears selection highlight.
     * @private
     */
    DocumentHelper.prototype.clearSelectionHighlight = function () {
        var canClear = true;
        canClear = (!this.isControlPressed || !this.isMouseDown);
        // if (this.owner.selection.selectionRanges.length > 0 && canClear) {
        if (this.owner.selection.clearSelectionHighlightInSelectedWidgets()) {
            this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        }
        // } else if (!isNullOrUndefined(this.owner.selection.currentSelectionRange) && this.isMouseDown) {
        //     this.owner.selection.currentSelectionRange.clearSelectionHighlight();
        // }
        //this.renderVisiblePages();
    };
    /**
     * @private
     */
    DocumentHelper.prototype.removeEmptyPages = function () {
        var scrollToLastPage = false;
        for (var j = 0; j < this.pages.length; j++) {
            var page = this.pages[j];
            if (page.bodyWidgets.length === 0 || page.bodyWidgets[0].childWidgets.length === 0) {
                // tslint:disable-next-line:max-line-length
                if (j === this.pages.length - 1 && this.owner.viewer instanceof PageLayoutViewer && this.owner.viewer.visiblePages.indexOf(this.pages[j]) !== -1) {
                    scrollToLastPage = true;
                }
                this.removePage(this.pages[j]);
                j--;
            }
        }
        if (scrollToLastPage) {
            this.scrollToBottom();
        }
    };
    /**
     * @private
     */
    DocumentHelper.prototype.scrollToBottom = function () {
        if (this.selection.start.paragraph && this.selection.start.paragraph.bodyWidget) {
            var page = this.selection.start.paragraph.bodyWidget.page;
            var containerHeight = this.visibleBounds.height;
            this.viewerContainer.scrollTop = page.boundingRectangle.bottom - containerHeight;
        }
    };
    /**
     * Returns the field code result.
     * @private
     */
    DocumentHelper.prototype.getFieldResult = function (fieldBegin, page) {
        if (!isNullOrUndefined(page) && !isNullOrUndefined(this.selection)) {
            var fieldCode = this.selection.getFieldCode(fieldBegin);
            var fieldCodes = fieldCode.split('\*');
            var fieldCategory = fieldCodes[0].replace(/[^\w\s]/gi, '').trim().toLowerCase();
            var fieldPattern = '';
            if (fieldCodes.length > 1) {
                fieldPattern = fieldCodes[1].replace(/[^\w\s]/gi, '').trim();
            }
            fieldCategory = (!fieldCategory.match('numpages') && !fieldCategory.match('sectionpages') &&
                fieldCategory.match('page')) ? 'page' : fieldCategory;
            switch (fieldCategory) {
                case 'page':
                    if (page.bodyWidgets[0].sectionFormat.restartPageNumbering && page.sectionIndex !== 0) {
                        var currentSectionIndex_1 = page.sectionIndex;
                        var previousPage = page.previousPage;
                        if (currentSectionIndex_1 !== previousPage.sectionIndex) {
                            page.currentPageNum = (page.bodyWidgets[0].sectionFormat.pageStartingNumber);
                            return this.getFieldText(fieldPattern, page.currentPageNum);
                        }
                        if (previousPage.currentPageNum === 0) {
                            previousPage.currentPageNum = (page.bodyWidgets[0].sectionFormat.pageStartingNumber);
                        }
                        page.currentPageNum = previousPage.currentPageNum + 1;
                        return this.getFieldText(fieldPattern, page.currentPageNum);
                    }
                    page.currentPageNum = (!isNullOrUndefined(page.previousPage)) ? page.previousPage.currentPageNum + 1 : page.index + 1;
                    return this.getFieldText(fieldPattern, page.currentPageNum);
                case 'numpages':
                    return this.getFieldText(fieldPattern, page.documentHelper.pages.length);
                case 'sectionpages':
                    var currentSectionIndex = page.sectionIndex;
                    var currentPageCount = 0;
                    for (var i = 0; i < page.documentHelper.pages.length; i++) {
                        if (page.documentHelper.pages[i].sectionIndex === currentSectionIndex) {
                            currentPageCount++;
                        }
                        else if (currentPageCount !== 0) {
                            break;
                        }
                    }
                    return this.getFieldText(fieldPattern, currentPageCount);
                default:
                    break;
            }
        }
        return '';
    };
    /**
     * Returns field text.
     */
    DocumentHelper.prototype.getFieldText = function (pattern, value) {
        switch (pattern) {
            case 'ALPHABETIC':
                return this.layout.getAsLetter(value).toUpperCase();
            case 'alphabetic':
                return this.layout.getAsLetter(value).toLowerCase();
            case 'roman':
                return this.layout.getAsRoman(value).toLowerCase();
            case 'ROMAN':
                return this.layout.getAsRoman(value).toUpperCase();
            default:
                return value.toString();
        }
    };
    /**
     * Destroys the internal objects maintained for control.
     */
    DocumentHelper.prototype.destroy = function () {
        if (!isNullOrUndefined(this.owner)) {
            this.unWireEvent();
        }
        this.pages = [];
        this.pages = undefined;
        this.fieldStacks = [];
        this.fieldStacks = undefined;
        this.splittedCellWidgets = [];
        this.splittedCellWidgets = undefined;
        this.fields = [];
        this.fields = undefined;
        if (this.layout) {
            this.layout.destroy();
        }
        this.layout = undefined;
        if (!isNullOrUndefined(this.render)) {
            this.render.destroy();
        }
        this.render = undefined;
        if (this.dialogInternal) {
            this.dialogInternal.destroy();
        }
        this.dialogInternal = undefined;
        if (this.dialogInternal2) {
            this.dialogInternal2.destroy();
            this.dialogInternal2 = undefined;
        }
        if (this.dialogInternal3) {
            this.dialogInternal3.destroy();
            this.dialogInternal3 = undefined;
        }
        if (this.dialogTarget1 && this.dialogTarget1.parentElement) {
            this.dialogTarget1.parentElement.removeChild(this.dialogTarget1);
        }
        this.dialogTarget1 = undefined;
        if (this.dialogTarget2 && this.dialogTarget2.parentElement) {
            this.dialogTarget2.parentElement.removeChild(this.dialogTarget2);
        }
        this.dialogTarget2 = undefined;
        if (this.dialogTarget3 && this.dialogTarget3.parentElement) {
            this.dialogTarget3.parentElement.removeChild(this.dialogTarget3);
        }
        this.dialogTarget3 = undefined;
        if (!isNullOrUndefined(this.touchStart)) {
            this.touchStart.innerHTML = '';
        }
        if (this.textHelper) {
            this.textHelper.destroy();
        }
        this.textHelper = undefined;
        this.touchStart = undefined;
        if (!isNullOrUndefined(this.touchEnd)) {
            this.touchEnd.innerHTML = '';
        }
        this.touchEnd = undefined;
        if (!isNullOrUndefined(this.containerCanvasIn)) {
            this.containerCanvasIn.innerHTML = '';
        }
        this.containerCanvasIn = undefined;
        if (!isNullOrUndefined(this.selectionCanvasIn)) {
            this.selectionCanvasIn.innerHTML = '';
        }
        this.selectionCanvasIn = undefined;
        if (!isNullOrUndefined(this.editableDiv)) {
            this.editableDiv.innerHTML = '';
            this.editableDiv.parentElement.removeChild(this.editableDiv);
        }
        this.editableDiv = undefined;
        if (!isNullOrUndefined(this.pageContainer)) {
            this.pageContainer.innerHTML = '';
        }
        this.pageContainer = undefined;
        if (!isNullOrUndefined(this.viewerContainer)) {
            this.viewerContainer.innerHTML = '';
        }
        this.viewerContainer = undefined;
        this.owner = undefined;
        this.heightInfoCollection = undefined;
    };
    /**
     * Un-Wires events and methods
     */
    DocumentHelper.prototype.unWireEvent = function () {
        this.viewerContainer.removeEventListener('scroll', this.scrollHandler);
        this.viewerContainer.removeEventListener('mousedown', this.onMouseDownInternal);
        this.viewerContainer.removeEventListener('mousemove', this.onMouseMoveInternal);
        if (!Browser.isDevice) {
            this.editableDiv.removeEventListener('keypress', this.onKeyPressInternal);
            if (Browser.info.name === 'chrome') {
                this.editableDiv.removeEventListener('textInput', this.onTextInput);
            }
        }
        else {
            this.editableDiv.removeEventListener('input', this.onTextInputInternal);
        }
        this.editableDiv.removeEventListener('paste', this.onPaste);
        this.viewerContainer.removeEventListener('contextmenu', this.onContextMenu);
        this.editableDiv.removeEventListener('blur', this.onFocusOut);
        this.editableDiv.removeEventListener('keydown', this.onKeyDownInternal);
        this.editableDiv.removeEventListener('compositionstart', this.compositionStart);
        this.editableDiv.removeEventListener('compositionupdate', this.compositionUpdated);
        this.editableDiv.removeEventListener('compositionend', this.compositionEnd);
        this.viewerContainer.removeEventListener('mouseup', this.onMouseUpInternal);
        if (!isNullOrUndefined(this.iframe)) {
            this.iframe.removeEventListener('load', this.onIframeLoad);
        }
        this.viewerContainer.removeEventListener('dblclick', this.onDoubleTap);
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('keyup', this.onKeyUpInternal);
        window.removeEventListener('mouseup', this.onImageResizer);
        window.removeEventListener('touchend', this.onImageResizer);
    };
    /**
     * updateCursor
     * @private
     */
    DocumentHelper.prototype.updateCursor = function (event) {
        var hyperlinkField = undefined;
        var footnoteElement = undefined;
        var div = this.viewerContainer;
        var point = new Point(event.offsetX, event.offsetY);
        var touchPoint = this.owner.viewer.findFocusedPage(point, true);
        var widget = this.getLineWidget(touchPoint);
        var widgetInfo;
        var left;
        var top;
        var editor = !this.owner.isReadOnlyMode ? this.owner.editorModule : undefined;
        var isRowResize = editor ? editor.tableResize.isInRowResizerArea(touchPoint) : false;
        var isCellResize = editor ? editor.tableResize.isInCellResizerArea(touchPoint) : false;
        var floatItemInfo = this.selection.checkAllFloatingElements(widget, touchPoint);
        var resizePosition = '';
        if (this.owner.enableImageResizerMode) {
            var resizeObj = this.owner.imageResizerModule.getImagePoint(touchPoint);
            this.owner.imageResizerModule.selectedResizeElement = resizeObj.selectedElement;
            resizePosition = resizeObj.resizePosition;
        }
        var lineLeft = 0;
        var formField = undefined;
        var referenceField = undefined;
        if (!isNullOrUndefined(widget)) {
            lineLeft = this.selection.getLineStartLeft(widget);
            hyperlinkField = this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint);
            if (isNullOrUndefined(hyperlinkField)) {
                formField = this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint, true);
            }
            if (!isNullOrUndefined(hyperlinkField)) {
                var code = this.selection.getFieldCode(hyperlinkField);
                if (code.toLowerCase().indexOf('ref ') === 0 && !code.match('\\h')) {
                    hyperlinkField = undefined;
                }
            }
            widgetInfo = this.selection.updateTextPositionIn(widget, undefined, 0, touchPoint, true);
            left = this.selection.getLeft(widget);
            top = this.selection.getTop(widget);
            if (isNullOrUndefined(hyperlinkField) && !isNullOrUndefined(formField) && this.isDocumentProtected &&
                this.protectionType === 'FormFieldsOnly' && !this.isFormFilling) {
                this.selection.setHyperlinkContentToToolTip(formField, widget, touchPoint.x, true);
            }
            else {
                this.selection.setHyperlinkContentToToolTip(hyperlinkField, widget, touchPoint.x, false);
            }
            if (formField) {
                // tslint:disable-next-line:max-line-length
                var isInlineFormFillMode = (formField.formFieldData instanceof TextFormField) && formField.formFieldData.type === 'Text';
                if (this.owner.documentEditorSettings.formFieldSettings.formFillingMode === 'Inline' && isInlineFormFillMode) {
                    //Update text cursor in text form field.
                    formField = undefined;
                }
            }
            if (this.owner.enableLockAndEdit) {
                var isLocked = false;
                var block = widget.paragraph;
                if (block.isInsideTable) {
                    block = this.layout.getParentTable(block);
                }
                if (block.locked && block.lockedBy !== this.owner.currentUser) {
                    isLocked = true;
                }
                var sectionFormat = widget.paragraph.bodyWidget.sectionFormat;
                var pageWidth = sectionFormat.pageWidth - sectionFormat.rightMargin - sectionFormat.leftMargin;
                pageWidth = HelperMethods.convertPointToPixel(pageWidth) * this.zoomFactor;
                if (this.viewer instanceof WebLayoutViewer) {
                    pageWidth = (this.visibleBounds.width - (this.viewer.padding.right * 5)) / this.zoomFactor;
                }
                if (isLocked && touchPoint.x >= lineLeft && touchPoint.x < lineLeft + pageWidth) {
                    this.selection.setLockInfoTooptip(widget, touchPoint.x, block.lockedBy);
                }
                else {
                    this.selection.setLockInfoTooptip(undefined, touchPoint.x, '');
                }
            }
        }
        if (!isNullOrUndefined(widget)) {
            if (isNullOrUndefined(footnoteElement)) {
                footnoteElement = this.selection.getFootNoteElementInCurrentSelection(widget, touchPoint);
                if (footnoteElement instanceof FootnoteElementBox) {
                    this.selection.setFootnoteContentToToolTip(footnoteElement, widget, touchPoint.x);
                }
            }
        }
        var isCtrlkeyPressed = this.isIosDevice ? event.metaKey : event.ctrlKey;
        if ((!isNullOrUndefined(hyperlinkField) && (isCtrlkeyPressed &&
            this.owner.useCtrlClickToFollowHyperlink || !this.owner.useCtrlClickToFollowHyperlink)) || formField) {
            if (!isNullOrUndefined(formField)) {
                if (this.isFormFillProtectedMode) {
                    div.style.cursor = 'default';
                }
            }
            else {
                div.style.cursor = 'pointer';
            }
            return;
        }
        else if (touchPoint.x >= lineLeft &&
            // tslint:disable-next-line:max-line-length
            event.offsetX < (this.visibleBounds.width - (this.visibleBounds.width - this.viewerContainer.clientWidth)) &&
            // tslint:disable-next-line:max-line-length
            event.offsetY < (this.visibleBounds.height - (this.visibleBounds.height - this.viewerContainer.clientHeight))) {
            if (this.selection.isEmpty) {
                div.style.cursor = 'text';
            }
            else {
                // tslint:disable-next-line:max-line-length
                div.style.cursor = this.selection.checkCursorIsInSelection(widget, touchPoint) ? 'default' : 'text';
            }
        }
        else {
            div.style.cursor = 'default';
        }
        if (!isNullOrUndefined(resizePosition) && resizePosition !== '') {
            if (!this.owner.imageResizerModule.isShapeResize || this.owner.imageResizerModule.isShapeResize && resizePosition !== 'move') {
                div.style.cursor = resizePosition;
            }
        }
        else if (!isNullOrUndefined(widgetInfo) && widgetInfo.isImageSelected && left < touchPoint.x && top < touchPoint.y &&
            left + widget.width > touchPoint.x && top + widget.height > touchPoint.y) {
            div.style.cursor = 'move';
        }
        if (isRowResize) {
            div.style.cursor = 'row-resize';
        }
        else if (isCellResize) {
            div.style.cursor = 'col-resize';
        }
        if (floatItemInfo.isInShapeBorder) {
            div.style.cursor = 'all-scroll';
        }
    };
    return DocumentHelper;
}());
export { DocumentHelper };
var LayoutViewer = /** @class */ (function () {
    function LayoutViewer(owner) {
        /**
         * @private
         */
        this.visiblePages = [];
        /**
         * @private
         */
        this.padding = new Padding(10, 10, 10, 10);
        /**
         * @private
         */
        this.textWrap = true;
        /**
         * @private
         */
        this.pageFitTypeIn = 'None';
        /**
         * @private
         */
        this.containerTop = 0;
        /**
         * @private
         */
        this.containerLeft = 0;
        this.owner = owner;
    }
    Object.defineProperty(LayoutViewer.prototype, "documentHelper", {
        get: function () {
            return this.owner.documentHelper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutViewer.prototype, "pageFitType", {
        /**
         * Gets or sets page fit type.
         * @private
         */
        get: function () {
            return this.pageFitTypeIn;
        },
        set: function (value) {
            this.pageFitTypeIn = value;
            this.onPageFitTypeChanged(this.pageFitTypeIn);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    LayoutViewer.prototype.updateClientArea = function (sectionFormat, page, isRelayout) {
        var width = 0;
        var height = 0;
        if (this instanceof WebLayoutViewer) {
            var top_1 = 0;
            // tslint:disable-next-line:max-line-length
            width = (this.documentHelper.visibleBounds.width - (this.padding.right * 4) - (this.padding.left * 2)) / this.documentHelper.zoomFactor;
            if (width < 0) {
                width = 0;
            }
            height = Number.POSITIVE_INFINITY;
            // tslint:disable-next-line:max-line-length
            this.clientArea = new Rect(this.padding.left / this.documentHelper.zoomFactor, top_1, width, height);
            this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
        }
        else {
            var top_2 = 0;
            var headerDistance = 48;
            var footerDistance = 48;
            var pageHeight = HelperMethods.convertPointToPixel(sectionFormat.pageHeight);
            var bottomMargin = HelperMethods.convertPointToPixel(sectionFormat.bottomMargin);
            if (!isNullOrUndefined(sectionFormat)) {
                top_2 = HelperMethods.convertPointToPixel(sectionFormat.topMargin);
                headerDistance = HelperMethods.convertPointToPixel(sectionFormat.headerDistance);
                footerDistance = HelperMethods.convertPointToPixel(sectionFormat.footerDistance);
            }
            var isEmptyWidget = false;
            if (!isNullOrUndefined(page.headerWidget)) {
                isEmptyWidget = page.headerWidget.isEmpty;
                if (!isEmptyWidget || isEmptyWidget && this.owner.enableHeaderAndFooter) {
                    top_2 = Math.min(Math.max(headerDistance + page.headerWidget.height, top_2), pageHeight / 100 * 40);
                }
            }
            var bottom = 0.667 + bottomMargin;
            if (!isNullOrUndefined(page.footerWidget)) {
                isEmptyWidget = page.footerWidget.isEmpty;
                if (!isEmptyWidget || isEmptyWidget && this.owner.enableHeaderAndFooter) {
                    bottom = 0.667 + Math.min(pageHeight / 100 * 40, Math.max(footerDistance + page.footerWidget.height, bottomMargin));
                }
            }
            if (!isNullOrUndefined(sectionFormat)) {
                width = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
                height = pageHeight - top_2 - bottom;
            }
            if (width < 0) {
                width = 0;
            }
            this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), top_2, width, pageHeight - top_2 - bottom);
            if (isRelayout && page.footnoteWidget) {
                this.clientArea.height -= page.footnoteWidget.height;
            }
            this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
        }
    };
    /**
     * Updates client area left or top position.
     * @private
     */
    LayoutViewer.prototype.updateClientAreaTopOrLeft = function (tableWidget, beforeLayout) {
        if (beforeLayout) {
            this.clientActiveArea.y = this.clientActiveArea.y + tableWidget.topBorderWidth;
            this.clientActiveArea.x = this.clientActiveArea.x + tableWidget.leftBorderWidth;
        }
    };
    /**
     * Updates client area for table.
     * @private
     */
    LayoutViewer.prototype.updateClientAreaForTable = function (tableWidget) {
        this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
        this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
    };
    /**
     * Updates client area for row.
     * @private
     */
    LayoutViewer.prototype.updateClientAreaForRow = function (row, beforeLayout) {
        // tslint:disable-next-line:max-line-length
        var tableWidget = row.ownerTable;
        if (beforeLayout) {
            //tslint:disable:no-empty
        }
        else {
            this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
            this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        }
    };
    /**
     * Updates client area for cell.
     * @private
     */
    LayoutViewer.prototype.updateClientAreaForCell = function (cell, beforeLayout) {
        // tslint:disable-next-line:max-line-length
        var rowWidget = cell.ownerRow;
        var cellWidget = cell;
        if (beforeLayout) {
            this.clientActiveArea.x = this.clientArea.x = cellWidget.x;
            this.clientActiveArea.y = cellWidget.y;
            this.clientActiveArea.width = this.clientArea.width = cellWidget.width > 0 ? cellWidget.width : 0;
            if (this instanceof PageLayoutViewer) {
                this.clientActiveArea.height = Number.POSITIVE_INFINITY;
            }
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        }
        else {
            this.clientActiveArea.x = this.clientArea.x = cellWidget.x + cellWidget.width + cellWidget.margin.right;
            if (rowWidget.x + rowWidget.width - this.clientArea.x < 0) {
                this.clientActiveArea.width = this.clientArea.width = 0;
            }
            else {
                this.clientActiveArea.width = this.clientArea.width = rowWidget.x + rowWidget.width - this.clientArea.x;
            }
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea.y = cellWidget.y - cellWidget.margin.top - HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing);
            if (!cell.ownerTable.isInsideTable) {
                this.clientActiveArea.height = this.clientArea.bottom - rowWidget.y > 0 ? this.clientArea.bottom - rowWidget.y : 0;
            }
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        }
    };
    /**
     * Updates client area for TextBox shape.
     * @private
     */
    LayoutViewer.prototype.updateClientAreaForTextBoxShape = function (textBox, beforeLayout) {
        if (beforeLayout) {
            var marginLeft = HelperMethods.convertPointToPixel(textBox.textFrame.marginLeft);
            var marginRight = HelperMethods.convertPointToPixel(textBox.textFrame.marginRight);
            var marginTop = HelperMethods.convertPointToPixel(textBox.textFrame.marginTop);
            var marginBottom = HelperMethods.convertPointToPixel(textBox.textFrame.marginBottom);
            var width = textBox.width;
            var height = Number.POSITIVE_INFINITY;
            // tslint:disable-next-line:max-line-length
            this.clientArea = new Rect(textBox.x + marginLeft, textBox.y + marginTop, width - marginLeft - marginRight, height - marginTop - marginBottom);
            this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
        }
    };
    /**
    * Updates the client area based on widget.
    * @private
    */
    LayoutViewer.prototype.updateClientAreaByWidgetfootnote = function (widget) {
        this.clientArea.x = widget.x;
        this.clientArea.y = widget.y;
        this.clientActiveArea.x = widget.x;
        this.clientActiveArea.y = widget.y;
    };
    /**
     * Updates the client area based on widget.
     * @private
     */
    LayoutViewer.prototype.updateClientAreaByWidget = function (widget) {
        this.clientArea.x = widget.x;
        this.clientArea.y = widget.y;
        this.clientActiveArea.x = widget.x;
        this.clientActiveArea.y = widget.y;
    };
    //Widget
    /**
     * Updates client area location.
     * @param widget
     * @param area
     * @private
     */
    LayoutViewer.prototype.updateClientAreaLocation = function (widget, area) {
        widget.x = area.x;
        widget.y = area.y;
        widget.width = area.width;
    };
    /**
     * Updates client area for block.
     * @private
     */
    LayoutViewer.prototype.updateClientAreaForBlock = function (block, beforeLayout, tableCollection) {
        var leftIndent = HelperMethods.convertPointToPixel(block.leftIndent);
        var rightIndent = HelperMethods.convertPointToPixel(block.rightIndent);
        var bidi = block.bidi;
        var width = 0;
        if (beforeLayout) {
            if (block instanceof TableWidget && tableCollection) {
                var tableWidget = tableCollection[0];
                this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
                this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
                //Updates the location of last item.
                tableWidget = tableCollection[tableCollection.length - 1];
                tableWidget.x = this.clientActiveArea.x;
                tableWidget.y = this.clientActiveArea.y;
            }
            else {
                // tslint:disable-next-line:max-line-length
                if (block instanceof TableWidget && !isNullOrUndefined(block.tableFormat)) {
                    if (!block.isGridUpdated) {
                        block.buildTableColumns();
                        block.isGridUpdated = true;
                    }
                    var tableAlignment = this.tableAlignmentForBidi(block, bidi);
                    if (tableAlignment !== 'Left') {
                        var tableWidth = 0;
                        // If the grid is calculated, we can direclty get the width from the grid.
                        // Otherwise, calculate the width.
                        tableWidth = HelperMethods.convertPointToPixel(block.tableHolder.getTotalWidth(0));
                        tableWidth = tableWidth === 0 ? block.tableHolder.tableWidth === 0 ?
                            // tslint:disable-next-line:max-line-length
                            block.getTableClientWidth(block.getOwnerWidth(false)) : block.tableHolder.tableWidth : tableWidth;
                        // Fore resizing table, the tableholder table width taken for updated width. 
                        // Since, the columns will be cleared if we performed resizing.
                        if (this.owner.editor && this.owner.editor.tableResize.currentResizingTable === block
                            && this.owner.editor.tableResize.resizerPosition === 0) {
                            tableWidth = HelperMethods.convertPointToPixel(block.tableHolder.tableWidth);
                        }
                        if (tableAlignment === 'Center') {
                            leftIndent = (this.clientArea.width - tableWidth) / 2;
                        }
                        else {
                            leftIndent = this.clientArea.width - tableWidth;
                        }
                        if (bidi) {
                            leftIndent = leftIndent - HelperMethods.convertPointToPixel(block.leftIndent);
                            rightIndent = leftIndent;
                        }
                        if (!block.isInsideTable) {
                            // tslint:disable-next-line:max-line-length
                            //leftIndent = (block.tableFormat.horizontalPositionAbs === 'Left') ? block.tableFormat.horizontalPosition : leftIndent;
                        }
                        this.documentHelper.tableLefts.push(leftIndent);
                    }
                }
                width = this.clientArea.width - (leftIndent + HelperMethods.convertPointToPixel(block.rightIndent));
                this.clientActiveArea.x = this.clientArea.x = this.clientArea.x + (bidi ? rightIndent : leftIndent);
                this.clientActiveArea.width = this.clientArea.width = width > 0 ? width : 0;
            }
        }
        else {
            // Clears table left for table with right or center alignment.
            if (block instanceof TableWidget && !isNullOrUndefined(block.tableFormat)) {
                var tableAlignment = this.tableAlignmentForBidi(block, bidi);
                if (!block.isGridUpdated) {
                    block.buildTableColumns();
                    block.isGridUpdated = true;
                }
                if (tableAlignment !== 'Left' && this.documentHelper.tableLefts.length > 0) {
                    leftIndent = this.documentHelper.tableLefts.pop();
                    if (bidi) {
                        rightIndent = leftIndent;
                    }
                }
            }
            width = this.clientArea.width + leftIndent + HelperMethods.convertPointToPixel(block.rightIndent);
            this.clientActiveArea.width = this.clientArea.width = width > 0 ? width : 0;
            this.clientActiveArea.x = this.clientArea.x = this.clientArea.x - (bidi ? rightIndent : leftIndent);
        }
        this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
        // tslint:disable-next-line:max-line-length
        this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
    };
    LayoutViewer.prototype.tableAlignmentForBidi = function (block, bidi) {
        var tableAlignment = block.tableFormat.tableAlignment;
        if (bidi) {
            if (tableAlignment === 'Left') {
                tableAlignment = 'Right';
            }
            else if (tableAlignment === 'Right') {
                tableAlignment = 'Left';
            }
        }
        return tableAlignment;
    };
    /**
     * Updates client active area left.
     * @private
     */
    LayoutViewer.prototype.cutFromLeft = function (x) {
        if (x < this.clientActiveArea.x) {
            x = this.clientActiveArea.x;
        }
        if (x > this.clientActiveArea.right && this.textWrap) {
            x = this.clientActiveArea.right;
        }
        this.clientActiveArea.width = this.clientActiveArea.right > x ? this.clientActiveArea.right - x : 0;
        this.clientActiveArea.x = x;
    };
    /**
     * Updates client active area top.
     * @private
     */
    LayoutViewer.prototype.cutFromTop = function (y) {
        if (y < this.clientActiveArea.y) {
            y = this.clientActiveArea.y;
        }
        if (y > this.clientActiveArea.bottom) {
            y = this.clientActiveArea.bottom;
        }
        this.clientActiveArea.height = this.clientActiveArea.bottom - y;
        this.clientActiveArea.x = this.clientArea.x;
        this.clientActiveArea.width = this.clientArea.width;
        this.clientActiveArea.y = y;
    };
    /**
     * Updates client width.
     * @private
     */
    LayoutViewer.prototype.updateClientWidth = function (width) {
        this.clientActiveArea.x -= width;
        if (this.clientActiveArea.width + width > 0) {
            this.clientActiveArea.width += width;
        }
        else {
            this.clientActiveArea.width = 0;
        }
    };
    /**
     * Finds focused page.
     * @private
     */
    LayoutViewer.prototype.findFocusedPage = function (currentPoint, updateCurrentPage) {
        var point = new Point(currentPoint.x, currentPoint.y);
        point.x += this.documentHelper.viewerContainer.scrollLeft;
        point.y += this.documentHelper.viewerContainer.scrollTop;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            var page = this.documentHelper.pages[i];
            // tslint:disable-next-line:max-line-length
            var pageTop = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.documentHelper.zoomFactor + this.pageGap * (i + 1);
            var pageHeight = (page.boundingRectangle.height * this.documentHelper.zoomFactor) + this.pageGap;
            var pageLeft = page.boundingRectangle.x;
            var pageRight = void 0;
            if (this instanceof PageLayoutViewer) {
                pageRight = ((page.boundingRectangle.right - pageLeft) * this.documentHelper.zoomFactor) + pageLeft;
            }
            else {
                pageRight = page.boundingRectangle.right + pageLeft;
            }
            if (pageTop <= point.y && pageTop + pageHeight >= point.y) {
                if (updateCurrentPage) {
                    this.documentHelper.currentPage = page;
                }
                point.y = (point.y - (pageTop)) / this.documentHelper.zoomFactor;
                if (point.x > pageRight) {
                    point.x = page.boundingRectangle.right;
                }
                else if (point.x < pageLeft) {
                    point.x = 0;
                }
                else {
                    point.x = (point.x - pageLeft) / this.documentHelper.zoomFactor;
                }
                return point;
            }
        }
        return point;
    };
    /**
     * @private
     */
    LayoutViewer.prototype.getPageHeightAndWidth = function (height, width, viewerWidth, viewerHeight) {
        height = 0;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            height = height + this.documentHelper.pages[i].boundingRectangle.height;
        }
        width = 0;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            if (width < this.documentHelper.pages[i].boundingRectangle.width) {
                width = this.documentHelper.pages[i].boundingRectangle.width;
            }
        }
        //this.documentHelper.visibleBoundsIn = new Rect(0, 0, width, height);
        viewerWidth = this.documentHelper.visibleBounds.width;
        viewerHeight = this.documentHelper.visibleBounds.height;
        return {
            'height': height,
            'width': width,
            'viewerWidth': viewerWidth,
            'viewerHeight': viewerHeight
        };
    };
    /**
     * Renders visible pages.
     * @private
     */
    LayoutViewer.prototype.renderVisiblePages = function () {
        if (isNullOrUndefined(this.visiblePages) || this.visiblePages.length < 1) {
            return;
        }
        this.documentHelper.clearContent();
        for (var i = 0; i < this.visiblePages.length; i++) {
            var page = this.visiblePages[i];
            var width = page.boundingRectangle.width * this.documentHelper.zoomFactor;
            var height = page.boundingRectangle.height * this.documentHelper.zoomFactor;
            var x = page.boundingRectangle.x;
            var y = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.documentHelper.zoomFactor + this.pageGap * (i + 1);
            this.owner.viewer.renderPage(page, x, y, width, height);
        }
    };
    // tslint:disable:max-func-body-length
    LayoutViewer.prototype.handleZoom = function () {
        var prevScaleFactor = this.documentHelper.preZoomFactor;
        var page = null;
        var verticalHeight = 0;
        var scrollToPosition = false;
        if (this.documentHelper.selection && isNullOrUndefined(this.documentHelper.zoomX && isNullOrUndefined(this.documentHelper.zoomY))) {
            var x = 0;
            var y = 0;
            var endPage = this.documentHelper.selection.getPage(this.documentHelper.selection.end.currentWidget.paragraph);
            x = (this.documentHelper.visibleBounds.width - endPage.boundingRectangle.width * prevScaleFactor) / 2;
            if (x < 30) {
                x = 30;
            }
            // tslint:disable-next-line:max-line-length
            y = endPage.boundingRectangle.y * prevScaleFactor + (this.documentHelper.pages.indexOf(endPage) + 1) * this.pageGap * (1 - prevScaleFactor);
            var caretInfo = this.documentHelper.selection.updateCaretSize(this.owner.selection.end, true);
            var topMargin = caretInfo.topMargin;
            var caretHeight = caretInfo.height;
            x += (this.documentHelper.selection.end.location.x) * prevScaleFactor;
            y += (this.documentHelper.selection.end.location.y + topMargin) * prevScaleFactor;
            if (x >= this.containerLeft && x <= this.documentHelper.visibleBounds.width &&
                y >= this.containerTop && y <= this.containerTop + this.documentHelper.visibleBounds.height) {
                scrollToPosition = true;
            }
        }
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            verticalHeight = verticalHeight + this.documentHelper.pages[i].boundingRectangle.height;
        }
        var horizontalWidth = 0;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            if (horizontalWidth < this.documentHelper.pages[i].boundingRectangle.width) {
                horizontalWidth = this.documentHelper.pages[i].boundingRectangle.width;
            }
        }
        // tslint:disable-next-line:max-line-length
        var height = (verticalHeight * this.documentHelper.zoomFactor + (this.documentHelper.pages.length + 1) * this.pageGap * (1 - this.documentHelper.zoomFactor)) - this.documentHelper.visibleBounds.height;
        var horWidth = horizontalWidth * this.documentHelper.zoomFactor - this.documentHelper.visibleBounds.width;
        if (this.documentHelper.visibleBounds.width - horizontalWidth * this.documentHelper.zoomFactor < 60) {
            horWidth += 60;
        }
        //Update Vertical Scroll bar
        if (height > 0) {
            var value = this.containerTop;
            if (this.visiblePages.length > 0) {
                page = this.visiblePages[0];
                // tslint:disable-next-line:max-line-length
                var prevPageTop = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * prevScaleFactor + (page.index + 1) * this.pageGap;
                var zoomY = this.documentHelper.zoomY;
                if (isNullOrUndefined) {
                    zoomY = this.documentHelper.visibleBounds.height / 2;
                }
                var prevY = value + zoomY;
                while (prevY > prevPageTop + (page.boundingRectangle.height * prevScaleFactor)) {
                    var pageIndex = page.index + 1;
                    if (pageIndex === this.documentHelper.pages.length) {
                        break;
                    }
                    page = this.documentHelper.pages[pageIndex];
                    // tslint:disable-next-line:max-line-length
                    prevPageTop = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * prevScaleFactor + (page.index + 1) * this.pageGap;
                }
                // tslint:disable-next-line:max-line-length
                var currentY = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * this.documentHelper.zoomFactor + (page.index + 1) * this.pageGap
                    + ((prevY - prevPageTop) < 0 ? prevY - prevPageTop : (prevY - prevPageTop) * (this.documentHelper.zoomFactor / prevScaleFactor));
                value = currentY - zoomY;
                zoomY = this.documentHelper.visibleBounds.height / 2;
            }
            this.documentHelper.viewerContainer.scrollTop = value;
        }
        else {
            this.documentHelper.viewerContainer.scrollTop = 0;
        }
        // update Horizontal Scroll Bar
        if (horWidth > 0) {
            var value = this.containerLeft;
            if (this.visiblePages.length > 0) {
                if (page === null) {
                    page = this.visiblePages[0];
                }
                var zoomX = this.documentHelper.zoomX;
                if (isNullOrUndefined(zoomX)) {
                    zoomX = this.documentHelper.visibleBounds.width / 2;
                }
                var prevValue = (page.boundingRectangle.width * prevScaleFactor) / page.boundingRectangle.width;
                var prevX = value + zoomX;
                // tslint:disable-next-line:max-line-length
                var currentX = page.boundingRectangle.x
                    + ((prevX - page.boundingRectangle.x) < 0 ? prevX - page.boundingRectangle.x : (prevX - page.boundingRectangle.x) * (this.documentHelper.zoomFactor / prevValue));
                value = currentX - zoomX;
                zoomX = this.documentHelper.visibleBounds.width / 2;
            }
            this.documentHelper.viewerContainer.scrollLeft = value;
        }
        else {
            this.documentHelper.viewerContainer.scrollLeft = 0;
        }
        this.updateScrollBars();
        if (scrollToPosition) {
            this.documentHelper.scrollToPosition(this.documentHelper.selection.start, this.documentHelper.selection.end);
        }
        if (this instanceof WebLayoutViewer) {
            this.owner.editorModule.layoutWholeDocument();
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    LayoutViewer.prototype.updateCanvasWidthAndHeight = function (viewerWidth, viewerHeight, containerHeight, containerWidth, width, height) {
        if (this instanceof PageLayoutViewer) {
            if (this.documentHelper.visibleBounds.width !== this.documentHelper.viewerContainer.clientWidth) {
                viewerWidth -= (this.documentHelper.visibleBounds.width - this.documentHelper.viewerContainer.clientWidth);
            }
            else if (containerHeight > viewerHeight) {
                viewerWidth -= this.documentHelper.viewerContainer.offsetWidth - this.documentHelper.viewerContainer.clientWidth;
            }
        }
        else {
            if (containerHeight > viewerHeight) {
                viewerWidth -= this.documentHelper.scrollbarWidth;
                containerWidth -= this.documentHelper.scrollbarWidth;
            }
        }
        if (containerWidth > viewerWidth) {
            viewerHeight -= this.documentHelper.scrollbarWidth;
        }
        width = containerWidth > viewerWidth ? containerWidth : viewerWidth;
        height = containerHeight > viewerHeight ? containerHeight : viewerHeight;
        if (parseInt(this.documentHelper.pageContainer.style.width.replace('px', ''), 10) !== width ||
            parseInt(this.documentHelper.pageContainer.style.height.replace('px', ''), 10) !== width) {
            this.documentHelper.pageContainer.style.width = width.toString() + 'px';
            this.documentHelper.pageContainer.style.height = height.toString() + 'px';
        }
        // if (!isNullOrUndefined(this.selection) && !this.selection.isEmpty) {
        //     this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        var displayPixelRatio = Math.max(1, window.devicePixelRatio || 1);
        if (this.documentHelper.containerCanvas.width !== Math.floor(viewerWidth * displayPixelRatio)
            || this.documentHelper.containerCanvas.height !== Math.floor(viewerHeight * displayPixelRatio)) {
            this.documentHelper.containerCanvas.width = viewerWidth * displayPixelRatio;
            this.documentHelper.containerCanvas.height = viewerHeight * displayPixelRatio;
            this.documentHelper.containerCanvas.style.width = viewerWidth + 'px';
            this.documentHelper.containerCanvas.style.height = viewerHeight + 'px';
            this.documentHelper.containerContext.scale(displayPixelRatio, displayPixelRatio);
            this.documentHelper.selectionCanvas.width = viewerWidth * displayPixelRatio;
            this.documentHelper.selectionCanvas.height = viewerHeight * displayPixelRatio;
            this.documentHelper.selectionCanvas.style.width = viewerWidth + 'px';
            this.documentHelper.selectionCanvas.style.height = viewerHeight + 'px';
            this.documentHelper.selectionContext.scale(displayPixelRatio, displayPixelRatio);
        }
        return {
            'height': height,
            'width': width,
            'viewerWidth': viewerWidth,
            'viewerHeight': viewerHeight,
            'containerHeight': containerHeight,
            'containerWidth': containerWidth
        };
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    LayoutViewer.prototype.updateScrollBarPosition = function (containerWidth, containerHeight, viewerWidth, viewerHeight, width, height) {
        this.owner.viewer.containerTop = this.documentHelper.viewerContainer.scrollTop;
        this.documentHelper.containerCanvas.style.position = 'absolute';
        this.documentHelper.containerCanvas.style.top = this.owner.viewer.containerTop.toString() + 'px';
        this.documentHelper.selectionCanvas.style.position = 'absolute';
        this.documentHelper.selectionCanvas.style.top = this.owner.viewer.containerTop.toString() + 'px';
        this.owner.viewer.containerLeft = this.documentHelper.viewerContainer.scrollLeft;
        this.documentHelper.containerCanvas.style.left = this.owner.viewer.containerLeft + 'px';
        this.documentHelper.selectionCanvas.style.left = this.owner.viewer.containerLeft + 'px';
    };
    LayoutViewer.prototype.destroy = function () {
        this.clientArea = undefined;
        this.clientActiveArea = undefined;
    };
    return LayoutViewer;
}());
export { LayoutViewer };
/**
 * @private
 */
var PageLayoutViewer = /** @class */ (function (_super) {
    __extends(PageLayoutViewer, _super);
    /**
     * Initialize the constructor of PageLayoutViewer
     */
    function PageLayoutViewer(owner) {
        var _this = _super.call(this, owner) || this;
        _this.pageLeft = 30;
        // if (isNullOrUndefined(owner) || isNullOrUndefined(owner.element)) {
        //     return;
        // }
        _this.owner = owner;
        return _this;
    }
    Object.defineProperty(PageLayoutViewer.prototype, "pageGap", {
        /**
         * @private
         */
        get: function () {
            return this.owner.pageGap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageLayoutViewer.prototype, "documentHelper", {
        get: function () {
            return this.owner.documentHelper;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates new page.
     * @private
     */
    PageLayoutViewer.prototype.createNewPage = function (section, index) {
        var viewer = this;
        var yPos = this.pageGap;
        if (this.documentHelper.pages.length > 0) {
            yPos = this.documentHelper.pages[this.documentHelper.pages.length - 1].boundingRectangle.bottom + this.pageGap;
        }
        var page = new Page(this.documentHelper);
        this.updatePageBoundingRectange(section, page, yPos);
        if (isNullOrUndefined(index)) {
            this.documentHelper.pages.push(page);
        }
        else {
            this.documentHelper.pages.splice(index, 0, page);
        }
        this.updateClientArea(section.sectionFormat, page);
        page.bodyWidgets.push(section);
        page.bodyWidgets[page.bodyWidgets.length - 1].page = page;
        this.documentHelper.layout.layoutHeaderFooter(section, viewer, page);
        this.updateClientArea(section.sectionFormat, page);
        return page;
    };
    /**
     * @private
     */
    PageLayoutViewer.prototype.updatePageBoundingRectange = function (section, page, yPos) {
        //page.viewer = this;
        // tslint:disable-next-line:max-line-length
        var pageWidth = !isNullOrUndefined(section.sectionFormat) ? HelperMethods.convertPointToPixel(section.sectionFormat.pageWidth) : 816;
        // tslint:disable-next-line:max-line-length
        var pageHeight = !isNullOrUndefined(section.sectionFormat) ? HelperMethods.convertPointToPixel(section.sectionFormat.pageHeight) : 1056;
        var xPos = (this.documentHelper.visibleBounds.width - pageWidth * this.documentHelper.zoomFactor) / 2;
        if (xPos < this.pageLeft) {
            xPos = this.pageLeft;
        }
        page.boundingRectangle = new Rect(xPos, yPos, pageWidth, pageHeight);
    };
    /**
     * Fired when page fit type changed.
     * @private
     */
    PageLayoutViewer.prototype.onPageFitTypeChanged = function (pageFitType) {
        var width = this.documentHelper.visibleBounds.width;
        var height = this.documentHelper.visibleBounds.height;
        var section = this.visiblePages[0].bodyWidgets[0];
        var pageWidth = HelperMethods.convertPointToPixel(section.sectionFormat.pageWidth);
        var pageHeight = HelperMethods.convertPointToPixel(section.sectionFormat.pageHeight);
        switch (pageFitType) {
            case 'FitOnePage':
                if (height > 0 && pageHeight > 0) {
                    // tslint:disable-next-line:max-line-length
                    var zoomFactor = (this.documentHelper.visibleBounds.height - 2 * this.pageGap - (this.pageGap - 2)) / pageHeight;
                    if (zoomFactor === this.documentHelper.zoomFactor) {
                        if (!isNullOrUndefined(this.owner.selection) && !isNullOrUndefined(this.owner.selection.start) &&
                            !isNullOrUndefined(this.owner.selection.end)) {
                            this.documentHelper.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
                        }
                    }
                    else {
                        this.documentHelper.zoomFactor = zoomFactor;
                    }
                }
                break;
            case 'FitPageWidth':
                if (width > 0 && pageWidth > 0) {
                    this.documentHelper.zoomFactor = (this.documentHelper.visibleBounds.width - 80) / pageWidth;
                }
                break;
            default:
                this.documentHelper.zoomFactor = 100 / 100;
                break;
        }
    };
    /**
     * Gets current page header footer.
     * @private
     */
    PageLayoutViewer.prototype.getCurrentPageHeaderFooter = function (section, isHeader) {
        return this.getCurrentHeaderFooter(this.getHeaderFooterType(section, isHeader), section.index);
    };
    /**
     * Get header footer type
     * @private
     */
    PageLayoutViewer.prototype.getHeaderFooterType = function (section, isHeader) {
        var type;
        type = isHeader ? 'OddHeader' : 'OddFooter';
        var page = section.page;
        // tslint:disable-next-line:max-line-length
        if (section.sectionFormat.differentFirstPage && (isNullOrUndefined(page.previousPage) || page.sectionIndex !== page.previousPage.sectionIndex)) {
            type = isHeader ? 'FirstPageHeader' : 'FirstPageFooter';
        }
        else if (section.sectionFormat.differentOddAndEvenPages && this.documentHelper.pages.length % 2 === 0) {
            type = isHeader ? 'EvenHeader' : 'EvenFooter';
        }
        return type;
    };
    /**
     * Gets current header footer.
     * @param type
     * @param section
     * @private
     */
    PageLayoutViewer.prototype.getCurrentHeaderFooter = function (type, sectionIndex) {
        if (this.documentHelper.headersFooters[sectionIndex]) {
            var index = this.getHeaderFooter(type);
            var headerFooter = this.documentHelper.headersFooters[sectionIndex][index];
            if (!headerFooter) {
                var currentSecIndex = sectionIndex > 0 ? sectionIndex - 1 : sectionIndex;
                while (!headerFooter && currentSecIndex !== -1 && this.documentHelper.headersFooters[currentSecIndex][index]) {
                    headerFooter = this.documentHelper.headersFooters[currentSecIndex][index];
                    currentSecIndex--;
                }
                if (!headerFooter) {
                    headerFooter = this.createHeaderFooterWidget(type);
                    headerFooter.isEmpty = true;
                }
                this.documentHelper.headersFooters[sectionIndex][index] = headerFooter;
            }
            return headerFooter;
        }
        else if (sectionIndex > 0) {
            return this.getCurrentHeaderFooter(type, sectionIndex - 1);
        }
        return undefined;
    };
    PageLayoutViewer.prototype.createHeaderFooterWidget = function (type) {
        var headerFooter = new HeaderFooterWidget(type);
        var paragraph = new ParagraphWidget();
        paragraph.childWidgets.push(new LineWidget(paragraph));
        return headerFooter;
    };
    /**
     * Gets header footer.
     * @param type
     * @private
     */
    PageLayoutViewer.prototype.getHeaderFooter = function (type) {
        switch (type) {
            case 'OddHeader':
                return 0;
            case 'OddFooter':
                return 1;
            case 'EvenHeader':
                return 2;
            case 'EvenFooter':
                return 3;
            case 'FirstPageHeader':
                return 4;
            case 'FirstPageFooter':
                return 5;
        }
    };
    /**
     * Updates header footer client area.
     * @private
     */
    PageLayoutViewer.prototype.updateHFClientArea = function (sectionFormat, isHeader) {
        // tslint:disable-next-line:max-line-length
        var width = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
        if (width < 0) {
            width = 0;
        }
        if (isHeader) {
            // tslint:disable-next-line:max-line-length
            this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), HelperMethods.convertPointToPixel(sectionFormat.headerDistance), width, Number.POSITIVE_INFINITY);
        }
        else {
            // tslint:disable-next-line:max-line-length
            this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), HelperMethods.convertPointToPixel(sectionFormat.pageHeight - sectionFormat.footerDistance), width, Number.POSITIVE_INFINITY);
        }
        this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
    };
    /**
     * @private
     */
    PageLayoutViewer.prototype.updateHCFClientAreaWithTop = function (sectionFormat, isHeader, page) {
        this.updateHFClientArea(sectionFormat, isHeader);
        if (!isHeader) {
            if (page.footerWidget.y < this.clientActiveArea.y) {
                this.clientActiveArea.y = page.footerWidget.y;
                this.clientActiveArea.height = Number.POSITIVE_INFINITY;
            }
        }
    };
    PageLayoutViewer.prototype.updateFooterWidgetTop = function () {
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    PageLayoutViewer.prototype.updateFootnoteClientArea = function (sectionFormat, footnote, footnotetype, para) {
        var width = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
        // tslint:disable-next-line:max-line-length
        this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), HelperMethods.convertPointToPixel(sectionFormat.pageHeight - sectionFormat.bottomMargin) - footnote.height, width, footnote.height);
        this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, footnote.height);
    };
    /**
     * Scrolls to the specified page
     * @private
     */
    PageLayoutViewer.prototype.scrollToPage = function (pageIndex) {
        var top = 0;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            top = this.documentHelper.pages[i].boundingRectangle.y - (this.pageGap / 2);
            if (i === pageIndex) {
                break;
            }
        }
        this.documentHelper.viewerContainer.scrollTop = top;
        this.updateScrollBars();
    };
    /**
     * Updates scroll bars.
     * @private
     */
    PageLayoutViewer.prototype.updateScrollBars = function () {
        var updatePositionObj;
        updatePositionObj = this.getPageHeightAndWidth(0, 0, 0, 0);
        // tslint:disable-next-line:max-line-length
        var containerWidth = (updatePositionObj.width * this.documentHelper.zoomFactor) + (this.pageLeft * 2);
        // tslint:disable-next-line:max-line-length
        var containerHeight = (updatePositionObj.height * this.documentHelper.zoomFactor) + (this.documentHelper.pages.length + 1) * this.pageGap;
        var updateObj;
        // tslint:disable-next-line:max-line-length
        updateObj = this.updateCanvasWidthAndHeight(updatePositionObj.viewerWidth, updatePositionObj.viewerHeight, containerHeight, containerWidth, updatePositionObj.width, updatePositionObj.height);
        containerHeight = updateObj.containerHeight;
        containerWidth = updateObj.containerWidth;
        this.documentHelper.containerContext.globalAlpha = 1;
        this.documentHelper.selectionContext.globalAlpha = 0.4;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            // tslint:disable-next-line:max-line-length
            var left = (updateObj.width - this.documentHelper.pages[i].boundingRectangle.width * this.documentHelper.zoomFactor) / 2;
            if (left > this.pageLeft) {
                // tslint:disable-next-line:max-line-length
                this.documentHelper.pages[i].boundingRectangle = new Rect(left, this.documentHelper.pages[i].boundingRectangle.y, this.documentHelper.pages[i].boundingRectangle.width, this.documentHelper.pages[i].boundingRectangle.height);
            }
            else {
                // tslint:disable-next-line:max-line-length
                this.documentHelper.pages[i].boundingRectangle = new Rect(this.pageLeft, this.documentHelper.pages[i].boundingRectangle.y, this.documentHelper.pages[i].boundingRectangle.width, this.documentHelper.pages[i].boundingRectangle.height);
            }
        }
        // tslint:disable-next-line:max-line-length
        this.updateScrollBarPosition(containerWidth, containerHeight, updateObj.viewerWidth, updateObj.viewerHeight, updateObj.width, updateObj.height);
        this.updateVisiblePages();
        this.documentHelper.isScrollToSpellCheck = false;
    };
    /**
     * Updates visible pages.
     * @private
     */
    PageLayoutViewer.prototype.updateVisiblePages = function () {
        // Clears the container first.
        this.visiblePages = [];
        var height = this.documentHelper.visibleBounds.height;
        var vertical = this.documentHelper.viewerContainer.scrollTop;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            var page = this.documentHelper.pages[i];
            var y = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.documentHelper.zoomFactor + this.pageGap * (i + 1);
            var pageH = page.boundingRectangle.height * this.documentHelper.zoomFactor;
            var left = page.boundingRectangle.x;
            var isTopFit = y >= vertical && y <= vertical + height;
            var isBottomFit = y + pageH >= vertical && y + pageH <= vertical + height;
            var isMiddleFit = y <= vertical && y + pageH >= vertical + height;
            //UI Virtualization
            if (isTopFit || isBottomFit || isMiddleFit) {
                this.addVisiblePage(page, left, y);
            }
        }
    };
    /**
     * Adds visible pages.
     */
    PageLayoutViewer.prototype.addVisiblePage = function (page, x, y) {
        var _this = this;
        var width = page.boundingRectangle.width * this.documentHelper.zoomFactor;
        var height = page.boundingRectangle.height * this.documentHelper.zoomFactor;
        // tslint:disable-next-line:max-line-length
        if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.currentPage !== undefined && this.owner.imageResizerModule.currentPage === page && this.owner.imageResizerModule.isImageResizerVisible) {
            this.owner.imageResizerModule.setImageResizerPositions(x, y, width, height);
        }
        this.visiblePages.push(page);
        // tslint:disable-next-line:max-line-length
        if (this.owner.isSpellCheck && this.owner.spellChecker.enableOptimizedSpellCheck && (this.documentHelper.triggerElementsOnLoading || this.documentHelper.isScrollHandler) && this.documentHelper.cachedPages.indexOf(page.index) < 0) {
            page.allowNextPageRendering = false;
            this.documentHelper.cachedPages.push(page.index);
            var content = this.owner.spellChecker.getPageContent(page);
            if (content.trim().length > 0) {
                // tslint:disable-next-line:max-line-length
                /* tslint:disable:no-any */
                this.owner.spellChecker.CallSpellChecker(this.owner.spellChecker.languageID, content, true, false, false, true).then(function (data) {
                    /* tslint:disable:no-any */
                    var jsonObject = JSON.parse(data);
                    _this.owner.spellChecker.updateUniqueWords(jsonObject.SpellCollection);
                    page.allowNextPageRendering = true;
                    _this.documentHelper.triggerSpellCheck = true;
                    _this.renderPage(page, x, y, width, height);
                    _this.documentHelper.triggerSpellCheck = false;
                    _this.documentHelper.triggerElementsOnLoading = false;
                });
            }
            else {
                this.renderPage(page, x, y, width, height);
            }
        }
        else {
            this.renderPage(page, x, y, width, height);
        }
    };
    /**
     * Render specified page widgets.
     * @private
     */
    PageLayoutViewer.prototype.renderPage = function (page, x, y, width, height) {
        // tslint:disable-next-line:max-line-length
        this.documentHelper.render.renderWidgets(page, x - this.owner.viewer.containerLeft, y - this.owner.viewer.containerTop, width, height);
    };
    return PageLayoutViewer;
}(LayoutViewer));
export { PageLayoutViewer };
var WebLayoutViewer = /** @class */ (function (_super) {
    __extends(WebLayoutViewer, _super);
    function WebLayoutViewer(owner) {
        var _this = _super.call(this, owner) || this;
        /**
         * @private
         */
        _this.visiblePages = [];
        /* if (isNullOrUndefined(owner) || isNullOrUndefined(owner.element)) {
             return;
         }*/
        _this.owner = owner;
        return _this;
    }
    Object.defineProperty(WebLayoutViewer.prototype, "documentHelper", {
        get: function () {
            return this.owner.documentHelper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebLayoutViewer.prototype, "pageGap", {
        /**
         * @private
         */
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates new page.
     * @private
     */
    WebLayoutViewer.prototype.createNewPage = function (section, index) {
        var page;
        var yPos = 0;
        var x = 10;
        if (this.documentHelper.pages.length > 0) {
            yPos = this.documentHelper.pages[this.documentHelper.pages.length - 1].boundingRectangle.bottom;
        }
        page = new Page(this.documentHelper);
        if (this.documentHelper.pages.length === 0) {
            // tslint:disable-next-line:max-line-length
            page.boundingRectangle = new Rect(x, yPos, this.documentHelper.visibleBounds.width, this.documentHelper.visibleBounds.height);
        }
        else {
            // tslint:disable-next-line:max-line-length
            page.boundingRectangle = new Rect(x, yPos - 20, this.documentHelper.visibleBounds.width, this.documentHelper.visibleBounds.height);
        }
        this.documentHelper.pages.push(page);
        this.updateClientArea(undefined, page);
        page.bodyWidgets.push(section);
        page.bodyWidgets[page.bodyWidgets.length - 1].page = page;
        return page;
    };
    WebLayoutViewer.prototype.onPageFitTypeChanged = function (pageFitType) {
        this.documentHelper.zoomFactor = 1;
    };
    WebLayoutViewer.prototype.scrollToPage = function (pageIndex) {
        this.updateScrollBars();
    };
    WebLayoutViewer.prototype.getContentHeight = function () {
        var height = 0;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            var page = this.documentHelper.pages[i];
            if (i === 0) {
                height += this.padding.top;
                page.boundingRectangle.y = this.padding.top;
            }
            else {
                page.boundingRectangle.y = this.documentHelper.pages[i - 1].boundingRectangle.bottom;
            }
            page.boundingRectangle.height = page.bodyWidgets[0].height;
            height += page.bodyWidgets[0].height;
            if (i === this.documentHelper.pages.length - 1) {
                height += this.padding.bottom;
            }
        }
        return height;
    };
    /**
     * @private
     */
    WebLayoutViewer.prototype.getContentWidth = function () {
        var width = this.documentHelper.visibleBounds.width;
        var currentWidth = width;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            var page = this.documentHelper.pages[i];
            for (var j = 0; j < page.bodyWidgets[0].childWidgets.length; j++) {
                if (page.bodyWidgets[0].childWidgets[j] instanceof TableWidget) {
                    var tableWidget = page.bodyWidgets[0].childWidgets[j];
                    // tslint:disable-next-line:max-line-length
                    var tableWidth = HelperMethods.convertPointToPixel(tableWidget.getTableWidth()) *
                        this.documentHelper.zoomFactor + this.padding.left * 4 + this.padding.right * 4
                        + page.boundingRectangle.x;
                    if (currentWidth < tableWidth) {
                        width = tableWidth;
                        currentWidth = tableWidth;
                    }
                }
            }
            page.boundingRectangle.width = width;
        }
        return width;
    };
    WebLayoutViewer.prototype.updateScrollBars = function () {
        var updatePositionObj;
        updatePositionObj = this.getPageHeightAndWidth(0, 0, 0, 0);
        var containerWidth = this.getContentWidth();
        /* tslint:disable-next-line:max-line-length */
        var containerHeight = this.getContentHeight() * this.documentHelper.zoomFactor + this.padding.top + this.padding.bottom;
        var updateObj;
        // tslint:disable-next-line:max-line-length
        updateObj = this.updateCanvasWidthAndHeight(updatePositionObj.viewerWidth, updatePositionObj.viewerHeight, containerHeight, containerWidth, updatePositionObj.width, updatePositionObj.height);
        // tslint:disable-next-line:max-line-length
        this.documentHelper.containerContext.globalAlpha = 1;
        this.documentHelper.selectionContext.globalAlpha = 0.4;
        // tslint:disable-next-line:max-line-length
        this.updateScrollBarPosition(containerWidth, containerHeight, updateObj.viewerWidth, updateObj.viewerHeight, updateObj.width, updateObj.height);
        this.updateVisiblePages();
        this.documentHelper.isScrollToSpellCheck = false;
    };
    WebLayoutViewer.prototype.updateVisiblePages = function () {
        this.visiblePages = [];
        var page;
        var y;
        var height = this.documentHelper.visibleBounds.height;
        var vertical = this.documentHelper.viewerContainer.scrollTop;
        for (var i = 0; i < this.documentHelper.pages.length; i++) {
            page = this.documentHelper.pages[i];
            y = (page.boundingRectangle.y) * this.documentHelper.zoomFactor;
            var pageH = page.boundingRectangle.height * this.documentHelper.zoomFactor;
            var isTopFit = y >= vertical && y <= vertical + height;
            var isBottomFit = y + pageH >= vertical && y + pageH <= vertical + height;
            var isMiddleFit = y <= vertical && y + pageH >= vertical + height;
            //UI Virtualization
            if (isTopFit || isBottomFit || isMiddleFit) {
                this.addVisiblePage(page, this.padding.left, y);
            }
        }
    };
    WebLayoutViewer.prototype.addVisiblePage = function (page, x, y) {
        var _this = this;
        var width = this.getContentWidth();
        // tslint:disable-next-line:max-line-length
        var height = this.getContentHeight() * this.documentHelper.zoomFactor + this.padding.top + this.padding.bottom;
        if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.currentPage !== undefined && this.owner.imageResizerModule.currentPage === page && this.owner.imageResizerModule.isImageResizerVisible) {
            this.owner.imageResizerModule.setImageResizerPositions(x, y, width, height);
        }
        this.visiblePages.push(page);
        // tslint:disable-next-line:max-line-length
        if (this.documentHelper.owner.isSpellCheck && this.documentHelper.owner.spellChecker.enableOptimizedSpellCheck && (this.owner.documentHelper.triggerElementsOnLoading || this.owner.documentHelper.isScrollHandler) && this.documentHelper.cachedPages.indexOf(page.index) < 0) {
            page.allowNextPageRendering = false;
            this.owner.documentHelper.cachedPages.push(page.index);
            var contentlen = this.documentHelper.owner.spellChecker.getPageContent(page);
            if (contentlen.trim().length > 0) {
                // tslint:disable-next-line:max-line-length
                /* tslint:disable:no-any */
                this.owner.spellChecker.CallSpellChecker(this.owner.spellChecker.languageID, contentlen, true, false, false, true).then(function (data) {
                    /* tslint:disable:no-any */
                    var jsonObj = JSON.parse(data);
                    _this.owner.spellChecker.updateUniqueWords(jsonObj.SpellCollection);
                    page.allowNextPageRendering = true;
                    _this.owner.documentHelper.triggerSpellCheck = true;
                    _this.renderPage(page, x, y, width, height);
                    _this.owner.documentHelper.triggerSpellCheck = false;
                    _this.owner.documentHelper.triggerElementsOnLoading = false;
                });
            }
            else {
                this.renderPage(page, x, y, width, height);
            }
        }
        else {
            this.renderPage(page, x, y, width, height);
        }
    };
    /**
     * @private
     */
    WebLayoutViewer.prototype.renderPage = function (page, x, y, width, height) {
        // tslint:disable-next-line:max-line-length
        this.documentHelper.render.renderWidgets(page, x - this.owner.viewer.containerLeft, y - this.owner.viewer.containerTop, width, height);
    };
    return WebLayoutViewer;
}(LayoutViewer));
export { WebLayoutViewer };
