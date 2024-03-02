import { createContext } from 'react';

export const DebateContext = createContext({
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
});
