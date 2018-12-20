import { h, render } from "preact"
import { Provider } from "redux-bundler-preact";
import getStore from "./bundles";
import UserPage from "./pages/UserPage"
import "./styles.css";

const App = props => (
  <Provider store={props.store}>
    <UserPage />
  </Provider>
);

render(<App store={getStore()} />, document.getElementById("app"));
