import {action, createAction, createCustomAction} from "typesafe-actions";

export interface IAddChecklistPayload {
    text: string
    pullRequest?: string
}

export const addToChecklist = createCustomAction(
    'CHECKLIST/ADD',
    (payload: IAddChecklistPayload) => ({ ...payload })
);

export const removeFromChecklist = createCustomAction(
    'CHECKLIST/DELETE',
    (payload: IAddChecklistPayload) => ({ ...payload })
);

export const setChecklistDoneStatus = createCustomAction(
    'CHECKLIST/SET_ITEM',
    (payload: Omit<IAddChecklistPayload, "pullRequest"> & {done: boolean, pullRequest: string}) => ({ ...payload })
);
