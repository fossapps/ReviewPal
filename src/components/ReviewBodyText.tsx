import * as React from "react"
import {createPortal} from "react-dom";
import {LabelHTMLAttributes} from "react";

export const ReviewBodyText = (props: IProps): JSX.Element => {
    const targetElement = document.querySelector("#pull_requests_submit_review label input[type=radio][value=approve]") as HTMLInputElement;
    if (!targetElement) {
        return;
    }
    targetElement.disabled = !props.approvalButtonEnable;
    (targetElement.parentNode as HTMLElement).classList.add("tooltipped");
    (targetElement.parentNode as HTMLElement).setAttribute("aria-label", "You can't approve without all checklist being completed");
    return createPortal(
        <>{props.body}</>,
        document.getElementById("pull_request_review_body")
    );
}

interface IProps {
    body: string
    approvalButtonEnable: boolean
}
