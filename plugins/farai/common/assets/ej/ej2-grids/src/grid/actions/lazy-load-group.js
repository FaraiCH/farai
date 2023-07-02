import * as events from '../base/constant';
import { GroupLazyLoadRenderer } from '../renderer/group-lazy-load-renderer';
import { RenderType } from '../base/enum';
/**
 * Group lazy load class
 */
var LazyLoadGroup = /** @class */ (function () {
    /**
     * Constructor for Grid group lazy load module
     * @hidden
     */
    function LazyLoadGroup(parent, serviceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    LazyLoadGroup.prototype.getModuleName = function () {
        return 'lazyLoadGroup';
    };
    /**
     * @hidden
     */
    LazyLoadGroup.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
    };
    /**
     * @hidden
     */
    LazyLoadGroup.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialLoad, this.instantiateRenderer);
    };
    LazyLoadGroup.prototype.instantiateRenderer = function () {
        if (this.parent.height === 'auto') {
            this.parent.height = this.parent.pageSettings.pageSize * this.parent.getRowHeight();
        }
        var renderer = this.serviceLocator.getService('rendererFactory');
        if (this.parent.groupSettings.enableLazyLoading) {
            renderer.addRenderer(RenderType.Content, new GroupLazyLoadRenderer(this.parent, this.serviceLocator));
        }
    };
    /**
     * @hidden
     */
    LazyLoadGroup.prototype.destroy = function () {
        this.removeEventListener();
    };
    return LazyLoadGroup;
}());
export { LazyLoadGroup };
