import { Component } from "./Components.js";
import { d, jsonURL, $graciasCompraPantalla, $pagar, $botonAgregar, $categoriasIl } from "./global.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2/+esm'

let cLastState, listaArticulosCompleta, categoriasList = [];
const mainArticulos = new Component({
    el: "#catalogo",
    data: {
        listaArticulos: []
    },
    template: function (props) {
        if (props.listaArticulos.length < 1) {
            return '<p>No hay productos en existencia</p>'
        }

        let templateItems = props.listaArticulos.map(item => `<div id = "${item.sku}"class ="articulo-tienda">
            <img src="${item.imagen}" alt="${item.descripcion}">
            <button class="btn-agregar"type="submit">Agregar</button>
            <h2>${item.nombre}</h2>
            <p class='price'>$${item.precio}</p>
            <p>${item.descripcion}</p>
            </div>`).join("");
        return templateItems;
    },
});

const carrito = new Component({
    el: "#carrito",
    data: {
        articulosCarro: [],
        estadoCarro: {
            cantidadArticulos: 0,
            precioTotal: 0,
        }
    },
    template: function (props) {
        if (props.articulosCarro.length < 1) {
            return '<p>Aun no hay productos en el carrito</p>'
        }

        let templateItems = props.articulosCarro.map(item => `<div id = "${item.sku}"class ="articulo-carro">
            <img src="${item.imagen}" alt="${item.descripcion}">
            <h2>${item.nombre}</h2>
            <p>${item.cantidadCarro}</p>
            <p class='price'>$${item.precio}</p>
            <button class="btn-eliminar"type="submit">Eliminar</button>
            </div>`).join("");
        let templeteEstadoCarro = `<section>
            <p>Articulos en el carro: ${props.estadoCarro.cantidadArticulos}</p>
            <p>Total: $${props.estadoCarro.precioTotal}</p>
            <button id ="btn_vaciar" type ="submit">Vaciar Carrito</button>
            <button id="btn_pagar" type="submit">Pagar</button>
            </section>
            `
        templateItems += templeteEstadoCarro;
        return templateItems;
    }
});

const categorias = new Component({
    el: "#categorias-element",
    data: {
        listaArticulos: []
    },
    template: function (props) {
        if (props.listaArticulos.length < 1) {
            return `<a href="#">( Vacio )</a>`
        }
        let templateCategorias = props.listaArticulos.map(item => `
            <a href="#${item}" id="${item}">${item}</a>`).join("");

        return `<a href="#todo" id= "todo">Mostrar todo</a>` + templateCategorias;
    },

});

const historial = new Component({
    el: "#tabla-historial",
    data: {
        registros: []
    },
    template: function (props) {
        if (props.registros < 1) {
            return `<p style="text-align:center">Historial de compras vacio</p>`
        }
        let template = props.registros.map(item => `
                <tr>
                    <td class="tg-0lax">${item.id}</td>
                    <td class="tg-0lax">${item.carrito.estadoCarro.cantidadArticulos}</td>
                    <td class="tg-0lax">$${item.carrito.estadoCarro.precioTotal}</td>
                    <td class="tg-0lax">${item.fecha}</td>
                </tr>`).join("");
        const boton = '<button type = "button" id = "borrar-historial">Borrar historial</button>'
        return template + boton;
    },
})

d.addEventListener('DOMContentLoaded', e => {
    fetch(jsonURL, {

    }).then((res) => {
        return res.ok ? res.json() : Promise.reject(res);
    }).then((jsonres) => {
        const lastState = mainArticulos.getState();
        categoriasList = categorias.getState();
        jsonres.articulos.forEach(element => {
            lastState.listaArticulos.push(element);
            if (!categoriasList.listaArticulos.includes(element.categoria)) {

                categoriasList.listaArticulos.push(element.categoria);
            }
        });
        console.log(categoriasList.listaArticulos);
        categorias.setState({ listaArticulos: categoriasList.listaArticulos });
        mainArticulos.setState({ listaArticulos: lastState.listaArticulos });
        carrito.setState(JSON.parse(localStorage.getItem('articulosCarro')));
        leerHistorial();
        listaArticulosCompleta = mainArticulos.getState();
    }).catch((err) => {

        Swal.fire("Error al cargar el archivo JSON: ", err);
    })


});

