import { createRoot } from 'react-dom/client';

import "./index.scss"

const MyFlixApplication = () => {
    return(
        <div classname="my-flix">
            <div>Good morning</div>
        </div>
    );
};

const container = documnet.querySelector("#root");
const root = createRoot(container);

root.render(<MyFlixApplication/>);