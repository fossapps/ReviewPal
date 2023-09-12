import * as checklistActionCreator from "./checklistActionCreator"
import {ActionType, getType} from "typesafe-actions"

export interface CheckItem {
    text: string;
    done: boolean
}

export interface IChecklistState {
    global: Omit<CheckItem, "done">[]
    local: Record<string, CheckItem[]>
}

const initialState: IChecklistState = {global: [], local: {}}

// you can add items to global
// you set a PR and a checklist to set to done
// you can remove items from global
// you can remove a local item

export const checkListReducer = (state: IChecklistState = initialState, action: ActionType<typeof checklistActionCreator>): IChecklistState => {
    switch (action.type) {
        case getType(checklistActionCreator.addToChecklist):
            return addChecklistItem(action, state)
        case getType(checklistActionCreator.removeFromChecklist):
            return removeChecklistItem(action, state)
        case getType(checklistActionCreator.setChecklistDoneStatus):
            return setChecklistItemDoneStatus(action, state)
        default:
            return {...state}
    }
}

const addChecklistItem = (payload: ActionType<typeof checklistActionCreator.addToChecklist>, currentState: IChecklistState): IChecklistState => {
    if (payload.pullRequest) {
        const currentLocalState = {...currentState.local}
        if (currentLocalState[payload.pullRequest]) {
            currentLocalState[payload.pullRequest] = [...currentLocalState[payload.pullRequest], {
                done: false,
                text: payload.text
            }]
            return {global: currentState.global, local: {...currentLocalState}}
        }
        currentLocalState[payload.pullRequest] = [...currentState.global.map(x => ({...x, done: false})), {done: false, text: payload.text}]
        return {global: currentState.global, local: {...currentLocalState}}
    }
    return {global: [...currentState.global, {text: payload.text}], local: currentState.local}
}

const removeChecklistItem = (payload: ActionType<typeof checklistActionCreator.removeFromChecklist>, currentState: IChecklistState): IChecklistState => {
    if (!payload.pullRequest) {
        return {global: currentState.global.filter(x => x.text != payload.text), local: currentState.local}
    }
    const currentLocalState = {...currentState.local}
    if (!currentLocalState[payload.pullRequest]) {
        currentLocalState[payload.pullRequest] = currentState.global.filter(x => x.text != payload.text).map(x => ({...x, done: false}))

        return {global: currentState.global, local: {...currentLocalState}}
    }
    currentLocalState[payload.pullRequest] = [...currentLocalState[payload.pullRequest]].filter(x => x.text != payload.text)

    return {global: currentState.global, local: {...currentLocalState}}
}

const setChecklistItemDoneStatus = (payload: ActionType<typeof checklistActionCreator.setChecklistDoneStatus>, currentState: IChecklistState): IChecklistState => {
    const currentLocalState = currentState.local
    // if the current local state already has pull request, then it's easy, simply update the done status...
    if (!currentLocalState[payload.pullRequest]) {
        currentLocalState[payload.pullRequest] = currentState.global.map(x => ({...x, done: false}))
    }
    const items = currentLocalState[payload.pullRequest]
    currentLocalState[payload.pullRequest] = items.map(x => ({...x, done: x.text == payload.text ? payload.done : x.done}))

    return {global: currentState.global, local: {...currentLocalState}}
}

