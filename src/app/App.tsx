import React, { useCallback, useEffect } from "react";
import s from "./App.module.css";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../features/auth/Login";

import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { selectAppStatus, selectIsInitialized } from "./app.selectors";
import { ErrorSnackbar } from "components";
import { authThunks } from "../features/auth/auth-reducer";
import { useAppSelector } from "../common/hooks";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const status = useAppSelector(selectAppStatus);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(authThunks.initializeApp());
  }, []);

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout());
  }, []);

  if (!isInitialized) {
    return (
      <div className={s.wrapperCircularProgress}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Notes of memory
            </Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<TodolistsList demo={demo} />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
