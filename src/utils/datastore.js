
import { toWebStream } from "./streams";

class Datastore {

  constructor(options){
    this.did = options.did;
    this.dwn = options.web5.dwn;
    this.ready = new Promise(resolve => {
      this.getProtocol().then(async response => {
        if (response.protocols.length) {
          console.log('existing');
          resolve();
        }
        else {
          console.log('new');
          this.setProtocol().then(z => resolve());
        }
      })
    })
  }

  protocolUri = 'https://developer.tbd.website/protocols/5lides';
  deckSchema = 'https://developer.tbd.website/protocols/5lides/deck';

  getProtocol(){
    return this.dwn.protocols.query({
      message: {
        filter: {
          protocol: this.protocolUri
        }
      }
    });
  }

  setProtocol(){
    return this.dwn.protocols.configure({
      message: {
        definition: {
          protocol: this.protocolUri,
          types: {
            deck: {
              schema: this.deckSchema,
              dataFormats: ['application/json']
            },
            image: {
              dataFormats: ['image/gif', 'image/x-png', 'image/jpeg']
            }
          },
          structure: {
            deck: {},
            image: {}
          }
        }
      }
    });
  }
  async createDeck(json, format){
    const { record } = await this.dwn.records.create({
      data: json,
      message: {
        protocol: this.protocolUri,
        protocolPath: 'deck',
        schema: this.deckSchema,
        dataFormat: 'application/json'
      }
    });
    record.json = await record.data.json();
    return record;
  }

  async getDeck(deckId){
    const { record, status } = await this.dwn.records.read({
      message: {
        recordId: deckId
      }
    });
    if (status.code !== 200) return false;
    record.deckData = await record.data.json();
    return record;
  }

  async getDecks(){
    const { records } = await this.dwn.records.query({
      message: {
        filter: {
          protocol: this.protocolUri,
          schema: this.deckSchema
        }
      }
    });
    return Promise.all(records.map(async entry => {
      const json = await entry.data.json()
      entry.deckData = json;
      return entry;
    }))
  }

  async createImage(file, format){
    const { record } = await this.dwn.records.create({
      data: file,
      message: {
        protocol: this.protocolUri,
        protocolPath: 'image',
        dataFormat: format
      }
    });
    record.blobUrl = URL.createObjectURL(await record.data.blob());
    return record;
  }

  async getImage(imageId){
    const { record } = await this.dwn.records.read({
      message: {
        recordId: imageId
      }
    });
    if (!record) return;
    record.blobUrl = URL.createObjectURL(await record.data.blob());
    return record;
  }

}


export {
  Datastore
}