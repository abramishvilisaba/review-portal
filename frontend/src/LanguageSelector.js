import React from "react";
import { useIntl } from "react-intl";
import { MenuItem, Select } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function LanguageSelector({ onLocaleChange, locale }) {
    const intl = useIntl();
    const locale2 = intl.locale;
    const languages = [
        { code: "en", label: "English" },
        { code: "ka", label: "Georgian" },
    ];
    const navigate = useNavigate();

    const handleChange = (event) => {
        console.log("============================================");
        const selectedLocale = event.target.value;
        onLocaleChange(selectedLocale);
        navigate("/" + selectedLocale);
    };

    return (
        <Select value={locale} onChange={handleChange}>
            {languages.map((language) => (
                <MenuItem key={language.code} value={language.code}>
                    {language.label}
                </MenuItem>
            ))}
        </Select>
    );
}

export default LanguageSelector;
