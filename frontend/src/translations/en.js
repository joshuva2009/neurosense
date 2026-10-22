export const en = {
  // Brand & Tagline
  brandName: "NeuroSense",
  tagline: "Detect Early. Think Better. Live Healthier.",
  subTagline: "An accessible, AI-powered cognitive screening & neurological monitoring platform designed to empower early detection of brain health changes.",
  universityProjectTag: "University Design Thinking Project • Healthcare Innovation",
  
  // Navigation
  nav: {
    home: "Home",
    assessmentHub: "Screening Tests",
    dashboard: "Dashboard",
    analytics: "AI Report",
    disorders: "Brain Disorders",
    lifestyle: "Lifestyle & Sleep",
    doctorPrep: "Doctor Guidance",
    login: "Sign In",
    guestMode: "Guest Demo",
    logout: "Log Out"
  },

  // Hero Section
  hero: {
    badge: "AI-Powered Early Neurological Screening",
    titleStart: "Early Awareness for",
    titleHighlight: "Lifelong Brain Health",
    description: "Engage in 8 evidence-informed, interactive cognitive and motor screening activities. Identify early patterns in memory, attention, reaction latency, and motor control from the comfort of home.",
    startAssessment: "Start Brain Health Assessment",
    exploreBrain3D: "Inspect 3D Brain Anatomy",
    viewDemo: "Try Guest Assessment",
    activeUsers: "1,200+ Demo Assessments",
    clinicalDesign: "Evidence-Informed Design Thinking"
  },

  // 3D Brain Visualizer
  brain3D: {
    title: "Interactive 3D Brain Explorer",
    subtitle: "Click on different brain lobes to explore their primary cognitive functions and related screening modules.",
    rotateHint: "Click & drag to rotate • Click any glowing lobe to inspect",
    lobes: {
      frontal: {
        name: "Frontal Lobe",
        function: "Executive Function & Decision Making",
        description: "Controls planning, task switching, impulse control, and working memory.",
        associatedTests: "Cognitive Flexibility & Problem Solving"
      },
      temporal: {
        name: "Temporal Lobe & Hippocampus",
        function: "Memory Encoding & Language Comprehension",
        description: "Essential for forming new episodic memories, verbal recall, and auditory processing.",
        associatedTests: "Memory Recall & Language Fluency"
      },
      parietal: {
        name: "Parietal Lobe",
        function: "Spatial Attention & Sensory Integration",
        description: "Processes spatial navigation, attention filtering, and sensorimotor coordination.",
        associatedTests: "Attention & Concentration"
      },
      occipital: {
        name: "Occipital Lobe",
        function: "Visual Processing & Pattern Perception",
        description: "Decodes visual stimuli, shapes, depth, and spatial patterns.",
        associatedTests: "Visual Recognition & Reaction Time"
      },
      cerebellum: {
        name: "Cerebellum & Motor Strips",
        function: "Fine Motor Rhythm & Coordination",
        description: "Coordinates precise motor timing, rapid repetitive pacing, and balance.",
        associatedTests: "Finger Tapping Test"
      }
    }
  },

  // Why Early Screening Matters
  whyScreening: {
    title: "Why Early Neurological Screening Matters",
    subtitle: "Neurological conditions like Alzheimer's and Parkinson's develop silently for years before symptoms become debilitating. Timely screening changes lives.",
    cards: [
      {
        title: "The Therapeutic Window",
        description: "Modern disease-modifying therapies and lifestyle interventions are most effective during early or preclinical stages (e.g. Mild Cognitive Impairment).",
        icon: "ShieldAlert"
      },
      {
        title: "Longitudinal Trend Tracking",
        description: "A single test is just a snapshot. Tracking performance over weeks and months reveals subtle micro-changes that matter.",
        icon: "TrendingUp"
      },
      {
        title: "Empowering Medical Dialogue",
        description: "Objective digital screening data helps users and caregivers articulate precise observations during consultations with neurologists.",
        icon: "Stethoscope"
      },
      {
        title: "Proactive Brain Health",
        description: "Actionable lifestyle modifications in sleep, diet, aerobic exercise, and cognitive stimulation strengthen synaptic reserve.",
        icon: "Activity"
      }
    ]
  },

  // Tests Catalog
  tests: {
    catalogTitle: "Interactive Brain Screening Activities",
    catalogSubtitle: "Complete these 8 scientifically informed activities to evaluate your cognitive and fine motor profile.",
    overallProgress: "Assessment Battery Progress",
    completed: "Completed",
    notStarted: "Ready to Start",
    minutes: "min",
    startTest: "Start Test",
    retakeTest: "Retake Test",
    instructions: "Instructions",
    timeRemaining: "Time Remaining",
    score: "Score",
    accuracy: "Accuracy",
    reactionTime: "Latency",
    nextTest: "Next Activity",
    backToHub: "Return to Screening Hub",
    submitResults: "Submit & Save Result",

    memory: {
      name: "Memory Recall Test",
      domain: "Episodic Memory",
      lobe: "Temporal Lobe",
      summary: "Memorize target words and recall them following a brief retention delay.",
      step1: "Phase 1: Memorization. Observe the words presented on screen.",
      step2: "Phase 2: Brief delay. Take a breath while your brain consolidates the words.",
      step3: "Phase 3: Active Recall. Type or select all the words you can remember."
    },
    reaction: {
      name: "Reaction Time Test",
      domain: "Processing Speed",
      lobe: "Thalamus & Motor Pathways",
      summary: "Measure your sensorimotor response speed to visual stimuli across 5 trials.",
      waiting: "Wait for Green...",
      clickNow: "CLICK NOW!",
      tooEarly: "Too Early! Wait for the screen to turn green."
    },
    attention: {
      name: "Attention & Concentration Test",
      domain: "Sustained Attention",
      lobe: "Prefrontal & Parietal",
      summary: "Locate and tap target glowing neural symbols among distracting shapes in 30 seconds.",
      findSymbol: "Find and click all glowing cyan hexagons!"
    },
    flexibility: {
      name: "Cognitive Flexibility Test",
      domain: "Executive Function",
      lobe: "Dorsolateral Prefrontal",
      summary: "Trail Making Test: alternate between numbers and letters in sequence (1 -> A -> 2 -> B...).",
      nextTarget: "Next Target:"
    },
    tapping: {
      name: "Finger Tapping Motor Test",
      domain: "Fine Motor Speed",
      lobe: "Motor Cortex & Basal Ganglia",
      summary: "Tap the button or press Spacebar as rapidly and steadily as possible for 10 seconds.",
      tapHere: "TAP REPEATEDLY HERE (or press Space)",
      tapsCount: "Taps Count",
      hzRate: "Frequency (Hz)"
    },
    visual: {
      name: "Visual Recognition Test",
      domain: "Visuospatial Perception",
      lobe: "Occipital Cortex",
      summary: "Identify the matching pattern among 4 geometric matrix options.",
      selectMatch: "Select the identical geometric pattern:"
    },
    language: {
      name: "Language Fluency Test",
      domain: "Semantic Memory",
      lobe: "Left Temporal Lobe",
      summary: "Generate as many unique words as possible within the specified category in 30 seconds.",
      categoryPrompt: "Category: ANIMALS (e.g., lion, dolphin, elephant...)",
      typeAndEnter: "Type an animal name and press Enter..."
    },
    problem: {
      name: "Problem-Solving & Logic Test",
      domain: "Fluid Intelligence",
      lobe: "Frontoparietal Network",
      summary: "Deduce numerical and logical patterns to complete the sequence correctly.",
      question: "Question",
      of: "of"
    }
  },

  // AI Analysis & Results
  report: {
    title: "AI Brain Health Analysis & Report",
    subtitle: "Synthesized multi-domain cognitive evaluation and longitudinal insights.",
    downloadPDF: "Download Clinical Summary PDF",
    printReport: "Print Summary",
    compositeScore: "Overall Composite Index",
    vitality: "Cognitive Vitality",
    domainsTitle: "Cognitive Domain Breakdown",
    radarTitle: "Multi-Domain Cognitive Radar",
    longitudinalTitle: "Screening Performance Over Time",
    strengthsTitle: "Identified Cognitive Strengths",
    focusTitle: "Areas for Continued Observation",
    lifestyleRecommendations: "AI Lifestyle Recommendations for Neuroprotection",
    doctorPrepTitle: "Doctor Discussion Guide",
    disclaimerAlert: "EDUCATIONAL & DESIGN THINKING USE ONLY: NeuroSense results do not constitute a medical diagnosis. Variations occur naturally due to fatigue, stress, or caffeine. Consult a licensed physician for clinical concerns."
  },

  // Accessibility & Settings
  a11y: {
    title: "Accessibility Options",
    textSize: "Text Size",
    contrast: "High Contrast",
    readAloud: "Speech Narration",
    toggleDark: "Dark Mode",
    toggleLight: "Light Mode",
    language: "Language",
    fontSizeNormal: "Normal",
    fontSizeMedium: "Medium",
    fontSizeLarge: "Large",
    fontSizeXL: "Extra Large"
  },

  // Emergency Stroke
  emergency: {
    bannerText: "Experiencing sudden facial drooping, arm numbness, or speech difficulty?",
    actNow: "View F.A.S.T. Stroke Protocol",
    modalTitle: "🚨 Emergency Stroke Guidance (F.A.S.T.)",
    modalSubtitle: "Stroke is a medical emergency where brain cells lose oxygen rapidly. Immediate medical treatment saves lives.",
    callNow: "CALL EMERGENCY SERVICES (911 / 108 / 112) NOW",
    f: "FACE: Ask the person to smile. Does one side of their face droop or seem numb?",
    a: "ARMS: Ask the person to raise both arms. Does one arm drift downward or feel weak?",
    s: "SPEECH: Ask the person to repeat a simple sentence. Is their speech slurred or strange?",
    t: "TIME: If you observe ANY of these signs, call emergency medical services immediately."
  },

  // Design Thinking Badge
  designThinking: {
    title: "University Design Thinking Project",
    badge: "Design Thinking Framework",
    stage1: "1. Empathize: Researched barriers in elderly cognitive screening & patient anxiety.",
    stage2: "2. Define: Identified lack of accessible, non-threatening digital baseline tracking.",
    stage3: "3. Ideate: Conceived a gamified, multi-modal 8-test battery with transparent AI feedback.",
    stage4: "4. Prototype: Built React + FastAPI interactive platform with dual-language support.",
    stage5: "5. Test: Evaluated usability, font scaling, and non-diagnostic medical safety."
  },

  // Chatbot
  chat: {
    title: "NeuroBot AI Health Assistant",
    subtitle: "Educational AI companion for brain health questions & test guidance.",
    inputPlaceholder: "Ask about brain health, test scores, Alzheimer's, sleep...",
    send: "Send",
    disclaimer: "NeuroBot is an educational assistant, not a doctor. In an emergency, call emergency medical services immediately."
  }
};
