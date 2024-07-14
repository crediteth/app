import React from "react";
import styles from "./styles.module.scss";

interface HeaderProps {
  login: () => void;
  logout: () => void;
  loggedIn: boolean;
  currentView: string;
  setCurrentView: (view: string) => void;
}

function Header({ login, logout, loggedIn, currentView, setCurrentView }: HeaderProps) {
  return (
    <div className={styles.div}>
      <img
        className={styles.img}
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed6f3ffe1e957b918e1ba7500e555e40d40be0c7dccb284be5cbfaacdbb509fa?"
        alt="Logo"
      />
      <div className={styles.div2}>
        {loggedIn ? (
          <>
            <div
              className={`${styles.div3} ${currentView === "profile" ? styles.active : ""}`}
              onClick={() => setCurrentView("profile")}
            >
              Personal info
            </div>
            <div
              className={`${styles.div3} ${currentView === "organisations" ? styles.active : ""}`}
              onClick={() => setCurrentView("organisations")}
            >
              Company profile
            </div>
            <div
              className={`${styles.div3} ${currentView === "onboarding" ? styles.active : ""}`}
              onClick={() => setCurrentView("onboarding")}
            >
              Onboarding
            </div>
            <div className={styles.div4} onClick={logout}>
              Log Out
            </div>
          </>
        ) : (
          <div className={styles.div3} onClick={login}>
            Login
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
