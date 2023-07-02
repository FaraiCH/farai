import { IGrid, IAction } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
/**
 * Group lazy load class
 */
export declare class LazyLoadGroup implements IAction {
    private parent;
    private serviceLocator;
    /**
     * Constructor for Grid group lazy load module
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**
     * @hidden
     */
    addEventListener(): void;
    /**
     * @hidden
     */
    removeEventListener(): void;
    private instantiateRenderer;
    /**
     * @hidden
     */
    destroy(): void;
}
