import React from 'react';
import { Toast } from 'native-base';

import { duration } from '.';

export default function useSubmit(submitAsync, successMessage) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    () => {
      callSubmitAsync();

      async function callSubmitAsync() {
        try {
          setIsSubmitting(true);
          await submitAsync();
          successMessage && Toast.show({
            text: successMessage,
            buttonText: 'OK',
            duration,
            position: 'bottom',
            type: 'success'
          });
        } catch (error) {
          Toast.show({
            text: error.message,
            buttonText: 'OK',
            duration,
            position: 'bottom',
            type: 'danger',
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [submitAsync, successMessage]
  );

  return [isSubmitting, handleSubmit];
}
