import React, { useRef } from 'react';

const OTPInput = ({ length, onChange, hasError, invalid }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newValues = inputsRef.current.map((input, i) => (i === index ? value : input.value));

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    // Move to previous input if value is deleted
    if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }

    onChange(newValues.join(''));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !inputsRef.current[index].value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteValues = paste.slice(0, length).split('');

    pasteValues.forEach((value, i) => {
      inputsRef.current[i].value = value;
    });

    onChange(pasteValues.join(''));

    // Move focus to the next empty input or stay on the last one
    const nextIndex = pasteValues.length < length ? pasteValues.length : length - 1;
    inputsRef.current[nextIndex].focus();
  };


  return (
    <div className='flex items-center gap-x-3'>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          placeholder='*'
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`bg-at-black/5 dark:bg-at-dark-gray/5 focus:outline-none hover:border-gray-200 w-12.5 h-15 text-center text-[16px] border focus:bg-white dark:focus:bg-at-dark-gray/20 font-space-grotesk rounded dark:focus:border-at-dark-gray/20 ring-0 transition duration-200 ${hasError ? 'border-red-400 placeholder:text-red-400' : 'border-transparent'}`}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OTPInput;
