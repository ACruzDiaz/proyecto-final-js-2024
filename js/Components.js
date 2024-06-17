const Component = (function (){

    const Constructor = function(options){
        this.el = options.el; //El es Elemento contenedor de nuestro template
        this.data = options.data; //Data es el estado local del componente
        this.template = options.template; //El template es el codigo HTML que genera el componente
    };

  //Agregamos los métodos al prototipo del constructor del componente

  //Render UI
    Constructor.prototype.render = function(){
        const $el = document.querySelector(this.el);
        if(!$el) return;
        $el.innerHTML = this.template(this.data);
        //console.log(this.data);
    };

    //Set State
    Constructor.prototype.setState = function(obj){
        for(let key in obj){
            if(this.data.hasOwnProperty(key)){
                this.data[key] = obj[key];
            }
        }
    this.render();
    }

    //get State
    Constructor.prototype.getState = function(){
        return JSON.parse(JSON.stringify(this.data));
    }

    return Constructor;
})();