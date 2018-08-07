const Timer = props => {
  return (
    <div className="time">
      <div className="circle" />
      <div className={props.styleLeft} />
      <div className={props.styleRight} />
      <div className="block">
        <h2 id="timer-label">{props.period}</h2>
        <p id="time-left">{props.time}</p>
        <button id="start_stop" onClick={props.start}>
          {props.started ? "Stop" : "Start"}
        </button>
        <button id="reset" onClick={props.reset}>
          Reset
        </button>
      </div>
      <audio
        id="beep"
        src="https://www.soundjay.com/button/sounds/beep-20.mp3"
      />
    </div>
  );
};
const initState = {
  sessionLength: 25,
  breakLength: 5,
  time: "25:00",
  started: false,
  changable: true,
  period: "Session",
  styleLeft: "half-left",
  styleRight: "half-right"
};
let timer = 0;
let timer2 = 0;
let audio = 0;
let circle = 0;
let left = 0;
let right = 0;
let min = 25;
let sec = 0;
function handleZero() {
  let zero = "";
  let colon = ":";
  if (min < 10) {
    zero = "0";
  }
  if (sec < 10) {
    colon = ":0";
  }
  let time = zero + min + colon + sec;
  return time;
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initState;
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.change = this.change.bind(this);
  }
  componentDidMount() {
    audio = document.getElementById("beep");
    circle = document.querySelector(".circle");
    right = document.querySelector(".half-right");
    left = document.querySelector(".half-left");
  }
  start(e) {
    function animLength(length, color) {
      circle.style.backgroundColor = color;
      left.style.backgroundColor = color;
      left.style.animationDuration = this.state[length] * 60 + "s";
      left.style.animationDelay = this.state[length] * 30 + "s";
      right.style.animationDuration = this.state[length] * 60 + "s";
    }
    function periodOfTime(period, length, color) {
      min = this.state[length];
      sec = 0;
      animLength.bind(this)(length, color);
      this.setState({
        period: period
      });
    }
    this.state.period == "Session"
      ? animLength.bind(this)("sessionLength", "green")
      : animLength.bind(this)("breakLength", "red");
    function displayTime() {
      if (sec == 1 && min == 0) {
        sec--;
        this.setState({
          time: handleZero()
        });
        timer2 = setTimeout(
          function() {
            audio.play();
            this.state.period == "Session"
              ? periodOfTime.bind(this)("Break", "breakLength", "red")
              : periodOfTime.bind(this)("Session", "sessionLength", "green");
            this.setState({
              time: handleZero()
            });
          }.bind(this),
          500
        );
      } else {
        if (sec > 0 && min >= 0) {
          sec--;
        } else if (sec == 0 && min > 0) {
          sec = 59;
          min--;
        }
        this.setState({
          time: handleZero()
        });
      }
      //timer=setTimeout(displayTime.bind(this),1000);
    }
    if (this.state.started) {
      clearInterval(timer);
      clearTimeout(timer2);
      // clearTimeout(timer);
      left.style.animationPlayState = "paused";
      right.style.animationPlayState = "paused";
    } else {
      this.setState({
        styleLeft: "half-left anim-left",
        styleRight: "half-right anim-right"
      });
      left.style.animationPlayState = "running";
      right.style.animationPlayState = "running";
      timer = setInterval(displayTime.bind(this), 1000);
      // displayTime.bind(this)();
    }
    this.setState({
      started: !this.state.started,
      changable: false
    });
  }
  reset(e) {
    clearInterval(timer);
    clearTimeout(timer2);
    //clearTimeout(timer);
    audio.pause();
    audio.currentTime = 0;
    min = 25;
    sec = 0;
    this.setState(initState);
  }
  change(e) {
    let val = e.target.getAttribute("id");
    switch (val) {
      case "break-increment":
        if (this.state.breakLength < 60 && this.state.changable) {
          this.setState({
            breakLength: (this.state.breakLength += 1)
          });
        }
        break;
      case "break-decrement":
        if (this.state.breakLength > 1 && this.state.changable) {
          this.setState({
            breakLength: (this.state.breakLength -= 1)
          });
        }
        break;
      case "session-increment":
        if (this.state.sessionLength < 60 && this.state.changable) {
          min++;
          this.setState({
            sessionLength: min,
            time: handleZero()
          });
        }
        break;
      case "session-decrement":
        if (this.state.sessionLength > 1 && this.state.changable) {
          min--;
          this.setState({
            sessionLength: min,
            time: handleZero()
          });
        }
        break;
    }
  }
  render() {
    return (
      <main>
        <h1>Pomodoro Clock</h1>
        <div className="length">
          <p className="first-row" id="break-label">
            Break Length
          </p>
          <button onClick={this.change} id="break-increment">
            +
          </button>
          <span className="second-row" id="break-length">
            {this.state.breakLength}
          </span>
          <button onClick={this.change} id="break-decrement">
            -
          </button>
        </div>
        <div className="length">
          <p className="first-row" id="session-label">
            Session Length
          </p>
          <button onClick={this.change} id="session-increment">
            +
          </button>
          <span className="second-row" id="session-length">
            {this.state.sessionLength}
          </span>
          <button onClick={this.change} id="session-decrement">
            -
          </button>
        </div>
        <Timer
          time={this.state.time}
          start={this.start}
          reset={this.reset}
          started={this.state.started}
          period={this.state.period}
          styleLeft={this.state.styleLeft}
          styleRight={this.state.styleRight}
        />
      </main>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
