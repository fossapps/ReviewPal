import {checkListReducer, IChecklistState} from "./checklist";
import {addToChecklist, removeFromChecklist, setChecklistDoneStatus} from "./checklistActionCreator";

describe("checklist items behavior", () => {
    describe("initial state", () => {
        it("should return valid initial state", function () {
            const result = checkListReducer(undefined, {type: "my-random-action"} as any)
            expect(result.global).toHaveLength(0)
            expect(Object.keys(result.local)).toHaveLength(0)
        });
    })
    describe("Adding new items", () => {
        describe("global checks", () => {
            it("should be able to add checklist to global state when there's no PR", () => {
                let result = checkListReducer(undefined, addToChecklist({text: "Check title"}))
                expect(result.global[0].text == "Check title")
                result = checkListReducer(result, addToChecklist({text: "Check title 1"}))
                expect(result.global[1].text == "Check title 1")
                result = checkListReducer(result, addToChecklist({text: "Check title 2"}))
                expect(result.global[1].text == "Check title 2")
            });
            it("should be able to remove checklist from global state", () => {
                const initialPayload = {local: {}, global: [
                        {text: "todo1"},
                        {text: "todo2"},
                        {text: "todo3"},
                        {text: "todo4"},
                        {text: "todo5"},
                        {text: "todo6"}
                    ]}
                let result = checkListReducer(initialPayload, removeFromChecklist({text: "todo1"}))
                expect(result.global.filter(x => x.text == "todo1")).toHaveLength(0)
                result = checkListReducer(result, removeFromChecklist({text: "todo3"}))
                expect(result.global.filter(x => x.text == "todo3")).toHaveLength(0)
                result = checkListReducer(result, removeFromChecklist({text: "todo6"}))
                expect(result.global.filter(x => x.text == "todo6")).toHaveLength(0)
                result = checkListReducer(result, removeFromChecklist({text: "todo3"}))
                expect(result.global).toHaveLength(3)
                result = checkListReducer(result, removeFromChecklist({text: "todo4"}))
                expect(result.global.filter(x => x.text == "todo4")).toHaveLength(0)
            });
        })
        describe("local checks", () => {
            it("should add checks to PR's local state from global if PR doesn't already exist (all status is not done)", () => {
                const initial = {global: [{text: "1"}, {text: "2"}], local: {}}
                const result = checkListReducer(initial, addToChecklist({text: "3", pullRequest: "22"}))
                expect(result.local["22"]).toHaveLength(3)
                expect(result.local["22"][0].text).toBe("1")
                expect(result.local["22"][1].text).toBe("2")
                expect(result.local["22"][2].text).toBe("3")
                expect(result.local["22"].filter(x => x.done)).toHaveLength(0)
            });
            it("should add checks to PR's local state from global if PR already exist (preserves status and adds new value to not done)", () => {
                const initial = {global: [], local: {"22": [{text: "1", done: false}, {text: "2", done: true}]}}
                const result = checkListReducer(initial, addToChecklist({text: "3", pullRequest: "22"}))
                expect(result.local["22"]).toHaveLength(3)
                expect(result.local["22"][0].text).toBe("1")
                expect(result.local["22"][0].done).toBeFalsy()
                expect(result.local["22"][1].text).toBe("2")
                expect(result.local["22"][1].done).toBeTruthy()
                expect(result.local["22"][2].text).toBe("3")
                expect(result.local["22"][2].done).toBeFalsy()
            });
        })
    })
    describe("removing items", () => {
        describe("global checks", () => {
            it("should be able to remove items from any place", () => {
                const item: IChecklistState = {
                    global: [{text: "1"}, {text: "2"}, {text: "3"}, {text: "4"}],
                    local: {}
                }
                let result = checkListReducer(item, removeFromChecklist({text: "3"}))
                expect(result.global).toHaveLength(3)
                expect(result.global.filter(x => x.text == "3")).toHaveLength(0)
                result = checkListReducer(item, removeFromChecklist({text: "4"}))
                expect(result.global).toHaveLength(3)
                expect(result.global.filter(x => x.text == "4")).toHaveLength(0)
                result = checkListReducer(item, removeFromChecklist({text: "1"}))
                expect(result.global).toHaveLength(3)
                expect(result.global.filter(x => x.text == "1")).toHaveLength(0)
            });
            it("should be able to remove all items one by one", () => {
                const item: IChecklistState = {
                    global: [{text: "1"}, {text: "2"}, {text: "3"}, {text: "4"}],
                    local: {}
                }
                let result = checkListReducer(item, removeFromChecklist({text: "3"}))
                result = checkListReducer(result, removeFromChecklist({text: "4"}))
                result = checkListReducer(result, removeFromChecklist({text: "1"}))
                result = checkListReducer(result, removeFromChecklist({text: "2"}))
                expect(result.global).toHaveLength(0)
            });
        })
        describe("local checks", () => {
            it("should be able to initialize localstate from global excluding that 1 checklist", () => {
                const initialState: IChecklistState = {
                    global: [{text: "1"}, {text: "2"}],
                    local: {}
                }
                const result = checkListReducer(initialState, removeFromChecklist({text: "1", pullRequest: "55"}))
                expect(result.local["55"]).toHaveLength(1)
                expect(result.local["55"][0].text).toBe("2")
                expect(result.local["55"][0].done).toBeFalsy()
            });
            it("should be able to remove item from local state for a PR", () => {
                const initialState: IChecklistState = {
                    global: [{text: "1"}, {text: "2"}],
                    local: {"55": [{text: "1", done: true}, {text: "2", done: false}, {text: "3", done: false} ]}
                }
                let result = checkListReducer(initialState, removeFromChecklist({text: "2", pullRequest: "55"}))
                expect(result.local["55"]).toHaveLength(2)
                expect(result.local["55"][0].text).toBe("1")
                expect(result.local["55"][0].done).toBeTruthy()
                expect(result.local["55"][1].text).toBe("3")
                expect(result.local["55"][1].done).toBeFalsy()
                result = checkListReducer(result, removeFromChecklist({text: "3", pullRequest: "54"})) // don't remove current items
                expect(result.local["54"]).toHaveLength(2)
                expect(result.local["55"]).toHaveLength(2)
                expect(result.local["55"][0].text).toBe("1")
                expect(result.local["55"][0].done).toBeTruthy()
                expect(result.local["55"][1].text).toBe("3")
                expect(result.local["55"][1].done).toBeFalsy()
                result = checkListReducer(result, removeFromChecklist({text: "3", pullRequest: "55"}))
                result = checkListReducer(result, removeFromChecklist({text: "1", pullRequest: "55"}))
                expect(result.local["55"]).toHaveLength(0)
            });
        })
    })
    describe("setting items as done", () => {
        it("should initialize and set the correct value if the local state was empty", () => {
            const initialState: IChecklistState = {
                global: [{text: "1"}, {text: "2"}],
                local: {}
            }
            let result = checkListReducer(initialState, setChecklistDoneStatus({text: "2", pullRequest: "55", done: false}))
            expect(result.local["55"]).toHaveLength(2)
            expect(result.local["55"][0].text).toBe("1")
            expect(result.local["55"][1].text).toBe("2")
            expect(result.local["55"][0].done).toBeFalsy()
            expect(result.local["55"][1].done).toBeFalsy()
            result = checkListReducer(initialState, setChecklistDoneStatus({text: "2", pullRequest: "55", done: true}))
            expect(result.local["55"]).toHaveLength(2)
            expect(result.local["55"][0].done).toBeFalsy()
            expect(result.local["55"][1].done).toBeTruthy()
        });
        it("should set the correct value from the local state", () => {
            const initialState: IChecklistState = {
                global: [{text: "1"}, {text: "2"}],
                local: {"55": [{text: "1", done: true}, {text: "2", done: false}, {text: "3", done: true}, {text: "4", done: false}, {text: "5", done: false}, ]}
            }
            let result = checkListReducer(initialState, setChecklistDoneStatus({text: "2", pullRequest: "55", done: false}))
            assertLocalStatusAndText(result, "55", "2", false)
            assertLocalStatusAndText(result, "55", "1", true)
            assertLocalStatusAndText(result, "55", "3", true)
            assertLocalStatusAndText(result, "55", "4", false)
            assertLocalStatusAndText(result, "55", "5", false)
            result = checkListReducer(result, setChecklistDoneStatus({text: "3", pullRequest: "55", done: false}))
            assertLocalStatusAndText(result, "55", "2", false)
            assertLocalStatusAndText(result, "55", "1", true)
            assertLocalStatusAndText(result, "55", "3", false)
            assertLocalStatusAndText(result, "55", "4", false)
            assertLocalStatusAndText(result, "55", "5", false)
            result = checkListReducer(result, setChecklistDoneStatus({text: "1", pullRequest: "55", done: false}))
            assertLocalStatusAndText(result, "55", "2", false)
            assertLocalStatusAndText(result, "55", "1", false)
            assertLocalStatusAndText(result, "55", "3", false)
            assertLocalStatusAndText(result, "55", "4", false)
            assertLocalStatusAndText(result, "55", "5", false)
            result = checkListReducer(result, setChecklistDoneStatus({text: "1", pullRequest: "55", done: true}))
            assertLocalStatusAndText(result, "55", "2", false)
            assertLocalStatusAndText(result, "55", "1", true)
            assertLocalStatusAndText(result, "55", "3", false)
            assertLocalStatusAndText(result, "55", "4", false)
            assertLocalStatusAndText(result, "55", "5", false)
            result = checkListReducer(result, setChecklistDoneStatus({text: "2", pullRequest: "55", done: true}))
            assertLocalStatusAndText(result, "55", "2", true)
            assertLocalStatusAndText(result, "55", "1", true)
            assertLocalStatusAndText(result, "55", "3", false)
            assertLocalStatusAndText(result, "55", "4", false)
            assertLocalStatusAndText(result, "55", "5", false)
            result = checkListReducer(result, setChecklistDoneStatus({text: "3", pullRequest: "55", done: true}))
            assertLocalStatusAndText(result, "55", "2", true)
            assertLocalStatusAndText(result, "55", "1", true)
            assertLocalStatusAndText(result, "55", "3", true)
            assertLocalStatusAndText(result, "55", "4", false)
            assertLocalStatusAndText(result, "55", "5", false)
            result = checkListReducer(result, setChecklistDoneStatus({text: "4", pullRequest: "55", done: true}))
            result = checkListReducer(result, setChecklistDoneStatus({text: "5", pullRequest: "55", done: true}))
            assertLocalStatusAndText(result, "55", "2", true)
            assertLocalStatusAndText(result, "55", "1", true)
            assertLocalStatusAndText(result, "55", "3", true)
            assertLocalStatusAndText(result, "55", "4", true)
            assertLocalStatusAndText(result, "55", "5", true)
        });
    })
})
const assertLocalStatusAndText = (state: IChecklistState, pr: string, text: string, status: boolean)=> {
    expect(state.local[pr].filter(x => x.text == text)).toHaveLength(1)
    expect(state.local[pr].filter(x => x.text == text)[0].done).toBe(status)
}