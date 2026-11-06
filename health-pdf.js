(function () {
  'use strict';

  const LOGO = './assets/maas-logo-transparent.png';

  const esc = v => String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const fmtNum = n => Number(n || 0).toLocaleString('pt-BR');
  const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
  const scColor = s => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : '#ef4444';
  const scLabel = s => s >= 80 ? 'Saudável' : s >= 60 ? 'Atenção' : s >= 40 ? 'Crítico' : 'Risco alto';
  const pdfBadge = s => s >= 80 ? 'pdf-ok' : s >= 60 ? 'pdf-warn' : s >= 40 ? 'pdf-critical' : 'pdf-risk';

  function problem(v) {
    if (!v) return '-';
    if (v.unplugged > 0) return 'Possível remoção não autorizada';
    if (v.offline) return v.dias >= 30 ? 'Offline 30d+ (sem dados na base)' : 'Sem comunicação ' + v.dias + ' dias';
    if (v.vlow > 0) return 'Tensão baixa';
    if (v.vhigh > 0) return 'Tensão alta';
    if (v.reboots > 2) return 'Reboot excessivo';
    if (v.gps > 0) return 'Falha GPS';
    if (v.faults > 0) return 'Falha device';
    return 'Sem alerta crítico';
  }

  function executive(avg) {
    if (avg >= 80) return 'A frota apresenta um cenário saudável, com baixa incidência de falhas críticas e boa estabilidade operacional.';
    if (avg >= 60) return 'A frota está em atenção. Existem indícios claros de degradação operacional que exigem ação preventiva.';
    return 'A frota está em estado crítico. É necessário atuar imediatamente nos veículos com maior risco operacional.';
  }

  function summary(list) {
    const total = list.length || 1;
    const avg = Math.round(list.reduce((s, v) => s + v.score, 0) / total);
    return {
      total: list.length,
      avg,
      healthy: list.filter(v => v.score >= 80).length,
      attention: list.filter(v => v.score >= 60 && v.score < 80).length,
      critical: list.filter(v => v.score < 60 && v.score >= 40).length,
      risk: list.filter(v => v.score < 40).length,
      nodata: list.filter(v => v.dias >= 7).length,
      offline: list.filter(v => v.offline).length,
      offline30: list.filter(v => v.offline30).length,
      unplugged: list.filter(v => v.unplugged > 0).length,
      voltage: list.filter(v => v.vlow + v.vhigh > 0).length,
      gps: list.filter(v => v.gps > 0).length,
      reboot: list.filter(v => v.reboots > 2).length
    };
  }

  function topProblems(list) {
    const s = summary(list);
    return [
      { label: 'Offline (sem comunicação)', value: s.offline, color: '#dc2626' },
      { label: 'Offline 30d+ (total)', value: s.offline30, color: '#7f1d1d' },
      { label: 'Sem dados 7d+', value: s.nodata, color: '#ef4444' },
      { label: 'Tensão fora', value: s.voltage, color: '#f97316' },
      { label: 'Falha GPS', value: s.gps, color: '#f59e0b' },
      { label: 'Reboot excessivo', value: s.reboot, color: '#0ea5e9' },
      { label: 'Desconexão', value: s.unplugged, color: '#dc2626' }
    ];
  }

  function selectedText(id) {
    const el = document.getElementById(id);
    if (!el || !el.options || el.selectedIndex < 0) return '';
    return el.options[el.selectedIndex].textContent || '';
  }

  const PROBLEM_LABELS = {
    unplugged: 'Possível remoção não autorizada',
    voltage: 'Tensão fora do padrão',
    vlow: 'Tensão baixa',
    vhigh: 'Tensão alta',
    reboot: 'Reboot excessivo',
    gps: 'Falha GPS',
    nodata: 'Sem comunicação 7d+',
    offline: 'Sem comunicação (offline)',
    offline30: 'Offline 30d+ (total)',
    device: 'Falha crítica do device'
  };

  function fullFilterText(problemFilter) {
    const parts = [];
    const group = selectedText('groupFilter');
    const score = selectedText('scoreFilter');
    const query = document.getElementById('queryFilter');
    if (group && group !== 'Todos os grupos') parts.push('Grupo: ' + group);
    if (score && score !== 'Todos os status') parts.push('Status: ' + score);
    if (query && query.value.trim()) parts.push('Busca: ' + query.value.trim());
    if (problemFilter) parts.push('Problema: ' + (PROBLEM_LABELS[problemFilter] || problemFilter));
    return parts.length ? parts.join(' • ') : 'Todos os veículos da base analisada';
  }

  function buildHtml(ctx) {
    const list = ctx.filtered || [];
    const s = summary(list);
    const probs = topProblems(list);
    const max = Math.max(1, ...probs.map(p => p.value));
    const top = [...list].sort((a, b) => a.score - b.score);
    const filterText = fullFilterText(ctx.problemFilter);
    const generatedAt = new Date().toLocaleString('pt-BR');
    const dbName = (ctx.api && ctx.api.credentials && ctx.api.credentials.database) || 'Maas';
    const scoreColor = scColor(s.avg);
    const ringGrad = 'conic-gradient(' + scoreColor + ' 0% ' + (s.avg * 3.6) + 'deg, rgba(255,255,255,0.12) ' + (s.avg * 3.6) + 'deg 360deg)';

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
        <h1 class="pcp-title">Fleet<br>Health Score</h1>
        <p class="pcp-tagline">Relatório premium de saúde técnica da frota</p>
      </div>
    </div>
  </div>
  <div class="pcp-chips">
    <div class="pcp-chip"><div><div class="pcp-chip-label">Banco/Base</div><div class="pcp-chip-val">${esc(dbName)}</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Base ativa</div><div class="pcp-chip-val">7 dias (+30d offline)</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Score</div><div class="pcp-chip-val">últimos 7 dias</div></div></div>
    <div class="pcp-chip"><div><div class="pcp-chip-label">Gerado em</div><div class="pcp-chip-val">${generatedAt}</div></div></div>
  </div>
  <div class="pcp-exec-card">
    <div class="pcp-exec-text">
      <div class="pcp-exec-header">Resumo executivo</div>
      <div class="pcp-exec-rule"></div>
      <p>Este relatório apresenta uma visão consolidada da saúde técnica da frota com base nas análises mais recentes dos veículos monitorados.</p>
      <p>As possíveis remoções são identificadas por eventos de desconexão ou unplugged.</p>
      <p>${esc(filterText)}.</p>
      <div class="pcp-kpi-row">
        <div class="pcp-kpi-item"><b>${fmtNum(s.total)}</b><small>Veículos<br>monitorados</small></div>
        <div class="pcp-kpi-item warn"><b>${fmtNum(s.critical + s.risk)}</b><small>Veículos com<br>alertas</small></div>
        <div class="pcp-kpi-item red"><b>${fmtNum(s.nodata)}</b><small>Sem dados<br>7d+</small></div>
        <div class="pcp-kpi-item green"><b>${pct(s.healthy, s.total)}%</b><small>Disponib.<br>operacional</small></div>
      </div>
    </div>
    <div class="pcp-index-wrap">
      <div class="pcp-ring-outer" style="background:${ringGrad}">
        <div class="pcp-ring-inner">
          <b style="color:${scoreColor}">${s.avg}</b>
          <span>Health Index</span>
        </div>
      </div>
    </div>
  </div>
  <div class="pdf-footer"><span>Fleet Health Score • ${esc(dbName)}</span><span class="page-number"></span></div>
</div>`;

    const p2 = `
<div class="pdf-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Resumo executivo</h1><div class="pdf-subtitle">KPIs e leitura estratégica da frota</div></div>
    <img class="pdf-logo" src="${LOGO}" alt="Maas">
  </div>
  <div class="pdf-grid-4">
    <div class="pdf-kpi"><small>Fleet Health Index</small><b style="color:${scoreColor}">${s.avg}</b><span>de 100</span></div>
    <div class="pdf-kpi"><small>Veículos analisados</small><b>${fmtNum(s.total)}</b><span>base filtrada</span></div>
    <div class="pdf-kpi"><small>Críticos + risco</small><b style="color:#ef4444">${fmtNum(s.critical + s.risk)}</b><span>${pct(s.critical + s.risk, s.total)}% da frota</span></div>
    <div class="pdf-kpi"><small>Possível remoção</small><b style="color:#f97316">${fmtNum(s.unplugged)}</b><span>com data do evento</span></div>
  </div>
  <div class="pdf-section">
    <div class="pdf-two-col">
      <div class="pdf-card">
        <div class="pdf-section-title">Top problemas</div>
        <div class="pdf-bars">${probs.map(p => `<div class="row"><div>${p.label}</div><div class="track"><div class="fill" style="width:${Math.round(p.value / max * 100)}%;background:${p.color}"></div></div><div>${p.value}</div></div>`).join('')}</div>
      </div>
      <div class="pdf-card">
        <div class="pdf-section-title">Leitura executiva</div>
        <div class="pdf-summary-box"><b>Banco/Base:</b> ${esc(dbName)}</div>
        <div class="pdf-summary-box"><b>Condição atual:</b> ${esc(executive(s.avg))}</div>
        <div class="pdf-summary-box"><b>Prioridade:</b> atuar primeiro em score abaixo de 60, sem dados 7d+, tensão fora e eventos de desconexão.</div>
        <div class="pdf-summary-box"><b>Possíveis remoções:</b> ${fmtNum(s.unplugged)} veículo(s) com data do evento no ranking e no CSV.</div>
        <div class="pdf-summary-box"><b>Filtros aplicados:</b> ${esc(filterText)}</div>
        <div class="pdf-summary-box"><b>Faixa saudável:</b> 80–100 • <b>Atenção:</b> 60–79 • <b>Crítico:</b> 40–59 • <b>Risco alto:</b> abaixo de 40</div>
      </div>
    </div>
  </div>
  <div class="pdf-footer"><span>Fleet Health Score • ${esc(dbName)}</span><span class="page-number"></span></div>
</div>`;

    const p3 = `
<div class="pdf-page pdf-ranking-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Ranking técnico da frota</h1><div class="pdf-subtitle">Veículos mais críticos e suas causas principais</div></div>
    <img class="pdf-logo" src="${LOGO}" alt="Maas">
  </div>
  <table class="pdf-table">
    <thead><tr>
      <th style="width:24px">#</th>
      <th style="width:42px">Score</th>
      <th style="width:78px">Placa</th>
      <th>Veículo</th>
      <th style="width:46px">Último</th>
      <th>Problema principal</th>
      <th style="width:92px">Datas remoção</th>
      <th style="width:60px">Status</th>
    </tr></thead>
    <tbody>${top.map((v, i) => `<tr class="${v.score < 40 ? 'pdf-row-risk' : ''}">
      <td>${i + 1}</td>
      <td style="font-weight:900;color:${scColor(v.score)}">${v.score}</td>
      <td style="font-weight:800;font-family:monospace;font-size:9px">${esc(v.placa || '-')}</td>
      <td style="font-size:9px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.nome || '-')}</td>
      <td style="font-size:9px">${v.dias >= 7 ? '7d+' : v.dias + 'd'}</td>
      <td style="font-size:9px">${esc(problem(v))}</td>
      <td style="font-size:8px;color:#64748b">${esc(v.removalDatesText || '-')}</td>
      <td><span class="pdf-badge ${pdfBadge(v.score)}">${scLabel(v.score)}</span></td>
    </tr>`).join('') || '<tr><td colspan="8">Nenhum veículo encontrado.</td></tr>'}</tbody>
  </table>
  <div class="pdf-footer" style="left:54px;right:54px">
    <div class="pdf-legend">
      <span class="pdf-legend-item"><i class="risk"></i> Score crítico (&lt; 40)</span>
      <span>Fleet Health Score • Ranking Técnico</span>
    </div>
    <span class="page-number"></span>
  </div>
</div>`;

    const p4 = `
<div class="pdf-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Plano de ação recomendado</h1><div class="pdf-subtitle">Prioridades de atuação operacional</div></div>
    <img class="pdf-logo" src="${LOGO}" alt="Maas">
  </div>
  <div class="pdf-action"><h4>Prioridade 1 — possíveis remoções e desconexões</h4><p>Validar imediatamente energia, chicote, violação física, alimentação e histórico do dispositivo na data indicada. Pedir para verificar se o lacre ainda se encontra entre o dispositivo e o chicote, e entre o chicote e a tomada OBD 2.</p></div>
  <div class="pdf-action"><h4>Prioridade 2 — offline e sem comunicação</h4><p>Veículos sem comunicação há 7 dias ou mais estão fora da operação de dados. Veículos sem status há 30 dias ou mais estão fora da base ativa. Verificar se o veículo teve atividade depois da data da última comunicação. Se sim, agendar o quanto antes uma verificação física do dispositivo.</p></div>
  <div class="pdf-action"><h4>Prioridade 3 — tensão baixa ou alta recorrente</h4><p>Revisar bateria, alternador, aterramento e qualidade da instalação elétrica.</p></div>
  <div class="pdf-action"><h4>Prioridade 4 — reboots e falhas de GPS reincidentes</h4><p>Abrir análise técnica focando em firmware, posição e estabilidade da alimentação. Contatar o suporte e pedir uma análise, pois não é normal esse volume de reboots, a não ser que seja um caminhão que precise desligar a chave geral. Se for o caso, desconsiderar essa ação.</p></div>
  <div class="pdf-section">
    <div class="pdf-section-title">Síntese</div>
    <div class="pdf-summary-box">Telemetria só gera confiança quando cada dado vira decisão no veículo e na operação.</div>
  </div>
  <div class="pdf-footer"><span>Fleet Health Score • Plano de Ação</span><span class="page-number"></span></div>
</div>`;

    return p1 + p2 + p3 + p4;
  }

  async function download(ctx) {
    const list = ctx && Array.isArray(ctx.filtered) ? ctx.filtered : [];
    const stage = document.getElementById('pdfStage');
    const alertBox = document.getElementById('alertBox');
    const statusBox = document.getElementById('statusBox');
    const btn = document.getElementById('pdfBtn');

    if (!list.length) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.className = 'alert err';
        alertBox.textContent = 'Carregue a análise antes de baixar o PDF.';
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

    stage.innerHTML = buildHtml(ctx);
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
    if (statusBox) statusBox.textContent = fmtNum(list.length) + ' veículos';
  }

  window.HealthPdf = { download };
})();
