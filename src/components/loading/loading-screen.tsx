import Spinner from "../loader/spinner";
import React from "react";
import styles from "./loading-screen.module.css";

const LoadingScreen = () => {
  return (
    <div
      className={`h-screen flex-col flex ${styles.loadingScreen} items-center justify-center`}
    >
      <Spinner />
    </div>
  );
};

export default LoadingScreen;
