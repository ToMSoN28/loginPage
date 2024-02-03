import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  Form,
  useLocation,
  useNavigate,
  useMatch,
} from "react-router-dom";
import React, { useState } from "react";
import "./styles.css";
import { fakeAuthProvider } from "./auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="main"
            element={
              <div className="App">
                <h1>Demonstrator autentykacji</h1>
                <p>login: tkowa</p>
                <p>password: qwerty</p>
              </div>
            }
          />
          <Route
            path="private"
            element={
              <ProtectedPath>
                <Outlet />
              </ProtectedPath>
            }
          >
            <Route
              path="first"
              element={
                <PrivatePage title="Witaj na pierwszej stronie prywatniej" />
              }
            />
            <Route
              path="second"
              element={
                <PrivatePage title="Witaj na drugiej stronie prywatniej" />
              }
            />
          </Route>
        </Route>
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function LoginPage() {
  const [loginMessage, setLoginMessage] = useState();
  let location = useLocation();
  let navigate = useNavigate();
  // console.log(location.state);
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event.target);
    let data = new FormData(event.target);
    // console.log(data.get("username"));
    // console.log(data.get("password"));

    fakeAuthProvider.signin(
      data.get("username"),
      data.get("password"),
      (status) => {
        // console.log(status);
        if (status === "succes") {
          if (location?.state?.from) navigate(location.state.from);
          else navigate("/main");
        } else setLoginMessage(status);
      }
    );
  };

  return (
    <div>
      Wprowadz dane do logowania
      <form onSubmit={handleSubmit}>
        Nazwa użytkownika:{" "}
        <input
          onChange={() => {
            setLoginMessage(null);
          }}
          type="text"
          name="username"
        />
        <br />
        Hasło <input type="password" name="password" />
        <br />
        {loginMessage ? <div style={{ color: "red" }}>{loginMessage}</div> : ""}
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}

function ProtectedPath({ children }) {
  let location = useLocation();

  return fakeAuthProvider.isAuthenticatied ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch("/private/:page");
  const onLogout = (event) => {
    event.preventDefault();
    fakeAuthProvider.signout();
    navigate("/main");
  };
  return (
    <div>
      <div>
        <Link to="main">Strona Główna</Link>
        <Link
          style={{
            marginLeft: "10px",
            fontWeight: match?.params?.page === "first" ? "bold" : "normal",
          }}
          to="private/first"
        >
          Strona Chroniona 1
        </Link>
        {fakeAuthProvider.isAuthenticatied ? (
          <Link
            style={{
              marginLeft: "10px",
              fontWeight: match?.params?.page === "second" ? "bold" : "normal",
            }}
            to="private/second"
          >
            Strona Chroniona 2
          </Link>
        ) : (
          ""
        )}

        <div style={{ float: "right" }}>
          {fakeAuthProvider.isAuthenticatied ? (
            <>
              <span style={{ marginLeft: "10px" }}>
                Zalogowany jako: {fakeAuthProvider.username}
              </span>
              <a style={{ marginLeft: "10px" }} onClick={onLogout} href="#">
                (Wyloguj)
              </a>
            </>
          ) : (
            <Link
              style={{ marginLeft: "10px" }}
              to="/login"
              state={{ from: location.pathname }}
            >
              (Zaloguj)
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

function PrivatePage({ title }) {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
}
