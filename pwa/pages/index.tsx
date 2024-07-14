/* eslint-disable @typescript-eslint/no-use-before-define */

"use client";

import {ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK} from "@web3auth/base";
import {EthereumPrivateKeyProvider} from "@web3auth/ethereum-provider";
import {decodeToken, Web3Auth} from "@web3auth/single-factor-auth";
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup, UserCredential} from "firebase/auth";
import {useEffect, useState} from "react";
import Web3 from "web3";
import styles from './styles.module.scss';
import Header from "../components/Header/Header";
import {WelcomeSection} from "../components/WelcomeSection/WelcomeSection";
import UserOrganisations from "../components/UserOrganisations/UserOrganisations";
import UserOnboarding from "../components/UserOnboarding/UserOnboarding";
import UserProfile from "../components/UserProfile/UserProfile";

const clientId = "BGyYuMEdLJc85fbtcN5RiRTXqxHQDLjCN5no0rpWHUS_5mEzeajRrJj4KrNsdKqTDxh_9nTNeJe9frM37lC1zBI"; // get from https://dashboard.web3auth.io
const verifier = "w3a-firebase-score";

export interface User {
  appState: string;
  email: string;
  aggregateVerifier: string;
  name: string;
  profileImage: string;
  typeOfLogin: string;
  verifier: string;
  verifierId: string;
  dappShare: string;
  oAuthIdToken: string;
  oAuthAccessToken: string;
  isMfaEnabled: boolean;
  idToken: string;
}

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

const firebaseConfig = {
  apiKey: "AIzaSyDEz2qw2BgyVbxvjPBbukGuO_pKVawNpvE",
  authDomain: "score-429315.firebaseapp.com",
  projectId: "score-429315",
  storageBucket: "score-429315.appspot.com",
  messagingSenderId: "193412922772",
  appId: "1:193412922772:web:684eeb9191c20f4b93a381",
  measurementId: "G-WBYE16GN9R"
};

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<string>("profile");
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.status === ADAPTER_EVENTS.CONNECTED) {
          const userInfo = await web3auth.getUserInfo();
          setUserInfo(userInfo as User);
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      console.log(res);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const login = async () => {
    if (!web3auth) {
      return;
    }
    const loginRes = await signInWithGoogle();
    const idToken = await loginRes.user.getIdToken(true);
    const { payload } = decodeToken(idToken);

    const web3authProvider = await web3auth.connect({
      verifier,
      verifierId: (payload as any).sub,
      idToken,
    });

    if (web3authProvider) {
      setLoggedIn(true);
      setProvider(web3authProvider);
      setUserInfo(userInfo as User);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getAccounts = async (): Promise<string[]> => {
    if (!provider) {
      return [];
    }
    const web3 = new Web3(provider as any);
    return await web3.eth.getAccounts();
  };

  const renderView = () => {
    switch (currentView) {
      case "profile":
        return userInfo && <UserProfile user={userInfo} getAccounts={getAccounts} />;
      case "organisations":
        return <UserOrganisations getAccounts={getAccounts}/>;
      case "onboarding":
        return <UserOnboarding />;
      default:
        return <div>Select an option from the menu</div>;
    }
  };

  return (
    <div className={styles.container}>
      <Header
        login={login}
        logout={logout}
        loggedIn={loggedIn}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <div className={styles.grid}>
        {loggedIn ? renderView() : <WelcomeSection login={login} />}
      </div>
      <footer className={styles.footer}></footer>
    </div>
  );
}

export default App;
