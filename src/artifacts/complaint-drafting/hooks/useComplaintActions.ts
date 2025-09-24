import { useCallback } from 'react';
import type { Blueprint, Count, DraftedComplaint, ComplaintSection } from '../types/complaint-types';
import { sampleCounts } from '../data/sample-data';

interface UseComplaintActionsProps {
  setSelectedBlueprint: (blueprint: Blueprint | null) => void;
  setCurrentView: (view: string) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setIdentifiedCounts: (counts: Count[]) => void;
  setShowBlueprintModal: (show: boolean) => void;
  setDraftedComplaint: (complaint: DraftedComplaint | null) => void;
  setEditingSection: (section: string | null) => void;
  setEditedCounts: (counts: Set<number>) => void;
  setEditingCount: (count: number | null) => void;
  setHasBeenSaved: (saved: boolean) => void;
  identifiedCounts: Count[];
  editedCounts: Set<number>;
}

export const useComplaintActions = ({
  setSelectedBlueprint,
  setCurrentView,
  setIsAnalyzing,
  setIdentifiedCounts,
  setShowBlueprintModal,
  setDraftedComplaint,
  setEditingSection,
  setEditedCounts,
  setEditingCount,
  setHasBeenSaved,
  identifiedCounts,
  editedCounts,
}: UseComplaintActionsProps) => {
  const handleSelectBlueprint = useCallback((blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
    setCurrentView('analyzing');
    setIsAnalyzing(true);
    setShowBlueprintModal(false);
    
    setTimeout(() => {
      setIdentifiedCounts(sampleCounts);
      setIsAnalyzing(false);
      setCurrentView('counts-review');
    }, 3000);
  }, [setSelectedBlueprint, setCurrentView, setIsAnalyzing, setIdentifiedCounts, setShowBlueprintModal]);

  const toggleCountSelection = useCallback((countId: number) => {
    setIdentifiedCounts(identifiedCounts.map((count: Count) => 
      count.id === countId ? { ...count, selected: !count.selected } : count
    ));
  }, [identifiedCounts, setIdentifiedCounts]);

  const handleAddCustomCount = useCallback(() => {
    const newCount: Count = {
      id: identifiedCounts.length + 1,
      title: "Custom Claim",
      description: "Enter description of custom claim...",
      selected: true,
      keyFacts: [],
      supportingDocs: [],
      isCustom: true
    };
    setIdentifiedCounts([...identifiedCounts, newCount]);
  }, [identifiedCounts, setIdentifiedCounts]);

  const handleDeleteCount = useCallback((countId: number) => {
    setIdentifiedCounts(identifiedCounts.filter((count: Count) => count.id !== countId));
  }, [identifiedCounts, setIdentifiedCounts]);

  const handleCountDescriptionEdit = useCallback((countId: number, newDescription: string) => {
    setIdentifiedCounts(identifiedCounts.map((count: Count) => 
      count.id === countId ? { ...count, description: newDescription } : count
    ));
    setEditedCounts(prev => new Set([...prev, countId]));
    setEditingCount(null);
  }, [identifiedCounts, setIdentifiedCounts, setEditedCounts, setEditingCount]);

  const handleGenerateDraft = useCallback(() => {
    setCurrentView('generating');
    
    setTimeout(() => {
      setDraftedComplaint(generateComplaintContent(identifiedCounts));
      setCurrentView('draft-editor');
    }, 3000);
  }, [identifiedCounts, setCurrentView, setDraftedComplaint]);

  const handleSectionEdit = useCallback((sectionId: string, newContent: string) => {
    setDraftedComplaint((prev: DraftedComplaint | null) => {
      if (!prev) return prev;
      
      const updated = { ...prev };
      
      if (updated[sectionId as keyof DraftedComplaint]) {
        (updated[sectionId as keyof DraftedComplaint] as ComplaintSection) = { 
          ...(updated[sectionId as keyof DraftedComplaint] as ComplaintSection), 
          content: newContent 
        };
      } else {
        const countIndex = updated.counts.findIndex((c: ComplaintSection) => c.id === sectionId);
        if (countIndex !== -1) {
          updated.counts[countIndex] = { ...updated.counts[countIndex], content: newContent };
        }
      }
      
      return updated;
    });
    
    setEditingSection(null);
  }, [setDraftedComplaint, setEditingSection]);

  const handleExportDocument = useCallback(() => {
    alert('Document exported successfully!');
  }, []);

  const handleSaveDocument = useCallback(() => {
    setHasBeenSaved(true);
    setTimeout(() => {
      alert('Document saved successfully!');
    }, 500);
  }, [setHasBeenSaved]);

  return {
    handleSelectBlueprint,
    toggleCountSelection,
    handleAddCustomCount,
    handleDeleteCount,
    handleCountDescriptionEdit,
    handleGenerateDraft,
    handleSectionEdit,
    handleExportDocument,
    handleSaveDocument,
  };
};

