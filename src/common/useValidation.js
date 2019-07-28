import React from 'react';

export default function useValidation(validateFn) {
  const [validationError, setValidationError] = React.useState({});

  const validate = React.useCallback(
    () => {
      const validationError = validateFn();
      setValidationError(validationError);
      if (Object.keys(validationError).length) throw new Error('Please fix errors.');
    },
    [validateFn]
  );

  return [validate, validationError];
}
