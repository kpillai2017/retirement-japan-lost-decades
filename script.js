/**
 * UPDATED DATA ARRAY: Japanese-Context Stress Test
 * [Year, VAS Ret, VGS Ret, JGB Ret, VAS Yield, VGS Yield, JGB Yield, Cash Rate, CPI, Phase Name]
 * JGB and Cash Rate have been lowered to simulate the Japanese interest rate collapse.
 */
const DATA = [
  [ 1990, -0.243, -0.195,  0.035,  0.048,  0.018,  0.065,  0.060,  0.068, "Crash I"],
  [ 1991, -0.082, -0.120,  0.040,  0.050,  0.018,  0.058,  0.045,  0.032, "Crash I"],
  [ 1992, -0.045, -0.055,  0.030,  0.054,  0.018,  0.045,  0.030,  0.011, "Crash I"],
  [ 1993,  0.158,  0.225,  0.025,  0.042,  0.019,  0.035,  0.025,  0.019, "Recovery I"],
  [ 1994, -0.088, -0.028,  0.020,  0.044,  0.018,  0.028,  0.020,  0.025, "Stagnation"],
  [ 1995,  0.182,  0.193,  0.025,  0.040,  0.018,  0.025,  0.015,  0.043, "Recovery I"],
  [ 1996,  0.148,  0.130,  0.020,  0.039,  0.018,  0.020,  0.005,  0.031, "Recovery I"],
  [ 1997,  0.082, -0.098,  0.018,  0.040,  0.019,  0.018,  0.005,  0.003, "Asia Crisis"],
  [ 1998,  0.045, -0.012,  0.015,  0.042,  0.019,  0.015,  0.003,  0.014, "Asia Crisis"],
  [ 1999,  0.145,  0.275,  0.012,  0.038,  0.020,  0.012,  0.001,  0.017, "Dot-com boom"],
  [ 2000, -0.016, -0.131,  0.015,  0.038,  0.019,  0.015,  0.001,  0.032, "Dot-com crash"],
  [ 2001,  0.101, -0.128,  0.012,  0.042,  0.018,  0.012,  0.001,  0.030, "Dot-com crash"],
  [ 2002, -0.081, -0.198,  0.010,  0.046,  0.017,  0.010,  0.001,  0.030, "Dot-com crash"],
  [ 2003,  0.155,  0.108,  0.012,  0.042,  0.019,  0.012,  0.001,  0.028, "Recovery II"],
  [ 2004,  0.241,  0.153,  0.010,  0.039,  0.020,  0.010,  0.001,  0.024, "Recovery II"],
  [ 2005,  0.218,  0.167,  0.008,  0.040,  0.020,  0.008,  0.001,  0.027, "Recovery II"],
  [ 2006,  0.252,  0.188,  0.010,  0.041,  0.021,  0.010,  0.002,  0.035, "Recovery II"],
  [ 2007,  0.180,  0.062,  0.012,  0.042,  0.020,  0.012,  0.005,  0.033, "Pre-GFC"],
  [ 2008, -0.388, -0.417,  0.015,  0.068,  0.022,  0.015,  0.003,  0.043, "GFC"],
  [ 2009,  0.397,  0.261,  0.010,  0.060,  0.022,  0.010,  0.001,  0.021, "GFC Recovery"],
  [ 2010,  0.028,  0.046,  0.008,  0.048,  0.022,  0.008,  0.001,  0.028, "Stagnation II"],
  [ 2011, -0.111, -0.128,  0.010,  0.054,  0.023,  0.010,  0.001,  0.032, "Euro Crisis"],
  [ 2012,  0.201,  0.164,  0.008,  0.050,  0.024,  0.008,  0.001,  0.024, "Recovery III"],
  [ 2013,  0.204,  0.380,  0.005,  0.048,  0.024,  0.005,  0.001,  0.024, "Recovery III"],
  [ 2014,  0.055,  0.136,  0.005,  0.049,  0.024,  0.005,  0.001,  0.025, "Recovery III"],
  [ 2015,  0.030, -0.003,  0.002,  0.049,  0.025,  0.002,  0.001,  0.017, "Low growth"],
  [ 2016,  0.115,  0.109,  0.001,  0.047,  0.025,  0.001,  0.000,  0.013, "Low growth"],
  [ 2017,  0.127,  0.186,  0.001,  0.044,  0.024,  0.001,  0.000,  0.019, "Low growth"],
  [ 2018, -0.025, -0.055,  0.001,  0.046,  0.024,  0.001,  0.000,  0.019, "Correction"],
  [ 2019,  0.235,  0.284,  0.001,  0.043,  0.024,  0.001,  0.000,  0.016, "Pre-COVID"],
  [ 2020, -0.015, -0.008,  0.000,  0.041,  0.022,  0.000,  0.000,  0.009, "COVID"],
];

