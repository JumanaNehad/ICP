export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_question' : IDL.Func([], [IDL.Text], ['query']),
    'get_votes' : IDL.Func([], [IDL.Text], ['query']),
    'reset_votes' : IDL.Func([], [IDL.Text], []),
    'vote' : IDL.Func([IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
