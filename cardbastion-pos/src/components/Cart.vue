<template>
  <div class="cart">
    <h2>🛒 Carrito</h2>
    <ul>
      <li v-for="(item, index) in groupedItems" :key="index">
        {{ item.name }} × {{ item.quantity }} - ${{ item.total }}
      </li>
    </ul>
    <p class="total">Total: ${{ total }}</p>

    <div class="buttons">
      <button @click="pagar" class="pay">Pagar</button>
      <button @click="$emit('clear')" class="clear">Limpiar</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['items'])

const total = computed(() =>
  props.items.reduce((sum, item) => sum + item.price, 0)
)

const groupedItems = computed(() => {
  const map = new Map()
  for (const item of props.items) {
    if (!map.has(item.id)) {
      map.set(item.id, {
        id: item.id,
        name: item.name,
        quantity: 1,
        total: item.price
      })
    } else {
      const existing = map.get(item.id)
      existing.quantity++
      existing.total += item.price
    }
  }
  return Array.from(map.values())
})

function pagar() {
  alert(`✅ Venta realizada por $${total.value}!`)
}
</script>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
}

.total {
  font-size: 18px;
  font-weight: bold;
  margin-top: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 10px 16px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
}

button.pay {
  background-color: #F2B138;
  color: #000;
}

button.clear {
  background-color: #ccc;
}
</style>
