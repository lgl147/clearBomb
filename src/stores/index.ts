// Utilities
import { createPinia } from "pinia";
import persist from "pinia-plugin-persistedstate";

let pinia = createPinia();
pinia.use(persist);

export default pinia;
