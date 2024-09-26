function ProgressBar({ status }) {
    if(status === "Processing") {
        return (
            <>
                <ol id="progress-bar" className="mb-4">
                    <li className="step-done">Sign-in</li>
                    <li className="step-active">Processing</li>
                    <li className="step-todo">Delivering</li>
                    <li className="step-todo">Finished</li>
                </ol>
            </>
        );
        
    } else if(status === "Delivering") {
        return (
            <>
                <ol id="progress-bar" className="mb-4">
                    <li className="step-done">Sign-in</li>
                    <li className="step-done">Processing</li>
                    <li className="step-active">Delivering</li>
                    <li className="step-todo">Finished</li>
                </ol>
            </>
        );
    } else {
        return (
            <>
                <ol id="progress-bar" className="mb-4">
                    <li className="step-done">Sign-in</li>
                    <li className="step-done">Processing</li>
                    <li className="step-done">Delivering</li>
                    <li className="step-done">Finished</li>
                </ol>
            </>
        );
    } 
}

export default ProgressBar;