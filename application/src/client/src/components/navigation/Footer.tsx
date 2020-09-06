import React from "react"

import { Link } from "react-router-dom"

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

import { Container, Grid, Paper, Typography } from "@material-ui/core/"

import LogoBtn from "../util/LogoBtn"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footerContainer: {
      margin: 0,
      padding: 0,
      position: "absolute",
      bottom: "0",
      height: "4rem",
      boxShadow: "0 4px 14px 4px rgba(0, 0, 0, 0.9)",
    },
    footerPaper: {
      width: "100%",
      height: "100%",
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
    },
    footerGrid: {
      height: "100%",
    },
    logo: {
      backgroundColor: "whitesmoke",
      textAlign: "center",
      width: "135px",
      borderRadius: "35px",
      padding: "5px 8px",
      fontWeight: 500,
    },
    linkStyle: {
      textDecoration: "none",
      color: "white",
    },
  })
)

export default function Footer() {
  const classes = useStyles()

  return (
    <Container maxWidth={false} className={classes.footerContainer}>
      <Paper className={classes.footerPaper}>
        <Grid className={classes.footerGrid} container direction='row' alignItems='center' justify='center'>
          <Grid item xs={6} md={2}>
            <LogoBtn />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}