d.addEventListener('click', e => {
    if (e.target.className === 'btn-agregar') {
        e.preventDefault();
        cLastState = carrito.getState();
        const sku = e.target.parentElement.id;
        const articulo = mainArticulos.getState();
        for (const key in articulo.listaArticulos) {
            if (articulo.listaArticulos[key].sku == sku) {

                const cartItem = cLastState.articulosCarro.find(p => p.sku === sku);
                if (!cartItem) {
                    articulo.listaArticulos[key].cantidadCarro = 1;
                    cLastState.articulosCarro.push(articulo.listaArticulos[key]);
                } else {
                    cLastState.articulosCarro.find(p => {
                        if (p.sku === sku) {
                            p.cantidadCarro++;
                        }
                    }
                    );
                }
                break;

            }
        }

        carrito.setState({ articulosCarro: cLastState.articulosCarro });
        carrito.setState({ estadoCarro: contarItemsCarrito() });
        localStorage.setItem('articulosCarro', JSON.stringify(carrito.getState()));
    }

    if (e.target.className === "btn-eliminar") {
        e.preventDefault();
        cLastState = carrito.getState();
        const IDcart = e.target.parentElement.id;
        const foundedItem = cLastState.articulosCarro.find(p => p.sku === IDcart);
        if (!foundedItem) {
            return;
        } else {
            cLastState.articulosCarro.find(p => {
                if (p?.sku === IDcart) {
                    const index = cLastState.articulosCarro.indexOf(p);
                    cLastState.articulosCarro.splice(index, 1);

                }
            });
            carrito.setState({ articulosCarro: cLastState.articulosCarro });
            carrito.setState({ estadoCarro: contarItemsCarrito() });
            localStorage.setItem('articulosCarro', JSON.stringify(carrito.getState()));
        }

    }
    if (e.target.id == "btn_pagar") {
        let timerInterval;
        Swal.fire({
            title: "Gracias por su compra!",
            html: "Su pedido llegara en 5 dias habiles o menos.",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();

            },
            willClose: () => {
                clearInterval(timerInterval);
                registrarCompra();

            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });

    }

    if (e.target.className === "cross") {

        $graciasCompraPantalla.style.visibility = "hidden";
        document.body.style.overflow = "auto";
    }

    if (e.target.id === "btn_vaciar") {
        vaciarCarrito();
    }

    if (e.target.id === "categorias") {
        $categoriasIl.style.height = "auto";
        $categoriasIl.style.padding = "0.5rem 0.75rem";
        $categoriasIl.style.transition = " ease 0.2s"
    } else {
        $categoriasIl.style.height = "0px";
        $categoriasIl.style.padding = "0";
    }

    if (categorias.getState().listaArticulos.includes(e.target.id)) {
        const lastState = listaArticulosCompleta;
        const filterItems = lastState.listaArticulos.filter(element => element.categoria == e.target.id);
        mainArticulos.setState({ listaArticulos: filterItems });
    }

    if (e.target.id === "todo") {
        console.log(listaArticulosCompleta.listaArticulos);
        mainArticulos.setState({ listaArticulos: listaArticulosCompleta.listaArticulos });
    }
    if(e.target.id === "borrar-historial"){
        borrarHistorial();
    }
});



const contarItemsCarrito = function () {
    const carroTmp = carrito.getState();
    let totalItem = 0;
    let totalPrice = 0;
    carroTmp.articulosCarro.forEach(item => {
        totalItem += item.cantidadCarro;
        totalPrice += item.precio * item.cantidadCarro;

    })
    return {
        cantidadArticulos: totalItem,
        precioTotal: totalPrice.toFixed(2),
    };
}

const vaciarCarrito = function () {
    carrito.setState({
        articulosCarro: [],
        estadoCarro: {
            cantidadArticulos: 0,
            precioTotal: 0,
        }
    });
    localStorage.setItem('articulosCarro', JSON.stringify(carrito.getState()));
}

const registrarCompra = function () {
    //Obtener estado del carrito de compras
    const miCarro = carrito.getState()
    //Obtener la fecha actual
    const fechaActual = new Date();
    const registro = {
        carrito: miCarro,
        fecha: fechaActual,
    }
    //Hacer push de  datos a archivo registros.json
    fetch("http://localhost:3000/registros", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro),
    })
        .then((res) => {
            return res.ok ? res.json() : Promise.reject(res);
        }
        )
        .then((data) => {

            console.log(data)
        })
        .catch((error) => { console.log("NOOO MI COMPA", error) });

}

const borrarHistorial = function(){
    const registros = historial.getState();
    registros.registros.forEach((item) => {

        fetch(`http://localhost:3000/registros/${item.id}`, {
            method: 'DELETE'
        })
        .catch((error) => { console.log("Error borrar historial", error) });
    }
        
    )

}
const leerHistorial = function () {
    fetch("./json/db.json", {
    })
        .then((res) => {
            return res.ok ? res.json() : Promise.reject(res);
        })
        .then((data) => {
            historial.setState({ registros: data.registros });
            console.log(data.registros);
        })
        .catch(err => console.log("Archivo Registro: ", err))
}


