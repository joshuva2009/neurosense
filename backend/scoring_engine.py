import json
import statistics
from typing import Dict, Any, List

# Brain lobe mappings and scientific rationale for each cognitive test
TEST_METRICS_INFO = {
    "memory_recall": {
        "name": "Memory Recall Test",
        "domain": "Episodic & Short-term Memory",
        "lobe": "Temporal Lobe & Hippocampus",
        "description": "Evaluates short-term verbal encoding, storage, and delayed retrieval mechanisms.",
        "scientific_basis": "Hippocampal atrophy and cholinergic pathway disruption in early Alzheimer's typically manifest as rapid forgetting of recently presented information.",
        "norm_range": "70 - 100"
    },
    "reaction_time": {
        "name": "Reaction Time Test",
        "domain": "Processing Speed & Sensorimotor Reflex",
        "lobe": "Frontal Cortex, Thalamus & Visual Pathways",
        "description": "Measures simple visual processing speed and transmission latency from visual stimulus to motor execution.",
        "scientific_basis": "Sluggish reaction times can reflect subcortical processing delays, vascular microstructural changes, or general neural transmission slowing.",
        "norm_range": "220ms - 380ms"
    },
    "attention_concentration": {
        "name": "Attention & Concentration Test",
        "domain": "Sustained & Selective Attention",
        "lobe": "Prefrontal Cortex & Parietal Lobe",
        "description": "Assesses the ability to focus on designated targets while filtering out distracting sensory noise.",
        "scientific_basis": "Executive control networks in the dorsolateral prefrontal cortex mediate concentration; vulnerability to distractibility often precedes overt memory loss.",
        "norm_range": "75 - 100"
    },
    "cognitive_flexibility": {
        "name": "Cognitive Flexibility Test (Trail Making)",
        "domain": "Executive Function & Task Switching",
        "lobe": "Dorsolateral Prefrontal Cortex",
        "description": "Evaluates mental agility, alternating attention, and working memory manipulation.",
        "scientific_basis": "Set-shifting deficits are hallmark indicators of frontostriatal dysfunction, common in early vascular cognitive impairment and subcortical disorders.",
        "norm_range": "65 - 95"
    },
    "finger_tapping": {
        "name": "Finger Tapping Motor Test",
        "domain": "Fine Motor Control & Movement Regularity",
        "lobe": "Motor Cortex, Basal Ganglia & Cerebellum",
        "description": "Quantifies rapid repetitive motor pacing and inter-tap interval rhythm stability.",
        "scientific_basis": "Motor slowing (bradykinesia) and increased tapping interval variability are sensitive markers for extrapyramidal and basal ganglia neurochemical changes (e.g., dopaminergic pathway changes in Parkinson's).",
        "norm_range": "45 - 65 taps / 10s"
    },
    "visual_recognition": {
        "name": "Visual Recognition Test",
        "domain": "Visuospatial Perception & Pattern Matching",
        "lobe": "Occipital & Posterior Parietal Lobes",
        "description": "Tests spatial orientation, geometric reasoning, and non-verbal pattern discrimination.",
        "scientific_basis": "Visuoperceptual and spatial distortions frequently occur in Lewy body spectrum disorders and posterior cortical atrophy.",
        "norm_range": "70 - 100"
    },
    "language_fluency": {
        "name": "Language Fluency Test",
        "domain": "Semantic Memory & Verbal Retrieval",
        "lobe": "Left Temporal Lobe & Broca's/Wernicke's Areas",
        "description": "Assesses lexical search, semantic association networks, and spontaneous word generation.",
        "scientific_basis": "Category fluency relies on semantic storage in the temporal neocortex; degradation of semantic networks can cause word-finding difficulties in mild cognitive decline.",
        "norm_range": "8 - 18 words / 30s"
    },
    "problem_solving": {
        "name": "Problem-Solving & Logic Test",
        "domain": "Fluid Intelligence & Deductive Reasoning",
        "lobe": "Frontoparietal Reasoning Network",
        "description": "Examines abstract rule deduction, sequential logic, and novel problem resolution.",
        "scientific_basis": "Fluid reasoning reflects overall cortical integrity and neural efficiency across distributed frontoparietal networks.",
        "norm_range": "70 - 100"
    }
}

