import { AnnotationDataFormat } from '../index';
import { createElement, Browser, isBlazor } from '@syncfusion/ej2-base';
import { Toolbar as Tool, ContextMenu as Context } from '@syncfusion/ej2-navigations';
import { Tooltip } from '@syncfusion/ej2-popups';
import { Toast } from '@syncfusion/ej2-notifications';
/**
 * The `NavigationPane` module is used to handle navigation pane for thumbnail and bookmark navigation of PDF viewer.
 * @hidden
 */
var NavigationPane = /** @class */ (function () {
    /**
     * @private
     */
    function NavigationPane(viewer, base) {
        var _this = this;
        this.thumbnailWidthMin = 200;
        this.contentContainerScrollWidth = 33;
        this.closeButtonLeft = 170;
        this.isTooltipCreated = false;
        this.isThumbnail = false;
        this.annotationContextMenu = [];
        this.isCommentPanelShow = false;
        this.commentPanelWidthMin = 300;
        /**
         * @private
         */
        this.isNavigationToolbarVisible = false;
        /**
         * @private
         */
        this.isBookmarkListOpen = false;
        /**
         * @private
         */
        this.isNavigationPaneResized = false;
        /**
         * @private
         */
        this.isBookmarkOpen = false;
        /**
         * @private
         */
        this.isThumbnailOpen = false;
        // tslint:disable-next-line
        this.loadImportAnnotation = function (args) {
            // tslint:disable-next-line
            var upoadedFiles = args.target.files;
            if (args.target.files[0] !== null) {
                var uploadedFile = upoadedFiles[0];
                if (uploadedFile) {
                    _this.pdfViewer.fireImportStart(uploadedFile);
                    // tslint:disable-next-line
                    var uploadedFileType = uploadedFile.type;
                    if (uploadedFile.name.split('.json').length > 1 && uploadedFileType.includes('json')) {
                        var reader = new FileReader();
                        reader.readAsDataURL(uploadedFile);
                        // tslint:disable-next-line
                        reader.onload = function (e) {
                            if (e.currentTarget.result) {
                                var importFile = e.currentTarget.result.split(',')[1];
                                // tslint:disable-next-line
                                var annotationData = atob(importFile);
                                if (annotationData) {
                                    // tslint:disable-next-line
                                    var jsonData = JSON.parse(annotationData);
                                    _this.pdfViewerBase.importAnnotations(jsonData, AnnotationDataFormat.Json);
                                }
                            }
                        };
                    }
                    else if (uploadedFile.name.split('.xfdf').length > 1 && uploadedFileType.includes('xfdf')) {
                        var reader = new FileReader();
                        reader.readAsDataURL(uploadedFile);
                        // tslint:disable-next-line
                        reader.onload = function (e) {
                            if (e.currentTarget.result) {
                                var importFile = e.currentTarget.result.split(',')[1];
                                // tslint:disable-next-line
                                var annotationData = atob(importFile);
                                if (annotationData) {
                                    // tslint:disable-next-line:max-line-length
                                    _this.pdfViewerBase.importAnnotations(importFile, AnnotationDataFormat.Xfdf);
                                }
                            }
                        };
                    }
                    else {
                        _this.pdfViewer.fireImportFailed(uploadedFile, _this.pdfViewer.localeObj.getConstant('Import Failed'));
                        _this.pdfViewerBase.openImportExportNotificationPopup(_this.pdfViewer.localeObj.getConstant('Import Failed'));
                    }
                }
            }
        };
        this.resizeIconMouseOver = function (event) {
            event.srcElement.style.cursor = 'default';
        };
        this.resizePanelMouseDown = function (event) {
            var proxy = _this;
            proxy.offset = [
                proxy.sideBarResizer.offsetLeft - event.clientX,
                proxy.sideBarResizer.offsetTop - event.clientY,
                proxy.sideBarResizer.offsetParent.clientWidth
            ];
            _this.previousX = event.clientX;
            proxy.isDown = true;
            proxy.isNavigationPaneResized = true;
            proxy.pdfViewerBase.viewerContainer.style.cursor = 'e-resize';
            if (proxy.sideBarContentContainer) {
                proxy.sideBarContentContainer.style.cursor = 'e-resize';
            }
        };
        this.resizeViewerMouseLeave = function (event) {
            var proxy = _this;
            proxy.isDown = false;
            if (proxy.isNavigationPaneResized && proxy.sideBarContentContainer) {
                proxy.pdfViewerBase.viewerContainer.style.cursor = 'default';
                proxy.sideBarContentContainer.style.cursor = 'default';
                proxy.isNavigationPaneResized = false;
            }
            if (proxy.commentPanelContainer && proxy.isCommentPanelShow) {
                _this.commentPanelMouseLeave(event);
                proxy.isCommentPanelShow = false;
            }
        };
        this.resizePanelMouseMove = function (event) {
            var proxy = _this;
            if (!_this.pdfViewerBase.getPopupNoteVisibleStatus()) {
                var target = event.target;
                // tslint:disable-next-line:max-line-length
                if (_this.pdfViewerBase.skipPreventDefault(target)) {
                    event.preventDefault();
                }
                if (proxy.isDown && _this.sideBarContentContainer) {
                    // prevent the sidebar from becoming too narrow, or from occupying more
                    // than half of the available viewer width.
                    if (_this.pdfViewer.enableRtl) {
                        var currentWidth = _this.previousX - event.clientX;
                        var width = currentWidth + proxy.offset[2];
                        var maxWidth = Math.floor(_this.outerContainerWidth / 2);
                        if (width > maxWidth) {
                            width = maxWidth;
                        }
                        if (width < _this.thumbnailWidthMin) {
                            width = _this.thumbnailWidthMin;
                        }
                        proxy.sideBarResizer.style.right = width + 'px';
                        proxy.sideBarContentContainer.style.width = width + 'px';
                        proxy.sideBarContent.style.width = width + 'px';
                        proxy.sideBarContentSplitter.style.width = width + 'px';
                        proxy.sideBarTitleContainer.style.width = width + 'px';
                        // tslint:disable-next-line:max-line-length
                        proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
                        proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerRight() + 'px';
                    }
                    else {
                        var width = event.clientX + proxy.offset[0];
                        var maxWidth = Math.floor(_this.outerContainerWidth / 2);
                        if (width > maxWidth) {
                            width = maxWidth;
                        }
                        if (width < _this.thumbnailWidthMin) {
                            width = _this.thumbnailWidthMin;
                        }
                        proxy.sideBarResizer.style.left = width + 'px';
                        proxy.closeDiv.style.left = width - proxy.contentContainerScrollWidth + 'px';
                        proxy.sideBarContentContainer.style.width = width + 'px';
                        proxy.sideBarContent.style.width = width + 'px';
                        proxy.sideBarContentSplitter.style.width = width + 'px';
                        proxy.sideBarTitleContainer.style.width = width + 'px';
                        // tslint:disable-next-line:max-line-length
                        proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
                        proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerRight() + 'px';
                    }
                    // tslint:disable-next-line:max-line-length
                    var viewerWidth = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight());
                    proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
                    proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                    proxy.pdfViewerBase.updateZoomValue();
                    if (!proxy.bookmarkButton.children[0].classList.contains('e-pv-bookmark-disable-icon')) {
                        proxy.pdfViewer.bookmarkViewModule.setBookmarkContentHeight();
                    }
                }
                else if (proxy.isCommentPanelShow && _this.commentPanelContainer) {
                    _this.updateCommentPanelContainer(event);
                }
            }
        };
        this.sideToolbarOnClose = function (event) {
            var proxy = _this;
            proxy.removeThumbnailSelectionIconTheme();
            proxy.removeBookmarkSelectionIconTheme();
            proxy.updateViewerContainerOnClose();
        };
        this.sideToolbarOnClick = function (event) {
            _this.sideBarTitle.textContent = _this.pdfViewer.localeObj.getConstant('Page Thumbnails');
            _this.sideBarContent.setAttribute('aria-label', 'Thumbnail View Panel');
            var proxy = _this;
            var isblazor = isBlazor();
            // tslint:disable-next-line:max-line-length
            var bookmarkPane = isblazor ? _this.pdfViewer.element.querySelector('.e-pv-bookmark-view') : document.getElementById(_this.pdfViewer.element.id + '_bookmark_view');
            if (bookmarkPane) {
                proxy.removeBookmarkSelectionIconTheme();
                bookmarkPane.style.display = 'none';
            }
            document.getElementById(_this.pdfViewer.element.id + '_thumbnail_view').style.display = 'flex';
            if (proxy.sideBarContentContainer) {
                if (proxy.sideBarContentContainer.style.display !== 'none') {
                    if (proxy.isBookmarkOpen) {
                        proxy.isThumbnailOpen = true;
                        proxy.setThumbnailSelectionIconTheme();
                        _this.updateViewerContainerOnExpand();
                    }
                    else {
                        proxy.isThumbnailOpen = false;
                        proxy.removeThumbnailSelectionIconTheme();
                        _this.updateViewerContainerOnClose();
                    }
                }
                else {
                    _this.sideBarContent.focus();
                    proxy.isThumbnailOpen = true;
                    proxy.setThumbnailSelectionIconTheme();
                    _this.updateViewerContainerOnExpand();
                }
            }
            proxy.isBookmarkOpen = false;
            if (_this.pdfViewer.annotationModule && _this.pdfViewer.annotationModule.inkAnnotationModule) {
                // tslint:disable-next-line
                var currentPageNumber = parseInt(_this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
                _this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
            }
        };
        /**
         * @private
         */
        this.openThumbnailPane = function () {
            var proxy = _this;
            var sideBarContent = document.getElementById(_this.pdfViewer.element.id + '_sideBarContent');
            var sideBarContentContainer = document.getElementById(_this.pdfViewer.element.id + '_sideBarContentContainer');
            var viewerContainer = document.getElementById(_this.pdfViewer.element.id + '_viewerContainer');
            var pageContainer = document.getElementById(_this.pdfViewer.element.id + '_pageViewContainer');
            document.getElementById(_this.pdfViewer.element.id + '_thumbnail_view').style.display = 'block';
            document.getElementById(_this.pdfViewer.element.id + '_sideBarResizer').style.display = 'none';
            document.getElementById(_this.pdfViewer.element.id + '_sideBarTitleContainer').style.display = 'none';
            document.getElementById(_this.pdfViewer.element.id + '_sideBarContentSplitter').style.display = 'none';
            sideBarContent.classList.add('e-thumbnail');
            sideBarContentContainer.classList.add('e-thumbnail');
            if (sideBarContentContainer) {
                if (proxy.isThumbnail) {
                    sideBarContentContainer.style.display = 'none';
                    viewerContainer.style.width = proxy.pdfViewer.element.clientWidth + 'px';
                    pageContainer.style.width = viewerContainer.clientWidth + 'px';
                    viewerContainer.style.left = sideBarContentContainer.clientWidth + 'px';
                    proxy.pdfViewerBase.updateZoomValue();
                    proxy.isThumbnail = false;
                }
                else {
                    sideBarContent.focus();
                    sideBarContentContainer.style.display = 'block';
                    // tslint:disable-next-line:max-line-length
                    viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - sideBarContentContainer.clientWidth) + 'px';
                    pageContainer.style.width = viewerContainer.clientWidth + 'px';
                    viewerContainer.style.left = (sideBarContentContainer.clientWidth) + 'px';
                    proxy.pdfViewerBase.updateZoomValue();
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                    proxy.isThumbnail = true;
                }
            }
            if (_this.pdfViewer.annotationModule && _this.pdfViewer.annotationModule.inkAnnotationModule) {
                // tslint:disable-next-line
                var currentPageNumber = parseInt(_this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
                _this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
            }
        };
        this.bookmarkButtonOnClick = function (event) {
            _this.openBookmarkcontentInitially();
        };
        this.commentPanelMouseDown = function (event) {
            var proxy = _this;
            proxy.offset = [
                proxy.commentPanelResizer.offsetLeft - event.clientX,
                proxy.commentPanelResizer.offsetTop - event.clientY,
                proxy.getViewerContainerRight()
            ];
            _this.isCommentPanelShow = true;
            _this.previousX = event.clientX;
            proxy.pdfViewerBase.viewerContainer.style.cursor = 'e-resize';
            proxy.commentPanelResizer.style.cursor = 'e-resize';
        };
        this.updateCommentPanelContainer = function (event) {
            var proxy = _this;
            // prevent the commentPanel from becoming too narrow, or from occupying more
            // than half of the available viewer width.
            if (_this.pdfViewer.enableRtl) {
                var width = event.clientX + proxy.offset[0];
                var maxWidth = Math.floor(_this.outerContainerWidth / 2);
                if (width > maxWidth) {
                    width = maxWidth;
                }
                if (width < _this.commentPanelWidthMin) {
                    width = _this.commentPanelWidthMin;
                }
                proxy.commentPanelResizer.style.left = width + 'px';
                proxy.commentPanelContainer.style.width = width + 'px';
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerRight() + 'px';
                proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
            }
            else {
                var currentWidth = _this.previousX - event.clientX;
                var width = currentWidth + proxy.offset[2];
                var maxWidth = Math.floor(_this.outerContainerWidth / 2);
                if (width > maxWidth) {
                    width = maxWidth;
                }
                if (width < _this.commentPanelWidthMin) {
                    width = _this.commentPanelWidthMin;
                }
                proxy.commentPanelResizer.style.right = width + 'px';
                proxy.commentPanelContainer.style.width = width + 'px';
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerRight() + 'px';
                proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
            }
            _this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelTextTop();
            // tslint:disable-next-line:max-line-length
            var viewerWidth = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight());
            proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
        };
        this.commentPanelMouseLeave = function (event) {
            var proxy = _this;
            if (proxy.commentPanelContainer) {
                proxy.pdfViewerBase.viewerContainer.style.cursor = 'default';
                proxy.commentPanelContainer.style.cursor = 'default';
            }
        };
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    NavigationPane.prototype.initializeNavigationPane = function () {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.createNavigationPane();
        }
    };
    NavigationPane.prototype.createNavigationPane = function () {
        var isblazor = isBlazor();
        if (!isblazor) {
            // tslint:disable-next-line:max-line-length
            this.sideBarToolbar = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbar', className: 'e-pv-sidebar-toolbar', attrs: { 'role': 'toolbar', 'aria-orientation': 'vertical', 'tabindex': '-1' } });
            // tslint:disable-next-line:max-line-length
            this.sideBarToolbarSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbarSplitter', className: 'e-pv-sidebar-toolbar-splitter' });
            // tslint:disable-next-line:max-line-length
            this.sideBarContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentContainer', className: 'e-pv-sidebar-content-container' });
            // tslint:disable-next-line:max-line-length
            this.sideBarContentSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentSplitter', className: 'e-pv-sidebar-content-splitter' });
            // tslint:disable-next-line:max-line-length
            this.sideBarContent = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContent', className: 'e-pv-sidebar-content', attrs: { 'tabindex': '0' } });
            // tslint:disable-next-line:max-line-length
            this.sideBarTitleContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitleContainer', className: 'e-pv-sidebar-title-container' });
            // tslint:disable-next-line:max-line-length
            this.sideBarTitle = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitle', className: 'e-pv-sidebar-title', attrs: { 'tabindex': '-1' } });
            // tslint:disable-next-line:max-line-length
            this.sideBarResizer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarResizer', className: 'e-pv-sidebar-resizer' });
        }
        else {
            this.sideBarToolbar = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar');
            this.sideBarToolbarSplitter = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
            this.sideBarContentContainer = this.pdfViewer.element.querySelector('.e-pv-sidebar-content-container');
            this.sideBarContentSplitter = this.pdfViewer.element.querySelector('.e-pv-sidebar-content-splitter');
            this.sideBarContent = this.pdfViewer.element.querySelector('.e-pv-sidebar-content');
            this.sideBarTitleContainer = this.pdfViewer.element.querySelector('.e-pv-sidebar-title-container');
            this.sideBarTitle = this.pdfViewer.element.querySelector('.e-pv-sidebar-title');
            this.sideBarResizer = this.pdfViewer.element.querySelector('.e-pv-sidebar-resizer');
        }
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbar);
        if (this.pdfViewer.enableRtl) {
            this.sideBarToolbar.style.cssFloat = 'right';
            this.sideBarToolbar.style.right = 1 + 'px';
            this.sideBarToolbar.style.position = 'relative';
        }
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbarSplitter);
        if (this.pdfViewer.enableRtl) {
            this.sideBarToolbarSplitter.classList.add('e-right');
        }
        else {
            this.sideBarToolbarSplitter.classList.add('e-left');
        }
        if (this.pdfViewer.enableRtl) {
            this.sideBarContentContainer.classList.add('e-right');
        }
        else {
            this.sideBarContentContainer.classList.add('e-left');
        }
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarContentContainer);
        if (this.pdfViewer.enableRtl) {
            this.sideBarContentSplitter.style.right = 0 + 'px';
        }
        this.sideBarContentContainer.appendChild(this.sideBarContentSplitter);
        if (this.pdfViewer.enableRtl) {
            this.sideBarContent.style.right = 0 + 'px';
            this.sideBarContent.style.direction = 'rtl';
        }
        this.sideBarContentContainer.appendChild(this.sideBarContent);
        if (this.pdfViewer.enableRtl) {
            this.sideBarTitleContainer.style.right = 0 + 'px';
        }
        if (this.pdfViewer.enableRtl) {
            this.sideBarTitle.classList.add('e-right');
        }
        else {
            this.sideBarTitle.classList.add('e-left');
        }
        this.sideBarTitleContainer.appendChild(this.sideBarTitle);
        this.sideBarContentContainer.appendChild(this.sideBarTitleContainer);
        this.sideBarResizer.addEventListener('mousedown', this.resizePanelMouseDown);
        this.pdfViewerBase.mainContainer.addEventListener('mousemove', this.resizePanelMouseMove);
        this.pdfViewerBase.mainContainer.addEventListener('mouseup', this.resizeViewerMouseLeave);
        if (this.pdfViewer.enableRtl) {
            this.sideBarResizer.classList.add('e-right');
        }
        else {
            this.sideBarResizer.classList.add('e-left');
        }
        this.sideBarContentContainer.appendChild(this.sideBarResizer);
        this.createCommentPanel();
        var controlLeft = this.getViewerContainerLeft();
        var controlRight = this.getViewerContainerRight();
        if (!this.pdfViewer.enableRtl) {
            this.pdfViewerBase.viewerContainer.style.left = controlLeft + 'px';
            this.pdfViewerBase.viewerContainer.style.right = controlRight + 'px';
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - controlLeft - this.commentPanelContainer.clientWidth) + 'px';
        this.sideBarContentContainer.style.display = 'none';
        this.createSidebarToolBar();
        this.createSidebarTitleCloseButton();
        this.createResizeIcon();
        this.sideBarToolbar.addEventListener('mouseup', this.sideToolbarOnMouseup.bind(this));
        this.sideBarContentContainer.addEventListener('mouseup', this.sideBarTitleOnMouseup.bind(this));
    };
    /**
     * @private
     */
    NavigationPane.prototype.adjustPane = function () {
        if (isBlazor()) {
            var splitterElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
            var sideToolbarElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar');
            var sideToolbarContent = this.pdfViewer.element.querySelector('.e-pv-sidebar-content-container');
            var toolbarContainer = this.pdfViewer.element.querySelector('.e-pv-toolbar');
            var toolbarHeight = toolbarContainer.getBoundingClientRect().height;
            if (toolbarHeight === 0) {
                // tslint:disable-next-line
                toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
            }
            if (!this.pdfViewer.enableToolbar) {
                toolbarHeight = 0;
            }
            sideToolbarElement.style.top = toolbarHeight + 'px';
            sideToolbarContent.style.top = toolbarHeight + 'px';
            splitterElement.style.top = toolbarHeight + 'px';
            sideToolbarElement.style.height = this.getSideToolbarHeight(toolbarHeight);
            sideToolbarContent.style.height = this.getSideToolbarHeight(toolbarHeight);
            splitterElement.style.height = this.getSideToolbarHeight(toolbarHeight);
            this.pdfViewerBase.viewerContainer.style.height = this.getSideToolbarHeight(toolbarHeight);
        }
        else {
            var splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
            var toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
            var toolbarHeight = toolbarContainer.getBoundingClientRect().height;
            if (toolbarHeight === 0) {
                // tslint:disable-next-line
                toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
            }
            // tslint:disable-next-line:max-line-length
            this.sideBarToolbar.style.top = toolbarHeight + 'px';
            this.sideBarContentContainer.style.top = toolbarHeight + 'px';
            splitterElement.style.top = toolbarHeight + 'px';
        }
    };
    NavigationPane.prototype.getSideToolbarHeight = function (toolbarHeight) {
        var height = this.pdfViewer.element.getBoundingClientRect().height;
        return (height !== 0) ? height - toolbarHeight + 'px' : '';
    };
    NavigationPane.prototype.createCommentPanel = function () {
        // tslint:disable-next-line:max-line-length
        this.commentPanelContainer = createElement('div', { id: this.pdfViewer.element.id + '_commantPanel', className: 'e-pv-comment-panel' });
        this.pdfViewerBase.mainContainer.appendChild(this.commentPanelContainer);
        if (this.pdfViewer.enableRtl) {
            this.commentPanelContainer.style.left = 0 + 'px';
        }
        else {
            this.commentPanelContainer.style.right = 0 + 'px';
        }
        this.commentPanelContainer.style.bottom = 0 + 'px';
        this.createCommentPanelTitleContainer();
        this.commentPanelContainer.style.display = 'none';
        // tslint:disable-next-line:max-line-length
        this.commentsContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_commentscontentcontainer', className: 'e-pv-comments-content-container' });
        this.commentPanelContainer.appendChild(this.commentsContentContainer);
        // tslint:disable-next-line:max-line-length
        this.commentPanelResizer = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelResizer', className: 'e-pv-comment-panel-resizer' });
        if (this.pdfViewer.enableRtl) {
            this.commentPanelResizer.classList.add('e-left');
        }
        else {
            this.commentPanelResizer.classList.add('e-right');
        }
        this.commentPanelResizer.style.display = 'none';
        this.commentPanelResizer.addEventListener('mousedown', this.commentPanelMouseDown);
        this.pdfViewerBase.mainContainer.appendChild(this.commentPanelResizer);
        this.createCommentPanelResizeIcon();
        this.createFileElement(this.commentPanelContainer);
        this.createXFdfFileElement(this.commentPanelContainer);
    };
    NavigationPane.prototype.createCommentPanelTitleContainer = function () {
        // tslint:disable-next-line:max-line-length
        var commentPanelTitleContainer = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitleContainer', className: 'e-pv-comment-panel-title-container' });
        // tslint:disable-next-line:max-line-length
        var commentpanelTilte = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitle', className: 'e-pv-comment-panel-title', attrs: { 'tabindex': '-1' } });
        commentpanelTilte.innerText = this.pdfViewer.localeObj.getConstant('Comments');
        var annotationButton = createElement('button', { id: this.pdfViewer.element.id + '_annotations_btn' });
        annotationButton.setAttribute('aria-label', 'annotation button');
        annotationButton.setAttribute('type', 'button');
        annotationButton.className = 'e-btn e-pv-tbar-btn e-pv-comment-panel-title-close-div e-btn';
        // tslint:disable-next-line:max-line-length
        var moreOptionButtonSpan = createElement('span', { id: this.pdfViewer.element.id + '_annotation_more_icon', className: 'e-pv-more-icon e-pv-icon' });
        annotationButton.appendChild(moreOptionButtonSpan);
        commentPanelTitleContainer.appendChild(commentpanelTilte);
        commentPanelTitleContainer.appendChild(annotationButton);
        this.commentPanelContainer.appendChild(commentPanelTitleContainer);
        this.createAnnotationContextMenu();
        annotationButton.addEventListener('click', this.openAnnotationContextMenu.bind(this));
    };
    NavigationPane.prototype.createCommentPanelResizeIcon = function () {
        // tslint:disable-next-line:max-line-length
        this.commentPanelResizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_resize', className: 'e-pv-resize-icon e-pv-icon' });
        this.setCommentPanelResizeIconTop();
        this.commentPanelResizeIcon.style.position = 'absolute';
        this.commentPanelResizer.appendChild(this.commentPanelResizeIcon);
    };
    // tslint:disable-next-line
    NavigationPane.prototype.openAnnotationContextMenu = function (event) {
        this.annotationMenuObj.open(event.clientY, event.clientX, event.currentTarget);
    };
    /**
     * @private
     */
    NavigationPane.prototype.createAnnotationContextMenu = function () {
        // tslint:disable-next-line:max-line-length
        this.annotationContextMenu = [
            { text: this.pdfViewer.localeObj.getConstant('Export Annotations') },
            { text: this.pdfViewer.localeObj.getConstant('Import Annotations') },
            { text: this.pdfViewer.localeObj.getConstant('Export XFDF') },
            { text: this.pdfViewer.localeObj.getConstant('Import XFDF') }
        ];
        var annotationMenuElement = createElement('ul', { id: this.pdfViewer.element.id + '_annotation_context_menu' });
        this.pdfViewer.element.appendChild(annotationMenuElement);
        this.annotationMenuObj = new Context({
            target: '#' + this.pdfViewer.element.id + '_annotations_btn', items: this.annotationContextMenu,
            select: this.annotationMenuItemSelect.bind(this),
        });
        if (this.pdfViewer.enableRtl) {
            this.annotationMenuObj.enableRtl = true;
        }
        this.annotationMenuObj.appendTo(annotationMenuElement);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.annotationMenuObj.animationSettings.effect = 'ZoomIn';
        }
        else {
            this.annotationMenuObj.animationSettings.effect = 'SlideDown';
        }
    };
    // tslint:disable-next-line
    NavigationPane.prototype.annotationMenuItemSelect = function (args) {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // tslint:disable-next-line
            var currentPageNumber = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        if (args.item) {
            switch (args.item.text) {
                case this.pdfViewer.localeObj.getConstant('Export Annotations'):
                    this.pdfViewerBase.exportAnnotations(AnnotationDataFormat.Json);
                    break;
                case this.pdfViewer.localeObj.getConstant('Import Annotations'):
                    this.importAnnotationIconClick(args);
                    break;
                case this.pdfViewer.localeObj.getConstant('Export XFDF'):
                    this.pdfViewerBase.exportAnnotations(AnnotationDataFormat.Xfdf);
                    break;
                case this.pdfViewer.localeObj.getConstant('Import XFDF'):
                    this.importXFdfAnnotationIconClick(args);
                    break;
                default:
                    break;
            }
        }
    };
    NavigationPane.prototype.createFileElement = function (toolbarElement) {
        // tslint:disable-next-line:max-line-length
        this.annotationInputElement = createElement('input', { id: this.pdfViewer.element.id + '_annotationUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file', 'aria-label': 'upload elements' } });
        this.annotationInputElement.setAttribute('accept', '.json');
        toolbarElement.appendChild(this.annotationInputElement);
        this.annotationInputElement.addEventListener('change', this.loadImportAnnotation);
    };
    NavigationPane.prototype.createXFdfFileElement = function (toolbarElement) {
        // tslint:disable-next-line:max-line-length
        this.annotationXFdfInputElement = createElement('input', { id: this.pdfViewer.element.id + '_annotationXFdfUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file', 'aria-label': 'upload elements' } });
        this.annotationXFdfInputElement.setAttribute('accept', '.xfdf');
        toolbarElement.appendChild(this.annotationXFdfInputElement);
        this.annotationXFdfInputElement.addEventListener('change', this.loadImportAnnotation);
    };
    NavigationPane.prototype.importAnnotationIconClick = function (args) {
        this.annotationInputElement.click();
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            args.originalEvent.target.blur();
            this.pdfViewerBase.focusViewerContainer();
        }
    };
    NavigationPane.prototype.importXFdfAnnotationIconClick = function (args) {
        this.annotationXFdfInputElement.click();
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            args.originalEvent.target.blur();
            this.pdfViewerBase.focusViewerContainer();
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.closeCommentPanelContainer = function () {
        var proxy = this;
        var viewerContainer = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
        var pageContainer = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
        var commentPanel = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
        if (commentPanel) {
            commentPanel.style.display = 'none';
            proxy.commentPanelResizer.style.display = 'none';
            if (viewerContainer) {
                if (this.pdfViewer.enableRtl) {
                    viewerContainer.style.left = proxy.getViewerContainerRight() + 'px';
                }
                else {
                    viewerContainer.style.right = proxy.getViewerContainerRight() + 'px';
                }
                // tslint:disable-next-line:max-line-length
                viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight()) + 'px';
                pageContainer.style.width = (proxy.pdfViewerBase.viewerContainer.offsetWidth - proxy.getViewerContainerScrollbarWidth()) + 'px';
            }
            if (proxy.pdfViewerBase) {
                proxy.pdfViewerBase.updateZoomValue();
            }
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.createNavigationPaneMobile = function (option) {
        var _this = this;
        this.isNavigationToolbarVisible = true;
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_navigationToolbar', className: 'e-pv-nav-toolbar' });
        this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
        var items;
        if (option === 'search') {
            var searchTemplate = '<div class="e-input-group e-pv-search-input-mobile" id="' + this.pdfViewer.element.id +
                '_search_input_container"><input class="e-input" type="text" placeholder="' +
                this.pdfViewer.localeObj.getConstant('Find in document') + '" id="' +
                this.pdfViewer.element.id + '_search_input"></input></div>';
            items = [
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
                { template: searchTemplate },
                {
                    prefixIcon: 'e-pv-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_search_box-icon',
                    click: function () {
                        var iconElement = _this.pdfViewerBase.getElement('_search_box-icon').firstElementChild;
                        if (iconElement.classList.contains('e-pv-search-close')) {
                            _this.enableSearchItems(false);
                        }
                        _this.pdfViewer.textSearchModule.searchButtonClick(iconElement, _this.searchInput);
                    }
                },
                {
                    prefixIcon: 'e-pv-prev-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_prev_occurrence',
                    click: function (args) {
                        _this.pdfViewer.textSearchModule.searchPrevious();
                    }
                },
                {
                    prefixIcon: 'e-pv-next-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_next_occurrence',
                    click: function (args) {
                        _this.pdfViewer.textSearchModule.searchNext();
                    }
                }
            ];
        }
        else {
            items = [
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
                { text: this.pdfViewer.localeObj.getConstant('Bookmarks') }
            ];
        }
        this.toolbar = new Tool({ items: items, width: '', height: '', overflowMode: 'Popup' });
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo(this.toolbarElement);
        if (option === 'search') {
            this.initiateSearchBox();
        }
        else {
            this.initiateBookmarks();
        }
    };
    NavigationPane.prototype.initiateSearchBox = function () {
        var _this = this;
        this.searchInput = this.pdfViewerBase.getElement('_search_input');
        this.pdfViewer.textSearchModule.searchBtn = this.pdfViewerBase.getElement('_search_box-icon').firstElementChild;
        this.searchInput.addEventListener('keyup', function (event) {
            _this.enableSearchItems(true);
            var searchString = _this.searchInput.value;
            if (event.which === 13) {
                _this.initiateTextSearch();
            }
            else {
                _this.pdfViewer.textSearchModule.resetVariables();
            }
        });
        this.pdfViewer.textSearchModule.searchInput = this.searchInput;
        this.setSearchInputWidth();
        this.enableSearchItems(false);
        this.searchInput.focus();
    };
    NavigationPane.prototype.enableSearchItems = function (isEnable) {
        if (!isBlazor()) {
            this.toolbar.enableItems(this.pdfViewerBase.getElement('_prev_occurrence').parentElement, isEnable);
            this.toolbar.enableItems(this.pdfViewerBase.getElement('_next_occurrence').parentElement, isEnable);
        }
        else {
            this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableSearchItems', isEnable);
        }
    };
    NavigationPane.prototype.initiateBookmarks = function () {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = 'none';
        }
        // tslint:disable-next-line:max-line-length
        var bookmarkContainer = createElement('div', { id: this.pdfViewer.element.id + '_bookmarks_container', className: 'e-pv-bookmark-container' });
        bookmarkContainer.style.width = '100%';
        bookmarkContainer.style.height = this.pdfViewerBase.viewerContainer.style.height;
        this.pdfViewerBase.getElement('_viewerMainContainer').appendChild(bookmarkContainer);
        this.pdfViewerBase.viewerContainer.style.display = 'none';
        this.isBookmarkListOpen = true;
        this.pdfViewer.bookmarkViewModule.renderBookmarkContentMobile();
    };
    NavigationPane.prototype.initiateTextSearch = function () {
        var inputString = this.searchInput.value;
        this.pdfViewer.textSearchModule.initiateSearch(inputString);
    };
    /**
     * @private
     */
    NavigationPane.prototype.goBackToToolbar = function () {
        this.isNavigationToolbarVisible = false;
        if (isBlazor() && (!Browser.isDevice || this.pdfViewer.enableDesktopMode) || !isBlazor()) {
            this.pdfViewer.textSearchModule.cancelTextSearch();
        }
        this.searchInput = null;
        if (this.pdfViewer.bookmarkViewModule.childNavigateCount !== 0) {
            this.pdfViewer.bookmarkViewModule.bookmarkList.back();
            this.pdfViewer.bookmarkViewModule.childNavigateCount--;
        }
        else {
            if (this.toolbar != null) {
                this.toolbar.destroy();
                this.toolbar = null;
            }
            var bookmarkContainer = this.pdfViewerBase.getElement('_bookmarks_container');
            if (bookmarkContainer) {
                bookmarkContainer.parentElement.removeChild(bookmarkContainer);
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    this.pdfViewerBase.mobileScrollerContainer.style.display = '';
                }
            }
            if (this.toolbarElement && this.toolbarElement.parentElement != null) {
                this.toolbarElement.parentElement.removeChild(this.toolbarElement);
            }
            this.pdfViewerBase.viewerContainer.style.display = 'block';
            this.isBookmarkListOpen = false;
            if (!isBlazor()) {
                if (!this.pdfViewer.toolbar.annotationToolbarModule.isMobileAnnotEnabled) {
                    this.pdfViewer.toolbarModule.showToolbar(true);
                    this.pdfViewerBase.onWindowResize();
                }
            }
            else {
                this.pdfViewerBase.onWindowResize();
            }
        }
    };
    NavigationPane.prototype.setSearchInputWidth = function () {
        var searchInputParent = this.searchInput.parentElement;
        var padding = window.getComputedStyle(searchInputParent.parentElement, null).getPropertyValue('padding-left');
        if (isBlazor() && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            this.toolbarElement = this.pdfViewerBase.getElement('_navigationToolbar');
        }
        // tslint:disable-next-line:max-line-length
        var width = this.toolbarElement.clientWidth - this.getParentElementSearchBox('_backward').clientWidth
            - this.getParentElementSearchBox('_search_box-icon').clientWidth - this.getParentElementSearchBox('_prev_occurrence').clientWidth
            - this.getParentElementSearchBox('_next_occurrence').clientWidth - 6;
        if (padding !== '') {
            width = width - (parseFloat(padding) * 2);
        }
        searchInputParent.style.width = width + 'px';
    };
    NavigationPane.prototype.getParentElementSearchBox = function (idString) {
        return this.pdfViewerBase.getElement(idString).parentElement;
    };
    /**
     * @private
     */
    NavigationPane.prototype.createTooltipMobile = function (text) {
        if (!this.isTooltipCreated) {
            //boolean to prevent again toast creation.
            this.createMobileTooltip(text);
        }
        else {
            if (this.toastObject) {
                this.toastObject.title = text;
                var tooltipElement = this.pdfViewerBase.getElement('_container_tooltip');
                var tooltipChild = tooltipElement.firstElementChild;
                if (tooltipChild) {
                    tooltipChild.style.width = 'auto';
                    tooltipChild.firstElementChild.firstElementChild.textContent = text;
                }
                else {
                    this.isTooltipCreated = false;
                    var tooltipElement_1 = this.pdfViewerBase.getElement('_container_tooltip');
                    if (this.toastObject) {
                        this.toastObject.destroy();
                    }
                    tooltipElement_1.parentElement.removeChild(tooltipElement_1);
                    this.toastObject = null;
                    this.createMobileTooltip(text);
                }
            }
        }
    };
    NavigationPane.prototype.createMobileTooltip = function (text) {
        // tslint:disable-next-line:max-line-length
        var tooltipDiv = createElement('div', { className: 'e-pv-container-tooltip', id: this.pdfViewer.element.id + '_container_tooltip' });
        this.pdfViewer.element.appendChild(tooltipDiv);
        // tslint:disable-next-line:max-line-length
        this.toastObject = new Toast({ title: text, target: this.pdfViewer.element, close: this.onTooltipClose.bind(this), position: { X: 0, Y: 0 }, animation: { hide: { duration: 200, effect: 'FadeOut' } } });
        this.toastObject.appendTo(tooltipDiv);
        var y = this.pdfViewer.element.clientHeight * 0.65;
        var x = (this.pdfViewer.element.clientWidth - tooltipDiv.clientWidth) / 2;
        this.isTooltipCreated = true;
        this.toastObject.show({ position: { X: x, Y: y } });
        var tooltipChild = tooltipDiv.firstElementChild;
        if (tooltipChild) {
            tooltipChild.style.width = 'auto';
        }
    };
    NavigationPane.prototype.onTooltipClose = function (args) {
        if (this.pdfViewer.textSearchModule) {
            this.isTooltipCreated = false;
            var tooltipElement = this.pdfViewerBase.getElement('_container_tooltip');
            this.pdfViewer.textSearchModule.isMessagePopupOpened = false;
            if (this.toastObject) {
                this.toastObject.destroy();
            }
            tooltipElement.parentElement.removeChild(tooltipElement);
            this.toastObject = null;
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.toolbarResize = function () {
        if (this.searchInput) {
            this.searchInput.style.width = 'auto';
            this.setSearchInputWidth();
        }
    };
    NavigationPane.prototype.createSidebarToolBar = function () {
        // tslint:disable-next-line:max-line-length
        this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled', 'aria-label': 'Page Thumbnails', 'tabindex': '-1' } });
        this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
        this.thumbnailButton.setAttribute('type', 'button');
        // tslint:disable-next-line:max-line-length
        var thumbnailButtonSpan = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
        this.thumbnailButton.appendChild(thumbnailButtonSpan);
        if (!isBlazor()) {
            // tslint:disable-next-line:max-line-length
            var thumbnailTooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Page Thumbnails'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            thumbnailTooltip.appendTo(this.thumbnailButton);
        }
        else {
            thumbnailButtonSpan.title = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
        }
        // tslint:disable-next-line:max-line-length
        this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled', 'aria-label': 'Bookmarks', 'tabindex': '-1' } });
        this.bookmarkButton.setAttribute('type', 'button');
        this.bookmarkButton.className = 'e-pv-tbar-btn e-pv-bookmark-button e-btn';
        // tslint:disable-next-line:max-line-length
        var buttonSpan = createElement('span', { id: this.pdfViewer.element.id + '_bookmark' + '_icon', className: 'e-pv-bookmark-disable-icon e-pv-icon' });
        this.bookmarkButton.appendChild(buttonSpan);
        if (!isBlazor()) {
            // tslint:disable-next-line:max-line-length
            var bookMarkTooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Bookmarks'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            bookMarkTooltip.appendTo(this.bookmarkButton);
        }
        else {
            buttonSpan.title = this.pdfViewer.localeObj.getConstant('Bookmarks');
        }
        this.sideBarToolbar.appendChild(this.thumbnailButton);
        this.sideBarToolbar.appendChild(this.bookmarkButton);
        this.thumbnailButton.addEventListener('click', this.sideToolbarOnClick);
        this.bookmarkButton.addEventListener('click', this.bookmarkButtonOnClick);
    };
    NavigationPane.prototype.onTooltipBeforeOpen = function (args) {
        if (!this.pdfViewer.toolbarSettings.showTooltip) {
            args.cancel = true;
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.enableThumbnailButton = function () {
        if (this.thumbnailButton) {
            this.thumbnailButton.removeAttribute('disabled');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-disable-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.enableBookmarkButton = function () {
        if (this.bookmarkButton) {
            this.bookmarkButton.removeAttribute('disabled');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-disable-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
        }
    };
    NavigationPane.prototype.createSidebarTitleCloseButton = function () {
        this.closeDiv = createElement('button', { id: this.pdfViewer.element.id + '_close_btn' });
        this.closeDiv.setAttribute('aria-label', 'close button');
        this.closeDiv.setAttribute('type', 'button');
        this.closeDiv.className = 'e-btn e-pv-tbar-btn e-pv-title-close-div e-btn';
        if (this.pdfViewer.enableRtl) {
            this.closeDiv.style.left = 8 + 'px';
        }
        else {
            this.closeDiv.style.left = this.closeButtonLeft + 'px';
        }
        // tslint:disable-next-line:max-line-length
        var buttonSpan = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    };
    NavigationPane.prototype.createResizeIcon = function () {
        // tslint:disable-next-line:max-line-length
        this.resizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_resize', className: 'e-pv-resize-icon e-pv-icon' });
        this.setResizeIconTop();
        this.resizeIcon.style.position = 'absolute';
        this.resizeIcon.addEventListener('click', this.sideToolbarOnClose);
        this.resizeIcon.addEventListener('mouseover', this.resizeIconMouseOver);
        this.sideBarResizer.appendChild(this.resizeIcon);
    };
    /**
     * @private
     */
    NavigationPane.prototype.setResizeIconTop = function () {
        // tslint:disable-next-line:max-line-length
        if (this.sideBarToolbar && this.sideBarToolbar.clientHeight && this.resizeIcon.style.top === '') {
            this.resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.setCommentPanelResizeIconTop = function () {
        // tslint:disable-next-line:max-line-length
        if (this.commentPanelContainer && this.commentPanelContainer.clientHeight && this.commentPanelResizeIcon.style.top === '') {
            this.commentPanelResizeIcon.style.top = (this.commentPanelContainer.clientHeight) / 2 + 'px';
        }
    };
    Object.defineProperty(NavigationPane.prototype, "outerContainerWidth", {
        /**
         * @private
         */
        get: function () {
            if (!this.mainContainerWidth) {
                this.mainContainerWidth = this.pdfViewerBase.mainContainer.clientWidth;
            }
            return this.mainContainerWidth;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  @private
     */
    NavigationPane.prototype.getViewerContainerScrollbarWidth = function () {
        // tslint:disable-next-line:max-line-length
        return (this.pdfViewerBase.viewerContainer.offsetWidth + this.pdfViewerBase.viewerContainer.offsetLeft) - (this.pdfViewerBase.viewerContainer.clientWidth + this.pdfViewerBase.viewerContainer.offsetLeft);
    };
    Object.defineProperty(NavigationPane.prototype, "sideToolbarWidth", {
        /**
         *  @private
         */
        get: function () {
            if (this.sideBarToolbar) {
                return this.sideBarToolbar.clientWidth;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationPane.prototype, "sideBarContentContainerWidth", {
        /**
         * @private
         */
        get: function () {
            if (this.sideBarContentContainer) {
                return this.sideBarContentContainer.clientWidth;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationPane.prototype, "commentPanelContainerWidth", {
        /**
         *  @private
         */
        get: function () {
            if (this.commentPanelContainer) {
                return this.commentPanelContainer.offsetWidth;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    NavigationPane.prototype.updateViewerContainerOnClose = function () {
        var proxy = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'none';
            if (this.pdfViewer.enableRtl) {
                proxy.pdfViewerBase.viewerContainer.style.right = (proxy.sideToolbarWidth) + 'px';
            }
            else {
                proxy.pdfViewerBase.viewerContainer.style.left = (proxy.sideToolbarWidth) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.sideToolbarWidth - proxy.getViewerContainerRight()) + 'px';
            // tslint:disable-next-line:max-line-length
            proxy.pdfViewerBase.pageContainer.style.width = (proxy.pdfViewerBase.viewerContainer.offsetWidth - proxy.getViewerContainerScrollbarWidth()) + 'px';
            proxy.pdfViewerBase.updateZoomValue();
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.updateViewerContainerOnExpand = function () {
        var proxy = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'block';
            if (this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
            }
            else {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
            }
            // tslint:disable-next-line:max-line-length
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - this.getViewerContainerLeft() - this.getViewerContainerRight()) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
            if (proxy.pdfViewer.enableThumbnail) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
            }
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.getViewerContainerLeft = function () {
        return (this.sideToolbarWidth + this.sideBarContentContainerWidth);
    };
    /**
     * @private
     */
    NavigationPane.prototype.getViewerContainerRight = function () {
        return (this.commentPanelContainerWidth + this.commentPanelResizer.clientWidth);
    };
    /**
     * @private
     */
    NavigationPane.prototype.getViewerMainContainerWidth = function () {
        return this.pdfViewer.element.clientWidth - this.sideToolbarWidth;
    };
    /**
     * @private
     */
    NavigationPane.prototype.setThumbnailSelectionIconTheme = function () {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.add('e-pv-thumbnail-view-button-selection');
        }
    };
    NavigationPane.prototype.removeThumbnailSelectionIconTheme = function () {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.remove('e-pv-thumbnail-view-button-selection');
        }
    };
    NavigationPane.prototype.resetThumbnailIcon = function () {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-disable-icon');
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.resetThumbnailView = function () {
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.style.display = 'none';
            if (this.pdfViewer.enableRtl) {
                this.pdfViewerBase.viewerContainer.style.left = 1 + 'px';
            }
            else {
                this.pdfViewerBase.viewerContainer.style.left = (this.sideToolbarWidth) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - this.sideToolbarWidth - this.getViewerContainerRight()) + 'px';
            this.pdfViewerBase.pageContainer.style.width = this.pdfViewerBase.viewerContainer.clientWidth + 'px';
            this.thumbnailButton.setAttribute('disabled', 'disabled');
            this.removeThumbnailSelectionIconTheme();
            this.resetThumbnailIcon();
        }
    };
    NavigationPane.prototype.setBookmarkSelectionIconTheme = function () {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.add('e-pv-bookmark-button-selection');
        }
    };
    NavigationPane.prototype.removeBookmarkSelectionIconTheme = function () {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.remove('e-pv-bookmark-button-selection');
        }
    };
    NavigationPane.prototype.sideToolbarOnMouseup = function (event) {
        if (event.target === this.sideBarToolbar) {
            this.pdfViewerBase.focusViewerContainer();
        }
    };
    NavigationPane.prototype.sideBarTitleOnMouseup = function (event) {
        this.pdfViewerBase.focusViewerContainer();
    };
    /**
     * @private
     */
    NavigationPane.prototype.openBookmarkcontentInitially = function () {
        var proxy = this;
        if (document.getElementById(this.pdfViewer.element.id + '_thumbnail_view')) {
            document.getElementById(this.pdfViewer.element.id + '_thumbnail_view').style.display = 'none';
        }
        this.removeThumbnailSelectionIconTheme();
        this.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Bookmarks');
        this.sideBarContent.setAttribute('aria-label', 'Bookmark View Panel');
        this.pdfViewer.bookmarkViewModule.renderBookmarkcontent();
        if (this.sideBarContentContainer) {
            if (proxy.sideBarContentContainer.style.display !== 'none') {
                if (this.isThumbnailOpen) {
                    this.setBookmarkSelectionIconTheme();
                    this.isBookmarkOpen = true;
                    this.updateViewerContainerOnExpand();
                }
                else {
                    this.removeBookmarkSelectionIconTheme();
                    this.isBookmarkOpen = false;
                    this.updateViewerContainerOnClose();
                }
            }
            else {
                this.sideBarContent.focus();
                this.setBookmarkSelectionIconTheme();
                this.isBookmarkOpen = true;
                this.updateViewerContainerOnExpand();
            }
        }
        this.isThumbnailOpen = false;
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // tslint:disable-next-line
            var currentPageNumber = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.disableBookmarkButton = function () {
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.style.display = 'none';
            this.bookmarkButton.setAttribute('disabled', 'disabled');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-disable-icon');
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.clear = function () {
        this.removeBookmarkSelectionIconTheme();
        this.removeThumbnailSelectionIconTheme();
        this.closeCommentPanelContainer();
        if (this.commentsContentContainer) {
            this.commentsContentContainer.innerHTML = '';
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.destroy = function () {
        if (this.annotationMenuObj) {
            this.annotationMenuObj.destroy();
        }
    };
    NavigationPane.prototype.getModuleName = function () {
        return 'NavigationPane';
    };
    return NavigationPane;
}());
export { NavigationPane };
