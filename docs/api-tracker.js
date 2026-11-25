(() => {
  const storageKey = "mindu-api-route-progress-v1";
  const people = {
    sabrina: { name: "Sabrina", client: "React", initial: "S", avatar: "sabrina-avatar" },
    manoela: { name: "Manoela", client: "Android", initial: "M", avatar: "manoela-avatar" }
  };
  const routes = (window.MINDU_ROUTE_GROUPS || []).flatMap(group =>
    group.rotas.map(route => ({
      id: `${route.m.toUpperCase()} ${route.path}`,
      method: route.m.toUpperCase(),
      path: route.path,
      domain: group.nome,
      auth: route.auth || "Público",
      description: route.desc || ""
    }))
  );
  let status = {};
  try { status = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch (_) { status = {}; }
  status.sabrina ||= {};
  status.manoela ||= {};

  const tbody = document.getElementById("route-rows");
  const profileTabs = [...document.querySelectorAll("[data-profile]")];
  const search = document.getElementById("route-search");
  const showCompleted = document.getElementById("show-completed");
  let activeProfile = "sabrina";

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const isDone = (person, id) => status[person][id] === true;
  const countFor = person => routes.filter(route => isDone(person, route.id)).length;
  const persist = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(status)); } catch (_) {}
  };

  function updateOverview() {
    document.getElementById("total-count").textContent = routes.length;
    for (const id of Object.keys(people)) {
      const complete = countFor(id);
      const percent = routes.length ? Math.round(complete * 100 / routes.length) : 0;
      document.getElementById(`${id}-overview`).textContent = `${percent}%`;
      document.getElementById(`${id}-overview-count`).textContent = `${complete} de ${routes.length} implementadas`;
      document.querySelector(`[data-side-count="${id}"]`).textContent = `${complete}/${routes.length}`;
    }
  }

  function renderRows() {
    const person = people[activeProfile];
    const needle = search.value.trim().toLocaleLowerCase("pt-BR");
    const complete = countFor(activeProfile);
    const total = routes.length;
    const percent = total ? Math.round(complete * 100 / total) : 0;
    const visible = routes.filter(route => {
      const done = isDone(activeProfile, route.id);
      if (!showCompleted.checked && done) return false;
      return !needle || `${route.method} ${route.path} ${route.domain} ${route.auth} ${route.description}`.toLocaleLowerCase("pt-BR").includes(needle);
    });

    profileTabs.forEach(tab => tab.classList.toggle("active", tab.dataset.profile === activeProfile));
    document.getElementById("active-profile-icon").textContent = person.initial;
    document.getElementById("active-profile-icon").className = `active-profile-icon ${person.avatar}`;
    document.getElementById("active-profile-name").textContent = person.name;
    document.getElementById("active-profile-client").textContent = person.client;
    document.getElementById("active-profile-count").textContent = `${complete} de ${total} rotas implementadas`;
    document.getElementById("active-progress-fill").style.width = `${percent}%`;
    const progressbar = document.querySelector(".progress-track[role=progressbar]");
    progressbar.setAttribute("aria-valuenow", String(percent));
    document.getElementById("active-progress-percent").textContent = `${percent}%`;
    document.getElementById("table-heading").textContent = `Rotas da ${person.name}`;
    document.getElementById("visible-count").textContent = `${visible.length} ${visible.length === 1 ? "rota" : "rotas"} ${showCompleted.checked ? "no filtro" : "pendentes"}`;
    const allDone = total > 0 && complete === total;
    const bulk = document.getElementById("bulk-toggle");
    bulk.textContent = allDone ? "Reabrir todas as rotas" : "Marcar todas como implementadas";
    bulk.classList.toggle("bulk-reopen", allDone);
    document.getElementById("empty-state").hidden = visible.length !== 0;
    tbody.innerHTML = visible.map(route => {
      const done = isDone(activeProfile, route.id);
      return `<tr class="${done ? "is-done" : ""}">
        <td class="route-cell"><span class="method-chip method-${route.method.toLowerCase()}">${escapeHtml(route.method)}</span><div><code>${escapeHtml(route.path)}</code><small>${escapeHtml(route.description)}</small></div></td>
        <td><span class="domain-chip">${escapeHtml(route.domain)}</span></td>
        <td><span class="access-text">${escapeHtml(route.auth)}</span></td>
        <td><span class="status-pill ${done ? "status-done" : "status-pending"}"><span></span>${done ? "Implementada" : "Pendente"}</span></td>
        <td class="action-cell"><button class="row-action ${done ? "row-action-done" : ""}" data-route-id="${escapeHtml(route.id)}" type="button">${done ? "Reabrir" : "Marcar feita"}</button></td>
      </tr>`;
    }).join("");
    updateOverview();
  }

  profileTabs.forEach(tab => tab.addEventListener("click", () => {
    activeProfile = tab.dataset.profile;
    search.value = "";
    renderRows();
  }));
  search.addEventListener("input", renderRows);
  showCompleted.addEventListener("change", renderRows);
  tbody.addEventListener("click", event => {
    const button = event.target.closest("[data-route-id]");
    if (!button) return;
    const id = button.dataset.routeId;
    status[activeProfile][id] = !isDone(activeProfile, id);
    persist();
    renderRows();
  });
  document.getElementById("bulk-toggle").addEventListener("click", () => {
    const markDone = countFor(activeProfile) !== routes.length;
    routes.forEach(route => { status[activeProfile][route.id] = markDone; });
    persist();
    renderRows();
  });
  document.getElementById("show-all-again").addEventListener("click", () => {
    showCompleted.checked = true;
    renderRows();
  });
  window.addEventListener("storage", event => {
    if (event.key !== storageKey) return;
    try { status = JSON.parse(event.newValue || "{}"); } catch (_) { status = {}; }
    status.sabrina ||= {};
    status.manoela ||= {};
    renderRows();
  });
  renderRows();
})();
