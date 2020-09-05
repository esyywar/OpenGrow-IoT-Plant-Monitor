import React from "react"

import { Grid, Typography, Paper } from "@material-ui/core/"

import { makeStyles, createStyles, useTheme, Theme } from "@material-ui/core/styles"

import WbSunnyIcon from "@material-ui/icons/WbSunny"
import WifiIcon from "@material-ui/icons/Wifi"
import OpacityIcon from "@material-ui/icons/Opacity"
import ComputerIcon from "@material-ui/icons/Computer"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    introCard: {
      padding: "30px 5px",
      marginBottom: theme.spacing(4),
      width: "100%",
      borderRadius: "25px",
    },
    cardTitle: {
      fontFamily: "'Mulish', sans-serif",
      marginBottom: theme.spacing(4),
      textAlign: "center",
    },
    plantImage: {
      [theme.breakpoints.down("sm")]: {
        maxHeight: "300px",
      },
      [theme.breakpoints.up("md")]: {
        maxHeight: "400px",
      },
      display: "block",
      margin: "auto",
      width: "auto",
    },
    cardInfoContainer: {
      width: "100%",
      height: "100%",
      padding: "15px",
      borderRadius: "35px",
    },
    cardInfoText: {
      fontFamily: "'Mulish', sans-seif",
      textAlign: "center",

      color: theme.palette.text.primary,
      [theme.breakpoints.down("sm")]: {
        fontSize: "18px",
        lineHeight: "30px",
        padding: "10px 5px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "19px",
        lineHeight: "35px",
        padding: "20px 5px",
      },
    },
    iconContainer: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(2),
      },
      [theme.breakpoints.up("md")]: {
        marginTop: theme.spacing(4),
      },
    },
    iconsStyle: {
      display: "block",
      margin: "auto",
      fontSize: "40px",
    },
  })
)

export default function IntroCard() {
  const theme = useTheme()

  const classes = useStyles()

  const pottedPlantImg = require("../../media/potted_plant.jpg")

  return (
    <Paper className={classes.introCard} style={{ backgroundColor: theme.palette.secondary.light }}>
      <Grid container direction='column' alignItems='center' justify='center'>
        <Grid item xs={12}>
          <Typography component='div' align='center' variant='h4'>
            <h4 className={classes.cardTitle}>Data Driven Care For Your Plant!</h4>
          </Typography>
        </Grid>

        <Grid item container spacing={6} direction='row' alignItems='center' justify='center'>
          <Grid item xs={11} lg={5} style={{ overflow: "hidden" }}>
            <img className={classes.plantImage} alt='potted-plant' src={pottedPlantImg} />
          </Grid>
          <Grid item xs={11} lg={6}>
            <Paper className={classes.cardInfoContainer} style={{ backgroundColor: theme.palette.background.paper }}>
              <Typography variant='body1' className={classes.cardInfoText}>
                OpenGrow provides you with the information to make sure your plant is thriving!
              </Typography>
              <Typography variant='body1' className={classes.cardInfoText}>
                Track the soil moisture and light availability for your plant. Adjust setpoints anytime from anywhere to
                ensure your plant gets watered when it needs to!
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid item container direction='row' alignItems='center' justify='center' className={classes.iconContainer}>
          <Grid item xs={3}>
            <OpacityIcon className={classes.iconsStyle} />
          </Grid>
          <Grid item xs={3}>
            <WbSunnyIcon className={classes.iconsStyle} />
          </Grid>
          <Grid item xs={3}>
            <WifiIcon className={classes.iconsStyle} />
          </Grid>
          <Grid item xs={3}>
            <ComputerIcon className={classes.iconsStyle} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
