use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
//BoundedStorable: A trait for types that can be stored in a fixed amount of memory.(etghayaret ba bound ony in another import)
use ic_stable_structures::storable::Bound;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};

type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE: u32 = 5000;

//impl 2 enums to handle the errors of the following functions
#[derive(CandidType)]
enum VoteError {
    AlreadyVoted,
    ProposalIsNotActive,
    NoSuchProposal,
    AccessRejected, //like try to edit and you are not the owner
    UpdateError,    //sth went wrong but don't know why(404)
}

//and also we are going to have enum to choose (approved, pass , reject)
#[derive(CandidType, Deserialize)]
enum Choice {
    Approve,
    Reject,
    Pass,
} //hasab user choose any choice we will going to update proposal

//first struct: is going to have our data for the proposal
//sec struct: will be provided for our functions so we can create proposals and edit
//just for funcs paramerters

//this struct for main structure for our state to store our data
//The Deserialize trait from Serde is necessary for deserializing data into your Rust structs.
//error without serde in tomol file
#[derive(CandidType, Deserialize)]
struct Proposal {
    description: String,
    approve: u32, //no. of approves we have in our proposal
    reject: u32,
    pass: u32,       //three options that we are going to have
    is_active: bool, //if their time have passed or creator stopped it we cannot vote anymore //this variable decides we can vote or not

    //Principal represents the identity of an entity (such as a user or canister) on the Internet Computer.
    voted: Vec<candid::Principal>, //people that already voted //everypne can vote for one time
    owener: candid::Principal,     //owner of this proposal
}

//we will instaialize approve , reject , pass = 0
//voted : cannot be changed
//owner : will come from the message

//so this the only feilds that needs to change
//create proposal -> input for our edit and create proposal functions
#[derive(CandidType, Deserialize)]
struct CreateProposal {
    description: String,
    is_active: bool,
}

//impl our traits
impl Storable for Proposal {
    //serializing our data to bytes to store on the stable memory
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    //deserializing back so that we can have our variable back
    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    //New part
    //can grow and shrink
    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}

//impl our memory
thread_local! {
//using memory mangers to craere more than one memory virtually
//0 index out of 256
static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>>=RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

//create proposal map that is going to hold our proposals
//key
static PROPOASAL_MAP : RefCell<StableBTreeMap<u64,Proposal,Memory>>=RefCell::new(StableBTreeMap::init(
    //this memory manager here handle our memory locations
    MEMORY_MANAGER.with(|m|m.borrow().get(MemoryId::new(0)))
));
}

#[ic_cdk::query]
fn get_proposal(key: u64) -> Option<Proposal> {
    PROPOASAL_MAP.with(|p| p.borrow().get(&key))
}

// to know how many proposals we have
#[ic_cdk::query]
fn get_proposal_count() -> u64 {
    PROPOASAL_MAP.with(|p| p.borrow().len())
}

#[ic_cdk::update] //that's why we create 2nd struct
fn create_proposal(key: u64, proposal: CreateProposal) -> Option<Proposal> {
    //data that return to us is the one that was before we inserted
    let value: Proposal = Proposal {
        description: proposal.description,
        approve: 0u32,
        reject: 0u32,
        pass: 0u32,
        is_active: proposal.is_active,
        voted: vec![],            //empty vec
        owener: ic_cdk::caller(), //retrieves the principal of the user (or canister) that called the function.
    };
    //borrow_mut as we want to alter the data
    PROPOASAL_MAP.with(|p| p.borrow_mut().insert(key, value))
}

//we make those functions after enums
//Edit proposal for owner of the proposal
#[ic_cdk::update]
fn edit_propopsal(key: u64, proposal: CreateProposal) -> Result<(), VoteError> {
    //leave it empty error
    PROPOASAL_MAP.with(|p| {
        //retreive the propsal with the given key
        let old_proposal_opt = p.borrow().get(&key);
        let old_proposal = match old_proposal_opt {
            Some(value) => value,
            None => return Err(VoteError::NoSuchProposal),
        };

        //check if caller is owner
        //not =
        if ic_cdk::caller() != old_proposal.owener {
            //block this user
            return Err(VoteError::AccessRejected);
        }

        //if user is the owner
        //will edit
        let value: Proposal = Proposal {
            description: proposal.description,
            is_active: proposal.is_active,
            // approve : old_proposal.approve,
            // reject:old_proposal.reject,
            // pass : old_proposal.pass,
            //owner : ic_cdk::caller(),
            //instead write
            ..old_proposal
        };

        //we have new values it's time to insert it
        let res = p.borrow_mut().insert(key, value); //Option so

        match res {
            Some(_) => Ok(()), //what will be returned
            //smth happen while inserting
            None => Err(VoteError::UpdateError),
        }
    }) //if I put comma here or in last match will give error in return result
}

//user end proposal
#[ic_cdk::update]
fn end_propopsal(key: u64) -> Result<(), VoteError> {
    PROPOASAL_MAP.with(|p| {
        //retreive the propsal with the given key
        let old_proposal_opt = p.borrow().get(&key);
        //mut so I can updated it down
        let mut old_proposal = match old_proposal_opt {
            Some(value) => value,
            None => return Err(VoteError::NoSuchProposal),
        };

        //check if caller is owner
        //not =
        if ic_cdk::caller() != old_proposal.owener {
            //block this user
            return Err(VoteError::AccessRejected);
        }

        old_proposal.is_active = false;

        //we have new values it's time to insert it
        let res = p.borrow_mut().insert(key, old_proposal); //Option so

        match res {
            Some(_) => Ok(()), //what will be returned
            //smth happen while inserting
            None => Err(VoteError::UpdateError),
        }
    }) //if I put comma here or in last match will give error in return result
}

#[ic_cdk::update]
fn vote(key: u64, choice: Choice) -> Result<(), VoteError> {
    PROPOASAL_MAP.with(|p| {
        let proposal_opt = p.borrow().get(&key);
        let mut proposal = match proposal_opt {
            Some(value) => value,
            None => return Err(VoteError::NoSuchProposal),
        };

        let caller = ic_cdk::caller();
        //check this user(address) has voted before or not
        if proposal.voted.contains(&caller) {
            return Err(VoteError::AlreadyVoted);
        }
        //if is active
        else if proposal.is_active == false {
            return Err(VoteError::ProposalIsNotActive);
        }

        //enum //cant be another choice than those ex: error
        match choice {
            Choice::Approve => proposal.approve += 1,
            Choice::Reject => proposal.reject += 1,
            Choice::Pass => proposal.pass += 1,
        };

        //after voting push caller in voted vector
        proposal.voted.push(caller);

        let res = p.borrow_mut().insert(key, proposal);
        match res {
            Some(_) => Ok(()),
            None => return Err(VoteError::UpdateError),
        }
    })
}
