import { Kanban } from '../base/kanban';
/**
 * Kanban CRUD module
 * @hidden
 */
export declare class Crud {
    private parent;
    /**
     * Constructor for CRUD module
     * @private
     */
    constructor(parent: Kanban);
    addCard(cardData: {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[]): void;
    updateCard(cardData: {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[], index?: number): void;
    deleteCard(cardData: string | number | {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[]): void;
    private priorityOrder;
}
