<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="card">
    <Card>
      <template #title>
        Hello PrimeVue!
      </template>
      <template #content>
        <p>
          This is a simple test to confirm that PrimeVue is working.
        </p>
        <Button label="Click Me" icon="pi pi-check" @click="count++" />
        <p>
          Button clicked: {{ count }} times.
        </p>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.card {
  max-width: 500px;
  margin: 2rem auto;
}
</style>