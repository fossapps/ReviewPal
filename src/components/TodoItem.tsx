import React, {ChangeEvent, useCallback, useRef} from "react";

interface ITodo {
    text: string;
    done: boolean
    onChange: (done: boolean) => void
}

export const TodoItem = (props: ITodo) => {
    const inputRef = useRef<HTMLInputElement>()
    const onChange = useCallback((): void => {
        props.onChange(inputRef.current.checked)
    }, [props.done])
    return (
        <label onClick={onChange} className="todo">
            <input ref={inputRef} className="todo__state" type="checkbox" checked={props.done}/>

            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 25"
                 className="todo__icon">
                <use xlinkHref="#todo__line" className="todo__line"></use>
                <use xlinkHref="#todo__box" className="todo__box"></use>
                <use xlinkHref="#todo__check" className="todo__check"></use>
                <use xlinkHref="#todo__circle" className="todo__circle"></use>
            </svg>

            <div className="todo__text">{props.text}</div>
        </label>
    );
}
