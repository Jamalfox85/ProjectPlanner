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

/* Font Awesome */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fab);
library.add(fas);
library.add(far);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);

app.config.globalProperties.$colors = fetchColors();

app.mount("#app");
