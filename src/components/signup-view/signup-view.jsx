import { useState } from "react";

export const SignupView = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            Name: name,
            Username: username,
            Password: password,
            Email: email,
            Birthdate: birthdate
        };

        fetch("https://myflix-ah-72292705dfa8.herokuapp.com/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if(response.ok) {
                alert("Signup Successful!");
            } else {
                alert("Signup Failed =(");
            }
        });
    };

    return (
        <>
            <h3>Sign-Up:</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Username:
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength="5"
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
                            minLength="8"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Birthdate:
                        <input 
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Sign-Up</button>
                </form>
        </>
    );
} 