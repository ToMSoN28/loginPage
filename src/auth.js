export const fakeAuthProvider = {
  isAuthenticatied: false,
  username: null,
  signin: (username, password, callbeck) => {
    if (username === "tkowa" && password === "qwerty") {
      fakeAuthProvider.isAuthenticatied = true;
      fakeAuthProvider.username = username;
      setTimeout(() => {
        callbeck("succes");
      }, 100);
    } else {
      setTimeout(() => {
        callbeck("Nieprawidłowy login lub hasło!");
      }, 100);
    }
  },

  signout: (callbeck) => {
    fakeAuthProvider.isAuthenticatied = false;
    setTimeout(callbeck, 100);
  },
};
