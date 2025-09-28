<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    placeholder="Buscar productos..."
    class="search-input"
  />
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-input {
  width: 100%;
  padding: 10px;
  font-size: 18px;
  margin-bottom: 1rem;
}
</style>
