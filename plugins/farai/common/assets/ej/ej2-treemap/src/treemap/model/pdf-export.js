import { createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';
/**
 * PdfExport module handles the export to pdf functionality for treemap.
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
     * This method is used to perform the export functionality for the rendered treemap.
     * @param type
     * @param fileName
     * @private
     */
    PdfExport.prototype.export = function (type, fileName, orientation, allowDownload) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var element = createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': _this.control.availableSize.width.toString(),
                    'height': _this.control.availableSize.height.toString()
                }
            });
            var isDownload = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            var url = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(_this.control.svgObject)], { type: 'image/svg+xml' }));
            var image = new Image();
            var context = element.getContext('2d');
            image.onload = (function () {
                context.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                var document = new PdfDocument();
                var imageString = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
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
    PdfExport.prototype.getModuleName = function () {
        // Returns te module name
        return 'PdfExport';
    };
    /**
     * To destroy the ImageExport.
     * @return {void}
     * @private
     */
    PdfExport.prototype.destroy = function (treemap) {
        // Destroy method performed here
    };
    return PdfExport;
}());
export { PdfExport };
