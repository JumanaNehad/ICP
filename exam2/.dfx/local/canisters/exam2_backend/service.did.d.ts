import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Exam { 'out_of' : number, 'curve' : number, 'course' : string }
export interface _SERVICE {
  'get_exam' : ActorMethod<[bigint], [] | [Exam]>,
  'get_participation' : ActorMethod<[bigint], [] | [bigint]>,
  'insert_exam' : ActorMethod<[bigint, Exam], [] | [Exam]>,
  'insert_participation' : ActorMethod<[bigint, bigint], [] | [bigint]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
