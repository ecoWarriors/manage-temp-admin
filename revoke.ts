import {
    DirectSecp256k1HdWallet,
    // DirectSecp256k1Wallet,
  } from "@cosmjs/proto-signing";
  import { RegenApi } from "@regen-network/api";
  import {
    MsgRevoke,
  } from "@regen-network/api/lib/generated/cosmos/authz/v1beta1/tx.js";
  import { admin } from "./constant";
  import { grantee } from "./constant";
  
  const main = async () => {
    if (!admin || !grantee) {
        console.log("Input admin private key or grantee pubkey correctly.");
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
  
    // revoke permission
    const TEST_MSG_REVOKE = MsgRevoke.fromPartial({
      msgTypeUrl: "/regen.ecocredit.v1.MsgRetire",
      granter: account.address,
      grantee,
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
      [TEST_MSG_REVOKE],
      TEST_FEE,
      TEST_MEMO
    );
  
    const txRes = await msgClient.broadcast(signedTxBytes);
    console.log(txRes);
  };
  
  main();
  