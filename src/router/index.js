import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Title from "../views/Title.vue";
import Description from "../views/Description.vue";
import Features from "../views/Features.vue";
import Tables from "../views/Tables.vue";
import Branding from "../views/Branding.vue";
import Sitemap from "../views/Sitemap.vue";
import Swot from "../views/Swot.vue";

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
    {
      path: "/swot",
      name: "swot",
      component: Swot,
    },
  ],
});

// router.beforeEach(async (to, from, next) => {
//   const { data, error } = await supabase.auth.getSession();
//   if (data.session == null && to.path !== "/login") {
//     next({ name: "login" });
//     return false;
//   } else {
//     userStore().setSession(data.session);
//     next();
//   }
// });

export default router;
