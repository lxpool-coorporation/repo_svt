import { enumProfilo } from "../enum/enumProfilo"
import { enumStato } from "../enum/enumStato"

class eUtenteProfilo{
    
    //id numerico, id_utente, id_profilo, id_stato
    private id:number
    private id_utente:number
    private id_profilo:number
    private id_stato:number
    
    constructor(id:number, id_utente:number, id_profilo:number, id_stato:number)
    {
        this.id = id
        this.id_utente = id_utente
        this.id_profilo = id_profilo
        this.id_stato = id_stato
    }

    // Metodi Getters
    get_id(): number{
        return this.id
    }
    get_id_utente(): number{
        return this.id_utente
    }
    get_id_profilo(): number{
        return this.id_profilo
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
    // Nuovo metodo per restituire la stringa dell'enum
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
    set_id_utente(id_utente: number): void{
        this.id_utente = id_utente;
    }
    set_id_profilo(id_profilo: number): void{
        this.id_profilo = id_profilo;
    }
    set_idStato(id_stato: number): void{
        this.id_stato = id_stato;
    }

}

export { eUtenteProfilo };