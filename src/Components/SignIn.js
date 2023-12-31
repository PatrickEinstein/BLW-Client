import React, { useState } from "react";
import {
  BadgeMark,
  Box,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../assets/blw.png"
import MyButtons from "./Button";
import TextBox from "./TextField";
import { useNavigate } from "react-router-dom";
import PostCaller from "../Hooks/PostCaller";
import { setLoggedInUser, setMessage, setSnackBarOpen } from "../Redux/reducer";
import { useDispatch } from "react-redux";
import pizza2 from "../assets/pizza2.png";
const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onSignIn = async () => {
    const user = PostCaller(
      {
        email: email,
        password: password,
      },
      "login",
      {
        "Content-Type": "application/json",
      }
    );
    const awaitedUser = await user;
    console.log(awaitedUser);
    if (awaitedUser.status === "200" && awaitedUser.user[0].role === "admin") {
      dispatch(setSnackBarOpen(true));
      dispatch(setMessage(awaitedUser.message));
      dispatch(setLoggedInUser(awaitedUser.user));
      navigate("/dashboard");
    } else {
      console.log(awaitedUser);
      dispatch(setSnackBarOpen(true));
      dispatch(setMessage(awaitedUser.message));
      dispatch(setLoggedInUser(awaitedUser));
      return;
    }
  };

  return (
    <Stack
   
      sx={{
        backgroundColor: "black",
        height: 700,
        
          backgroundColor: "transparent",
          backgroundRepeat:"no-repeat",
          backgroundPosition:"center",
          backgroundSize:"cover",
          backgroundImage: `
          linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)),
          url(${Logo})
        `,
          width:"100%"
        
      
      
      }}
    >
     
      <Box
        sx={{
          height: "auto",
          width: "100%",
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <Typography
            sx={{
              color: "white",
              fontSize: 40,
            }}
          >
            Welcome
            <span
              style={{
                color: "lightblue",
                fontSize: 40,
                textAlign: "right",
              }}
            >
              you
            </span>
          </Typography>

          <TextBox
            id="outlined-basic3"
            label="Email Address"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextBox
            id="outlined-basic"
            label="Enter Password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
          />

          <MyButtons
            text="Login"
            color="black"
            width="80%"
            height={60}
            onClick={onSignIn}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography
              sx={{
                color: "white",
                marginRight: 8,
              }}
            >
              <IconButton>
                <Checkbox />
              </IconButton>
              Remember me
            </Typography>

            <Typography
              sx={{
                color: "white",
                marginTop: 2,
                marginLeft: 8,
              }}
              onClick={() => navigate('/reset')}
            >
              Forgot Password?
            </Typography>
          </Stack>
          <Typography
            sx={{
              color: "white",
            }}
          >
            New here ?
            <span
              style={{
                color: "lightblue",
              }}
              onClick={() => navigate("/")}
            >
              Create an account
            </span>
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export default SignIn;
