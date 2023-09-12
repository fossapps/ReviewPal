import React from "react";

interface IProps {
    pullRequest: string;
    total: number;
    completed: number;
}

export const Header = (props: IProps) => {
    const prHeader = props.pullRequest.replace("/files/", "").replace("/files", "").replace("https://github.com/", "").replace("https://www.github.com/", "").replace("/pull/", "#")
    return (
        <header>
            <h1>{prHeader}</h1>
            <h2>{props.completed}/{props.total} items</h2>
        </header>
    );
}