const FRANK_GROSS = 30 / 70;
const TAX_FREE = 18200 * 2;

function calcTax(vgsDist, vafDist, cashInt) {
    const grossPersonal = vgsDist + vafDist + cashInt;
    const taxable = Math.max(0, grossPersonal - TAX_FREE);
    if (taxable <= 0) return 0;
    if (taxable <= 45000) return taxable * 0.19;
    if (taxable <= 135000) return 8550 + (taxable - 45000) * 0.325;
    return 37800 + (taxable - 135000) * 0.37;
}

function fmt(n) {
    const abs = Math.abs(n);
    let s = abs >= 1e6 ? '$' + (abs / 1e6).toFixed(2) + 'M' : '$' + Math.round(abs).toLocaleString();
    return n < 0 ? '-' + s : s;
}

function fmtPct(n) { return (n >= 0 ? '+' : '') + (n * 100).toFixed(1) + '%'; }

let lastVas = 30, lastVgs = 40, lastVaf = 30, adjusting = false;
let mainChart = null, spendChart = null, bufChart = null;

function syncAlloc(changed, val) {
    if (adjusting) return;
    adjusting = true;
    let v = { vas: lastVas, vgs: lastVgs, vaf: lastVaf };
    v[changed] = val;
    const others = Object.keys(v).filter(k => k !== changed);
    const otherSum = others.reduce((s, k) => s + v[k], 0);
    const remaining = 100 - val;
    
    if (remaining < 0) {
        others.forEach(k => v[k] = 0); v[changed] = 100;
    } else if (otherSum > 0) {
        const scale = remaining / otherSum;
        others.forEach(k => v[k] = Math.round(v[k] * scale / 5) * 5);
        const diff = remaining - others.reduce((s, k) => s + v[k], 0);
        v[others[0]] += diff;
    }
    
    ['vas', 'vgs', 'vaf'].forEach(k => {
        v[k] = Math.max(0, Math.min(100, v[k]));
        document.getElementById('sl-' + k).value = v[k];
        document.getElementById('vl-' + k).textContent = v[k] + '%';
    });
    
    lastVas = v.vas; lastVgs = v.vgs; lastVaf = v.vaf;
    const total = v.vas + v.vgs + v.vaf;
    document.getElementById('bar-vas').style.width = v.vas + '%';
    document.getElementById('bar-vgs').style.width = v.vgs + '%';
    document.getElementById('bar-vaf').style.width = v.vaf + '%';
    const badge = document.getElementById('total-badge');
    badge.textContent = 'Total: ' + total + '%';
    badge.className = 'total-badge ' + (total === 100 ? 'ok' : 'warn');
    adjusting = false;
    run();
}

