import React, { useEffect, useState } from 'react';
import { User } from '../../pages';
import styles from './styles.module.scss';

interface UserProfileProps {
  user: User;
  getAccounts: () => Promise<string[]>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, getAccounts }) => {
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const accounts = await getAccounts();
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    };
    fetchWalletAddress();
  }, [getAccounts]);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileImageContainer}>
        <img src={user.profileImage} alt={user.name} className={styles.profileImage} />
      </div>
      <h1 className={styles.userName}>{user.name}</h1>
      <p className={styles.userEmail}>{user.email}</p>
      <p className={styles.walletAddress}>Wallet Address: {walletAddress}</p>
    </div>
  );
};

export default UserProfile;
