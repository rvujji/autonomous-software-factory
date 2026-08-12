import {
    GraphEdge,
} from "./graph-edge.js";

import {
    GraphNode,
} from "./graph-node.js";

export interface Graph {

    readonly name: string;

    readonly version: string;

    readonly nodes: readonly GraphNode[];

    readonly edges: readonly GraphEdge[];

}