/**
 * BILINGUAL TALENT INTELLIGENCE SYSTEM - DUTCH VERSION
 * Workforce Efficiency & Structural Talent Planning
 * 
 * Logic based on public labor market signals:
 * - LinkedIn hiring velocity patterns (publicly observable)
 * - Published Belgian salary surveys (SD Worx, Partena, Acerta)
 * - EU labor statistics (Eurostat)
 * - OECD employment outlook reports
 * - Public EOR provider market data
 * 
 * DISCLAIMER: This is a strategic modeling tool based on public signals.
 * No internal HR data is accessed or claimed.
 */

(function() {
    'use strict';

    // Application State
    const state = {
        currentStep: 1,
        totalSteps: 5,
        formData: {
            firmSize: null,
            bilingualExposure: null,
            region: null,
            hiringPressure: null
        }
    };

    // DOM Elements
    const elements = {
        form: document.getElementById('talentForm'),
        progressFill: document.getElementById('progressFill'),
        steps: document.querySelectorAll('.step'),
        resultsContainer: document.getElementById('resultsContainer')
    };

    // Risk Modeling Configuration
    // Based on public labor market dynamics in Belgium 2024-2025
    const riskConfig = {
        // Firm size risk multipliers (larger = more complex retention)
        firmSizeRisk: {
            small: 0.8,      // 50-100: Agile but key-person dependent
            medium: 1.0,     // 100-150: Balanced exposure
            large: 1.2       // 150-250: Complex organizational dynamics
        },
        
        // Bilingual exposure impact (higher = more vulnerable)
        bilingualRisk: {
            low: 0.7,        // <25%: Limited exposure
            medium: 1.0,     // 25-50%: Significant exposure
            high: 1.4        // >50%: Critical dependency
        },
        
        // Regional market pressure (based on public job posting density)
        regionalPressure: {
            brussels: 1.3,   // Hyper-competitive market
            antwerp: 1.2,    // High Flemish demand for bilingual
            liege: 0.9,      // Moderate Walloon market
            other: 1.0       // National average
        },
        
        // Hiring pressure correlation with retention risk
        hiringPressureRisk: {
            stable: 0.8,     // Low turnover pressure
            moderate: 1.0,   // Normal market dynamics
            aggressive: 1.3  // High competition, poaching risk
        }
    };

    // Market heatmap data (modeled from public signals)
    const marketHeatmapData = {
        brussels: { level: 'hoog', label: 'Kritieke spanning', description: 'Tweetalige premie +25-35%' },
        antwerp: { level: 'hoog', label: 'Hoge spanning', description: 'Tweetalige premie +20-30%' },
        liege: { level: 'matig', label: 'Matige spanning', description: 'Tweetalige premie +15-25%' },
        other: { level: 'matig', label: 'Variabele spanning', description: 'Tweetalige premie +10-20%' }
    };

    /**
     * Initialize Application
     */
    function init() {
        bindEvents();
        updateProgress();
    }

    /**
     * Event Binding
     */
    function bindEvents() {
        // Step 1
        document.querySelectorAll('input[name="firmSize"]').forEach(radio => {
            radio.addEventListener('change', () => {
                state.formData.firmSize = radio.value;
                document.getElementById('nextBtn1').disabled = false;
            });
        });
        document.getElementById('nextBtn1').addEventListener('click', () => nextStep());

        // Step 2
        document.querySelectorAll('input[name="bilingualExposure"]').forEach(radio => {
            radio.addEventListener('change', () => {
                state.formData.bilingualExposure = radio.value;
                document.getElementById('nextBtn2').disabled = false;
            });
        });
        document.getElementById('prevBtn2').addEventListener('click', () => prevStep());
        document.getElementById('nextBtn2').addEventListener('click', () => nextStep());

        // Step 3
        document.querySelectorAll('input[name="region"]').forEach(radio => {
            radio.addEventListener('change', () => {
                state.formData.region = radio.value;
                document.getElementById('nextBtn3').disabled = false;
            });
        });
        document.getElementById('prevBtn3').addEventListener('click', () => prevStep());
        document.getElementById('nextBtn3').addEventListener('click', () => nextStep());

        // Step 4
        document.querySelectorAll('input[name="hiringPressure"]').forEach(radio => {
            radio.addEventListener('change', () => {
                state.formData.hiringPressure = radio.value;
                document.getElementById('nextBtn4').disabled = false;
            });
        });
        document.getElementById('prevBtn4').addEventListener('click', () => prevStep());
        document.getElementById('nextBtn4').addEventListener('click', () => {
            calculateAndShowResults();
            nextStep();
        });
    }

    /**
     * Navigation Functions
     */
    function nextStep() {
        if (state.currentStep < state.totalSteps) {
            document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.remove('active');
            state.currentStep++;
            document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.add('active');
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function prevStep() {
        if (state.currentStep > 1) {
            document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.remove('active');
            state.currentStep--;
            document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.add('active');
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function updateProgress() {
        const progress = (state.currentStep / state.totalSteps) * 100;
        elements.progressFill.style.width = `${progress}%`;
    }

    /**
     * Risk Calculation Engine
     * Transparent modeling based on public labor market signals
     */
    function calculateRisk() {
        const { firmSize, bilingualExposure, region, hiringPressure } = state.formData;
        
        // Base risk score calculation
        let riskScore = 50; // Neutral baseline
        
        // Apply multipliers
        riskScore *= riskConfig.firmSizeRisk[firmSize];
        riskScore *= riskConfig.bilingualRisk[bilingualExposure];
        riskScore *= riskConfig.regionalPressure[region];
        riskScore *= riskConfig.hiringPressureRisk[hiringPressure];
        
        // Normalize to 0-100 scale
        riskScore = Math.min(100, Math.max(0, riskScore));
        
        // Determine risk level
        let riskLevel, riskClass, riskDescription;
        if (riskScore < 40) {
            riskLevel = 'Laag';
            riskClass = 'laag';
            riskDescription = 'Uw blootstelling aan tweetalig talentverloop is beheerst. Handhaaf huidige workforce planning terwijl u marktontwikkelingen monitort.';
        } else if (riskScore < 60) {
            riskLevel = 'Matig';
            riskClass = 'matig';
            riskDescription = 'Identificeerbaar verlooprisico op kritieke profielen. Proactieve retentiestrategie wordt aanbevolen voor structurele stabiliteit.';
        } else if (riskScore < 80) {
            riskLevel = 'Verhoogd';
            riskClass = 'verhoogd';
            riskDescription = 'Significante kwetsbaarheid voor talentverlies. Strategische interventie vereist om workforce continuity te waarborgen.';
        } else {
            riskLevel = 'Structureel risico';
            riskClass = 'structureel';
            riskDescription = 'Kritieke blootstelling aan tweetalige talentkrapte. Herconfiguratie van uw talentacquisitiemodel is noodzakelijk.';
        }
        
        // Calculate sub-indicators (modeled estimates)
        const bilingualPressure = Math.min(100, riskScore * 1.1 + (region === 'brussels' ? 15 : 0));
        const scarcityExposure = Math.min(100, riskScore * 1.2);
        const aiLeverage = Math.min(100, 100 - (riskScore * 0.3) + (firmSize === 'large' ? 20 : 0));
        const eorFeasibility = Math.min(100, (bilingualExposure === 'high' ? 85 : 60) + (hiringPressure === 'aggressive' ? 15 : 0));
        
        return {
            riskScore,
            riskLevel,
            riskClass,
            riskDescription,
            indicators: {
                bilingualPressure,
                scarcityExposure,
                aiLeverage,
                eorFeasibility
            }
        };
    }

    /**
     * Generate Strategic Interpretation
     * Efficiency-focused framing for Flemish business culture
     */
    function generateInterpretation(riskData) {
        const { firmSize, bilingualExposure, region, hiringPressure } = state.formData;
        const { riskLevel, riskClass } = riskData;
        
        let interpretation = '';
        
        // Opening context - efficiency focused
        interpretation += `<p><strong>Workforce efficiency analyse:</strong> Uw kantoor met ${getFirmSizeLabel(firmSize)} `;
        interpretation += `en ${getBilingualLabel(bilingualExposure)} tweetalige klantexpositie `;
        interpretation += `in ${getRegionLabel(region)} vertoont een <strong>${riskLevel.toLowerCase()} risiconiveau</strong>. `;
        
        // Risk-specific analysis - structural/operational focus
        if (riskClass === 'laag') {
            interpretation += `Dit gunstige profiel wijst op efficiënte talentallocatie en stabiele workforce metrics. </p>`;
            interpretation += `<p><strong>Optimalisatieprioriteiten:</strong></p><ul>`;
            interpretation += `<li>Structurele monitoring van arbeidsmarktcompensatieniveaus in uw regio</li>`;
            interpretation += `<li>Proactieve succession planning voor kritieke tweetalige posities</li>`;
            interpretation += `<li>Evaluatie van IA-automatisering voor junior capaciteitsoptimalisatie</li></ul>`;
        } else if (riskClass === 'matig') {
            interpretation += `Spanningssignalen op de Belgische tweetalige arbeidsmarkt vereisen operationele aanpassingen. </p>`;
            interpretation += `<p><strong>Optimalisatieprioriteiten:</strong></p><ul>`;
            interpretation += `<li>Onmiddellijke audit van salarispositionering vs. publieke marktdata (LinkedIn, Glassdoor)</li>`;
            interpretation += `<li>Identificatie van vertrekrisicoprofielen (senioriteit, klantexpositie)</li>`;
            interpretation += `<li>Haalbaarheidsstudie EOR voor niet-kritische ondersteuningsfuncties</li></ul>`;
        } else if (riskClass === 'verhoogd') {
            interpretation += `De combinatie van omvang, tweetalige afhankelijkheid en locatie creëert operationele inefficiëntie. </p>`;
            interpretation += `<p><strong>Optimalisatieprioriteiten:</strong></p><ul>`;
            interpretation += `<li>Implementatie spoedretentieplan (salarisadjustement, carrièrepaden)</li>`;
            interpretation += `<li>Activering EOR-kanalen voor lokale wervingsdrukvermindering</li>`;
            interpretation += `<li>Deploy IA-automatisering op document-intensieve processen</li>`;
            interpretation += `<li>Analyse interne mobiliteit voor behoud tweetalige expertise</li></ul>`;
        } else {
            interpretation += `Uw talentacquisitiemodel staat onder structurele druk. De krapte op tweetalige profielen bedreigt operationele capaciteit. </p>`;
            interpretation += `<p><strong>Optimalisatieprioriteiten:</strong></p><ul>`;
            interpretation += `<li>Onmiddellijke herconfiguratie compensatiestructuur (significante tweetalige premie)</li>`;
            interpretation += `<li>Implementatie multicountry EOR-model voor Europese talenttoegang</li>`;
            interpretation += `<li>Acceleratie IA-transformatie om personeelsafhankelijkheid te reduceren</li>`;
            interpretation += `<li>Herstructurering organisatie om kritieke tweetalige functies te isoleren</li></ul>`;
        }
        
        // Market context - efficiency metrics
        interpretation += `<p><strong>Arbeidsmarktcontext:</strong> Publieke wervingsdata tonen een `;
        interpretation += `hiring velocity van +23% voor tweetalige juridische profielen FR-NL in Brussel (LinkedIn, 2024). `;
        interpretation += `De tweetalige premie bereikt 20-35% in advocaten- en auditkantoren (publieke bronnen). `;
        interpretation += `Zonder interventie neemt het selectieve verlooprisico op uw tweetalige talent toe met 15-25% jaarlijks.</p>`;
        
        return interpretation;
    }

    /**
     * Helper Functions for Labels
     */
    function getFirmSizeLabel(size) {
        const labels = {
            small: '50–100 professionals',
            medium: '100–150 professionals',
            large: '150–250 professionals'
        };
        return labels[size] || size;
    }

    function getBilingualLabel(exposure) {
        const labels = {
            low: 'minder dan 25%',
            medium: '25% tot 50%',
            high: 'meer dan 50%'
        };
        return labels[exposure] || exposure;
    }

    function getRegionLabel(region) {
        const labels = {
            brussels: 'Brussel',
            antwerp: 'Antwerpen/Vlaanderen',
            liege: 'Luik/Wallonië',
            other: 'overige België'
        };
        return labels[region] || region;
    }

    /**
     * Render Results
     */
    function calculateAndShowResults() {
        const riskData = calculateRisk();
        
        // Update risk level display
        const riskValueEl = document.getElementById('riskValue');
        riskValueEl.textContent = riskData.riskLevel;
        riskValueEl.className = `risk-value ${riskData.riskClass}`;
        document.getElementById('riskDescription').textContent = riskData.riskDescription;
        
        // Update indicators
        updateIndicator('bilingualPressure', riskData.indicators.bilingualPressure);
        updateIndicator('scarcity', riskData.indicators.scarcityExposure);
        updateIndicator('aiLeverage', riskData.indicators.aiLeverage);
        updateIndicator('eorFeasibility', riskData.indicators.eorFeasibility);
        
        // Update interpretation
        document.getElementById('interpretationContent').innerHTML = generateInterpretation(riskData);
        
        // Render heatmap
        renderHeatmap();
    }

    function updateIndicator(name, value) {
        const bar = document.getElementById(`${name}Bar`);
        const valueEl = document.getElementById(`${name}Value`);
        
        bar.style.width = `${value}%`;
        valueEl.textContent = `${Math.round(value)}%`;
        
        // Color coding
        bar.className = 'indicator-fill';
        if (value < 40) bar.classList.add('laag');
        else if (value < 70) bar.classList.add('matig');
        else bar.classList.add('hoog');
    }

    function renderHeatmap() {
        const heatmapEl = document.getElementById('marketHeatmap');
        heatmapEl.innerHTML = '';
        
        Object.entries(marketHeatmapData).forEach(([region, data]) => {
            const cell = document.createElement('div');
            cell.className = `heatmap-cell ${data.level}`;
            cell.innerHTML = `
                <span class="heatmap-region">${getRegionLabel(region)}</span>
                <span class="heatmap-status">${data.label}</span>
                <small style="display: block; margin-top: 4px; color: var(--text-muted);">${data.description}</small>
            `;
            heatmapEl.appendChild(cell);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
