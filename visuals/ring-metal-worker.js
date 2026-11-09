import {createMetalData} from './ring-metal-data.js';
import {decodeLighting} from './ring-lighting-data.js';
self.onmessage=async event=>{
 try{
  const loading=decodeLighting(event.data);
  const maps=createMetalData(),environment=await loading;
  self.postMessage({maps,environment},[environment.data.buffer,...Object.values(maps).map(array=>array.buffer)]);
 }catch{self.postMessage({error:true});}
};
