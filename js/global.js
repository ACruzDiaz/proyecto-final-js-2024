let cLastState;
let categoriasList = [];
const d = document,
    jsonURL = './json/articulos.json';
    const $graciasCompraPantalla = d.getElementById("compra-exitosa"),
    $pagar = d.getElementById("btn-pagar"),
    $botonAgregar = d.querySelector(".btn-agregar"),
    $categoriasIl = d.getElementById("categorias-element");