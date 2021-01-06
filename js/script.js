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
         var arrCarrito = dataRaw.filter((art) =>{
            for(var i = 0; i < arrArtCarrito.length; i++){
               if(art._id == arrArtCarrito[i].idComp){
                  return art
               }
            }
         })
         //CREA LOS ELEMENTOS DEL CARRITO
         arrCarrito.map((art) => {
   
            var row = document.createElement('tr')
            row.classList.add('align-center')
            row.innerHTML = `
            <td class="text-center align-middle"><img class="img-fluid img-thumbnail" src="${art.imagen}" alt="Imagen de articulo"></td>
            <td class="text-center align-middle">${art.nombre}</td>
            <td class="text-center align-middle fw-bold">$ ${art.precio}</td>
            `
            var tdEli = document.createElement('td')
            tdEli.classList.add('text-center', 'align-middle', 'col-1')
   
            var btnEli = document.createElement('button')
            btnEli.classList.add('btn', 'btn-danger')
            btnEli.innerText = 'X'
            btnEli.addEventListener('click', function(){
               btnEli.parentElement.parentElement.remove()
            })
   
            tdEli.appendChild(btnEli)
            row.appendChild(tdEli)
            document.getElementById('carrito').appendChild(row)
         })
   
         var btnCompra = document.getElementById('compra')
         var btnCancCompra = document.getElementById('cancCompra')
   
         btnCompra.addEventListener('click', function(){
            localStorage.clear();
         })
   
         btnCancCompra.addEventListener('click', function(){
            localStorage.clear();
         })
   
         var cantidadProducCarrito = document.getElementById('cantProd')
         cantidadProducCarrito.innerHTML = `<i class="fas fa-shopping-cart"></i> ${arrArtCarrito.length}`

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
   const articuloDet = document.createElement('div')
   articuloDet.classList.add('row')

   //CREO ELEMENTO PARA ELEGIR LA CANTIDAD DE PRODUCTOS DEPENDIENDO DEL STOCK
   var cantProd = document.createElement('select')
   cantProd.classList.add('form-select')
   cantProd.setAttribute('aria-label', 'Default select')
   
   var optDef = document.createElement('option')
   optDef.text = " - "
   cantProd.appendChild(optDef)

   var optVar = document.createElement('option')
   var cont = 1
   for(var i = 0; i < dataRaw.stock; i++){
      optVar.text = cont
      cantProd.appendChild(optVar)
      cont++
   }
   
   articuloDet.innerHTML =`
      <div class="col-12">
         <div class="row justify-content-center py-5">
            <div class="col-5">
               <img class="img-fluid img-thumbnail" src="${dataRaw.imagen}" alt="Imagen de artículo">
            </div>
            <div class="col-4">
               <h1>${dataRaw.nombre}</h1>
               <h2>${dataRaw.tipo}</h2>
               <h2>
                  <div class="dropdown">
                     <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                     Cantidad de articulos
                     </button>
                     <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                     <li><a class="dropdown-item" href="#">1</a></li>
                     <li><a class="dropdown-item" href="#">2</a></li>
                     <li><a class="dropdown-item" href="#">3</a></li>
                     </ul>
                  </div>
               </h2>
               <h2>$ ${dataRaw.precio}</h2>
            </div>
         </div>
      </div>
      <div class="col-12 py-2">
         <p>${dataRaw.descripcion}</p>
      </div>
   `

   // <div class="dropdown">
   //    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
   //       Dropdown button
   //    </button>
   //    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
   //       <li><a class="dropdown-item" href="#">Action</a></li>
   //       <li><a class="dropdown-item" href="#">Another action</a></li>
   //       <li><a class="dropdown-item" href="#">Something else here</a></li>
   //    </ul>
   // </div>


   //BOTON PARA VOLVER ATRAS
   const divButt = document.createElement('div')
   divButt.classList.add('col-12','pb-5')

   const btnPrev = document.createElement('a')
   btnPrev.classList.add('btn','btn-primary' ,'mx-1')
   btnPrev.setAttribute('type','button')
   btnPrev.setAttribute('data-bs-toggle','modal')
   btnPrev.setAttribute('data-bs-target','#exampleModal')
   btnPrev.innerText = 'Volver al sitio anterior'

   btnPrev.addEventListener('click', function(){
      history.back()
   })

   var objArt = {}
   var arrArti = []

   //BOTON PARA GUARDAR LA COMPRA
   const btnComp = document.createElement('a')
   btnComp.classList.add('btn', 'btn-success','ms-1')
   btnComp.setAttribute('type','button')
   btnComp.innerText = 'Añadir al carrito'
   btnComp.addEventListener('click', function(){
      
      if(localStorage.getItem('idComp')){
         arrArti = JSON.parse(localStorage.getItem('idComp'))
         objArt['idComp'] = localStorage.getItem('id')
         arrArti.push(objArt) 
         localStorage.setItem('idComp', JSON.stringify(arrArti))
      }else{
         objArt['idComp'] = localStorage.getItem('id')
         arrArti.push(objArt)
         localStorage.setItem('idComp', JSON.stringify(arrArti))
      }
      alert("Articulo agregado al carrito.")
   })
   divButt.appendChild(btnComp)
   divButt.appendChild(btnPrev)
   articuloDet.appendChild(divButt)
   row.appendChild(articuloDet)
}

//EL BOTON DEL CARRITO QUE SE ACTUALICE A LO ÚLTIMO
var contarProd = document.getElementById('cantProd')
var cantProd = JSON.parse(localStorage.getItem('idComp'))
if(cantProd){
   contarProd.innerHTML = `<i class="fas fa-shopping-cart"></i> ${cantProd.length}`
}else{
   contarProd.innerHTML = `<i class="fas fa-shopping-cart"></i> 0`
}

