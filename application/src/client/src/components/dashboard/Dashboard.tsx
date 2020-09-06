import React, { useEffect } from "react"

import { useDispatch } from "react-redux"

import { clearActivePlant } from "../../actions/activePlant"

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

import { Container } from "@material-ui/core/"

import UserWelcome from "./UserWelcome"
import DashActions from "./DashActions"
import UserPlantList from "./UserPlantList"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dashboard: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
      },
      [theme.breakpoints.up("md")]: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(8),
      },
    },
  })
)

export default function Dashboard() {
  const dispatch = useDispatch()

  const classes = useStyles()

  /*
   * Clear active plant state and loaded data
   * -> this is done so user can choose an active plant and data is loaded fresh
   */
  useEffect(() => {
    dispatch(clearActivePlant())
  }, [dispatch])

  return (
    <Container maxWidth='lg' className={classes.dashboard}>
      <UserWelcome />
      <DashActions />
      <UserPlantList />
    </Container>
  )
}
