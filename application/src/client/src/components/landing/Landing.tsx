import React from "react"

import { Grid } from "@material-ui/core/"

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

import IntroCard from "./IntroCard"
import HowItWorks from "./HowItWorks"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    landing: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(4),
      },
      [theme.breakpoints.up("md")]: {
        marginTop: theme.spacing(8),
      },
      marginBottom: theme.spacing(4),
      maxWidth: "100vw",
      overflow: "hidden",
    },
  })
)

export default function Landing() {
  const classes = useStyles()

  return (
    <Grid container className={classes.landing} direction='row' alignItems='center' justify='space-evenly'>
      <Grid item container xs={12} lg={6} direction='column' alignItems='center' justify='center'>
        <IntroCard />
      </Grid>
      <Grid item container xs={12} lg={5} direction='column' alignItems='center' justify='center'>
        <HowItWorks />
      </Grid>
    </Grid>
  )
}