def normalize_test_score(test_type: str, raw_score: float, details: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Standardize raw test data into a normalized score between 0 and 100,
    along with accuracy and latency indicators.
    """
    details = details or {}
    normalized = 50.0
    accuracy = details.get("accuracy", 100.0)
    rt = details.get("reaction_time_ms", None)

    if test_type == "memory_recall":
        # raw_score is count of correct recalled items out of total (e.g. 8 items)
        total = details.get("total_items", 8)
        ratio = max(0.0, min(1.0, raw_score / max(1, total)))
        normalized = round(ratio * 100, 1)
        accuracy = normalized

    elif test_type == "reaction_time":
        # raw_score is average response time in milliseconds
        # 180ms or below is 100. 600ms or higher is 35.
        ms = float(raw_score)
        if ms <= 180:
            normalized = 100.0
        elif ms >= 650:
            normalized = 35.0
        else:
            # Linear interpolation between 180ms (100) and 650ms (35)
            normalized = round(100.0 - ((ms - 180.0) / (650.0 - 180.0)) * 65.0, 1)
        rt = ms

    elif test_type == "attention_concentration":
        # based on hits, false alarms, and completion speed
        total_targets = details.get("total_targets", 15)
        hits = raw_score
        false_alarms = details.get("false_alarms", 0)
        net_correct = max(0, hits - (false_alarms * 0.5))
        acc = (net_correct / max(1, total_targets)) * 100
        normalized = round(min(100.0, max(15.0, acc)), 1)
        accuracy = normalized

    elif test_type == "cognitive_flexibility":
        # Trail making: time taken (seconds) and errors
        time_taken = float(raw_score) # seconds
        errors = details.get("errors", 0)
        # 15s or less = 100, 60s or more = 40
        time_score = 100.0 - (min(45.0, max(0.0, time_taken - 15.0)) / 45.0) * 50.0
        error_penalty = errors * 7.5
        normalized = round(max(20.0, min(100.0, time_score - error_penalty)), 1)
        accuracy = round(max(0.0, 100.0 - (errors * 15.0)), 1)

    elif test_type == "finger_tapping":
        # raw_score is tap count in 10s. Norm is 45-65 taps.
        taps = float(raw_score)
        rhythm_cv = details.get("interval_cv", 0.15) # coefficient of variation in ms
        # Tap rate score
        if taps >= 55:
            rate_score = 95.0 + min(5.0, (taps - 55) * 0.5)
        elif taps >= 40:
            rate_score = 80.0 + ((taps - 40) / 15.0) * 15.0
        elif taps >= 25:
            rate_score = 60.0 + ((taps - 25) / 15.0) * 20.0
        else:
            rate_score = max(25.0, taps * 2.4)
        
        # Rhythm consistency penalty if rhythm jitter is high (> 0.25)
        rhythm_bonus = max(-20.0, (0.20 - rhythm_cv) * 50)
        normalized = round(max(20.0, min(100.0, rate_score + rhythm_bonus)), 1)
        accuracy = round(max(30.0, min(100.0, 100 - (rhythm_cv * 150))), 1)

    elif test_type == "visual_recognition":
        # raw_score is correct matches out of total
        total = details.get("total_trials", 6)
        ratio = max(0.0, min(1.0, raw_score / max(1, total)))
        normalized = round(ratio * 100, 1)
        accuracy = normalized

    elif test_type == "language_fluency":
        # raw_score is valid unique words generated in 30s
        words = float(raw_score)
        # 14+ words = 100, 10 words = 85, 7 words = 70, 4 words = 50
        if words >= 14:
            normalized = 100.0
        elif words >= 10:
            normalized = 85.0 + ((words - 10) / 4.0) * 15.0
        elif words >= 6:
            normalized = 65.0 + ((words - 6) / 4.0) * 20.0
        else:
            normalized = max(20.0, words * 10.0)
        normalized = round(normalized, 1)
        accuracy = round(min(100.0, words * 7.5), 1)

    elif test_type == "problem_solving":
        # correct logic puzzles out of total (e.g. 5 puzzles)
        total = details.get("total_puzzles", 5)
        ratio = max(0.0, min(1.0, raw_score / max(1, total)))
        normalized = round(ratio * 100, 1)
        accuracy = normalized

    return {
        "normalized_score": normalized,
        "accuracy": accuracy,
        "reaction_time_ms": rt
    }

def synthesize_cognitive_profile(test_results: List[Dict[str, Any]], user_profile: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Synthesize all completed tests into 6 core cognitive domains, calculate composite brain health index,
    and generate personalized, scientifically responsible educational feedback.
    """
    results_map = {r["test_type"]: r for r in test_results}
    
    # Domain mappings
    domains = {
        "memory": {
            "name": "Memory & Recall",
            "score": 0.0,
            "tests_included": ["memory_recall"],
            "description": "Short-term storage, semantic consolidation, and retrieval efficiency.",
            "lobe": "Temporal Lobe & Hippocampus"
        },
        "executive": {
            "name": "Executive Function",
            "score": 0.0,
            "tests_included": ["cognitive_flexibility", "problem_solving"],
            "description": "Mental flexibility, rule switching, planning, and deductive logic.",
            "lobe": "Frontal & Prefrontal Cortex"
        },
        "attention": {
            "name": "Attention & Concentration",
            "score": 0.0,
            "tests_included": ["attention_concentration"],
            "description": "Target detection amidst distractors and sustained focus maintenance.",
            "lobe": "Parietal & Prefrontal Networks"
        },
        "speed": {
            "name": "Processing Speed",
            "score": 0.0,
            "tests_included": ["reaction_time"],
            "description": "Visual sensory perception, central decision latency, and motor response time.",
            "lobe": "Visual Cortex, Thalamus & Corticospinal Tract"
        },
        "motor": {
            "name": "Motor Coordination",
            "score": 0.0,
            "tests_included": ["finger_tapping"],
            "description": "Fine motor rhythm, finger pacing stability, and basal ganglia coordination.",
            "lobe": "Primary Motor Strip & Basal Ganglia"
        },
        "language": {
            "name": "Language & Verbal Fluency",
            "score": 0.0,
            "tests_included": ["language_fluency"],
            "description": "Spontaneous lexical search, semantic association, and verbal recall.",
            "lobe": "Left Perisylvian Language Cortex"
        }
    }

    # Compute domain averages based on available tests
    domain_scores = []
    for d_key, d_info in domains.items():
        matched_scores = [
            results_map[t]["normalized_score"] 
            for t in d_info["tests_included"] 
            if t in results_map
        ]
        if matched_scores:
            d_info["score"] = round(statistics.mean(matched_scores), 1)
            domain_scores.append(d_info["score"])
        else:
            # Baseline placeholder if test not yet taken in this partial session
            d_info["score"] = 75.0

    overall_composite = round(statistics.mean(domain_scores) if domain_scores else 78.0, 1)

    # Determine functional performance category
    if overall_composite >= 85:
        performance_tier = "High Cognitive Vitality"
        tier_color = "emerald"
        tier_summary = "Your responses demonstrate robust cognitive processing speed, high working memory retention, and steady motor coordination."
    elif overall_composite >= 70:
        performance_tier = "Healthy Baseline Range"
        tier_color = "teal"
        tier_summary = "Performance falls comfortably within expected normative adult baseline levels across the completed cognitive modules."
    elif overall_composite >= 55:
        performance_tier = "Mild Fluctuation Observed"
        tier_color = "amber"
        tier_summary = "Certain tasks showed mild reaction delays or attentional fluctuations. Transient factors like fatigue, lack of sleep, or test unfamiliarity can influence these results."
    else:
        performance_tier = "Notable Variation - Follow-Up Recommended"
        tier_color = "rose"
        tier_summary = "Performance across multiple domains deviated from standard baseline parameters. Tracking trends over time and discussing with a healthcare professional can provide valuable clarity."

    # Identify strongest and focus domains
    sorted_domains = sorted(domains.items(), key=lambda x: x[1]["score"], reverse=True)
    strongest = sorted_domains[0][1]
    focus_domain = sorted_domains[-1][1]

    # Generate personalized lifestyle recommendations
    recommendations = [
        {
            "category": "Sleep & Glymphatic Clearance",
            "icon": "Moon",
            "tip": "Aim for 7-8 hours of regular, restorative sleep. Deep slow-wave sleep activates the glymphatic system to clear metabolic waste, including beta-amyloid proteins, from neural tissue."
        },
        {
            "category": "Aerobic Exercise & Neurogenesis",
            "icon": "Activity",
            "tip": "Engage in 150 minutes of moderate aerobic exercise weekly. Physical movement stimulates Brain-Derived Neurotrophic Factor (BDNF), supporting neuroplasticity and hippocampal cell growth."
        },
        {
            "category": "Cognitive Reserve Building",
            "icon": "Brain",
            "tip": "Challenge your brain with novel tasks—learn a new language, practice an instrument, or solve unfamiliar logic puzzles to strengthen alternative synaptic pathways."
        },
        {
            "category": "Cardiovascular & Nutritional Health",
            "icon": "Heart",
            "tip": "Adopt elements of the MIND or Mediterranean diet rich in leafy greens, berries, omega-3 fatty acids, and extra virgin olive oil to safeguard cerebral microvasculature."
        }
    ]

    # Medical Safety & Non-Diagnostic Disclaimer
    safety_disclaimer = (
        "IMPORTANT EDUCATIONAL DISCLAIMER: NeuroSense is an interactive university Design Thinking "
        "screening demonstration. It does not provide clinical diagnoses, risk percentages, or medical certainty. "
        "Performance on digital screening tasks is subject to fatigue, ambient distractions, screen ergonomics, and mood. "
        "These activities cannot confirm or rule out Alzheimer's disease, Parkinson's disease, or any neurological condition. "
        "If you have concerns about memory, movement, or cognition, always seek evaluation from a licensed physician or neurologist."
    )

    return {
        "overall_composite": overall_composite,
        "performance_tier": performance_tier,
        "tier_color": tier_color,
        "tier_summary": tier_summary,
        "domains": domains,
        "strongest_domain": strongest["name"],
        "focus_domain": focus_domain["name"],
        "recommendations": recommendations,
        "safety_disclaimer": safety_disclaimer,
        "total_tests_completed": len(test_results)
    }
