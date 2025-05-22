

// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Button,
//   useMediaQuery,
//   Box,
// } from "@mui/material";
// import { Menu as MenuIcon, ExitToApp as ExitToAppIcon } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { FaRegUser } from "react-icons/fa";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// const Header = ({ open, toggleSidebar }) => {
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const navigate = useNavigate();
//   const { user, logout } = useContext(AuthContext); // Access user and logout from AuthContext

//   const handleLogout = () => {
//     logout(); // Clear user session
//     navigate("/login"); // Redirect to login page
//   };

//   return (
//     <AppBar
//       position="fixed"
//       elevation={0}
//       className="header_and_sidebar_only_for_index"
//       sx={{
//         width: open && !isMobile ? `calc(100% - 200px)` : "100%",
//         height: "64px",
//         backgroundColor: "#fff",
//         borderBottom: "1px solid #ddd",
//       }}
//     >
//       <Toolbar>
//         <IconButton
//           edge="start"
//           color="inherit"
//           onClick={toggleSidebar}
//           sx={{ color: "#000" }}
//         >
//           <MenuIcon />
//         </IconButton>

//         <Typography
//           variant="h6"
//           sx={{ flexGrow: 1, color: "#000" }}
//         ></Typography>

//         {user && (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Box
//               className="rounded-circle bg-light d-flex justify-content-center align-items-center"
//               sx={{ width: 40, height: 40 }}
//             >
//               <FaRegUser />
//             </Box>
//             <Typography variant="body2" sx={{ color: "#000" }}>
//               {user.email || "dealer.atul@gmail.com"} {/* Use user.email if available */}
//             </Typography>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleLogout}
//               sx={{
//                 bgcolor: "red",
//                 color: "white",
//                 "&:hover": {
//                   bgcolor: "#cc0000",
//                 },
//               }}
//               startIcon={<ExitToAppIcon />}
//             >
//               Logout
//             </Button>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;


import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  Box,
} from "@mui/material";
import { Menu as MenuIcon, ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Header = ({ open, toggleSidebar }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className="header_and_sidebar_only_for_index"
      sx={{
        width: open && !isMobile ? `calc(100% - 200px)` : "100%",
        height: "64px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleSidebar}
          sx={{ color: "#000" }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ flexGrow: 1, color: "#000" }}
        ></Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              className="rounded-circle bg-light d-flex justify-content-center align-items-center"
              sx={{ width: 40, height: 40 }}
            >
              <FaRegUser />
            </Box>
            <Typography variant="body2" sx={{ color: "#000" }}>
              {user.email}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{
                bgcolor: "red",
                color: "white",
                "&:hover": {
                  bgcolor: "#cc0000",
                },
              }}
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;