import { Component } from "./Components.js";
export {mainArticulos, carrito, categorias, historial}
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