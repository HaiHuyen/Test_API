import { useContext } from "react";
import { Store } from "./Store";

function useStore() {
    return useContext(Store)
}
export default useStore;