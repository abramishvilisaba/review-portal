import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl, IntlProvider, FormattedMessage } from "react-intl";
import LanguageSelector from "./LanguageSelector";
import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/ka";
import { Button, AppBar, Box, Toolbar, Typography, Switch, MenuItem, Select } from "@mui/material";
import messages from "./messages";
import useTheme from "./UseTheme";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightsStayIcon from "@mui/icons-material/NightsStay";

const Navbar = ({ theme, toggleMode, toggleLocale }) => {
    const navigate = useNavigate();

    const [locale, setLocale] = useState("");
    const [currentTheme, setCurrentTheme] = useState("");

    const intlMessages = messages[locale];

    const handleLocaleChange = (selectedLocale) => {
        setLocale(selectedLocale);
        toggleLocale(selectedLocale);
    };

    useEffect(() => {
        if (currentTheme) {
            sessionStorage.setItem("themeMode", theme.palette.mode);
        }
    }, [theme]);

    useEffect(() => {
        const savedThemeMode = sessionStorage.getItem("themeMode");
        if (savedThemeMode) {
            setCurrentTheme(savedThemeMode);
        } else if (!currentTheme) {
            setCurrentTheme("light");
        }
    }, []);

    useEffect(() => {
        if (locale) {
            sessionStorage.setItem("selectedLanguage", locale);
        }
    }, [locale]);

    useEffect(() => {
        const savedLanguage = sessionStorage.getItem("selectedLanguage");
        if (savedLanguage) {
            setLocale(savedLanguage);
        } else if (!locale) {
            setLocale("en");
        }
    }, []);

    return (
        <IntlProvider locale={locale} messages={intlMessages}>
            <AppBar position="static">
                <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Link to={"/"}>
                            <Button
                                variant="h2"
                                //  onClick={() => navigate("/")}
                            >
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    Review Portal
                                </Typography>
                            </Button>
                        </Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ ml: "20px" }}>
                            <LanguageSelector onLocaleChange={handleLocaleChange} locale={locale} />
                        </Box>
                        <Box
                            sx={{
                                ml: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Switch
                                checked={theme.palette.mode === "dark"}
                                size="medium"
                                onChange={() => {
                                    toggleMode();
                                    setCurrentTheme(theme.palette.mode);
                                }}
                                color="primary"
                            />
                            {theme.palette.mode === "dark" ? (
                                <LightModeIcon fontSize={"medium"} />
                            ) : (
                                <NightsStayIcon fontSize={"medium"} />
                            )}
                        </Box>
                    </div>
                </Toolbar>
            </AppBar>
        </IntlProvider>
    );
};

export default Navbar;
