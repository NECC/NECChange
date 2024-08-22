import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import UCsObj from "@/data/filters.json";

export default function ComboBox() {
  console.log(UCsObj);

  // Aqui, o array é gerado dinamicamente a partir de UCsObj
  const top100Films = UCsObj.map((elem) => {
    return { label: elem.name };
  });

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Unidade Curricular" />
      )}
    />
  );
}
