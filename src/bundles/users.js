import { createSelector } from "redux-bundler";
const fetch = require('node-fetch');

const initialState = {
  users: [],
  currentPage: 1,
  isLoading: false,
  headers: ["first", "last", "email"],
  resultsPerPage: 10,
  sortAsc: false,
  sortKey: ""
};

export default {
  name: "users",

  reducer: (state = initialState, action) => {
    const {type, payload} =  action;

    if (type === "USERS_FETCH_STARTED") {
      return Object.assign({}, state, { isLoading: true });
    }

    if (type === "USERS_FETCH_SUCCESS") {
      return Object.assign({}, state, { isLoading: false, users: payload });
    }

    if (type === "USERS_FETCH_FAILED") {
      return Object.assign({}, state, { isLoading: false });
    }

    if (type === "USERS_SORTED") {
      let sortAsc = !state.sortAsc;
      let key = payload;

      if (state.sortKey !== key) {
        sortAsc = true;
      }

      let users = state.users.slice().sort((a, b) => {
        if (sortAsc) {
          return a[key] > b[key];
        } else {
          return a[key] < b[key];
        }
      });

      return Object.assign({}, state, { sortAsc, sortKey: key, users });
    }
    
    if (type === "USERS_PAGE_SWITCHED") {
      return Object.assign({}, state, { currentPage: payload })
    }

    return state;
  },

  selectUsers: state => state.users,

  selectUserList: state => state.users.users,
  
  selectUserCount: state => state.users.users.length,

  selectNumPages: state => {
    
    const { users, resultsPerPage } = state.users
    
    if (!users || !users.length) {
      return 0;
    }
    return Math.ceil(users.length / resultsPerPage);
  },

  selectVisibleMin: state =>
    (state.users.currentPage - 1) * state.users.resultsPerPage,

  selectVisibleMax: state =>
    state.users.currentPage * state.users.resultsPerPage,
    
  selectCurrentResults: createSelector(
    "selectVisibleMin",
    "selectVisibleMax",
    "selectUserList",
    (min, max, users) => {
      let rows = [];
      for (let i = min; i < max; i++) {
        rows.push(users[i]);
      }
      return rows;
    }
  ),

  doFetchUsers: () => ({ dispatch }) => {

    dispatch({ type: "USERS_FETCH_STARTED" });
    
    fetch("https://randomuser.me/api/?results=500")
      .then(res => res.json())
      .then(data => {

        let filtered = data.results.map(user => ({
          first: user.name.first,
          last: user.name.last,
          email: user.email
        }));

        dispatch({ type: "USERS_FETCH_SUCCESS", payload: filtered });
      })
      .catch(err => {
        dispatch({ type: "USERS_FETCH_FAILED" });
      });
  },

  doSwitchPage: page => ({ dispatch }) => {
    dispatch({ type: "USERS_PAGE_SWITCHED", payload: page})
  },

  doSortResults: key => ({ dispatch }) => {
    dispatch({ type: "USERS_SORTED", payload: key });
  },

  init: store => {}
};
