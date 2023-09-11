import React, { useEffect } from "react";
import { FormikHelpers, useFormik } from "formik";
import { useSelector } from "react-redux";
import { useAppDispatch } from "common/hooks";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { selectIsLoggedIn } from "./auth.selectors";
import { authThunks } from "./auth-reducer";
import { LoginParamsType } from "../TodolistsList/todolists-tasks-Api-types";
import { BaseResponseType } from "common/types";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

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
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={registrationUrl} target={"_blank"} rel={"noopener noreferrer"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />

              {formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}
              <TextField
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
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
