// SchemeSathi Main Application Logic

let currentLanguage = 'en'; // 'en' or 'hi'
let activeFilter = 'all';
let userProfile = {
  age: 22,
  gender: 'male',
  state: 'Telangana',
  area: 'rural',
  caste: 'obc',
  income: 180000,
  occupation: 'student',
  hasLand: false,
  isBpl: true,
  hasGirlChildUnder10: false,
  noPaccaHouse: false,
  isPwD: false
};

let matchedSchemes = [];
let selectedSchemeForModal = null;
let userCheckedDocs = {}; // { "schemeId-docName": true }

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  runEligibilityCheck();
  renderChatbotWelcome();
});

function initEventListeners() {
  // Form submission
  const profileForm = document.getElementById('citizen-profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      readFormInputs();
      runEligibilityCheck();
      
      // Smooth scroll to results
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Live updates on form inputs
  const inputs = profileForm.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('change', () => {
      readFormInputs();
      runEligibilityCheck();
    });
  });

  // Income slider live label update
  const incomeSlider = document.getElementById('income-slider');
  const incomeDisplay = document.getElementById('income-display');
  if (incomeSlider && incomeDisplay) {
    incomeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      incomeDisplay.textContent = formatRupees(val);
    });
  }

  // Chat message input
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  if (chatInput && chatSendBtn) {
    chatSendBtn.addEventListener('click', () => sendUserMessage());
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendUserMessage();
    });
  }

  // Voice button integration
  const voiceBtn = document.getElementById('voice-input-btn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', toggleVoiceInput);
  }
}

function readFormInputs() {
  userProfile.age = parseInt(document.getElementById('profile-age').value) || 25;
  userProfile.gender = document.getElementById('profile-gender').value;
  userProfile.state = document.getElementById('profile-state').value;
  userProfile.area = document.getElementById('profile-area').value;
  userProfile.caste = document.getElementById('profile-caste').value;
  userProfile.income = parseInt(document.getElementById('income-slider').value) || 200000;
  userProfile.occupation = document.getElementById('profile-occupation').value;
  
  userProfile.hasLand = document.getElementById('check-land')?.checked || false;
  userProfile.isBpl = document.getElementById('check-bpl')?.checked || false;
  userProfile.hasGirlChildUnder10 = document.getElementById('check-girl-child')?.checked || false;
  userProfile.noPaccaHouse = document.getElementById('check-pacca')?.checked || false;
  userProfile.isPwD = document.getElementById('check-pwd')?.checked || false;
}

