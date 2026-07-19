const API = ""

let categories = []
let products = []
let currentImages = []
let dragImageId = null
let currentUser = null

const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

function toast(message, isError = false) {
  const el = $("#toast")
  el.textContent = message
  el.classList.toggle("error", isError)
  el.classList.remove("hidden")
  clearTimeout(toast._t)
  toast._t = setTimeout(() => el.classList.add("hidden"), 2600)
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
  })
  if (res.status === 401 && path !== "/api/auth/me" && path !== "/api/auth/login") {
    showLogin()
    throw new Error("Нужно войти")
  }
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Ошибка ${res.status}`)
  return data
}

function showLogin(errorMessage = "") {
  currentUser = null
  $("#app-shell").classList.add("hidden")
  $("#login-screen").classList.remove("hidden")
  const err = $("#login-error")
  if (errorMessage) {
    err.textContent = errorMessage
    err.classList.remove("hidden")
  } else {
    err.classList.add("hidden")
  }
}

function showApp(user) {
  currentUser = user
  $("#login-screen").classList.add("hidden")
  $("#app-shell").classList.remove("hidden")
  $("#current-user").textContent = user.username
}

function mediaUrl(url) {
  if (!url) return ""
  if (url.startsWith("http")) return url
  return url
}

/* ---------- Navigation ---------- */
$$(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".nav-btn").forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")
    const view = btn.dataset.view
    $("#view-products").classList.toggle("hidden", view !== "products")
    $("#view-categories").classList.toggle("hidden", view !== "categories")
  })
})

$$("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => btn.closest("dialog")?.close())
})

/* ---------- Categories ---------- */
async function loadCategories() {
  categories = await api("/api/categories")
  renderCategories()
  fillCategorySelect()
}

function fillCategorySelect(selectedId = "") {
  const select = $("#product-form [name=category_id]")
  select.innerHTML = categories
    .map(
      (c) =>
        `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${escapeHtml(c.name)}</option>`
    )
    .join("")
}

function renderCategories() {
  const root = $("#categories-list")
  if (!categories.length) {
    root.innerHTML = `<div class="empty">Категорий пока нет</div>`
    return
  }
  root.innerHTML = categories
    .map(
      (c) => `
      <article class="item-card category">
        <div>
          <h3>${escapeHtml(c.name)}</h3>
          <p class="meta">slug: ${escapeHtml(c.slug)} · порядок ${c.sort_order}</p>
        </div>
        <div class="actions">
          <button type="button" class="btn ghost small" data-edit-category="${c.id}">Изменить</button>
        </div>
      </article>`
    )
    .join("")

  $$("[data-edit-category]").forEach((btn) => {
    btn.addEventListener("click", () => openCategoryDialog(btn.dataset.editCategory))
  })
}

function openCategoryDialog(id = null) {
  const dialog = $("#category-dialog")
  const form = $("#category-form")
  form.reset()
  $("#btn-delete-category").hidden = !id
  $("#category-dialog-title").textContent = id ? "Редактировать категорию" : "Новая категория"

  if (id) {
    const cat = categories.find((c) => c.id === id)
    if (!cat) return
    form.id.value = cat.id
    form.name.value = cat.name
    form.slug.value = cat.slug
    form.sort_order.value = cat.sort_order
  } else {
    form.id.value = ""
  }
  dialog.showModal()
}

$("#btn-new-category").addEventListener("click", () => openCategoryDialog())

$("#category-form").addEventListener("submit", async (e) => {
  e.preventDefault()
  const form = e.currentTarget
  const id = form.id.value
  const payload = {
    name: form.name.value.trim(),
    slug: form.slug.value.trim() || undefined,
    sort_order: Number(form.sort_order.value || 0),
  }

  try {
    if (id) {
      await api(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      toast("Категория сохранена")
    } else {
      await api("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      toast("Категория создана")
    }
    $("#category-dialog").close()
    await loadCategories()
  } catch (err) {
    toast(err.message, true)
  }
})

$("#btn-delete-category").addEventListener("click", async () => {
  const id = $("#category-form").id.value
  if (!id || !confirm("Удалить категорию?")) return
  try {
    await api(`/api/categories/${id}`, { method: "DELETE" })
    toast("Категория удалена")
    $("#category-dialog").close()
    await loadCategories()
  } catch (err) {
    toast(err.message, true)
  }
})

/* ---------- Products ---------- */
async function loadProducts() {
  const q = $("#product-search").value.trim()
  const qs = q ? `?q=${encodeURIComponent(q)}` : ""
  products = await api(`/api/products${qs}`)
  renderProducts()
}

function renderProducts() {
  const root = $("#products-list")
  if (!products.length) {
    root.innerHTML = `<div class="empty">Товаров пока нет — создайте первый</div>`
    return
  }

  root.innerHTML = products
    .map((p) => {
      const img = p.images?.[0]?.url
      const thumb = img
        ? `<img class="thumb" src="${mediaUrl(img)}" alt="" />`
        : `<div class="thumb placeholder">нет фото</div>`
      return `
        <article class="item-card">
          ${thumb}
          <div>
            <h3>${escapeHtml(p.title)}</h3>
            <p class="meta">
              Арт. ${escapeHtml(p.article)}
              ${p.category ? ` · ${escapeHtml(p.category.name)}` : ""}
              ${p.material ? ` · ${escapeHtml(p.material)}` : ""}
              ${p.size ? ` · ${escapeHtml(p.size)}` : ""}
            </p>
          </div>
          <div class="actions">
            <button type="button" class="btn ghost small" data-edit-product="${p.id}">Изменить</button>
          </div>
        </article>`
    })
    .join("")

  $$("[data-edit-product]").forEach((btn) => {
    btn.addEventListener("click", () => openProductDialog(btn.dataset.editProduct))
  })
}

$("#product-search").addEventListener("input", debounce(loadProducts, 280))
$("#btn-new-product").addEventListener("click", () => openProductDialog())

async function openProductDialog(id = null) {
  const dialog = $("#product-dialog")
  const form = $("#product-form")
  form.reset()
  currentImages = []
  $("#btn-delete-product").hidden = !id
  $("#images-block").hidden = !id
  $("#product-dialog-title").textContent = id ? "Редактировать товар" : "Новый товар"
  fillCategorySelect()

  if (id) {
    const product = await api(`/api/products/${id}`)
    form.id.value = product.id
    form.title.value = product.title
    form.article.value = product.article
    form.size.value = product.size || ""
    form.material.value = product.material || ""
    form.description.value = product.description || ""
    form.sort_order.value = product.sort_order ?? 0
    fillCategorySelect(product.category_id)
    currentImages = [...(product.images || [])]
    renderImages()
  } else {
    form.id.value = ""
    renderImages()
  }

  dialog.showModal()
}

function renderImages() {
  const grid = $("#images-grid")
  if (!currentImages.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1;padding:1.25rem">Нет фото</div>`
    return
  }

  grid.innerHTML = currentImages
    .map(
      (img) => `
      <div class="image-card" draggable="true" data-image-id="${img.id}">
        <img src="${mediaUrl(img.url)}" alt="" />
        <button type="button" class="remove" data-remove-image="${img.id}" title="Удалить">×</button>
      </div>`
    )
    .join("")

  $$(".image-card", grid).forEach((card) => {
    card.addEventListener("dragstart", () => {
      dragImageId = card.dataset.imageId
      card.classList.add("dragging")
    })
    card.addEventListener("dragend", () => {
      dragImageId = null
      card.classList.remove("dragging")
    })
    card.addEventListener("dragover", (e) => e.preventDefault())
    card.addEventListener("drop", async (e) => {
      e.preventDefault()
      const targetId = card.dataset.imageId
      if (!dragImageId || dragImageId === targetId) return
      const from = currentImages.findIndex((i) => i.id === dragImageId)
      const to = currentImages.findIndex((i) => i.id === targetId)
      if (from < 0 || to < 0) return
      const [moved] = currentImages.splice(from, 1)
      currentImages.splice(to, 0, moved)
      renderImages()
      try {
        const productId = $("#product-form").id.value
        currentImages = await api(`/api/products/${productId}/images/reorder`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_ids: currentImages.map((i) => i.id) }),
        })
        toast("Порядок фото обновлён")
        await loadProducts()
      } catch (err) {
        toast(err.message, true)
      }
    })
  })

  $$("[data-remove-image]", grid).forEach((btn) => {
    btn.addEventListener("click", async () => {
      const imageId = btn.dataset.removeImage
      const productId = $("#product-form").id.value
      if (!confirm("Удалить фото?")) return
      try {
        await api(`/api/products/${productId}/images/${imageId}`, { method: "DELETE" })
        currentImages = currentImages.filter((i) => i.id !== imageId)
        renderImages()
        toast("Фото удалено")
        await loadProducts()
      } catch (err) {
        toast(err.message, true)
      }
    })
  })
}

