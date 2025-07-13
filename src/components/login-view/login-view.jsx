import { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
    
  const handleSubmit = (event) => {
    event.preventDefault();

  const data = {
    Username: username,
    Password: password
  }

  fetch("https://myflix-ah-72292705dfa8.herokuapp.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Login response: ', data);
      if(data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        onLoggedIn(data.user, data.token);
      } else {
        alert("No such user");
      }
    })
    .catch((e) => {
      alert("Something went wrong");
    });
  };

  return (
    <>
      <h3>Sign in:</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password: 
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </label>
        </div>
      </form>
    </>
  );
};