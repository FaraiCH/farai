import { createElement } from '@syncfusion/ej2-base';
import { LineTool, PolygonDrawingTool } from '../drawing/tools';
/**
 * The `LinkAnnotation` module is used to handle link annotation actions of PDF viewer.
 * @hidden
 */
var LinkAnnotation = /** @class */ (function () {
    /**
     * @private
     */
    function LinkAnnotation(pdfViewer, viewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * @private
     */
    // tslint:disable-next-line    
    LinkAnnotation.prototype.renderHyperlinkContent = function (data, pageIndex) {
        if (this.pdfViewer.enableHyperlink) {
            var hyperlinks = data.hyperlinks;
            var hyperlinksBounds = data.hyperlinkBounds;
            var linkAnnotation = data.linkAnnotation;
            var linkPage = data.linkPage;
            var annotationY = data.annotationLocation;
            if (hyperlinks && hyperlinks.length > 0 && hyperlinksBounds.length > 0) {
                this.renderWebLink(hyperlinks, hyperlinksBounds, pageIndex);
            }
            if (linkAnnotation && linkAnnotation.length > 0 && linkPage.length > 0) {
                this.renderDocumentLink(linkAnnotation, linkPage, annotationY, pageIndex);
            }
        }
    };
    LinkAnnotation.prototype.renderWebLink = function (hyperlinks, hyperlinksBounds, pageIndex) {
        var proxy = this;
        var _loop_1 = function (i) {
            var aTag = createElement('a', { id: 'weblinkdiv_' + i });
            // tslint:disable-next-line
            var rect = hyperlinksBounds[i];
            aTag = this_1.setHyperlinkProperties(aTag, rect);
            aTag.title = hyperlinks[i];
            aTag.setAttribute('href', hyperlinks[i]);
            if (this_1.pdfViewer.hyperlinkOpenState === 'CurrentTab') {
                aTag.target = '_self';
                aTag.onclick = function () {
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    }
                    else {
                        proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                        return true;
                    }
                };
                aTag.onmouseover = function () {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            }
            else if (this_1.pdfViewer.hyperlinkOpenState === 'NewTab') {
                aTag.target = '_blank';
                aTag.onclick = function () {
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    }
                    else {
                        proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                        return true;
                    }
                };
                aTag.onmouseover = function () {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            }
            else if (this_1.pdfViewer.hyperlinkOpenState === 'NewWindow') {
                aTag.onclick = function () {
                    if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                        return false;
                    }
                    else {
                        proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i], aTag);
                        window.open(hyperlinks[i], '_blank', 'scrollbars=yes,resizable=yes');
                        return false;
                    }
                };
                aTag.onmouseover = function () {
                    proxy.triggerHyperlinkEvent(aTag);
                };
            }
            var pageDiv = document.getElementById(this_1.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            pageDiv.appendChild(aTag);
        };
        var this_1 = this;
        for (var i = 0; i < hyperlinks.length; i++) {
            _loop_1(i);
        }
    };
    LinkAnnotation.prototype.triggerHyperlinkEvent = function (aTag) {
        if (this.pdfViewerBase.tool instanceof LineTool || this.pdfViewerBase.tool instanceof PolygonDrawingTool) {
            return false;
        }
        else {
            this.pdfViewer.fireHyperlinkHover(aTag);
            return true;
        }
    };
    LinkAnnotation.prototype.renderDocumentLink = function (linkAnnotation, linkPage, annotationY, pageIndex) {
        var proxy = this;
        var _loop_2 = function (i) {
            var aTag = createElement('a', { id: 'linkdiv_' + i });
            // tslint:disable-next-line
            var rect = linkAnnotation[i];
            aTag = this_2.setHyperlinkProperties(aTag, rect);
            aTag.setAttribute('href', 'javascript:void(0)');
            if (linkPage[i] !== undefined && linkPage[i] > 0) {
                var destPageHeight = (this_2.pdfViewerBase.pageSize[pageIndex].height);
                var destLocation = void 0;
                var scrollValue = void 0;
                if (annotationY.length !== 0) {
                    destLocation = (annotationY[i]);
                    // tslint:disable-next-line:max-line-length
                    scrollValue = this_2.pdfViewerBase.pageSize[linkPage[i]].top * this_2.pdfViewerBase.getZoomFactor() + ((destPageHeight - destLocation) * this_2.pdfViewerBase.getZoomFactor());
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    scrollValue = this_2.pdfViewerBase.pageSize[linkPage[i]].top * this_2.pdfViewerBase.getZoomFactor();
                }
                if (scrollValue !== undefined) {
                    aTag.name = scrollValue.toString();
                    aTag.onclick = function () {
                        if (proxy.pdfViewerBase.tool instanceof LineTool || proxy.pdfViewerBase.tool instanceof PolygonDrawingTool) {
                            return false;
                        }
                        else {
                            // tslint:disable-next-line:radix
                            proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(aTag.name);
                            return false;
                        }
                    };
                }
                var pageDiv = document.getElementById(this_2.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                pageDiv.appendChild(aTag);
            }
        };
        var this_2 = this;
        for (var i = 0; i < linkAnnotation.length; i++) {
            _loop_2(i);
        }
    };
    // tslint:disable-next-line
    LinkAnnotation.prototype.setHyperlinkProperties = function (aTag, rect) {
        aTag.className = 'e-pv-hyperlink';
        aTag.style.background = 'transparent';
        aTag.style.position = 'absolute';
        aTag.style.left = (rect.Left * this.pdfViewerBase.getZoomFactor()) + 'px';
        aTag.style.top = (rect.Top * this.pdfViewerBase.getZoomFactor()) + 'px';
        aTag.style.width = (rect.Width * this.pdfViewerBase.getZoomFactor()) + 'px';
        if (rect.Height < 0) {
            aTag.style.height = (-rect.Height * this.pdfViewerBase.getZoomFactor()) + 'px';
            aTag.style.top = ((rect.Top + rect.Height) * this.pdfViewerBase.getZoomFactor()) + 'px';
        }
        else {
            aTag.style.height = ((rect.Height < 0 ? -rect.Height : rect.Height) * this.pdfViewerBase.getZoomFactor()) + 'px';
        }
        aTag.style.color = 'transparent';
        return aTag;
    };
    /**
     * @private
     */
    LinkAnnotation.prototype.modifyZindexForTextSelection = function (pageNumber, isAdd) {
        if (this.pdfViewerBase.pageCount > 0) {
            var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
            if (pageDiv) {
                var pageChildNodes = pageDiv.childNodes;
                for (var i = 0; i < pageChildNodes.length; i++) {
                    var childElement = pageChildNodes[i];
                    if (childElement.tagName === 'A') {
                        if (isAdd) {
                            childElement.classList.add('e-pv-onselection');
                        }
                        else {
                            childElement.classList.remove('e-pv-onselection');
                        }
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    LinkAnnotation.prototype.modifyZindexForHyperlink = function (element, isAdd) {
        if (isAdd) {
            element.classList.add('e-pv-onselection');
        }
        else {
            element.classList.remove('e-pv-onselection');
        }
    };
    /**
     * @private
     */
    LinkAnnotation.prototype.destroy = function () {
        for (var i = 0; i < this.pdfViewerBase.pageCount - 1; i++) {
            var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + i);
            if (pageDiv) {
                var aElement = pageDiv.getElementsByTagName('a');
                if (aElement.length !== 0) {
                    for (var index = aElement.length - 1; index >= 0; index--) {
                        aElement[index].parentNode.removeChild(aElement[index]);
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    LinkAnnotation.prototype.getModuleName = function () {
        return 'LinkAnnotation';
    };
    return LinkAnnotation;
}());
export { LinkAnnotation };
