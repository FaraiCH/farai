import { createElement, Browser } from '@syncfusion/ej2-base';
import { triggerDownload } from '../utils/helper';
/**
 * This module enables the export to Image functionality in Maps control.
 * @hidden
 */
var ImageExport = /** @class */ (function () {
    /**
     * Constructor for Maps
     * @param control
     */
    function ImageExport(control) {
        this.control = control;
    }
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     * @private
     */
    ImageExport.prototype.export = function (type, fileName, allowDownload) {
        var _this = this;
        // tslint:disable-next-line:max-func-body-length
        var promise = new Promise(function (resolve, reject) {
            var imageCanvasElement = createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': _this.control.availableSize.width.toString(),
                    'height': _this.control.availableSize.height.toString()
                }
            });
            var isDownload = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            var toolbarEle = document.getElementById(_this.control.element.id + '_ToolBar');
            var svgParent = document.getElementById(_this.control.element.id + '_Tile_SVG_Parent');
            var svgDataElement;
            if (!_this.control.isTileMap) {
                svgDataElement = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    _this.control.svgObject.outerHTML + '</svg>';
            }
            else {
                var tileSvg = document.getElementById(_this.control.element.id + '_Tile_SVG');
                svgDataElement = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    _this.control.svgObject.outerHTML + tileSvg.outerHTML + '</svg>';
            }
            var url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgDataElement] :
                [(new XMLSerializer()).serializeToString(_this.control.svgObject)], { type: 'image/svg+xml' }));
            if (type === 'SVG') {
                if (allowDownload) {
                    triggerDownload(fileName, type, url, isDownload);
                }
                else {
                    resolve(null);
                }
            }
            else {
                var image_1 = new Image();
                var ctxt_1 = imageCanvasElement.getContext('2d');
                if (!_this.control.isTileMap) {
                    image_1.onload = (function () {
                        ctxt_1.drawImage(image_1, 0, 0);
                        window.URL.revokeObjectURL(url);
                        if (allowDownload) {
                            triggerDownload(fileName, type, imageCanvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'), isDownload);
                        }
                        else {
                            if (type === 'PNG') {
                                resolve(imageCanvasElement.toDataURL('image/png'));
                            }
                            else if (type === 'JPEG') {
                                resolve(imageCanvasElement.toDataURL('image/jpeg'));
                            }
                        }
                    });
                    image_1.src = url;
                }
                else {
                    var imgxHttp = new XMLHttpRequest();
                    var imgTileLength_1 = _this.control.mapLayerPanel.tiles.length;
                    var _loop_1 = function (i) {
                        var tile = document.getElementById(_this.control.element.id + '_tile_' + (i - 1));
                        var exportTileImg = new Image();
                        exportTileImg.crossOrigin = 'Anonymous';
                        ctxt_1.fillStyle = _this.control.background ? _this.control.background : '#FFFFFF';
                        ctxt_1.fillRect(0, 0, _this.control.availableSize.width, _this.control.availableSize.height);
                        ctxt_1.font = _this.control.titleSettings.textStyle.size + ' Arial';
                        ctxt_1.fillStyle = document.getElementById(_this.control.element.id + '_Map_title').getAttribute('fill');
                        ctxt_1.fillText(_this.control.titleSettings.text, parseFloat(document.getElementById(_this.control.element.id + '_Map_title').getAttribute('x')), parseFloat(document.getElementById(_this.control.element.id + '_Map_title').getAttribute('y')));
                        exportTileImg.onload = (function () {
                            if (i === 0 || i === imgTileLength_1 + 1) {
                                if (i === 0) {
                                    ctxt_1.setTransform(1, 0, 0, 1, 0, 0);
                                    ctxt_1.rect(0, parseFloat(svgParent.style.top), parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
                                    ctxt_1.clip();
                                }
                                else {
                                    ctxt_1.setTransform(1, 0, 0, 1, parseFloat(svgParent.style.left), parseFloat(svgParent.style.top));
                                }
                            }
                            else {
                                ctxt_1.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + 10, parseFloat(tile.style.top) +
                                    (parseFloat(document.getElementById(_this.control.element.id + '_tile_parent').style.top)));
                            }
                            ctxt_1.drawImage(exportTileImg, 0, 0);
                            if (i === imgTileLength_1 + 1) {
                                localStorage.setItem('local-canvasImage', imageCanvasElement.toDataURL('image/png'));
                                var localBase64 = localStorage.getItem('local-canvasImage');
                                if (allowDownload) {
                                    triggerDownload(fileName, type, localBase64, isDownload);
                                    localStorage.removeItem('local-canvasImage');
                                }
                                else {
                                    if (type === 'PNG') {
                                        resolve(localBase64);
                                    }
                                    else if (type === 'JPEG') {
                                        resolve(imageCanvasElement.toDataURL('image/jpeg'));
                                    }
                                }
                            }
                        });
                        if (i === 0 || i === imgTileLength_1 + 1) {
                            if (i === 0) {
                                exportTileImg.src = url;
                            }
                            else {
                                setTimeout(function () {
                                    exportTileImg.src = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(document.getElementById(_this.control.element.id + '_Tile_SVG'))], { type: 'image/svg+xml' }));
                                    // tslint:disable-next-line:align
                                }, 300);
                            }
                        }
                        else {
                            imgxHttp.open('GET', tile.children[0].getAttribute('src'), true);
                            imgxHttp.send();
                            exportTileImg.src = tile.children[0].getAttribute('src');
                        }
                    };
                    for (var i = 0; i <= imgTileLength_1 + 1; i++) {
                        _loop_1(i);
                    }
                }
            }
        });
        return promise;
    };
    /**
     * Get module name.
     */
    ImageExport.prototype.getModuleName = function () {
        return 'ImageExport';
    };
    /**
     * To destroy the ImageExport.
     * @return {void}
     * @private
     */
    ImageExport.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
    };
    return ImageExport;
}());
export { ImageExport };
