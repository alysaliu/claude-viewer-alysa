import { useState } from 'react';
import type { Job, Notification } from '../types/drafting-types';

export interface DocumentCard {
  id: string;
  title: string;
  startTime: number;
  status: 'generating' | 'complete';
}

export interface JobsState {
  jobs: Job[];
  notifications: Notification[];
  selectedJob: any;
  documentCards: DocumentCard[];
}

export interface JobsActions {
  setJobs: (jobs: Job[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  setSelectedJob: (job: any) => void;
  setDocumentCards: (cards: DocumentCard[]) => void;
  addJob: (job: Job) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  removeJob: (jobId: string) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  addDocumentCard: (card: DocumentCard) => void;
  updateDocumentCard: (cardId: string, updates: Partial<DocumentCard>) => void;
  removeDocumentCard: (cardId: string) => void;
}

export const useJobsState = (): [JobsState, JobsActions] => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [documentCards, setDocumentCards] = useState<DocumentCard[]>([]);

  const addJob = (job: Job) => {
    setJobs(prev => [...prev, job]);
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  const removeJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const addDocumentCard = (card: DocumentCard) => {
    setDocumentCards(prev => [...prev, card]);
  };

  const updateDocumentCard = (cardId: string, updates: Partial<DocumentCard>) => {
    setDocumentCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    ));
  };

  const removeDocumentCard = (cardId: string) => {
    setDocumentCards(prev => prev.filter(card => card.id !== cardId));
  };

  const state: JobsState = {
    jobs,
    notifications,
    selectedJob,
    documentCards,
  };

  const actions: JobsActions = {
    setJobs,
    setNotifications,
    setSelectedJob,
    setDocumentCards,
    addJob,
    updateJob,
    removeJob,
    addNotification,
    removeNotification,
    addDocumentCard,
    updateDocumentCard,
    removeDocumentCard,
  };

  return [state, actions];
};