import { Component, ChildProperty, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { EmitType, Effect } from '@syncfusion/ej2-base';
import { BaseEventArgs } from '@syncfusion/ej2-base';
import { ButtonModel } from '@syncfusion/ej2-buttons';
import { ToastModel, ButtonModelPropsModel, ToastPositionModel } from './toast-model';
import { ToastAnimationsModel, ToastAnimationSettingsModel } from './toast-model';
/**
 * Provides information about a SanitizeSelectors.
 */
export interface SanitizeSelectors {
    /** Returns the tags. */
    tags?: string[];
    /** Returns the attributes. */
    attributes?: SanitizeRemoveAttrs[];
}
/**
 * Provides information about a BeforeSanitizeHtml event.
 */
export interface BeforeSanitizeHtmlArgs {
    /** Illustrates whether the current action needs to be prevented or not. */
    cancel?: boolean;
    /** It is a callback function and executed it before our inbuilt action. It should return HTML as a string.
     * @function
     * @param {string} value - Returns the value.
     * @returns {string}
     */
    helper?: Function;
    /** Returns the selectors object which carrying both tags and attributes selectors to block list of cross-site scripting attack.
     *  Also possible to modify the block list in this event.
     */
    selectors?: SanitizeSelectors;
}
/**
 * Provides information about a SanitizeRemoveAttributes.
 */
export interface SanitizeRemoveAttrs {
    /** Defines the attribute name to sanitize */
    attribute?: string;
    /** Defines the selector that sanitize the specified attributes within the selector */
    selector?: string;
}
/**
 * Specifies the options for positioning the Toast in Y axis.
 */
export declare type PositionY = 'Top' | 'Bottom';
/**
 * Specifies the options for positioning the Toast in X axis.
 */
export declare type PositionX = 'Left' | 'Right' | 'Center';
/**
 * Specifies the event arguments of Toast click.
 */
export interface ToastClickEventArgs extends BaseEventArgs {
    /** Defines the Toast element. */
    element: HTMLElement;
    /**
     * Defines the Toast object.
     * @deprecated
     */
    toastObj?: Toast;
    /** Defines the prevent action for Toast click event. */
    cancel: boolean;
    /** Defines the close action for click or tab on the Toast. */
    clickToClose: boolean;
    /** Defines the current event object. */
    originalEvent: Event;
}
/**
 * Specifies the event arguments of Toast before open.
 */
export interface ToastBeforeOpenArgs extends BaseEventArgs {
    /**
     * Defines the Toast object.
     * @deprecated
     */
    toastObj?: Toast;
    /** Defines current Toast model properties as options. */
    options?: ToastModel;
    /** Defines the Toast element. */
    element: HTMLElement;
    /** Defines the prevent action for before opening toast. */
    cancel: boolean;
}
/**
 * Toast Collection model
 * @hidden
 */
export interface CollectionToast extends ToastModel {
    /**
     * Element of the current toast
     */
    element?: HTMLElement[];
}
/**
 * Specifies the event arguments of Toast open.
 */
export interface ToastOpenArgs extends BaseEventArgs {
    /**
     * Defines the Toast object.
     * @deprecated
     */
    toastObj?: Toast;
    /** Defines current Toast model properties as options. */
    options?: ToastModel;
    /** Defines the Toast element. */
    element: HTMLElement;
}
/**
 * Specifies the event arguments of Toast close.
 */
export interface ToastCloseArgs extends BaseEventArgs {
    /** Defines the Toast container element. */
    toastContainer: HTMLElement;
    /** Defines current Toast model properties as options. */
    options?: ToastModel;
    /**
     * Defines the Toast object.
     * @deprecated
     */
    toastObj?: Toast;
}
/**
 * An object that is used to configure the Toast X Y positions.
 */
export declare class ToastPosition extends ChildProperty<ToastPosition> {
    /**
     * Specifies the position of the Toast notification with respect to the target container's left edge.
     * @default 'Left'
     * @aspType string
     * @blazorType string
     */
    X: PositionX | number | string;
    /**
     * Specifies the position of the Toast notification with respect to the target container's top edge.
     * @default 'Top'
     * @aspType string
     * @blazorType string
     */
    Y: PositionY | number | string;
}
/**
 * An object that is used to configure the action button model properties and event.
 */
export declare class ButtonModelProps extends ChildProperty<ButtonModelProps> {
    /**
     * Specifies the Button component model properties to render the Toast action buttons.
     * ```html
     * <div id="element"> </div>
     * ```
     * ```typescript
     * let toast: Toast =  new Toast({
     *      buttons:
     *      [{
     *         model: { content:`Button1`, cssClass: `e-success` }
     *      }]
     * });
     * toast.appendTo('#element');
     * ```
     *
     * @default null
     */
    model: ButtonModel;
    /**
     * Specifies the click event binding of action buttons created within Toast.
     * @event
     * @blazorProperty 'Clicked'
     * @blazorType Microsoft.AspNetCore.Components.Web.MouseEventArgs
     */
    click: EmitType<Event>;
}
/**
 * An object that is used to configure the animation object of Toast.
 */
export declare class ToastAnimations extends ChildProperty<ToastAnimations> {
    /**
     * Specifies the type of animation.
     * @default 'FadeIn'
     * @aspType string
     */
    effect: Effect;
    /**
     * Specifies the duration to animate.
     * @default 600
     */
    duration: number;
    /**
     * Specifies the animation timing function.
     * @default 'ease'
     */
    easing: string;
}
/**
 * An object that is used to configure the show/hide animation settings of Toast.
 */
export declare class ToastAnimationSettings extends ChildProperty<ToastAnimationSettings> {
    /**
     * Specifies the animation to appear while showing the Toast.
     * @default { effect: 'FadeIn', duration: 600, easing: 'ease' }
     */
    show: ToastAnimationsModel;
    /**
     * Specifies the animation to appear while hiding the Toast.
     * @default { effect: 'FadeOut', duration: 600, easing: 'ease' }
     */
    hide: ToastAnimationsModel;
}
/**
 * The Toast is a notification pop-up that showing on desired position which can provide an information to the user.
 *  * ```html
 * <div id="toast"/>
 * <script>
 *   var toastObj = new Toast();
 *   toastObj.appendTo("#toast");
 * </script>
 * ```
 */
export declare class Toast extends Component<HTMLElement> implements INotifyPropertyChanged {
    private toastContainer;
    private toastEle;
    private progressBarEle;
    private intervalId;
    private progressObj;
    private contentTemplate;
    private toastTemplate;
    private customPosition;
    private isDevice;
    private innerEle;
    private toastCollection;
    private l10n;
    private refElement;
    private initRenderClass;
    /**
     * Initializes a new instance of the Toast class.
     * @param options  - Specifies Toast model properties as options.
     * @param element  - Specifies the element that is rendered as a Toast.
     */
    constructor(options?: ToastModel, element?: HTMLElement);
    /**
     * Specifies the width of the Toast in pixels/numbers/percentage. Number value is considered as pixels.
     * In mobile devices, default width is considered as `100%`.
     * @default '300'
     * @blazorType string
     */
    width: string | number;
    /**
     * Specifies the height of the Toast in pixels/number/percentage. Number value is considered as pixels.
     * @default 'auto'
     * @blazorType string
     */
    height: string | number;
    /**
     * Specifies the title to be displayed on the Toast.
     * Works only with string values.
     * @default null
     */
    title: string;
    /**
     * Specifies the content to be displayed on the Toast.
     * Accepts selectors, string values and HTML elements.
     * @default null
     * @blazorType string
     */
    content: string | HTMLElement;
    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default true
     */
    enableHtmlSanitizer: boolean;
    /**
     * Defines CSS classes to specify an icon for the Toast which is to be displayed at top left corner of the Toast.
     * @default null
     */
    icon: string;
    /**
     * Defines single/multiple classes (separated by space) to be used for customization of Toast.
     * @default null
     */
    cssClass: string;
    /**
     * Specifies the HTML element/element ID as a string that can be displayed as a Toast.
     * The given template is taken as preference to render the Toast, even if the built-in properties such as title and content are defined.
     *
     * {% codeBlock src='toast/template/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    template: string;
    /**
     * Specifies the newly created Toast message display order while multiple toast's are added to page one after another.
     * By default, newly added Toast will be added after old Toast's.
     * @default true
     */
    newestOnTop: boolean;
    /**
     * Specifies whether to show the close button in Toast message to close the Toast.
     * @default false
     */
    showCloseButton: boolean;
    /**
     * Specifies whether to show the progress bar to denote the Toast message display timeout.
     * @default false
     */
    showProgressBar: boolean;
    /**
     * Specifies the Toast display time duration on the page in milliseconds.
     * - Once the time expires, Toast message will be removed.
     * - Setting 0 as a time out value displays the Toast on the page until the user closes it manually.
     * @default 5000
     */
    timeOut: number;
    /**
     * Specifies the Toast display time duration after interacting with the Toast.
     * @default 1000
     */
    extendedTimeout: number;
    /**
     * Specifies the animation configuration settings for showing and hiding the Toast.
     *
     * {% codeBlock src='toast/animation/index.md' %}{% endcodeBlock %}
     *
     * @blazorType ToastAnimationSettings
     * @default { show: { effect: 'FadeIn', duration: 600, easing: 'linear' },
     * hide: { effect: 'FadeOut', duration: 600, easing: 'linear' }}
     */
    animation: ToastAnimationSettingsModel;
    /**
     * Specifies the position of the Toast message to be displayed within target container.
     * In the case of multiple Toast display, new Toast position will not update on dynamic change of property values
     * until the old Toast messages removed.
     * X values are: Left , Right ,Center
     * Y values are: Top , Bottom
     *
     * {% codeBlock src='toast/position/index.md' %}{% endcodeBlock %}
     *
     * @default { X: "Left", Y: "Top" }
     * @blazorType ToastPosition
     */
    position: ToastPositionModel;
    /**
     * Specifies the collection of Toast action `buttons` to be rendered with the given
     * Button model properties and its click action handler.
     *
     * {% codeBlock src='toast/buttons/index.md' %}{% endcodeBlock %}
     *
     * @default [{}]
     * @deprecated
     */
    buttons: ButtonModelPropsModel[];
    /**
     * Specifies the target container where the Toast to be displayed.
     * Based on the target, the positions such as `Left`, `Top` will be applied to the Toast.
     * The default value is null, which refers the `document.body` element.
     * @default null
     * @aspType string
     * @blazorType string
     */
    target: HTMLElement | Element | string;
    /**
     * Triggers the event after the Toast gets created.
     * @event
     * @blazorProperty 'Created'
     */
    created: EmitType<Event>;
    /**
     * Event triggers before sanitize the value.
     * @event
     * @blazorProperty 'OnSanitizeHtml'
     */
    beforeSanitizeHtml: EmitType<BeforeSanitizeHtmlArgs>;
    /**
     * Triggers the event after the Toast gets destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    destroyed: EmitType<Event>;
    /**
     * Triggers the event after the Toast shown on the target container.
     * @event
     * @blazorProperty 'Opened'
     */
    open: EmitType<ToastOpenArgs>;
    /**
     * Triggers the event before the toast shown.
     * @event
     * @blazorProperty 'OnOpen'
     */
    beforeOpen: EmitType<ToastBeforeOpenArgs>;
    /**
     * Trigger the event after the Toast hides.
     * @event
     * @blazorProperty 'Closed'
     */
    close: EmitType<ToastCloseArgs>;
    /**
     * The event will be fired while clicking on the Toast.
     * @event
     * @blazorProperty 'OnClick'
     */
    click: EmitType<ToastClickEventArgs>;
    /**
     * Gets the Component module name.
     * @private
     */
    getModuleName(): string;
    /**
     * Gets the persisted state properties of the Component.
     */
    protected getPersistData(): string;
    /**
     * Removes the component from the DOM and detaches all its related event handlers, attributes and classes.
     */
    destroy(): void;
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void;
    /**
     * Initialize the component rendering
     * @private
     */
    render(): void;
    /**
     * To show Toast element on a document with the relative position.
     * @param  {ToastModel} toastObj? - To show Toast element on screen.
     * @returns void
     * @deprecated
     */
    show(toastObj?: ToastModel): void;
    /**
     * @hidden
     * @deprecated
     * This method applicable for blazor alone.
     */
    showToast(id: string, toastObj?: ToastModel): void;
    private isToastModel;
    private swipeHandler;
    private templateChanges;
    private setCSSClass;
    private setWidthHeight;
    private templateRendering;
    /**
     * @hidden
     */
    sanitizeHelper(value: string): string;
    /**
     * To Hide Toast element on a document.
     * To Hide all toast element when passing 'All'.
     * @param  {HTMLElement| Element| string} element? - To Hide Toast element on screen.
     * @returns void
     */
    hide(element?: HTMLElement | Element | string): void;
    private fetchEle;
    private clearProgress;
    private clearContainerPos;
    private clearContentTemplate;
    private clearToastTemplate;
    private isBlazorServer;
    private destroyToast;
    private personalizeToast;
    private setAria;
    private setPositioning;
    private setCloseButton;
    private setProgress;
    private toastHoverAction;
    private delayedToastProgress;
    private updateProgressBar;
    private setIcon;
    private setTitle;
    private setContent;
    private appendMessageContainer;
    private actionButtons;
    private appendToTarget;
    private clickHandler;
    private keyDownHandler;
    private displayToast;
    private getContainer;
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp: ToastModel, oldProp: ToastModel): void;
}
