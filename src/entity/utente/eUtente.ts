import { enumStato } from "../enum/enumStato"

class eUtente{
    
    //id numerico, profilo, codice_fiscale, id_stato
    private id:number
    private codice_fiscale:string
    private stato:enumStato
    
    constructor(id:number, codice_fiscale:string, stato:enumStato)
    {
        this.id = id
        this.codice_fiscale = codice_fiscale
        this.stato = stato
    }

    // Metodi Getters
    get_id(): number{
        return this.id
    }
    get_codiceFiscale(): string{
        return this.codice_fiscale
    }
    get_stato(): enumStato{
        return this.stato
    }

    // Metodi Setters
    set_id(id: number): void{
        this.id = id
    }
    set_codiceFiscale(codice_fiscale: string): void{
        this.codice_fiscale = codice_fiscale;
    }
    set_stato(stato: enumStato): void{
        this.stato = stato;
    }

}

export { eUtente };