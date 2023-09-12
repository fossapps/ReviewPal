import {wrapStore} from "webext-redux"
import {createEnhancedStore} from "./store";
chrome.storage.sync.get().then(x => {
    wrapStore(createEnhancedStore(x))
}).catch(reason => console.error)
