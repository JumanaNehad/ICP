export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Item = IDL.Record({
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'is_active' : IDL.Bool,
    'new_owner' : IDL.Opt(IDL.Principal),
    'highest_bid' : IDL.Nat64,
  });
  return IDL.Service({
    'bid_on_item' : IDL.Func([IDL.Nat64, IDL.Nat64], [Result], []),
    'get_highest_sold_item' : IDL.Func([], [IDL.Opt(Item)], ['query']),
    'get_item' : IDL.Func([IDL.Nat64], [IDL.Opt(Item)], ['query']),
    'get_items' : IDL.Func([], [IDL.Vec(Item)], ['query']),
    'get_items_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_most_bidded_item' : IDL.Func([], [IDL.Opt(Item)], ['query']),
    'list_item' : IDL.Func([IDL.Nat64, IDL.Text, IDL.Text], [Result], []),
    'stop_listing' : IDL.Func([IDL.Nat64], [Result], []),
    'update_listing' : IDL.Func([IDL.Nat64, IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
