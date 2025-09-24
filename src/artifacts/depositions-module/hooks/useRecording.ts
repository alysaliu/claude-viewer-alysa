import { useState, useRef, useEffect } from 'react';
import { sampleContradictions } from '../data/sample-annotations';
import { sampleTranscriptContent } from '../data/unified-transcript';
import { getSampleNotesContent } from '../data/sample-notes';
import type { ContradictionItem, KeyIssueImpact, Deponent } from '../types/deposition-types';

interface UseRecordingProps {
  selectedDeponent: Deponent | null;
  setContradictions: React.Dispatch<React.SetStateAction<ContradictionItem[]>>;
  setKeyIssueImpacts: React.Dispatch<React.SetStateAction<KeyIssueImpact[]>>;
  setContinuousNotes: (notes: string) => void;
  setShowTranscriptView: (show: boolean) => void;
  setDeponents: React.Dispatch<React.SetStateAction<Deponent[]>>;
  setSelectedDeponent: React.Dispatch<React.SetStateAction<Deponent | null>>;
}

export const useRecording = ({
  selectedDeponent,
  setContradictions,
  setKeyIssueImpacts,
  setContinuousNotes,
  setShowTranscriptView,
  setDeponents,
  setSelectedDeponent
}: UseRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcriptText, setTranscriptText] = useState('');
  const [simulatedTranscript, setSimulatedTranscript] = useState('');
  const [animationStep, setAnimationStep] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const animateTranscriptContent = () => {
    setSimulatedTranscript(sampleTranscriptContent);
    setTranscriptText(sampleTranscriptContent);
  };

  const animateContradictions = () => {
    sampleContradictions.forEach((contradiction, index) => {
      setTimeout(() => {
        setContradictions(prev => [...prev, contradiction]);
      }, index * 2000); // 2 seconds between each contradiction
    });
  };

  const animateNotes = () => {
    const notesContent = getSampleNotesContent(selectedDeponent?.name);

    // Simulate typing the notes gradually
    let currentText = '';
    const words = notesContent.split(' ');
    
    words.forEach((word, index) => {
      setTimeout(() => {
        currentText += (index === 0 ? '' : ' ') + word;
        setContinuousNotes(currentText);
      }, index * 100); // 100ms between each word
    });
  };

  const startLiveSimulation = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    
    // Simulate transcript appearing after a brief delay
    setTimeout(() => {
      animateTranscriptContent();
    }, 1000);
    
    // Set timer to target time after brief animation
    setTimeout(() => {
      setRecordingTime(5104); // 1h 25m 04s in seconds
    }, 2000);
    
    // Start animating contradictions after transcript appears
    setTimeout(() => {
      animateContradictions();
    }, 3000);
    
    // Start animating notes
    setTimeout(() => {
      animateNotes();
    }, 4000);
  };

  const handleStartRecording = () => {
    // Clear everything to start fresh
    setTranscriptText('');
    setSimulatedTranscript('');
    setContradictions([]);
    setKeyIssueImpacts([]);
    setContinuousNotes('');
    setAnimationStep(0);
    
    // Start the live simulation
    startLiveSimulation();
  };

  const handlePauseRecording = () => {
    setIsPaused(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    // Clear intervals immediately
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (transcriptIntervalRef.current) {
      clearInterval(transcriptIntervalRef.current);
      transcriptIntervalRef.current = null;
    }
    
    setShowTranscriptView(true);
    
    // Update selected deponent to mark as having transcript
    if (selectedDeponent) {
      setDeponents(prev => prev.map(d => 
        d.id === selectedDeponent.id 
          ? { ...d, hasTranscript: true, transcriptType: 'draft', status: 'completed' }
          : d
      ));
      
      setSelectedDeponent(prev => prev ? {
        ...prev, 
        hasTranscript: true, 
        transcriptType: 'draft', 
        status: 'completed'
      } : null);
    }
  };

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (transcriptIntervalRef.current) {
        clearInterval(transcriptIntervalRef.current);
        transcriptIntervalRef.current = null;
      }
    };
  }, []);

  return {
    // State
    isRecording,
    isPaused,
    recordingTime,
    transcriptText,
    simulatedTranscript,
    animationStep,
    
    // Actions
    handleStartRecording,
    handlePauseRecording,
    handleStopRecording,
    setIsPaused,
    
    // Utilities
    formatTime
  };
};

export default useRecording;