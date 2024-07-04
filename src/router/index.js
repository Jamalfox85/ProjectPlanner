import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Title from "../views/Title.vue";
import Description from "../views/Description.vue";
import Features from "../views/Features.vue";
import Tables from "../views/Tables.vue";
import Branding from "../views/Branding.vue";
import Sitemap from "../views/Sitemap.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/title",
      name: "title",
      component: Title,
    },
    {
      path: "/description",
      name: "description",
      component: Description,
    },
    {
      path: "/features",
      name: "features",
      component: Features,
    },
    {
      path: "/tables",
      name: "tables",
      component: Tables,
    },
    {
      path: "/branding",
      name: "branding",
      component: Branding,
    },
    {
      path: "/sitemap",
      name: "sitemap",
      component: Sitemap,
    },
  ],
});

export default router;
