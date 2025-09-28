<template>
  <div class="product-list">
    <div
      v-for="product in filteredProducts"
      :key="product.id"
      class="product-card"
    >
      <h3>{{ product.name }}</h3>
      <p>${{ product.price }}</p>
      <button @click="$emit('add-to-cart', product)">Agregar</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps(['search'])

const products = [
  { id: 1, name: 'Booster Box Pokémon', price: 1200 },
  { id: 2, name: 'Sleeves Ultra Pro', price: 150 },
  { id: 3, name: 'Playmat Magic', price: 450 },
]

const filteredProducts = computed(() => {
  return products.filter(p =>
    p.name.toLowerCase().includes(props.search.toLowerCase())
  )
})
</script>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.product-card {
  border: 1px solid #ccc;
  padding: 10px;
  width: 180px;
}
</style>
