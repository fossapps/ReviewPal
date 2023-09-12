import "./content.scss"
import {Store} from "webext-redux"
import {render, createPortal} from "react-dom"
import {App} from "./components/App";
import React from "react";
import {Provider} from "react-redux";

const store = new Store()
store.ready().then(() => {
    const targetID = "github_previews_content"
    const element = document.createElement("div")
    element.id = targetID
    document.body.appendChild(element)

    render(<Provider store={store}><App /></Provider>, document.getElementById(targetID))
}).catch(console.error)
