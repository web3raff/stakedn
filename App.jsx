import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import NativeBalance from "components/NativeBalance";
import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import Account from "components/Account/Account";
import Buy from "components/Buy";
import { Layout } from "antd";
import "antd/dist/antd.less";
import "./style.less";
import Logo from "./images/STKD.svg";

const { Header } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#fff",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout
      style={{
        height: "100vh",
        overflow: "auto",
        background: "linear-gradient(#172430, #001529)",
      }}
    >
      <Router>
        <Header theme="dark" style={styles.header}>
         <div style={{display:'flex'}}>
          <img src={Logo} width='200px' alt=''/>
         </div>
          <div style={styles.headerRight}>         
            <NativeBalance />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
           <Buy />
          </Switch>
        </div>
      </Router>
    </Layout>
    
  );
};

export default App;
