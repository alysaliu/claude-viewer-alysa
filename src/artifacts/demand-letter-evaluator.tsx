import React, { useState, useEffect } from 'react';
import { Play, Pause, X, ChevronDown, CheckCircle, XCircle, AlertTriangle, Clock, FileText, Filter, User, Flag, Check, MessageSquare, ChevronRight, Eye, Download, RotateCcw, Copy, Edit2, Save } from 'lucide-react';
import { DEMAND_LETTER_PROMPTS, CASE_TYPE_DATASETS, MODIFIERS, AVAILABLE_MODELS, COMPARISON_TYPES } from './demand_letter_evaluator/demand-letter-prompts.js';

// Demand Letter Sections
const SECTIONS = [
  'Introduction & Liability Statement',
  'Incident Facts',
  'Medical Summary',
  'Damages & Financial Losses',
  'Settlement Demand',
  'Closing & Signature'
];

// Test cases with section-specific ground truth
const testCases = [
  {
    id: 1,
    name: "No Major Procedures Case",
    sections: {
      "Medical Summary": {
        groundTruth: {
          required: ["conservative treatment", "no surgical intervention"],
          forbidden: ["surgery", "operation", "fusion", "procedure"]
        },
        medicalRecords: "Patient presented with neck pain following MVA. MRI shows soft tissue damage. Prescribed physical therapy 2x weekly and pain medication. No surgical intervention required."
      }
    }
  },
  {
    id: 2,
    name: "Spinal Fusion Surgery",
    sections: {
      "Medical Summary": {
        groundTruth: {
          required: ["L4-L5 spinal fusion", "revision surgery", "hardware complications"],
          forbidden: ["cardiac", "brain", "knee"]
        },
        medicalRecords: "Patient underwent L4-L5 spinal fusion on 3/15/24. Revision surgery required on 4/2/24 due to hardware complications. Currently in post-op PT."
      }
    }
  },
  {
    id: 3,
    name: "Multiple Injuries",
    sections: {
      "Medical Summary": {
        groundTruth: {
          required: ["ORIF left femur", "arthroscopic knee surgery", "concussion"],
          forbidden: ["spinal", "cardiac"]
        },
        medicalRecords: "Multi-trauma from MVA. Emergency ORIF for left femur fracture. Subsequent arthroscopic surgery for torn meniscus. Mild concussion resolved with cognitive therapy."
      }
    }
  },
  {
    id: 4,
    name: "Conservative Treatment Only",
    sections: {
      "Medical Summary": {
        groundTruth: {
          required: ["chiropractic care", "massage therapy", "full recovery"],
          forbidden: ["surgery", "injection", "procedure", "operation"]
        },
        medicalRecords: "Lower back pain following lifting injury. X-rays negative. Treated with chiropractic adjustments, therapeutic massage, and anti-inflammatories. Full recovery in 8 weeks."
      }
    }
  },
  {
    id: 5,
    name: "Missing Dates Edge Case",
    sections: {
      "Medical Summary": {
        groundTruth: {
          required: ["arthroscopic shoulder surgery", "date unclear"],
          forbidden: ["spine", "knee", "hip"]
        },
        medicalRecords: "Patient reports shoulder pain. MRI confirms rotator cuff tear. Arthroscopic repair performed (date unclear). Currently in PT."
      }
    }
  }
];

// Generate evaluation result for a test case
const generateEvaluation = (testCase, section, promptVersion) => {
  const sectionData = testCase.sections[section];
  if (!sectionData) return null;
  
  const isOriginal = promptVersion === 'original';
  const { required, forbidden } = sectionData.groundTruth;
  
  // Simulate different outputs based on prompt version
  let generatedOutput = '';
  let hasHallucination = false;
  let missingRequired = [];
  let foundForbidden = [];
  
  if (section === 'Medical Summary') {
    if (isOriginal && forbidden.includes('surgery') && testCase.name.includes('No Major')) {
      // Original prompt hallucinates surgery when there is none
      generatedOutput = "Patient underwent multiple surgeries including spinal fusion...";
      hasHallucination = true;
      foundForbidden = ['surgery'];
    } else if (isOriginal && testCase.name.includes('Conservative')) {
      generatedOutput = "Patient received injection therapy and minor surgical intervention...";
      hasHallucination = true;
      foundForbidden = ['injection', 'surgical'];
    } else if (!isOriginal) {
      // Modified prompt handles edge cases better
      if (forbidden.includes('surgery')) {
        generatedOutput = "Medical records indicate conservative treatment only. No surgical procedures documented.";
      } else {
        generatedOutput = `Patient underwent ${required.join(', ')}.`;
      }
    } else {
      generatedOutput = `Treatment included ${required.slice(0, 2).join(', ')}.`;
      if (Math.random() > 0.7) {
        missingRequired = [required[required.length - 1]];
      }
    }
  }
  
  // Check for missing required elements
  required.forEach(element => {
    if (!generatedOutput.toLowerCase().includes(element.toLowerCase()) && !missingRequired.includes(element)) {
      missingRequired.push(element);
    }
  });
  
  const aiPass = !hasHallucination && missingRequired.length === 0;
  const aiConfidence = hasHallucination ? 0.95 : (missingRequired.length > 0 ? 0.8 : 0.9);
  
  return {
    caseId: testCase.id,
    caseName: testCase.name,
    section,
    generatedOutput,
    aiPass,
    aiConfidence,
    hallucinations: foundForbidden,
    omissions: missingRequired,
    humanReview: null,
    flagged: false,
    reviewNotes: ''
  };
};

