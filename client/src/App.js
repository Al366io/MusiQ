import "./App.css";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <div className="App">
      <h1> Hey, Welcome to MusiQ </h1>
      <LoginButton />
      <UserProfile />
      <LogoutButton />
    </div>
  );
}

export default App;
