import {
    WorkItem,
} from "./WorkItem.js";

export interface WorkPlan {

    readonly projectName:
        string;

    readonly projectObjective:
        string;

    readonly workItems:
        readonly WorkItem[];

}