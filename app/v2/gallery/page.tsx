'use client';

import React, { useState } from 'react';
import { useV2Data } from '../V2DataContext';
import { GalleryView, StepModal, EditStepModal } from '../V2ClientApp';
import V2AppShell from '../V2AppShell';

export default function V2GalleryPage() {
  const {
    steps,
    copy,
    getStatus,
    getStatusString,
    progress,
    takeInWork,
    toggleNotInterested,
    isAdmin,
    syncStepsList,
  } = useV2Data();

  const [modalId, setModalId] = useState<string | null>(null);
  const [editStepId, setEditStepId] = useState<string | null>(null);

  const handleEditSave = async (updatedStep: any) => {
    await syncStepsList(steps.map(s => s.id === updatedStep.id ? updatedStep : s));
    setEditStepId(null);
  };

  const handleDeleteStep = async (id: string) => {
    await syncStepsList(steps.filter(s => s.id !== id));
    setEditStepId(null);
    setModalId(null);
  };

  const editStep = editStepId ? steps.find(s => s.id === editStepId) : undefined;

  return (
    <V2AppShell>
      <GalleryView
        steps={steps}
        copy={copy}
        getStatus={getStatus}
        getStatusString={getStatusString}
        onOpenCard={setModalId}
        notInterested={progress.notInterested ?? {}}
      />

      {modalId && (
        <StepModal
          stepId={modalId}
          steps={steps}
          copy={copy}
          getStatus={getStatus}
          getStatusString={getStatusString}
          takeInWork={takeInWork}
          results={progress.results}
          notInterested={progress.notInterested ?? {}}
          toggleNotInterested={toggleNotInterested}
          setSaveFor={() => {}}
          onClose={() => setModalId(null)}
          isAdmin={isAdmin}
          setEditStepId={setEditStepId}
          onSelectRelated={setModalId}
        />
      )}

      {editStep && (
        <EditStepModal
          step={editStep}
          onSave={handleEditSave}
          onClose={() => setEditStepId(null)}
          onDelete={handleDeleteStep}
        />
      )}
    </V2AppShell>
  );
}
