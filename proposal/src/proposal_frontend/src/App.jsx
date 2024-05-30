import React, { useState } from 'react';
import ProposalForm from './components/ProposalForm';
import ProposalList from './components/ProposalList';
import './App.css';  // Make sure to create this file for styling

function App() {
  const [editMode, setEditMode] = useState(false); //A boolean indicating whether the application is in edit mode.
  const [proposalId, setProposalId] = useState(null); //An identifier for the proposal being edited.
  const [refresh, setRefresh] = useState(false); //useful for refreshing data.

  const toggleEditMode = (id) => { //t is used to switch between viewing and editing a proposal.
    setProposalId(id);
    setEditMode(!editMode);
  };

  const refreshProposals = () => { //Changing this state value can be used to trigger a re-fetch or re-render of the proposal list.
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <header>
        <h1>Proposals</h1>
      </header>
      <main>
        <ProposalForm editMode={editMode} proposalId={proposalId} refreshProposals={refreshProposals} />
        <ProposalList toggleEditMode={toggleEditMode} refreshProposals={refreshProposals} />
      </main>
    </div>
  );
}

export default App;