$("#image-upload").addEventListener("change", async (e) => {
  const files = [...e.target.files]
  e.target.value = ""
  const productId = $("#product-form").id.value
  if (!productId || !files.length) return

  const fd = new FormData()
  files.forEach((f) => fd.append("files", f))

  try {
    const created = await api(`/api/products/${productId}/images`, {
      method: "POST",
      body: fd,
    })
    currentImages = [...currentImages, ...created]
    renderImages()
    toast("Фото загружены")
    await loadProducts()
  } catch (err) {
    toast(err.message, true)
  }
})

$("#product-form").addEventListener("submit", async (e) => {
  e.preventDefault()
  const form = e.currentTarget
  const id = form.id.value
  const payload = {
    title: form.title.value.trim(),
    article: form.article.value.trim(),
    category_id: form.category_id.value,
    size: form.size.value.trim(),
    material: form.material.value.trim(),
    description: form.description.value.trim(),
    sort_order: Number(form.sort_order.value || 0),
  }

  try {
    if (id) {
      await api(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      toast("Товар сохранён")
      $("#product-dialog").close()
    } else {
      const created = await api("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      toast("Товар создан — можно загрузить фото")
      await openProductDialog(created.id)
    }
    await loadProducts()
  } catch (err) {
    toast(err.message, true)
  }
})

$("#btn-delete-product").addEventListener("click", async () => {
  const id = $("#product-form").id.value
  if (!id || !confirm("Удалить товар и все фото?")) return
  try {
    await api(`/api/products/${id}`, { method: "DELETE" })
    toast("Товар удалён")
    $("#product-dialog").close()
    await loadProducts()
  } catch (err) {
    toast(err.message, true)
  }
})

/* ---------- utils ---------- */
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function debounce(fn, ms) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault()
  const form = e.currentTarget
  const username = form.username.value.trim()
  const password = form.password.value
  try {
    const user = await api("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    form.reset()
    showApp(user)
    await loadCategories()
    await loadProducts()
    toast(`Добро пожаловать, ${user.username}`)
  } catch (err) {
    showLogin(err.message || "Не удалось войти")
  }
})

$("#btn-logout").addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST" })
  } catch {
    // ignore
  }
  showLogin()
})

async function init() {
  try {
    const user = await api("/api/auth/me")
    showApp(user)
    await loadCategories()
    await loadProducts()
  } catch {
    showLogin()
  }
}

init()
