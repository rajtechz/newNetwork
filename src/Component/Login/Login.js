// import React, { useState, useContext } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   Button,
//   Link,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useNavigate } from "react-router-dom";
// import logo from "../images/aaLogo.png";
// import { AuthContext } from "../../context/AuthContext";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleTogglePassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const response = await login({ email, password });
//       if (response.role === "NetworkAdmin") {
//         navigate("/approval");
//       } else if (response.role === "NetworkSubAdmin") {
//         navigate("/");
//       }
//     } catch (err) {
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <Box sx={{ width: 900, mx: "auto", py: 6 }}>
//       <Box
//         sx={{
//           backgroundColor: "white",
//           padding: 6,
//           borderRadius: 2,
//           boxShadow: 3,
//         }}
//       >
//         <Box textAlign="center" mb={3}>
//           <img
//             src={logo}
//             alt="Logo"
//             style={{ maxWidth: "180px", width: "100%", height: "auto" }}
//           />
//         </Box>

//         <Typography variant="h4" textAlign="center" gutterBottom>
//           Welcome Back
//         </Typography>
//         <Typography variant="body2" textAlign="center" mb={3}>
//           Please Login your Account
//         </Typography>

//         {error && (
//           <Typography color="error" textAlign="center" mb={2}>
//             {error}
//           </Typography>
//         )}

//         <form onSubmit={handleSubmit}>
//           <Typography variant="subtitle2" mb={1}>
//             Email
//           </Typography>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="networkadm@gmail.com or networksub@gmail.com"
//             margin="dense"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <Typography variant="subtitle2" mt={2} mb={1}>
//             Password
//           </Typography>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="adm123 or sub123"
//             margin="dense"
//             type={showPassword ? "text" : "password"}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleTogglePassword} edge="end">
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Button
//             fullWidth
//             variant="contained"
//             color="secondary"
//             sx={{ mt: 3, bgcolor: "#7b2cbf", py: 1 }}
//             type="submit"
//           >
//             Login
//           </Button>
//         </form>
//         <Typography variant="caption" display="block" textAlign="center" mt={3}>
//           By using this portal you agree to our
//           <Link href="#" underline="hover">
//             Terms
//           </Link>{" "}
//           and
//           <Link href="#" underline="hover">
//             Privacy
//           </Link>{" "}
//           Policy.
//         </Typography>

//         <Typography variant="caption" display="block" textAlign="center" mt={1}>
//           © 2024 - Across Assist. All rights reserved.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Login;







import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import logo from "../images/aaLogo.png";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login({ email, password });
      console.log("Login response ssss:", response);
      if (response.role === "NetworkAdmin") {
        navigate("/approval");
      } else if (response.role === "NetworkSubAdmin") {
        navigate("/");
      } else {
        setError("Invalid role received from server");
      }
    } catch (err) {
      setError(err.message || "Login failed");
      console.error("Login error:", err.message);
    }
  };

  return (
    <Box sx={{ width: 600, mx: "auto", py: 6 }}>
      <Box
        sx={{
          backgroundColor: "white",
          padding: 6,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box textAlign="center" mb={3}>
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "180px", width: "100%", height: "auto" }}
          />
        </Box>

        <Typography variant="h4" textAlign="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" textAlign="center" mb={3}>
          Please Login your Account
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle2" mb={1}>
            Email
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter email"
            margin="dense"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Typography variant="subtitle2" mt={2} mb={1}>
            Password
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter password"
            margin="dense"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, bgcolor: "#7b2cbf", py: 1 }}
            type="submit"
          >
            Login
          </Button>
        </form>
        <Typography variant="caption" display="block" textAlign="center" mt={3}>
          By using this portal you agree to our 
          <Link href="#" underline="hover">
            Terms
          </Link>{" "}
          and 
          <Link href="#" underline="hover">
            Privacy
          </Link>{" "}
          Policy.
        </Typography>

        <Typography variant="caption" display="block" textAlign="center" mt={1}>
          © 2024 - Across Assist. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;