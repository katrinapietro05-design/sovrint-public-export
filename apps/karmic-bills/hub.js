(() => {
  "use strict";

  const STORAGE_KEY = "sovrint.karmic-bills.v1";
  const MODULE_ID = "sovrint.karmic-bills";
  const MODULE_VERSION = "1.1.0";
  const DIMENSIONS = [
    { key: "truth", label: "Truth", description: "Evidence, lineage, factual specificity, and closure proof." },
    { key: "agency", label: "Agency", description: "Ownership, repair authority, actionability, and consent." },
    { key: "continuity", label: "Continuity", description: "Dates, history, linked records, and preserved state change." },
    { key: "relation", label: "Relation", description: "Parties, relationship context, acknowledgement, and mutual effects." },
    { key: "sovereignty", label: "Sovereignty", description: "Custody, explicit criteria, governed status, and non-deletion." }
  ];

  const DEMO_BILLS = [
    {
      id: "KB-2026-001", title: "Unreturned strategic design labour", status: "In Repair", priority: "Critical",
      parties: ["Northline Initiative"], relationship: "Prospective client", owner: "Northline Initiative",
      eventDate: "2026-03-20", dueDate: "2026-07-01", evidence: ["Agreed scope", "Architecture draft", "Delivery acknowledgement"],
      lineage: "Email scope, meeting notes, architecture draft, and delivery timeline.",
      repairPlan: "Confirm scope, issue payment, provide attribution, and close with mutual acknowledgement.",
      repairActions: ["[x] Inventory", "[x] Evidence", "[ ] Acknowledgement", "[ ] Payment", "[ ] Closure"],
      acknowledgements: "Receipt acknowledged.", closureCriteria: "Payment, attribution, and mutual confirmation.",
      closureStatement: "", closureDate: "", linkedRecords: [], archived: false,
      history: [{ at: "2026-03-28T14:00:00.000Z", action: "Record created", detail: "Labour obligation documented." }]
    },
    {
      id: "KB-2026-002", title: "Family caregiving commitment", status: "Acknowledged", priority: "High",
      parties: ["Family circle"], relationship: "Family", owner: "Shared", eventDate: "2026-05-17", dueDate: "2026-07-06",
      evidence: ["Shared calendar draft", "Message acknowledgement"], lineage: "Family discussion and schedule proposal.",
      repairPlan: "Adopt a four-week schedule and review distribution monthly.",
      repairActions: ["[x] Commitment acknowledged", "[ ] Schedule adopted", "[ ] Review completed"],
      acknowledgements: "All parties acknowledge the imbalance.", closureCriteria: "Four stable weeks and one review.",
      closureStatement: "", closureDate: "", linkedRecords: [], archived: false,
      history: [{ at: "2026-05-21T09:15:00.000Z", action: "Record created", detail: "Care commitment documented." }]
    },
    {
      id: "KB-2026-003", title: "Incorrect institutional record", status: "Disputed", priority: "Critical",
      parties: ["Public Records Office"], relationship: "Institution", owner: "Records correction unit",
      eventDate: "2025-12-28", dueDate: "2026-06-18", evidence: ["Original record", "Correction receipt", "Contradicting source"],
      lineage: "Original entry, correction request, response, and downstream references.",
      repairPlan: "Freeze propagation, correct the source, notify downstream recipients, and preserve lineage.",
      repairActions: ["[x] Error identified", "[x] Correction requested", "[ ] Source corrected", "[ ] Notice issued"],
      acknowledgements: "Receipt confirmed; substance remains disputed.", closureCriteria: "Source correction and downstream notice.",
      closureStatement: "", closureDate: "", linkedRecords: [], archived: false,
      history: [{ at: "2026-04-22T13:00:00.000Z", action: "Record created", detail: "Institutional error documented." }]
    },
    {
      id: "KB-2026-004", title: "Completed equipment repayment", status: "Closed", priority: "Medium",
      parties: ["Project collaborator"], relationship: "Collaborator", owner: "Project collaborator",
      eventDate: "2026-02-15", dueDate: "2026-06-06", evidence: ["Receipt", "Transfer confirmation", "Closure acknowledgement"],
      lineage: "Receipt, transfer confirmation, and acknowledgement.", repairPlan: "Full repayment and confirmation.",
      repairActions: ["[x] Amount confirmed", "[x] Transfer completed", "[x] Closure acknowledged"],
      acknowledgements: "Both parties confirm completion.", closureCriteria: "Full amount received.",
      closureStatement: "Payment received in full.", closureDate: "2026-06-08", linkedRecords: [], archived: false,
      history: [{ at: "2026-06-08T10:00:00.000Z", action: "Record closed", detail: "Repayment completed." }]
    }
  ];

  const $ = (selector) => document.querySelector(selector);
  const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
  const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const isFilled = (value) => Array.isArray(value) ? value.length > 0 : Boolean(String(value ?? "").trim());
  const activeStatus = (status) => !["Closed", "Fulfilled", "Archived"].includes(status);
  const isChecked = (action) => /^\[x\]/i.test(String(action || ""));
  const formatPercent = (value) => `${Math.round(clamp(value))}%`;
  const today = () => new Date().toISOString().slice(0, 10);

  function loadBills() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { bills: DEMO_BILLS, mode: "Demonstration data" };
      const parsed = JSON.parse(raw);
      const bills = Array.isArray(parsed) ? parsed : parsed?.bills;
      if (!Array.isArray(bills) || !bills.length) return { bills: DEMO_BILLS, mode: "Demonstration data" };
      return { bills, mode: "Local sovereign ledger" };
    } catch (error) {
      return { bills: DEMO_BILLS, mode: "Recovery demonstration", error };
    }
  }

  function scoreBill(bill) {
    const closed = bill.status === "Closed";
    const repairActions = Array.isArray(bill.repairActions) ? bill.repairActions : [];
    const evidence = Array.isArray(bill.evidence) ? bill.evidence : [];
    const history = Array.isArray(bill.history) ? bill.history : [];

    const truth = mean([
      evidence.length ? Math.min(100, 45 + evidence.length * 15) : 0,
      isFilled(bill.lineage) ? 100 : 0,
      isFilled(bill.description) ? 100 : 45,
      closed ? (isFilled(bill.closureStatement) && isFilled(bill.closureDate) ? 100 : 0) : 75
    ]);

    const agency = mean([
      isFilled(bill.owner) ? 100 : 0,
      isFilled(bill.repairPlan) ? 100 : 0,
      repairActions.length ? Math.min(100, 55 + repairActions.length * 9) : 0,
      isFilled(bill.acknowledgements) ? 100 : 45
    ]);

    const continuity = mean([
      isFilled(bill.eventDate) ? 100 : 0,
      isFilled(bill.dueDate) || closed ? 100 : 35,
      history.length ? Math.min(100, 55 + history.length * 12) : 0,
      Array.isArray(bill.linkedRecords) && bill.linkedRecords.length ? 100 : 65
    ]);

    const relation = mean([
      Array.isArray(bill.parties) && bill.parties.length ? 100 : 0,
      isFilled(bill.relationship) ? 100 : 0,
      isFilled(bill.acknowledgements) ? 100 : 40,
      isFilled(bill.nonMonetaryValue) ? 100 : 65
    ]);

    const sovereignty = mean([
      isFilled(bill.id) ? 100 : 0,
      isFilled(bill.closureCriteria) ? 100 : 45,
      isFilled(bill.status) ? 100 : 0,
      bill.archived || bill.status === "Archived" ? 100 : 90,
      closed ? (isFilled(bill.closureStatement) && isFilled(bill.closureDate) ? 100 : 0) : 85
    ]);

    return { truth, agency, continuity, relation, sovereignty };
  }

  function detectContradictions(bills) {
    const ids = new Set(bills.map((bill) => bill.id));
    const signals = [];

    bills.forEach((bill) => {
      const label = `${bill.id || "Unidentified"} · ${bill.title || "Untitled record"}`;
      const evidence = Array.isArray(bill.evidence) ? bill.evidence : [];
      const linked = Array.isArray(bill.linkedRecords) ? bill.linkedRecords : [];

      if (bill.status === "Closed" && (!isFilled(bill.closureCriteria) || !isFilled(bill.closureStatement) || !isFilled(bill.closureDate))) {
        signals.push({ severity: "critical", title: label, detail: "Closed status lacks complete closure criteria, statement, or date." });
      }
      if (bill.status === "Closed" && !evidence.length) {
        signals.push({ severity: "critical", title: label, detail: "Closed status has no registered evidence." });
      }
      if (bill.status === "In Repair" && !isFilled(bill.repairPlan)) {
        signals.push({ severity: "warning", title: label, detail: "In Repair status has no explicit repair plan." });
      }
      if (bill.status === "Disputed" && !evidence.length) {
        signals.push({ severity: "critical", title: label, detail: "Disputed record has no evidence registered." });
      }
      if (bill.eventDate && bill.dueDate && bill.dueDate < bill.eventDate) {
        signals.push({ severity: "warning", title: label, detail: "Due date precedes the originating event date." });
      }
      if ((bill.status === "Archived") !== Boolean(bill.archived)) {
        signals.push({ severity: "warning", title: label, detail: "Archive flag and lifecycle status are not aligned." });
      }
      linked.filter((id) => !ids.has(id)).forEach((id) => {
        signals.push({ severity: "warning", title: label, detail: `Linked record ${id} is not present in the current ledger.` });
      });
    });

    return signals;
  }

  function correctionPathways(bills) {
    const items = [];
    bills.filter((bill) => activeStatus(bill.status)).forEach((bill) => {
      const evidence = Array.isArray(bill.evidence) ? bill.evidence : [];
      const actions = Array.isArray(bill.repairActions) ? bill.repairActions : [];
      const complete = actions.filter(isChecked).length;
      const progress = actions.length ? Math.round((complete / actions.length) * 100) : 0;
      let urgency = 0;
      const reasons = [];

      if (bill.priority === "Critical") { urgency += 4; reasons.push("critical priority"); }
      else if (bill.priority === "High") { urgency += 3; reasons.push("high priority"); }
      if (bill.dueDate && bill.dueDate < today()) { urgency += 4; reasons.push("overdue"); }
      if (!evidence.length) { urgency += 3; reasons.push("evidence missing"); }
      if (!isFilled(bill.owner)) { urgency += 2; reasons.push("owner undefined"); }
      if (!isFilled(bill.repairPlan)) { urgency += 2; reasons.push("repair plan missing"); }
      if (bill.status === "Disputed") { urgency += 2; reasons.push("disputed"); }

      const nextAction = !evidence.length
        ? "Register evidence and source lineage."
        : !isFilled(bill.owner)
          ? "Assign an accountable owner."
          : !isFilled(bill.repairPlan)
            ? "Define the repair pathway and closure criteria."
            : actions.find((action) => !isChecked(action))?.replace(/^\[[ x]\]\s*/i, "") || "Review acknowledgement and closure readiness.";

      items.push({
        id: bill.id,
        title: bill.title,
        urgency,
        reasons: reasons.join(" · ") || "routine review",
        progress,
        nextAction
      });
    });

    return items.sort((a, b) => b.urgency - a.urgency || a.progress - b.progress).slice(0, 8);
  }

  function buildSnapshot() {
    const loaded = loadBills();
    const bills = loaded.bills;
    const scores = bills.map(scoreBill);
    const dimensions = Object.fromEntries(DIMENSIONS.map(({ key }) => [key, mean(scores.map((score) => score[key]))]));
    const coherence = mean(Object.values(dimensions));
    const active = bills.filter((bill) => activeStatus(bill.status));
    const evidenceCount = bills.reduce((sum, bill) => sum + (Array.isArray(bill.evidence) ? bill.evidence.length : 0), 0);
    const evidenceCoverage = bills.length ? bills.filter((bill) => Array.isArray(bill.evidence) && bill.evidence.length).length / bills.length * 100 : 0;
    const repairCoverage = active.length ? active.filter((bill) => isFilled(bill.repairPlan)).length / active.length * 100 : 100;
    const contradictions = detectContradictions(bills);
    const corrections = correctionPathways(bills);

    return {
      schema: "sovrint.integrity-snapshot.v1",
      module: MODULE_ID,
      version: MODULE_VERSION,
      generatedAt: new Date().toISOString(),
      dataMode: loaded.mode,
      bills,
      dimensions,
      coherence,
      metrics: {
        records: bills.length,
        unresolved: active.length,
        evidenceItems: evidenceCount,
        evidenceCoverage,
        repairCoverage,
        contradictions: contradictions.length
      },
      contradictions,
      corrections
    };
  }

  function renderSnapshot(snapshot) {
    $("#dataMode").textContent = snapshot.dataMode;
    $("#hubStatus").textContent = `${snapshot.metrics.records} records · ${snapshot.metrics.unresolved} unresolved`;
    $("#custodyValue").textContent = snapshot.dataMode === "Local sovereign ledger" ? "Local sovereign ledger" : "Demonstration layer";
    $("#coherenceScore").textContent = formatPercent(snapshot.coherence);

    $("#integrityGrid").innerHTML = DIMENSIONS.map((dimension, index) => {
      const score = snapshot.dimensions[dimension.key];
      return `<article class="integrity-card">
        <header><span class="dimension-index">0${index + 1}</span><strong class="dimension-score">${formatPercent(score)}</strong></header>
        <h3>${dimension.label}</h3>
        <p>${dimension.description}</p>
        <div class="score-track" aria-label="${dimension.label} ${formatPercent(score)}"><div class="score-fill" style="width:${clamp(score)}%"></div></div>
      </article>`;
    }).join("");

    const metricRows = [
      ["Records", snapshot.metrics.records],
      ["Unresolved", snapshot.metrics.unresolved],
      ["Evidence coverage", formatPercent(snapshot.metrics.evidenceCoverage)],
      ["Repair coverage", formatPercent(snapshot.metrics.repairCoverage)]
    ];
    $("#summaryMetrics").innerHTML = metricRows.map(([label, value]) => `<div class="summary-metric"><span>${label}</span><strong>${value}</strong></div>`).join("");

    $("#contradictionCount").textContent = snapshot.contradictions.length;
    $("#contradictionList").innerHTML = snapshot.contradictions.length
      ? snapshot.contradictions.slice(0, 7).map((signal) => `<div class="signal-item ${signal.severity}"><strong>${escapeHtml(signal.title)}</strong><span>${escapeHtml(signal.detail)}</span></div>`).join("")
      : `<p class="empty-message">No structural contradictions are visible in the current ledger.</p>`;

    $("#pathwayCount").textContent = snapshot.corrections.length;
    $("#correctionList").innerHTML = snapshot.corrections.length
      ? snapshot.corrections.map((item) => `<div class="correction-item"><div><strong>${escapeHtml(item.id)} · ${escapeHtml(item.title)}</strong><span>${escapeHtml(item.nextAction)}<br>${escapeHtml(item.reasons)}</span></div><div class="correction-meta"><em>${item.progress}% repair progress</em><span>urgency ${item.urgency}</span></div></div>`).join("")
      : `<p class="empty-message">No unresolved correction pathways remain.</p>`;

    window.SOVRINTHubModules[MODULE_ID].snapshot = snapshot;
    window.dispatchEvent(new CustomEvent("sovrint:integrity-snapshot", { detail: snapshot }));
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function refresh() {
    const snapshot = buildSnapshot();
    renderSnapshot(snapshot);
    return snapshot;
  }

  function exportSnapshot() {
    const snapshot = refresh();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `sovrint-integrity-snapshot-${today()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Integrity snapshot exported.");
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function exposeBridge() {
    window.SOVRINTHubModules = window.SOVRINTHubModules || {};
    window.SOVRINTHubModules[MODULE_ID] = {
      id: MODULE_ID,
      name: "Karmic Bills",
      version: MODULE_VERSION,
      route: "/karmic-bills",
      storageKey: STORAGE_KEY,
      capabilities: ["ledger", "integrity-engine", "evidence", "repair", "lineage", "closure", "import", "export"],
      getRecords: () => loadBills().bills,
      getIntegritySnapshot: () => buildSnapshot(),
      refresh,
      snapshot: null
    };
    window.dispatchEvent(new CustomEvent("sovrint:module-ready", { detail: window.SOVRINTHubModules[MODULE_ID] }));
  }

  function bindEvents() {
    $("#refreshButton").addEventListener("click", () => {
      refresh();
      showToast("Integrity Engine refreshed.");
    });
    $("#exportIntegrityButton").addEventListener("click", exportSnapshot);
    $("[data-anchor]").addEventListener("click", () => $("#anchor").scrollIntoView({ behavior: "smooth", block: "start" }));
    $("#ledgerFrame").addEventListener("load", () => {
      setTimeout(refresh, 120);
      showToast("Karmic Bills module connected.");
    });
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) refresh();
    });
    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "sovrint:karmic-bills:changed") refresh();
    });
  }

  function init() {
    exposeBridge();
    bindEvents();
    refresh();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
