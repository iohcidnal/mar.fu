import React from 'react';
import firebase from 'firebase';

import { db } from '../db';

export default function useDocument(initialDocumentPath) {
  const [documentPath, setDocumentPath] = React.useState(initialDocumentPath);
  const [docRef, setDocRef] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(
    () => {
      if (!documentPath) return;
      setDocRef(db.doc(documentPath));
    },
    [documentPath]
  );

  const getDocument = React.useCallback(
    docPath => setDocumentPath(docPath),
    []
  );

  const updateDocument = React.useCallback(
    async (subDocumentPath = '', payload, shouldMerge = true, docPath = documentPath) => {
      setIsSubmitting(true);
      await db
        .doc(`${docPath}/${subDocumentPath}`)
        .set(payload, { merge: shouldMerge });
      setIsSubmitting(false);
    },
    [documentPath]
  );

  const addDocument = React.useCallback(
    async (collectionPath = '', payload, docPath = documentPath) => {
      setIsSubmitting(true);
      await db
        .collection(`${docPath}/${collectionPath}`)
        .add({
          ...payload,
          createdTimestamp: firebase.firestore.Timestamp.fromDate(new Date())
        });
      setIsSubmitting(false);
    },
    [documentPath]
  );

  return {
    getDocument,
    updateDocument,
    addDocument,
    docRef,
    isSubmitting,
  };
}
