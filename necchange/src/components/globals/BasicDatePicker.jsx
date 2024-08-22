'use client'
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const BasicDatePicker = (props) => {
  const {label, value, setValue} = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label={label} value={value} onChange={(newValue) => setValue(newValue)}/>
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default BasicDatePicker



