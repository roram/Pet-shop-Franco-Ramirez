//FUNCIONES QUE NECESITA BOOTSTRAP PARA FORMULARIOS, LO COPIE Y PEGUE
//VALIDA FORMULARIOS
(function () {
   'use strict'
   // Fetch all the forms we want to apply custom Bootstrap validation styles to
   var forms = document.querySelectorAll('.needs-validation')
 
   // Loop over them and prevent submission
   Array.prototype.slice.call(forms)
     .forEach(function (form) {
       form.addEventListener('submit', function (event) {
         if (!form.checkValidity()) {
           event.preventDefault()
           event.stopPropagation()
         }
         form.classList.add('was-validated')
       }, false)
     })
 })()
//MUESTRA TOASTS
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl, option)
})

//LO QUE YO PROGRAME
//FUNCION PARA OBTENER DATOS
function fetchData(){
   fetch('../js/data.json') //https://apipetshop.herokuapp.com/api/articulos
   .then(response => response.json())
   .then(data => funcionPrincipal(data.response) )
}
if(document.getElementById('inicio') || document.getElementById('registro')){

}else{
   fetchData()
}

//COMPRUEBO EN QUE PÁGINA ESTOY

//FUNCION GENERAL PARA UTILIZAR LOS DATOS

function funcionPrincipal(dataRaw){

   if(document.getElementById('farmacia')){

      cargaProductos(dataRaw, document.getElementById('farmacia'), 'Medicamento')

   }else if(document.getElementById('juguetes')){

      cargaProductos(dataRaw, document.getElementById('juguetes'), 'Juguete')

   }else if(document.getElementById('articulo')){
      dataRaw.filter((dataRaw) => {
         if(dataRaw._id == localStorage.getItem("id")){
            return impArti(dataRaw, document.getElementById('articulo'))
         }
      })
   }else if(document.getElementById('carrito')){

      arrArtCarrito = JSON.parse(localStorage.getItem('idComp'))

      if(arrArtCarrito){

         //CREA LOS ELEMENTOS DEL CARRITO
         arrArtCarrito.map((art) => {
   
            var row = document.createElement('tr')
            row.classList.add('align-center')
            row.innerHTML = `
            <td class="text-center align-middle"><img class="img-fluid img-thumbnail espacio" src="${art.imgArt}" alt="Imagen de articulo"></td>
            <td class="text-center align-middle">${art.nombArt}</td>
            <td class="text-center align-middle">$ ${art.precArt}</td>
            <td class="text-center align-middle">${art.cantComp} U.</td>
            <td class="text-center align-middle">$ ${art.cantComp * art.precArt}</td>
            <td class="text-center align-middle" id="borrar"><button class="btn btn-danger">X</button></td>
            `
            document.getElementById('carrito').appendChild(row)

            document.getElementById('borrar').addEventListener('click', (e)=>{
               e.target.parentElement.parentElement.remove()
            })          
         })
      }
   }
}
//FUNCION QUE CARGA PRODUCTOS EN CADA PÁGINA
function cargaProductos(dataRaw, rowFather, tipo){
   dataRaw.map((dataRaw) =>{
      if(dataRaw.tipo == tipo){
         return crarArticulo(dataRaw, rowFather)
      }
   })
}
//CREA LAS TARJETAS DE LOS PRODUCTOS
function crarArticulo(dataRaw, rowFather){
   //DISPONIBILIDAD
   var stock = '<div class="badge"><div class="esp"></div></div>'
   //ESTO ES UN PARCHE, BUSCAR MEJOR RESOLUCION
   var border = '-'
   if(dataRaw.stock <= 5){
      stock = '<div class="badge bg-danger rounded-0 text-white">¡¡ULTIMAS UNIDADES!!</div>'
      border = 'border-danger'
   }
   const articulo = document.createElement('div')
   articulo.classList.add('col-3','py-5')

   const articuloContenedor = document.createElement('div')
   articuloContenedor.classList.add('card', border)
   
   articuloContenedor.innerHTML = `
   <img src="${dataRaw.imagen}" class="card-img-top img-thumbnail" alt="Imagen de producto">
   ${stock}
   <div class="card-body">
      <h3 class="card-title bd-highlight text-center">$ ${dataRaw.precio}</h3>
      
      <p class="card-text bd-highlight text-center"> ${dataRaw.nombre}</p> 
   </div>
   `
   const btn = document.createElement('a')
   btn.classList.add('btn', 'btn-amber-acc-4', 'rounded-0') 
   btn.setAttribute('id', dataRaw._id)
   btn.setAttribute('href', './articulo.html')
   btn.innerHTML = '+ Información'
   btn.addEventListener('click', function( ){
      
      const idProd = dataRaw._id
      localStorage.setItem('id', idProd)

   })
   articuloContenedor.appendChild(btn)
   articulo.appendChild(articuloContenedor)

   rowFather.appendChild(articulo)
}
//FUNCION PARA MOSTRAR LOS DATOS EN PAGINA ARTICULO
function impArti(dataRaw, row){

   var imgArt = document.getElementById('imgArt')
   imgArt.innerHTML = `<img class="img-fluid img-thumbnail" src="${dataRaw.imagen}" alt="Imagen de artículo">
                        <div class="mt-5">
                           <button id="compra">Agregar al carrito</button>
                           <button id="volver">Volver a la página anterior</button>
                        </div>
   `
   //CREAR BOTONES DE COMPRA DE LOS ARTÍCULOS

   const btnPrev = document.getElementById('volver')
   btnPrev.classList.add('btn','btn-primary')
   btnPrev.addEventListener('click', function(){
      history.back()
   })

   // BOTON PARA GUARDAR LA COMPRA EN CARRITO

   var objArt = {}
   var arrArti = []

   const btnComp = document.getElementById('compra')
   btnComp.classList.add('btn', 'btn-success')

   btnComp.innerText = 'Añadir al carrito'
   btnComp.setAttribute('data-bs-toggle','modal')
   btnComp.setAttribute('data-bs-target','#exampleModal')

   btnComp.addEventListener('click', function(){
      if(localStorage.getItem('idComp')){
         arrArti = JSON.parse(localStorage.getItem('idComp'))
         objArt['idComp'] = localStorage.getItem('id')
         objArt['cantComp'] = localStorage.getItem('cant')
         objArt['nombArt'] = dataRaw.nombre
         objArt['precArt'] = dataRaw.precio
         objArt['imgArt'] = dataRaw.imagen
         arrArti.push(objArt) 
         localStorage.setItem('idComp', JSON.stringify(arrArti))
      }else{
         objArt['idComp'] = localStorage.getItem('id')
         objArt['cantComp'] = localStorage.getItem('cant')
         objArt['nombArt'] = dataRaw.nombre
         objArt['precArt'] = dataRaw.precio
         objArt['imgArt'] = dataRaw.imagen
         arrArti.push(objArt)
         localStorage.setItem('idComp', JSON.stringify(arrArti))
      }
   })

   //DESCRIPCION DE LOS ARTÍCULOS
   var caracArt = document.getElementById('caracArt')
   caracArt.innerHTML =`
      <h1>${dataRaw.nombre}</h1>
      <h2>${dataRaw.tipo}</h2>
      <h2>$ ${dataRaw.precio}</h2>
      <div id="selecArt"></div>
      <p>${dataRaw.descripcion}</p>
   `
   
   var colSelec = document.getElementById('selecArt')

   var selectCont = document.createElement('select')
   selectCont.classList.add('form-select')
   selectCont.setAttribute('aria-label', 'Default', 'select', 'example')

   selectCont.addEventListener('change',() =>{
      localStorage.setItem('cant', selectCont.value) 
   })

   var defOpt = document.createElement('option')
   defOpt.setAttribute('selected','true')
   defOpt.innerText = "Cantidad de unidades"

   selectCont.appendChild(defOpt)
   var selectOpt

   for(var i = 0; i<5; i++){
      selectOpt = document.createElement('option')
      selectOpt.setAttribute('value', `${i+1}`)
      selectOpt.innerText = `${i+1} unidad`
      selectCont.appendChild(selectOpt)
   }

   colSelec.appendChild(selectCont)
   row.appendChild(imgArt)
   row.appendChild(caracArt)
}

//EL BOTON DEL CARRITO QUE SE ACTUALICE A LO ÚLTIMO
var contarProd = document.getElementById('cantProd')
var cantProd = JSON.parse(localStorage.getItem('idComp'))
if(cantProd){
   contarProd.innerHTML = `<i class="fas fa-shopping-cart"></i> ${cantProd.length}`
}else{
   contarProd.innerHTML = `<i class="fas fa-shopping-cart"></i> 0`
}

