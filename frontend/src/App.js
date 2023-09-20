import React, { useState } from "react";
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
    const { theme, toggleMode, toggleLocale } = UseTheme();
    // Set the initial locale here
    const intlMessages = messages[locale];

    const handleLocaleChange = (selectedLocale) => {
        console.log("selectedLocale", selectedLocale);
        setLocale(selectedLocale);
        toggleLocale(selectedLocale);
    };
    const slectedLocale = theme.palette.theme;

    return (
        // return (
        // <IntlProvider locale={locale} messages={intlMessages}>
        //     <LanguageSelector onLocaleChange={handleLocaleChange} />

        //     <Typography variant="h1" color="primary">
        //         <FormattedMessage id="greeting" defaultMessage="Hello!" />
        //     </Typography>

        //     <TextField
        //         label={
        //             <FormattedMessage id="username" defaultMessage="Username" />
        //         }
        //         variant="outlined"
        //     />
        //     <TextField
        //         label={
        //             <FormattedMessage id="password" defaultMessage="Password" />
        //         }
        //         variant="outlined"
        //         type="password"
        //     />
        //     <Button variant="contained" color="primary">
        //         <FormattedMessage id="login" defaultMessage="Login" />
        //     </Button>
        // </IntlProvider>
        //)

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
                        path="/"
                        element={<MainPage />}
                        slectedLocale={slectedLocale}
                    />

                    <Route
                        path="/reviews/:reviewId"
                        element={<ReviewDetail />}
                    />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
            {/* </LocalizationProvider>  */}
        </ThemeProvider>
    );
}

export default App;
