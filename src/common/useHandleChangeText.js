import React from 'react';

export default function useHandleChangeText(initialState) {
  const [state, setState] = React.useState(() => initialState);

  const handleChangeText = React.useCallback(
    (key, value) => {
      setState(state => ({
        ...state,
        [key]: value
      }));
    },
    []
  );

  const resetState = React.useCallback(
    () => {
      setState(initialState);
    },
    [initialState]
  );

  return [state, handleChangeText, resetState];
}
