<template>
  <!-- o bien haz que se active al hacer clic en cualquier parte -->
  <div class="layout" @click="focusScanner">
    <input
    ref="scannerInput"
    v-model="scanBuffer"
    @keydown.enter="onScanned"
    class="scanner-input"
    />


    <!-- Panel izquierdo -->
    <div class="left-panel">
      <h1 class="title">🧾 Card Bastion POS</h1>
      <div v-for="product in products" :key="product.id" class="product-card">
        {{ product.name }} - ${{ product.price }}
        <button @click="addToCart(product)">Agregar</button>
      </div>
    </div>

    <!-- Panel derecho -->
    <div class="right-panel">
      <h2 class="title">🛒 Carrito</h2>
      <div v-if="cart.length === 0">Vacío</div>
      <ul v-else>
        <li v-for="(item, index) in cart" :key="index">
          {{ item.name }} (x{{ item.quantity }}) - ${{ item.price * item.quantity }}
        </li>
      </ul>
      <div v-if="cart.length > 0">
        <p>Total: ${{ total }}</p>
        <button @click="checkout">Pagar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Detecta si estás dentro de Electron para poder usar ipcRenderer
let ipc = null

if (typeof window !== 'undefined' && window.require) {
  try {
    const electron = window.require('electron')
    ipc = electron.ipcRenderer
  } catch (err) {
    console.warn('⚠️ ipcRenderer no está disponible (navegador)', err)
  }
}

// Productos de ejemplo (luego puedes cargarlos desde la BD)
const products = ref([
  { id: 1, name: 'Booster Pokémon Escarlata', price: 120 },
  { id: 2, name: 'Commander MTG', price: 950 }
])

const cart = ref([])

function addToCart(product) {
  const existing = cart.value.find(p => p.id === product.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
}

async function checkout() {
  if (cart.value.length === 0) return

  const total = cart.value.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const items = cart.value.map(p => ({
    product_id: p.id,
    sku: p.sku || '',
    name: p.name,
    quantity: p.quantity,
    unit_price: p.price,
    subtotal: p.price * p.quantity
  }))

  if (!ipc) {
    alert('⚠️ Este POS solo funciona dentro de la app de escritorio.')
    return
  }

  const result = await ipc.invoke('db:createSale', {
    items,
    total,
    customer: null
  })

  if (result.ok) {
    alert('✅ Venta guardada correctamente')
    cart.value = []
  } else {
    alert('❌ Error al guardar la venta')
  }
}

const total = computed(() =>
  cart.value.reduce((sum, p) => sum + p.price * p.quantity, 0)
)

const scanBuffer = ref('')
const scannerInput = ref(null)

function focusScanner() {
  scannerInput.value?.focus()
}

onMounted(() => {
  focusScanner()
})

// función que se ejecuta al presionar ENTER (después de escanear)
async function onScanned() {
   console.log('↩️ Enter presionado:', scanBuffer.value)
  const code = scanBuffer.value.trim()
  if (!code) return

  const product = await window.api.findProductBySku(code)

  if (product) {
    addToCart({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: 1,
      unit_price: product.price,
      subtotal: product.price
    })
  } else {
    alert('Producto no encontrado: ' + code)
  }

  scanBuffer.value = ''
  focusScanner()
}

</script>


<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: #0D0D0D;
  color: white;
}
.left-panel {
  flex: 2;
  padding: 1rem;
  background: #1E1E1E;
}
.right-panel {
  flex: 1;
  padding: 1rem;
  background: #282828;
}
.title {
  color: #F2B138;
  margin-bottom: 1rem;
}
.product-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border: 1px solid #F29A2E;
  margin-bottom: 1rem;
}
.product-card button {
  margin-top: 0.5rem;
  background-color: #F29A2E;
  border: none;
  color: black;
  padding: 6px 12px;
  cursor: pointer;
}

.scanner-input {
    position: static;
  margin-bottom: 1rem;
}

</style>
