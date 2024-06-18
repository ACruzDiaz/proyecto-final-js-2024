
let cLastState;
const d = document,
    jsonURL = './json/articulos.json';
    const $graciasCompraPantalla = d.getElementById("compra-exitosa"),
    $pagar = d.getElementById("btn-pagar");
const mainArticulos = new Component({
    el: "#catalogo",
    data: {
        listaArticulos:[]
    },
    template: function(props){
        if(props.listaArticulos.length < 1){
            return '<p>No hay productos en existencia</p>'
        }
    
        let templateItems = props.listaArticulos.map(item =>`<div id = "${item.sku}"class ="articulo-tienda">
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
        estadoCarro:{cantidadArticulos:0,
                    precioTotal: 0,
        }
    },
    template: function(props){
        if(props.articulosCarro.length < 1){
            return '<p>Aun no hay productos en el carrito</p>'
        }
    
        let templateItems = props.articulosCarro.map(item =>`<div id = "${item.sku}"class ="articulo-carro">
            <img src="${item.imagen}" alt="${item.descripcion}">
            <h2>${item.nombre}</h2>
            <p>${item.cantidadCarro}</p>
            <p class='price'>$${item.precio}</p>
            <button class="btn-eliminar"type="submit">Eliminar</button>
            </div>`).join("");
        let templeteEstadoCarro = `<section>
            <p>Articulos en el carro: ${props.estadoCarro.cantidadArticulos}</p>
            <p>Total: $${props.estadoCarro.precioTotal}</p>
            <button id="btn_pagar" type="submit">Pagar</button>
            </section>
            `
        templateItems += templeteEstadoCarro;
        return templateItems;
    }
});


d.addEventListener('DOMContentLoaded', e => {
    fetch(jsonURL, {

    }).then((res) =>{
        return res.ok ? res.json() : Promise.reject(res);
    }).then((jsonres) => {
        const lastState = mainArticulos.getState();

        jsonres.articulos.forEach(element => {
            lastState.listaArticulos.push(element);    
        });
        mainArticulos.setState({listaArticulos: lastState.listaArticulos});
        carrito.setState(JSON.parse(localStorage.getItem('articulosCarro')));
    }).catch((err) => {
        console.log("Error al cargar el archivo JSON: ", err)
    })


});

const $botonAgregar = d.querySelector(".btn-agregar");
d.addEventListener('click', e => {
    
    if(e.target.className === 'btn-agregar'){
        e.preventDefault();
        cLastState = carrito.getState();
        console.log("getStateCart: ", cLastState);
        const sku = e.target.parentElement.id;
        console.log("SKU:" , sku)
        const articulo = mainArticulos.getState();
        console.log("getStateMain: ", articulo);
        for (const key in articulo.listaArticulos) {
            if (articulo.listaArticulos[key].sku == sku) {
                
                const cartItem = cLastState.articulosCarro.find(p => p.sku === sku);
                if(!cartItem){
                    articulo.listaArticulos[key].cantidadCarro = 1;
                    cLastState.articulosCarro.push(articulo.listaArticulos[key]);
                }else{
                    cLastState.articulosCarro.find(p => {
                        if(p.sku === sku){
                            p.cantidadCarro++;
                        }
                    }
                    );
                }
                break;

            }
        }
        
        carrito.setState({articulosCarro: cLastState.articulosCarro});
        carrito.setState({estadoCarro: contarItemsCarrito()});
        localStorage.setItem('articulosCarro', JSON.stringify(carrito.getState()));
        console.log(cLastState)
    }
    
    if(e.target.className === "btn-eliminar"){
        e.preventDefault();
        cLastState = carrito.getState();
        const IDcart = e.target.parentElement.id;
        const foundedItem = cLastState.articulosCarro.find(p => p.sku === IDcart);
        if(!foundedItem){
            return;
        }else{
            console.log("Antes", cLastState.articulosCarro);
            cLastState.articulosCarro.find(p=>{
                if(p?.sku === IDcart){
                    const index = cLastState.articulosCarro.indexOf(p);
                    //console.log(index)
                    cLastState.articulosCarro.splice(index, 1);
                    console.log('Despues',cLastState.articulosCarro);
                    
                }
            });
            carrito.setState({articulosCarro: cLastState.articulosCarro});
            carrito.setState({estadoCarro: contarItemsCarrito()});
            localStorage.setItem('articulosCarro', JSON.stringify(carrito.getState()));
            console.log(contarItemsCarrito());
        }
        
    }
    if(e.target.id == "btn_pagar"){
        $graciasCompraPantalla.style.visibility = "visible";
        document.body.style.overflow = "hidden";
    }

    if(e.target.className === "cross"){
        
        $graciasCompraPantalla.style.visibility = "hidden";
        document.body.style.overflow = "auto";
    }

});



const contarItemsCarrito = function(){
    const carroTmp = carrito.getState();
    let totalItem = 0;
    let totalPrice = 0;
    carroTmp.articulosCarro.forEach(item => {
        totalItem += item.cantidadCarro;
        totalPrice += item.precio * item.cantidadCarro;
        
    })
    return {cantidadArticulos: totalItem,
            precioTotal : totalPrice.toFixed(2),
    };  
}

const pagarCarrito = function(){

}