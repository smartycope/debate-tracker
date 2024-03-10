import React, { useRef } from "react";
// import {getNodeCount, addToTree, editText, removeNode} from "./treeFuncs";
import axios from "axios";
import { API_URL } from "./constants"


export default function Arg({node, update, argID, last=false, premise=false}) {
    var content = useRef()
    const API = API_URL + argID + '/'

    // Recurse
    const childs = node.children?.map(child => <Arg
        key={child.id}
        node={child}
        update={update}
        argID={argID}
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
                <summary>
                    {area}
                    <button onClick={handleAddRebuttal}>➕ Add Rebuttal</button>
                    {last && <button onClick={handleAddSiblingRebuttal}>➕ Add A Different Rebuttal</button>}
                    <button onClick={handleRemove}>❌ Delete</button>
                </summary>
                {childs}
            </details>
        )
}