// Helper function to generate complaint content
const generateComplaintContent = (identifiedCounts: Count[]): DraftedComplaint => {
  const selectedCounts = identifiedCounts.filter((c: Count) => c.selected);
  
  return {
    caption: {
      id: 'caption',
      type: 'caption',
      content: `[ATTORNEY NAME], Esq.
(Attorney ID: [ID NUMBER])
[LAW FIRM NAME]
[ADDRESS]
[CITY, STATE ZIP]
[PHONE]
Attorneys for Plaintiff

[PLAINTIFF NAME],

Plaintiff,

vs.

[DEFENDANT 1 NAME], [DEFENDANT 2 NAME], JOHN DOES 1-100 (fictional natural persons); and ABC CORPORATION 1-100 (fictional business entities),

Defendant(s).

SUPERIOR COURT OF NEW JERSEY
LAW DIVISION: [COUNTY] COUNTY
DOCKET NO: [DOCKET NUMBER]

CIVIL ACTION

COMPLAINT,
JURY DEMAND,
DESIGNATION OF TRIAL COUNSEL,
REQUEST FOR DISCOVERY OF INSURANCE COVERAGE,
DEMAND FOR ANSWERS TO INTERROGATORIES AND
DEMAND FOR PRODUCTION OF DOCUMENTS`,
      editable: true
    },
    introduction: {
      id: 'introduction',
      type: 'introduction',
      content: 'Plaintiff, [PLAINTIFF NAME] by way of Complaint against the Defendants hereby alleges:',
      editable: true
    },
    counts: selectedCounts.map((count: Count, index: number) => ({
      id: `count-${count.id}`,
      type: 'count',
      number: index + 1,
      title: count.title.toUpperCase(),
      content: generateCountContent(count, index + 1),
      editable: true,
      supportingInfo: {
        keyFacts: count.keyFacts,
        documents: count.supportingDocs
      }
    })),
    juryDemand: {
      id: 'jury-demand',
      type: 'jury-demand',
      content: `JURY DEMAND

The Plaintiff hereby demands a trial by jury on all of the triable issues of this Complaint, pursuant to Rule 1:8-2(b) and Rule 4:35-1(a).`,
      editable: true
    },
    signature: {
      id: 'signature',
      type: 'signature',
      content: `[LAW FIRM NAME]
Attorneys for Plaintiff

By: _______________________
[ATTORNEY NAME], ESQ.

Dated: ${new Date().toLocaleDateString()}`,
      editable: true
    }
  };
};

