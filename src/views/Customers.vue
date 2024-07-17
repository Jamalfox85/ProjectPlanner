<template>
  <main>
    <div class="tables_wrapper">
      <div class="flex items-center">
        <div class="heading-group mb-4">
          <div class="flex items-center">
            <h1 class="current-title">Customers / Target Market</h1>
          </div>
        </div>
      </div>
      <div class="tables-main">
        <h1 class="text-4xl">Coming Soon</h1>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {};
  },
  methods: {
    naiveuitest() {
      //@ts-ignore
      window.$message.success("naiveuitest");
    },
  },
};
</script>

<style scoped lang="scss">
.tables_wrapper {
  padding: 2em;
  height: 100%;
  .heading-group {
    .current-title {
      font-size: 2em;
      font-weight: bold;
    }
  }
}
</style>
