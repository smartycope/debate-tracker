import './App.css';
import Arg from './Arg';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from "axios";
import { API_URL } from "./constants"
import { useNavigate, useParams } from 'react-router';
import Switch from "react-switch";
import Modal from 'react-modal';


const defaultDebate = {
    name: "",
    id: 0,
    children: [{
        name: "",
        id: 1,
        children: []
    }]
}


const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: "#333",
        border: "1px solid #ff5555",
    },
    overlay:{
        backgroundColor: 'rgba(0,0,0,0)',
    }
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');


export default function App() {
    const [debate, setDebate] = useState(defaultDebate)
    const [defs, setDefs] = useState([])
    const [openSidebar, setOpenSidebar] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [colored, setColored] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const { argID } = useParams()
    const navigate = useNavigate()
    const API = API_URL + argID + '/'

    function serialize(){
        return JSON.stringify([debate, defs])
    }

    const handleDownload = e => {
        // Create a Blob with the contents and set the MIME type
        const blob = new Blob([serialize()], { type: 'application/json' });

        // Create a link (anchor) element
        const link = document.createElement('a');

        // Set the download attribute and href with the Blob
        // link.download = "debate.json";
        link.download = argID + ".json";
        link.href = URL.createObjectURL(blob);

        // Append the link to the body and trigger a click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);
    }

    function handleFileSelection(e) {
        if (e.target.files.length > 0) {
            var reader = new FileReader()
            reader.onload = function(e) {
                const [_debate, _defs] = JSON.parse(e.target.result)
                axios.post(API + 'load/', _debate)
                axios.post(API + 'load_defs/', _defs)
                window.location.reload()
                // TODO: eventually figure out how to overwrite stuff in text boxes with a defaultValue set
                // setDebate(_debate)
                // setDefs(_defs)
            }
            reader.readAsText(e.target.files[0]);
        } else
            alert("Failed to load file");
    }

    const handleClearAll = e => {
        if(window.confirm('⚠️ Clear whole arguement? All unsaved arguements will be lost.')){
            axios.delete(API + 'clear/').then(() => setDebate(defaultDebate))
            axios.delete(API + 'clear_defs/').then(() => setDefs([]))
        }
    }

    function handleOpenAll(e){
        for (const d of document.getElementsByTagName('details'))
            d.setAttribute('open', true)
    }

    function handleCloseAll(e){
        for (const d of document.getElementsByTagName('details'))
            d.removeAttribute('open')
    }

    function setDef(id, key, to){
        var copy = JSON.parse(JSON.stringify(defs))
        copy[id][key] = to
        axios.put(API + `edit_def/${id}/${key}/`, to).then(() => setDefs(copy))
    }

    function newDef(){
        var copy = JSON.parse(JSON.stringify(defs))
        copy.push({'word': '', 'definition': ''})
        axios.post(API + 'new_def/').then(() => setDefs(copy))
    }

    function reload_debate(){
        axios.get(API + 'get_whole_debate/')
            .then(({data}) => {
                // console.log(data);
                const [_debate, _defs] = data
                setDebate(_debate)
                setDefs(_defs)
            })
            .catch((err) => {
                switch (err.code){
                    case "ERR_BAD_REQUEST":
                        setErrMsg(<>
                            <h2>Invalid Debate</h2>
                            <button onClick={e => navigate('/')}>Go Home</button>
                        </>)
                        break
                    case "ERR_NETWORK":
                        setErrMsg(<h2>Can't find server. Is it on?</h2>)
                        break
                    default:
                        console.log(err)
                        setErrMsg(<h2>Unknown Server Error</h2>)
                }
            })
    }

    useEffect(() => {
        reload_debate()
    }, [])

    if (errMsg !== null)
        return errMsg

    return (
    <div className="App">
        <Sidebar data={defs} setDef={setDef} newDef={newDef} isOpen={openSidebar} onOpen={e => setOpenSidebar(true)} onClose={e => setOpenSidebar(false)}/>
        <header>Premise:</header>
        <main className='main-content'>
            <Arg node={debate} update={reload_debate} argID={argID} key={0} premise={true} against={true} colored={colored}/>
        </main>
        <hr/>
        <div className='buttons'>
            <div className='buttons-group'>
                <button className="sidebar-button" onClick={e => setOpenSidebar(!openSidebar)}>📜 Definitions</button>
            </div>
            <div className='buttons-group'>
                <button className="expand-button" onClick={handleOpenAll}>📖 Expand All</button>
                <button className="collapse-button" onClick={handleCloseAll}>📕 Collapse All</button>
            </div>
            <div className='buttons-group'>
                <button onClick={e => navigate('/')}>🏠 Home</button>
            </div>
        </div>
        <br/>
        <div id="options-button"> <button onClick={e => setModalOpen(true)}>⚙️ Options</button> </div>
        <Modal
            isOpen={modalOpen}
            style={modalStyles}
            contentLabel="Options"
            data={{background: "green"}}
        >
            <div id="centered">
                <h3>Options</h3>
                <label style={{fontSize: "small"}}>Use Colors </label>
                <Switch onChange={e => setColored(!colored)} checked={colored} height={12} width={30} uncheckedIcon={false} checkedIcon={false} handleDiameter={10}/>
                <br/><br/>
                <button className="clear-button" onClick={e => {handleClearAll(e); setModalOpen(false)}}>🗑️ Clear Debate</button>
                <br/><br/>
                <label htmlFor="fileInput" className="label-for-file">📂 Load Debate</label>
                <input type="file" id="fileInput" className="input-for-file" onChange={e => {handleFileSelection(e); setModalOpen(false)}}/>
                <br/>
                <button className="download-button" onClick={e => {handleDownload(e); setModalOpen(false)}}>💾 Dowload Debate</button>
                <br/><br/>
                <button onClick={e => setModalOpen(false)}>Close</button>
            </div>
        </Modal>
    </div>
  )
}
