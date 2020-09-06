import React from "react"

import { Link } from "react-router-dom"

import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core/"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logo: {
      backgroundColor: "whitesmoke",
      textAlign: "center",
      width: "120px",
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

  const theme = useTheme()

  return (
    <Typography variant='h6'>
      <Link to='/' className={classes.linkStyle}>
        <div className={classes.logo}>
          <span style={{ color: theme.palette.primary.main }}>Open</span>
          <span style={{ color: theme.palette.secondary.main }}>Grow</span>
        </div>
      </Link>
    </Typography>
  )
}
