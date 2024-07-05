import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

/* Naive UI */
import { createDiscreteApi } from "naive-ui";
const { message } = createDiscreteApi(["message"]);
window.$message = message;

/* Theme */
import { fetchColors } from "./services/theme";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.config.globalProperties.$colors = fetchColors();

app.mount("#app");