function run() {
    const portStart = parseInt(document.getElementById('sl-port').value);
    const spendStart = parseInt(document.getElementById('sl-spend').value);
    const bufStart = parseInt(document.getElementById('sl-buf').value);

    document.getElementById('vl-port').textContent = portStart >= 1e6 ? '$' + (portStart / 1e6).toFixed(1) + 'M' : '$' + Math.round(portStart / 1000) + 'k';
    document.getElementById('vl-spend').textContent = '$' + Math.round(spendStart / 1000) + 'k';
    document.getElementById('vl-buf').textContent = bufStart >= 1e6 ? '$' + (bufStart / 1e6).toFixed(1) + 'M' : '$' + Math.round(bufStart / 1000) + 'k';

    if (lastVas + lastVgs + lastVaf !== 100) return;

    const vasPct = lastVas / 100, vgsPct = lastVgs / 100, vafPct = lastVaf / 100;
    let vas = portStart * vasPct, vgs = portStart * vgsPct, vaf = portStart * vafPct;
    let cash = bufStart, spend = spendStart, yr11done = false;

    const rows = [], labels = [], portfolioVals = [], spendVals = [], bufVals = [], nikkeiRef = [], targetLine = [];
    let nikkeiVal = portStart, totalSpend = 0, floorHits = 0, ruined = false;
    const spendRatio = spendStart / 80000;
    const FLOOR = Math.round(70000 * spendRatio), CEIL = Math.round(100000 * spendRatio);

    for (let i = 0; i < DATA.length; i++) {
        const [year, vasRet, vgsRet, vafRet, vasYld, vgsYld, vafYld, cashRt, cpi, phase] = DATA[i];
        labels.push(year);
        targetLine.push(Math.round(portStart / 1000));

        const yr = i + 1;
        const bufTarget = Math.min(bufStart, spend * (yr <= 10 ? 3 : 2));

        if (yr === 11 && !yr11done) {
            const excess = Math.max(0, cash - bufTarget);
            vas += excess * vasPct; vgs += excess * vgsPct; vaf += excess * vafPct;
            cash -= excess; yr11done = true;
        }

        const vasDist = vas * vasYld, vgsDist = vgs * vgsYld, vafDist = vaf * vafYld;
        const frankCredit = vasDist * FRANK_GROSS, cashInt = cash * cashRt;
        const totalIncome = (vasDist + vgsDist + vafDist + frankCredit) + cashInt;

        vas *= (1 + vasRet - vasYld); vgs *= (1 + vgsRet - vgsYld); vaf *= (1 + vafRet - vafYld);
        const portTotal = vas + vgs + vaf;
        const prevComb = rows.length > 0 ? rows[rows.length - 1].portTotal + rows[rows.length - 1].cash : portStart + bufStart;
        const negGrowth = (portTotal + cash) < prevComb;

        nikkeiVal *= (1 + vgsRet * 0.7 + vasRet * 0.3);

        let actualSpend = spend, reinvest = 0, bufDraw = 0;

        if (totalIncome >= actualSpend) {
            let surplus = totalIncome - actualSpend;
            const bufGap = bufTarget - cash;
            if (bufGap > 0) { const top = Math.min(surplus, bufGap); cash += top; surplus -= top; }
            
            reinvest = surplus;
            if (reinvest > 0.1) {
                let remainingReinvest = reinvest;
                while (remainingReinvest > 1) {
                    let total = vas + vgs + vaf;
                    let diffs = [
                        { id: 'vas', target: vasPct, current: vas / total },
                        { id: 'vgs', target: vgsPct, current: vgs / total },
                        { id: 'vaf', target: vafPct, current: vaf / total }
                    ];
                    diffs.sort((a, b) => (a.target - a.current) - (b.target - b.current));
                    let laggard = diffs[diffs.length - 1];
                    if ((laggard.target - laggard.current) <= 0) {
                        vas += remainingReinvest * vasPct; vgs += remainingReinvest * vgsPct; vaf += remainingReinvest * vafPct;
                        remainingReinvest = 0;
                    } else {
                        let topUp = Math.min(remainingReinvest, (laggard.target - laggard.current) * total);
                        if (laggard.id === 'vas') vas += topUp; else if (laggard.id === 'vgs') vgs += topUp; else vaf += topUp;
                        remainingReinvest -= topUp;
                        if (remainingReinvest < 10) { 
                            vas += remainingReinvest * vasPct; vgs += remainingReinvest * vgsPct; vaf += remainingReinvest * vafPct; 
                            remainingReinvest = 0; 
                        }
                    }
                }
            }
        } else {
            bufDraw = actualSpend - totalIncome; cash -= bufDraw;
        }

        if (cash < 0) {
            const sellVaf = Math.min(vaf * 0.8, -cash); vaf -= sellVaf; cash += sellVaf;
            if (cash < 0) { 
                const sellEq = Math.min((vas + vgs) * 0.5, -cash); 
                const r = vas/(vas+vgs+0.1); 
                vas -= sellEq*r; vgs -= sellEq*(1-r); cash += sellEq; 
            }
            if (cash < -500) ruined = true;
        }

        const tax = calcTax(vgsDist, vafDist, cashInt);
        if (!ruined) totalSpend += actualSpend;

        portfolioVals.push(Math.round((portTotal + cash) / 1000));
        spendVals.push(Math.round(actualSpend / 1000));
        bufVals.push(Math.round(Math.max(0, cash) / 1000));
        nikkeiRef.push(Math.round(nikkeiVal / 1000));

        rows.push({ 
            year, phase, vasRet, vgsRet, vafRet, portTotal, cash: Math.max(0, cash), 
            totalIncome, actualSpend, reinvest, bufDraw, tax, 
            isBear: (vasRet < -0.1 || vgsRet < -0.1), 
            isFloor: (actualSpend <= FLOOR * 1.01) 
        });

        if (actualSpend <= FLOOR * 1.01) floorHits++;
        spend = negGrowth ? Math.max(FLOOR, spend * 0.95) : Math.min(CEIL, spend * (1 + cpi));
        if (ruined) break;
    }

    updateSummary(!ruined, rows[rows.length-1], totalSpend, floorHits);
    updateCharts(labels, portfolioVals, nikkeiRef, targetLine, spendVals, bufVals);
    updateTable(rows);
}

