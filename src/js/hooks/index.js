import { useCallback, useEffect } from "react";

export const useStoreSubscription = (storeSubscriptions) => {
  useEffect(() => {
    storeSubscriptions.forEach(([store, callback]) => {
      store.listen(callback);
    });
    return () => {
      storeSubscriptions.forEach(([store, callback]) => {
        store.stopListening(callback);
      });
    };
  }, []);
};

/**
 * Passes to `callback` the character pressed, lowercased
 * @param {func} callback 
 * @returns 
 */
export const useWindowKeydown = (callback) => {
  const handleKeydown = useCallback((evt) => {
    callback(evt.key.toLowerCase());
  }, [callback]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    }
  }, [handleKeydown]);
};