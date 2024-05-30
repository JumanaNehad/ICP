import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Choice = { 'Approve' : null } |
  { 'Pass' : null } |
  { 'Reject' : null };
export interface CreateProposal {
  'description' : string,
  'is_active' : boolean,
}
export interface Proposal {
  'reject' : number,
  'owener' : Principal,
  'voted' : Array<Principal>,
  'pass' : number,
  'approve' : number,
  'description' : string,
  'is_active' : boolean,
}
export type Result = { 'Ok' : null } |
  { 'Err' : VoteError };
export type VoteError = { 'AlreadyVoted' : null } |
  { 'UpdateError' : null } |
  { 'ProposalIsNotActive' : null } |
  { 'AccessRejected' : null } |
  { 'NoSuchProposal' : null };
export interface _SERVICE {
  'create_proposal' : ActorMethod<[bigint, CreateProposal], [] | [Proposal]>,
  'edit_propopsal' : ActorMethod<[bigint, CreateProposal], Result>,
  'end_propopsal' : ActorMethod<[bigint], Result>,
  'get_proposal' : ActorMethod<[bigint], [] | [Proposal]>,
  'get_proposal_count' : ActorMethod<[], bigint>,
  'vote' : ActorMethod<[bigint, Choice], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
