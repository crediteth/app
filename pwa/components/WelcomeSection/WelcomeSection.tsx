import React from 'react';
import styles from "./styles.module.scss";
import logo from '../../public/assets/logo.png';  // Import the local image

interface WelcomeSectionProps {
  login: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ login }) => {
  return (
    <section className={styles.section}>
      <div className={styles.contentWrapper}>
        <div className={styles.textColumn}>
          <h1 className={styles.heading}>hello!</h1>
          <p className={styles.description}>
            Welcome to Credit3, get your credit score and publish it on chain.
          </p>
        </div>
        <div className={styles.imageColumn}>
          <img className={styles.image} src={logo.src} alt="Welcome illustration" />
        </div>
      </div>
    </section>
  );
};
