(() => {
  "use strict";

  const STORAGE_KEY = "sovrint.karmic-bills.v1";
  const SAVED_VIEWS_KEY = "sovrint.karmic-bills.saved-views.v1";
  const STATUSES = ["Draft", "Open", "Acknowledged", "In Repair", "Disputed", "Fulfilled", "Closed", "Archived"];
  const CATEGORIES = ["Accountability", "Care", "Commitment", "Exchange", "Financial", "Harm", "Labour", "Promise", "Responsibility", "Trust", "Other"];
  const DIRECTIONS = ["Owed to me", "Owed by me", "Mutual", "Institutional", "Collective"];
  const PRIORITY_WEIGHT = { Low: 1, Medium: 2, High: 3, Critical: 4 };
  const VIEW_TITLES = {
    dashboard: "Executive Dashboard",
    ledger: "Karmic Ledger",
    people: "People & Entities",
    evidence: "Evidence Register",
    repair: "Repair Plans",
    timeline: "Audit Timeline",
    analytics: "Ledger Analytics",
    documentation: "Documentation"
  };

  const now = () => new Date().toISOString();
  const today = () => new Date().toISOString().slice(0, 10);
  const daysFromNow = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };

  const sampleBills = [
    {
      id: "KB-2026-001",
      title: "Unreturned strategic design labour",
      description: "Records unpaid architecture, research synthesis, and implementation planning delivered under an informal commitment that was never resolved.",
      category: "Labour",
      status: "In Repair",
      direction: "Owed to me",
      priority: "Critical",
      parties: ["Northline Initiative"],
      relationship: "Prospective client",
      originEvent: "Strategic systems engagement",
      eventDate: daysFromNow(-95),
      dueDate: daysFromNow(5),
      owner: "Northline Initiative",
      monetaryValue: 4800,
      currency: "CAD",
      nonMonetaryValue: "Attribution, opportunity cost, authorship recognition, and restoration of professional trust.",
      impact: "High",
      urgency: "Immediate",
      tags: ["labour", "authorship", "professional"],
      lineage: "Email scope, meeting notes, architecture draft, and delivery timeline.",
      evidence: ["Email: agreed strategic scope", "Document: systems architecture draft", "Meeting note: delivery acknowledgement"],
      repairPlan: "Confirm the accepted scope, issue payment, provide written attribution, and close the record with mutual acknowledgement.",
      repairActions: ["[x] Delivery inventory prepared", "[x] Evidence consolidated", "[ ] Written acknowledgement", "[ ] Payment completed", "[ ] Closure statement signed"],
      acknowledgements: "Counterparty acknowledged receipt of the work but has not completed repair.",
      closureCriteria: "Payment received, authorship acknowledged, and both parties confirm no remaining deliverables.",
      closureStatement: "",
      closureDate: "",
      linkedRecords: [],
      notes: "Do not treat partial acknowledgement as closure.",
      archived: false,
      createdAt: daysFromNow(-90) + "T14:00:00.000Z",
      updatedAt: daysFromNow(-2) + "T16:30:00.000Z",
      history: [
        { at: daysFromNow(-90) + "T14:00:00.000Z", action: "Record created", detail: "Initial labour obligation documented." },
        { at: daysFromNow(-12) + "T10:00:00.000Z", action: "Evidence added", detail: "Delivery inventory and acknowledgement email attached." },
        { at: daysFromNow(-2) + "T16:30:00.000Z", action: "Status changed", detail: "Open → In Repair" }
      ]
    },
    {
      id: "KB-2026-002",
      title: "Family caregiving commitment",
      description: "A mutual commitment to redistribute recurring caregiving labour and create a reliable schedule.",
      category: "Care",
      status: "Acknowledged",
      direction: "Mutual",
      priority: "High",
      parties: ["Family circle"],
      relationship: "Family",
      originEvent: "Care schedule agreement",
      eventDate: daysFromNow(-40),
      dueDate: daysFromNow(10),
      owner: "Shared",
      monetaryValue: 0,
      currency: "CAD",
      nonMonetaryValue: "Time, continuity, emotional labour, rest, and predictability.",
      impact: "High",
      urgency: "High",
      tags: ["care", "family", "time"],
      lineage: "Family discussion and written schedule proposal.",
      evidence: ["Shared calendar draft", "Message acknowledgement"],
      repairPlan: "Adopt a four-week schedule, identify backup coverage, and review distribution monthly.",
      repairActions: ["[x] Commitment acknowledged", "[ ] Schedule adopted", "[ ] Backup coverage confirmed", "[ ] First monthly review"],
      acknowledgements: "All parties agree the current care distribution is not sustainable.",
      closureCriteria: "Four consecutive weeks completed under the shared schedule and one review completed.",
      closureStatement: "",
      closureDate: "",
      linkedRecords: [],
      notes: "Measure reliability, not only stated intention.",
      archived: false,
      createdAt: daysFromNow(-36) + "T09:15:00.000Z",
      updatedAt: daysFromNow(-4) + "T12:20:00.000Z",
      history: [
        { at: daysFromNow(-36) + "T09:15:00.000Z", action: "Record created", detail: "Mutual care obligation documented." },
        { at: daysFromNow(-4) + "T12:20:00.000Z", action: "Acknowledgement recorded", detail: "Shared recognition of the unresolved distribution." }
      ]
    },
    {
      id: "KB-2026-003",
      title: "Incorrect institutional record",
      description: "An institutional file contains a material factual error that affects downstream decisions and must be corrected with provenance preserved.",
      category: "Harm",
      status: "Disputed",
      direction: "Institutional",
      priority: "Critical",
      parties: ["Public Records Office"],
      relationship: "Institution",
      originEvent: "Administrative record entry",
      eventDate: daysFromNow(-180),
      dueDate: daysFromNow(-8),
      owner: "Records correction unit",
      monetaryValue: 0,
      currency: "CAD",
      nonMonetaryValue: "Identity integrity, procedural fairness, time, reputation, and downstream decision quality.",
      impact: "Severe",
      urgency: "Immediate",
      tags: ["institution", "record", "correction", "provenance"],
      lineage: "Original entry, correction request, response, and downstream references.",
      evidence: ["Original record copy", "Correction request receipt", "Source document contradicting entry"],
      repairPlan: "Freeze propagation, correct the source record, issue a correction notice, identify downstream copies, and preserve the full change lineage.",
      repairActions: ["[x] Error identified", "[x] Correction requested", "[ ] Propagation frozen", "[ ] Source corrected", "[ ] Downstream notice issued"],
      acknowledgements: "Receipt confirmed; substance remains disputed.",
      closureCriteria: "Source corrected, downstream recipients notified, and correction evidence received.",
      closureStatement: "",
      closureDate: "",
      linkedRecords: [],
      notes: "Archive is prohibited until correction lineage is complete.",
      archived: false,
      createdAt: daysFromNow(-65) + "T13:00:00.000Z",
      updatedAt: daysFromNow(-1) + "T08:45:00.000Z",
      history: [
        { at: daysFromNow(-65) + "T13:00:00.000Z", action: "Record created", detail: "Institutional error and source contradiction captured." },
        { at: daysFromNow(-15) + "T11:30:00.000Z", action: "Evidence added", detail: "Correction receipt added to the proof register." },
        { at: daysFromNow(-1) + "T08:45:00.000Z", action: "Status changed", detail: "Acknowledged → Disputed" }
      ]
    },
    {
      id: "KB-2026-004",
      title: "Completed equipment repayment",
      description: "Repayment and acknowledgement for equipment purchased on another person's behalf.",
      category: "Financial",
      status: "Closed",
      direction: "Owed to me",
      priority: "Medium",
      parties: ["Project collaborator"],
      relationship: "Collaborator",
      originEvent: "Equipment purchase",
      eventDate: daysFromNow(-120),
      dueDate: daysFromNow(-20),
      owner: "Project collaborator",
      monetaryValue: 650,
      currency: "CAD",
      nonMonetaryValue: "Administrative time and trust.",
      impact: "Moderate",
      urgency: "Low",
      tags: ["financial", "equipment", "resolved"],
      lineage: "Receipt, transfer confirmation, and acknowledgement message.",
      evidence: ["Purchase receipt", "Transfer confirmation", "Closure acknowledgement"],
      repairPlan: "Full repayment and confirmation that no balance remains.",
      repairActions: ["[x] Amount confirmed", "[x] Transfer completed", "[x] Closure acknowledged"],
      acknowledgements: "Both parties confirm repayment is complete.",
      closureCriteria: "Full amount received and no remaining obligation.",
      closureStatement: "Payment received in full. The obligation and related administrative balance are closed.",
      closureDate: daysFromNow(-18),
      linkedRecords: [],
      notes: "Retained as a completed lineage example.",
      archived: false,
      createdAt: daysFromNow(-110) + "T15:00:00.000Z",
      updatedAt: daysFromNow(-18) + "T10:00:00.000Z",
      history: [
        { at: daysFromNow(-110) + "T15:00:00.000Z", action: "Record created", detail: "Equipment repayment obligation documented." },
        { at: daysFromNow(-18) + "T10:00:00.000Z", action: "Record closed", detail: "Repayment and mutual acknowledgement completed." }
      ]
    }
  ];

  const state = {
    bills: [],
    savedViews: [],
    showArchived: false,
    activeView: "dashboard",
    filters: { search: "", status: "All", category: "All", direction: "All", sort: "updated-desc" }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const slug = (value = "") => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const formatDate = (value) => value ? new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "short", day: "numeric" }).format(new Date(`${value.slice(0, 10)}T12:00:00`)) : "—";
  const formatDateTime = (value) => value ? new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "—";
  const currency = (value, code = "CAD") => new Intl.NumberFormat("en-CA", { style: "currency", currency: code || "CAD", maximumFractionDigits: 0 }).format(Number(value || 0));
  const splitCsv = (value) => String(value || "").split(",").map(item => item.trim()).filter(Boolean);
  const splitLines = (value) => String(value || "").split(/\r?\n/).map(item => item.trim()).filter(Boolean);
  const unique = (items) => [...new Set(items.filter(Boolean))];
  const isOverdue = (bill) => bill.dueDate && bill.dueDate < today() && !["Closed", "Fulfilled", "Archived"].includes(bill.status);
  const activeBills = () => state.bills.filter(bill => !bill.archived && bill.status !== "Archived");

  function normalizeBill(bill) {
    const timestamp = now();
    return {
      id: bill.id || createId(),
      title: bill.title || "Untitled karmic bill",
      description: bill.description || "",
      category: CATEGORIES.includes(bill.category) ? bill.category : "Other",
      status: STATUSES.includes(bill.status) ? bill.status : "Draft",
      direction: DIRECTIONS.includes(bill.direction) ? bill.direction : "Mutual",
      priority: ["Low", "Medium", "High", "Critical"].includes(bill.priority) ? bill.priority : "Medium",
      parties: Array.isArray(bill.parties) ? bill.parties : splitCsv(bill.parties),
      relationship: bill.relationship || "",
      originEvent: bill.originEvent || "",
      eventDate: bill.eventDate || "",
      dueDate: bill.dueDate || "",
      owner: bill.owner || "",
      monetaryValue: Number(bill.monetaryValue || 0),
      currency: String(bill.currency || "CAD").toUpperCase().slice(0, 3),
      nonMonetaryValue: bill.nonMonetaryValue || "",
      impact: bill.impact || "Moderate",
      urgency: bill.urgency || "Moderate",
      tags: Array.isArray(bill.tags) ? bill.tags : splitCsv(bill.tags),
      lineage: bill.lineage || "",
      evidence: Array.isArray(bill.evidence) ? bill.evidence : splitLines(bill.evidence),
      repairPlan: bill.repairPlan || "",
      repairActions: Array.isArray(bill.repairActions) ? bill.repairActions : splitLines(bill.repairActions),
      acknowledgements: bill.acknowledgements || "",
      closureCriteria: bill.closureCriteria || "",
      closureStatement: bill.closureStatement || "",
      closureDate: bill.closureDate || "",
      linkedRecords: Array.isArray(bill.linkedRecords) ? bill.linkedRecords : splitCsv(bill.linkedRecords),
      notes: bill.notes || "",
      archived: Boolean(bill.archived || bill.status === "Archived"),
      createdAt: bill.createdAt || timestamp,
      updatedAt: bill.updatedAt || timestamp,
      history: Array.isArray(bill.history) ? bill.history : [{ at: timestamp, action: "Record created", detail: "Imported or initialized record." }]
    };
  }

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      state.bills = Array.isArray(stored?.bills) && stored.bills.length ? stored.bills.map(normalizeBill) : sampleBills.map(normalizeBill);
    } catch {
      state.bills = sampleBills.map(normalizeBill);
    }
    try {
      state.savedViews = JSON.parse(localStorage.getItem(SAVED_VIEWS_KEY)) || [];
    } catch {
      state.savedViews = [];
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, exportedAt: now(), bills: state.bills }));
    $("#freshnessText").textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  function createId() {
    const year = new Date().getFullYear();
    const sequence = state.bills.reduce((max, bill) => {
      const match = String(bill.id).match(/KB-\d{4}-(\d+)/);
      return Math.max(max, match ? Number(match[1]) : 0);
    }, 0) + 1;
    return `KB-${year}-${String(sequence).padStart(3, "0")}`;
  }

  function addHistory(bill, action, detail) {
    bill.history = [...(bill.history || []), { at: now(), action, detail }];
    bill.updatedAt = now();
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function fillSelect(select, options, includeAll = false) {
    select.innerHTML = `${includeAll ? '<option value="All">All</option>' : ""}${options.map(option => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}`;
  }

  function initializeControls() {
    fillSelect($("#statusFilter"), STATUSES, true);
    fillSelect($("#categoryFilter"), CATEGORIES, true);
    fillSelect($("#directionFilter"), DIRECTIONS, true);
    fillSelect($("#category"), CATEGORIES);
    fillSelect($("#status"), STATUSES);
    fillSelect($("#direction"), DIRECTIONS);
  }

  function switchView(view) {
    state.activeView = view;
    $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === view));
    $$("[data-view-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.viewPanel === view));
    $("#viewTitle").textContent = VIEW_TITLES[view] || "Karmic Bills";
    $("#sidebar").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderMetrics() {
    const bills = activeBills();
    const open = bills.filter(bill => !["Closed", "Fulfilled"].includes(bill.status));
    const overdue = open.filter(isOverdue);
    const inRepair = bills.filter(bill => bill.status === "In Repair");
    const exposure = open.reduce((sum, bill) => sum + Number(bill.monetaryValue || 0), 0);
    const evidenceCount = bills.reduce((sum, bill) => sum + bill.evidence.length, 0);
    const closed = bills.filter(bill => bill.status === "Closed").length;
    const metrics = [
      ["Open records", open.length, `${bills.length} active total`],
      ["Monetary exposure", currency(exposure), "Non-monetary value tracked separately"],
      ["Overdue", overdue.length, overdue.length ? "Requires immediate review" : "No overdue obligations"],
      ["In repair", inRepair.length, `${closed} formally closed`],
      ["Evidence items", evidenceCount, "Across active records"],
      ["Critical priority", bills.filter(b => b.priority === "Critical").length, "Highest governance attention"],
      ["Acknowledged", bills.filter(b => b.status === "Acknowledged").length, "Recognition without closure"],
      ["Closure rate", bills.length ? `${Math.round((closed / bills.length) * 100)}%` : "0%", "Evidence-backed closures"]
    ];
    $("#metricGrid").innerHTML = metrics.map(([label, value, detail]) => `<article class="metric-card"><span class="metric-label">${escapeHtml(label)}</span><strong class="metric-value">${escapeHtml(value)}</strong><span class="metric-detail">${escapeHtml(detail)}</span></article>`).join("");
  }

  function renderPriorityTable() {
    const bills = activeBills()
      .filter(bill => !["Closed", "Fulfilled"].includes(bill.status))
      .sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority] || String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999")))
      .slice(0, 7);
    $("#priorityTableBody").innerHTML = bills.length ? bills.map(bill => `
      <tr data-open-record="${bill.id}">
        <td><span class="row-title">${escapeHtml(bill.title)}</span><span class="row-subtitle">${escapeHtml(bill.id)} · ${escapeHtml(bill.category)}</span></td>
        <td>${escapeHtml(bill.relationship || bill.parties.join(", ") || "—")}</td>
        <td><span class="badge status-${slug(bill.status)}">${escapeHtml(bill.status)}</span></td>
        <td><span class="priority-${slug(bill.priority)}">${escapeHtml(bill.priority)}</span></td>
        <td>${isOverdue(bill) ? `<span class="priority-critical">Overdue · ${formatDate(bill.dueDate)}</span>` : formatDate(bill.dueDate)}</td>
      </tr>`).join("") : `<tr><td colspan="5">No active records.</td></tr>`;
  }

  function renderStatusDistribution() {
    const bills = activeBills();
    const counts = STATUSES.filter(status => status !== "Archived").map(status => [status, bills.filter(bill => bill.status === status).length]);
    const max = Math.max(...counts.map(([, count]) => count), 1);
    $("#statusDistribution").innerHTML = counts.filter(([, count]) => count > 0).map(([status, count]) => `
      <div class="distribution-row"><div class="distribution-head"><span>${escapeHtml(status)}</span><strong>${count}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(8, (count / max) * 100)}%"></div></div></div>`).join("") || `<p>No records yet.</p>`;
  }

  function actionProgress(bill) {
    const total = bill.repairActions.length;
    if (!total) return 0;
    const complete = bill.repairActions.filter(action => /^\[x\]/i.test(action)).length;
    return Math.round((complete / total) * 100);
  }

  function renderRepairProgress() {
    const bills = activeBills().filter(bill => bill.repairPlan || bill.repairActions.length).sort((a, b) => actionProgress(b) - actionProgress(a)).slice(0, 6);
    $("#repairProgress").innerHTML = bills.length ? bills.map(bill => {
      const progress = actionProgress(bill);
      return `<div class="progress-item"><div class="progress-head"><span>${escapeHtml(bill.title)}</span><strong>${progress}%</strong></div><div class="bar-track"><div class="bar-fill" style="width:${progress}%"></div></div></div>`;
    }).join("") : `<p>No repair plans recorded.</p>`;
  }

  function timelineEvents(limit) {
    const events = state.bills.flatMap(bill => (bill.history || []).map(event => ({ ...event, billId: bill.id, title: bill.title }))).sort((a, b) => new Date(b.at) - new Date(a.at));
    return typeof limit === "number" ? events.slice(0, limit) : events;
  }

  function renderTimeline(target, limit) {
    const events = timelineEvents(limit);
    $(target).innerHTML = events.length ? events.map(event => `<div class="timeline-item" data-open-record="${event.billId}"><strong>${escapeHtml(event.action)} · ${escapeHtml(event.title)}</strong><span>${escapeHtml(event.detail)}<br>${formatDateTime(event.at)} · ${escapeHtml(event.billId)}</span></div>`).join("") : `<p>No audit events recorded.</p>`;
  }

  function filteredBills() {
    const { search, status, category, direction, sort } = state.filters;
    const query = search.trim().toLowerCase();
    const results = state.bills.filter(bill => {
      if (!state.showArchived && (bill.archived || bill.status === "Archived")) return false;
      if (status !== "All" && bill.status !== status) return false;
      if (category !== "All" && bill.category !== category) return false;
      if (direction !== "All" && bill.direction !== direction) return false;
      if (query) {
        const haystack = [bill.id, bill.title, bill.description, bill.category, bill.status, bill.direction, bill.priority, bill.relationship, bill.originEvent, bill.owner, bill.nonMonetaryValue, bill.lineage, bill.acknowledgements, bill.closureCriteria, bill.closureStatement, bill.notes, ...bill.parties, ...bill.tags, ...bill.evidence, ...bill.repairActions].join(" ").toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
    const sorters = {
      "updated-desc": (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      "priority-desc": (a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority] || new Date(b.updatedAt) - new Date(a.updatedAt),
      "due-asc": (a, b) => String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999")),
      "created-desc": (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      "title-asc": (a, b) => a.title.localeCompare(b.title)
    };
    return results.sort(sorters[sort] || sorters["updated-desc"]);
  }

  function renderLedger() {
    const bills = filteredBills();
    $("#ledgerCards").innerHTML = bills.map(bill => `
      <article class="ledger-card">
        <div class="card-cell"><h4>${escapeHtml(bill.title)}</h4><p>${escapeHtml(bill.id)} · ${escapeHtml(bill.category)} · ${escapeHtml(bill.parties.join(", ") || "No party recorded")}</p></div>
        <div class="card-cell"><label>Status</label><span class="badge status-${slug(bill.status)}">${escapeHtml(bill.status)}</span></div>
        <div class="card-cell"><label>Priority</label><span class="priority-${slug(bill.priority)}">${escapeHtml(bill.priority)}</span></div>
        <div class="card-cell optional-cell"><label>Direction</label><span>${escapeHtml(bill.direction)}</span></div>
        <div class="card-cell optional-cell"><label>Due</label><span class="${isOverdue(bill) ? "priority-critical" : ""}">${isOverdue(bill) ? "Overdue · " : ""}${formatDate(bill.dueDate)}</span></div>
        <div class="card-actions"><button class="button secondary" data-view-record="${bill.id}">View</button><button class="button secondary" data-edit-record="${bill.id}">Edit</button></div>
      </article>`).join("");
    $("#ledgerEmpty").hidden = bills.length > 0;
    $("#showArchivedButton").textContent = state.showArchived ? "Hide archived" : "Show archived";
  }

  function renderSavedViews() {
    $("#savedViews").innerHTML = state.savedViews.map((view, index) => `<span class="saved-view"><button type="button" data-apply-view="${index}">${escapeHtml(view.name)}</button><button type="button" aria-label="Delete saved view" data-delete-view="${index}">×</button></span>`).join("");
  }

  function renderPeople() {
    const map = new Map();
    activeBills().forEach(bill => {
      const parties = bill.parties.length ? bill.parties : ["Unassigned"];
      parties.forEach(party => {
        const current = map.get(party) || { name: party, records: 0, open: 0, exposure: 0, relationships: new Set(), directions: new Set() };
        current.records += 1;
        if (!["Closed", "Fulfilled"].includes(bill.status)) current.open += 1;
        current.exposure += Number(bill.monetaryValue || 0);
        if (bill.relationship) current.relationships.add(bill.relationship);
        current.directions.add(bill.direction);
        map.set(party, current);
      });
    });
    $("#peopleGrid").innerHTML = [...map.values()].sort((a, b) => b.open - a.open || a.name.localeCompare(b.name)).map(entity => `
      <article class="entity-card"><h4>${escapeHtml(entity.name)}</h4><p>${entity.records} record${entity.records === 1 ? "" : "s"} · ${entity.open} unresolved</p><p>${escapeHtml([...entity.relationships].join(", ") || "Relationship not classified")}</p><p>${currency(entity.exposure)} monetary exposure</p><p>${escapeHtml([...entity.directions].join(" · "))}</p></article>`).join("") || `<p>No people or entities recorded.</p>`;
  }

  function renderEvidence() {
    const items = activeBills().flatMap(bill => bill.evidence.map((evidence, index) => ({ bill, evidence, index })));
    $("#evidenceList").innerHTML = items.map(item => `<article class="evidence-item" data-open-record="${item.bill.id}"><h4>${escapeHtml(item.evidence)}</h4><p>${escapeHtml(item.bill.title)} · ${escapeHtml(item.bill.id)}</p><span class="badge">Evidence ${item.index + 1}</span></article>`).join("") || `<p>No evidence has been registered.</p>`;
  }

  function renderRepairPlans() {
    const bills = activeBills().filter(bill => bill.repairPlan || bill.repairActions.length);
    $("#repairList").innerHTML = bills.map(bill => {
      const progress = actionProgress(bill);
      return `<article class="repair-item" data-open-record="${bill.id}"><div class="panel-header"><div><h4>${escapeHtml(bill.title)}</h4><p>${escapeHtml(bill.repairPlan || "Repair actions documented without a summary plan.")}</p></div><span class="badge status-${slug(bill.status)}">${progress}% complete</span></div><div class="bar-track"><div class="bar-fill" style="width:${progress}%"></div></div><p>${bill.repairActions.map(action => escapeHtml(action)).join("<br>") || "No milestones."}</p></article>`;
    }).join("") || `<p>No repair plans recorded.</p>`;
  }

  function renderAnalytics() {
    const bills = activeBills();
    const open = bills.filter(bill => !["Closed", "Fulfilled"].includes(bill.status));
    const closed = bills.filter(bill => bill.status === "Closed");
    const oldestOpen = [...open].sort((a, b) => new Date(a.eventDate || a.createdAt) - new Date(b.eventDate || b.createdAt))[0];
    const averageProgress = bills.length ? Math.round(bills.reduce((sum, bill) => sum + actionProgress(bill), 0) / bills.length) : 0;
    const categories = CATEGORIES.map(category => [category, bills.filter(bill => bill.category === category).length]).sort((a, b) => b[1] - a[1]);
    const topCategory = categories[0]?.[1] ? categories[0][0] : "—";
    const cards = [
      ["Resolution rate", bills.length ? `${Math.round((closed.length / bills.length) * 100)}%` : "0%", `${closed.length} evidence-backed closure${closed.length === 1 ? "" : "s"}`],
      ["Average repair progress", `${averageProgress}%`, "Across records with and without formal milestones"],
      ["Oldest unresolved", oldestOpen ? formatDate(oldestOpen.eventDate || oldestOpen.createdAt) : "—", oldestOpen?.title || "No unresolved records"],
      ["Largest category", topCategory, `${categories[0]?.[1] || 0} active records`],
      ["Overdue obligations", open.filter(isOverdue).length, "Past due and not fulfilled or closed"],
      ["Disputed records", bills.filter(bill => bill.status === "Disputed").length, "Require explicit contention handling"]
    ];
    $("#analyticsGrid").innerHTML = cards.map(([label, value, detail]) => `<article class="panel analytics-card"><p class="eyebrow">${escapeHtml(label)}</p><strong class="big-number">${escapeHtml(value)}</strong><p>${escapeHtml(detail)}</p></article>`).join("");
  }

  function renderAll() {
    renderMetrics();
    renderPriorityTable();
    renderStatusDistribution();
    renderRepairProgress();
    renderTimeline("#recentChanges", 7);
    renderLedger();
    renderSavedViews();
    renderPeople();
    renderEvidence();
    renderRepairPlans();
    renderTimeline("#fullTimeline");
    renderAnalytics();
  }

  function setFormValue(id, value) {
    const element = $(`#${id}`);
    if (element) element.value = value ?? "";
  }

  function openForm(billId = null) {
    const bill = billId ? state.bills.find(item => item.id === billId) : null;
    $("#dialogTitle").textContent = bill ? `Edit ${bill.id}` : "New karmic bill";
    setFormValue("billId", bill?.id || "");
    setFormValue("title", bill?.title || "");
    setFormValue("category", bill?.category || "Accountability");
    setFormValue("status", bill?.status || "Draft");
    setFormValue("direction", bill?.direction || "Mutual");
    setFormValue("priority", bill?.priority || "Medium");
    setFormValue("description", bill?.description || "");
    setFormValue("parties", bill?.parties.join(", ") || "");
    setFormValue("relationship", bill?.relationship || "");
    setFormValue("originEvent", bill?.originEvent || "");
    setFormValue("eventDate", bill?.eventDate || "");
    setFormValue("dueDate", bill?.dueDate || "");
    setFormValue("owner", bill?.owner || "");
    setFormValue("monetaryValue", bill?.monetaryValue || "");
    setFormValue("currency", bill?.currency || "CAD");
    setFormValue("nonMonetaryValue", bill?.nonMonetaryValue || "");
    setFormValue("impact", bill?.impact || "Moderate");
    setFormValue("urgency", bill?.urgency || "Moderate");
    setFormValue("tags", bill?.tags.join(", ") || "");
    setFormValue("lineage", bill?.lineage || "");
    setFormValue("evidence", bill?.evidence.join("\n") || "");
    setFormValue("repairPlan", bill?.repairPlan || "");
    setFormValue("repairActions", bill?.repairActions.join("\n") || "");
    setFormValue("acknowledgements", bill?.acknowledgements || "");
    setFormValue("closureCriteria", bill?.closureCriteria || "");
    setFormValue("closureStatement", bill?.closureStatement || "");
    setFormValue("closureDate", bill?.closureDate || "");
    setFormValue("linkedRecords", bill?.linkedRecords.join(", ") || "");
    setFormValue("notes", bill?.notes || "");
    $("#billDialog").showModal();
  }

  function readForm() {
    const value = (id) => $(`#${id}`).value.trim();
    return normalizeBill({
      id: value("billId") || createId(),
      title: value("title"),
      category: value("category"),
      status: value("status"),
      direction: value("direction"),
      priority: value("priority"),
      description: value("description"),
      parties: splitCsv(value("parties")),
      relationship: value("relationship"),
      originEvent: value("originEvent"),
      eventDate: value("eventDate"),
      dueDate: value("dueDate"),
      owner: value("owner"),
      monetaryValue: Number(value("monetaryValue") || 0),
      currency: value("currency") || "CAD",
      nonMonetaryValue: value("nonMonetaryValue"),
      impact: value("impact"),
      urgency: value("urgency"),
      tags: splitCsv(value("tags")),
      lineage: value("lineage"),
      evidence: splitLines(value("evidence")),
      repairPlan: value("repairPlan"),
      repairActions: splitLines(value("repairActions")),
      acknowledgements: value("acknowledgements"),
      closureCriteria: value("closureCriteria"),
      closureStatement: value("closureStatement"),
      closureDate: value("closureDate"),
      linkedRecords: splitCsv(value("linkedRecords")),
      notes: value("notes")
    });
  }

  function saveForm(event) {
    event.preventDefault();
    const incoming = readForm();
    if (!incoming.title || !incoming.description) {
      showToast("Title and description are required.");
      return;
    }
    if (incoming.status === "Closed" && (!incoming.closureCriteria || !incoming.closureStatement || !incoming.closureDate)) {
      showToast("Closure requires criteria, a closure statement, and a closure date.");
      return;
    }
    const index = state.bills.findIndex(bill => bill.id === incoming.id);
    if (index >= 0) {
      const previous = state.bills[index];
      incoming.createdAt = previous.createdAt;
      incoming.history = [...previous.history];
      incoming.archived = incoming.status === "Archived" || previous.archived;
      const changes = [];
      ["title", "category", "status", "direction", "priority", "dueDate", "owner"].forEach(field => {
        if (String(previous[field] || "") !== String(incoming[field] || "")) changes.push(`${field}: ${previous[field] || "—"} → ${incoming[field] || "—"}`);
      });
      addHistory(incoming, incoming.status === "Closed" && previous.status !== "Closed" ? "Record closed" : "Record updated", changes.join("; ") || "Record content updated.");
      state.bills[index] = incoming;
      showToast(`${incoming.id} updated.`);
    } else {
      incoming.createdAt = now();
      incoming.updatedAt = incoming.createdAt;
      incoming.history = [{ at: incoming.createdAt, action: "Record created", detail: "Karmic bill entered into the governed ledger." }];
      state.bills.unshift(incoming);
      showToast(`${incoming.id} created.`);
    }
    persist();
    $("#billDialog").close();
    renderAll();
  }

  function detailField(label, value) {
    const content = Array.isArray(value) ? value.join("\n") : value;
    return `<div class="detail-field"><label>${escapeHtml(label)}</label><p>${escapeHtml(content || "—")}</p></div>`;
  }

  function openDetails(id) {
    const bill = state.bills.find(item => item.id === id);
    if (!bill) return;
    $("#detailTitle").textContent = bill.title;
    $("#detailContent").innerHTML = `
      <section class="detail-section"><div class="detail-grid">${detailField("Record ID", bill.id)}${detailField("Status", bill.status)}${detailField("Category", bill.category)}${detailField("Direction", bill.direction)}${detailField("Priority", bill.priority)}${detailField("Relationship", bill.relationship)}${detailField("People / entities", bill.parties)}${detailField("Accountability owner", bill.owner)}${detailField("Originating event", bill.originEvent)}${detailField("Event date", formatDate(bill.eventDate))}${detailField("Due date", formatDate(bill.dueDate))}${detailField("Monetary value", currency(bill.monetaryValue, bill.currency))}${detailField("Impact", bill.impact)}${detailField("Urgency", bill.urgency)}</div></section>
      <section class="detail-section"><h3>Meaning and value</h3><div class="detail-grid">${detailField("Description", bill.description)}${detailField("Non-monetary value", bill.nonMonetaryValue)}${detailField("Tags", bill.tags)}</div></section>
      <section class="detail-section"><h3>Evidence and lineage</h3><div class="detail-grid">${detailField("Lineage / source", bill.lineage)}${detailField("Evidence", bill.evidence)}${detailField("Linked records", bill.linkedRecords)}${detailField("Acknowledgements", bill.acknowledgements)}</div></section>
      <section class="detail-section"><h3>Repair</h3><div class="detail-grid">${detailField("Repair plan", bill.repairPlan)}${detailField("Actions / milestones", bill.repairActions)}${detailField("Progress", `${actionProgress(bill)}%`)}${detailField("Notes", bill.notes)}</div></section>
      <section class="detail-section"><h3>Closure</h3><div class="detail-grid">${detailField("Closure criteria", bill.closureCriteria)}${detailField("Closure statement", bill.closureStatement)}${detailField("Closure date", formatDate(bill.closureDate))}${detailField("Updated", formatDateTime(bill.updatedAt))}</div></section>
      <section class="detail-section"><h3>Record history</h3><div class="timeline-list">${bill.history.slice().sort((a,b) => new Date(b.at) - new Date(a.at)).map(event => `<div class="timeline-item"><strong>${escapeHtml(event.action)}</strong><span>${escapeHtml(event.detail)}<br>${formatDateTime(event.at)}</span></div>`).join("")}</div></section>`;
    $("#detailActions").innerHTML = `
      <button class="button secondary" data-print-record="${bill.id}">Print</button>
      <button class="button secondary" data-edit-record="${bill.id}">Edit</button>
      ${bill.status !== "Closed" && !bill.archived ? `<button class="button primary" data-close-record="${bill.id}">Close record</button>` : ""}
      <button class="button danger" data-archive-record="${bill.id}">${bill.archived || bill.status === "Archived" ? "Restore" : "Archive"}</button>`;
    $("#detailDialog").showModal();
  }

  function archiveOrRestore(id) {
    const bill = state.bills.find(item => item.id === id);
    if (!bill) return;
    const restoring = bill.archived || bill.status === "Archived";
    const message = restoring ? "Restore this record to the active ledger?" : "Archive this record? It will remain preserved and auditable.";
    if (!window.confirm(message)) return;
    bill.archived = !restoring;
    bill.status = restoring ? "Open" : "Archived";
    addHistory(bill, restoring ? "Record restored" : "Record archived", restoring ? "Returned to the active ledger." : "Removed from active views without deletion.");
    persist();
    $("#detailDialog").close();
    renderAll();
    showToast(restoring ? `${id} restored.` : `${id} archived.`);
  }

  function beginClosure(id) {
    const bill = state.bills.find(item => item.id === id);
    if (!bill) return;
    $("#detailDialog").close();
    openForm(id);
    setFormValue("status", "Closed");
    if (!bill.closureDate) setFormValue("closureDate", today());
    $("#closureStatement").focus();
    showToast("Complete the closure criteria, statement, date, and evidence before saving.");
  }

  function printRecord(id) {
    const bill = state.bills.find(item => item.id === id);
    if (!bill) return;
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      showToast("Pop-up blocked. Allow pop-ups to print this record.");
      return;
    }
    popup.document.write(`<!doctype html><html><head><title>${escapeHtml(bill.id)} · ${escapeHtml(bill.title)}</title><style>body{font-family:Arial,sans-serif;max-width:850px;margin:40px auto;padding:0 24px;color:#15202b}h1{margin-bottom:4px}.meta{color:#5a6875;margin-bottom:28px}.section{border-top:1px solid #ccd4db;padding:18px 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}label{display:block;text-transform:uppercase;font-size:10px;letter-spacing:.08em;color:#697985;margin-bottom:4px}p{white-space:pre-wrap;line-height:1.55}@media print{body{margin:0}}</style></head><body><p>SOVRINT™ KARMIC BILLS</p><h1>${escapeHtml(bill.title)}</h1><div class="meta">${escapeHtml(bill.id)} · ${escapeHtml(bill.status)} · Updated ${escapeHtml(formatDateTime(bill.updatedAt))}</div><div class="section"><div class="grid">${detailField("Category", bill.category)}${detailField("Direction", bill.direction)}${detailField("Priority", bill.priority)}${detailField("Parties", bill.parties)}${detailField("Relationship", bill.relationship)}${detailField("Due", formatDate(bill.dueDate))}</div></div><div class="section"><h2>Description</h2><p>${escapeHtml(bill.description)}</p><h2>Value</h2><p>${escapeHtml(`${currency(bill.monetaryValue, bill.currency)}\n${bill.nonMonetaryValue}`)}</p></div><div class="section"><h2>Evidence and lineage</h2><p>${escapeHtml(bill.lineage)}\n\n${escapeHtml(bill.evidence.join("\n"))}</p></div><div class="section"><h2>Repair and closure</h2><p>${escapeHtml(bill.repairPlan)}\n\n${escapeHtml(bill.repairActions.join("\n"))}\n\nCriteria: ${escapeHtml(bill.closureCriteria)}\nStatement: ${escapeHtml(bill.closureStatement)}\nClosure date: ${escapeHtml(formatDate(bill.closureDate))}</p></div></body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  function exportJson() {
    download(`sovrint-karmic-bills-${today()}.json`, JSON.stringify({ schema: "sovrint.karmic-bills.v1", exportedAt: now(), bills: state.bills }, null, 2), "application/json");
    showToast("Ledger exported as JSON.");
  }

  function csvCell(value) {
    const string = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
    return `"${string.replaceAll('"', '""')}"`;
  }

  function exportCsv() {
    const fields = ["id","title","category","status","direction","priority","parties","relationship","originEvent","eventDate","dueDate","owner","monetaryValue","currency","nonMonetaryValue","impact","urgency","tags","lineage","evidence","repairPlan","repairActions","acknowledgements","closureCriteria","closureStatement","closureDate","linkedRecords","notes","createdAt","updatedAt"];
    const rows = [fields.join(","), ...filteredBills().map(bill => fields.map(field => csvCell(bill[field])).join(","))];
    download(`sovrint-karmic-bills-${today()}.csv`, rows.join("\n"), "text/csv;charset=utf-8");
    showToast("Current ledger view exported as CSV.");
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function importJson(file) {
    try {
      const payload = JSON.parse(await file.text());
      const incoming = Array.isArray(payload) ? payload : payload.bills;
      if (!Array.isArray(incoming)) throw new Error("No bills array found");
      const normalized = incoming.map(normalizeBill);
      const replace = window.confirm(`Import ${normalized.length} records? Choose OK to replace the current ledger, or Cancel to merge them.`);
      if (replace) {
        state.bills = normalized;
      } else {
        const existing = new Map(state.bills.map(bill => [bill.id, bill]));
        normalized.forEach(bill => {
          if (existing.has(bill.id)) {
            bill.id = createId();
            addHistory(bill, "Record imported", "ID changed to prevent collision during merge.");
          }
          state.bills.push(bill);
        });
      }
      persist();
      renderAll();
      showToast(`${normalized.length} records imported.`);
    } catch (error) {
      showToast(`Import failed: ${error.message}`);
    } finally {
      $("#importFile").value = "";
    }
  }

  function saveCurrentView() {
    const defaultName = [state.filters.status, state.filters.category, state.filters.direction].filter(value => value !== "All").join(" · ") || "Custom ledger view";
    const name = window.prompt("Name this saved view:", defaultName);
    if (!name?.trim()) return;
    state.savedViews.push({ name: name.trim(), filters: { ...state.filters }, showArchived: state.showArchived });
    localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(state.savedViews));
    renderSavedViews();
    showToast("View saved.");
  }

  function applySavedView(index) {
    const view = state.savedViews[index];
    if (!view) return;
    state.filters = { ...state.filters, ...view.filters };
    state.showArchived = Boolean(view.showArchived);
    $("#searchInput").value = state.filters.search;
    $("#statusFilter").value = state.filters.status;
    $("#categoryFilter").value = state.filters.category;
    $("#directionFilter").value = state.filters.direction;
    $("#sortFilter").value = state.filters.sort;
    renderLedger();
    showToast(`Applied “${view.name}”.`);
  }

  function deleteSavedView(index) {
    state.savedViews.splice(index, 1);
    localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(state.savedViews));
    renderSavedViews();
  }

  function bindEvents() {
    $$(".nav-link").forEach(button => button.addEventListener("click", () => switchView(button.dataset.view)));
    $$('[data-switch-view]').forEach(button => button.addEventListener("click", () => switchView(button.dataset.switchView)));
    $("#menuButton").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    ["#newBillButton", "#heroNewBillButton"].forEach(selector => $(selector).addEventListener("click", () => openForm()));
    $("#closeDialogButton").addEventListener("click", () => $("#billDialog").close());
    $("#cancelButton").addEventListener("click", () => $("#billDialog").close());
    $("#closeDetailButton").addEventListener("click", () => $("#detailDialog").close());
    $("#billForm").addEventListener("submit", saveForm);
    $("#exportJsonButton").addEventListener("click", exportJson);
    $("#exportCsvButton").addEventListener("click", exportCsv);
    $("#importButton").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", event => event.target.files[0] && importJson(event.target.files[0]));
    $("#printDashboardButton").addEventListener("click", () => window.print());
    $("#showArchivedButton").addEventListener("click", () => { state.showArchived = !state.showArchived; renderLedger(); });
    $("#saveViewButton").addEventListener("click", saveCurrentView);

    const filterBindings = [
      ["#searchInput", "search", "input"],
      ["#statusFilter", "status", "change"],
      ["#categoryFilter", "category", "change"],
      ["#directionFilter", "direction", "change"],
      ["#sortFilter", "sort", "change"]
    ];
    filterBindings.forEach(([selector, field, eventName]) => $(selector).addEventListener(eventName, event => { state.filters[field] = event.target.value; renderLedger(); }));

    document.addEventListener("click", event => {
      const viewButton = event.target.closest("[data-view-record]");
      const editButton = event.target.closest("[data-edit-record]");
      const openRecord = event.target.closest("[data-open-record]");
      const archiveButton = event.target.closest("[data-archive-record]");
      const closeButton = event.target.closest("[data-close-record]");
      const printButton = event.target.closest("[data-print-record]");
      const applyView = event.target.closest("[data-apply-view]");
      const deleteView = event.target.closest("[data-delete-view]");
      if (viewButton) openDetails(viewButton.dataset.viewRecord);
      else if (editButton) { $("#detailDialog").open && $("#detailDialog").close(); openForm(editButton.dataset.editRecord); }
      else if (openRecord) openDetails(openRecord.dataset.openRecord);
      else if (archiveButton) archiveOrRestore(archiveButton.dataset.archiveRecord);
      else if (closeButton) beginClosure(closeButton.dataset.closeRecord);
      else if (printButton) printRecord(printButton.dataset.printRecord);
      else if (applyView) applySavedView(Number(applyView.dataset.applyView));
      else if (deleteView) deleteSavedView(Number(deleteView.dataset.deleteView));
    });
  }

  function init() {
    loadState();
    initializeControls();
    bindEvents();
    renderAll();
    switchView("dashboard");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
