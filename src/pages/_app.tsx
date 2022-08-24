import "../styles/globals.css";
import "@sipher.dev/ather-id/public/assets/styles/globals.css";

import type { AppProps } from "next/app";
import { AtherIdProvider, AtherIdEnviromment } from "@sipher.dev/ather-id";
import { Web3WalletProvider } from "@sipher.dev/web3";
import { AuthProvider } from "../providers/auth";
import { Web3AuthProvider } from "../services/web3auth";

const atherIdOptions = {
  environment: AtherIdEnviromment.Dev,
  oauth: {
    redirectSignIn: "http://localhost:3002/onboarding",
    redirectSignOut: "http://localhost:3002/onboarding",
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3WalletProvider>
      <AtherIdProvider {...atherIdOptions}>
        <AuthProvider>
          <Web3AuthProvider chain="mainnet" web3AuthNetwork="testnet">
            <Component {...pageProps} />
          </Web3AuthProvider>
        </AuthProvider>
      </AtherIdProvider>
    </Web3WalletProvider>
  );
}

export default MyApp;
