import React, { useRef, useState } from "react";

function Otp({ numberOfDigits, setFinalOtp }) {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const otpBoxReference = useRef([]);

  function isValid(value) {
    return (
      value &&
      value != "" &&
      value != " " &&
      !isNaN(value) &&
      Number.isInteger(Number(value))
    );
  }

  function handleChange(value, index) {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (isValid(value) && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }

    if (newArr.every((digit) => isValid(digit))) {
      setFinalOtp(newArr.join(""));
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handlePaste(e, index) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, numberOfDigits);

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < numberOfDigits && i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      const focusIndex = Math.min(
        index + pastedData.length,
        numberOfDigits - 1
      );
      otpBoxReference.current[focusIndex].focus();

      if (newOtp.every((digit) => isValid(digit))) {
        setFinalOtp(newOtp.join(""));
      }
    }
  }

  return (
    <div className="flex items-center gap-4 w-fit mx-auto">
      {otp.map((digit, index) => (
        <input
          key={index}
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          ref={(reference) => (otpBoxReference.current[index] = reference)}
          className={`border w-[3rem] h-auto text-center text-xl p-3 rounded-md block focus:border-2 focus:outline-none appearance-none`}
        />
      ))}
    </div>
  );
}

export default Otp;
