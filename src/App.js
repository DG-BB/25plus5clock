import React, {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {

    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [timerMode, setTimerMode] = useState(0); // 0 = session | 1 = break
    const [isRunning, setRunning] = useState(false);
    const [isBeeping, setBeeping] = useState(false);
    const [beepingLength, setBeepingLength] = useState(5);
    const [count, setCount] = useState(0);
    const timeText = useRef();
    const timeLabel = useRef();

    const timeMultiplier = 60;

    useInterval(() => {
        if (isBeeping) {
            setBeepingLength(beepingLength - 1);
            if (timeText.current?.classList.contains("red")) {
                timeText.current?.classList.remove("red");
                timeLabel.current?.classList.remove("red");
            } else {
                timeText.current?.classList.add("red");
                timeLabel.current?.classList.add("red");
            }

            if (beepingLength > 0) return;
            else if (beepingLength <= 0) {
                setBeeping(false);
                if (timerMode === 0) {
                    setMode(1);
                } else {
                    setMode(0);
                }
                return;
            }
        }
        if (count <= 0) {
            setBeeping(true);
            setBeepingLength(5);
        } else {
            setCount(count - 1);
        }
    }, isRunning ? 1000 : null);

    const setMode = (mode) => {
        setTimerMode(mode);
        if (mode === 1) {
            setCount(breakLength * timeMultiplier);
        } else {
            setCount(sessionLength * timeMultiplier);
        }
    }

    const startTimer = () => {
        if (count === 0)
            setCount(sessionLength * timeMultiplier);
        setRunning(true);
    }

    const stopTimer = () => {
        setRunning(false);
        setBeeping(false);
    }

    const resetTimer = () => {
        if (isRunning) stopTimer();
        setCount(0);
        setTimerMode(0);
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }

            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    return (
        <div className="vertical timer-box">

            <div className="horizontal" style={{justifyContent: "space-evenly", width: '50%'}}>
                <div className="vertical timer-length-item">
                    <p id="break-label" className="timer-length-item-label">Break length</p>
                    <div className="horizontal timer-length-item-switcher">
                        <button className={isRunning ? "none-click" : undefined} id="break-decrement" onClick={() => {
                            if (isRunning) return;
                            if (breakLength <= 1) return;
                            setBreakLength(breakLength - 1)
                        }}>
                            <i className="fa fa-arrow-down"></i>
                        </button>
                        <p id="break-length">{breakLength}</p>
                        <button className={isRunning ? "none-click" : undefined} id="break-increment" onClick={() => {
                            if (isRunning) return;
                            if (sessionLength >= 60) return;
                            setBreakLength(breakLength + 1);
                        }}>
                            <i className="fa fa-arrow-up"></i>
                        </button>
                    </div>
                </div>
                <div className="vertical timer-length-item">
                    <p id="session-label" className="timer-length-item-label">Session length</p>
                    <div className="horizontal timer-length-item-switcher">
                        <button className={isRunning ? "none-click" : undefined} id="session-decrement" onClick={() => {
                            if (isRunning) return;
                            if (sessionLength <= 1) return;
                            setSessionLength(sessionLength - 1)
                        }}>
                            <i className="fa fa-arrow-down"></i>
                        </button>
                        <p id="session-length">{sessionLength}</p>
                        <button className={isRunning ? "none-click" : undefined} id="session-increment" onClick={() => {
                            if (isRunning) return;
                            if (sessionLength >= 60) return;
                            setSessionLength(sessionLength + 1);
                        }}>
                            <i className="fa fa-arrow-up"></i>
                        </button>
                    </div>
                </div>
            </div>

            <hr style={{width: "75%"}}/>

            <div className="vertical" style={{width: "50%"}}>
                <h1 id="timer-label"
                    ref={ref => timeLabel.current = ref}>{(isBeeping) ? "Time Up" : (timerMode === 0) ? "Session" : "Break"}</h1>
                <h2 id="time-left" ref={ref => timeText.current = ref}>{
                    new Date(count * 1000).toISOString().substr(14, 5)
                }</h2>
            </div>

            <hr style={{width: "25%", margin: '0'}}/>

            <div className="horizontal timer-buttons">
                <button className={isRunning ? "gray" : undefined} id="start_stop" onClick={() => {
                    if (!isRunning) {
                        startTimer();
                    } else stopTimer();
                }}>
                    <i className="fa fa-play"></i>
                    <i className="fa fa-pause"></i>
                </button>
                <button id="reset" onClick={() => {
                    resetTimer();
                }}>
                    <i className="fa fa-refresh"></i>
                </button>
            </div>

        </div>
    );
}

export default App;