// Eligibility Match Algorithm
function runEligibilityCheck() {
  matchedSchemes = SCHEMES_DATABASE.map(scheme => {
    let score = 0;
    let matchReasons = [];
    let disqualifyReason = null;

    const c = scheme.criteria;

    // 1. Occupation Match (Weight: 35)
    if (c.occupation) {
      if (c.occupation.includes(userProfile.occupation)) {
        score += 35;
        matchReasons.push(`Matches your occupation (${capitalize(userProfile.occupation)})`);
      } else if (c.occupation.includes('unemployed') || c.occupation.includes('daily-wage')) {
        score += 15;
      }
    } else {
      score += 20;
    }

    // 2. Income Match (Weight: 25)
    if (c.maxIncome) {
      if (userProfile.income <= c.maxIncome) {
        score += 25;
        matchReasons.push(`Income ₹${userProfile.income.toLocaleString('en-IN')} within eligibility limit of ₹${c.maxIncome.toLocaleString('en-IN')}`);
      } else {
        score -= 20;
        disqualifyReason = `Income exceeds upper limit of ₹${c.maxIncome.toLocaleString('en-IN')}`;
      }
    } else {
      score += 20;
    }

    // 3. Gender / Demographic (Weight: 20)
    if (c.gender) {
      if (c.gender.includes(userProfile.gender)) {
        score += 20;
        if (scheme.id === 'standup-india' && userProfile.gender === 'female') {
          score += 20;
          matchReasons.push("High priority under Women Entrepreneurship quotas");
        }
      } else {
        disqualifyReason = `Only open for ${c.gender.join(', ')} applicants`;
      }
    } else {
      score += 15;
    }

    // 4. Age Check (Weight: 10)
    if (userProfile.age >= (c.minAge || 0) && userProfile.age <= (c.maxAge || 100)) {
      score += 10;
    } else {
      disqualifyReason = `Eligible age bracket is ${c.minAge || 0} - ${c.maxAge || 100} years`;
    }

    // 5. Special criteria checks
    if (c.requiresLand) {
      if (userProfile.hasLand) {
        score += 10;
        matchReasons.push("Verified agricultural landholder");
      } else {
        score -= 30;
        disqualifyReason = "Requires certified agricultural land ownership";
      }
    }

    if (c.requiresBpl) {
      if (userProfile.isBpl) {
        score += 10;
        matchReasons.push("BPL / NFSA Ration card holder priority");
      }
    }

    if (c.hasGirlChildUnder10) {
      if (userProfile.hasGirlChildUnder10) {
        score += 35;
        matchReasons.push("Parent/Guardian of girl child under 10 years");
      } else {
        score = 0;
        disqualifyReason = "Only eligible if you have a daughter under 10 years";
      }
    }

    if (c.caste) {
      if (c.caste.includes(userProfile.caste)) {
        score += 15;
        matchReasons.push(`Applicable for ${userProfile.caste.toUpperCase()} category`);
      } else if (c.caste.length > 0 && !c.caste.includes(userProfile.caste)) {
        score -= 25;
        disqualifyReason = `Reserved specifically for ${c.caste.map(x => x.toUpperCase()).join('/')}`;
      }
    }

    if (c.noPaccaHouse) {
      if (userProfile.noPaccaHouse) {
        score += 20;
        matchReasons.push("Qualifies under housing deficit criteria");
      }
    }

    // Normalize score to 0 - 99%
    let finalPercentage = Math.min(Math.max(score, 10), 99);
    if (disqualifyReason) {
      finalPercentage = Math.min(finalPercentage, 35);
    }

    return {
      ...scheme,
      matchPercentage: finalPercentage,
      isQualified: finalPercentage >= 60 && !disqualifyReason,
      matchReasons: matchReasons.slice(0, 3),
      disqualifyReason
    };
  });

  // Sort descending by match score
  matchedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);

  renderSchemeCards();
  renderSummaryStats();
}

// Render Summary Bar
function renderSummaryStats() {
  const eligibleCount = matchedSchemes.filter(s => s.isQualified).length;
  const countBadge = document.getElementById('eligible-count-badge');
  if (countBadge) {
    countBadge.textContent = `${eligibleCount} Schemes Highly Recommended`;
  }

  const statNumber = document.getElementById('stat-eligible-schemes');
  if (statNumber) {
    statNumber.textContent = eligibleCount;
  }

  // Estimate annual financial/subsidy benefit value
  let totalBenefitEstimated = 0;
  if (matchedSchemes.some(s => s.id === 'pm-kisan' && s.isQualified)) totalBenefitEstimated += 6000;
  if (matchedSchemes.some(s => s.id === 'ayushman-bharat' && s.isQualified)) totalBenefitEstimated += 500000;
  if (matchedSchemes.some(s => s.id === 'nsp-post-matric' && s.isQualified)) totalBenefitEstimated += 25000;
  if (matchedSchemes.some(s => s.id === 'pm-svanidhi' && s.isQualified)) totalBenefitEstimated += 10000;
  if (matchedSchemes.some(s => s.id === 'pm-vishwakarma' && s.isQualified)) totalBenefitEstimated += 15000;
  if (matchedSchemes.some(s => s.id === 'pm-awas-yojana' && s.isQualified)) totalBenefitEstimated += 120000;

  const statBenefit = document.getElementById('stat-estimated-benefit');
  if (statBenefit) {
    statBenefit.textContent = `₹${(totalBenefitEstimated).toLocaleString('en-IN')}+`;
  }
}

