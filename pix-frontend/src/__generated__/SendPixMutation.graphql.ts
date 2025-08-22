/**
 * @generated SignedSource<<b8eff04cd4b92745ada2e5269ed0de9b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SendPixMutation$variables = {
  pixKey: string;
  value: number;
};
export type SendPixMutation$data = {
  readonly sendPix: string | null | undefined;
};
export type SendPixMutation = {
  response: SendPixMutation$data;
  variables: SendPixMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "pixKey"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "value"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "pixKey",
        "variableName": "pixKey"
      },
      {
        "kind": "Variable",
        "name": "value",
        "variableName": "value"
      }
    ],
    "kind": "ScalarField",
    "name": "sendPix",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SendPixMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SendPixMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "772d6aa2d458bc44c3f1e2e5bef240ab",
    "id": null,
    "metadata": {},
    "name": "SendPixMutation",
    "operationKind": "mutation",
    "text": "mutation SendPixMutation(\n  $pixKey: String!\n  $value: Float!\n) {\n  sendPix(pixKey: $pixKey, value: $value)\n}\n"
  }
};
})();

(node as any).hash = "91151dbd30c7cad606241d6ea71bb93b";

export default node;
