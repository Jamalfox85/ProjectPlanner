<template>
  <main>
    <div class="home_wrapper">
      <h1 class="home">Home</h1>
      <button @click="naiveuitest">Test</button>
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
.home_wrapper {
  background-color: var(--primary);
}
</style>
