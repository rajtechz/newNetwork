// import React, { createContext, useState, useEffect } from 'react';
// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { role: 'NetworkAdmin' | 'NetworkSubAdmin', token: string, email: string }
//   const [loading, setLoading] = useState(true);
//   const login = async (credentials) => {
//     const staticCredentials = [
//       {
//         email: 'networkadm@gmail.com',
//         password: 'adm123',
//         role: 'NetworkAdmin',
//       },
//       {
//         email: 'networksub@gmail.com',
//         password: 'sub123',
//         role: 'NetworkSubAdmin',
//       },
//     ];
//     const matchedUser = staticCredentials.find(
//       (cred) => cred.email === credentials.email && cred.password === credentials.password
//     );
//     if (!matchedUser) {
//       throw new Error('Invalid credentials');
//     }
//     const response = {
//       role: matchedUser.role,
//       token: 'fake-jwt-token',
//       email: matchedUser.email // Include email in user object
//     };
//     setUser(response);
//     localStorage.setItem('user', JSON.stringify(response));
//     return response;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     console.log('Stored user:', storedUser);
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'NetworkAdmin' | 'NetworkSubAdmin', email: string }
  const [loading, setLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState(false);

  const login = async (credentials) => {
    console.log("Login credentials:", credentials);

    // Statically map email to role
    let role;
    if (credentials.email === "networkadm@gmail.com") {
      role = "NetworkAdmin";
    } else if (credentials.email === "networksub@gmail.com") {
      role = "NetworkSubAdmin";
    } else {
      throw new Error("Invalid email");
    }

    try {
      const response = await fetch(
        "https://mintflix.live:8086/api/Auto/UserLogin",
        {
          method: "POST",
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            role: role,
          }),
        }
      );
      console.log("API response status:", response);
      if (!response.ok) {
        let errorMessage = "Invalid credentials";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse API response:", e);
        throw new Error("Invalid API response format");
      }
      console.log("Raw API response:", data);

      // Check API response for success
      if (data.status !== true) {
        throw new Error(data.message || "Login failed");
      }

      // Use statically mapped role and input email for userData
      const userData = {
        role: role,
        email: credentials.email,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoginStatus(true);
      return userData;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(error.message || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setLoginStatus(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user:", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, loginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
