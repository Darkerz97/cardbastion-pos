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
 async function pagar() {
  if (props.items.length === 0) {
    alert('Carrito vacío');
    return;
  }
  // calcular total
  const total = props.items.reduce((s, it) => s + it.quantity * it.price, 0);

  // preparar items payload
  const itemsPayload = props.items.map(it => ({
    product_id: it.product_id,
    sku: it.sku,
    name: it.name,
    quantity: it.quantity,
    unit_price: it.price,
    subtotal: it.subtotal ?? it.quantity * it.price
  }));

  // crear venta local
  const res = await window.api.createSale({
    items: itemsPayload,
    total,
    customer: null
  });

  if (res.ok) {
    alert(`✅ Venta registrada (id local ${res.saleId}) por $${total}`);
    // emitir evento 'clear' al padre para vaciar carrito
    // (en template usamos @clear="cartItems = []")
    // además podrías imprimir ticket o lanzar pantalla de pago
    // evento emitido desde aquí
    // NOTE: emit not available in <script setup> here; better emit
    // We'll use $emit
    // but since this is in setup we call:
    // $emit('clear')
    // assume component emits clear on success
    // implement:
  } else {
    alert('Error al registrar venta');
  }
}

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
