(function () {
  'use strict';

  // A imagem da organização só é carregada após conectar à conta Geotab.

  const esc = v => String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const fmtNum = n => Number(n || 0).toLocaleString('pt-BR');
  const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
  const inst = e => {
    const raw = e && e.exceptionCount;
    if (raw == null || raw === '') return 1;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 1;
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
      ExceptionEventStateValidId: 'Válido',
      ExceptionEventStateInvalidId: 'Inválido',
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
    if (period) parts.push('Período: ' + period);
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
    if (instances >= 1000) return { label: 'Crítico', cls: 'pdf-risk' };
    if (instances >= 300) return { label: 'Atenção', cls: 'pdf-warn' };
    return { label: 'Normal', cls: 'pdf-ok' };
  }

  function readExecutive(s, filters) {
    const top = s.rules[0];
    const coverage = s.activeCount ? s.coverage + '%' : '-';
    const parts = [];
    parts.push('Foram registrados ' + fmtNum(s.events) + ' eventos no período, somando ' + fmtNum(s.instances) + ' instâncias de exceção em ' + fmtNum(s.vehicleCount) + ' veículos' + (coverage !== '-' ? ' (' + coverage + ' da frota ativa)' : '') + '.');
    if (top) parts.push('A regra com maior volume foi "' + top.name + '", com ' + fmtNum(top.instances) + ' instâncias.');
    if (s.buckets[2]) parts.push('Há ' + fmtNum(s.buckets[2]) + ' evento(s) com duração igual ou superior a 30 segundos, que devem ser priorizados na análise operacional.');
    if (filters.length) parts.push('Este relatório considera somente os filtros aplicados: ' + filters.join(' • ') + '.');
    return parts.join(' ');
  }

  function buildHtml(s, filters, generatedAt) {
    const top = s.rules[0];
    const coverage = s.coverage;
    const ringColor = coverage >= 50 ? '#ef4444' : coverage >= 25 ? '#f97316' : '#10b981';
    const ringGrad = 'conic-gradient(' + ringColor + ' 0% ' + (coverage * 3.6) + 'deg, rgba(255,255,255,0.12) ' + (coverage * 3.6) + 'deg 360deg)';
    const maxRule = Math.max(1, ...s.rules.map(r => r.instances));
    const filterText = filters.length ? filters.join(' • ') : 'Sem filtros adicionais';
    const maxBucket = Math.max(1, ...s.buckets);
    const exec = readExecutive(s, filters);
    const topVehicles = s.vehicles.slice(0, 5);
    const topRules = s.rules.slice(0, 8);

    const p1 = `
<div class="pdf-page pdf-cover-page">
  <div class="pcp-dots"></div>
  <div class="pcp-header">
    ${window.FleetBranding ? window.FleetBranding.logoHtml('pcp-logo') : ''}
  </div>
  <div class="pcp-hero">
    <div class="pcp-title-block">
      <div class="pcp-bar"></div>
      <div>
        <h1 class="pcp-title">Fleet<br>Exception 360</h1>
        <p class="pcp-tagline">Relatório de exceções de telemetria</p>
      </div>
    </div>
  </div>
  <div class="pcp-chips">
    <div class="pcp-chip"><div><div class="pcp-chip-label">Período</div><div class="pcp-chip-val">${esc(selectedText('periodFilter') || 'Hoje (24h)')}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Veículos ativos</div><div class="pcp-chip-val">${fmtNum(s.activeCount)}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Eventos</div><div class="pcp-chip-val">${fmtNum(s.events)}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Instâncias</div><div class="pcp-chip-val">${fmtNum(s.instances)}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Gerado em</div><div class="pcp-chip-val">${generatedAt}</div></div></div>
  </div>
  <div class="pcp-exec-card">
    <div class="pcp-exec-text">
      <div class="pcp-exec-header"><span class="pcp-shield">360</span> Resumo Executivo</div>
      <div class="pcp-exec-rule"></div>
      <p>${esc(exec)}</p>
      <p>${esc(filterText)}.</p>
      <div class="pcp-kpi-row">
        <div class="pcp-kpi-item"><b>${fmtNum(s.vehicleCount)}</b><small>Veículos com<br>exceção</small></div>
        <div class="pcp-kpi-item warn"><b>${fmtNum(s.instances)}</b><small>Instâncias<br>no filtro</small></div>
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
  <div class="pdf-footer"><span>Fleet Exception 360 • Base Geotab</span><span class="page-number"></span></div>
</div>`;

    const p2 = `
<div class="pdf-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Resumo executivo</h1><div class="pdf-subtitle">KPIs, regras e leitura operacional</div></div>
    ${window.FleetBranding ? window.FleetBranding.logoHtml('pdf-logo') : ''}
  </div>
  <div class="pdf-grid-4">
    <div class="pdf-kpi"><small>Eventos</small><b style="color:#ef4444">${fmtNum(s.events)}</b><span>no período</span></div>
    <div class="pdf-kpi"><small>Instâncias</small><b style="color:#f97316">${fmtNum(s.instances)}</b><span>soma das exceções</span></div>
    <div class="pdf-kpi"><small>Veículos com exceção</small><b>${fmtNum(s.vehicleCount)}</b><span>${s.activeCount ? coverage + '% da frota ativa' : 'base filtrada'}</span></div>
    <div class="pdf-kpi"><small>Regras acionadas</small><b style="color:#0ea5e9">${fmtNum(s.rulesCount)}</b><span>distintas no filtro</span></div>
  </div>
  <div class="pdf-section">
    <div class="pdf-two-col">
      <div class="pdf-card">
        <div class="pdf-section-title">Top regras por instâncias</div>
        <div class="pdf-bars">${topRules.map(r => `<div class="row"><div>${esc(r.name)}</div><div class="track"><div class="fill" style="width:${Math.round(r.instances / maxRule * 100)}%;background:#ef4444"></div></div><div>${fmtNum(r.instances)}</div></div>`).join('') || '<div class="pdf-summary-box">Sem regras no filtro.</div>'}</div>
        <div class="pdf-section-title" style="margin-top:16px">Distribuição por duração</div>
        <div class="pdf-bars">
          <div class="row"><div>Até 10s</div><div class="track"><div class="fill" style="width:${Math.round(s.buckets[0] / maxBucket * 100)}%;background:#10b981"></div></div><div>${fmtNum(s.buckets[0])}</div></div>
          <div class="row"><div>10s a 30s</div><div class="track"><div class="fill" style="width:${Math.round(s.buckets[1] / maxBucket * 100)}%;background:#f59e0b"></div></div><div>${fmtNum(s.buckets[1])}</div></div>
          <div class="row"><div>30s ou mais</div><div class="track"><div class="fill" style="width:${Math.round(s.buckets[2] / maxBucket * 100)}%;background:#ef4444"></div></div><div>${fmtNum(s.buckets[2])}</div></div>
        </div>
      </div>
      <div class="pdf-card">
        <div class="pdf-section-title">Leitura executiva</div>
        <div class="pdf-summary-box"><b>Filtros aplicados:</b> ${esc(filterText)}</div>
        <div class="pdf-summary-box"><b>Condição atual:</b> ${esc(exec)}</div>
        <div class="pdf-summary-box"><b>Prioridade:</b> atuar primeiro nas regras de maior volume e nos veículos com mais instâncias. Validar reincidência, configuração da regra e causa operacional antes de tratar como falha do device.</div>
        <div class="pdf-summary-box"><b>Leitura das instâncias:</b> a soma representa o campo de contagem retornado pelas ExceptionEvent, não a quantidade de linhas brutas do relatório.</div>
      </div>
    </div>
  </div>
  <div class="pdf-footer"><span>Fleet Exception 360 • Resumo executivo</span><span class="page-number"></span></div>
</div>`;

    const p3 = `
<div class="pdf-page pdf-ranking-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Ranking por instâncias</h1><div class="pdf-subtitle">Veículos com exceções dentro do filtro aplicado</div></div>
    ${window.FleetBranding ? window.FleetBranding.logoHtml('pdf-logo') : ''}
  </div>
  <table class="pdf-table">
    <thead><tr>
      <th style="width:24px">#</th>
      <th style="width:58px">Instâncias</th>
      <th style="width:40px">Eventos</th>
      <th style="width:72px">Placa</th>
      <th>Veículo</th>
      <th style="width:38px">Regras</th>
      <th style="width:52px">Último</th>
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
      <span class="pdf-legend-item"><i class="risk"></i> Instâncias críticas (1.000+)</span>
      <span>Fleet Exception 360 • Ranking</span>
    </div>
    <span class="page-number"></span>
  </div>
</div>`;

    const p4 = `
<div class="pdf-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Plano de ação recomendado</h1><div class="pdf-subtitle">Prioridades de atuação operacional</div></div>
    ${window.FleetBranding ? window.FleetBranding.logoHtml('pdf-logo') : ''}
  </div>
  <div class="pdf-action"><h4>Prioridade 1 — regra de maior volume</h4><p>${top ? 'A regra "' + esc(top.name) + '" concentra ' + fmtNum(top.instances) + ' instâncias no filtro. Revisar a configuração da regra, o contexto operacional e a causa raiz antes de classificar como falha do veículo ou do dispositivo.' : 'Não há regra acionada no filtro atual.'}</p></div>
  <div class="pdf-action"><h4>Prioridade 2 — veículos reincidentes</h4><p>${topVehicles.length ? 'Começar pelos veículos ' + topVehicles.map(v => esc(v.placa || v.veiculo)).join(', ') + '. Validar turno, rota, operador e histórico de eventos para separar comportamento operacional de problema técnico.' : 'Nenhum veículo com evento no filtro.'}</p></div>
  <div class="pdf-action"><h4>Prioridade 3 — eventos de longa duração</h4><p>${fmtNum(s.buckets[2])} evento(s) com duração igual ou superior a 30 segundos. Priorizar a investigação desses casos, pois tendem a representar maior impacto operacional.</p></div>
  <div class="pdf-action"><h4>Prioridade 4 — cobertura e validação do filtro</h4><p>${s.activeCount ? fmtNum(s.vehicleCount) + ' veículo(s) com exceção representam ' + coverage + '% da frota ativa considerada.' : 'A base ativa não foi identificada nesta execução.'} Conferir o período e os filtros antes de comparar bases ou períodos diferentes.</p></div>
  <div class="pdf-section">
    <div class="pdf-section-title">Síntese</div>
    <div class="pdf-summary-box">Exceção só vira ação quando a regra, o veículo e o contexto operacional são analisados juntos. Use este relatório como priorização, não como conclusão isolada.</div>
  </div>
  <div class="pdf-footer"><span>Fleet Exception 360 • Plano de Ação</span><span class="page-number"></span></div>
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
        alertBox.textContent = 'Área de impressão ausente. Atualize a página.';
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
      alertBox.textContent = 'O relatório será aberto na tela de impressão. Escolha "Salvar como PDF".';
    }

    stage.innerHTML = buildHtml(s, filters, generatedAt);
    const totalPages = stage.querySelectorAll('.pdf-page').length;
    stage.style.setProperty('--total-pages', '"' + totalPages + '"');

    // QR institucional: abre o site oficial da organização, não um hash de validação.
    const siteUrl = window.FleetBranding ? window.FleetBranding.siteUrl() : '';
    const footer = stage.querySelector('.pdf-page:last-child .pdf-footer');
    if (footer && siteUrl) {
      const wrap = document.createElement('div');
      wrap.className = 'pdf-brand-qr';
      wrap.style.cssText = 'position:absolute;right:54px;bottom:54px;text-align:center;font-size:9px;color:#475569';
      const label = document.createElement('div');
      label.textContent = 'ACESSAR SITE';
      label.style.cssText = 'margin-bottom:5px;font-weight:800;letter-spacing:.07em';
      const link = document.createElement('a');
      link.href = siteUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;color:#176644;text-decoration:none';
      const qr = document.createElement('img');
      qr.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=png&data=' + encodeURIComponent(siteUrl);
      qr.style.cssText = 'width:90px;height:90px;object-fit:contain';
      qr.alt = 'QR Code para acessar o site configurado';
      const caption = document.createElement('span');
      caption.textContent = new URL(siteUrl).hostname;
      caption.style.cssText = 'font-size:8px;font-weight:600';
      link.append(qr, caption);
      wrap.append(label, link);
      footer.parentElement.appendChild(wrap);
    }
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) { /* fallback para Arial */ }
    }

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
