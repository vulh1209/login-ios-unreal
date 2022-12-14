import { Button, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";

import styles from "../styles/Home.module.css";

import { useAuthContext } from "../providers/auth";
import { useWeb3Auth } from "../services/web3auth";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { useState } from "react";

const Home: NextPage = () => {
  const { getCurrentSession } = useAuthContext();

  const {
    user,
    provider,
    login,
    logout,
    getUserInfo,
    getPrivateKey,
    web3Auth,
    chain,
    isLoading,
    setIsLoading,
  } = useWeb3Auth();

  const [userInfo, setUserInfo] = useState<string>();
  const [privateKey, setPrivateKey] = useState<string>();

  const handleSignIn = async () => {
    // refresh token
    const session = await getCurrentSession(true);
    if (!session) return;

    const id_token = session.getIdToken().getJwtToken();

    await login(WALLET_ADAPTERS.OPENLOGIN, "jwt", {
      id_token,
    });
  };

  const handleSignOut = async () => {
    await logout();
  };

  const handleGetUserInfo = async () => {
    const info = await getUserInfo();
    console.log(info);
    setUserInfo(JSON.stringify(info, null, 2));
  };

  const handleGetPrivateKey= async () => {
    const sk = await getPrivateKey();
    console.log(sk);
    setPrivateKey(JSON.stringify(sk, null, 2));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack justify="center" h="100vh">
        {isLoading ? (
          "Loading..."
        ) : user ? (
          <>
            <Button onClick={handleSignOut}>SIGN OUT</Button>
            <Button onClick={handleGetUserInfo}>GET USER INFO</Button>
            <Button onClick={handleGetPrivateKey}>GET PRIVATE KEY</Button>
            {userInfo && (
              <pre>
                <code>{userInfo}</code>              
              </pre>
            )}
            {privateKey && (
              <pre>
                <code>{privateKey}</code>              
              </pre>
            )}
          </>
        ) : (
          <Button onClick={handleSignIn}>SIGN IN</Button>
        )}
      </VStack>
    </div>
  );
};

export default Home;