// Render the grid of scheme cards
function renderSchemeCards() {
  const container = document.getElementById('schemes-grid');
  if (!container) return;

  container.innerHTML = '';

  const filtered = matchedSchemes.filter(scheme => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'eligible-only') return scheme.isQualified;
    return scheme.category.toLowerCase().includes(activeFilter.toLowerCase());
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <i class="fa-solid fa-folder-open text-slate-300 text-5xl mb-4"></i>
        <h3 class="text-lg font-semibold text-slate-800">No schemes found for this filter</h3>
        <p class="text-slate-500 text-sm mt-1">Try switching categories or adjusting your citizen profile criteria.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(scheme => {
    const isHighMatch = scheme.matchPercentage >= 75;
    const isMediumMatch = scheme.matchPercentage >= 50 && scheme.matchPercentage < 75;
    
    const badgeColor = isHighMatch 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : isMediumMatch 
        ? 'bg-amber-50 text-amber-700 border-amber-200' 
        : 'bg-slate-100 text-slate-600 border-slate-200';

    const card = document.createElement('div');
    card.className = `scheme-card bg-white rounded-2xl border ${isHighMatch ? 'border-emerald-200 shadow-md ring-1 ring-emerald-500/20' : 'border-slate-200 shadow-sm'} p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px]`;
    
    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <div>
            <span class="text-xs font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              ${scheme.category}
            </span>
            <p class="text-xs text-slate-400 mt-1">${scheme.ministry}</p>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}">
            <i class="fa-solid ${isHighMatch ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-amber-500'}"></i>
            <span>${scheme.matchPercentage}% Match</span>
          </div>
        </div>

        <h3 class="text-lg font-bold text-slate-900 mb-2 leading-snug hover:text-emerald-700 transition-colors">
          ${scheme.title}
        </h3>

        <!-- Key Benefit Box -->
        <div class="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-xl p-3 mb-4">
          <div class="flex items-start gap-2">
            <i class="fa-solid fa-gift text-emerald-600 mt-0.5 text-sm"></i>
            <div>
              <p class="text-xs font-bold text-emerald-900 uppercase tracking-wide">Key Benefit</p>
              <p class="text-xs font-semibold text-emerald-800 mt-0.5">${scheme.benefit}</p>
            </div>
          </div>
        </div>

        <!-- AI Plain Explanation Box -->
        <div class="mb-4 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <i class="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
              AI Simple Summary (Layman Terms)
            </span>
            <button onclick="toggleLangScheme('${scheme.id}', this)" class="text-[11px] text-slate-500 hover:text-indigo-600 underline">
              ${currentLanguage === 'en' ? 'हिन्दी में देखें' : 'View in English'}
            </button>
          </div>
          <p id="desc-${scheme.id}" class="text-xs text-slate-600 leading-relaxed">
            ${currentLanguage === 'en' ? scheme.simpleExplanation : (scheme.simpleExplanationHi || scheme.simpleExplanation)}
          </p>
        </div>

        <!-- Eligibility reasons pills -->
        ${scheme.matchReasons && scheme.matchReasons.length > 0 ? `
          <div class="space-y-1.5 mb-4">
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Why you qualify:</p>
            ${scheme.matchReasons.map(r => `
              <div class="flex items-center gap-1.5 text-xs text-slate-700">
                <i class="fa-solid fa-check text-emerald-500 text-xs"></i>
                <span>${r}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${scheme.disqualifyReason ? `
          <div class="bg-rose-50 border border-rose-200 rounded-lg p-2.5 mb-3 flex items-start gap-2">
            <i class="fa-solid fa-triangle-exclamation text-rose-500 text-xs mt-0.5"></i>
            <p class="text-xs text-rose-700 font-medium">${scheme.disqualifyReason}</p>
          </div>
        ` : ''}
      </div>

      <!-- Card Action Buttons -->
      <div class="pt-4 border-t border-slate-100 flex items-center gap-2 mt-2">
        <button onclick="openSchemeModal('${scheme.id}')" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-file-shield"></i>
          <span>Documents & Apply</span>
        </button>
        <a href="${scheme.officialUrl}" target="_blank" rel="noopener noreferrer" class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center" title="Visit Official Portal">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

function filterSchemes(category, buttonEl) {
  activeFilter = category;
  
  // Update button active styling
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.classList.remove('bg-emerald-600', 'text-white', 'shadow');
    btn.classList.add('bg-white', 'text-slate-600');
  });

  if (buttonEl) {
    buttonEl.classList.remove('bg-white', 'text-slate-600');
    buttonEl.classList.add('bg-emerald-600', 'text-white', 'shadow');
  }

  renderSchemeCards();
}

function toggleLangScheme(schemeId, btnEl) {
  const scheme = SCHEMES_DATABASE.find(s => s.id === schemeId);
  const textEl = document.getElementById(`desc-${schemeId}`);
  if (!scheme || !textEl) return;

  if (textEl.getAttribute('data-lang') === 'hi') {
    textEl.textContent = scheme.simpleExplanation;
    textEl.setAttribute('data-lang', 'en');
    btnEl.textContent = 'हिन्दी में देखें';
  } else {
    textEl.textContent = scheme.simpleExplanationHi || scheme.simpleExplanation;
    textEl.setAttribute('data-lang', 'hi');
    btnEl.textContent = 'View in English';
  }
}

// Global Language Switcher
function setGlobalLanguage(lang) {
  currentLanguage = lang;
  renderSchemeCards();
  const langEnBtn = document.getElementById('lang-en');
  const langHiBtn = document.getElementById('lang-hi');
  if (lang === 'en') {
    langEnBtn?.classList.add('bg-white', 'shadow', 'text-slate-900');
    langHiBtn?.classList.remove('bg-white', 'shadow', 'text-slate-900');
  } else {
    langHiBtn?.classList.add('bg-white', 'shadow', 'text-slate-900');
    langEnBtn?.classList.remove('bg-white', 'shadow', 'text-slate-900');
  }
}

// Modal View: Document Checklist & Application Roadmap
function openSchemeModal(schemeId) {
  const scheme = SCHEMES_DATABASE.find(s => s.id === schemeId);
  if (!scheme) return;
  selectedSchemeForModal = scheme;

  const modal = document.getElementById('scheme-modal');
  const modalContent = document.getElementById('modal-body');
  if (!modal || !modalContent) return;

  // Calculate user document readiness percentage
  const totalMandatoryDocs = scheme.documents.filter(d => d.mandatory).length;
  let ownedMandatoryDocs = 0;
  scheme.documents.forEach(doc => {
    if (doc.mandatory && userCheckedDocs[`${scheme.id}-${doc.name}`]) {
      ownedMandatoryDocs++;
    }
  });

  const readinessPercent = totalMandatoryDocs > 0 ? Math.round((ownedMandatoryDocs / totalMandatoryDocs) * 100) : 100;

  modalContent.innerHTML = `
    <div class="p-6 md:p-8 space-y-6">
      <!-- Modal Header -->
      <div class="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ${scheme.category}
            </span>
            <span class="text-xs text-slate-400">• ${scheme.ministry}</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900">${scheme.title}</h2>
          <p class="text-sm text-slate-600 mt-1">${scheme.benefit}</p>
        </div>
        <button onclick="closeSchemeModal()" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Readiness Meter -->
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-clipboard-check text-emerald-600 text-lg"></i>
            <div>
              <p class="text-sm font-bold text-slate-900">Your Document Readiness Score</p>
              <p class="text-xs text-slate-500">Check the boxes below for documents you already have</p>
            </div>
          </div>
          <span id="readiness-score-badge" class="text-base font-extrabold ${readinessPercent === 100 ? 'text-emerald-600' : 'text-amber-600'}">
            ${readinessPercent}% Ready
          </span>
        </div>
        <!-- Progress bar -->
        <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div id="readiness-progress-bar" class="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300" style="width: ${readinessPercent}%"></div>
        </div>
      </div>

      <!-- Interactive Document Checklist -->
      <div>
        <h3 class="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <i class="fa-solid fa-folder-tree text-indigo-600"></i>
          Required Documents Checklist
        </h3>
        <div class="space-y-2.5">
          ${scheme.documents.map((doc, idx) => {
            const docKey = `${scheme.id}-${doc.name}`;
            const isChecked = !!userCheckedDocs[docKey];
            return `
              <div class="flex items-start gap-3 p-3.5 rounded-xl border ${isChecked ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200'} transition-colors">
                <input type="checkbox" id="doc-check-${idx}" ${isChecked ? 'checked' : ''} 
                  onchange="toggleDocStatus('${scheme.id}', '${doc.name}', this.checked)"
                  class="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <label for="doc-check-${idx}" class="text-sm font-semibold text-slate-800 cursor-pointer">
                      ${doc.name}
                    </label>
                    ${doc.mandatory ? `
                      <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">Mandatory</span>
                    ` : `
                      <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">Optional</span>
                    `}
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">${doc.description}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Step-by-Step Application Guide -->
      <div>
        <h3 class="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <i class="fa-solid fa-route text-emerald-600"></i>
          Step-by-Step How to Apply
        </h3>
        <ol class="relative border-l border-emerald-200 ml-3 space-y-4 py-1">
          ${scheme.applicationSteps.map((step, idx) => `
            <li class="ml-6">
              <span class="absolute -left-3 flex items-center justify-center w-6 h-6 bg-emerald-600 text-white rounded-full text-xs font-bold ring-4 ring-white">
                ${idx + 1}
              </span>
              <p class="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                ${step}
              </p>
            </li>
          `).join('')}
        </ol>
      </div>

      <!-- Action Footer -->
      <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div class="text-xs text-slate-500">
          <i class="fa-solid fa-headset text-slate-400 mr-1"></i>
          Toll-Free Helpline: <span class="font-bold text-slate-800">${scheme.helpline}</span>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="printSchemeDossier('${scheme.id}')" class="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5">
            <i class="fa-solid fa-print"></i>
            <span>Print Application Slip</span>
          </button>
          <a href="${scheme.officialUrl}" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm">
            <span>Proceed to Official Portal</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeSchemeModal() {
  const modal = document.getElementById('scheme-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function toggleDocStatus(schemeId, docName, isChecked) {
  userCheckedDocs[`${schemeId}-${docName}`] = isChecked;
  
  // Re-calculate readiness
  const scheme = SCHEMES_DATABASE.find(s => s.id === schemeId);
  if (!scheme) return;

  const totalMandatoryDocs = scheme.documents.filter(d => d.mandatory).length;
  let owned = 0;
  scheme.documents.forEach(doc => {
    if (doc.mandatory && userCheckedDocs[`${scheme.id}-${doc.name}`]) {
      owned++;
    }
  });

  const readinessPercent = totalMandatoryDocs > 0 ? Math.round((owned / totalMandatoryDocs) * 100) : 100;
  const badge = document.getElementById('readiness-score-badge');
  const bar = document.getElementById('readiness-progress-bar');
  if (badge) {
    badge.textContent = `${readinessPercent}% Ready`;
    badge.className = `text-base font-extrabold ${readinessPercent === 100 ? 'text-emerald-600' : 'text-amber-600'}`;
  }
  if (bar) {
    bar.style.width = `${readinessPercent}%`;
  }
}

// Print/Dossier Generator for Citizen
function printSchemeDossier(schemeId) {
  const scheme = SCHEMES_DATABASE.find(s => s.id === schemeId) || matchedSchemes[0];
  if (!scheme) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SchemeSathi - Citizen Welfare Dossier: ${scheme.title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; }
        .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        h1 { margin: 0; color: #0f172a; font-size: 20px; }
        .subtitle { color: #059669; font-weight: bold; font-size: 14px; margin-top: 4px; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px; }
        .box h3 { margin-top: 0; font-size: 14px; color: #0f172a; }
        ul { padding-left: 20px; font-size: 13px; line-height: 1.6; }
        ol { padding-left: 20px; font-size: 13px; line-height: 1.6; }
        .footer { font-size: 11px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>SchemeSathi (स्कीम साथी) - Citizen Application Slip</h1>
          <div class="subtitle">AI-Verified Government Scheme Assistance</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          Generated: ${new Date().toLocaleDateString('en-IN')}<br>
          Citizen State: ${userProfile.state}
        </div>
      </div>

      <div class="box">
        <h3>1. Scheme Overview</h3>
        <p><strong>Name:</strong> ${scheme.title}</p>
        <p><strong>Ministry:</strong> ${scheme.ministry}</p>
        <p><strong>Key Benefit:</strong> ${scheme.benefit}</p>
        <p><strong>Simple Summary:</strong> ${scheme.simpleExplanation}</p>
      </div>

      <div class="box">
        <h3>2. Required Documents Checklist (Carry to CSC / MeeSeva / Bank)</h3>
        <ul>
          ${scheme.documents.map(d => `<li>[ ${userCheckedDocs[`${scheme.id}-${d.name}`] ? '✓ READY' : '   NEEDS TO ACQUIRE'} ] <strong>${d.name}</strong> ${d.mandatory ? '(Mandatory)' : '(Optional)'} - ${d.description}</li>`).join('')}
        </ul>
      </div>

      <div class="box">
        <h3>3. Next Steps to Apply</h3>
        <ol>
          ${scheme.applicationSteps.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>

      <div class="footer">
        Official Web Portal: ${scheme.officialUrl} | Official Helpline: ${scheme.helpline}<br>
        <em>Note: SchemeSathi is an open public assistance initiative to help citizens discover official government welfare programs.</em>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// ----------------- AI Chatbot Logic -----------------
function renderChatbotWelcome() {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;

  chatMessages.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="bg-white border border-slate-200 text-slate-800 text-xs md:text-sm rounded-2xl rounded-tl-none p-3.5 shadow-sm max-w-[85%] leading-relaxed">
        <strong>Namaste! I am your AI SchemeSathi.</strong><br>
        Ask me anything about scholarships, farmer subsidies, medical insurance, housing grants, or women business loans. Or tap one of the quick questions below!
      </div>
    </div>
  `;
}

function askPreset(promptText) {
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.value = promptText;
    sendUserMessage();
  }
}

function sendUserMessage() {
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  if (!chatInput || !chatMessages) return;

  const text = chatInput.value.trim();
  if (!text) return;

  // Append user message
  const userMsgEl = document.createElement('div');
  userMsgEl.className = 'flex items-start gap-3 justify-end';
  userMsgEl.innerHTML = `
    <div class="bg-emerald-600 text-white text-xs md:text-sm rounded-2xl rounded-tr-none p-3.5 shadow-sm max-w-[85%] leading-relaxed">
      ${escapeHtml(text)}
    </div>
    <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0">
      <i class="fa-solid fa-user"></i>
    </div>
  `;
  chatMessages.appendChild(userMsgEl);
  chatInput.value = '';

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.id = 'bot-typing';
  typingEl.className = 'flex items-start gap-3';
  typingEl.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0">
      <i class="fa-solid fa-robot"></i>
    </div>
    <div class="bg-slate-100 text-slate-500 text-xs rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></span>
      <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse delay-100"></span>
      <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse delay-200"></span>
      <span class="ml-1 text-[11px]">SchemeSathi is thinking...</span>
    </div>
  `;
  chatMessages.appendChild(typingEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Generate intelligent response after short delay
  setTimeout(() => {
    typingEl.remove();
    const botReply = generateAIResponse(text);
    
    const botMsgEl = document.createElement('div');
    botMsgEl.className = 'flex items-start gap-3';
    botMsgEl.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="bg-white border border-slate-200 text-slate-800 text-xs md:text-sm rounded-2xl rounded-tl-none p-3.5 shadow-sm max-w-[85%] leading-relaxed">
        ${botReply}
      </div>
    `;
    chatMessages.appendChild(botMsgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 700);
}

// Simulated AI NLP Response Generator
function generateAIResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('student') || q.includes('college') || q.includes('scholarship') || q.includes('fees')) {
    return `
      🎓 <strong>Top Education Schemes for you:</strong><br>
      • <strong>Post-Matric Scholarship:</strong> Covers 100% of college tuition fees + ₹13,500/year living allowance if family income is under ₹2.5 Lakhs (SC/ST/OBC/EWS).<br>
      • <strong>National Scholarship Portal (NSP):</strong> Register at <a href="https://scholarships.gov.in" target="_blank" class="text-emerald-700 underline font-semibold">scholarships.gov.in</a>.<br>
      💡 <em>Tip: Keep your Caste Certificate, Income Certificate (< ₹2.5 LPA), and Aadhaar-seeded bank account ready!</em>
    `;
  }

  if (q.includes('farmer') || q.includes('kisan') || q.includes('agriculture') || q.includes('land')) {
    return `
      🌾 <strong>For Farmers & Agri-families:</strong><br>
      • <strong>PM-KISAN:</strong> ₹6,000 yearly in 3 direct payments of ₹2,000 straight to your bank account.<br>
      • <strong>Kisan Credit Card (KCC):</strong> Crop loan up to ₹3 Lakhs at subsidized 4% interest.<br>
      💡 <em>Requirements: Certified Land Record (Khatauni/Patta), Aadhaar linked with mobile and bank NPCI seeding.</em>
    `;
  }

  if (q.includes('woman') || q.includes('women') || q.includes('female') || q.includes('girl')) {
    return `
      👩 <strong>Empowerment & Women Schemes:</strong><br>
      • <strong>Stand-Up India:</strong> ₹10 Lakh to ₹1 Crore bank loan specifically designated for women entrepreneurs setting up greenfield businesses.<br>
      • <strong>Sukanya Samriddhi Yojana (SSY):</strong> 8.2% guaranteed tax-free return for girl children under 10 years.<br>
      • <strong>Mudra Tarun/Kishore:</strong> Collateral-free micro loans for shops, beauty parlors, tailoring, catering.
    `;
  }

  if (q.includes('loan') || q.includes('business') || q.includes('shop') || q.includes('startup') || q.includes('mudra')) {
    return `
      💼 <strong>Collateral-Free Business Loans:</strong><br>
      • <strong>Pradhan Mantri MUDRA Yojana:</strong><br>
        - <em>Shishu:</em> Loans up to ₹50,000 for starting out.<br>
        - <em>Kishore:</em> ₹50,000 to ₹5 Lakhs.<br>
        - <em>Tarun:</em> ₹5 Lakhs to ₹10 Lakhs.<br>
      • <strong>PM SVANidhi:</strong> ₹10,000 to ₹50,000 working capital loan for street vendors and small traders with 7% interest subsidy. No collateral needed!
    `;
  }

  if (q.includes('health') || q.includes('hospital') || q.includes('ayushman') || q.includes('medical') || q.includes('treatment')) {
    return `
      🏥 <strong>Healthcare Protection:</strong><br>
      • <strong>Ayushman Bharat PM-JAY:</strong> Free cashless hospital treatment up to ₹5,00,000 per year for your family across 25,000+ empanelled government and private hospitals.<br>
      • Covers ICU, surgeries, diagnostics, and medicines.<br>
      💡 <em>Apply with your Ration Card and Aadhaar at any Common Service Centre (CSC) or nearby district hospital.</em>
    `;
  }

  if (q.includes('house') || q.includes('awas') || q.includes('home') || q.includes('makan')) {
    return `
      🏠 <strong>Affordable Housing Mission:</strong><br>
      • <strong>PM Awas Yojana (PMAY):</strong> Direct financial grant of ₹1.20 Lakh to ₹1.30 Lakhs for constructing a pucca house if you currently live in a kutcha home.<br>
      • Urban citizens get an interest subsidy of up to ₹1.80 Lakh on home loan repayments.
    `;
  }

  if (q.includes('artisan') || q.includes('carpenter') || q.includes('tailor') || q.includes('vishwakarma') || q.includes('craft')) {
    return `
      🛠️ <strong>PM Vishwakarma Scheme:</strong><br>
      • Free ₹15,000 e-voucher to buy modern professional toolkits.<br>
      • 5 days paid skill training (₹500/day allowance).<br>
      • Collateral-free loan of ₹1 Lakh (Phase 1) and ₹2 Lakhs (Phase 2) at only 5% interest rate.
    `;
  }

  // Fallback intelligent response matching current profile
  return `
    I analyzed your profile (Age: ${userProfile.age}, ${capitalize(userProfile.occupation)}, State: ${userProfile.state}, Income: ₹${userProfile.income.toLocaleString('en-IN')}).<br><br>
    Based on this, you qualify for <strong>${matchedSchemes.filter(s => s.isQualified).length} schemes</strong> right now! The top matched one is <strong>${matchedSchemes[0]?.title || 'PM-JAY'}</strong>.<br><br>
    Check the results panel on the left or tap <em>"Documents & Apply"</em> on any scheme card to see your personalized document checklist.
  `;
}

// Voice input simulation using Web Speech API
function toggleVoiceInput() {
  const voiceBtn = document.getElementById('voice-input-btn');
  const chatInput = document.getElementById('chat-input');
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser. Please type your query in the box!");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  voiceBtn.classList.add('bg-rose-500', 'text-white', 'animate-pulse');
  chatInput.placeholder = "Listening... Speak now...";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    voiceBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
    chatInput.placeholder = "Ask SchemeSathi anything...";
    sendUserMessage();
  };

  recognition.onerror = () => {
    voiceBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
    chatInput.placeholder = "Ask SchemeSathi anything...";
  };

  recognition.onend = () => {
    voiceBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
    chatInput.placeholder = "Ask SchemeSathi anything...";
  };

  recognition.start();
}

// Helper Utilities
function formatRupees(num) {
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)} Lakhs / year`;
  }
  return `₹${num.toLocaleString('en-IN')} / year`;
}

function capitalize(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
