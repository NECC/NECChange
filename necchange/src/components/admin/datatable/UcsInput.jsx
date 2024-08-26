import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import UCsObj from "@/data/filters.json";

export default function UcsInput(props) {
  const { setValue } = props;

  const ucs = UCsObj.map((elem) => {
    return { label: elem.name };
  });

  const getUC_Year = (nameUc) => {
    const uc = UCsObj.find((elem) => elem.name === nameUc);
    if (uc) {
      return { sigla: uc.sigla, year: uc.year };
    }
    return null; 
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={ucs}
      sx={{ width: 300 }}
      onChange={(event, value) => {
        setValue(getUC_Year(value.label));
      }}
      renderInput={(params) => (
        <TextField {...params} label="Unidade Curricular" />
      )}
    />
  );
}
