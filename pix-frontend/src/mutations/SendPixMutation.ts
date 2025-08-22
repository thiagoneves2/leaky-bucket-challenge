import { graphql, useMutation } from 'react-relay';
import type { SendPixMutation as SendPixMutationType } from '../__generated__/SendPixMutation.graphql';

export const sendPixGQL = graphql`
  mutation SendPixMutation($pixKey: String!, $value: Float!) {
    sendPix(pixKey: $pixKey, value: $value)
  }
`;

export function useSendPix() {
  const [commit, inFlight] = useMutation<SendPixMutationType>(sendPixGQL);
  return { commit, inFlight };
}
