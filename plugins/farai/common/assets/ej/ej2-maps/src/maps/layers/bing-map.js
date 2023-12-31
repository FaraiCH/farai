/**
 * Bing map src doc
 */
var BingMap = /** @class */ (function () {
    function BingMap(maps) {
        this.maps = maps;
    }
    BingMap.prototype.getBingMap = function (tile, key, type, language, imageUrl, subDomains) {
        var quadKey = '';
        var subDomain;
        var maxZoom = Math.min(this.maps.tileZoomLevel, parseInt(this.maxZoom, 10));
        for (var i = maxZoom; i > 0; i--) {
            var digit = 0;
            var mask = 1 << (i - 1);
            if ((tile.x & mask) !== 0) {
                digit++;
            }
            if ((tile.y & mask) !== 0) {
                digit += 2;
            }
            quadKey = quadKey + '' + digit;
        }
        subDomain = subDomains[Math.min(parseInt(quadKey.substr(quadKey.length - 1, 1), 10), subDomains.length)];
        imageUrl = imageUrl.replace('{quadkey}', quadKey).replace('{subdomain}', subDomain);
        return imageUrl += '&mkt=' + language + '&ur=IN&Key=' + key;
    };
    return BingMap;
}());
export { BingMap };
