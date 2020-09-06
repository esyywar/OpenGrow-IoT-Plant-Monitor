import React from "react"

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

import { Container, Grid, Typography } from "@material-ui/core/"

import StarBorderIcon from "@material-ui/icons/StarBorder"
import LocalPizzaIcon from "@material-ui/icons/LocalPizza"

import LogoBtn from "../util/LogoBtn"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footerContainer: {
      margin: 0,
      padding: 0,
      position: "absolute",
      bottom: "0",
      boxShadow: "0 4px 14px 4px rgba(0, 0, 0, 0.9)",
      paddingTop: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
      minHeight: "4rem",
    },
    footerGrid: {
      height: "100%",
    },
    footerTextContainer: {
      margin: 0,
      color: "white",
      maxWidth: "300px",
      textAlign: "center",
      padding: "7px 0",
    },
    footerText: {
      fontSize: "14px",
    },
    openSourceTag: {
      [theme.breakpoints.down("sm")]: {
        margin: "6px auto",
      },
      [theme.breakpoints.up("md")]: {
        justifySelf: "flex-start",
        marginLeft: theme.spacing(2),
      },
    },
    pizzaTag: {
      [theme.breakpoints.down("sm")]: {
        margin: "6px auto",
      },
      [theme.breakpoints.up("md")]: {
        justifySelf: "flex-end",
        marginRight: theme.spacing(4),
      },
    },
    hyperlinkStyle: {
      textDecoration: "none",
      color: theme.palette.secondary.dark,
    },
  })
)

export default function Footer() {
  const classes = useStyles()

  return (
    <Container maxWidth={false} className={classes.footerContainer}>
      <Grid className={classes.footerGrid} container direction='row' alignItems='center' justify='space-around'>
        <Grid item xs={12} md={3}>
          <Grid container justify='flex-start' className={`${classes.footerTextContainer} ${classes.openSourceTag}`}>
            <Typography className={classes.footerText}>
              Proudly an open-source project. Become a stargazer of{" "}
              <a
                href='https://github.com/esyywar/OpenGrow-IoT-Plant-Monitor'
                target='_blank'
                rel='noopener noreferrer'
                className={classes.hyperlinkStyle}
              >
                this repo!
              </a>
              <StarBorderIcon />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container justify='center'>
            <LogoBtn />
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container className={`${classes.footerTextContainer} ${classes.pizzaTag}`}>
            <Typography className={classes.footerText}>
              Consider supporting OpenGrow and future projects by{" "}
              <a
                href='https://www.buymeacoffee.com/esyywar'
                target='_blank'
                rel='noopener noreferrer'
                className={classes.hyperlinkStyle}
              >
                buying me a pizza!
              </a>
              <LocalPizzaIcon />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}
