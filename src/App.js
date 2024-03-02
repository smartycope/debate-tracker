import './App.css';
import Arg from './Arg';
import { useContext, useState } from 'react';
import { DebateContext } from './DebateContext';

function App() {
    // var idCount = useContext(4)
    var idCount = 4
    // const debate = useContext(DebateContext)
    var [debate, setDebate] = useState({
        name: "Premise!",
        id: 0,
        children: [
            {
                name: "Rebuttal 1",
                id: 1,
                children: [
                    {
                        name: "Sub Sub 1",
                        id: 2,
                        children: []
                    }
                ]
            },
            {
                name: "Rebuttal 2",
                id: 3,
                children: []
            }
        ]
    })

    return (
    <div className="App">
      <header className="App-header">
        Debate Tracker
      </header>
      <Arg node={debate} debate={debate} setDebate={setDebate}/>
    </div>
  );
}

export default App;
