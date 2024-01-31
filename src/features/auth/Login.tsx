import React, { useEffect } from "react";
import { FormikHelpers, useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "common/hooks";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { selectIsLoggedIn } from "./auth.selectors";
import { authThunks } from "./auth-reducer";
import { LoginParamsType } from "../TodolistsList/todolists-tasks-Api-types";
import { BaseResponseType } from "common/types";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const registrationUrl = "https://social-network.samuraijs.com/";

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const formik = useFormik({
    validate: (values) => {
      if (!values.email) {
        return {
          email: "Email is required",
        };
      }
      if (!values.password) {
        return {
          password: "Password is required",
        };
      }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },

    onSubmit: async (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
      try {
        await dispatch(authThunks.login(values));
      } catch (error) {
        const response = error as BaseResponseType;
        response.fieldsErrors?.forEach((el) => {
          formikHelpers.setFieldError(el.field, el.error);
        });
      }
    },
  });

  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
            fullWidth
          >
            <FormLabel>
              <Typography variant="h4" fontWeight={"bold"} color={"secondary"} sx={{ mt: 4 }}>
                Welcome to app!
              </Typography>

              <Typography variant="h6" fontWeight={"bold"} textAlign={"center"}>
                To log in, register:
              </Typography>
              <a href={registrationUrl} target={"_blank"} rel={"noopener noreferrer"}>
                <Typography variant="h6" fontWeight={"bold"}>
                  here
                </Typography>
              </a>

              <Typography fontWeight={"bold"} sx={{ mt: 1 }}>
                or use common test account credentials:
              </Typography>
              <Typography color={"green"} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                Email: free@samuraijs.com
              </Typography>
              <Typography color={"green"} sx={{ mt: 1 }}>
                Password: free
              </Typography>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                size="small"
                margin="normal"
                {...formik.getFieldProps("email")}
              />

              {formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}
              <TextField
                size="small"
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
              />

              {formik.errors.password && (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              )}
              <FormControlLabel
                label={"Remember me"}
                control={
                  <Checkbox
                    {...formik.getFieldProps("rememberMe")}
                    checked={formik.values.rememberMe}
                  />
                }
              />
              <Button type={"submit"} variant={"contained"} color={"secondary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
