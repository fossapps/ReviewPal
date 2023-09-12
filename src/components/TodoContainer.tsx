import React from "react";

export const TodoContainer = (props: { children: JSX.Element|JSX.Element[] }) => {
    return (
        <div className={"todo-list"}>
            {props.children}
        </div>
    )
}