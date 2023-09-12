import "./content.scss"
import {Store} from "webext-redux"
import {render} from "react-dom"
import React from "react";
import {Provider} from "react-redux";
import {Popup} from "./components/Popup";

const store = new Store()
store.ready().then(() => {
    const targetID = "github_previews_content"
    const element = document.createElement("div")
    element.id = targetID
    document.body.appendChild(element)

    render(<Provider store={store}><Popup/></Provider>, document.getElementById(targetID))
})

