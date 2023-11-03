import { style } from "@vanilla-extract/css";

export const playRoot = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "90%",
});

export const opponentContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "45%",
  width: "100%",
  border: "2px dashed black",
  borderRadius: "50px",
});

export const circle = style({
  height: "150px",
  width: "150px",
  borderRadius: "50%",
  overflow: "hidden",
  border: "2px solid black",
});

export const video = style({
  maxWidth: "100%",
  maxHeight: "100%",
});

export const selfContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "45%",
  width: "100%",
  border: "2px dashed black",
  borderRadius: "50px",
});

export const nameContainer = style({
  marginRight: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "15%",
});

export const counterContainer = style({
  marginLeft: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "15%",
});

export const stack = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

export const handOptions = style({
  margin: "1.5rem 0",
});

export const textContainer = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "10%",
  width: "100%",
});

export const text = style({
  fontSize: "2rem",
  fontWeight: 600,
});

export const buttonContainer = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "10%",
});

export const optionHand = style({
  margin: "0 1rem",
  borderRadius: "50%",
  border: "2px dashed black",
});

export const highlight = style({
  border: "2px solid green",
  borderRadius: "50%",
  transform: "scale(1.1)",
});

export const button = style({
  margin: "0 1rem",
  padding: "10px",
  borderRadius: "10px",
  outline: "none",
  border: "1px solid black",
  cursor: "pointer",
  selectors: {
    "&:hover": {
      backgroundColor: "lightgray",
    },
  },
});
