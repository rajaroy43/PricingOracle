import web3 from "web3";

class TransactionSender {
  client: web3;
  chainId: any;
  constructor(client: web3, config: any) {
    this.client = client;
    this.chainId = null;
  }

  async getNonce(address: string): Promise<number> {
    return await this.client.eth.getTransactionCount(address, "pending");
  }

  numberToHexString(number: string): string {
    if (!number) {
      return "0x0";
    }
    return `0x${Math.ceil(parseInt(number)).toString(16)}`;
  }

  async getGasLimit(rawTx: {
    gasPrice: any;
    value: any;
    to: any;
    data: any;
    from: any;
    nonce?: string;
    r?: number;
    s?: number;
  }): Promise<number> {
    let estimatedGas = await this.client.eth.estimateGas({
      gasPrice: rawTx.gasPrice,
      value: rawTx.value,
      to: rawTx.to,
      data: rawTx.data,
      from: rawTx.from,
    });

    return estimatedGas;
  }
}
export default TransactionSender;
