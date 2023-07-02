import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';
/**
 * Represent the print and export for gauge.
 * @hidden
 */
var PdfExport = /** @class */ (function () {
    /**
     * Constructor for gauge
     * @param control
     */
    function PdfExport(control) {
        this.control = control;
    }
    /**
     * To export the file as pdf format
     * @param type
     * @param fileName
     * @private
     */
    PdfExport.prototype.export = function (type, fileName, orientation, allowDownload) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var canvasElement = createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': _this.control.availableSize.width.toString(),
                    'height': _this.control.availableSize.height.toString()
                }
            });
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            var svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                _this.control.svgObject.outerHTML +
                '</svg>';
            var url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] :
                [(new XMLSerializer()).serializeToString(_this.control.svgObject)], { type: 'image/svg+xml' }));
            var image = new Image();
            var context = canvasElement.getContext('2d');
            image.onload = (function () {
                context.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                var document = new PdfDocument();
                var imageString = canvasElement.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                document.pageSettings.orientation = orientation;
                imageString = imageString.slice(imageString.indexOf(',') + 1);
                document.pages.add().graphics.drawImage(new PdfBitmap(imageString), 0, 0, (_this.control.availableSize.width - 60), _this.control.availableSize.height);
                if (allowDownload) {
                    document.save(fileName + '.pdf');
                    document.destroy();
                }
                else {
                    resolve(null);
                }
            });
            image.src = url;
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
     * To destroy the PdfExport.
     * @return {void}
     * @private
     */
    PdfExport.prototype.destroy = function (control) {
        /**
         * Destroy method performed here
         */
    };
    return PdfExport;
}());
export { PdfExport };
