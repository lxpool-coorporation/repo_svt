import { enumMeteoTipo } from '../enum/enumMeteoTipo';
import { enumTransitoStato } from '../enum/enumTransitoStato';

class eTransito {
  //attributi transito varco
  private id: number;
  private data_transito: Date;
  private speed: number | null;
  private speed_real: number | null;
  private id_varco: number;
  private meteo: enumMeteoTipo | null;
  private id_veicolo: number | null;
  private path_immagine: string | null;
  private stato: enumTransitoStato;

  constructor(builder: eTransitoBuilder) {
    this.id = builder.id!;
    this.data_transito = builder.data_transito!;
    this.speed = builder.speed ?? null;
    this.speed_real = builder.speed_real ?? null;
    this.id_varco = builder.id_varco!;
    this.meteo = builder.meteo ?? null;
    this.id_veicolo = builder.id_veicolo ?? null;
    this.path_immagine = builder.path_immagine ?? null;
    this.stato = builder.stato!;
  }

  // Metodo statico fromJSON per creare un'istanza da JSON
  static fromJSON(data: any): eTransito {
    return new eTransitoBuilder()
      .setId(data.id)
      .setDataTransito(new Date(data.data_transito)) // Assicurati di convertire la data in un oggetto Date
      .setSpeed(data.speed ?? null)
      .setSpeedReal(data.speed_real ?? null)
      .setIdVarco(data.id_varco)
      .setMeteo(data.meteo ?? null)
      .setIdVeicolo(data.id_veicolo ?? null)
      .setpath_immagine(data.path_immagine ?? null)
      .setStato(data.stato)
      .build(); // Costruisce l'oggetto usando il Builder
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_data_transito(): Date {
    return this.data_transito;
  }
  get_speed(): number | null {
    return this.speed;
  }
  get_speed_real(): number | null {
    return this.speed_real;
  }
  get_id_varco(): number {
    return this.id_varco;
  }
  get_meteo(): enumMeteoTipo | null {
    return this.meteo;
  }
  get_id_veicolo(): number | null {
    return this.id_veicolo;
  }
  get_path_immagine(): string | null {
    return this.path_immagine;
  }
  get_stato(): enumTransitoStato {
    return this.stato;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_data_transito(data_transito: Date): void {
    this.data_transito = data_transito;
  }
  set_speed(speed: number): void {
    this.speed = speed;
  }
  set_speed_real(speed_real: number): void {
    this.speed_real = speed_real;
  }
  set_id_varco(id_varco: number): void {
    this.id_varco = id_varco;
  }
  set_meteo(meteo: enumMeteoTipo) {
    this.meteo = meteo;
  }
  set_id_veicolo(id_veicolo: number): void {
    this.id_veicolo = id_veicolo;
  }
  set_path_immagine(path_immagine: string) {
    this.path_immagine = path_immagine;
  }
  set_stato(stato: enumTransitoStato): void {
    this.stato = stato;
  }
}

class eTransitoBuilder {
  public id?: number;
  public data_transito?: Date;
  public speed?: number | null;
  public speed_real?: number | null;
  public id_varco?: number;
  public meteo?: enumMeteoTipo | null;
  public id_veicolo?: number | null;
  public path_immagine?: string | null;
  public stato?: enumTransitoStato;

  // Metodi del builder per impostare i valori
  setId(id: number): eTransitoBuilder {
    this.id = id;
    return this;
  }

  setDataTransito(data_transito: Date): eTransitoBuilder {
    this.data_transito = data_transito;
    return this;
  }

  setSpeed(speed: number | null | undefined): eTransitoBuilder {
    this.speed = speed;
    return this;
  }

  setSpeedReal(speed_real: number | null | undefined): eTransitoBuilder {
    this.speed_real = speed_real;
    return this;
  }

  setIdVarco(id_varco: number): eTransitoBuilder {
    this.id_varco = id_varco;
    return this;
  }

  setMeteo(meteo: enumMeteoTipo | null | undefined): eTransitoBuilder {
    this.meteo = meteo;
    return this;
  }

  setIdVeicolo(id_veicolo: number | null | undefined): eTransitoBuilder {
    this.id_veicolo = id_veicolo;
    return this;
  }

  setpath_immagine(path_immagine: string | null | undefined): eTransitoBuilder {
    this.path_immagine = path_immagine;
    return this;
  }

  setStato(stato: enumTransitoStato): eTransitoBuilder {
    this.stato = stato;
    return this;
  }

  // Metodo finale per costruire l'oggetto
  build(): eTransito {
    if (
      this.id === undefined ||
      this.data_transito === undefined ||
      this.id_varco === undefined ||
      this.stato === undefined
    ) {
      throw new Error(
        'I campi obbligatori (id, data_transito, id_varco, stato) non sono stati impostati.',
      );
    }
    return new eTransito(this);
  }
}

export { eTransito, eTransitoBuilder };
