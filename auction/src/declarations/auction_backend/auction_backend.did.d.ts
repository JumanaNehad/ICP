import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Bid { 'amount' : bigint, 'bidder' : Principal }
export interface Item {
  'owner' : Principal,
  'name' : string,
  'description' : string,
  'is_active' : boolean,
  'new_owner' : [] | [Principal],
  'highest_bid' : bigint,
}
export type Result = { 'Ok' : null } |
  { 'Err' : string };
export interface _SERVICE {
  'bid_on_item' : ActorMethod<[bigint, bigint], Result>,
  'get_highest_sold_item' : ActorMethod<[], [] | [Item]>,
  'get_item' : ActorMethod<[bigint], [] | [Item]>,
  'get_items' : ActorMethod<[], Array<Item>>,
  'get_items_count' : ActorMethod<[], bigint>,
  'get_most_bidded_item' : ActorMethod<[], [] | [Item]>,
  'list_item' : ActorMethod<[bigint, string, string], Result>,
  'stop_listing' : ActorMethod<[bigint], Result>,
  'update_listing' : ActorMethod<[bigint, string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
