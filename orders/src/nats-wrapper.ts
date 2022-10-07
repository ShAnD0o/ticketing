// to make nats connection like mongoose at (index.ts)
import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  // ( _ & ? ) : because we Not define client in costructor
  private _client?: Stan;

  // we put this func.(to define client in other files) because client at new.ts was Error
  get client() {
    if (!this._client) {
      throw new Error("CanNot access NATS client before connectiong ... ");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS ...");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
