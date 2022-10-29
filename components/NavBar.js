import React from "react";

import Link from "next/link";

import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

function NavBar() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
        <Link href="/">
          <Typography variant="h4">PDF Sign App</Typography>
        </Link>
      </Grid>
      <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
        <Link href="/Login">
          <Typography variant="subtitle1">Login/SignUp</Typography>
        </Link>
      </Grid>
    </Grid>
  );
}

export default NavBar;
