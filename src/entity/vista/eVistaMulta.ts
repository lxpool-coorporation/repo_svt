import { enumMeteoTipo } from '../enum/enumMeteoTipo';
import { eVistaTratta } from './eVistaTratta';
import { eVistaVeicolo } from './eVistaVeicolo';

class eVistaMulta {
  //id numerico, Multa, veicolo, id_path_bollettino
  private id: number;
  private tratta: eVistaTratta;
  private veicolo: eVistaVeicolo;
  private meteo: enumMeteoTipo;
  private velocita_media: number;
  private velocita_delta: number;

  constructor(
    id: number,
    tratta: eVistaTratta,
    veicolo: eVistaVeicolo,
    meteo: enumMeteoTipo,
    velocita_media: number,
    velocita_delta: number,
  ) {
    this.id = id;
    this.tratta = tratta;
    this.veicolo = veicolo;
    (this.meteo = meteo), (this.velocita_media = velocita_media);
    this.velocita_delta = velocita_delta;
  }

  static fromJSON(data: any): eVistaMulta {
    return new eVistaMulta(
      data.id,
      data.tratta,
      data.veicolo,
      data.meteo,
      data.velocita_media,
      data.velocita_delta,
    );
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_tratta(): eVistaTratta {
    return this.tratta;
  }
  get_veicolo(): eVistaVeicolo {
    return this.veicolo;
  }
  get_meteo(): enumMeteoTipo | null {
    return this.meteo;
  }
  get_velocita_media(): number | null {
    return this.velocita_media;
  }
  get_velocita_delta(): number | null {
    return this.velocita_delta;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_tratta(tratta: eVistaTratta): void {
    this.tratta = tratta;
  }
  set_veicolo(veicolo: eVistaVeicolo): void {
    this.veicolo = veicolo;
  }
  set_meteo(meteo: enumMeteoTipo): void {
    this.meteo = meteo;
  }
  set_velocita_media(velocita_media: number): void {
    this.velocita_media = velocita_media;
  }
}

export { eVistaMulta };
