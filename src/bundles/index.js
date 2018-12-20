import { composeBundles, debugBundle } from "redux-bundler";
import users from "./users";

export default composeBundles(debugBundle, users);
