const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;

    }
}

class TicketControl {
    constructor() {
        this.ultimoTicket = 0;
        this.diaDeHoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4Tickets = [];

        let data = require('../data/data.json');

        if (data.diaDeHoy === this.diaDeHoy) {
            this.ultimoTicket = data.ultimoTicket;
            this.tickets = data.tickets;
            this.ultimos4Tickets = data.ultimos4Tickets;

        } else {
            this.reinciarConteo();

        }
    }

    siguienteTicket() {
        this.ultimoTicket += 1;
        let ticket = new Ticket(this.ultimoTicket, null);
        this.tickets.push(ticket);
        this.grabarArchivo();

        return `Ticket ${this.ultimoTicket}`;
    }

    getUltimoTicket() {
        return `Ticket ${this.ultimoTicket}`;
    }

    getUltimos4() {
        return this.ultimos4Tickets;
    }


    atenderTicket(escritorio) { //Recibimos un escritorio que es quien atendera el ticket
        //Validamos que hayan tickets por atender
        if (this.tickets.length === 0) {
            return 'No hay tickets';
        }

        //Extraemos el numero para romper la relacion que tiene js, en relacion a que todos los objetos son pasados por referencia
        let numeroTicket = this.tickets[0].numero;
        //Elimino la primera posicion del arreglo
        this.tickets.shift();

        //Se crea un nuevo ticket que es el que se va atender que incluye el numero del ticket y el escritorio en el que sera atendido
        let atenderTicket = new Ticket(numeroTicket, escritorio);

        //Agregamos el ticket al inicio del arreglo
        this.ultimos4Tickets.unshift(atenderTicket);

        //Se verifica que solo existan 4 tickets en ese arreglo, 
        if (this.ultimos4Tickets.length > 4) {
            this.ultimos4Tickets.splice(-1, 1); //Borra el ultimo ticket
        }

        console.log('Ultimos 4');
        console.log(this.ultimos4Tickets);

        //Se guarda el archivo    
        this.grabarArchivo();

        //Se regresa el ticket que quiero atender
        return atenderTicket;


    }

    reinciarConteo() {
        this.ultimoTicket = 0;
        this.tickets = [];
        this.ultimos4Tickets = [];
        console.log('Se ha inicializado el sistema');
        this.grabarArchivo();

    }

    grabarArchivo() {

        let jsonData = {
            ultimoTicket: this.ultimoTicket,
            diaDeHoy: this.diaDeHoy,
            tickets: this.tickets,
            ultimos4Tickets: this.ultimos4Tickets
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }

}

module.exports = {
    TicketControl
}