const DemandLetterEvaluator = () => {
  // State management
  const [selectedSection, setSelectedSection] = useState('Medical Summary');
  const [selectedCaseTypes, setSelectedCaseTypes] = useState(() => {
    const initial = {};
    Object.keys(CASE_TYPE_DATASETS).forEach(key => {
      initial[key] = CASE_TYPE_DATASETS[key].selected;
    });
    return initial;
  });
  const [modifiers, setModifiers] = useState(() => {
    const initial = {};
    Object.keys(MODIFIERS).forEach(key => {
      initial[key] = MODIFIERS[key].defaultValue;
    });
    return initial;
  });
  
  // Evaluation comparison configuration
  const [comparisonTypes, setComparisonTypes] = useState({
    changeModel: false,
    changePrompt: true // Default to prompt comparison
  });
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [modelParams, setModelParams] = useState(() => {
    const initial = {};
    Object.entries(AVAILABLE_MODELS).forEach(([key, model]) => {
      initial[key] = { ...model.advancedParams };
    });
    return initial;
  });
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);
  const [isResultsSummaryCollapsed, setIsResultsSummaryCollapsed] = useState(true);
  
  // Calculate total test cases using actual case counts
  const calculateTotalTestCases = () => {
    const selectedCaseTypeKeys = Object.entries(selectedCaseTypes)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key);
    
    const onlyModifier = Object.entries(modifiers).find(([_, value]) => value === 'only');
    const excludedModifiers = Object.entries(modifiers).filter(([_, value]) => value === 'exclude');
    
    let totalCases = 0;
    if (selectedCaseTypeKeys.length > 0) {
      if (onlyModifier) {
        // Only modifier: 2 cases per case type
        totalCases = selectedCaseTypeKeys.length * 2;
      } else {
        // Start with actual case counts from dataset
        totalCases = selectedCaseTypeKeys.reduce((sum, key) => {
          return sum + (CASE_TYPE_DATASETS[key]?.caseCount || 0);
        }, 0);
        
        // Subtract for excluded modifiers
        if (excludedModifiers.some(([key, _]) => key === 'edgeCases')) {
          totalCases -= selectedCaseTypeKeys.length * 2;
        }
        if (excludedModifiers.some(([key, _]) => key === 'flaggedCases')) {
          totalCases -= selectedCaseTypeKeys.length * 2;
        }
      }
    }
    return totalCases;
  };
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  // Evaluation results
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, details, review-queue, edge-cases
  const [selectedCase, setSelectedCase] = useState(null);
  const [reviewerActions, setReviewerActions] = useState({
    approved: 0,
    rejected: 0,
    flagged: 0
  });
  
  // Prompts - loaded from external configuration
  const [originalPrompt, setOriginalPrompt] = useState(
    DEMAND_LETTER_PROMPTS[selectedSection]?.original || "Extract medical procedures and treatments from the records."
  );
  const [modifiedPrompt, setModifiedPrompt] = useState(
    DEMAND_LETTER_PROMPTS[selectedSection]?.modified || "Extract medical procedures and treatments if present. If no major procedures found, explicitly state 'No surgical procedures documented.' Always note if treatment dates are unclear."
  );
  
  // Update prompts when section changes
  useEffect(() => {
    if (DEMAND_LETTER_PROMPTS[selectedSection]) {
      setOriginalPrompt(DEMAND_LETTER_PROMPTS[selectedSection].original);
      setModifiedPrompt(DEMAND_LETTER_PROMPTS[selectedSection].modified);
    }
  }, [selectedSection]);
  
  // Run evaluation
  const runEvaluation = async () => {
    setIsRunning(true);
    setProgress({ current: 0, total: testCases.length });
    setCurrentStage('Generating Outputs');
    
    const results = {
      original: [],
      modified: [],
      timestamp: new Date().toISOString()
    };
    
    // Filter test cases based on configuration
    let casesToRun = testCases;
    
    // Apply modifier filtering logic
    const onlyModifier = Object.entries(modifiers).find(([_, value]) => value === 'only');
    
    if (onlyModifier) {
      // If any modifier is set to "only", show only those cases
      const [modifierKey] = onlyModifier;
      if (modifierKey === 'flaggedCases') {
        casesToRun = casesToRun.filter(c => c.flagged || c.name.includes('Flagged'));
      } else if (modifierKey === 'edgeCases') {
        casesToRun = casesToRun.filter(c => c.name.includes('Edge Case') || c.name.includes('Missing Dates'));
      }
    } else {
      // Apply include/exclude logic for each modifier
      if (modifiers.edgeCases === 'exclude') {
        casesToRun = casesToRun.filter(c => !c.name.includes('Edge Case') && !c.name.includes('Missing Dates'));
      }
      if (modifiers.flaggedCases === 'exclude') {
        casesToRun = casesToRun.filter(c => !c.flagged && !c.name.includes('Flagged'));
      }
    }
    
    // Stage 1: Generate outputs
    for (let i = 0; i < casesToRun.length; i++) {
      if (isPaused) {
        await new Promise(resolve => {
          const interval = setInterval(() => {
            if (!isPaused) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }
      
      setProgress({ current: i + 1, total: casesToRun.length });
      
      const testCase = casesToRun[i];
      const originalResult = generateEvaluation(testCase, selectedSection, 'original');
      const modifiedResult = generateEvaluation(testCase, selectedSection, 'modified');
      
      if (originalResult) results.original.push(originalResult);
      if (modifiedResult) results.modified.push(modifiedResult);
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Stage 2: AI Evaluation
    setCurrentStage('AI Evaluation');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Stage 3: Prepare review queue
    setCurrentStage('Preparing Review Queue');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEvaluationResults(results);
    setIsRunning(false);
    setCurrentStage('');
  };
  
  // Calculate statistics
  const getStats = (results) => {
    if (!results || results.length === 0) return {
      passCount: 0,
      passRate: 0,
      failCount: 0,
      hallucinations: 0,
      omissions: 0,
      flaggedCount: 0
    };
    
    const passCount = results.filter(r => {
      // If human reviewed, use human decision, otherwise use AI
      if (r.humanReview === 'approved' && r.aiPass) return true;
      if (r.humanReview === 'rejected') return !r.aiPass;
      return r.aiPass;
    }).length;
    
    const failCount = results.length - passCount;
    const hallucinations = results.filter(r => r.hallucinations.length > 0).length;
    const omissions = results.filter(r => r.omissions.length > 0).length;
    const flaggedCount = results.filter(r => r.flagged).length;
    
    return {
      passCount,
      passRate: Math.round((passCount / results.length) * 100),
      failCount,
      hallucinations,
      omissions,
      flaggedCount
    };
  };
  
  // Handle human review actions
  const handleReviewAction = (caseId, version, action) => {
    setEvaluationResults(prev => {
      const newResults = { ...prev };
      const targetArray = version === 'original' ? newResults.original : newResults.modified;
      const caseIndex = targetArray.findIndex(r => r.caseId === caseId);
      
      if (caseIndex !== -1) {
        targetArray[caseIndex].humanReview = action;
        
        if (action === 'flagged') {
          targetArray[caseIndex].flagged = true;
        }
        
        // Update reviewer action counts
        setReviewerActions(prev => ({
          ...prev,
          [action]: prev[action] + 1
        }));
      }
      
      return newResults;
    });
  };
  
  // Progress Display Component - Integrated into same page
  const ProgressDisplay = () => {
    const originalStats = evaluationResults ? getStats(evaluationResults.original) : null;
    const modifiedStats = evaluationResults ? getStats(evaluationResults.modified) : null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Evaluation Progress — {selectedSection}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {Object.values(selectedCaseTypes).filter(Boolean).length} case type(s) selected | 
          {Object.entries(modifiers).find(([_, value]) => value === 'only') ? 
            'Only: ' + MODIFIERS[Object.entries(modifiers).find(([_, value]) => value === 'only')[0]]?.label : 
            'Standard filtering'}
        </p>
        
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Stage 1: Generating Outputs</span>
              <span>{currentStage === 'Generating Outputs' ? `${progress.current}/${progress.total}` : 'Complete'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: currentStage === 'Generating Outputs' ? `${(progress.current / progress.total) * 100}%` : '100%' }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Stage 2: AI Evaluation</span>
              <span>{currentStage === 'AI Evaluation' ? 'Processing...' : currentStage === 'Generating Outputs' ? 'Waiting' : 'Complete'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: currentStage === 'AI Evaluation' ? '50%' : currentStage === 'Generating Outputs' ? '0%' : '100%' }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Stage 3: Preparing Review Queue</span>
              <span>{currentStage === 'Preparing Review Queue' ? 'Processing...' : currentStage === '' ? 'Complete' : 'Waiting'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: currentStage === 'Preparing Review Queue' ? '50%' : currentStage === '' ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>
        
        {evaluationResults && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded p-3">
              <h4 className="font-medium mb-2">Current Run Status:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Test Cases:</span> {progress.total} total
                </div>
                <div>
                  <span className="text-gray-600">Progress:</span> {progress.current}/{progress.total}
                </div>
                {originalStats && (
                  <>
                    <div>
                      <span className="text-gray-600">Current Pass Rate:</span> {originalStats.passRate}%
                    </div>
                    <div>
                      <span className="text-gray-600">Issues Found:</span> {originalStats.hallucinations + originalStats.omissions}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded p-3">
              <h4 className="font-medium mb-2">Reviewer Actions Taken:</h4>
              <div className="flex gap-4 text-sm">
                <span>Approved: {reviewerActions.approved}</span>
                <span>Rejected: {reviewerActions.rejected}</span>
                <span>Reviewer-Flagged: {reviewerActions.flagged}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            <Clock className="inline w-4 h-4 mr-1" />
            Estimated Time Remaining: 2 minutes
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setCurrentStage('');
              }}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            {evaluationResults && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Results
              </button>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={() => setCurrentView('details')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Detailed Results
          </button>
          <button
            onClick={() => {
              setEvaluationResults(null);
              setCurrentView('dashboard');
            }}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Run New Evaluation
          </button>
        </div>
      </div>
    );
  };
  
  // Results Dashboard Component - Compact for same-page display
  const ResultsDashboard = () => {
    const originalStats = getStats(evaluationResults.original);
    const modifiedStats = getStats(evaluationResults.modified);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Evaluation Complete - Prompt Comparison</h2>
        
        {/* Collapsible Configuration Summary */}
        <div className="mb-6">
          <button
            onClick={() => setIsResultsSummaryCollapsed(!isResultsSummaryCollapsed)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isResultsSummaryCollapsed ? '-rotate-90' : 'rotate-0'}`} />
            <span>Test Configuration:</span>
            {isResultsSummaryCollapsed && (
              <span className="text-xs text-gray-500">
                {(() => {
                  const selectedCaseTypeCount = Object.values(selectedCaseTypes).filter(Boolean).length;
                  const onlyModifier = Object.entries(modifiers).find(([_, value]) => value === 'only');
                  const excludedModifiers = Object.entries(modifiers).filter(([_, value]) => value === 'exclude');
                  const totalCases = calculateTotalTestCases();
                  
                  const modifierText = onlyModifier 
                    ? 'only: ' + MODIFIERS[onlyModifier[0]]?.label
                    : excludedModifiers.length > 0
                    ? 'excluded: ' + excludedModifiers.map(([key, _]) => MODIFIERS[key]?.label).join(', ')
                    : 'no exclusions';
                  
                  return `${selectedCaseTypeCount} case types, ${totalCases} test cases, ${modifierText}`;
                })()
                }
              </span>
            )}
          </button>
          
          {!isResultsSummaryCollapsed && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="space-y-1">
                <div><span className="font-medium">Section:</span> {selectedSection}</div>
                <div><span className="font-medium">Case Types:</span> {Object.entries(selectedCaseTypes).filter(([_, selected]) => selected).map(([key, _]) => CASE_TYPE_DATASETS[key]?.name).join(', ') || 'None selected'}</div>
                <div><span className="font-medium">Total cases evaluated:</span> {calculateTotalTestCases()}</div>
                <div><span className="font-medium">Comparison Type:</span> {comparisonTypes.changeModel && comparisonTypes.changePrompt ? 'Model + Prompt' : comparisonTypes.changeModel ? 'Model Only' : comparisonTypes.changePrompt ? 'Prompt Only' : 'Benchmark'}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Original Results */}
          <div className="text-center">
            <h3 className="font-semibold mb-2">Original (v2.3)</h3>
            <div className="text-4xl font-bold mb-2">
              <span className={originalStats.passRate < 70 ? 'text-red-600' : 'text-green-600'}>
                {originalStats.passRate}%
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {originalStats.passCount}/{evaluationResults.original.length} passed
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Hallucinations:</span>
                <span className="text-red-600 font-medium">{originalStats.hallucinations}</span>
              </div>
              <div className="flex justify-between">
                <span>Omissions:</span>
                <span className="text-amber-600 font-medium">{originalStats.omissions}</span>
              </div>
            </div>
          </div>
          
          {/* Modified Results */}
          <div className="text-center">
            <h3 className="font-semibold mb-2">Modified (v2.4 Draft)</h3>
            <div className="text-4xl font-bold mb-2">
              <span className={modifiedStats.passRate < 70 ? 'text-red-600' : 'text-green-600'}>
                {modifiedStats.passRate}%
              </span>
              <span className="text-2xl text-green-600 ml-2">
                {modifiedStats.passRate > originalStats.passRate ? '+' : ''}{modifiedStats.passRate - originalStats.passRate}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {modifiedStats.passCount}/{evaluationResults.modified.length} passed
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Hallucinations:</span>
                <span className="text-green-600 font-medium">{modifiedStats.hallucinations}</span>
              </div>
              <div className="flex justify-between">
                <span>Omissions:</span>
                <span className="text-green-600 font-medium">{modifiedStats.omissions}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={() => setCurrentView('details')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Detailed Results
          </button>
          <button
            onClick={() => {
              setEvaluationResults(null);
              setCurrentView('dashboard');
            }}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Run New Evaluation
          </button>
        </div>
      </div>
    );
  };
  
  // Case Detail View Component - Updated for sidebar layout
  const CaseDetailView = () => {
    if (!selectedCase) return null;
    
    const originalResult = evaluationResults.original.find(r => r.caseId === selectedCase.id);
    const modifiedResult = evaluationResults.modified.find(r => r.caseId === selectedCase.id);
    
    return (
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Case #{selectedCase.id}: {selectedCase.name}
          </h3>
          <div className="text-sm text-gray-600">
            Section: {selectedSection}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded p-3 mb-4">
          <p className="text-sm">
            <span className="font-medium">Ground Truth:</span> {selectedCase.name}
          </p>
          {selectedCase.sections[selectedSection] && (
            <p className="text-sm mt-2">
              <span className="font-medium">Forbidden Terms:</span> {selectedCase.sections[selectedSection].groundTruth.forbidden.join(', ')}
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Original Output */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">Original Output</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                originalResult.aiPass 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {originalResult.aiPass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-3 bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
              {originalResult.generatedOutput}
            </div>
            
            {originalResult.hallucinations.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Hallucination Detected</p>
                    <p className="text-xs text-red-700">Terms: {originalResult.hallucinations.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-1">
              <button
                onClick={() => handleReviewAction(originalResult.caseId, 'original', 'approved')}
                className={`px-2 py-1 text-xs rounded ${
                  originalResult.humanReview === 'approved' 
                    ? 'bg-green-600 text-white' 
                    : 'border border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => handleReviewAction(originalResult.caseId, 'original', 'rejected')}
                className={`px-2 py-1 text-xs rounded ${
                  originalResult.humanReview === 'rejected' 
                    ? 'bg-red-600 text-white' 
                    : 'border border-red-600 text-red-600 hover:bg-red-50'
                }`}
              >
                Reject
              </button>
              <button
                onClick={() => handleReviewAction(originalResult.caseId, 'original', 'flagged')}
                className={`px-2 py-1 text-xs rounded ${
                  originalResult.flagged 
                    ? 'bg-amber-600 text-white' 
                    : 'border border-amber-600 text-amber-600 hover:bg-amber-50'
                }`}
              >
                Flag
              </button>
            </div>
          </div>
          
          {/* Modified Output */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">Modified Output</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                modifiedResult.aiPass 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {modifiedResult.aiPass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-3 bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
              {modifiedResult.generatedOutput}
            </div>
            
            {modifiedResult.aiPass && (
              <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Accurate</p>
                    <p className="text-xs text-green-700">Requirements met, no hallucinations</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-1">
              <button
                onClick={() => handleReviewAction(modifiedResult.caseId, 'modified', 'approved')}
                className={`px-2 py-1 text-xs rounded ${
                  modifiedResult.humanReview === 'approved' 
                    ? 'bg-green-600 text-white' 
                    : 'border border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => handleReviewAction(modifiedResult.caseId, 'modified', 'rejected')}
                className={`px-2 py-1 text-xs rounded ${
                  modifiedResult.humanReview === 'rejected' 
                    ? 'bg-red-600 text-white' 
                    : 'border border-red-600 text-red-600 hover:bg-red-50'
                }`}
              >
                Reject
              </button>
              <button
                onClick={() => handleReviewAction(modifiedResult.caseId, 'modified', 'flagged')}
                className={`px-2 py-1 text-xs rounded ${
                  modifiedResult.flagged 
                    ? 'bg-amber-600 text-white' 
                    : 'border border-amber-600 text-amber-600 hover:bg-amber-50'
                }`}
              >
                Flag
              </button>
            </div>
          </div>
        </div>
        
        {(originalResult.flagged || modifiedResult.flagged) && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded p-4">
            <p className="text-sm">
              <span className="font-medium">Notes:</span> This case has been flagged for edge case curation due to recurring 'no procedures' pattern.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  
  // Edge Case Curation Component
  const EdgeCaseCuration = () => {
    const flaggedCases = [
      ...evaluationResults.original.filter(r => r.flagged),
      ...evaluationResults.modified.filter(r => r.flagged)
    ];
    
    const uniqueFlaggedCases = flaggedCases.reduce((acc, curr) => {
      if (!acc.find(c => c.caseId === curr.caseId)) {
        acc.push(curr);
      }
      return acc;
    }, []);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Edge Case Curation — {selectedSection}</h2>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">Flagged Cases Awaiting Decision: {uniqueFlaggedCases.length}</p>
        
        <div className="space-y-4">
          {uniqueFlaggedCases.map(flaggedCase => (
            <div key={flaggedCase.caseId} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">#{flaggedCase.caseId} – {flaggedCase.caseName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {flaggedCase.hallucinations.length > 0 
                      ? `Hallucination (recurring 'no procedures' failure)`
                      : flaggedCase.omissions.length > 0
                      ? 'Potential omission risk'
                      : 'Ambiguous case'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    Promote to Edge Case
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Dismiss Flag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Demand Letter Prompt Evaluator</h1>
        
        {/* Configuration Section */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
              
              <div className="space-y-6">
                {/* Test Cases Summary */}
                {/* Section Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section to Evaluate</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    {SECTIONS.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                
                {/* Collapsible Configuration Section */}
                <div>
                  <button
                    onClick={() => setIsConfigCollapsed(!isConfigCollapsed)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className={`w-4 h-4 transition-transform ${isConfigCollapsed ? '-rotate-90' : 'rotate-0'}`} />
                      <span className="text-sm font-medium text-gray-700">
                        {isConfigCollapsed ? 'Show' : 'Hide'} Test Configuration
                      </span>
                    </div>
                    {isConfigCollapsed && (
                      <div className="text-xs text-gray-500">
                        {(() => {
                          const selectedCaseTypeCount = Object.values(selectedCaseTypes).filter(Boolean).length;
                          const onlyModifier = Object.entries(modifiers).find(([_, value]) => value === 'only');
                          const excludedModifiers = Object.entries(modifiers).filter(([_, value]) => value === 'exclude');
                          
                          // Calculate total test cases using actual case counts
                          let totalCases = 0;
                          const selectedCaseTypeKeys = Object.entries(selectedCaseTypes)
                            .filter(([_, selected]) => selected)
                            .map(([key, _]) => key);
                          
                          if (selectedCaseTypeKeys.length > 0) {
                            if (onlyModifier) {
                              // Only modifier: 2 cases per case type
                              totalCases = selectedCaseTypeKeys.length * 2;
                            } else {
                              // Start with actual case counts from dataset
                              totalCases = selectedCaseTypeKeys.reduce((sum, key) => {
                                return sum + (CASE_TYPE_DATASETS[key]?.caseCount || 0);
                              }, 0);
                              
                              // Subtract for excluded modifiers
                              if (excludedModifiers.some(([key, _]) => key === 'edgeCases')) {
                                totalCases -= selectedCaseTypeKeys.length * 2;
                              }
                              if (excludedModifiers.some(([key, _]) => key === 'flaggedCases')) {
                                totalCases -= selectedCaseTypeKeys.length * 2;
                              }
                            }
                          }
                          
                          const modifierText = onlyModifier 
                            ? 'only: ' + MODIFIERS[onlyModifier[0]]?.label
                            : excludedModifiers.length > 0
                            ? 'excluded: ' + excludedModifiers.map(([key, _]) => MODIFIERS[key]?.label).join(', ')
                            : 'no exclusions';
                          
                          return `${selectedCaseTypeKeys.length} case types, ${totalCases} test cases, ${modifierText}`;
                        })()}
                      </div>
                    )}
                  </button>
                  
                  {!isConfigCollapsed && (
                    <div className="mt-4 space-y-6">
                      {/* Case Types Multi-Select */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Case Types</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(CASE_TYPE_DATASETS).map(([key, caseType]) => (
                            <label key={key} className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                              <input
                                type="checkbox"
                                className="mr-3 mt-1"
                                checked={selectedCaseTypes[key] || false}
                                onChange={(e) => setSelectedCaseTypes(prev => ({ ...prev, [key]: e.target.checked }))}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{caseType.name}</span>
                                  <span className="text-xs text-gray-500">{caseType.caseCount} cases</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{caseType.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          <span className="font-medium">Total cases for evaluation:</span> {calculateTotalTestCases()}
                        </p>
                      </div>
                
                      {/* Modifiers with 3-way toggle */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Modifiers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(MODIFIERS).map(([key, modifier]) => {
                            const isOnlySet = Object.values(modifiers).includes('only');
                            const thisIsOnly = modifiers[key] === 'only';
                            const isDisabled = isOnlySet && !thisIsOnly;
                            
                            return (
                              <div key={key} className={`border rounded-lg p-4 transition-all ${
                                isDisabled ? 'bg-gray-50 border-gray-200' : 'border-gray-300 hover:border-gray-400'
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-sm font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {modifier.label}
                                    {isDisabled && <span className="ml-2 text-xs text-gray-400">(disabled)</span>}
                                  </span>
                                  <select
                                    disabled={isDisabled}
                                    className={`text-sm border rounded px-3 py-1 focus:outline-none focus:ring-2 ${
                                      isDisabled 
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
                                    }`}
                                    value={modifiers[key]}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setModifiers(prev => {
                                        const updated = { ...prev, [key]: newValue };
                                        // If setting to "only", reset other modifiers to "include"
                                        if (newValue === 'only') {
                                          Object.keys(updated).forEach(otherKey => {
                                            if (otherKey !== key) {
                                              updated[otherKey] = 'include';
                                            }
                                          });
                                        }
                                        return updated;
                                      });
                                    }}
                                  >
                                      <option value="include">Include</option>
                                      <option value="only">Only</option>
                                      <option value="exclude">Exclude</option>
                                  </select>
                                </div>
                                <p className={`text-xs mb-2 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {modifier.description}
                                </p>
                                {thisIsOnly && (
                                  <p className="text-xs text-amber-600 font-medium">
                                    ⚠️ Other modifiers disabled when "Only" is selected
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Note:</strong> Setting any modifier to "Only" will disable and override all other modifiers.
                        </p>
                      </div>
                
                      {/* Evaluation Comparison Configuration */}
                      <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Evaluation Type</h3>
                  <div className="space-y-3">
                    {Object.entries(COMPARISON_TYPES).map(([key, type]) => (
                      <label key={key} className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="mr-3 mt-1"
                          checked={comparisonTypes[key]}
                          onChange={(e) => setComparisonTypes(prev => ({ ...prev, [key]: e.target.checked }))}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{type.icon}</span>
                            <span className="text-sm font-medium">{type.label}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                        </div>
                      </label>
                    ))}
                    
                    {!comparisonTypes.changeModel && !comparisonTypes.changePrompt && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">📊</span>
                          <span className="text-sm font-medium text-blue-800">Benchmark Mode</span>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          No comparison selected - evaluation will run as a performance benchmark
                        </p>
                      </div>
                    )}
                  </div>
                  
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Model Selection - Show when Change Model is enabled */}
            {comparisonTypes.changeModel && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">🤖 Model Comparison Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Model for Comparison</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
                        <option key={key} value={key} disabled={model.isCurrent}>
                          {model.name} ({model.provider})
                          {model.isCurrent && ' - Current Model (Disabled)'}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {Object.values(AVAILABLE_MODELS).find(m => m.isCurrent)?.name} | 
                      Selected: {AVAILABLE_MODELS[selectedModel]?.name}
                    </p>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedParams ? 'rotate-180' : ''}`} />
                      Advanced Parameters
                    </button>
                    
                    {showAdvancedParams && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          {AVAILABLE_MODELS[selectedModel]?.name} Parameters
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(AVAILABLE_MODELS[selectedModel]?.advancedParams || {}).map(([param, defaultValue]) => (
                            <div key={param}>
                              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                                {param.replace(/([A-Z])/g, ' $1')}
                              </label>
                              <input
                                type="number"
                                step={param === 'temperature' || param === 'topP' ? '0.1' : '1'}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={modelParams[selectedModel]?.[param] || defaultValue}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  setModelParams(prev => ({
                                    ...prev,
                                    [selectedModel]: {
                                      ...prev[selectedModel],
                                      [param]: value
                                    }
                                  }));
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          These parameters will be applied to the selected model during evaluation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Prompt Comparison - Show when Change Prompt is enabled */}
            {comparisonTypes.changePrompt && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">📝 Prompt Comparison Configuration</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Current Production Prompt (v2.3)</h3>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => navigator.clipboard.writeText(originalPrompt)}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={originalPrompt}
                      readOnly
                    />
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Test Modified Prompt (v2.4 Draft)</h3>
                    </div>
                    <textarea
                      className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={modifiedPrompt}
                      onChange={(e) => setModifiedPrompt(e.target.value)}
                    />
                    <div className="mt-2 flex gap-2">
                      <button className="text-sm text-gray-600 hover:text-gray-800">Reset to Default</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Run Button - Always at bottom */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={runEvaluation}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Run Evaluation
              </button>
            </div>
          </div>
        )}
        
        {/* Progress Display */}
        {isRunning && <ProgressDisplay />}
        
        {/* Results Display - Same Page */}
        {currentView === 'dashboard' && evaluationResults && !isRunning && (
          <div className="mt-8 space-y-6">
            <ResultsDashboard />
          </div>
        )}
        
        {/* Detailed Views - Full Screen */}
        {currentView === 'details' && evaluationResults && (
          <div className="fixed inset-0 bg-gray-50 flex flex-col">
            {/* Header with Summary */}
            <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Detailed Results</h2>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
                
                {/* Summary of comparison run */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Comparison Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Section:</span>
                      <div className="font-medium">{selectedSection}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Modifiers:</span>
                      <div className="font-medium">
                        {(() => {
                          const onlyModifier = Object.entries(modifiers).find(([_, value]) => value === 'only');
                          const excludedModifiers = Object.entries(modifiers).filter(([_, value]) => value === 'exclude');
                          
                          if (onlyModifier) {
                            return 'Only: ' + MODIFIERS[onlyModifier[0]]?.label;
                          } else if (excludedModifiers.length > 0) {
                            const excludedNames = excludedModifiers.map(([key, _]) => MODIFIERS[key]?.label);
                            return 'Excluded: ' + excludedNames.join(', ');
                          } else {
                            return 'No exclusions';
                          }
                        })()} 
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Comparison Type:</span>
                      <div className="font-medium">
                        {comparisonTypes.changeModel && comparisonTypes.changePrompt ? 'Model + Prompt' :
                         comparisonTypes.changeModel ? 'Model Only' :
                         comparisonTypes.changePrompt ? 'Prompt Only' : 'Benchmark'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content Area - Full Height */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar: Results List */}
              <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                  <h3 className="font-medium text-gray-800">Test Cases</h3>
                  <p className="text-sm text-gray-600">{evaluationResults.original.length} cases evaluated</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="divide-y divide-gray-100">
                    {testCases.map(testCase => {
                      const originalResult = evaluationResults.original.find(r => r.caseId === testCase.id);
                      const modifiedResult = evaluationResults.modified.find(r => r.caseId === testCase.id);
                      const isSelected = selectedCase?.id === testCase.id;
                      
                      return (
                        <div
                          key={testCase.id}
                          className={`p-4 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedCase(testCase)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-800">#{testCase.id}</h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{testCase.name}</p>
                              
                              {/* Quick status indicators */}
                              <div className="flex gap-2 mt-2">
                                {originalResult && (
                                  <div className={`w-3 h-3 rounded-full ${
                                    originalResult.aiPass ? 'bg-green-500' : 'bg-red-500'
                                  }`} title={`Original: ${originalResult.aiPass ? 'Pass' : 'Fail'}`} />
                                )}
                                {modifiedResult && (
                                  <div className={`w-3 h-3 rounded-full ${
                                    modifiedResult.aiPass ? 'bg-green-500' : 'bg-red-500'
                                  }`} title={`Modified: ${modifiedResult.aiPass ? 'Pass' : 'Fail'}`} />
                                )}
                              </div>
                            </div>
                            {isSelected && <ChevronRight className="w-4 h-4 text-blue-500 mt-1" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Right Area: Case Details - Full Height */}
              <div className="flex-1 bg-white overflow-y-auto">
                {selectedCase ? (
                  <CaseDetailView />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Select a test case to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'edge-cases' && <EdgeCaseCuration />}
      </div>
    </div>
  );
};

export default DemandLetterEvaluator;