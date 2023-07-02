import { Dialog } from '@syncfusion/ej2-popups';
import { Kanban } from '../base/kanban';
import { CurrentAction } from '../base/type';
/**
 * Dialog module is used to perform card actions.
 * @hidden
 */
export declare class KanbanDialog {
    private parent;
    dialogObj: Dialog;
    private element;
    private formObj;
    private action;
    private storeElement;
    private cardData;
    /**
     * Constructor for dialog module
     * @private
     */
    constructor(parent: Kanban);
    openDialog(action: CurrentAction, data?: {
        [key: string]: Object;
    }): void;
    closeDialog(): void;
    private renderDialog;
    private getDialogContent;
    private getDialogFields;
    private getDialogButtons;
    private renderComponents;
    private onBeforeDialogOpen;
    private onBeforeDialogClose;
    private getIDType;
    private applyFormValidation;
    private createTooltip;
    private destroyToolTip;
    private dialogButtonClick;
    private getFormElements;
    private getColumnName;
    private getValueFromElement;
    private destroyComponents;
    destroy(): void;
}
