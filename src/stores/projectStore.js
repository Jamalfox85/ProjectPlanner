import { defineStore } from "pinia";
import { supabase } from "@/lib/supabaseClient";
import { getTitleRecommendations, getDescriptionRecommendations, getFeatureRecommendations, getSWOTAnalysis, getColorPalette } from "@/services/openai";

export const projectStore = defineStore("projectStore", {
  state: () => ({
    quickMode: false,
    quickModeDetails: {
      titles: [],
      descriptions: {
        elevator_pitch: "",
        short_summary: "",
        extended_summary: "",
      },
      features: [],
      swot: {},
      branding: {},
    },
    currentProject: {},
    userProjects: [],
    titles: {},
    descriptions: {},
    features: [],
    swotItems: [],
    branding: {},
  }),
  actions: {
    setQuickMode(mode) {
      this.quickMode = mode;
    },
    async setQuickModeDetails(description) {
      let titles = await getTitleRecommendations([], description);
      this.quickModeDetails.titles = JSON.parse(titles);

      let features = await getFeatureRecommendations([], description);
      let splitResponse = features.split("Features")[0];
      let formattedFeatures = JSON.parse(splitResponse);
      this.quickModeDetails.features = formattedFeatures;

      let aiFormattedFeatures = formattedFeatures.map((feature) => {
        return feature.title;
      });
      let descriptions = await getDescriptionRecommendations(description, aiFormattedFeatures);
      const jsonResponse = descriptions.replace(/^Recommended Description:\s*/, "");
      const descriptionObject = JSON.parse(jsonResponse);

      this.quickModeDetails.descriptions.elevator_pitch = descriptionObject.elevator_pitch;
      this.quickModeDetails.descriptions.short_summary = descriptionObject.short_summary;
      this.quickModeDetails.descriptions.extended_summary = descriptionObject.extended_summary;

      let swot = await getSWOTAnalysis(description);
      const jsonSwot = JSON.parse(swot.replace(/SWOT\s*/, "").trim());
      this.quickModeDetails.swot = jsonSwot;

      let brandingResponse = await getColorPalette(description);
      this.quickModeDetails.branding.palette = { colors: JSON.parse(brandingResponse) };

      console.log("Quick Mode Data", this.quickModeDetails);
    },
    setCurrentProject(project) {
      this.currentProject = project;
      if (this.currentProject.id) {
        this.setTitles();
        this.setDescriptions();
        this.setFeatures();
        this.setSWOTItems();
        this.setBranding();
      }
    },
    setUserProjects(projects) {
      this.userProjects = projects;
    },
    async setTitles() {
      const { data, error } = await supabase.from("titles").select("*").eq("project_id", this.currentProject.id).order("created_at", { ascending: false });
      if (data.length > 0) {
        this.titles = data;
      }
    },
    async setDescriptions() {
      let { data: descriptions, error } = await supabase.from("descriptions").select("*").eq("project_id", this.currentProject.id).order("created_at", { ascending: false });
      if (descriptions.length > 0) {
        this.descriptions = descriptions[0];
        return;
      }
      this.descriptions = {};
    },
    async setFeatures() {
      const { data: features, error } = await supabase.from("features").select("*").eq("project_id", this.currentProject.id).order("created_at", { ascending: false });
      if (features.length > 0) {
        this.features = features;
        return;
      }
      this.features = [];
    },
    async setSWOTItems() {
      const { data: swotItems, error } = await supabase.from("swot_items").select("*").eq("project_id", this.currentProject.id).order("created_at", { ascending: false });
      if (swotItems.length > 0) {
        this.swotItems = swotItems;
        return;
      }
      this.swotItems = [];
    },
    async setBranding() {
      let branding = {};
      const { data: colorData, error } = await supabase.from("color_palettes").select("*").eq("project_id", this.currentProject.id).order("created_at", { ascending: false });
      if (colorData[0]?.colors.length > 0) {
        branding.palette = colorData[0];
      }
      this.branding = branding;
    },
    clearProjects() {
      this.userProjects = [];
      this.currentProject = {};
      this.titles = {};
      this.descriptions = {};
      this.features = [];
      this.swotItems = [];
      console.log("Projects cleared");
    },
  },
  getters: {
    getQuickMode() {
      return this.quickMode;
    },
    getQuickModeDetails() {
      return this.quickModeDetails;
    },
    getCurrentProject() {
      return this.currentProject;
    },
    getUserProjects() {
      return this.userProjects;
    },
    getTitles() {
      return this.titles;
    },
    getDescriptions() {
      return this.descriptions;
    },
    getFeatures() {
      return this.features;
    },
    getSWOTItems() {
      return this.swotItems;
    },
    getBranding() {
      return this.branding;
    },
  },
});