function updateSummary(survived, lastRow, totalSpend, floorHits) {
    const finalVal = lastRow.portTotal + lastRow.cash;
    const sg = document.getElementById('summary-grid');
    sg.innerHTML = '';
    const metrics = [
        { label: 'Outcome', value: survived ? 'Survived' : 'RUIN', color: survived ? '#3B6D11' : '#A32D2D' },
        { label: 'Final Value', value: fmt(finalVal), color: '#1a1a18' },
        { label: 'Avg Spend', value: fmt(totalSpend / DATA.length), color: '#1a1a18' },
        { label: 'Floor Years', value: floorHits, color: '#854F0B' }
    ];
    metrics.forEach(m => {
        sg.innerHTML += `<div class="metric"><div class="metric-label">${m.label}</div><div class="metric-value" style="color:${m.color}">${m.value}</div></div>`;
    });
}

function updateCharts(labels, portfolioVals, nikkeiRef, targetLine, spendVals, bufVals) {
    if (mainChart) mainChart.destroy();
    mainChart = new Chart(document.getElementById('c-main'), { 
        type: 'line', 
        data: { labels, datasets: [
            { label: 'Portfolio', data: portfolioVals, borderColor: '#378ADD', fill: false },
            { label: 'Nikkei Ref', data: nikkeiRef, borderColor: '#E24B4A', borderDash: [5,5], fill: false },
            { label: 'Start', data: targetLine, borderColor: '#1D9E75', borderDash: [2,2], fill: false }
        ]},
        options: { 
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Years' } },
                y: { title: { display: true, text: "AUD ($'000s)" } }
            }
        }
    });

    if (spendChart) spendChart.destroy();
    spendChart = new Chart(document.getElementById('c-spend'), { 
        type: 'bar', data: { labels, datasets: [{ data: spendVals, backgroundColor: '#378ADD' }] },
        options: { responsive: true, maintainAspectRatio: false } 
    });

    if (bufChart) bufChart.destroy();
    bufChart = new Chart(document.getElementById('c-buf'), { 
        type: 'bar', data: { labels, datasets: [{ data: bufVals, backgroundColor: '#EF9F27' }] },
        options: { responsive: true, maintainAspectRatio: false } 
    });
}

function updateTable(rows) {
    const tbody = document.getElementById('tbl-body');
    tbody.innerHTML = '';
    rows.forEach(r => {
        const tr = document.createElement('tr');
        if (r.isBear) tr.className = 'bear';
        else if (r.isFloor) tr.className = 'floor-hit';
        tr.innerHTML = `
            <td>${r.year}</td><td>${r.phase}</td><td>${fmtPct(r.vasRet)}</td><td>${fmtPct(r.vgsRet)}</td><td>${fmtPct(r.vafRet)}</td>
            <td>${fmt(r.portTotal)}</td><td>${fmt(r.totalIncome - (r.cash * 0.05))}</td><td>${fmt(r.cash)}</td>
            <td>${fmt(r.totalIncome)}</td><td>${fmt(r.actualSpend)}</td>
            <td>${r.reinvest > 100 ? fmt(r.reinvest) : r.bufDraw > 0 ? '-' + fmt(r.bufDraw) : '—'}</td><td>${fmt(r.tax)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Initial Listeners
['sl-port', 'sl-spend', 'sl-buf'].forEach(id => document.getElementById(id).addEventListener('input', run));
['vas', 'vgs', 'vaf'].forEach(k => document.getElementById('sl-' + k).addEventListener('input', e => syncAlloc(k, parseInt(e.target.value))));

run();
