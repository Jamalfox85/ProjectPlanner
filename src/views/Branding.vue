<template>
  <main>
    <div class="branding_wrapper">
      <div class="branding-header">
        <h1>Branding</h1>
      </div>
      <div class="branding-main">
        <div class="palette-group">
          <div class="project-label">
            <p>Color Palette</p>
          </div>
          <div class="colors flex m-4">
            <div v-for="(color, index) in colors" class="mr-2 w-20 h-40 rounded-full relative flex flex-col items-center justify-center filled-out-color" :style="{ backgroundColor: color }">
              <div class="w-8 h-8 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-lg edit-color-block mb-4">
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                <n-color-picker :modes="['hex']" class="color-picker" @update:value="updatedColor(index)" v-model:value="newColor" />
              </div>
              <div class="bg-blue-500 text-white hover:bg-blue-600 relative w-8 h-8 rounded-lg trash-color-block flex cursor-pointer">
                <font-awesome-icon class="m-auto" :icon="['fas', 'trash']" @click="deleteColor(index)" />
              </div>
            </div>
            <div v-if="colors && colors.length < 5" class="color border-2 border-dashed border-gray-500 bg-slate-100 hover:bg-slate-200 cursor-pointer mr-2 w-20 h-20 rounded-full relative flex items-center justify-center empty-color">
              <div class="absolute m-auto w-8 h-8 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-lg add-color-block">
                <font-awesome-icon :icon="['fas', 'square-plus']" />
                <n-color-picker :modes="['hex']" class="color-picker" v-model:value="addNewColor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { projectStore } from "@/stores/projectStore";
import { NColorPicker } from "naive-ui";
import { supabase } from "@/lib/supabaseClient";
export default {
  components: {
    NColorPicker,
  },
  data() {
    return {
      colors: [],
      newColor: "",
      addNewColor: "",
    };
  },
  methods: {
    setBrandingDetails() {
      let branding = this.store.getBranding;
      this.colors = branding.colors;
    },
    async updatedColor(index) {
      this.colors[index] = this.newColor;

      let projectId = this.store.getCurrentProject.id;
      const { data, error } = await supabase.from("color_palettes").update({ colors: this.colors }).eq("project_id", projectId).select();
      if (error) {
        console.error("Error updating color palette", error);
      } else {
        this.newColor = null;
      }
    },
    async addColor() {
      this.colors.push(this.addNewColor);
      let projectId = this.store.getCurrentProject.id;
      const { data, error } = await supabase.from("color_palettes").update({ colors: this.colors }).eq("project_id", projectId).select();
      if (error) {
        console.error("Error adding color to palette", error);
      }
    },
    async deleteColor(index) {
      this.colors.splice(index, 1);
      let projectId = this.store.getCurrentProject.id;
      const { data, error } = await supabase.from("color_palettes").update({ colors: this.colors }).eq("project_id", projectId).select();
      if (error) {
        console.error("Error deleting color from palette", error);
      }
    },
  },

  watch: {
    store: {
      async handler() {
        this.setBrandingDetails();
      },
      deep: true,
      immediate: true,
    },
    addNewColor() {
      this.addColor();
    },
  },
  setup() {
    const store = projectStore();
    return { store };
  },
};
</script>

<style lang="scss">
.branding_wrapper {
  background-color: var(--light);
  flex: 1;
  height: 100%;
  padding: 1em;
  .branding-header {
    font-size: 2em;
    font-weight: bold;
  }
  .branding-main {
    padding: 1em;
    .project-label {
      background-color: var(--primary);
      color: var(--light);
      width: fit-content;
      padding: 4px 12px;
      border-radius: 1em;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    .filled-out-color {
      .edit-color-block,
      .trash-color-block {
        visibility: hidden;
        .color-picker {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          .n-color-picker-trigger__value {
            display: none;
          }
        }
      }
      &:hover {
        .edit-color-block,
        .trash-color-block {
          visibility: visible;
          cursor: pointer;
        }
      }
    }
    .empty-color {
      .color-picker {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        .n-color-picker-trigger__value {
          display: none;
        }
      }
    }
  }
}
</style>
