import React from "react"

import { useTypedSelector } from "../../reducers"

import { Redirect } from "react-router-dom"

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

import { Container, Grid } from "@material-ui/core/"

import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginContainer: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(6),
      },
      [theme.breakpoints.up("md")]: {
        marginTop: theme.spacing(8),
      },
      paddingBottom: theme.spacing(4),
    },
  })
)

export default function Login() {
  const classes = useStyles()

  const authState = useTypedSelector((state) => state.authState.auth)

  if (authState.isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <Container maxWidth='lg' className={classes.loginContainer}>
      <Grid container direction='row' justify='space-around' alignItems='flex-start' spacing={7}>
        <Grid item xs={12} sm={8} lg={6}>
          <LoginForm />
        </Grid>
        <Grid item xs={12} sm={8} lg={6}>
          <RegisterForm />
        </Grid>
      </Grid>
    </Container>
  )
}
