/**
 * AriaService
 * @hidden
 */
var AriaService = /** @class */ (function () {
    function AriaService() {
    }
    AriaService.prototype.setOptions = function (target, options) {
        var props = Object.keys(options);
        for (var i = 0; i < props.length; i++) {
            setStateAndProperties(target, config[props[i]], options[props[i]]);
        }
    };
    AriaService.prototype.setExpand = function (target, expand) {
        setStateAndProperties(target, config.expand, expand);
    };
    AriaService.prototype.setSort = function (target, direction) {
        setStateAndProperties(target, config.sort, direction, typeof direction === 'boolean');
    };
    AriaService.prototype.setBusy = function (target, isBusy) {
        setStateAndProperties(target, config.busy, isBusy);
        setStateAndProperties(target, config.invalid, null, true);
    };
    AriaService.prototype.setGrabbed = function (target, isGrabbed, remove) {
        setStateAndProperties(target, config.grabbed, isGrabbed, remove);
    };
    AriaService.prototype.setDropTarget = function (target, isTarget) {
        setStateAndProperties(target, config.dropeffect, 'copy', !isTarget);
    };
    return AriaService;
}());
export { AriaService };
/**
 * @hidden
 */
function setStateAndProperties(target, attribute, value, remove) {
    if (remove && target) {
        target.removeAttribute(attribute);
        return;
    }
    if (target) {
        target.setAttribute(attribute, value);
    }
}
var config = {
    expand: 'aria-expanded',
    role: 'role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    sort: 'aria-sort',
    busy: 'aria-busy',
    invalid: 'aria-invalid',
    grabbed: 'aria-grabbed',
    dropeffect: 'aria-dropeffect',
    haspopup: 'aria-haspopup',
    level: 'aria-level',
    colcount: 'aria-colcount',
    rowcount: 'aria-rowcount'
};
