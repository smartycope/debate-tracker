import './App.css';
import Arg from './Arg';
import { useEffect, useState } from 'react';

function App() {
    var idCount = 4
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

    // To confirm before reloading or closing
    useEffect(() => {
        const unloadCallback = (event) => {
          event.preventDefault();
          event.returnValue = "";
          return "";
        };

        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
      }, []);

    return (
    <div className="App">
      <header className="App-header">
        Debate Tracker
      </header>
      <Arg node={debate} debate={debate} setDebate={setDebate} key={0}/>
    </div>
  );
}

export default App;
