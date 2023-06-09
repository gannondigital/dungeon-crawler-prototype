import { useEffect } from "react";

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
