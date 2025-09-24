import React, { useRef, useState } from 'react';
import { MessageSquare, Save, Edit, X, Check, FileText, ArrowRight, Menu, BookOpen, Send, ChevronDown } from 'lucide-react';
import { sidebarItems } from '../../data/sample-data';
import type { DraftedComplaint, ComplaintSection, Count } from '../../types/complaint-types';

interface DraftEditorViewProps {
  draftedComplaint: DraftedComplaint | null;
  activeSection: string | null;
  editingSection: string | null;
  showChat: boolean;
  chatInput: string;
  documentTitle: string;
  setActiveSection: (section: string | null) => void;
  setEditingSection: (section: string | null) => void;
  setShowChat: (show: boolean) => void;
  setChatInput: (input: string) => void;
  setDraftedComplaint: (complaint: DraftedComplaint | null | ((prev: DraftedComplaint | null) => DraftedComplaint | null)) => void;
  onSectionEdit: (sectionId: string, content: string) => void;
  onSaveDocument: () => void;
  onExportDocument: () => void;
}

const DraftEditorView: React.FC<DraftEditorViewProps> = ({
  draftedComplaint,
  activeSection,
  editingSection,
  showChat,
  chatInput,
  documentTitle,
  setActiveSection,
  setEditingSection,
  setShowChat,
  setChatInput,
  setDraftedComplaint,
  onSectionEdit,
  onSaveDocument,
  onExportDocument,
}) => {
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const [chatContext, setChatContext] = useState<'section' | 'document'>('section');
  const [isDraftingMode, setIsDraftingMode] = useState(true);

  // Helper function to generate count content based on claim type
  const generateCountContent = (count: any, number: number): string => {
    const isFirstCount = number === 1;
    let content = '';
    
    // Calculate the starting number based on previous counts
    // First count: 1-11 (11 paragraphs)
    // Second count: starts at 12 (incorporation) + 4 paragraphs = ends at 16
    // Third count: starts at 17 (incorporation) + 4 paragraphs = ends at 21
    let startNum = 1;
    if (!isFirstCount) {
      if (number === 2) {
        startNum = 12; // Second count starts at 12
      } else if (number === 3) {
        startNum = 17; // Third count starts at 17 (after 12-16)
      } else {
        // For 4th count and beyond: previous counts end at 21, 26, 31, etc.
        startNum = 12 + ((number - 2) * 5);
      }
      content += `${startNum}. Plaintiff repeats and re-alleges each and every allegation contained in the ${number === 2 ? 'First' : 'First and prior'} Count${number > 2 ? 's' : ''} and incorporates the same herein as if set forth at length.

`;
      startNum++; // Increment for the next paragraph
    }
    
    if (count.title === "Negligence") {
      content += `${startNum}. Plaintiff, [PLAINTIFF NAME] residing at [ADDRESS].

${startNum + 1}. Defendant, [DEFENDANT 1 NAME] resides at [ADDRESS].

${startNum + 2}. That at all times hereinafter mentioned, Defendant, [DEFENDANT 2 NAME], is a limited liability company authorized to do business in the State of New Jersey with offices at [ADDRESS].

${startNum + 3}. Defendants John Doe(s) 1-100 and A.B.C. Corporation(s) 1-100 are fictional Defendants designated as other natural persons and/or business entities responsible, individually and/or jointly or severally, or by their agents, servants, contractors/sub-contractors, and/or employees, for the negligent ownership, lease, operation, repair, design, maintenance, use and/or supervision of the vehicle, which violently collided with the vehicle in which Plaintiff, [PLAINTIFF NAME] was a passenger in, on or about [DATE].

${startNum + 4}. On or about [DATE], Defendant operated a motor vehicle bearing license plate number [PLATE NUMBER] which was owned by Defendant [OWNER NAME].

${startNum + 5}. On or about [DATE], the vehicle operated by Defendant was traveling [DIRECTION] on [STREET NAME] at the intersection of [CROSS STREET], [CITY], New Jersey.

${startNum + 6}. On or about [DATE], Defendant operated the motor vehicle with the consent and permission of the owner.

${startNum + 7}. On or about [DATE], Plaintiff was a passenger in a motor vehicle bearing license plate number [PLATE NUMBER], which was traveling [DIRECTION] on [STREET NAME] at the intersection of [CROSS STREET], [CITY], New Jersey.

${startNum + 8}. On or about [DATE], the vehicle Plaintiff was a passenger in was struck by the vehicle operated by Defendant.

${startNum + 9}. Defendants, negligently caused or allowed their vehicle to violently strike the vehicle Plaintiff was a passenger in; Defendants were negligent in that they operated their vehicle at a rate of speed in excess of the rate at which care and caution would permit under the circumstances then and there existing; failing and/or omitting to have the motor vehicle under reasonable and proper control; failing and/or omitting to make use of adequate brakes and steering mechanisms; carelessly and negligently ignoring and/or permitting said vehicle to be operated in a manner contrary to and in violation of the motor vehicle statutes of the State of New Jersey; failing to exercise caution in entering a roadway; Defendants were further negligent in failing and/or omitting to take proper and suitable precautions to avoid said accident and keep safe distances between the said vehicles; and in being otherwise careless and negligent in allowing their vehicle to violently collide, causing Plaintiff to suffer permanent and severe injuries.

${startNum + 10}. As a direct and proximate result of the aforesaid negligence, Plaintiff was severely injured in that Plaintiff incurred physical and mental injuries of a permanent, progressive and lasting character; Plaintiff was obligated to expend diverse sums of money for medical aid and attention in endeavoring to cure herself of the above injuries; Plaintiff was prevented from attending and carrying on normal activities and duties, further incurring lost wages; Plaintiff suffered and continue to suffer great pain and mental anguish.

WHEREFORE, Plaintiff demands Judgment against all Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    } else if (count.title === "Gross Negligence") {
      content += `${startNum}. Plaintiff incorporates by reference all previous allegations as if fully set forth herein.

${startNum + 1}. Defendants' conduct went beyond ordinary negligence and constituted gross negligence in that their actions demonstrated a conscious disregard for the safety of others.

${startNum + 2}. Defendants operated their motor vehicle in a manner that showed complete indifference to the consequences, including but not limited to: operating at excessive speeds in dangerous conditions, failing to maintain proper lookout, disregarding traffic signals and safety devices, and engaging in reckless driving behavior.

${startNum + 3}. Defendants' gross negligence was characterized by conduct so reckless as to demonstrate a substantial lack of concern for whether an injury would result.

${startNum + 4}. As a direct and proximate result of Defendants' gross negligence, Plaintiff sustained severe and permanent injuries, incurred substantial medical expenses, lost wages and earning capacity, and suffered significant pain and suffering.

WHEREFORE, Plaintiff demands Judgment against all Defendants for compensatory damages, punitive damages where applicable, together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    } else if (count.title === "Vicarious Liability / Respondeat Superior") {
      content += `${startNum}. All Defendants were operating their respective motor vehicles with the permission of the owner.

${startNum + 1}. All Defendants were designated as individuals responsible, individually and/or jointly or severally, or by their agents, servants, and/or employees, within the scope of their employment as the agent, servant, or employee and/or with the permission of applicable Defendants.

${startNum + 2}. All Defendants were negligent, careless, and/or reckless not only in the hiring, training, and/or supervising, of the Defendant agents, but also negligently entrusting the vehicle to the same.

${startNum + 3}. All Defendants are vicariously liable for the previously described behavior, conduct, recklessness, carelessness, and/or negligence of the Defendant agents.

WHEREFORE, Plaintiff demands Judgment against the Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    } else if (count.title === "Negligent Entrustment") {
      content += `${startNum}. All Defendants were negligent in the operation, repair, design, maintenance, use, and/or supervision of the subject vehicles and said negligence was the cause of the aforesaid collision in which the Plaintiff was injured.

${startNum + 1}. The negligence of the Defendants includes, but is not limited to, failing to properly maintain and repair the vehicles and allowing the vehicles to be operated in a state of improper repair on the streets and highways with the Defendants' permission, thereby causing the collision.

${startNum + 2}. All Defendants were negligent in entrusting their motor vehicle to a driver who they knew or should have known was incompetent, reckless, or otherwise unfit to operate the motor vehicle.

${startNum + 3}. The negligent entrustment by Defendants was a substantial factor in bringing about the collision and Plaintiff's resulting injuries.

WHEREFORE, Plaintiff demands Judgment against the Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    } else if (count.title === "Intentional Infliction of Emotional Distress") {
      content += `${startNum}. Plaintiff incorporates by reference all previous allegations as if fully set forth herein.

${startNum + 1}. Defendants' conduct was extreme and outrageous in that they engaged in reckless and dangerous driving behavior with deliberate indifference to Plaintiff's safety and well-being.

${startNum + 2}. Defendants' conduct went beyond all possible bounds of decency and was utterly intolerable in a civilized community, including but not limited to: engaging in aggressive driving maneuvers, deliberately endangering other motorists, and showing complete disregard for traffic safety laws.

${startNum + 3}. Defendants' conduct was intended to cause severe emotional distress to Plaintiff, or alternatively, Defendants acted with reckless disregard as to whether their conduct would cause severe emotional distress.

${startNum + 4}. As a direct and proximate result of Defendants' extreme and outrageous conduct, Plaintiff has suffered and continues to suffer severe emotional distress, including but not limited to anxiety, depression, post-traumatic stress disorder, and inability to operate a motor vehicle without experiencing panic attacks.

WHEREFORE, Plaintiff demands Judgment against the Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    } else if (count.title === "Loss of Consortium") {
      content += `${startNum}. Plaintiff incorporates by reference all previous allegations as if fully set forth herein.

${startNum + 1}. At all times relevant hereto, Plaintiff was married to [SPOUSE NAME] and they enjoyed a loving, stable marital relationship with normal companionship, affection, and sexual relations.

${startNum + 2}. As a direct and proximate result of the injuries sustained in the collision caused by Defendants' negligence, Plaintiff's spouse has been deprived of Plaintiff's companionship, affection, assistance, and consortium.

${startNum + 3}. The injuries sustained by Plaintiff have caused a substantial interference with the marital relationship, including but not limited to: loss of companionship, loss of affection, loss of sexual relations, and loss of household services and assistance.

${startNum + 4}. These losses are permanent in nature and will continue into the future, causing ongoing damages to the marital relationship.

WHEREFORE, [SPOUSE NAME] demands Judgment against the Defendants for loss of consortium damages, together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    } else if (count.title === "Premises Liability") {
      content += `${startNum}. Plaintiff incorporates by reference all previous allegations as if fully set forth herein.

${startNum + 1}. At the time of the incident, Defendants owned, operated, controlled, and/or maintained the premises located at [PROPERTY ADDRESS] where the collision occurred.

${startNum + 2}. Defendants had a duty to maintain the premises in a reasonably safe condition, including but not limited to: proper lighting of parking areas, adequate signage and traffic control devices, maintenance of roadways and walkways, and implementation of reasonable security measures.

${startNum + 3}. Defendants breached their duty of care by failing to maintain the premises in a reasonably safe condition, including but not limited to: failing to provide adequate lighting in the parking area, failing to install proper traffic control devices, allowing dangerous conditions to exist, and failing to warn of known hazards.

${startNum + 4}. The dangerous conditions on the premises were a substantial factor in causing the collision and Plaintiff's resulting injuries.

WHEREFORE, Plaintiff demands Judgment against the Defendants for premises liability damages, together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    } else if (count.title === "Product Liability") {
      content += `${startNum}. Plaintiff incorporates by reference all previous allegations as if fully set forth herein.

${startNum + 1}. At all times relevant hereto, Defendants designed, manufactured, distributed, and/or sold the motor vehicle and/or component parts thereof that were involved in the subject collision.

${startNum + 2}. The motor vehicle and/or its component parts were defective and unreasonably dangerous at the time they left Defendants' control, including but not limited to: defective braking systems, faulty steering mechanisms, inadequate safety restraint systems, and/or defective warning systems.

${startNum + 3}. The defective condition of the vehicle and/or its component parts was a substantial factor in causing the collision and/or exacerbating Plaintiff's injuries.

${startNum + 4}. Defendants failed to provide adequate warnings regarding the dangerous propensities of the vehicle and/or its component parts, despite their knowledge or constructive knowledge of such dangers.

${startNum + 5}. Plaintiff was using the vehicle in a manner that was reasonably foreseeable to Defendants at the time of the incident.

WHEREFORE, Plaintiff demands Judgment against the Defendants for product liability damages, together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    } else {
      // Truly custom claim types - AI would analyze case facts and generate appropriate content
      content = `${startNum}. Plaintiff incorporates by reference all previous allegations as if fully set forth herein.

${startNum + 1}. Based on the facts and circumstances of this case, including the collision on [DATE] at the intersection of [STREET NAME] and [CROSS STREET], Defendants' conduct constitutes ${count.title.toLowerCase()}.

${startNum + 2}. Defendants breached their legal duty to Plaintiff by engaging in conduct that was unreasonable under the circumstances, including but not limited to the specific acts of negligence and/or misconduct as detailed in the previous counts.

${startNum + 3}. As a direct and proximate result of Defendants' conduct, Plaintiff has suffered significant damages including physical injuries, medical expenses, lost wages, pain and suffering, and other economic and non-economic losses.

${startNum + 4}. The conduct and resulting damages warrant the relief sought herein under the legal theory of ${count.title.toLowerCase()}.

WHEREFORE, Plaintiff demands Judgment against the Defendants, individually, concurrently, jointly and severally, for damages together with interest, costs of suit, attorneys' fees, and such other and further relief as the Court may deem just and equitable.`;
    }
    
    return content;
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = sectionRefs.current[sectionId];
    if (sectionElement && documentContainerRef.current) {
      const containerRect = documentContainerRef.current.getBoundingClientRect();
      const sectionRect = sectionElement.getBoundingClientRect();
      const relativeTop = sectionRect.top - containerRect.top + documentContainerRef.current.scrollTop;
      
      // Account for the sticky header (approximately 60px)
      const headerOffset = 60;
      documentContainerRef.current.scrollTo({
        top: relativeTop - headerOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-900">Michael Garcia - MVA</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare size={16} className="inline mr-1" />
              AI Assistant
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col z-0 overflow-y-auto">
          <div className="mt-4 flex-1">
            {sidebarItems.map(item => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center px-4 py-2 ${item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
                >
                  <div className="mr-3"><IconComponent size={18} /></div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex relative">
          {/* Document Sections Panel */}
          {draftedComplaint && (
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              {/* Header matching other panels */}
              <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50 sticky top-0 z-10">
                <h4 className="text-lg font-medium text-gray-900">Document Sections</h4>
              </div>
              
              {/* Sections list */}
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-2">
                  {/* Caption */}
                  <div 
                    onClick={() => {
                      setActiveSection('caption');
                      setChatContext('section');
                      scrollToSection('caption');
                    }}
                    className={`p-3 rounded cursor-pointer border transition-colors ${
                      activeSection === 'caption' 
                        ? 'bg-blue-50 border-blue-200 text-blue-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText size={16} className="mr-3 text-gray-500" />
                      <span className="font-medium text-sm">Caption</span>
                    </div>
                  </div>

                  {/* Introduction */}
                  <div 
                    onClick={() => {
                      setActiveSection('introduction');
                      setChatContext('section');
                      scrollToSection('introduction');
                    }}
                    className={`p-3 rounded cursor-pointer border transition-colors ${
                      activeSection === 'introduction' 
                        ? 'bg-blue-50 border-blue-200 text-blue-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText size={16} className="mr-3 text-gray-500" />
                      <span className="font-medium text-sm">Introduction</span>
                    </div>
                  </div>

                  {/* Counts */}
                  {draftedComplaint.counts.map((count: ComplaintSection, index: number) => (
                    <div 
                      key={count.id}
                      className={`rounded border transition-all duration-200 ${
                        activeSection === count.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'border-gray-200 hover:bg-gray-50'
                      } ${editingSection === `${count.id}-title` ? 'ring-2 ring-blue-400 shadow-lg' : ''}`}
                    >
                      {editingSection === `${count.id}-title` ? (
                        // Editing Mode - Clean, focused interface
                        <div className="p-4 bg-white rounded border-2 border-blue-400">
                          <div className="mb-3">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                <Edit size={14} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">Edit Claim Type</div>
                                <div className="text-xs text-gray-500">{index === 0 ? 'First' : index === 1 ? 'Second' : 'Third'} Count</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Legal Claim
                            </label>
                            <input
                              type="text"
                              value={count.title}
                              onChange={(e) => {
                                // Update count title in real-time (without regenerating content yet)
                                setDraftedComplaint((prev: any) => {
                                  if (!prev) return prev;
                                  const updated = { ...prev };
                                  const countIndex = updated.counts.findIndex((c: any) => c.id === count.id);
                                  if (countIndex !== -1) {
                                    updated.counts[countIndex] = { 
                                      ...updated.counts[countIndex], 
                                      title: e.target.value
                                    };
                                  }
                                  return updated;
                                });
                              }}
                              onBlur={(e) => {
                                const newTitle = e.target.value.trim();
                                // Regenerate content when user finishes editing
                                setDraftedComplaint((prev: any) => {
                                  if (!prev) return prev;
                                  const updated = { ...prev };
                                  const countIndex = updated.counts.findIndex((c: any) => c.id === count.id);
                                  if (countIndex !== -1) {
                                    // Create a temporary count object for regeneration
                                    const tempCount = { 
                                      ...updated.counts[countIndex], 
                                      title: newTitle,
                                      keyFacts: updated.counts[countIndex].supportingInfo?.keyFacts || [],
                                      supportingDocs: updated.counts[countIndex].supportingInfo?.documents || []
                                    };
                                    
                                    // Regenerate content with new title
                                    const regeneratedContent = generateCountContent(tempCount, index + 1);
                                    
                                    updated.counts[countIndex] = { 
                                      ...updated.counts[countIndex], 
                                      title: newTitle,
                                      content: regeneratedContent
                                    };
                                  }
                                  return updated;
                                });
                                setEditingSection(null);
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur(); // This will trigger the onBlur handler
                                } else if (e.key === 'Escape') {
                                  setEditingSection(null);
                                }
                              }}
                              placeholder="e.g., Negligence, Gross Negligence, Product Liability"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              autoFocus
                            />
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                            <div className="flex items-start">
                              <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center mr-2 mt-0.5">
                                <span className="text-white text-xs font-bold">!</span>
                              </div>
                              <div className="text-xs text-yellow-800">
                                <div className="font-medium mb-1">Section will regenerate automatically</div>
                                <div>Changing the claim type will rewrite this count's legal content based on the new claim and existing case facts.</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => setEditingSection(null)}
                              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.parentElement?.previousElementSibling?.previousElementSibling?.querySelector('input') as HTMLInputElement;
                                if (input) input.blur();
                              }}
                              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                            >
                              Save & Regenerate
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Normal View Mode
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div 
                              className="flex items-center flex-1 cursor-pointer"
                              onClick={() => {
                                setActiveSection(count.id);
                                setChatContext('section');
                                scrollToSection(count.id);
                              }}
                            >
                              <FileText size={16} className="mr-3 text-gray-500" />
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">
                                  {index === 0 ? 'First' : index === 1 ? 'Second' : 'Third'} Count
                                </div>
                                <div className="text-xs text-gray-600 mt-0.5">{count.title}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {activeSection === count.id && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSection(`${count.id}-title`);
                                  }}
                                  className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors flex items-center"
                                  title="Edit claim type - will regenerate section content"
                                >
                                  <Edit size={12} className="mr-1" />
                                  Edit Claim
                                </button>
                              )}
                              {activeSection === count.id && (
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Supporting info - always shown for active count */}
                      {activeSection === count.id && (
                        <div className="mt-3 pt-3 border-t border-blue-100">
                          
                          {/* Key Facts */}
                          {count.supportingInfo?.keyFacts && count.supportingInfo.keyFacts.length > 0 ? (
                            <div className="mb-3">
                              <div className="text-xs font-medium text-gray-700 mb-1">Key Facts Used</div>
                              <ul className="space-y-1">
                                {count.supportingInfo.keyFacts.map((fact: string, idx: number) => (
                                  <li key={idx} className="flex items-start">
                                    <Check size={10} className="text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-gray-600">{fact}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="mb-3">
                              <div className="text-xs font-medium text-gray-700 mb-1">Key Facts</div>
                              <div className="text-xs text-gray-500 italic">No key facts specified for this claim type</div>
                            </div>
                          )}
                          
                          {/* Supporting Documents */}
                          {count.supportingInfo?.documents && count.supportingInfo.documents.length > 0 ? (
                            <div>
                              <div className="text-xs font-medium text-gray-700 mb-1">Supporting Documents</div>
                              <div className="space-y-1">
                                {count.supportingInfo.documents.map((doc: string, idx: number) => (
                                  <div key={idx} className="flex items-start p-2 bg-blue-50 rounded border border-blue-100">
                                    <FileText size={12} className="text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="text-xs text-blue-800 font-medium">{doc}</div>
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        {doc === "Police Report" && "Incident Report #2024-MVA-1157, Page 2-3"}
                                        {doc === "Witness Statement - M. Garcia" && "Deposition Transcript, Lines 45-78"}
                                        {doc === "Medical Records" && "Dr. Smith's Report, Sections 3.2-3.4"}
                                        {doc === "Employment Records" && "HR File #EMP-2024-445, Employment Contract"}
                                        {doc === "Vehicle Registration" && "NJ DMV Registration #ABC-123-XY"}
                                        {doc === "Company Policy Manual" && "Vehicle Use Policy, Section 4.2"}
                                        {doc === "HR Files" && "Personnel File #HR-2024-778, Background Check"}
                                        {doc === "Training Records" && "Driver Training Certificate, Module 3"}
                                        {doc === "Prior Incident Reports" && "Safety Report #SR-2023-092, Page 1"}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-xs font-medium text-gray-700 mb-1">Supporting Documents</div>
                              <div className="text-xs text-gray-500 italic">No documents specified for this claim type</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Jury Demand */}
                  <div 
                    onClick={() => {
                      setActiveSection('jury-demand');
                      setChatContext('section');
                      scrollToSection('jury-demand');
                    }}
                    className={`p-3 rounded cursor-pointer border transition-colors ${
                      activeSection === 'jury-demand' 
                        ? 'bg-blue-50 border-blue-200 text-blue-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText size={16} className="mr-3 text-gray-500" />
                      <span className="font-medium text-sm">Jury Demand</span>
                    </div>
                  </div>

                  {/* Signature */}
                  <div 
                    onClick={() => {
                      setActiveSection('signature');
                      setChatContext('section');
                      scrollToSection('signature');
                    }}
                    className={`p-3 rounded cursor-pointer border transition-colors ${
                      activeSection === 'signature' 
                        ? 'bg-blue-50 border-blue-200 text-blue-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText size={16} className="mr-3 text-gray-500" />
                      <span className="font-medium text-sm">Signature</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 bg-white overflow-auto" ref={documentContainerRef}>
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50 sticky top-0 z-10">
              <h2 className="text-lg font-medium text-gray-900">{documentTitle}</h2>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onSaveDocument}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50"
                >
                  <Save size={16} className="mr-1 inline" />
                  Save
                </button>
                <button 
                  onClick={onExportDocument}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                >
                  Export Document
                </button>
              </div>
            </div>
            
            <div className="p-8 max-w-4xl relative">
              {draftedComplaint && (
                <>
                  <div 
                    ref={(el) => { sectionRefs.current['caption'] = el; }}
                    className={`mb-8 p-4 rounded cursor-pointer ${activeSection === 'caption' ? 'bg-blue-50 border-2 border-blue-400' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setActiveSection('caption');
                      setChatContext('section');
                      scrollToSection('caption');
                    }}
                  >
                    {editingSection === 'caption' ? (
                      <div>
                        <textarea
                          value={draftedComplaint.caption.content}
                          onChange={(e) => onSectionEdit('caption', e.target.value)}
                          className="w-full p-2 border rounded resize-none"
                          rows={15}
                          autoFocus
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-center font-serif">
                        {draftedComplaint.caption.content}
                      </pre>
                    )}
                    {activeSection === 'caption' && editingSection !== 'caption' && (
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => setEditingSection('caption')}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Edit size={14} className="inline mr-1" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    ref={(el) => { sectionRefs.current['introduction'] = el; }}
                    className={`mb-8 p-4 rounded cursor-pointer ${activeSection === 'introduction' ? 'bg-blue-50 border-2 border-blue-400' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setActiveSection('introduction');
                      setChatContext('section');
                      scrollToSection('introduction');
                    }}
                  >
                    {editingSection === 'introduction' ? (
                      <div>
                        <textarea
                          value={draftedComplaint.introduction.content}
                          onChange={(e) => onSectionEdit('introduction', e.target.value)}
                          className="w-full p-2 border rounded resize-none"
                          rows={3}
                          autoFocus
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-serif">{draftedComplaint.introduction.content}</p>
                    )}
                    {activeSection === 'introduction' && editingSection !== 'introduction' && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => setEditingSection('introduction')}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Edit size={14} className="inline mr-1" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {draftedComplaint.counts.map((count: ComplaintSection, index: number) => (
                    <div 
                      key={count.id}
                      ref={(el) => { sectionRefs.current[count.id] = el; }}
                      className={`mb-8 p-4 rounded cursor-pointer ${activeSection === count.id ? 'bg-blue-50 border-2 border-blue-400' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setActiveSection(count.id);
                        setChatContext('section');
                        scrollToSection(count.id);
                      }}
                    >
                      <h3 className="font-bold text-center mb-4">
                        {index === 0 ? 'FIRST' : index === 1 ? 'SECOND' : 'THIRD'} COUNT - {count.title.toUpperCase()}
                      </h3>
                      
                      {editingSection === count.id ? (
                        <div>
                          <textarea
                            value={count.content}
                            onChange={(e) => onSectionEdit(count.id, e.target.value)}
                            className="w-full p-2 border rounded resize-none"
                            rows={20}
                            autoFocus
                          />
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingSection(null)}
                              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => setEditingSection(null)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap font-serif">
                          {count.content}
                        </div>
                      )}
                      
                      {activeSection === count.id && editingSection !== count.id && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => setEditingSection(count.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Edit size={14} className="inline mr-1" />
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div 
                    ref={(el) => { sectionRefs.current['jury-demand'] = el; }}
                    className={`mb-8 p-4 rounded cursor-pointer ${activeSection === 'jury-demand' ? 'bg-blue-50 border-2 border-blue-400' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setActiveSection('jury-demand');
                      setChatContext('section');
                      scrollToSection('jury-demand');
                    }}
                  >
                    {editingSection === 'jury-demand' ? (
                      <div>
                        <textarea
                          value={draftedComplaint.juryDemand.content}
                          onChange={(e) => onSectionEdit('jury-demand', e.target.value)}
                          className="w-full p-2 border rounded resize-none"
                          rows={5}
                          autoFocus
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap font-serif">
                        {draftedComplaint.juryDemand.content}
                      </pre>
                    )}
                    {activeSection === 'jury-demand' && editingSection !== 'jury-demand' && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => setEditingSection('jury-demand')}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Edit size={14} className="inline mr-1" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    ref={(el) => { sectionRefs.current['signature'] = el; }}
                    className={`mb-8 p-4 rounded cursor-pointer ${activeSection === 'signature' ? 'bg-blue-50 border-2 border-blue-400' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setActiveSection('signature');
                      setChatContext('section');
                      scrollToSection('signature');
                    }}
                  >
                    {editingSection === 'signature' ? (
                      <div>
                        <textarea
                          value={draftedComplaint.signature.content}
                          onChange={(e) => onSectionEdit('signature', e.target.value)}
                          className="w-full p-2 border rounded resize-none"
                          rows={8}
                          autoFocus
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-right font-serif">
                        {draftedComplaint.signature.content}
                      </pre>
                    )}
                    {activeSection === 'signature' && editingSection !== 'signature' && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => setEditingSection('signature')}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Edit size={14} className="inline mr-1" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {showChat && (
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
              {/* Header with hamburger menu and close - matching document title bar */}
              <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50 sticky top-0 z-10">
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Menu size={14} />
                  </button>
                  {/* Invisible placeholder text to match document title height */}
                  <span className="text-lg font-medium text-transparent select-none pointer-events-none ml-3">Assistant</span>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Invisible placeholder buttons to match document title bar height */}
                  <div className="px-3 py-1 text-sm font-medium text-transparent select-none pointer-events-none">Save</div>
                  <div className="px-3 py-1 text-sm font-medium text-transparent select-none pointer-events-none">Export Document</div>
                  <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Chat content area */}
              <div className="flex-1 overflow-auto p-4">
                {/* Initial greeting message */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 max-w-xs">
                  <p className="text-sm text-gray-800">
                    I can help you refine any section of the complaint. Select a section and ask me to modify it, or ask for suggestions on strengthening your claims.
                  </p>
                </div>
              </div>
              
              {/* Selection indicator bar */}
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-blue-700 font-medium">
                      Selection: {chatContext === 'document' ? 'Whole Document' : (() => {
                        if (!activeSection) return 'No Selection';
                        if (activeSection === 'caption') return 'Caption';
                        if (activeSection === 'introduction') return 'Introduction';
                        if (activeSection === 'jury-demand') return 'Jury Demand';
                        if (activeSection === 'signature') return 'Signature';
                        if (activeSection && activeSection.startsWith('count-')) {
                          const count = draftedComplaint?.counts.find((c: ComplaintSection) => c.id === activeSection);
                          return count ? count.title : 'Count';
                        }
                        return 'Document';
                      })()}
                    </span>
                  </div>
                  <button 
                    onClick={() => setChatContext(chatContext === 'section' ? 'document' : 'section')}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100"
                  >
                    {chatContext === 'section' ? 'Switch to Document' : 'Switch to Section'}
                  </button>
                </div>
              </div>
              
              {/* Input area */}
              <div className="p-4 border-t border-gray-200">
                <div className="relative">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Send a message"
                    className="w-full p-3 border rounded-lg resize-none pb-12"
                    rows={3}
                  />
                  
                  {/* Bottom toolbar with aligned buttons */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    {/* Left side - Prompt Library button */}
                    <button className="flex items-center text-xs text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                      <BookOpen size={12} className="mr-1" />
                      Prompt Library
                    </button>
                    
                    {/* Right side - Mode toggle and Send button */}
                    <div className="flex items-center gap-2">
                      {/* Drafting/Research Toggle */}
                      <div className="flex items-center bg-gray-100 rounded-full p-1">
                        <button
                          onClick={() => setIsDraftingMode(true)}
                          className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                            isDraftingMode 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          Draft
                        </button>
                        <button
                          onClick={() => setIsDraftingMode(false)}
                          className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                            !isDraftingMode 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          Research
                        </button>
                      </div>
                      
                      {/* Send button */}
                      <button className="text-blue-600 hover:text-blue-800">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftEditorView;