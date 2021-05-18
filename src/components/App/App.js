import React, { useState, useEffect } from "react";
import Authentication from "../../util/Authentication/Authentication";
import "./App.css";
import moment from "moment-timezone";

//components
import Countdown from "./Countdown";

const App = (props) => {
  const [Authenticator, setAuthenticator] = useState(new Authentication());
  //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
  const [twitch, setTwitch] = useState(
    window.Twitch ? window.Twitch.ext : null
  );

  const [finishedLoading, setfinishedLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isVisible, setIsVisible] = useState(true);

  const [timezone, setTimezone] = useState("");
  const [schedule, setSchedule] = useState([]);

  const contextUpdate = (context, delta) => {
    if (delta.includes("theme")) {
      setTheme(context.theme);
    }
  };

  const visibilityChanged = (isVisible) => {
    setIsVisible(isVisible);
  };

  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        Authenticator.setToken(auth.token, auth.userId);
        if (!finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          setfinishedLoading(true);
        }
      });

      twitch.onVisibilityChanged((isVisible, _c) => {
        visibilityChanged(isVisible);
      });

      twitch.onContext((context, delta) => {
        contextUpdate(context, delta);
      });
    }

    twitch.configuration.onChanged(() => {
      let config = twitch.configuration.broadcaster
        ? twitch.configuration.broadcaster.content
        : [];
      try {
        config = JSON.parse(config);
      } catch (e) {
        config = [];
      }
      setTimezone(config.timezone);
      setSchedule(config.schedule);
    });
  }, []);

  if (finishedLoading && isVisible) {
    const streamTimes = schedule.map((time) =>
      time
        ? moment.tz(time, "HH:mm", timezone).local().format("hh:mm A")
        : "DAY OFF"
    );
    const streamSchedule = schedule.map((time) =>
      time ? moment.tz(time, "HH:mm", timezone).local().format("HH:mm") : null
    );

    // Get current datetime
    const today = moment();
    // Number of days until stream
    let dayNum = today.day();
    //Check if there's a stream today
    let streamToday = false;

    if (streamSchedule[dayNum - 1] != null) {
      let nextStream = moment(streamSchedule[dayNum - 1], "HH:mm").toDate();
      streamToday = streamSchedule[dayNum - 1] != null && nextStream > today;
    }

    if (!streamToday) {
      for (let i = 0; i < 6; i++) {
        dayNum = dayNum < 7 ? dayNum + 1 : 1;
        if (streamSchedule[dayNum - 1] == null) continue;
        break;
      }
    }
    return (
      <div className="App">
        <div className={theme === "light" ? "App-light" : "App-dark"}>
          <h1 className="title">Sleepy's Stream Schedule</h1>
          <h2 className="subtitle">Time Until Next Stream:</h2>
          <Countdown streamSchedule={streamSchedule} />
          <div className="schedule">
            <div className={`day ${dayNum == 1 ? "next" : ""}`}>
              <h1 className="title">MONDAY</h1>
              <p className="time">{streamTimes[0]}</p>
            </div>
            <div className={`day ${dayNum == 2 ? "next" : ""}`}>
              <h1 className="title">TUESDAY</h1>
              <p className="time">{streamTimes[1]}</p>
            </div>
          </div>
          <div className="schedule">
            <div className={`day ${dayNum == 3 ? "next" : ""}`}>
              <h1 className="title">WEDNESDAY</h1>
              <p className="time">{streamTimes[2]}</p>
            </div>
            <div className={`day ${dayNum == 4 ? "next" : ""}`}>
              <h1 className="title">THURSDAY</h1>
              <p className="time">{streamTimes[3]}</p>
            </div>
          </div>
          <div className="schedule">
            <div className={`day ${dayNum == 5 ? "next" : ""}`}>
              <h1 className="title">FRIDAY</h1>
              <p className="time">{streamTimes[4]}</p>
            </div>
            <div className={`day ${dayNum == 6 ? "next" : ""}`}>
              <h1 className="title">SATURDAY</h1>
              <p className="time">{streamTimes[5]}</p>
            </div>
          </div>
          <div className="schedule">
            <div className={`day ${dayNum == 7 ? "next" : ""}`}>
              <h1 className="title">SUNDAY</h1>
              <p className="time">{streamTimes[6]}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="App"></div>;
  }
};

export default App;
