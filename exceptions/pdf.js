(function () {
  'use strict';

  const LOGO = 'data:image/png;base64,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';

  const esc = v => String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const fmtNum = n => Number(n || 0).toLocaleString('pt-BR');
  const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
  const inst = e => {
    const n = Number(e && e.exceptionCount);
    return isNaN(n) ? 1 : n;
  };

  function parseDate(v) {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    const str = String(v).trim();
    const br = str.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (br) return new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]), Number(br[4] || 0), Number(br[5] || 0), Number(br[6] || 0));
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  function fmtDate(v) {
    const d = parseDate(v);
    if (!d) return '-';
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  function stateLabel(s) {
    const map = {
      ExceptionEventStateValidId: 'V├ílido',
      ExceptionEventStateInvalidId: 'Inv├ílido',
      ExceptionEventStateAcknowledgedId: 'Reconhecido'
    };
    return map[s] || String(s || '-').replace(/^ExceptionEventState/i, '').replace(/Id$/i, '');
  }

  function selectedText(id) {
    const el = document.getElementById(id);
    if (!el || !el.options || el.selectedIndex < 0) return '';
    return el.options[el.selectedIndex].textContent || '';
  }

  function filterList(problemFilter, rulesLabel) {
    const parts = [];
    const period = selectedText('periodFilter');
    if (period) parts.push('Per├¡odo: ' + period);
    const group = document.getElementById('groupFilter');
    if (group && group.value) parts.push('Grupo: ' + selectedText('groupFilter'));
    const rule = document.getElementById('ruleFilter');
    if (rule && rule.value) parts.push('Regra: ' + selectedText('ruleFilter'));
    const query = document.getElementById('queryFilter');
    if (query && query.value.trim()) parts.push('Busca: ' + query.value.trim());
    if (problemFilter) {
      const label = typeof rulesLabel === 'function' ? rulesLabel(problemFilter) : problemFilter;
      parts.push('Problema: ' + label);
    }
    return parts;
  }

  function summarize(list) {
    const byVehicle = {};
    const byRule = {};
    const buckets = [0, 0, 0];
    let instances = 0;

    list.forEach(e => {
      const count = inst(e);
      instances += count;

      const vid = e.veiculoId || e.deviceId || e.veiculo || 'sem-veiculo';
      const v = byVehicle[vid] || (byVehicle[vid] = {
        id: vid,
        veiculo: e.veiculo || e.placa || vid,
        placa: e.placa || e.veiculo || vid,
        events: 0,
        instances: 0,
        rules: {},
        last: null
      });
      v.events++;
      v.instances += count;
      v.rules[e.regraId || 'sem-regra'] = true;
      const dt = parseDate(e.activeFrom);
      if (dt && (!v.last || dt > v.last)) v.last = dt;

      const rid = e.regraId || 'sem-regra';
      const r = byRule[rid] || (byRule[rid] = {
        id: rid,
        name: e.regraNome || e.regra || 'Regra desconhecida',
        events: 0,
        instances: 0
      });
      r.events++;
      r.instances += count;

      const ms = Number(e.durationMs) || 0;
      if (ms < 10000) buckets[0]++;
      else if (ms < 30000) buckets[1]++;
      else buckets[2]++;
    });

    const rules = Object.values(byRule).sort((a, b) => b.instances - a.instances);
    const vehicles = Object.values(byVehicle).sort((a, b) => b.instances - a.instances || b.events - a.events);
    const rulesCount = rules.length;
    const vehicleCount = vehicles.length;
    const activeCount = Array.isArray(window.__exception360Vehicles) ? window.__exception360Vehicles.length : 0;

    return {
      events: list.length,
      instances,
      buckets,
      rules,
      rulesCount,
      vehicles,
      vehicleCount,
      activeCount,
      coverage: pct(vehicleCount, activeCount)
    };
  }

  function statusFor(instances) {
    if (instances >= 1000) return { label: 'Cr├¡tico', cls: 'pdf-risk' };
    if (instances >= 300) return { label: 'Aten├º├úo', cls: 'pdf-warn' };
    return { label: 'Normal', cls: 'pdf-ok' };
  }

  function readExecutive(s, filters) {
    const top = s.rules[0];
    const coverage = s.activeCount ? s.coverage + '%' : '-';
    const parts = [];
    parts.push('Foram registrados ' + fmtNum(s.events) + ' eventos no per├¡odo, somando ' + fmtNum(s.instances) + ' inst├óncias de exce├º├úo em ' + fmtNum(s.vehicleCount) + ' ve├¡culos' + (coverage !== '-' ? ' (' + coverage + ' da frota ativa)' : '') + '.');
    if (top) parts.push('A regra com maior volume foi "' + top.name + '", com ' + fmtNum(top.instances) + ' inst├óncias.');
    if (s.buckets[2]) parts.push('H├í ' + fmtNum(s.buckets[2]) + ' evento(s) com dura├º├úo igual ou superior a 30 segundos, que devem ser priorizados na an├ílise operacional.');
    if (filters.length) parts.push('Este relat├│rio considera somente os filtros aplicados: ' + filters.join(' ÔÇó ') + '.');
    return parts.join(' ');
  }

  function buildHtml(s, filters, generatedAt) {
    const top = s.rules[0];
    const coverage = s.coverage;
    const ringColor = coverage >= 50 ? '#ef4444' : coverage >= 25 ? '#f97316' : '#10b981';
    const ringGrad = 'conic-gradient(' + ringColor + ' 0% ' + (coverage * 3.6) + 'deg, rgba(255,255,255,0.12) ' + (coverage * 3.6) + 'deg 360deg)';
    const maxRule = Math.max(1, ...s.rules.map(r => r.instances));
    const filterText = filters.length ? filters.join(' ÔÇó ') : 'Sem filtros adicionais';
    const maxBucket = Math.max(1, ...s.buckets);
    const exec = readExecutive(s, filters);
    const topVehicles = s.vehicles.slice(0, 5);
    const topRules = s.rules.slice(0, 8);

    const p1 = `
<div class="pdf-page pdf-cover-page">
  <div class="pcp-dots"></div>
  <div class="pcp-header">
    <img class="pcp-logo" src="${LOGO}" alt="Maas">
  </div>
  <div class="pcp-hero">
    <div class="pcp-title-block">
      <div class="pcp-bar"></div>
      <div>
        <h1 class="pcp-title">Fleet<br>Exception 360</h1>
        <p class="pcp-tagline">Relat├│rio de exce├º├Áes de telemetria</p>
      </div>
    </div>
  </div>
  <div class="pcp-chips">
    <div class="pcp-chip"><div><div class="pcp-chip-label">Per├¡odo</div><div class="pcp-chip-val">${esc(selectedText('periodFilter') || 'Hoje (24h)')}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Ve├¡culos ativos</div><div class="pcp-chip-val">${fmtNum(s.activeCount)}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Eventos</div><div class="pcp-chip-val">${fmtNum(s.events)}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Inst├óncias</div><div class="pcp-chip-val">${fmtNum(s.instances)}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Gerado em</div><div class="pcp-chip-val">${generatedAt}</div></div></div>
  </div>
  <div class="pcp-exec-card">
    <div class="pcp-exec-text">
      <div class="pcp-exec-header"><span class="pcp-shield">360</span> Resumo Executivo</div>
      <div class="pcp-exec-rule"></div>
      <p>${esc(exec)}</p>
      <p>${esc(filterText)}.</p>
      <div class="pcp-kpi-row">
        <div class="pcp-kpi-item"><b>${fmtNum(s.vehicleCount)}</b><small>Ve├¡culos com<br>exce├º├úo</small></div>
        <div class="pcp-kpi-item warn"><b>${fmtNum(s.instances)}</b><small>Inst├óncias<br>no filtro</small></div>
        <div class="pcp-kpi-item red"><b>${fmtNum(s.rulesCount)}</b><small>Regras<br>acionadas</small></div>
        <div class="pcp-kpi-item green"><b>${coverage}%</b><small>Cobertura<br>da frota</small></div>
      </div>
    </div>
    <div class="pcp-index-wrap">
      <div class="pcp-ring-outer" style="background:${ringGrad}">
        <div class="pcp-ring-inner">
          <b style="color:${ringColor}">${coverage}%</b>
          <span>da frota</span>
          <div class="pcp-pulse">360</div>
        </div>
      </div>
    </div>
  </div>
  <div class="pdf-footer"><span>Fleet Exception 360 ÔÇó Maas</span><span class="page-number"></span></div>
</div>`;

    const p2 = `
<div class="pdf-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Resumo executivo</h1><div class="pdf-subtitle">KPIs, regras e leitura operacional</div></div>
    <img class="pdf-logo" src="${LOGO}" alt="Maas">
  </div>
  <div class="pdf-grid-4">
    <div class="pdf-kpi"><small>Eventos</small><b style="color:#ef4444">${fmtNum(s.events)}</b><span>no per├¡odo</span></div>
    <div class="pdf-kpi"><small>Inst├óncias</small><b style="color:#f97316">${fmtNum(s.instances)}</b><span>soma das exce├º├Áes</span></div>
    <div class="pdf-kpi"><small>Ve├¡culos com exce├º├úo</small><b>${fmtNum(s.vehicleCount)}</b><span>${s.activeCount ? coverage + '% da frota ativa' : 'base filtrada'}</span></div>
    <div class="pdf-kpi"><small>Regras acionadas</small><b style="color:#0ea5e9">${fmtNum(s.rulesCount)}</b><span>distintas no filtro</span></div>
  </div>
  <div class="pdf-section">
    <div class="pdf-two-col">
      <div class="pdf-card">
        <div class="pdf-section-title">Top regras por inst├óncias</div>
        <div class="pdf-bars">${topRules.map(r => `<div class="row"><div>${esc(r.name)}</div><div class="track"><div class="fill" style="width:${Math.round(r.instances / maxRule * 100)}%;background:#ef4444"></div></div><div>${fmtNum(r.instances)}</div></div>`).join('') || '<div class="pdf-summary-box">Sem regras no filtro.</div>'}</div>
        <div class="pdf-section-title" style="margin-top:16px">Distribui├º├úo por dura├º├úo</div>
        <div class="pdf-bars">
          <div class="row"><div>At├® 10s</div><div class="track"><div class="fill" style="width:${Math.round(s.buckets[0] / maxBucket * 100)}%;background:#10b981"></div></div><div>${fmtNum(s.buckets[0])}</div></div>
          <div class="row"><div>10s a 30s</div><div class="track"><div class="fill" style="width:${Math.round(s.buckets[1] / maxBucket * 100)}%;background:#f59e0b"></div></div><div>${fmtNum(s.buckets[1])}</div></div>
          <div class="row"><div>30s ou mais</div><div class="track"><div class="fill" style="width:${Math.round(s.buckets[2] / maxBucket * 100)}%;background:#ef4444"></div></div><div>${fmtNum(s.buckets[2])}</div></div>
        </div>
      </div>
      <div class="pdf-card">
        <div class="pdf-section-title">Leitura executiva</div>
        <div class="pdf-summary-box"><b>Filtros aplicados:</b> ${esc(filterText)}</div>
        <div class="pdf-summary-box"><b>Condi├º├úo atual:</b> ${esc(exec)}</div>
        <div class="pdf-summary-box"><b>Prioridade:</b> atuar primeiro nas regras de maior volume e nos ve├¡culos com mais inst├óncias. Validar reincid├¬ncia, configura├º├úo da regra e causa operacional antes de tratar como falha do device.</div>
        <div class="pdf-summary-box"><b>Leitura das inst├óncias:</b> a soma representa o campo de contagem retornado pelas ExceptionEvent, n├úo a quantidade de linhas brutas do relat├│rio.</div>
      </div>
    </div>
  </div>
  <div class="pdf-footer"><span>Fleet Exception 360 ÔÇó Resumo executivo</span><span class="page-number"></span></div>
</div>`;

    const p3 = `
<div class="pdf-page pdf-ranking-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Ranking por inst├óncias</h1><div class="pdf-subtitle">Ve├¡culos com exce├º├Áes dentro do filtro aplicado</div></div>
    <img class="pdf-logo" src="${LOGO}" alt="Maas">
  </div>
  <table class="pdf-table">
    <thead><tr>
      <th style="width:24px">#</th>
      <th style="width:58px">Inst├óncias</th>
      <th style="width:40px">Eventos</th>
      <th style="width:72px">Placa</th>
      <th>Ve├¡culo</th>
      <th style="width:38px">Regras</th>
      <th style="width:52px">├Ültimo</th>
      <th style="width:58px">Status</th>
    </tr></thead>
    <tbody>${s.vehicles.map((v, i) => {
      const st = statusFor(v.instances);
      return `<tr class="${v.instances >= 1000 ? 'pdf-row-risk' : ''}">
        <td>${i + 1}</td>
        <td style="font-weight:900;color:#b91c1c">${fmtNum(v.instances)}</td>
        <td>${fmtNum(v.events)}</td>
        <td style="font-weight:800;font-family:monospace;font-size:9px">${esc(v.placa || '-')}</td>
        <td style="font-size:9px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.veiculo || '-')}</td>
        <td>${Object.keys(v.rules).length}</td>
        <td style="font-size:9px">${fmtDate(v.last)}</td>
        <td><span class="pdf-badge ${st.cls}">${st.label}</span></td>
      </tr>`;
    }).join('') || '<tr><td colspan="8">Nenhum evento encontrado.</td></tr>'}</tbody>
  </table>
  <div class="pdf-footer" style="left:54px;right:54px">
    <div class="pdf-legend">
      <span class="pdf-legend-item"><i class="risk"></i> Inst├óncias cr├¡ticas (1.000+)</span>
      <span>Fleet Exception 360 ÔÇó Ranking</span>
    </div>
    <span class="page-number"></span>
  </div>
</div>`;

    const p4 = `
<div class="pdf-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Plano de a├º├úo recomendado</h1><div class="pdf-subtitle">Prioridades de atua├º├úo operacional</div></div>
    <img class="pdf-logo" src="${LOGO}" alt="Maas">
  </div>
  <div class="pdf-action"><h4>Prioridade 1 ÔÇö regra de maior volume</h4><p>${top ? 'A regra "' + esc(top.name) + '" concentra ' + fmtNum(top.instances) + ' inst├óncias no filtro. Revisar a configura├º├úo da regra, o contexto operacional e a causa raiz antes de classificar como falha do ve├¡culo ou do dispositivo.' : 'N├úo h├í regra acionada no filtro atual.'}</p></div>
  <div class="pdf-action"><h4>Prioridade 2 ÔÇö ve├¡culos reincidentes</h4><p>${topVehicles.length ? 'Come├ºar pelos ve├¡culos ' + topVehicles.map(v => esc(v.placa || v.veiculo)).join(', ') + '. Validar turno, rota, operador e hist├│rico de eventos para separar comportamento operacional de problema t├®cnico.' : 'Nenhum ve├¡culo com evento no filtro.'}</p></div>
  <div class="pdf-action"><h4>Prioridade 3 ÔÇö eventos de longa dura├º├úo</h4><p>${fmtNum(s.buckets[2])} evento(s) com dura├º├úo igual ou superior a 30 segundos. Priorizar a investiga├º├úo desses casos, pois tendem a representar maior impacto operacional.</p></div>
  <div class="pdf-action"><h4>Prioridade 4 ÔÇö cobertura e valida├º├úo do filtro</h4><p>${s.activeCount ? fmtNum(s.vehicleCount) + ' ve├¡culo(s) com exce├º├úo representam ' + coverage + '% da frota ativa considerada.' : 'A base ativa n├úo foi identificada nesta execu├º├úo.'} Conferir o per├¡odo e os filtros antes de comparar bases ou per├¡odos diferentes.</p></div>
  <div class="pdf-section">
    <div class="pdf-section-title">S├¡ntese</div>
    <div class="pdf-summary-box">Exce├º├úo s├│ vira a├º├úo quando a regra, o ve├¡culo e o contexto operacional s├úo analisados juntos. Use este relat├│rio como prioriza├º├úo, n├úo como conclus├úo isolada.</div>
  </div>
  <div class="pdf-footer"><span>Fleet Exception 360 ÔÇó Plano de A├º├úo</span><span class="page-number"></span></div>
</div>`;

    return p1 + p2 + p3 + p4;
  }

  async function download(ctx) {
    const filtered = ctx && Array.isArray(ctx.filtered) ? ctx.filtered : [];
    const stage = document.getElementById('pdfStage');
    const alertBox = document.getElementById('alertBox');
    const statusBox = document.getElementById('statusBox');
    const btn = document.getElementById('pdfBtn');

    if (!filtered.length) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.className = 'alert err';
        alertBox.textContent = 'Carregue os dados antes de baixar o PDF.';
      }
      return;
    }
    if (!stage) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.className = 'alert err';
        alertBox.textContent = '├ürea de impress├úo ausente. Atualize a p├ígina.';
      }
      return;
    }

    window.__exception360Vehicles = Array.isArray(ctx.vehicles) ? ctx.vehicles : [];
    const filters = filterList(ctx.problemFilter, ctx.rulesLabel);
    const s = summarize(filtered);
    const generatedAt = new Date().toLocaleString('pt-BR');

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Preparando PDF...';
    }
    if (statusBox) statusBox.textContent = 'Preparando PDF...';
    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.className = 'alert ok';
      alertBox.textContent = 'O relat├│rio ser├í aberto na tela de impress├úo. Escolha "Salvar como PDF".';
    }

    stage.innerHTML = buildHtml(s, filters, generatedAt);
    const totalPages = stage.querySelectorAll('.pdf-page').length;
    stage.style.setProperty('--total-pages', '"' + totalPages + '"');

    const imgs = Array.from(stage.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    })));
    await new Promise(resolve => setTimeout(resolve, 150));

    window.print();

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Baixar PDF';
    }
    if (statusBox) statusBox.textContent = fmtNum(filtered.length) + ' eventos';
  }

  window.Exception360Pdf = { download };
})();
