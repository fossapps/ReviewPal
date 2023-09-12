import {checkListReducer, IChecklistState} from "./checklist";
import {applyMiddleware, CombinedState, combineReducers, compose, createStore, Reducer, Store} from "redux";
export interface IStore {
    checklist: IChecklistState
}

export const rootReducer: Reducer<CombinedState<IStore>> = combineReducers<IStore>({
    checklist: checkListReducer
})

const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func(...args); }, timeout);
    };
}
function saveInput(){
    console.log('Saving data');
}
const processChange = debounce(() => saveInput());

export const createEnhancedStore = (currentState?: Partial<IStore>): Store<IStore> => {
    const composeEnhancers = (typeof window === "object" &&
        (typeof (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function") &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({shouldHotReload: false})) || compose;
    const middlewares = []
    if (currentState == undefined) {
        currentState = {checklist: {global: [], local: {}}}
    }

    const store = createStore(rootReducer, currentState, composeEnhancers(
        applyMiddleware(...middlewares)
    ));
    const debouncedSave = debounce(() => {
        const state = store.getState();
        console.log("saving items")
        chrome.storage.sync.set(state, function(){
            // now that the data is saved, we can then dispatch a saved event, just to show on the UI maybe?
            // but make sure this data itself isn't actually saved (verbose)
            // change the current implement to use debounce instead.
        });
    }, 500)
    store.subscribe(debouncedSave)
    return store
}