const generateCountContent = (count: Count, number: number): string => {
  const isFirstCount = number === 1;
  let content = '';
  
  if (!isFirstCount) {
    content += `${number + 12}. Plaintiff repeats and re-alleges each and every allegation contained in the ${number === 2 ? 'First' : 'First and prior'} Count${number > 2 ? 's' : ''} and incorporates the same herein as if set forth at length.

`;
  }
  
  if (count.title === "Negligence") {
    content += `1. Plaintiff, [PLAINTIFF NAME] residing at [ADDRESS].

2. Defendant, [DEFENDANT 1 NAME] resides at [ADDRESS].

3. That at all times hereinafter mentioned, Defendant, [DEFENDANT 2 NAME], is a limited liability company authorized to do business in the State of New Jersey with offices at [ADDRESS].

4. Defendants John Doe(s) 1-100 and A.B.C. Corporation(s) 1-100 are fictional Defendants designated as other natural persons and/or business entities responsible, individually and/or jointly or severally, or by their agents, servants, contractors/sub-contractors, and/or employees, for the negligent ownership, lease, operation, repair, design, maintenance, use and/or supervision of the vehicle, which violently collided with the vehicle in which Plaintiff, [PLAINTIFF NAME] was a passenger in, on or about [DATE].

5. On or about [DATE], Defendant operated a motor vehicle bearing license plate number [PLATE NUMBER] which was owned by Defendant [OWNER NAME].

6. On or about [DATE], the vehicle operated by Defendant was traveling [DIRECTION] on [STREET NAME] at the intersection of [CROSS STREET], [CITY], New Jersey.

7. On or about [DATE], Defendant operated the motor vehicle with the consent and permission of the owner.

8. On or about [DATE], Plaintiff was a passenger in a motor vehicle bearing license plate number [PLATE NUMBER], which was traveling [DIRECTION] on [STREET NAME] at the intersection of [CROSS STREET], [CITY], New Jersey.

9. On or about [DATE], the vehicle Plaintiff was a passenger in was struck by the vehicle operated by Defendant.

10. Defendants, negligently caused or allowed their vehicle to violently strike the vehicle Plaintiff was a passenger in; Defendants were negligent in that they operated their vehicle at a rate of speed in excess of the rate at which care and caution would permit under the circumstances then and there existing; failing and/or omitting to have the motor vehicle under reasonable and proper control; failing and/or omitting to make use of adequate brakes and steering mechanisms; carelessly and negligently ignoring and/or permitting said vehicle to be operated in a manner contrary to and in violation of the motor vehicle statutes of the State of New Jersey; failing to exercise caution in entering a roadway; Defendants were further negligent in failing and/or omitting to take proper and suitable precautions to avoid said accident and keep safe distances between the said vehicles; and in being otherwise careless and negligent in allowing their vehicle to violently collide, causing Plaintiff to suffer permanent and severe injuries.

11. As a direct and proximate result of the aforesaid negligence, Plaintiff was severely injured in that Plaintiff incurred physical and mental injuries of a permanent, progressive and lasting character; Plaintiff was obligated to expend diverse sums of money for medical aid and attention in endeavoring to cure herself of the above injuries; Plaintiff was prevented from attending and carrying on normal activities and duties, further incurring lost wages; Plaintiff suffered and continue to suffer great pain and mental anguish.

WHEREFORE, Plaintiff demands Judgment against all Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
  } else if (count.title === "Vicarious Liability / Respondeat Superior") {
    content += `${number + 13}. All Defendants were operating their respective motor vehicles with the permission of the owner.

${number + 14}. All Defendants were designated as individuals responsible, individually and/or jointly or severally, or by their agents, servants, and/or employees, within the scope of their employment as the agent, servant, or employee and/or with the permission of applicable Defendants.

${number + 15}. All Defendants were negligent, careless, and/or reckless not only in the hiring, training, and/or supervising, of the Defendant agents, but also negligently entrusting the vehicle to the same.

${number + 16}. All Defendants are vicariously liable for the previously described behavior, conduct, recklessness, carelessness, and/or negligence of the Defendant agents.

WHEREFORE, Plaintiff demands Judgment against the Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
  } else if (count.title === "Negligent Entrustment") {
    content += `${number + 17}. All Defendants were negligent in the operation, repair, design, maintenance, use, and/or supervision of the subject vehicles and said negligence was the cause of the aforesaid collision in which the Plaintiff was injured.

${number + 18}. The negligence of the Defendants includes, but is not limited to, failing to properly maintain and repair the vehicles and allowing the vehicles to be operated in a state of improper repair on the streets and highways with the Defendants' permission, thereby causing the collision.

${number + 19}. All Defendants were negligent in entrusting their motor vehicle to a driver who they knew or should have known was incompetent, reckless, or otherwise unfit to operate the motor vehicle.

${number + 20}. The negligent entrustment by Defendants was a substantial factor in bringing about the collision and Plaintiff's resulting injuries.

WHEREFORE, Plaintiff demands Judgment against the Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
  } else {
    // Custom count
    content = `[Insert specific allegations for ${count.title} based on the facts of your case]

[Include relevant legal elements and factual support]

WHEREFORE, Plaintiff demands Judgment against the Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
  }
  
  return content;
};