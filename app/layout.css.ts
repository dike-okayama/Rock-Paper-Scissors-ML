import { style } from "@vanilla-extract/css";

export const gameWindowRoot = style({
  width: "100vw",
  height: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
});

export const gameWindow = style({
  width: "100%",
  height: "100%",
  maxWidth: "812px",
  maxHeight: "812px",
  padding: "10px",
});
