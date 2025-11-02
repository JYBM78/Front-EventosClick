import { SillaDTO } from "./Silladto"

export interface LocalidadDTO {
  nombre:string,
  precio:number,
  capacidadMaxima:number
  sillas:SillaDTO[];
}
