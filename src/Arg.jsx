import React, { useEffect, useState, useRef } from "react";
// import { find } from 'tree-visit'
import {getNodeCount, addToTree} from "./treeFuncs";

// const getChildren = (node) => node.children || []


export default function Arg({node, debate, setDebate, last=false}) {
    let childs = node.children.map(child => <Arg
        key={child.id}
        node={child}
        debate={debate}
        setDebate={setDebate}
        last={child === node.children[node.children.length - 1]}
    />)

    var newNode = {
        name: "",
        id: getNodeCount(debate),
        children: []
    }

    const handleAddRebuttal = e => setDebate(addToTree(debate, newNode, node.id))

    const handleAddSiblingRebuttal = e => setDebate(addToTree(debate, newNode, node.id, true))

    return(<>
        <details open>
            <summary>
                <textarea defaultValue={node.name}></textarea>
                <button onClick={handleAddRebuttal}>Add Rebuttal</button>
                {last && <button onClick={handleAddSiblingRebuttal}>Add New Rebuttal</button>}
            </summary>
            {childs}
        </details>
        </>
    )
}
