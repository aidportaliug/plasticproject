    let plasticData = null;
    let quizSteps = null;
    let currentStep = 'fresh-water';
    let history = [];
    let currentResult = null;
    let firstChoice = null; // 'float' or 'sink' from fresh water

    async function init() {
      if (!plasticData || !quizSteps) {
        try {
          const [plasticRes, quizRes] = await Promise.all([
            fetch('plasticData.json'),
            fetch('quizSteps.json')
          ]);
          plasticData = await plasticRes.json();
          quizSteps = await quizRes.json();
        } catch (error) {
          console.error("Failed to load JSON data:", error);
          document.getElementById('quizContent').innerHTML = "<p>Error loading quiz data. Please ensure you are running this via a local web server (like python3 -m http.server).</p>";
          return;
        }
      }

      currentStep = 'fresh-water';
      history = [];
      currentResult = null;
      firstChoice = null;
      renderQuiz();

      // Clear category highlights
      document.querySelectorAll('.plastic-cat-btn').forEach(btn => btn.classList.remove('active', 'highlight'));
    }

    function renderQuiz() {
      const container = document.getElementById('quizContent');

      if (currentResult) {
        container.innerHTML = renderResultCardHTML(currentResult);
        return;
      }

      const step = quizSteps[currentStep];
      if (!step) return;

      container.innerHTML = `
        <div class="quiz-card">
          <h2 class="quiz-instruction">${step.instruction}</h2>
          ${step.hint ? `<p class="quiz-hint">${step.hint}</p>` : '<div style="height:20px"></div>'}
          <div class="quiz-buttons">
            <button class="quiz-btn quiz-btn-float" onclick="quizChoice('float')">Float</button>
            <button class="quiz-btn quiz-btn-sink" onclick="quizChoice('sink')">Sink</button>
          </div>
        </div>
      `;
    }

    function quizChoice(choice) {
      makeChoice(choice);
      renderQuiz();
    }


    function makeChoice(choice) {
      const step = quizSteps[currentStep];
      if (!step) return;

      if (currentStep === 'fresh-water') {
        firstChoice = choice;
      }

      history.push({ step: currentStep, choice });

      const next = step[choice];

      if (typeof next === 'string') {
        // Go to next step
        currentStep = next;
        currentResult = null;
      } else if (next && next.result) {
        // Reached result
        if (next.result === 'PVC_PET') {
          currentResult = 'PVC_PET';
        } else {
          currentResult = next.result;
        }

        // Highlight category button
        highlightCategoryBtn(currentResult);
      }
    }

    function highlightCategoryBtn(result) {
      document.querySelectorAll('.plastic-cat-btn').forEach(btn => btn.classList.remove('active', 'highlight'));

      if (result === 'PVC_PET') {
        const pvcBtn = document.querySelector('[data-plastic="PVC"]');
        const petBtn = document.querySelector('[data-plastic="PET"]');
        if (pvcBtn) { pvcBtn.classList.add('active', 'highlight'); }
        if (petBtn) { petBtn.classList.add('active', 'highlight'); }
      } else {
        const btn = document.querySelector(`[data-plastic="${result}"]`);
        if (btn) { btn.classList.add('active', 'highlight'); }
      }
    }

    // Wikipedia links for each plastic type
    const wikiLinks = {
      PET: 'https://en.wikipedia.org/wiki/Polyethylene_terephthalate',
      HDPE: 'https://en.wikipedia.org/wiki/High-density_polyethylene',
      PVC: 'https://en.wikipedia.org/wiki/Polyvinyl_chloride',
      LDPE: 'https://en.wikipedia.org/wiki/Low-density_polyethylene',
      PP: 'https://en.wikipedia.org/wiki/Polypropylene',
      PS: 'https://en.wikipedia.org/wiki/Polystyrene'
    };

    function renderResultCardHTML(result) {
      if (result === 'PVC_PET') {
        return `
          <div class="result-card">
            <div class="result-badge">?</div>
            <div class="result-number">3 or 1</div>
            <div class="result-name">PVC or PET</div>
            <div class="result-fullname">Polyvinyl Chloride or Polyethylene Terephthalate</div>
            <p class="result-description">
              Your plastic sank in both fresh water and salt water. This means it is likely either PVC or PET.
              Both are dense plastics. To distinguish between them, you may need additional tests such as
              a flame test or checking for recycling markings on the item.
            </p>
            <div class="result-actions">
              <a class="btn-learn-more" href="${wikiLinks.PVC}" target="_blank">
                Learn more about PVC →
              </a>
              <a class="btn-learn-more" href="${wikiLinks.PET}" target="_blank">
                Learn more about PET →
              </a>
            </div>
            <div class="result-actions mt-16">
              <button class="btn-start-over" onclick="init()">
              Start over
              </button>
            </div>
          </div>
        `;
      }

      const data = plasticData[result];
      if (!data) return '';

      const link = wikiLinks[data.code];
      const learnMoreHTML = link
        ? `<a class="btn-learn-more" href="${link}" target="_blank">Learn more about ${data.code} →</a>`
        : `<button class="btn-learn-more" onclick="showPlasticInfo('${data.code}')">Learn more about ${data.code} →</button>`;

      return `
        <div class="result-card">
          <div class="result-badge">${data.number}</div>
          <div class="result-number">${data.number} ${data.code}</div>
          <div class="result-name">${data.code}</div>
          <div class="result-fullname">${data.name}</div>
          <p class="result-description">${data.shortDesc}</p>
          <div class="result-actions">
            ${learnMoreHTML}
            <button class="btn-start-over" onclick="init()">
              Start over
            </button>
          </div>
        </div>
      `;
    }


    function showPlasticInfo(code) {
      // For non-OTHER plastics, redirect to Wikipedia
      if (code !== 'OTHER' && wikiLinks[code]) {
        window.open(wikiLinks[code], '_blank');
        return;
      }

      const data = plasticData[code];
      if (!data) return;

      const panel = document.getElementById('plasticInfoContent');

      let recyclabilityColor = '#3D7844';
      if (data.recyclability === 'Very Low' || data.recyclability === 'Low') {
        recyclabilityColor = '#c0392b';
      } else if (data.recyclability === 'Moderate') {
        recyclabilityColor = '#e67e22';
      }

      panel.innerHTML = `
        <div class="info-header">
          <div class="info-badge">7</div>
          <div class="info-title-group">
            <h2>OTHER</h2>
            <p>Plastic identification number: 7</p>
          </div>
        </div>

        <div class="info-section">
          <p>Includes all plastics that do not fit into categories 1–6.</p>
        </div>

        <div class="info-section">
          <p>Check packaging for instructions or contact us at: <a href="https://iug.no/kontakt-oss" target="_blank" style="color: var(--iug-green); font-weight: 600;">iug.no/kontakt-oss</a></p>
        </div>

        <div class="info-section">
          <p>You can contact Trondheim Renholdsverk directly with sorting questions:</p>
          <ul>
            <li>Email: <a href="mailto:kildesortering@trv.no" style="color: var(--iug-green); font-weight: 600;">kildesortering@trv.no</a><br><span style="font-size: 12px; color: #666;">(This specific email is dedicated to source-sorting and recycling questions)</span></li>
          </ul>
        </div>

        <div class="info-section">
          <h3>National Digital Guide</h3>
          <p>If you want to reach out to the team behind the national sorting platform:</p>
          <ul>
            <li>Email: <a href="mailto:post@sortere.no" style="color: var(--iug-green); font-weight: 600;">post@sortere.no</a></li>
          </ul>
        </div>
      `;

      document.getElementById('plasticInfoOverlay').classList.add('visible');
      document.body.style.overflow = 'hidden';
    }

    function closePlasticInfo() {
      document.getElementById('plasticInfoOverlay').classList.remove('visible');
      document.body.style.overflow = '';
    }

    function closeInfoOverlay(e) {
      if (e.target === document.getElementById('plasticInfoOverlay')) {
        closePlasticInfo();
      }
    }

    document.getElementById('mobileMenuBtn').addEventListener('click', function() {
      document.getElementById('mainNav').classList.toggle('open');
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closePlasticInfo();
      }
    });


    init();
