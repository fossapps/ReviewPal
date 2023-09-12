import React, {ChangeEvent} from "react";
import {Header} from "./Header";
import {TodoItem} from "./TodoItem";
import {TodoContainer} from "./TodoContainer";
import {connect} from "react-redux";
import {CheckItem} from "../store/checklist";
import {IStore} from "../store";
import {Dispatch} from "redux";
import {addToChecklist, removeFromChecklist} from "../store/checklistActionCreator";

interface IStateToProps {
    total: number;
    checks: CheckItem[]
    prList: string[]
}

interface IDispatchToProps {
    addCheck: (check: string) => void
    removeCheck: (check: string) => void
}

interface IProps extends IStateToProps, IDispatchToProps {

}

interface IState {
    textBoxValue: string
}

class App extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {textBoxValue: ""}
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.exportToClipboard = this.exportToClipboard.bind(this)
    }

    private handleKeyDown(e): void {
        if (e.key === 'Enter' && this.state.textBoxValue !== "" && this.props.checks.filter(x => x.text == this.state.textBoxValue).length == 0) {
            this.props.addCheck(this.state.textBoxValue)
            this.setState({textBoxValue: ""})
        }
    }

    private handleChange(e: ChangeEvent<HTMLInputElement>): void {
        this.setState({textBoxValue: e.target.value})
    }
    private exportToClipboard() {
        const config = JSON.stringify(this.props.checks.map(x => x.text));
        navigator.clipboard.writeText(config).catch(e => console.error)
    }

    render() {
        return (
            <>
                <div className={"github_reviews_popup"}>
                    <svg viewBox="0 0 0 0" style={{position: "absolute", zIndex: -1, opacity: 0}}>
                        <defs>
                            <linearGradient id="boxGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="25"
                                            y2="25">
                                <stop offset="0%" stopColor="#27FDC7"/>
                                <stop offset="100%" stopColor="#0FC0F5"/>
                            </linearGradient>

                            <linearGradient id="lineGradient">
                                <stop offset="0%" stopColor="#0FC0F5"/>
                                <stop offset="100%" stopColor="#27FDC7"/>
                            </linearGradient>

                            <path id="todo__line" stroke="url(#lineGradient)" d="M21 12.3h168v0.1z"></path>
                            <path id="todo__box" stroke="url(#boxGradient)"
                                  d="M21 12.7v5c0 1.3-1 2.3-2.3 2.3H8.3C7 20 6 19 6 17.7V7.3C6 6 7 5 8.3 5h10.4C20 5 21 6 21 7.3v5.4"></path>
                            <path id="todo__check" stroke="url(#boxGradient)" d="M10 13l2 2 5-5"></path>
                            <circle id="todo__circle" cx="13.5" cy="12.5" r="10"></circle>
                        </defs>
                    </svg>
                    <Header pullRequest={"global"} total={this.props.total} completed={0}/>
                    <button onClick={this.exportToClipboard}>Export config to clipboard</button>
                    <input className={"todo_input"} placeholder={"Enter a new item (then press enter)"}
                           onKeyUp={this.handleKeyDown} value={this.state.textBoxValue} onChange={this.handleChange}/>
                    <TodoContainer>
                        {this.props.checks.map(x => (
                            <TodoItem key={x.text} text={x.text} done={x.done} onChange={(done) => {
                                this.props.removeCheck(x.text)
                            }}/>
                        ))}
                    </TodoContainer>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state: Pick<IStore, "checklist">): IStateToProps => {
    const checksForThisPR: CheckItem[] = state.checklist.global.map(x => ({...x, done: false}));
    return {
        checks: checksForThisPR,
        total: checksForThisPR.length,
        prList: Object.keys(state.checklist.local)
    }
}
const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
    return {
        addCheck: (check: string) => {
            dispatch(addToChecklist({text: check}))
        },
        removeCheck: (check: string) => {
            dispatch(removeFromChecklist({text: check}))
        }
    }
}
const connected = connect(mapStateToProps, mapDispatchToProps)(App);

export {connected as Popup}
