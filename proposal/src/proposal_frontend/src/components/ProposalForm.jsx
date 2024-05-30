import React, { useState, useEffect } from 'react';
import { proposal_backend } from '../../../declarations/proposal_backend';

const ProposalForm = ({ editMode, proposalId, refreshProposals }) => { //A boolean indicating whether the form is in edit mode or create mode. //The ID of the proposal being edited. //A function passed from the parent component to refresh the proposal list after a create or edit action.
 
    //the only 2 things we are going to change in backend 
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editMode && proposalId !== null) { //If editMode is true and proposalId is not null, it fetches the proposal data from the backend using the proposal_backend.get_proposal method.
      const fetchProposal = async () => { //Its purpose is to fetch the details of a specific proposal from the backend when the form is in edit mode and a valid proposalId is provided. 
        const proposalData = await proposal_backend.get_proposal(proposalId);
        if (proposalData && proposalData.length > 0) { //After the data is fetched, the function checks if proposalData is not null or undefined and if it contains at least one item.
          const proposal = proposalData[0]; // Unwrap the proposal data //Assuming proposalData is an array (as implied by the length check), the function accesses the first element of the array, which represents the desired proposal.
      
          setDescription(proposal.description);
          setIsActive(proposal.is_active);
        }
      };
      fetchProposal();
    }
  }, [editMode, proposalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const proposalData = {  description, is_active: isActive };
    if (editMode) { //The function checks the editMode state to determine if the form is in edit mode or create mode
      await proposal_backend.edit_propopsal(proposalId, proposalData);
    } else {
      const proposalCount = await proposal_backend.get_proposal_count();
      await proposal_backend.create_proposal(proposalCount, proposalData);
    }
    refreshProposals();
   
    setDescription('');
    setIsActive(true);
  };

  return (
    <form onSubmit={handleSubmit}>
    
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter proposal description"
      />
      <label>
        Active:
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
      </label>
      <button type="submit">{editMode ? 'Edit Proposal' : 'Create Proposal'}</button>
    </form>
  );
};

export default ProposalForm;