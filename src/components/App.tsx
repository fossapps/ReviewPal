import React, {ChangeEvent, useMemo} from "react";
import {Header} from "./Header";
import {TodoItem} from "./TodoItem";
import {TodoContainer} from "./TodoContainer";
import {connect} from "react-redux";
import {CheckItem} from "../store/checklist";
import {IStore} from "../store";
import {Dispatch} from "redux";
import {addToChecklist, removeFromChecklist, setChecklistDoneStatus} from "../store/checklistActionCreator";
import {ReviewBodyText} from "./ReviewBodyText";

interface IStateToProps {
    checksForThisPR: CheckItem[]
    completed: number;
    total: number;
    currentPR: string;
}

interface IDispatchToProps {
    setDoneStatus: (pr: string, check: string, done: boolean) => void
    addCheck: (pr: string, check: string) => void
    removeCheck: (pr: string, check: string) => void
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
    }
    private handleKeyDown(e): void {
        if (e.key === 'Enter' && this.state.textBoxValue !== "" && this.props.checksForThisPR.filter(x => x.text == this.state.textBoxValue).length == 0) {
            this.props.addCheck(this.props.currentPR, this.state.textBoxValue)
            this.setState({textBoxValue: ""})
        }
    }
    private handleChange(e: ChangeEvent<HTMLInputElement>): void {
        this.setState({textBoxValue: e.target.value})
    }

    render() {
        const body = `${this.props.total == this.props.completed ? "Approving with the following checks" : "Some checks are missing"}:\n${this.props.checksForThisPR.map(x => `- [${x.done ? "x" : " "}] ${x.text}`).join("\n")}`

        return (
            <>
                <div className={"github_reviews_content_container"}>
                    <div className={"content"}>
                        <svg viewBox="0 0 0 0" style={{position: "absolute", zIndex: -1, opacity: 0}}>
                            <defs>
                                <linearGradient id="boxGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="25" y2="25">
                                    <stop offset="0%"   stopColor="#27FDC7"/>
                                    <stop offset="100%" stopColor="#0FC0F5"/>
                                </linearGradient>

                                <linearGradient id="lineGradient">
                                    <stop offset="0%"    stopColor="#0FC0F5"/>
                                    <stop offset="100%"  stopColor="#27FDC7"/>
                                </linearGradient>

                                <path id="todo__line" stroke="url(#lineGradient)" d="M21 12.3h168v0.1z"></path>
                                <path id="todo__box" stroke="url(#boxGradient)" d="M21 12.7v5c0 1.3-1 2.3-2.3 2.3H8.3C7 20 6 19 6 17.7V7.3C6 6 7 5 8.3 5h10.4C20 5 21 6 21 7.3v5.4"></path>
                                <path id="todo__check" stroke="url(#boxGradient)" d="M10 13l2 2 5-5"></path>
                                <circle id="todo__circle" cx="13.5" cy="12.5" r="10"></circle>
                            </defs>
                        </svg>
                        <Header pullRequest={this.props.currentPR} total={this.props.total} completed={this.props.completed}/>
                        <input className={"todo_input"} placeholder={"Enter a new item (then press enter)"} onKeyUp={this.handleKeyDown} value={this.state.textBoxValue} onChange={this.handleChange}/>
                        <TodoContainer>
                            {this.props.checksForThisPR.map(x => (
                                <TodoItem key={x.text} text={x.text} done={x.done} onChange={(done) => this.props.setDoneStatus(this.props.currentPR, x.text, done)} />
                            ))}
                        </TodoContainer>
                    </div>
                </div>
                <ReviewBodyText approvalButtonEnable={this.props.total == this.props.completed} body={body} />
            </>
        )
    }
}

const mapStateToProps = (state: Pick<IStore, "checklist">): IStateToProps => {
    const currentPR = location.href.replace("/files/", "").replace("/files", "")
    const checksForThisPR: CheckItem[] = state.checklist?.local[currentPR]?.length
        ? state.checklist.local[currentPR]
        : state.checklist.global.map(x => ({...x, done: false}));
    // find the undone first, then add the done ones...
    return {
        checksForThisPR: checksForThisPR,
        completed: checksForThisPR.filter(x => x.done).length,
        total: checksForThisPR.length,
        currentPR
    }
}
const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
    return {
        setDoneStatus: (pr: string, check: string, done: boolean) => {
            dispatch(setChecklistDoneStatus({pullRequest: pr, text: check, done}))
        },
        addCheck: (pr: string, check: string) => {
            dispatch(addToChecklist({pullRequest: pr, text: check}))
        },
        removeCheck: (pr: string, check: string) => {
            dispatch(removeFromChecklist({text: check, pullRequest: pr}))
        }
    }
}
const connected = connect(mapStateToProps, mapDispatchToProps)(App);

export {connected as App}
