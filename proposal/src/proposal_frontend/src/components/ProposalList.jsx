//to display a list of proposals and provide actions to vote on or end each proposal. 
import React, { useState, useEffect } from 'react';
import { proposal_backend } from '../../../declarations/proposal_backend';

const ProposalList = ({ toggleEditMode, refreshProposals }) => { //A function passed from the parent component to toggle the edit mode for a proposal.
  const [proposals, setProposals] = useState([]); //An array to store the list of fetched proposals.
  const [proposalCount, setProposalCount] = useState(0); //A number to store the total count of proposals.

  useEffect(() => {
    const fetchProposals = async () => {
      const count = await proposal_backend.get_proposal_count();
      setProposalCount(count);
      const allProposals = [];
      for (let i = 0; i < count; i++) { 
        const proposalData = await proposal_backend.get_proposal(i); //Iterates through each proposal ID (from 0 to count - 1) and fetches the proposal data from the backend using proposal_backend.get_proposal.
        if (proposalData && proposalData.length > 0) {
          const proposal = proposalData[0]; // Unwrap the proposal data
          console.log("Fetched proposal:", proposal);
          allProposals.push({ id: i, ...proposal });
        }
      }
      setProposals(allProposals);
    };

    fetchProposals();
  }, [refreshProposals]);

  const handleVote = async (id, choice) => {
    await proposal_backend.vote(id, choice);
    refreshProposals();
  };

  const handleEndProposal = async (id) => {
    await proposal_backend.end_propopsal(id);
    refreshProposals();
  };

  return (
    <div>
      <h1>Proposals</h1>
      <ul>
        {proposals.map((proposal) => (
          <li key={proposal.id}>
            {console.log("Proposal Description:", proposal.description)}
            <h2>{proposal.name}</h2>
            <p>{proposal.description}</p> 
            <p>Approve: {proposal.approve} <button onClick={() => handleVote(proposal.id, { Approve: null })}>Approve</button></p> 
            <p>Reject: {proposal.reject}<button onClick={() => handleVote(proposal.id, { Reject: null })}>Reject</button></p>
            <p>Pass: {proposal.pass} <button onClick={() => handleVote(proposal.id, { Pass: null })}>Pass</button></p>
            <button className="edit" onClick={() => toggleEditMode(proposal.id)}>Edit</button>
            <button className="end" onClick={() => handleEndProposal(proposal.id)}>End Proposal</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProposalList;