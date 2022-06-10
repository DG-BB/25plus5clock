import React, {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {

    const timeMultiplier = 60;

    const defaultSessionLength = 25;
    const defaultBreakLength = 5;

    const [count, setCount] = useState(defaultSessionLength * timeMultiplier);
    const [sessionLength, setSessionLength] = useState(defaultSessionLength);
    const [breakLength, setBreakLength] = useState(defaultBreakLength);
    const [timerMode, setTimerMode] = useState(0); // 0 = session | 1 = break
    const [isRunning, setRunning] = useState(false);

    const timeText = useRef();
    const timeLabel = useRef();
    const beepAudio = useRef();

    const setMode = (mode) => {
        setTimerMode(mode);
        if (mode === 1) {
            setCount(breakLength * timeMultiplier);
        } else {
            setCount(sessionLength * timeMultiplier);
        }
    }

    useInterval(() => {

        if (count < 60) {
            timeText.current?.classList.toggle("red");
            timeLabel.current?.classList.toggle("red");
        }

        if (count < 0) {
            beepAudio.current?.play();
            if (timerMode === 0) {
                setMode(1)
            } else {
                setMode(0)
            }
        } else {
            setCount(count - 1);
        }
    }, isRunning ? 1000 : null);

    function startTimer() {
        if (count === 0)
            setCount(sessionLength * timeMultiplier);
        setRunning(true);
    }

    const stopTimer = () => {
        setRunning(false);
    }

    const resetTimer = () => {
        if (isRunning) stopTimer();
        setTimerMode(0);
        setBreakLength(defaultBreakLength);
        setSessionLength(defaultSessionLength);
        setCount(defaultSessionLength * timeMultiplier);
        beepAudio.current?.pause();
        beepAudio.current.currentTime = 0;
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

    function getCountAsTimeString() {
        let minutes = Math.floor(count / timeMultiplier);
        let seconds = count - minutes * timeMultiplier;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return minutes + ':' + seconds;
    }


    return (
        <div className="vertical timer-box">

            <div className="horizontal" style={{justifyContent: "space-evenly", width: '50%'}}>
                <div className="vertical timer-length-item">
                    <p id="break-label" className="timer-length-item-label">Break length</p>
                    <div className="horizontal timer-length-item-switcher">
                        <button className={isRunning ? "none-click" : undefined} value="-" id="break-decrement" onClick={() => {
                            if (isRunning) return;
                            if (breakLength <= 1) return;
                            setBreakLength(breakLength - 1)
                        }}>
                            <i className="fa fa-arrow-down"></i>
                        </button>
                        <div id="break-length" defaultValue={defaultBreakLength}>{breakLength}</div>
                        <button className={isRunning ? "none-click" : undefined} value="+" id="break-increment" onClick={() => {
                            if (isRunning) return;
                            if (breakLength >= 60) return;
                            setBreakLength(breakLength + 1);
                        }}>
                            <i className="fa fa-arrow-up"></i>
                        </button>
                    </div>
                </div>
                <div className="vertical timer-length-item">
                    <p id="session-label" className="timer-length-item-label">Session length</p>
                    <div className="horizontal timer-length-item-switcher">
                        <button className={isRunning ? "none-click" : undefined} value="-" id="session-decrement" onClick={() => {
                            if (isRunning) return;
                            if (sessionLength <= 1) return;
                            let newLength = sessionLength - 1;
                            setSessionLength(newLength)
                            setCount(newLength * timeMultiplier);
                        }}>
                            <i className="fa fa-arrow-down"></i>
                        </button>
                        <div id="session-length" defaultValue={defaultSessionLength}>{sessionLength}</div>
                        <button className={isRunning ? "none-click" : undefined} value="+" id="session-increment" onClick={() => {
                            if (isRunning) return;
                            if (sessionLength >= 60) return;
                            let newLength = sessionLength + 1;
                            setSessionLength(newLength);
                            setCount(newLength * timeMultiplier);
                        }}>
                            <i className="fa fa-arrow-up"></i>
                        </button>
                    </div>
                </div>
            </div>

            <hr style={{width: "75%"}}/>

            <div className="vertical" style={{width: "50%"}}>
                <div id="timer-label" style={{color: (count <= 61) ? "red" : null}}
                    ref={ref => timeLabel.current = ref}>{(timerMode === 0) ? "Session" : "Break"}</div>
                <div id="time-left" style={{color: (count <= 61) ? "red" : null}} ref={ref => timeText.current = ref}>{
                    getCountAsTimeString()
                }</div>
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

            <audio
                id="beep"
                preload="auto"
                ref={ref => beepAudio.current = ref}
                src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
            />
        </div>
    );
}

export default App;
