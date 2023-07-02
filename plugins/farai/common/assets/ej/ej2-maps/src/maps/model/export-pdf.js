import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';
/**
 * This module enables the export to PDF functionality in Maps control.
 * @hidden
 */
var PdfExport = /** @class */ (function () {
    /**
     * Constructor for Maps
     * @param control
     */
    function PdfExport(control) {
        this.control = control;
    }
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     * @private
     */
    PdfExport.prototype.export = function (type, fileName, allowDownload, orientation) {
        var _this = this;
        // tslint:disable-next-line:max-func-body-length
        var promise = new Promise(function (resolve, reject) {
            var canvasElement = createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': _this.control.availableSize.width.toString(),
                    'height': _this.control.availableSize.height.toString()
                }
            });
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            var svgParent = document.getElementById(_this.control.element.id + '_Tile_SVG_Parent');
            var svgData;
            var url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] :
                [(new XMLSerializer()).serializeToString(_this.control.svgObject)], { type: 'image/svg+xml' }));
            var pdfDocument = new PdfDocument();
            var image = new Image();
            var ctx = canvasElement.getContext('2d');
            if (!_this.control.isTileMap) {
                image.onload = (function () {
                    ctx.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);
                    if (type === 'PDF') {
                        var imageString = canvasElement.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                        pdfDocument.pageSettings.orientation = orientation;
                        imageString = imageString.slice(imageString.indexOf(',') + 1);
                        pdfDocument.pages.add().graphics.drawImage(new PdfBitmap(imageString), 0, 0, (_this.control.availableSize.width - 60), _this.control.availableSize.height);
                        if (allowDownload) {
                            pdfDocument.save(fileName + '.pdf');
                            pdfDocument.destroy();
                        }
                        else {
                            resolve(null);
                        }
                    }
                });
                image.src = url;
            }
            else {
                var xHttp = new XMLHttpRequest();
                var tileLength_1 = _this.control.mapLayerPanel.tiles.length;
                var _loop_1 = function (i) {
                    var tile = document.getElementById(_this.control.element.id + '_tile_' + (i - 1));
                    var tileImg = new Image();
                    tileImg.crossOrigin = 'Anonymous';
                    ctx.fillStyle = _this.control.background ? _this.control.background : '#FFFFFF';
                    ctx.fillRect(0, 0, _this.control.availableSize.width, _this.control.availableSize.height);
                    ctx.font = _this.control.titleSettings.textStyle.size + ' Arial';
                    ctx.fillStyle = document.getElementById(_this.control.element.id + '_Map_title').getAttribute('fill');
                    ctx.fillText(_this.control.titleSettings.text, parseFloat(document.getElementById(_this.control.element.id + '_Map_title').getAttribute('x')), parseFloat(document.getElementById(_this.control.element.id + '_Map_title').getAttribute('y')));
                    tileImg.onload = (function () {
                        if (i === 0 || i === tileLength_1 + 1) {
                            if (i === 0) {
                                ctx.setTransform(1, 0, 0, 1, 0, 0);
                                ctx.rect(0, parseFloat(svgParent.style.top), parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
                                ctx.clip();
                            }
                            else {
                                ctx.setTransform(1, 0, 0, 1, parseFloat(svgParent.style.left), parseFloat(svgParent.style.top));
                            }
                        }
                        else {
                            ctx.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + 10, parseFloat(tile.style.top) +
                                (parseFloat(document.getElementById(_this.control.element.id + '_tile_parent').style.top)));
                        }
                        ctx.drawImage(tileImg, 0, 0);
                        if (i === tileLength_1 + 1) {
                            if (type === 'PDF') {
                                localStorage.setItem('saved-image-example', canvasElement.toDataURL('image/jpeg'));
                                var x = localStorage.getItem('saved-image-example');
                                pdfDocument.pageSettings.orientation = orientation;
                                x = x.slice(x.indexOf(',') + 1);
                                pdfDocument.pages.add().graphics.drawImage(new PdfBitmap(x), 0, 0, (_this.control.availableSize.width - 60), _this.control.availableSize.height);
                                if (allowDownload) {
                                    pdfDocument.save(fileName + '.pdf');
                                    pdfDocument.destroy();
                                }
                                else {
                                    resolve(null);
                                }
                            }
                        }
                    });
                    if (i === 0 || i === tileLength_1 + 1) {
                        if (i === 0) {
                            tileImg.src = url;
                        }
                        else {
                            setTimeout(function () {
                                tileImg.src = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(document.getElementById(_this.control.element.id + '_Tile_SVG'))], { type: 'image/svg+xml' }));
                                // tslint:disable-next-line:align
                            }, 300);
                        }
                    }
                    else {
                        xHttp.open('GET', tile.children[0].getAttribute('src'), true);
                        xHttp.send();
                        tileImg.src = tile.children[0].getAttribute('src');
                    }
                };
                for (var i = 0; i <= tileLength_1 + 1; i++) {
                    _loop_1(i);
                }
            }
        });
        return promise;
    };
    /**
     * Get module name.
     */
    PdfExport.prototype.getModuleName = function () {
        return 'PdfExport';
    };
    /**
     * To destroy the PdfExports.
     * @return {void}
     * @private
     */
    PdfExport.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
    };
    return PdfExport;
}());
export { PdfExport };
