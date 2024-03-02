import React, { useEffect, useState, useRef } from "react";
import { find } from 'tree-visit'
// import { DebateContext } from "./DebateContext";
import {getNodeCount, addToTree} from "./treeFuncs";

const getChildren = (node) => node.children || []


export default function Arg({node, debate, setDebate, last=false}) {
    let childs = node.children.map(child => <Arg
        key={node.id}
        node={child}
        debate={debate}
        setDebate={setDebate} last={child === node.children[node.children.length - 1]}
    />)
    const [open, setOpen] = useState(true)
    const details = useRef(null)
    console.log('id', node.id)

    const handleAddRebuttal = e => {
        console.log('before');
        console.log(getNodeCount(debate))
        addToTree(debate, {
            name: "",
            id: getNodeCount(debate),
            children: []
        }, node.id)
        console.log('after');
        console.log(getNodeCount(debate))
        setDebate(debate)
    }

    const handleAddSiblingRebuttal = e => {

    }

    const handleToggle = e => {
        console.log('handling...')
        // if (e.defaultPrevented) return  // Exits here if event has been handled
        // e.preventDefault()
        // e.preventDefault()
        // setOpen(!open)
        e.stopPropagation()
        // e.nativeEvent.stopImmediatePropagation();
    }

    useEffect(()=>{
        console.log(open);
        if (open){
            details.current.setAttribute('open', "")
        }
        else{
            details.current.removeAttribute('open')
        }
    }, [open])

    return(<>
        <form action="/edit" method="post" id={`form${node.id}`} key={`form${node.id}`}></form>

        <details id={`${node.id}`} onToggle={handleToggle} ref={details}>
            <form onSubmit={handleAddRebuttal} id="add-rebuttal"></form>
            <form onSubmit={handleAddSiblingRebuttal} id="add-sibling-rebuttal"></form>
            <summary>
                <textarea name="arg" form={`form${node.id}`} defaultValue={node.name}></textarea>
                <button form="add-rebuttal">Add Rebuttal</button>
                {last && <button form="add-sibling-rebuttal">Add New Rebuttal</button>}
            </summary>
            {childs}
        </details>
        </>
    )
}
