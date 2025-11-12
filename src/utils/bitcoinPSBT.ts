export interface CreateSelfSendRequest {
  txid: string;
  vout: number;
  address: string;
  amountBtc: number;
  feeSats?: number;
}

export interface PSBTResponse {
  psbt: string;
}

export interface RPCRequest {
  method: string;
  params?: any[];
}

export interface RPCResponse {
  result: any;
}

export async function createSelfSendPSBT(
  request: CreateSelfSendRequest
): Promise<string> {
  const response = await fetch('/api/bitcoin/createSelfSend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create PSBT');
  }

  const data: PSBTResponse = await response.json();
  return data.psbt;
}

export async function callBitcoinRPC(
  method: string,
  params: any[] = []
): Promise<any> {
  const response = await fetch('/api/bitcoin/rpc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ method, params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'RPC call failed');
  }

  const data: RPCResponse = await response.json();
  return data.result;
}

export async function getAddressUTXOs(address: string): Promise<any[]> {
  try {
    const utxos = await callBitcoinRPC('scantxoutset', [
      'start',
      [`addr(${address})`],
    ]);
    return utxos.unspents || [];
  } catch (error) {
    console.error('Failed to get UTXOs:', error);
    return [];
  }
}

export async function finalizePSBT(psbtBase64: string): Promise<{
  hex: string;
  complete: boolean;
}> {
  const result = await callBitcoinRPC('finalizepsbt', [psbtBase64]);
  return result;
}

export async function broadcastTransaction(txHex: string): Promise<string> {
  const txid = await callBitcoinRPC('sendrawtransaction', [txHex]);
  return txid;
}

export function verifyBitcoinAddress(address: string): boolean {
  const btcRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/;
  return btcRegex.test(address);
}
