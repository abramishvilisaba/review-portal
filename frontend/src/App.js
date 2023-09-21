import React, { useState, useEffect } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import {
    Button,
    TextField,
    Typography,
    CssBaseline,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import LanguageSelector from "./LanguageSelector";
import messages from "./messages";
import UseTheme from "./UseTheme";
import MainPage from "./components/MainPage";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";
import ReviewDetail from "./components/pages/ReviewDetail";

import Navbar from "./Navbar";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useParams,
} from "react-router-dom";

function App() {
    const [locale, setLocale] = useState("en");
    const [currentTheme, setCurrentTheme] = useState("");
    const { theme, toggleMode, toggleLocale } = UseTheme();
    // Set the initial locale here
    const intlMessages = messages[locale];

    const handleLocaleChange = (selectedLocale) => {
        // console.log("selectedLocale", selectedLocale);
        setLocale(selectedLocale);
        toggleLocale(selectedLocale);
    };
    const slectedTheme = theme.palette.theme;

    useEffect(() => {
        const savedThemeMode = sessionStorage.getItem("themeMode");
        if (savedThemeMode) {
            setCurrentTheme(savedThemeMode);

            if (theme.palette.mode !== savedThemeMode) {
                toggleMode();
            }
        } else if (!currentTheme) {
            setCurrentTheme("light");
        }

        const savedLanguage = sessionStorage.getItem("selectedLanguage");
        if (savedLanguage) {
            setLocale(savedLanguage);
        }
    }, []);

    return (
        <IntlProvider locale={locale} messages={intlMessages}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {/* <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}> */}
                <Router>
                    <Navbar
                        theme={theme}
                        toggleMode={toggleMode}
                        // onLocaleChange={setLocale}
                        toggleLocale={handleLocaleChange}
                    />
                    <Routes>
                        {/* <Route path="/" element={<Navigate to="/en" replace />} /> */}
                        <Route
                            path="/*"
                            element={<MainPage />}
                            slectedLocale={locale}
                        />

                        <Route
                            path="/reviews/:reviewId"
                            element={<ReviewDetail />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/Profile" element={<Profile />} />
                    </Routes>
                </Router>
                {/* </LocalizationProvider>  */}
            </ThemeProvider>
        </IntlProvider>
    );
}

export default App;
