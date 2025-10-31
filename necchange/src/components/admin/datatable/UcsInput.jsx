import * as React from "react";
import { Autocomplete, TextField } from "@mui/material";
import UCsObj from "@/data/filters.json";

export default function UcsInput({ setValue, ano }) {
  const year = ano?.[0] ?? null;
  
  const ucs = React.useMemo(
    () =>
      UCsObj
        .filter((elem) => year && elem.year === Number(year))
        .map((elem) => ({
          label: elem.name,
          sigla: elem.sigla,
          year: elem.year,
        })),
    [year]
  );

  return (
    <Autocomplete
      disablePortal
      id="uc-input"
      options={ucs}
      sx={{ width: 300 }}
      onChange={(event, value) => {
        setValue(
          value
            ? { sigla: value.sigla, year: value.year }
            : null
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Unidade Curricular" />
      )}
    />
  );
}