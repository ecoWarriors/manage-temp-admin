import {
    DirectSecp256k1HdWallet,
  } from "@cosmjs/proto-signing";
  import { RegenApi } from "@regen-network/api";
  import {
    MsgGrant,
  } from "@regen-network/api/lib/generated/cosmos/authz/v1beta1/tx.js";
  import { GenericAuthorization } from "@regen-network/api/lib/generated/cosmos/authz/v1beta1/authz";
  import { admin } from "./constant";
  
  const main = async () => {
    if (!admin) {
      console.log("Input admin key correctly.");
      return;
    }
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(admin, {
      prefix: "regen",
    });
    const [account] = await signer.getAccounts();
    const regenApi = await RegenApi.connect({
      connection: {
        type: "tendermint",
        endpoint: "http://mainnet.regen.network:26657/",
        signer,
      },
    });
  
    // grant permission
    const TEST_MSG_GRANT = MsgGrant.fromPartial({
      grant: {
        authorization: {
          typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
          value: Uint8Array.from(
            GenericAuthorization.encode({
              $type: "cosmos.authz.v1beta1.GenericAuthorization",
              msg: "/regen.ecocredit.v1.MsgRetire",
            }).finish()
          ),
        },
      },
      granter: account.address,
      grantee: "regen1rmqwdehx2kg4kgdu0dkt2m7jcp2qfys50l640q",
    });
  
    const TEST_FEE = {
      amount: [
        {
          denom: "uregen",
          amount: "5000",
        },
      ],
      gas: "200000",
    };
    const TEST_MEMO = "Retire credits";
  
    const { msgClient } = regenApi;
    if (!msgClient) {
      console.log("client error");
      return;
    }
    const signedTxBytes = await msgClient.sign(
      account.address,
      [TEST_MSG_GRANT],
      TEST_FEE,
      TEST_MEMO
    );
  
    const txRes = await msgClient.broadcast(signedTxBytes);
    console.log(txRes);
  };
  
  main();
  