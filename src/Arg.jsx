import React, { useRef } from "react";
// import {getNodeCount, addToTree, editText, removeNode} from "./treeFuncs";
import axios from "axios";
import { API_URL } from "./constants"


export default function Arg({node, update, argID, against, colored, last=false, premise=false}) {
    var content = useRef()
    const API = API_URL + argID + '/'

    // Recurse
    const childs = node.children?.map(child => <Arg
        key={child.id}
        node={child}
        update={update}
        argID={argID}
        against={!against}
        colored={colored}
        last={child === node.children[node.children.length - 1]}
    />)


    function handleAddRebuttal(e){
        axios.post(API + `add_child/${node.id}/`).then(update)
    }

    function handleAddSiblingRebuttal(e){
        axios.post(API + `add_sibling/${node.id}/`).then(update)
    }

    function handleEdited(e){
        axios.put(API + `edit/${node.id}/`, content.current.innerText).then(update)
    }

    function handleRemove(e){
        if (window.confirm('❕ Delete arguement and rebuttals?'))
            axios.delete(API + `delete/${node.id}/`).then(update)
    }

    const area = <pre
        className="editable"
        contentEditable='true'
        onClick={e => e.preventDefault()}
        id={premise ? 'premise' : `text${node.id}`}
        onBlur={handleEdited}
        ref={content}
        style={{background: (premise && colored) ? "rgb(121,140,115)" : ""}}
    >{node.name}</pre>

    if (premise)
        return(<>
            {area}
            {childs}
            </>
        )
    else
        return(
            // This is to prevent details from toggling when space is *released* (not pressed)
            <details open onKeyUp={e => e.preventDefault()}>
                <summary style={{background: colored ? (against ? "rgb(121,140,115)" : "rgb(153,102,102)") : ""}}>
                    {area}
                    <button onClick={handleAddRebuttal}>➕ Add Rebuttal</button>
                    {last && <button onClick={handleAddSiblingRebuttal}>➕ Add A Different Rebuttal</button>}
                    <button onClick={handleRemove}>❌ Delete</button>
                </summary>
                {childs}
            </details>
        )
}
