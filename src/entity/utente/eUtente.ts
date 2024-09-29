import { enumProfilo } from "../enum/enumProfilo"
import { enumStato } from "../enum/enumStato"

class eUtente{
    
    //id numerico, id_profilo, codice_fiscale, id_stato
    private id:number
    private id_profilo:number
    private codice_fiscale:string
    private id_stato:number
    
    constructor(id:number, id_profilo:number, codice_fiscale:string, id_stato:number)
    {
        this.id = id
        this.id_profilo = id_profilo
        this.codice_fiscale = codice_fiscale
        this.id_stato = id_stato
    }

    // Metodi Getters
    get_id(): number{
        return this.id
    }
    get_idProfilo(): number{
        return this.id_profilo
    }
    get_codiceFiscale(): string{
        return this.codice_fiscale
    }
    get_idStato(): number{
        return this.id_stato
    }

    // Nuovo metodo per restituire la stringa dell'enumProfilo
    get_profilo(): string {
        switch (this.id_profilo) {
            case enumProfilo.operatore:
                return 'operatore';
            case enumProfilo.automobilista:
                return 'automobilista';
            default:
                return 'indefinito';
        }
    }
    // Nuovo metodo per restituire la stringa dell'enumStato
    get_stato(): string {
        switch (this.id_stato) {
            case enumStato.attivo:
                return 'attivo';
            case enumStato.disattivo:
                return 'disattivo';
            default:
                return 'indefinito';
        }
    }

    // Metodi Setters
    set_id(id: number): void{
        this.id = id
    }
    set_idProfilo(id_profilo: number): void{
        this.id_profilo = id_profilo;
    }
    set_codiceFiscale(codice_fiscale: string): void{
        this.codice_fiscale = codice_fiscale;
    }
    set_idStato(id_stato: number): void{
        this.id_stato = id_stato;
    }

}

export { eUtente };