/**
 * @private
 */
var XmlHttpRequestHandler = /** @class */ (function () {
    function XmlHttpRequestHandler() {
        /**
         * A boolean value indicating whether the request should be sent asynchronous or not.
         * @default true
         */
        this.mode = true;
    }
    /**
     * Send the request to server
     * @param  {object} jsonObject - To send to service
     */
    XmlHttpRequestHandler.prototype.send = function (jsonObject) {
        var _this = this;
        this.xmlHttpRequest = new XMLHttpRequest();
        this.xmlHttpRequest.onreadystatechange = function () { _this.stateChange(_this); };
        this.xmlHttpRequest.onerror = function () { _this.error(_this); };
        if (!this.mode) {
            setTimeout(function () { _this.sendRequest(jsonObject); });
        }
        else {
            this.sendRequest(jsonObject);
        }
    };
    XmlHttpRequestHandler.prototype.sendRequest = function (jsonObj) {
        this.xmlHttpRequest.open('POST', this.url, true);
        if (this.contentType) {
            this.xmlHttpRequest.setRequestHeader('Content-Type', this.contentType);
        }
        this.setCustomAjaxHeaders();
        if (this.responseType) {
            this.xmlHttpRequest.responseType = this.responseType;
        }
        var data = jsonObj instanceof FormData ? jsonObj : JSON.stringify(jsonObj);
        this.xmlHttpRequest.send(data); // jshint ignore:line
    };
    XmlHttpRequestHandler.prototype.stateChange = function (proxyReq) {
        if (proxyReq.xmlHttpRequest.readyState === 4 && proxyReq.xmlHttpRequest.status === 200) {
            // tslint:disable-next-line
            var data = void 0;
            if (this.responseType) {
                data = proxyReq.xmlHttpRequest.response;
            }
            else {
                data = proxyReq.xmlHttpRequest.responseText;
            }
            // tslint:disable-next-line
            var result = {
                name: 'onSuccess',
                data: data,
                readyState: proxyReq.xmlHttpRequest.readyState,
                status: proxyReq.xmlHttpRequest.status
            };
            proxyReq.successHandler(result);
        }
        else if (proxyReq.xmlHttpRequest.readyState === 4 && !(proxyReq.xmlHttpRequest.status === 200)) { // jshint ignore:line)
            // tslint:disable-next-line
            var result = {
                name: 'onFailure',
                status: proxyReq.xmlHttpRequest.status,
                statusText: proxyReq.xmlHttpRequest.statusText,
                url: proxyReq.url
            };
            proxyReq.failureHandler(result);
        }
    };
    XmlHttpRequestHandler.prototype.error = function (proxyReq) {
        // tslint:disable-next-line
        var result = {
            name: 'onError',
            status: this.xmlHttpRequest.status,
            statusText: this.xmlHttpRequest.statusText
        };
        proxyReq.errorHandler(result);
    };
    // tslint:disable-next-line
    XmlHttpRequestHandler.prototype.successHandler = function (response) {
        if (this.onSuccess) {
            this.onSuccess(response);
        }
        return response;
    };
    // tslint:disable-next-line
    XmlHttpRequestHandler.prototype.failureHandler = function (response) {
        if (this.onFailure) {
            this.onFailure(response);
        }
        return response;
    };
    // tslint:disable-next-line
    XmlHttpRequestHandler.prototype.errorHandler = function (response) {
        if (this.onError) {
            this.onError(response);
        }
        return response;
    };
    XmlHttpRequestHandler.prototype.setCustomAjaxHeaders = function () {
        for (var i = 0; i < this.customHeaders.length; i++) {
            var header = this.customHeaders[i];
            for (var _i = 0, _a = Object.keys(header); _i < _a.length; _i++) {
                var key = _a[_i];
                this.xmlHttpRequest.setRequestHeader(key, header[key]);
            }
        }
    };
    return XmlHttpRequestHandler;
}());
export { XmlHttpRequestHandler };
