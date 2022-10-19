//VARIABLES Y SELECTORES
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')


//EVENTOS
eventListener()

function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGastos)

}


//CLASES
class Presupuesto {
    constructor(presupuesto){

        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []

    }

    nuevoGasto (gasto){
        this.gastos = [ ...this.gastos, gasto ]
        this.calcularRestante()
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
        
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante();
    }

}

class UI{
    //esta clase no requiere cosntructor, solo realiza el HTML

    //metodos
    instanciasPresupuesto (cantidad){

        //extraemos el valor
        const { presupuesto, restante } = cantidad;

        //inyectamos los valores al html
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    
    imprimirAlerta(mensaje, tipo){
        //creamos el div para la alerta
        const divMensaje  = document.createElement('div')
        divMensaje.classList.add('text-center', 'alert')

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else {
            divMensaje.classList.add('alert-success')
        }
        //mensaje de error
        divMensaje.textContent = mensaje

        //inyectamos el html
        document.querySelector('.primario').insertBefore( divMensaje, formulario )

        //quitar error del mensaje
        setTimeout(()=>{
            divMensaje.remove();
        }, 2000)
    }

    mostrarGaatos(gastos){
        
        this.limpiarHTML() //elimina el html previo
        //iteramos sobre los gastos
        gastos.forEach(gasto => {  

            const {cantidad, nombre, id } = gasto;

            //creamos un li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            console.log(nuevoGasto);

            //agregar html del gasto
            nuevoGasto.innerHTML= `${nombre} <span class='badge badge-primary badge-pill'>${cantidad}</span>`

            //btn para eliminar el gasto
            const btnBorrar = document.createElement('button');
            
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregar al HTML
            gastoListado.appendChild(nuevoGasto)

        })
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante
    }

    comprobarPresupuesto(presupuestObj){
        const { presupuesto, restante } = presupuestObj
        const restanteDiv = document.querySelector('.restante')
        //comprobar el 25%
        if( ( presupuesto / 4 ) > restante ) {
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-danger');

        } else if( (presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
            
        }

        if( restante <= 0 ){
            ui.imprimirAlerta('Presupuesto Agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true
         }
    }

}


//INSTANCIAS
const ui = new UI()
let presupuesto;

//FUNCIONES
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?')

   
    //validamos la entrada de datos
    if(!presupuestoUsuario || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        //este metodo me recarga la pagina actual
        window.location.reload()
    }
    

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuesto);

    ui.instanciasPresupuesto(presupuesto)

}

//añadir gastos
function agregarGastos(e){
    e.preventDefault();

    //leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    console.log(nombre, cantidad);

    //validaciones de los inputs

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if( cantidad <=0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no validad', 'error')
        return
    }
    
    //generamos un obejto con el tipo de gasto
    //esta sintaxis es contrario a un destructuring 

    const gasto = {nombre, cantidad, id: Date.now()} 

    //añadir nuevo gasto
    presupuesto.nuevoGasto(gasto)

    //mensaje correcto
    ui.imprimirAlerta('Gasto Agregado de forma correcta')

    //renderizar los gastos
    const {gastos, restante} = presupuesto

    ui.mostrarGaatos(gastos)
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto)


    //reiniciamos el formulario depues de agregar un gasto
    formulario.reset()
    
}
 
function eliminarGasto(id) {
    //elimina de la clase
    presupuesto.eliminarGasto(id)

    //elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGaatos(gastos)
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto)

}