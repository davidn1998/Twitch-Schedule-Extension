import React, { useState, useEffect } from "react";
import Authentication from "../../util/Authentication/Authentication";
import ConfigContainer from "./ConfigContainer/ConfigContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Config.css";

const ConfigPage = (props) => {
  const [Authenticator, setAuthenticator] = useState(new Authentication());
  const [twitch, setTwitch] = useState(
    window.Twitch ? window.Twitch.ext : null
  );

  const [finishedLoading, setfinishedLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [scheduleConfig, setScheduleConfig] = useState([]);
  const [timezoneConfig, setTimezoneConfig] = useState("");

  const contextUpdate = (context, delta) => {
    if (delta.includes("theme")) {
      setTheme(context.theme);
    }
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

      setScheduleConfig(config.schedule);
      setTimezoneConfig(config.timezone);
    });
  }, []);

  const saveConfig = (config) => {
    twitch.configuration.set("broadcaster", "0.0.1", JSON.stringify(config));
    setScheduleConfig(config.schedule);
    setTimezoneConfig(config.timezone);
    toast("Schedule Saved!");
  };

  if (finishedLoading && Authenticator.isModerator()) {
    return (
      <div className="Config">
        <div className={theme === "light" ? "Config-light" : "Config-dark"}>
          <ConfigContainer
            schedule={scheduleConfig}
            timezone={timezoneConfig}
            saveConfig={(config) => saveConfig(config)}
            theme={theme}
          />
          <ToastContainer position="top-center" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="Config">
        <div className={theme === "light" ? "Config-light" : "Config-dark"}>
          Loading...
        </div>
      </div>
    );
  }
};

export default ConfigPage;
