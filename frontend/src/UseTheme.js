import { createTheme } from "@mui/material/styles";
import React, { useState, useMemo } from "react";

const UseTheme = () => {
    const [themeMode, setThemeMode] = useState("light");
    const [themeLocale, setThemeLocale] = useState("en");

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                    locale: themeLocale,
                    primary: {
                        main: "#756BFF",
                    },
                    secondary: {
                        main: "#DFA18A",
                    },
                    // background: {
                    //     default: "#f0f0f0",
                    //     secondary: "#ffffff",
                    // },
                },
                overrides: {
                    MuiCssBaseline: {
                        "@global": {
                            a: {
                                textDecoration: "none",
                                color: "inherit",
                            },
                        },
                    },
                },
                // typography: {
                //     // fontFamily: "Alegreya, sans-serif",
                //     fontFamily: "Roboto Slab, serif",
                //     fontFamily: "Inter, sans-serif",
                //     h1: {
                //         fontFamily: "Roboto Slab, serif",
                //         fontSize: "3rem",
                //         fontWeight: "500",
                //         textAlign: "center",
                //         color: "inherit",
                //     },
                //     h2: {
                //         fontFamily: "Roboto Slab, serif",
                //         fontSize: "2rem",
                //         fontWeight: "500",
                //         color: "inherit",
                //     },
                //     h3: {
                //         fontFamily: "Roboto Slab, serif",
                //         fontSize: "1.5rem",
                //         fontWeight: "500",
                //     },
                //     h4: {
                //         fontFamily: "Roboto Slab, serif",
                //         // fontSize: "1.5rem",
                //         fontWeight: "normal",
                //         textAlign: "center",
                //     },
                //     h5: {
                //         fontFamily: "Inter, sans-serif",
                //         // fontSize: "1.5rem",
                //         fontWeight: "normal",
                //         textAlign: "center",
                //     },
                // },
                typography: {
                    // fontFamily: "Alegreya, sans-serif",
                    // fontFamily: "Roboto Slab, serif",
                    fontFamily: "Inter, sans-serif",
                    h1: {
                        fontFamily: "Roboto Slab, serif",
                        fontSize: "3rem",
                        fontWeight: "500",
                        textAlign: "center",
                        color: "inherit",
                    },
                    h2: {
                        fontFamily: "Roboto Slab, serif",
                        fontSize: "2rem",
                        fontWeight: "500",
                        color: "inherit",
                    },
                    h3: {
                        fontFamily: "Inter, sans-serif",
                        fontSize: "1.5rem",
                        fontWeight: "500",
                    },
                    h4: {
                        fontFamily: "Inter, sans-serif",
                        // fontSize: "1.5rem",
                        fontWeight: "normal",
                        textAlign: "center",
                    },
                    h5: {
                        fontFamily: "Inter, sans-serif",
                        // fontSize: "1.5rem",
                        fontWeight: "normal",
                        textAlign: "center",
                    },
                },
                components: {
                    MuiCardMedia: {
                        styleOverrides: {
                            // root: {
                            //     height: "300px",
                            // },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                width: "100%",
                                bgcolor: "gray",
                                height: "100%",
                            },
                        },
                    },
                    MuiCardContent: {
                        styleOverrides: {
                            root: {
                                padding: "15px",
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                // backgroundColor: "gray",
                            },
                        },
                    },
                    MuiSelect: {
                        styleOverrides: {
                            root: {
                                color: "inherit",
                            },
                        },
                    },
                    a: {
                        styleOverrides: {
                            textDecoration: "none",
                            color: "inherit",
                        },
                    },
                },
                breakpoints: {
                    xs: 0,
                    sm: 600,
                    md: 960,
                    lg: 1280,
                    xl: 1920,
                },
                heightOptions: {
                    option1: "300px",
                    option2: "500px",
                },
            }),
        [themeMode, themeLocale]
    );
    const toggleMode = () => {
        let newMode = themeMode === "light" ? "dark" : "light";
        setThemeMode(newMode);
    };
    const toggleLocale = (newLocale) => {
        setThemeLocale(newLocale);
    };

    return { theme, toggleMode, toggleLocale };
};

export default UseTheme;
